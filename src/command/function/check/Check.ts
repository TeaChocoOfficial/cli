// -Path: "cli/src/command/function/check/Check.ts"
import fs from 'fs-extra';
import Lint from './Lint';
import chalk from 'chalk';
import path from 'node:path';
import Format from './Format';
import ActionConfig from '../config/ActionConfig';

export default class Check extends ActionConfig {
    async directory(dirPath: string): Promise<void> {
        const files = await fs.readdir(dirPath);
        const exclude = this.tccConfig.exclude ?? [];
        const lintConfig = this.tccConfig.lint;
        const lintExtensions =
            lintConfig?.extensions ?? new Lint(this.tccConfig).supportedExtensions;
        const formatExtensions = new Format(this.tccConfig).supportedExtensions;
        const extensions = [...new Set([...lintExtensions, ...formatExtensions])];

        for (const file of files) {
            const filePath = path.join(dirPath, file);
            const stat = await fs.stat(filePath);

            if (stat.isDirectory()) await this.directory(filePath);
            else if (stat.isFile()) {
                const ext = path.extname(file);

                if (extensions.includes(ext)) {
                    const isExcluded = exclude.some((excludePath) =>
                        filePath.includes(excludePath),
                    );

                    if (!isExcluded) await this.file(filePath);
                }
            }
        }
    }

    async file(filePath: string): Promise<void> {
        const format = new Format(this.tccConfig);
        const lint = new Lint(this.tccConfig);
        const ext = path.extname(filePath);
        const isFormatSupported = format.supportedExtensions.includes(ext);
        const isLintSupported = lint.supportedExtensions.includes(ext);

        if (isFormatSupported) {
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
        }

        if (isLintSupported) await lint.file(filePath);
    }
}
