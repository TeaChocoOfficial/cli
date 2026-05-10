// -Path: "cli/src/command/types/config/commentPath.ts"
import { CommentExtension } from '../../check/commentExt';

export interface CommentPathConfig {
    /**
     * @description Enable comment path (true, false, or 'clear' to clear existing paths)
     * @default true
     * @param {boolean | 'clear'} boolean | 'clear' - enable comment path
     */
    enable?: boolean | 'clear';

    /**
     * @description Comment path in file
     * @default string -Path: {{0}}
     * @param {string} string - comment path with custom text (e.g. " - Path: '{{0}}'")
     */
    text?: string;

    /**
     * @description Use relative path in comment
     * @default true
     */
    isRelativePath?: boolean;

    /**
     * @description Comment extensions to use
     * @default []
     */
    commentExts?: CommentExtension[];

    /**
     * @description Custom special comments to detect
     * @default []
     * @example ['@ts-check', '@ts-nocheck']
     */
    specialComments?: string[];
}
