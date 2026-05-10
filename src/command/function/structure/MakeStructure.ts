// -Path: "cli/src/command/function/structure/MakeStructure.ts"
import fs from 'fs-extra';
import chalk from 'chalk';
import yaml from 'js-yaml';
import path from 'node:path';
import StructureData from './StructureData';
import ActionConfig from '../config/ActionConfig';
import { FileNode } from '../../types/structure/file';
import { TccConfigJson } from '../../types/config/config';
import { StructureDataJson, WorkSpace } from '../../types/structure/structure';

export default class MakeStructure extends ActionConfig {
    private structureData: StructureData;

    constructor(tccConfig: TccConfigJson) {
        super(tccConfig);
        this.structureData = new StructureData(tccConfig);
    }

    getFileContent(filePath: string): string[] {
        try {
            const stat = fs.statSync(filePath);
            if (stat.size > 1024 * 1024) return [];

            const buffer = fs.readFileSync(filePath);
            if (buffer.includes(0)) return [];

            return buffer.toString('utf8').split('\n');
        } catch {
            return [];
        }
    }

    async make(targetPath: string): Promise<void> {
        const { make } = this.tccConfig;
        try {
            const src = await this.scanDirectory(targetPath);
            const workspace: WorkSpace = {
                name: make?.name ?? 'My Project',
                run: make?.run ?? 'echo "Starting Project"',
                pack: {},
                src,
            };

            const getStructurePath = this.structureData.getPath(
                targetPath,
                make?.basePath,
                make?.output,
            );

            console.log(chalk.green(`🔍 Scanning directory: ${getStructurePath}`));
            const data = await this.structureData.getData(getStructurePath);
            const isJson = getStructurePath?.endsWith('.json');

            if (data && !this.tccConfig.make?.force)
                return console.log(
                    chalk.yellow('\nStructure file already exists. Use --force to overwrite.'),
                );

            const structureData: StructureDataJson = {
                $schema:
                    'https://raw.githubusercontent.com/TeaChocoOfficial/cli/main/structure.schema.json',
                workspaces: data ? [...data.workspaces, workspace] : [workspace],
            };

            let content: string;
            if (isJson) content = JSON.stringify(structureData);
            else content = yaml.dump(structureData);

            await fs.writeFile(getStructurePath, content);

            console.log(chalk.green(`\n✅ Successfully generated ${getStructurePath}`));
            console.log(chalk.gray(`   Workspace name: ${workspace.name}`));
            console.log(chalk.gray(`   Files scanned: ${src.length}`));
        } catch (error) {
            console.error(
                chalk.red('Failed to generate structure:'),
                error instanceof Error ? error.message : error,
            );
            process.exit(1);
        }
    }

    async scanDirectory(dirPath: string): Promise<FileNode[]> {
        const nodes: FileNode[] = [];
        const entries = await fs.readdir(dirPath, { withFileTypes: true });
        const excludePatterns = this.tccConfig.exclude ?? [];

        for (const entry of entries) {
            if (excludePatterns.includes(entry.name)) continue;

            const fullPath = path.join(dirPath, entry.name);

            if (entry.isDirectory()) {
                const children = await this.scanDirectory(fullPath);
                nodes.push({
                    name: entry.name,
                    type: 'folder',
                    children,
                });
            } else if (entry.isFile()) {
                const ext = path.extname(entry.name).slice(1);
                nodes.push({
                    name: path.parse(entry.name).name,
                    type: ext,
                    code: this.getFileContent(fullPath),
                });
            }
        }

        return nodes;
    }
}
