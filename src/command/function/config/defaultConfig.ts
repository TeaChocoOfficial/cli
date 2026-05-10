// -Path: 'cli\src\command\function\config\defaultConfig.ts'
import { TccConfigJson } from '../../types/config/config';

const defaultConfig: TccConfigJson = {
    $schema: 'https://raw.githubusercontent.com/TeaChocoOfficial/cli/main/tcc.config.schema.json',
    format: {
        commentPath: {
            enable: true,
            text: "-Path: '{{0}}'",
            isRelativePath: true,
        },
        prettier: {
            semicolon: true,
            singleQuote: false,
            tabWidth: 4,
            trailingComma: 'all',
            printWidth: 80,
        },
        importSort: {
            enabled: true,
            strategy: 'length',
            patterns: [
                {
                    extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'],
                    match: "^import\\s+.*?\\s+from\\s+['\"]([^'\"]+)['\"];?$|^import\\s+['\"]([^'\"]+)['\"];?$",
                    extract: "['\"]([^'\"]+)['\"]",
                },
                {
                    extensions: ['.py'],
                    match: "^(?:from\\s+([\\w.]+)\\s+import|import\\s+([\\w.]+))",
                    extract: "(?:from\\s+([\\w.]+)|import\\s+([\\w.]+))",
                },
            ],
        },
    },
    lint: {
        overrideConfig: [
            {
                files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
                languageOptions: {
                    ecmaVersion: 2022,
                    sourceType: 'module',
                    parser: '@typescript-eslint/parser',
                    parserOptions: {
                        ecmaFeatures: { jsx: true },
                    },
                },
                rules: {
                    'no-unused-vars': 'warn',
                    'no-undef': 'error',
                    'no-console': 'off',
                    'prefer-const': 'warn',
                    'no-var': 'error',
                    eqeqeq: ['error', 'always'],
                },
            },
        ],
    },
    render: {
        watch: false,
        force: true,
        basePath: './',
        structurePath: './teachoco-dev.yaml',
    },
    make: {
        watch: false,
        force: true,
        basePath: './',
        output: './teachoco-dev.yaml',
        name: 'My Project',
        run: 'echo "Starting Project"',
    },
    exclude: ['node_modules', 'build', 'dist', '.git'],
};

export default defaultConfig;
