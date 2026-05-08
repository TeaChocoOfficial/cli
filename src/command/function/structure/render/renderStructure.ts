// -Path: "cli/src/function/renderStructure.ts"
import chalk from 'chalk';
import { RenderOptions } from '../../../render';
import StructureConfig from './structureManager';
import { TccConfigJson } from '../../../types/config';

export default async function renderStructure(
    targetPath: string,
    configJson: TccConfigJson,
    options: RenderOptions,
): Promise<void> {
    const structureConfig = new StructureConfig(configJson);
    const isForce: boolean = options.force ?? configJson.render?.force ?? false;

    try {
        const data = await structureConfig.getData(targetPath);

        const workspacesToRender = options.name
            ? data.workspaces.filter((ws) => ws.name === options.name)
            : data.workspaces;

        if (workspacesToRender.length === 0) {
            console.log(chalk.yellow(`No workspace found with name: ${options.name}`));
            return;
        }

        for (const workspace of workspacesToRender) {
            const src = await structureConfig.createRoot(workspace, isForce);

            for (const node of src) {
                const rootPath = structureConfig.getRootPath(workspace);
                await structureConfig.createFiles(node, rootPath, isForce);
            }
        }

        console.log(
            chalk.green(
                `\n✅ Successfully created project structure at ${structureConfig.basePath}`,
            ),
        );
    } catch (error) {
        console.error(
            'Failed to render structure:',
            error instanceof Error ? error.message : error,
        );
        process.exit(1);
    }
}
