// -Path: "cli/src/command/function/structure/RenderFile.ts"
import fs from 'fs-extra';
import chalk from 'chalk';
import path from 'node:path';
import { FileNode } from '../../types/structure/file';

export default class RenderFile {
    constructor(
        private currentPath: string,
        private node: FileNode,
        private force: boolean = false,
    ) {}

    async render(node?: FileNode, basePath?: string) {
        const fileNode = node ?? this.node;
        const currentPath = basePath ? path.join(basePath, fileNode.name) : this.currentPath;
        console.log(chalk.cyan(`\n📁 Render ${currentPath}`));
        if (fileNode.type === 'folder') await this.createFolder(currentPath, fileNode);
        else
            try {
                const parentPath = basePath ?? path.dirname(this.currentPath);
                await this.createFile(fileNode, parentPath);
            } catch (error) {
                console.error(chalk.red(`❌ Failed to create file ${currentPath}: ${error}`));
            }
    }

    async createFolder(currentPath: string, node: FileNode) {
        const exists = await fs.pathExists(currentPath);

        if (!exists) {
            console.log(chalk.yellow(`📁 Create folder ${currentPath}`));
            await fs.ensureDir(currentPath);
        }

        if (node.children) {
            for (const child of node.children) {
                await this.render(child, currentPath);
            }
        }
    }

    async createFile(child: FileNode, currentPath: string) {
        const filePath = path.join(currentPath, child.name);

        const content = child.code?.join('\n') ?? '';

        const fileFullPath = `${filePath}.${child.type}`;
        const exists = await fs.pathExists(fileFullPath);

        if (exists) {
            const existing = await fs.readFile(fileFullPath, 'utf8');

            if (existing !== content) {
                await fs.writeFile(fileFullPath, content);
                console.log(chalk.hex('#ffaa00')(`📄 Update file ${fileFullPath}`));
            } else console.log(chalk.gray(`📄 Skip file ${fileFullPath} (no changes)`));
        } else {
            await fs.writeFile(fileFullPath, content);
            console.log(chalk.cyan(`📄 Create file ${fileFullPath}`));
        }
    }
}
