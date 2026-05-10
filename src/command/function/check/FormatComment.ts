// -Path: 'src\command\function\format\FormatComment.ts'
import chalk from 'chalk';
import path from 'node:path';
import { Ary } from '../../../class/ary';
import { CommentExtension } from '../../types/check/commentExt';
import ActionConfig from '../config/ActionConfig';

export default class FormatComment extends ActionConfig {
    private commentExtensions: CommentExtension[] = [
        // === SINGLE LINE: // ===
        {
            start: '//',
            extensions: [
                'js',
                'mjs',
                'cjs',
                'ts',
                'mts',
                'cts',
                'jsx',
                'tsx',
                'vue',
                'svelte',
                'c',
                'cpp',
                'cc',
                'cxx',
                'h',
                'hpp',
                'cs',
                'java',
                'kt',
                'kts',
                'swift',
                'dart',
                'go',
                'rs',
                'php',
                'scala',
                'proto',
                'txt',
            ],
        },

        // === SINGLE LINE: # ===
        {
            start: '#',
            extensions: [
                'py',
                'pyw',
                'rb',
                'pl',
                'pm',
                'sh',
                'bash',
                'zsh',
                'fish',
                'ps1',
                'yaml',
                'yml',
                'toml',
                'ini',
                'cfg',
                'conf',
                'env',
                'gitignore',
                'dockerignore',
                'editorconfig',
                'properties',
                'mk',
                'make',
                'cmake',
                'r',
                'R',
                'jl',
                'coffee',
                'nim',
            ],
        },

        // === SINGLE LINE: -- ===
        {
            start: '--',
            extensions: ['sql', 'pgsql', 'mysql', 'lua', 'hs', 'lhs'],
        },

        // === SINGLE LINE: % ===
        {
            start: '%',
            extensions: ['erl', 'ex', 'exs', 'tex', 'latex', 'm'],
        },

        // === SINGLE LINE: ; ===
        {
            start: ';',
            extensions: [
                'lisp',
                'lsp',
                'clj',
                'cljs',
                'cljc',
                'scm',
                'ss',
                'rkt',
                'el',
                'asm',
                's',
            ],
        },

        // === SINGLE LINE: ' ===
        {
            start: "'",
            extensions: ['vb', 'vba', 'vbs'],
        },

        // === SINGLE LINE: ! ===
        {
            start: '!',
            extensions: ['f', 'f90', 'f95', 'for'],
        },

        // === SINGLE LINE: REM ===
        {
            start: 'REM',
            extensions: ['bat', 'cmd'],
        },

        // === BLOCK: /* */ ===
        {
            start: '/*',
            end: '*/',
            extensions: [
                'css',
                'scss',
                'sass',
                'less',
                'styl',
                'js',
                'mjs',
                'cjs',
                'ts',
                'mts',
                'cts',
                'jsx',
                'tsx',
                'c',
                'cpp',
                'cc',
                'cxx',
                'h',
                'hpp',
                'cs',
                'java',
                'kt',
                'swift',
                'go',
                'rs',
                'php',
                'scala',
                'sql',
            ],
        },

        // === BLOCK: <!-- --> ===
        {
            start: '<!--',
            end: '-->',
            extensions: ['html', 'htm', 'xml', 'svg', 'md', 'mdx', 'vue', 'svelte'],
        },
    ];

