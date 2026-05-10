// -Path: "cli/src/command/function/Actions.ts"
import fs from 'fs-extra';
import chalk from 'chalk';
import path from 'node:path';
import Lint from './check/Lint';
import chokidar from 'chokidar';
import Check from './check/Check';
import Format from './check/Format';
import { MakeOptions } from '../make';
import { RenderOptions } from '../render';
import getConfig from './config/getConfig';
import defaultConfig from './config/defaultConfig';
import findConfigJson from './config/findConfigJson';
import MakeStructure from './structure/MakeStructure';
import RenderStructure from './structure/RenderStructure';

export default class Actions {
    static async init(targetPath?: string, options: { force?: boolean } = {}) {
        const configPath = path.resolve(process.cwd(), targetPath ?? '.', 'tcc.config.json');

        if (await fs.pathExists(configPath)) {
            console.log(chalk.yellow(`⚠ tcc.config.json already exists at ${configPath}`));
            if (!options.force) return console.log(chalk.yellow('Use --force to overwrite'));
            console.log(chalk.yellow('Overwriting existing config file...'));
        }

        await fs.writeJson(configPath, defaultConfig, { spaces: 4 });
        console.log(chalk.green(`✅ Created tcc.config.json at ${configPath}`));
    }

    static async find(targetPath?: string) {
        const fullPath = path.resolve(process.cwd(), targetPath ?? '.');
        console.log(chalk.green(`Finding files in ${fullPath}`));
        const configJson = await findConfigJson(fullPath);
        console.log(chalk.gray(JSON.stringify(configJson, null, 2)));
    }

    static async make(targetPath: string, options: MakeOptions) {
        const fullPath = path.resolve(process.cwd(), targetPath);
        const configJson = await getConfig(targetPath, { make: options });
        const makeStructure = new MakeStructure(configJson);
        await makeStructure.make(fullPath);
    }

    static async render(targetPath: string, options: RenderOptions) {
        const fullPath = path.resolve(process.cwd(), targetPath);
        const configJson = await getConfig(targetPath, {
            render: options,
        });
        const renderStructure = new RenderStructure(configJson);
        // Run once
        await renderStructure.render(targetPath);

        // If --watch option is provided
        if (options.watch) {
            console.log(` 🚀 Watching for changes in ${fullPath}...`);
            const yamlFilePath = path.resolve(process.cwd(), fullPath);

            // Use chokidar to detect changes
            const watcher = chokidar.watch(yamlFilePath, {
                persistent: true,
                ignoreInitial: false,
            });

            watcher.on('change', async (filePath) => {
                console.log(` 📝 File ${filePath} changed, re-rendering...`);
                await renderStructure.render(targetPath);
            });

            // Handle watcher errors
            watcher.on('error', (error) => console.error(' 🚨 Watcher error:', error));
        }
    }

    static async lint(targetPath: string, options: { watch?: boolean }) {
        const fullPath = path.resolve(process.cwd(), targetPath);
        const configJson = await getConfig(fullPath, {
            lint: { watch: options.watch },
        });

        const lint = new Lint(configJson);

        if (configJson.lint?.watch) {
            await lint.directory(fullPath);

            console.log(chalk.blue.bold(`\n👀 Watching for changes in ${fullPath}\\...`));
            const watcher = chokidar.watch(fullPath, {
                persistent: true,
                ignoreInitial: false,
            });

            watcher.on('change', async (filePath) => {
                const ext = path.extname(filePath);

                const isExcluded = configJson.exclude?.some((excludePath) =>
                    filePath.includes(excludePath),
                );

                if (lint.supportedExtensions.includes(ext) && !isExcluded)
                    await lint.file(filePath);
            });

            watcher.on('error', (error) => console.error(chalk.red(`❌ Watcher error: ${error}`)));
        } else {
            console.log(chalk.blue.bold(`🔍 Linting code in ${fullPath}\\...\n`));
            await lint.directory(fullPath);
            console.log(chalk.green.bold(`\n✅ Done linting code in ${fullPath}\\`));
        }
    }

    static async format(targetPath: string, options: { watch?: boolean; log?: boolean }) {
        const fullPath = path.resolve(process.cwd(), targetPath);
        const configJson = await getConfig(fullPath, {
            format: { watch: options.watch, log: options.log },
        });

        const format = new Format(configJson);

        if (configJson.format?.watch) {
            await format.directory(fullPath);

            console.log(chalk.blue.bold(`👀 Watching for changes in ${fullPath}\\...`));
            const watcher = chokidar.watch(fullPath, {
                persistent: true,
                ignoreInitial: false,
            });

            watcher.on('change', async (filePath) => {
                const ext = path.extname(filePath);

                const isExcluded = configJson.exclude?.some((excludePath) =>
                    filePath.includes(excludePath),
                );

                if (format.supportedExtensions.includes(ext) && !isExcluded) {
                    const code = await fs.readFile(filePath, 'utf8');
                    const formatted = await format.file(filePath, code);

                    if (formatted !== code) {
                        await fs.writeFile(filePath, formatted, 'utf8');
                        console.log(chalk.green(`✅ Formatted: ${filePath}`));
                    }
                }
            });

            watcher.on('error', (error) => console.error(chalk.red(`❌ Watcher error: ${error}`)));
        } else {
            console.log(chalk.blue.bold(`🔨 Formatting code in ${fullPath}\\...`));
            await format.directory(fullPath);
            console.log(chalk.green.bold(`✅ Done formatting code in ${fullPath}\\`));
        }
    }

    static async check(targetPath: string, options: { watch?: boolean }) {
        const fullPath = path.resolve(process.cwd(), targetPath);
        const configJson = await getConfig(fullPath, {
            format: { watch: options.watch },
            lint: { watch: options.watch },
        });

        const check = new Check(configJson);

        if (configJson.format?.watch || configJson.lint?.watch) {
            await check.directory(fullPath);

            console.log(chalk.blue.bold(`\n👀 Watching for changes in ${fullPath}\\...`));
            const watcher = chokidar.watch(fullPath, {
                persistent: true,
                ignoreInitial: false,
            });

            watcher.on('change', async (filePath) => {
                const isExcluded = configJson.exclude?.some((excludePath) =>
                    filePath.includes(excludePath),
                );

                if (!isExcluded) await check.file(filePath);
            });

            watcher.on('error', (error) => console.error(chalk.red(`❌ Watcher error: ${error}`)));
        } else {
            console.log(chalk.blue.bold(`🔍 Checking code in ${fullPath}\\...\n`));
            await check.directory(fullPath);
            console.log(chalk.green.bold(`\n✅ Done checking code in ${fullPath}\\`));
        }
    }
}
