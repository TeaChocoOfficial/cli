// -Path: "cli/src/command/types/format.ts"
import { PrettierConfig } from './prettier';
import { CommentPathConfig } from './commentPath';

export interface FormatConfig {
    /**
     * @description Watch for changes
     * @default false
     */
    watch?: boolean;

    /**
     * @description Comment path configuration
     */
    commentPath?: CommentPathConfig;

    /**
     * @description Prettier configuration
     */
    prettier?: PrettierConfig;
}
