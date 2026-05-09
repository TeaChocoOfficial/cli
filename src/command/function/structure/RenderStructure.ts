// -Path: "cli/src/command/function/structure/structureConfig.ts"
import fs from 'fs-extra';
import chalk from 'chalk';
import yaml from 'js-yaml';
import path from 'node:path';
import RenderFile from './RenderFile';
import { RenderOptions } from '../../render';
import { FileNode } from '../../types/structure/file';
import { TccConfigJson } from '../../types/config/config';
import { StructureData, WorkSpace } from '../../types/structure/structure';

export default class RenderStructure {
    public basePath: string = '.';
    private structureData: StructureData | null = null;

    constructor(private tccConfig: TccConfigJson) {}

    async render(targetPath: string, options: RenderOptions) {
        const isForce: boolean = options.force ?? this.tccConfig.render?.force ?? false;

        try {
            const data = await this.getData(targetPath);

            const workspacesToRender = options.name
                ? data.workspaces.filter((ws) => ws.name === options.name)
                : data.workspaces;

            if (workspacesToRender.length === 0)
                return console.log(chalk.yellow(`No workspace found with name: ${options.name}`));

            for (const workspace of workspacesToRender) {
                const src = await this.createRoot(workspace, isForce);

                for (const node of src) {
                    const rootPath = this.getRootPath(workspace);
                    await this.createFiles(node, rootPath, isForce);
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

    getPath(targetPath: string): string {
        const { render } = this.tccConfig;
        const structurePath: string[] = render?.structurePath
            ? [render?.structurePath]
            : [targetPath, 'teachoco-dev.yaml'];
        this.basePath = this.tccConfig.render?.basePath ?? targetPath;
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
        const renderFile = new RenderFile(currentPath, node, force);
        await renderFile.render();
    }
}
