// -Path: "cli/src/command/function/structure/StructureFile.ts"
import chalk from 'chalk';
import * as path from 'path';
import * as fs from 'fs-extra';
import { FileNode } from '../../../types/file';

export default class StructureFile {
    private node: FileNode;
    private currentPath: string;
    private force: boolean;

    constructor(currentPath: string, node: FileNode, force: boolean = false) {
        this.node = node;
        this.currentPath = currentPath;
        this.force = force;
    }

    async render(node?: FileNode, basePath?: string) {
        const fileNode = node ?? this.node;
        const currentPath = basePath ? path.join(basePath, fileNode.name) : this.currentPath;
        console.log(chalk.gray(`\n📁 Render ${currentPath}`));
        if (fileNode.type === 'folder') {
            await this.createFolder(currentPath, fileNode);
        } else {
            await this.createFile(fileNode, basePath ?? this.currentPath);
        }
    }

    async createFolder(currentPath: string, node: FileNode) {
        const exists = await fs.pathExists(currentPath);
        if (exists && !this.force) {
            console.log(chalk.gray(`📁 Skip folder ${currentPath} (already exists)`));
        } else {
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
        let content = '';
        let ext = child.type;

        if (child.code && child.code.length > 0) {
            content = child.code.join('\n');
        }

        const supportedTypes = ['folder', 'ts', 'tsx', 'png'];
        if (!supportedTypes.includes(child.type)) {
            throw new Error(`Unsupported file type: ${child.type}`);
        }

        switch (child.type) {
            case 'ts':
            case 'tsx':
                ext = `.${child.type}`;
                break;
            case 'png':
                ext = `.${child.type}`;
                content = child.code?.[0] || '';
                break;
        }

        const fileFullPath = `${filePath}${ext}`;
        const exists = await fs.pathExists(fileFullPath);
        if (exists && !this.force) {
            console.log(chalk.redBright(`📄 Skip file ${fileFullPath} (already exists)`));
            console.log(chalk.gray(`   Tip: Use -f or --force to overwrite`));
        } else {
            await fs.writeFile(fileFullPath, content);
            console.log(chalk.cyan(`📄 Create file ${fileFullPath}`));
        }
    }
}
