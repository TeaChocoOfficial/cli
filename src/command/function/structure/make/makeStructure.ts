// -Path: "cli/src/command/function/structure/makeStructure.ts"
import chalk from 'chalk';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as yaml from 'js-yaml';
import scanDirectory from './scanDirectory';
import { TccConfigJson } from '../../../types/config';
import { StructureData, WorkSpace } from '../../../types/structure';

export default async function makeStructure(targetPath: string, tccConfig: TccConfigJson) {
    try {
        const { make } = tccConfig;
        const output = make?.output;
        if (!output || (!output.endsWith('.yml') && !output.endsWith('.yaml') && !output.endsWith('.json')))
            throw new Error('Output file must have .yaml, .yml, or .json extension');

        console.log(chalk.green(`🔍 Scanning directory: ${targetPath}`));

        const src = await scanDirectory(targetPath);

        const workspace: WorkSpace = {
            name: make?.name || 'my-workspace',
            run: make?.run || '',
            pack: {},
            src,
        };

        const structureData: StructureData = {
            $schema:
                'https://raw.githubusercontent.com/TeaChocoOfficial/cli/main/structure.schema.json',
            workspaces: [workspace],
        };

        const outputPath = path.join(process.cwd(), output);
        const yamlContent = yaml.dump(structureData, { indent: 2 });

        await fs.writeFile(outputPath, yamlContent);

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
