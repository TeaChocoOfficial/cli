// -Path: "cli/src/command/function/lint/Lint.ts"
import fs from 'fs-extra';
import chalk from 'chalk';
import path from 'node:path';
import { ESLint, Linter } from 'eslint';
import { Ary } from '../../../class/ary';
import { TccConfigJson } from '../../types/config/config';

interface RawConfig extends Omit<Linter.Config, 'plugins' | 'processor'> {
    languageOptions?: Linter.LanguageOptions & { parser?: string | Linter.Parser };
    plugins?: Record<string, string | ESLint.Plugin>;
    processor?: string | Linter.Processor;
}

export default class Lint {
    supportedExtensions = ['.ts', '.tsx', '.js', '.jsx'];
    private configFiles = [
        'eslint.config.js',
        'eslint.config.mjs',
        'eslint.config.cjs',
        'eslint.config.ts',
        'eslint.config.mts',
        '.eslintrc.js',
        '.eslintrc.cjs',
        '.eslintrc.yaml',
        '.eslintrc.yml',
        '.eslintrc.json',
        '.eslintrc',
    ];

    constructor(private tccConfig: TccConfigJson) {}

    async directory(dirPath: string): Promise<void> {
        const lintConfig = this.tccConfig.lint;
        const hasInlineConfig = !!lintConfig?.overrideConfig;
        const hasExternalConfig = await this.hasConfig(dirPath);

        if (!hasInlineConfig && !hasExternalConfig) {
            console.log(chalk.yellow(`⚠️  No ESLint config found in ${dirPath}. Skipping lint.`));
            console.log(
                chalk.gray(
                    `   Create eslint.config.mjs or add lint.overrideConfig to tcc.config.json`,
                ),
            );
            return;
        }

        const files = await fs.readdir(dirPath);
        const exclude = this.tccConfig.exclude ?? [];
        const extensions = lintConfig?.extensions ?? this.supportedExtensions;

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

    private async hasConfig(dirPath: string): Promise<boolean> {
        let currentDir = path.resolve(dirPath);

        while (true) {
            for (const configFile of this.configFiles) {
                const configPath = path.join(currentDir, configFile);
                if (await fs.pathExists(configPath)) return true;
            }

            const packagePath = path.join(currentDir, 'package.json');
            if (await fs.pathExists(packagePath)) {
                try {
                    const pkg = await fs.readJson(packagePath);
                    if (pkg.eslintConfig) return true;
                } catch {
                    /* ignore */
                }
            }

            const parentDir = path.dirname(currentDir);
            if (parentDir === currentDir) break;
            currentDir = parentDir;
        }

        return false;
    }

    private resolveConfig(config: RawConfig | RawConfig[]): Linter.Config[] {
        const configs = Ary.is(config) ? config : [config];

        return configs.map((cfg) => this.resolveSingleConfig(cfg));
    }

    private resolveSingleConfig(cfg: RawConfig): Linter.Config {
        const resolved: Record<string, unknown> = { ...cfg };

        if (typeof cfg.languageOptions?.parser === 'string')
            try {
                const parserModule = require(cfg.languageOptions.parser);
                resolved.languageOptions = {
                    ...cfg.languageOptions,
                    parser: parserModule,
                };
            } catch {
                /* keep string if module not found */
            }

        if (cfg.plugins) {
            const resolvedPlugins: Record<string, unknown> = {};
            for (const [key, value] of Object.entries(cfg.plugins)) {
                if (typeof value === 'string')
                    try {
                        resolvedPlugins[key] = require(value);
                    } catch {
                        resolvedPlugins[key] = value;
                    }
                else resolvedPlugins[key] = value;
            }
            resolved.plugins = resolvedPlugins;
        }

        if (typeof cfg.processor === 'string' && !cfg.processor.includes('/'))
            try {
                resolved.processor = require(cfg.processor);
            } catch {
                /* keep string if module not found */
            }

        return resolved as Linter.Config;
    }

    async file(filePath: string, code?: string): Promise<void> {
        try {
            const lintConfig = this.tccConfig.lint;
            const hasOverrideConfig = !!lintConfig?.overrideConfig;

            let eslintOptions: ESLint.Options = {
                fix: lintConfig?.fix ?? false,
            };

            if (hasOverrideConfig) {
                const resolvedConfig = this.resolveConfig(lintConfig!.overrideConfig!);
                eslintOptions = {
                    ...eslintOptions,
                    overrideConfigFile: true,
                    overrideConfig: resolvedConfig,
                };
            }

            const eslint = new ESLint(eslintOptions);

            const results: ESLint.LintResult[] = code
                ? await eslint.lintText(code, { filePath })
                : await eslint.lintFiles([filePath]);

            if (results.length === 0) return;

            const hasErrors = results.some((result) => result.errorCount > 0);
            const hasWarnings = results.some((result) => result.warningCount > 0);
            const hasFixable = results.some(
                (result) => result.fixableErrorCount > 0 || result.fixableWarningCount > 0,
            );

            if (!hasErrors && !hasWarnings) return console.log(chalk.green(`✅ ${filePath}`));

            if (lintConfig?.fix && hasFixable) {
                await ESLint.outputFixes(results);
                console.log(chalk.yellow(`🔧 Fixed: ${filePath}`));
            }

            for (const result of results) {
                for (const message of result.messages) {
                    const position = chalk.gray(`${message.line}:${message.column}`);
                    const severity =
                        message.severity === 2 ? chalk.red('error') : chalk.yellow('warning');
                    const rule = message.ruleId ? chalk.gray(`(${message.ruleId})`) : '';

                    console.log(`  ${position}  ${severity}  ${message.message}  ${rule}`);
                }
            }

            if (hasErrors) console.log(chalk.red(`❌ ${filePath}`));
            else if (hasWarnings) console.log(chalk.yellow(`⚠️  ${filePath}`));
        } catch (error) {
            if (
                error instanceof Error &&
                (error as Error & { code?: string }).code === 'MODULE_NOT_FOUND'
            )
                console.error(
                    chalk.red(`❌ ESLint is not installed. Please run: pnpm add -D eslint`),
                );
            else console.error(chalk.red(`❌ Failed to lint ${filePath}: ${error}`));
        }
    }
}
