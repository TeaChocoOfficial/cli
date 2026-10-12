// -Path: "cli/src/command/function/Actions.ts"
import fs from 'fs-extra';
import chalk from 'chalk';
import path from 'node:path';
import Dev from './server/Dev';
import Lint from './check/Lint';
import Check from './check/Check';
import Watching from './Watching';
import Format from './check/Format';
import getConfig from './config/getConfig';
import readline from 'node:readline/promises';
import defaultConfig from './config/defaultConfig';
import findConfigJson from './config/findConfigJson';

export default class Actions {
    static async init(targetPath?: string, options: { force?: boolean } = {}) {
        const configPath = path.resolve(process.cwd(), targetPath ?? '.', 'tcc.config.json');
        const dirPath = path.dirname(configPath);

        if (!(await fs.pathExists(dirPath))) {
            const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
            const answer = await rl.question(
                chalk.yellow(`⚠ Directory ${dirPath} does not exist. Create it? (y/n) `),
            );
            rl.close();

            if (!['y', 'yes'].includes(answer.trim().toLowerCase())) {
                console.log(chalk.gray('Cancelled.'));
                return;
            }

            await fs.ensureDir(dirPath);
        }

        if (await fs.pathExists(configPath)) {
            console.log(chalk.yellow(`⚠ tcc.config.json already exists at ${configPath}`));
            if (!options.force) return console.log(chalk.yellow('Use --force to overwrite'));
            console.log(chalk.yellow('Overwriting existing config file...'));
        }

        try {
            await fs.writeJson(configPath, defaultConfig, { spaces: 4 });
            console.log(chalk.green(`✅ Created tcc.config.json at ${configPath}`));
        } catch (error) {
            console.error(chalk.red(`❌ Failed to create tcc.config.json at ${configPath}`));
            console.error(
                chalk.red(`   Reason: ${error instanceof Error ? error.message : String(error)}`),
            );
        }
    }

    static async find(targetPath?: string) {
        const fullPath = path.resolve(process.cwd(), targetPath ?? '.');
        console.log(chalk.green(`Finding files in ${fullPath}`));
        const configJson = await findConfigJson(fullPath);
        console.log(chalk.gray(JSON.stringify(configJson, null, 2)));
    }

    static async dev(targetPath: string, options?: { port?: number; host?: string }) {
        const fullPath = path.resolve(process.cwd(), targetPath);
        const configJson = await getConfig(fullPath, { server: options });

        const dev = new Dev(configJson);
        await dev.listen();
    }

    static async lint(targetPath: string, options: { watch?: boolean }) {
        const fullPath = path.resolve(process.cwd(), targetPath);
        const configJson = await getConfig(fullPath, { lint: options });

        const lint = new Lint(configJson);
        const watching = new Watching(fullPath);

        watching.once(async () => await lint.directory(fullPath));
        watching.onChange(async (filePath) => {
            const isExcluded = configJson.exclude?.some((excludePath) =>
                filePath.includes(excludePath),
            );

            if (!isExcluded) await lint.file(filePath);
        });

        watching.runing(configJson.lint?.watch);
    }

    static async format(targetPath: string, options: { watch?: boolean; log?: boolean }) {
        const fullPath = path.resolve(process.cwd(), targetPath);
        const configJson = await getConfig(fullPath, {
            format: { watch: options.watch, log: options.log },
        });

        const format = new Format(configJson);
        const watching = new Watching(fullPath);

        watching.once(async () => await format.directory(fullPath));
        watching.onChange(async (filePath) => {
            const isExcluded = configJson.exclude?.some((excludePath) =>
                filePath.includes(excludePath),
            );

            if (!isExcluded) {
                try {
                    const code = await fs.readFile(filePath, 'utf8');
                    const formatted = await format.file(filePath, code);

                    if (formatted !== code) {
                        await fs.writeFile(filePath, formatted, 'utf8');
                        console.log(chalk.green(`✅ Formatted: ${filePath}`));
                    }
                } catch (error) {
                    console.error(chalk.red(`❌ Failed to open file ${filePath}`));
                    console.error(
                        chalk.red(
                            `   Reason: ${error instanceof Error ? error.message : String(error)}`,
                        ),
                    );
                }
            }
        });

        watching.runing(configJson.format?.watch);
    }

    static async check(targetPath: string, options: { watch?: boolean }) {
        const fullPath = path.resolve(process.cwd(), targetPath);
        const configJson = await getConfig(fullPath);

        const check = new Check(configJson);
        const watching = new Watching(fullPath);

        watching.once(async () => await check.directory(fullPath));
        watching.onChange(async (filePath) => {
            const isExcluded = configJson.exclude?.some((excludePath) =>
                filePath.includes(excludePath),
            );

            if (!isExcluded) await check.file(filePath);
        });

        watching.runing(options.watch);
    }
}
