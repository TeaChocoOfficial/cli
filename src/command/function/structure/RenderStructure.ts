// -Path: "cli/src/command/function/structure/structureConfig.ts"
import fs from 'fs-extra';
import chalk from 'chalk';
import path from 'node:path';
import RenderFile from './RenderFile';
import StructureData from './StructureData';
import ActionConfig from '../config/ActionConfig';
import { FileNode } from '../../types/structure/file';
import { TccConfigJson } from '../../types/config/config';
import { WorkSpace } from '../../types/structure/structure';

export default class RenderStructure extends ActionConfig {
    private structureData: StructureData;

    constructor(tccConfig: TccConfigJson) {
        super(tccConfig);
        this.structureData = new StructureData(tccConfig);
    }

    async render(targetPath: string) {
        try {
            const { render } = this.tccConfig;
            const structurePath = this.structureData.getPath(
                targetPath,
                render?.basePath,
                render?.structurePath,
            );
            const data = await this.structureData.getData(structurePath);
            if (!data) throw new Error('Structure data not found');

            const workspacesToRender = render?.name
                ? data.workspaces.filter((ws) => render.name?.split(',').includes(ws.name))
                : data.workspaces;

            if (workspacesToRender.length === 0)
                return console.log(chalk.yellow(`No workspace found with name: ${render?.name}`));

            for (const workspace of workspacesToRender) {
                const src = await this.createRoot(workspace, render?.force);

                for (const node of src) {
                    const rootPath = this.structureData.getRootPath(workspace.name);
                    await this.createFiles(node, rootPath, render?.force);
                }
            }

            console.log(
                chalk.green(`\n✅ Successfully created project structure at ${this.basePath}`),
            );
        } catch (error) {
            console.error(
                'Failed to render structure:',
                error instanceof Error ? error.message : error,
            );
            process.exit(1);
        }
    }

    async createRoot(workspace: WorkSpace, force?: boolean): Promise<FileNode[]> {
        if (!workspace) throw new Error('Workspace data not found');
        if (!workspace.name || !workspace.src)
            throw new Error("Invalid workspace data: 'name' and 'src' are required");

        const rootPath = this.structureData.getRootPath(workspace.name);
        console.log(chalk.green(`📁 Creating root directory: ${rootPath}`));

        await fs.ensureDir(rootPath);

        return workspace.src;
    }

    /**
     * Create files and folders from a FileNode
     * @param node The file or folder node to create
     * @param basePath The base path to create the node in (defaults to this.basePath)
     */
    async createFiles(node: FileNode, basePath: string, force: boolean = false): Promise<void> {
        const currentPath = path.join(basePath, node.name);
        const renderFile = new RenderFile(currentPath, node, force);
        await renderFile.render();
    }
}