    private defaultSpecialComments: string[] = [
        // Shebang
        '^#!\\/usr\\/bin\\/env',
        '^#!\\/bin\\/',

        // Encoding declarations
        '^# coding[:=]', // Python: # coding: utf-8
        '^# -\\*- coding:', // Python: # -*- coding: utf-8 -*-
        '^<\\?xml version=', // XML declaration

        // TypeScript
        '^\\/\\/\\/ <reference ', // Triple-slash directives
        '^\\/\\/ @ts-nocheck',
        '^\\/\\/ @ts-check',
        '^\\/\\/ @ts-ignore',
        '^\\/\\/ @ts-expect-error',

        // JavaScript/ESLint
        "^'use strict'",
        '^"use strict"',
        '^\\/\\* eslint-disable ',
        '^\\/\\/ eslint-disable',
        '^\\/\\* eslint-enable ',
        '^\\/\\/ eslint-enable',
        '^\\/\\* global ',
        '^\\/\\/ prettier-ignore',
        '^\\/\\* prettier-ignore \\*\\/',

        // Flow
        '^\\/\\/ @flow',
        '^\\/\\/ @noflow',

        // JSX pragma
        '^\\/\\*\\* @jsx ',
        '^\\/\\/ @jsx',

        // React
        "^'use client'", // Next.js
        '^"use client"',
        "^'use server'",
        '^"use server"',

        // Generated code markers
        '^\\/\\/ @generated',
        '^\\/\\* @generated \\*\\/',
        '^# AUTO-GENERATED',
        '^# Generated by',

        // Copyright/License
        '^\\/\\*\\*', // JSDoc/License blocks
        '^\\/\\* Copyright',
        '^# Copyright',

        // Python
        '^# \\!\\/', // Python shebang alternative
        '^"""', // Python docstring
        "^'''", // Python docstring

        // PHP
        '^<\\?php',

        // Ruby
        '^# frozen_string_literal:',

        // Vim/Emacs modelines
        '^# vim:',
        '^# vi:',
        '^\\/\\/ vim:',
        '^-\\*-', // Emacs mode line
    ];

    /**
     * @description add or update path comment in code
     * @param filePath - file path
     * @param code - code
     * @returns formatted code
     */
    comment(filePath: string, code: string): string {
        const commentConfig = this.tccConfig.format?.commentPath;
        if (commentConfig?.enable === false) return code;

        const commentData = this.getCommentData(filePath);
        if (!commentData) return code;

        const { commentExt, newComment } = commentData;
        const lines = code.split('\n');
        const insertIndex = this.findInsertPosition(lines);
        const pathCommentIndex = this.findExistingPathComment(lines, commentExt, insertIndex);

        if (commentConfig?.enable === 'clear') {
            if (pathCommentIndex !== -1) {
                this.logClearAction(filePath, pathCommentIndex);
                lines.splice(pathCommentIndex, 1);

                if (lines[pathCommentIndex]?.trim() === '') lines.splice(pathCommentIndex, 1);
            }

            return lines.join('\n');
        }

        const isUpdate = lines[pathCommentIndex] !== newComment;
        this.logCommentAction(filePath, pathCommentIndex, insertIndex, isUpdate);

        return this.applyComment(lines, newComment, pathCommentIndex, insertIndex);
    }

    /**
     * @description get comment data
     * @param filePath - file path
     * @returns comment data
     */
    private getCommentData(filePath: string): {
        commentExt: CommentExtension;
        newComment: string;
        relativePath: string;
    } | null {
        const ext = filePath.split('.').pop() || '';
        const commentExts = Ary.mix(
            this.tccConfig.format?.commentPath?.commentExts ?? [],
            this.commentExtensions,
        );
        const commentExt = commentExts.find((c) => c.extensions.includes(ext));
        const commentPath = this.tccConfig.format?.commentPath;

        if (!commentExt || !commentPath) return null;

        const relativePath = commentPath.isRelativePath
            ? path.relative(process.cwd(), filePath)
            : filePath;

        const commentText =
            typeof commentPath.text === 'string'
                ? commentPath.text.replace('{{0}}', relativePath)
                : relativePath;

        const newComment = `${commentExt.start} ${commentText}${commentExt.end ?? ''}`;

        return { commentExt, newComment, relativePath };
    }

    /**
     * @description find insert position for path comment
     * @param lines - lines
     * @returns insert position
     */
    private findInsertPosition(lines: string[]): number {
        const specialPatterns = this.getSpecialCommentPatterns();
        let insertIndex = 0;
        let hasSpecialComment = false;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            // check if it's a special comment
            if (this.isSpecialComment(line, specialPatterns)) {
                hasSpecialComment = true;
                insertIndex = i + 1;
                continue;
            }

            // skip empty line after special comments
            if (hasSpecialComment && line === '') {
                insertIndex = i + 1;
                continue;
            }

            // if it's not a special comment or empty line, stop
            break;
        }

