// -Path: "cli/rollup.config.mjs"
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

const externals = [
    'eslint',
    'prettier',
    'diff',
    'chalk',
    'fs-extra',
    'commander',
    'chokidar',
    'js-yaml',
    'dayjs',
    'yaml',
    'rollup',
    /^node:/,
];

export default [
    {
        input: 'src/index.ts',
        external: externals,
        output: {
            file: 'dist/index.js',
            format: 'cjs',
            sourcemap: true,
            inlineDynamicImports: true,
        },
        plugins: [
            peerDepsExternal(),
            resolve(),
            commonjs(),
            typescript({ tsconfig: './tsconfig.json', sourceMap: true }),
        ],
    },
    {
        input: 'src/command/command.ts',
        external: externals,
        output: {
            file: 'dist/command.js',
            format: 'cjs',
            sourcemap: true,
            inlineDynamicImports: true,
            banner: '#!/usr/bin/env node\n',
        },
        plugins: [
            peerDepsExternal(),
            resolve(),
            commonjs(),
            typescript({ tsconfig: './tsconfig.json', sourceMap: true }),
        ],
    },
];
