// -Path: "cli/src/command/init.ts"
import chalk from 'chalk';
import * as path from 'path';
import * as fs from 'fs-extra';
import { program } from 'commander';
import { TccConfigJson } from './types/config';

program
    .command('init')
    .argument('[path]', 'path to create config file')
    .description('Create a default tcc.config.json in the current directory')
    .option('-f, --force', 'overwrite existing config file')
    .action(async (targetPath?: string, options: { force?: boolean } = {}) => {
        const configPath = path.resolve(process.cwd(), targetPath || '.', 'tcc.config.json');

        if (await fs.pathExists(configPath)) {
            console.log(chalk.yellow(`⚠ tcc.config.json already exists at ${configPath}`));
            if (!options.force) {
                console.log(chalk.yellow('Use --force to overwrite'));
                return;
            }
            console.log(chalk.yellow('Overwriting existing config file...'));
        }

        const defaultConfig: TccConfigJson = {
            $schema:
                'https://raw.githubusercontent.com/TeaChocoOfficial/cli/main/tcc.config.schema.json',
            format: {
                commentPath: true,
                prettier: {
                    semicolon: true,
                    singleQuote: false,
                    tabWidth: 4,
                    trailingComma: 'all',
                    printWidth: 80,
                },
            },
            render: {
                force: true,
            },
            exclude: ['node_modules', 'dist', '.git'],
        };

        await fs.writeJson(configPath, defaultConfig, { spaces: 2 });
        console.log(chalk.green(`✅ Created tcc.config.json at ${configPath}`));
    });