        return insertIndex;
    }

    /**
     * @description check if line is special comment
     * @param line - line
     * @param patterns - patterns
     * @returns is special comment
     */
    private isSpecialComment = (line: string, patterns: RegExp[]): boolean =>
        patterns.some((pattern) => pattern.test(line));

    /**
     * @description get special comment patterns
     * @returns special comment patterns
     */
    private getSpecialCommentPatterns(): RegExp[] {
        const customPatterns = this.tccConfig.format?.commentPath?.specialComments ?? [];

        const allPatterns = [...this.defaultSpecialComments, ...customPatterns];

        return allPatterns.map((pattern) => new RegExp(pattern));
    }

    /**
     * @description find existing path comment
     * @param lines - lines
     * @param commentExt - comment extension
     * @param startIndex - start index
     * @returns path comment index
     */
    private findExistingPathComment(
        lines: string[],
        commentExt: CommentExtension,
        startIndex: number,
    ): number {
        const searchRange = Math.min(startIndex + 3, lines.length);

        for (let i = startIndex; i < searchRange; i++) {
            const line = lines[i]?.trim() || '';

            if (this.isPathComment(line, commentExt)) return i;
        }

        return -1; // not found
    }

    /**
     * @description check if line is path comment
     * @param line - line
     * @param commentExt - comment extension
     * @returns is path comment
     */
    private isPathComment(line: string, commentExt: CommentExtension): boolean {
        const commentText = this.tccConfig.format?.commentPath?.text;
        const commentTexts = commentText?.split('{{0}}') ?? [];
        return (
            line.startsWith(commentExt.start.trim()) &&
            line.endsWith(commentExt.end?.trim() ?? '') &&
            commentTexts.every((text) => line.includes(text))
        );
    }

    /**
     * @description apply comment
     * @param lines - lines
     * @param newComment - new comment
     * @param pathCommentIndex - path comment index
     * @param insertIndex - insert index
     * @returns formatted code
     */
    private applyComment(
        lines: string[],
        newComment: string,
        pathCommentIndex: number,
        insertIndex: number,
    ): string {
        if (pathCommentIndex !== -1)
            lines[pathCommentIndex] = newComment; // update existing comment
        else {
            // add new comment
            if (insertIndex > 0)
                lines.splice(insertIndex, 0, newComment); // insert after special comments
            else lines.unshift(newComment); // insert at first line
        }

        return lines.join('\n');
    }

    /**
     * @description log comment action
     * @param filePath - file path
     * @param pathCommentIndex - path comment index
     * @param insertIndex - insert index
     * @param isUpdate - is update
     */
    private logCommentAction(
        filePath: string,
        pathCommentIndex: number,
        insertIndex: number,
        isUpdate: boolean,
    ): void {
        const relativePath = this.tccConfig.format?.commentPath?.isRelativePath
            ? filePath
            : path.relative(process.cwd(), filePath);
        if (!isUpdate) return;
        if (pathCommentIndex !== -1)
            console.log(
                chalk.hex('#ffaa00')(
                    `  → Updating comment at "${relativePath}" line ${pathCommentIndex + 1}`,
                ),
            );
        else {
            if (insertIndex > 0) {
                console.log(
                    chalk.green(
                        `  → Adding comment after special comments at line ${insertIndex + 1}`,
                    ),
                );
            } else {
                console.log(chalk.green('  → Adding comment at line 1'));
            }
        }
    }

    /**
     * @description log clear action
     * @param filePath - file path
     * @param pathCommentIndex - path comment index
     */
    private logClearAction(filePath: string, pathCommentIndex: number): void {
        const relativePath = this.tccConfig.format?.commentPath?.isRelativePath
            ? filePath
            : path.relative(process.cwd(), filePath);
        console.log(
            chalk.yellow(`  → Clearing comment at "${relativePath}" line ${pathCommentIndex + 1}`),
        );
    }
}
