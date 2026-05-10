// -Path: "cli/src/command/types/format.ts"
import { PrettierConfig } from './prettier';
import { ImportSortConfig } from './importSort';
import { CommentPathConfig } from './commentPath';

export interface FormatConfig {
    /**
     * @description Watch for changes
     * @default false
     */
    watch?: boolean;

    /**
     * @description Log changes
     * @default false
     */
    log?: boolean;

    /**
     * @description Comment path configuration
     */
    commentPath?: CommentPathConfig;

    /**
     * @description Prettier configuration
     */
    prettier?: PrettierConfig;

    /**
     * @description Import sorting configuration
     */
    importSort?: ImportSortConfig;
}
