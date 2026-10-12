// -Path: "cli/src/command/function/check/Check.ts"
import fs from 'fs-extra';
import Lint from './Lint';
import chalk from 'chalk';
import path from 'node:path';
import Format from './Format';
import ActionConfig from '../config/ActionConfig';

export default class Check extends ActionConfig {
    async directory(dirPath: string): Promise<void> {
        let files: string[];

        try {
            files = await fs.readdir(dirPath);
        } catch (error) {
            console.error(chalk.red(`❌ Failed to read directory ${dirPath}`));
            console.error(
                chalk.red(`   Reason: ${error instanceof Error ? error.message : String(error)}`),
            );
            return;
        }

        const exclude = this.tccConfig.exclude ?? [];

        for (const file of files) {
            const filePath = path.join(dirPath, file);
            let stat: fs.Stats;

            try {
                stat = await fs.stat(filePath);
            } catch (error) {
                console.error(chalk.red(`❌ Failed to open file ${filePath}`));
                console.error(
                    chalk.red(
                        `   Reason: ${error instanceof Error ? error.message : String(error)}`,
                    ),
                );
                continue;
            }

            if (stat.isDirectory()) await this.directory(filePath);
            else if (stat.isFile()) {
                const isExcluded = exclude.some((excludePath) => filePath.includes(excludePath));

                if (!isExcluded) await this.file(filePath);
            }
        }
    }

    async file(filePath: string): Promise<void> {
        const format = new Format(this.tccConfig);
        const lint = new Lint(this.tccConfig);

        try {
            const code = await fs.readFile(filePath, 'utf8');
            const formatted = await format.file(filePath, code);

            if (formatted !== code) {
                await fs.writeFile(filePath, formatted, 'utf8');
                console.log(chalk.green(`   ✅ Formatted`));
            }
        } catch (error) {
            console.error(chalk.red(`   ❌ Format failed: ${error}`));
        }

        await lint.file(filePath);
    }
}
