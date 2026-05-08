// -Path: "cli/src/command/function/structure/structureConfig.ts"
import chalk from 'chalk';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as yaml from 'js-yaml';
import { FileNode } from '../../../types/file';
import StructureFile from './StructureFile';
import { TccConfigJson } from '../../../types/config';
import { StructureData, WorkSpace } from '../../../types/structure';

export default class StructureManager {
    public basePath: string = '.';
    private configJson: TccConfigJson;
    private structureData: StructureData | null = null;

    constructor(configJson: TccConfigJson) {
        this.configJson = configJson;
    }

    getPath(targetPath: string): string {
        const { render } = this.configJson;
        const structurePath: string[] = render?.structurePath
            ? [render?.structurePath]
            : [targetPath, 'teachoco-dev.yaml'];
        this.basePath = this.configJson.render?.basePath ?? targetPath;
        const teachocoDevPath = path.join(process.cwd(), ...structurePath);
        return teachocoDevPath;
    }

    async getData(structurePath: string): Promise<StructureData> {
        const teachocoDevPath = this.getPath(structurePath);
        const structureContent = await fs.readFile(teachocoDevPath, 'utf8');
        console.log(chalk.green(`🦴 Reading structure from ${teachocoDevPath}`));
        if (teachocoDevPath.endsWith('.yaml') || teachocoDevPath.endsWith('.yml'))
            return this.setData(yaml.load(structureContent) as StructureData);
        else if (teachocoDevPath.endsWith('.json'))
            return this.setData(JSON.parse(structureContent) as StructureData);
        throw new Error('Structure file must be a YAML or JSON file');
    }

    setData(data: StructureData) {
        this.structureData = data;
        return this.structureData;
    }

    getRootPath(workspace: WorkSpace): string {
        return path.join(process.cwd(), this.basePath, workspace.name);
    }

    async createRoot(workspace: WorkSpace, force?: boolean): Promise<FileNode[]> {
        if (!workspace) throw new Error('Workspace data not found');
        if (!workspace.name || !workspace.src)
            throw new Error("Invalid workspace data: 'name' and 'src' are required");

        const rootPath = this.getRootPath(workspace);
        console.log(chalk.green(`📁 Creating root directory: ${rootPath}`));

        await fs.ensureDir(rootPath);

        if (force) await fs.emptyDir(rootPath);

        return workspace.src;
    }

    /**
     * Create files and folders from a FileNode
     * @param node The file or folder node to create
     * @param basePath The base path to create the node in (defaults to this.basePath)
     */
    async createFiles(node: FileNode, basePath: string, force: boolean = false): Promise<void> {
        const currentPath = path.join(basePath, node.name);
        const structureFile = new StructureFile(currentPath, node, force);
        await structureFile.render();

        // if (node.type === 'folder') {
        //     await fs.ensureDir(currentPath);
        //     if (node.children) {
        //         for (const child of node.children) {
        //             await this.createFile(child, currentPath);
        //         }
        //     }
        // } else {
        //     let content = '';
        //     let ext = node.type;

        //     if (node.code && node.code.length > 0) {
        //         content = node.code.join('\n');
        //     }

        //     const supportedTypes = ['folder', 'ts', 'tsx', 'png'];
        //     if (!supportedTypes.includes(node.type)) {
        //         throw new Error(`Unsupported file type: ${node.type}`);
        //     }

        //     switch (node.type) {
        //         case 'ts':
        //         case 'tsx':
        //             ext = `.${node.type}`;
        //             break;
        //         case 'png':
        //             content = node.code?.[0] || '';
        //             // TODO: เพิ่มการจัดการไฟล์ภาพ เช่น แปลง base64 หรือคัดลอกไฟล์
        //             break;
        //     }

        //     await fs.writeFile(`${currentPath}${ext}`, content);
        // }
    }
}
