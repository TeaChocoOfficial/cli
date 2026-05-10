// -Path: "cli/src/command/function/format/Format.ts"
import fs from 'fs-extra';
import chalk from 'chalk';
import path from 'node:path';
import * as diff from 'diff';
import prettier from 'prettier';
import FormatImport from './FormatImport';
import FormatComment from './FormatComment';
import ActionConfig from '../config/ActionConfig';

export default class Format extends ActionConfig {
    supportedExtensions = ['.ts', '.tsx', '.js', '.jsx', '.json'];

    async directory(dirPath: string): Promise<void> {
        const files = await fs.readdir(dirPath);
        const exclude = this.tccConfig.exclude ?? [];

        for (const file of files) {
            const filePath = path.join(dirPath, file);
            const stat = await fs.stat(filePath);

            if (stat.isDirectory()) await this.directory(filePath);
            else if (stat.isFile()) {
                const ext = path.extname(file);

                if (this.supportedExtensions.includes(ext)) {
                    const isExcluded = exclude.some((excludePath) =>
                        filePath.includes(excludePath),
                    );

                    if (!isExcluded) {
                        const code = await fs.readFile(filePath, 'utf8');
                        const formatted = await this.file(filePath, code);

                        if (formatted !== code) await fs.writeFile(filePath, formatted, 'utf8');
                    }
                }
            }
        }
    }

    async file(filePath: string, code: string): Promise<string> {
        try {
            const formatComment = new FormatComment(this.tccConfig);
            const formatImport = new FormatImport(this.tccConfig, filePath);
            const importSorted = formatImport.sort(code);
            const commented = formatComment.comment(filePath, importSorted);
            const afterCode = await this.prettier(filePath, commented);
            this.log(filePath, code, afterCode);

            return afterCode;
        } catch (error) {
            if (error instanceof Error && (error as Error & { code?: string }).code === 'EBUSY')
                console.error(chalk.yellow(`⚠️  File busy, skipping: ${filePath}`));
            else console.error(chalk.red(`❌ Failed to format ${filePath}: ${error}`));

            return code;
        }
    }

    async prettier(filePath: string, code: string): Promise<string> {
        const prettierConfig = this.tccConfig.format?.prettier;

        const defaultOptions: prettier.Options = {
            semi: true,
            tabWidth: 4,
            useTabs: true,
            endOfLine: 'lf',
            printWidth: 80,
            quoteProps: 'as-needed',
            singleQuote: true,
            arrowParens: 'always',
            trailingComma: 'all',
            bracketSpacing: true,
            jsxSingleQuote: true,
            bracketSameLine: false,
            htmlWhitespaceSensitivity: 'strict',
        };
        const options: prettier.Options = {
            filepath: filePath,
            semi: prettierConfig?.semicolon,
            tabWidth: prettierConfig?.tabWidth,
            useTabs: prettierConfig?.useTabs,
            endOfLine: prettierConfig?.endOfLine,
            printWidth: prettierConfig?.printWidth,
            quoteProps: prettierConfig?.quoteProps,
            singleQuote: prettierConfig?.singleQuote,
            arrowParens: prettierConfig?.arrowParens,
            trailingComma: prettierConfig?.trailingComma,
            bracketSpacing: prettierConfig?.bracketSpacing,
            jsxSingleQuote: prettierConfig?.jsxSingleQuote,
            bracketSameLine: prettierConfig?.bracketSameLine,
            htmlWhitespaceSensitivity: prettierConfig?.htmlSpace,
        };
        const prettierOptions = { ...defaultOptions, ...options };

        const formatted = await prettier.format(code, prettierOptions);
        return formatted;
    }

    log(filePath: string, code: string, afterCode: string): void {
        if (afterCode !== code) {
            const charDiff = afterCode.length - code.length;
            const diffText = charDiff > 0 ? `+${charDiff}` : `${charDiff}`;
            const diffColor = charDiff > 0 ? chalk.green : chalk.red;

            console.log(chalk.cyan(`  📝 ${filePath}`));
            console.log(chalk.gray(`     Before: ${code.length} chars`));
            console.log(
                chalk.gray(`     After:  ${afterCode.length} chars `) + diffColor(`(${diffText})`),
            );

            const changes = diff.diffLines(code, afterCode);
            changes.forEach((change: diff.Change) => {
                if (change.added) {
                    console.log(chalk.green(`     + ${change.count} lines added`));
                } else if (change.removed) {
                    console.log(chalk.red(`     - ${change.count} lines removed`));
                }
            });

            console.log('');
        }
    }
}
