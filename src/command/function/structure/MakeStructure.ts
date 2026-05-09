// -Path: "cli/src/command/function/structure/MakeStructure.ts"
import fs from 'fs-extra';
import chalk from 'chalk';
import yaml from 'js-yaml';
import path from 'node:path';
import { FileNode } from '../../types/structure/file';
import { TccConfigJson } from '../../types/config/config';
import { StructureData, WorkSpace } from '../../types/structure/structure';

export default class MakeStructure {
    constructor(private tccConfig: TccConfigJson) {}

    getFileContent(filePath: string): string[] {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            return content.split('\n');
        } catch {
            return [];
        }
    }

    async make(targetPath: string) {
        try {
            const { make } = this.tccConfig;
            const output = make?.output;
            const isJson = output?.endsWith('.json');
            if (!output || (!output.endsWith('.yml') && !output.endsWith('.yaml') && !isJson))
                throw new Error(
                    `Output file must have .yaml, .yml, or .json extension\nOutput: ${output}`,
                );

            console.log(chalk.green(`🔍 Scanning directory: ${targetPath}`));

            const src = await this.scanDirectory(targetPath);

            const workspace: WorkSpace = {
                name: make?.name ?? 'My Project',
                run: make?.run ?? 'echo "Starting Project"',
                pack: {},
                src,
            };

            const structureData: StructureData = {
                $schema:
                    'https://raw.githubusercontent.com/TeaChocoOfficial/cli/main/structure.schema.json',
                workspaces: [workspace],
            };

            const outputPath = path.join(targetPath, make?.basePath ?? '.', output);
            let content: string;
            if (isJson) content = JSON.stringify(structureData, null, 4);
            else content = yaml.dump(structureData, { indent: 4 });

            await fs.writeFile(outputPath, content);

            console.log(chalk.green(`\n✅ Successfully generated ${output}`));
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
                if (['ts', 'tsx', 'png', 'jpg', 'jpeg', 'svg'].includes(ext)) {
                    nodes.push({
                        name: path.parse(entry.name).name,
                        type: ext,
                        code:
                            ext !== 'png' && ext !== 'jpg' && ext !== 'jpeg' && ext !== 'svg'
                                ? this.getFileContent(fullPath)
                                : [],
                    });
                }
            }
        }

        return nodes;
    }
}
