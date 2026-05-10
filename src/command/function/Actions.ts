// -Path: "cli/src/command/function/Actions.ts"
import fs from 'fs-extra';
import chalk from 'chalk';
import path from 'node:path';
import Lint from './check/Lint';
import Check from './check/Check';
import Watching from './Watching';
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
        const watching = new Watching(fullPath);

        watching.once(async () => await makeStructure.make(targetPath));
        watching.runing(configJson.make?.watch);
    }

    static async render(targetPath: string, options: RenderOptions) {
        const fullPath = path.resolve(process.cwd(), targetPath);
        const configJson = await getConfig(targetPath, { render: options });
        const structurePath = path.resolve(process.cwd(), fullPath);
        const renderStructure = new RenderStructure(configJson);
        const watching = new Watching(structurePath);

        watching.once(async () => await renderStructure.render(targetPath));
        watching.runing(configJson.render?.watch);
    }

    static async lint(targetPath: string, options: { watch?: boolean }) {
        const fullPath = path.resolve(process.cwd(), targetPath);
        const configJson = await getConfig(fullPath, { lint: options });

        const lint = new Lint(configJson);
        const watching = new Watching(fullPath);

        watching.once(async () => await lint.directory(fullPath));
        watching.onChange(async (filePath) => {
            const ext = path.extname(filePath);
            const isExcluded = configJson.exclude?.some((excludePath) =>
                filePath.includes(excludePath),
            );

            if (lint.supportedExtensions.includes(ext) && !isExcluded) await lint.file(filePath);
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
