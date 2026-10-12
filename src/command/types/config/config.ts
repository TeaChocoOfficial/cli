// -Path: "cli/src/command/types/config.ts"
import { LintConfig } from './lint';
import { FormatConfig } from './format/format';
import { ServerConfig } from './server/serverConfig';

/**
 * @description Configuration for the tcc CLI tool
 */
export interface TccConfigJson {
    /**
     * @description Path to the JSON schema for validation
     */
    $schema?: string;

    /**
     * @description Configuration for the dev server
     */
    server?: ServerConfig;

    /**
     * @description Configuration for formatting
     */
    format?: FormatConfig;

    /**
     * @description Configuration for linting
     */
    lint?: LintConfig;

    /**
     * @description Paths to exclude from processing
     */
    exclude?: string[];
}
