// -Path: "cli/src/command/format.ts"
import chalk from 'chalk';
import * as path from 'path';
import * as fs from 'fs-extra';
import chokidar from 'chokidar';
import { program } from 'commander';
import getConfig from './function/config/getConfig';
import formatFile from './function/format/formatFile';
import formatDirectory from './function/format/formatDirectory';

program
    .command('format')
    .argument('<path>', 'path to format')
    .description('Format code (use -w or --watch for watch mode)')
    .option('-w, --watch', 'watch for changes')
    .action(async (targetPath: string, options: { watch?: boolean }) => {
        const fullPath = path.resolve(process.cwd(), targetPath);
        const configJson = await getConfig(fullPath, {
            format: { watch: options.watch },
        });

        if (configJson.format?.watch) {
            await formatDirectory(fullPath, configJson, configJson.exclude);

            console.log(chalk.blue.bold(`👀 Watching for changes in ${fullPath}\\...`));
            const watcher = chokidar.watch(fullPath, {
                persistent: true,
                ignoreInitial: false,
            });

            watcher.on('change', async (filePath) => {
                const ext = path.extname(filePath);
                const supportedExtensions = ['.ts', '.tsx', '.js', '.jsx', '.json'];

                const isExcluded = configJson.exclude?.some((excludePath) =>
                    filePath.includes(excludePath),
                );

                if (supportedExtensions.includes(ext) && !isExcluded) {
                    const code = await fs.readFile(filePath, 'utf8');
                    const formatted = await formatFile(filePath, code, configJson);

                    if (formatted !== code) {
                        await fs.writeFile(filePath, formatted, 'utf8');
                        console.log(chalk.green(`✅ Formatted: ${filePath}`));
                    }
                }
            });

            watcher.on('error', (error) => {
                console.error(chalk.red(`❌ Watcher error: ${error}`));
            });
        } else {
            console.log(chalk.blue.bold(`🔨 Formatting code in ${fullPath}\\...`));
            await formatDirectory(fullPath, configJson, configJson.exclude);
            console.log(chalk.green.bold(`✅ Done formatting code in ${fullPath}\\`));
        }
    });
