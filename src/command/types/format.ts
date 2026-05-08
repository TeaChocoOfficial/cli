// -Path: "cli/src/command/types/format.ts"
import { PrettierConfig } from "./prettier";

export interface FormatConfig {
    /**
     * @description Watch for changes
     * @default false
     */
    watch?: boolean;

    /**
     * @description Comment path in file
     * @default true
     * @param {boolean} true - comment path
     * @param {boolean} false - don't comment path
     * @param {string} string - comment path with custom text (e.g. " - Path: 'path'")
     */
    commentPath?: boolean | string;

    /**
     * @description Prettier configuration
     */
    prettier?: PrettierConfig;
}
