// -Path: "cli/src/command/render.ts"
import * as path from 'path';
import chokidar from 'chokidar';
import { program } from 'commander';
import getConfig from './function/config/getConfig';
import renderStructure from './function/structure/render/renderStructure';

export type RenderOptions = {
    watch?: boolean;
    name?: string;
    force?: boolean;
};

// Configure the 'render' command
program
    .command('render')
    .argument('<path>', 'path to YAML file (e.g., ./path/to/projects)')
    .description('Render folder structure from YAML file')
    .option('-w, --watch', 'watch for changes in the YAML file and re-render')
    .option('-f, --force', 'force re-render even if no changes detected')
    .option('-n, --name <name>', 'render specific workspace by name')
    .action(async (targetPath: string, options: RenderOptions) => {
        const fullPath = path.resolve(process.cwd(), targetPath);
        const configJson = await getConfig(targetPath, {
            render: { watch: options.watch },
        });
        // Run once
        await renderStructure(targetPath, configJson, options);

        // If --watch option is provided
        if (options.watch) {
            console.log(`Watching for changes in ${fullPath}...`);
            const yamlFilePath = path.resolve(process.cwd(), fullPath);

            // Use chokidar to detect changes
            const watcher = chokidar.watch(yamlFilePath, {
                persistent: true,
                ignoreInitial: false,
            });

            watcher.on('change', async (filePath) => {
                console.log(`File ${filePath} changed, re-rendering...`);
                await renderStructure(fullPath, configJson, options);
            });

            // Handle watcher errors
            watcher.on('error', (error) => {
                console.error('Watcher error:', error);
            });
        }
    });
