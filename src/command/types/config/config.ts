// -Path: "cli/src/command/types/config.ts"
import { LintConfig } from './lint';
import { MakeConfig } from './make';
import { RenderConfig } from './render';
import { FormatConfig } from './format/format';

/**
 * @description Configuration for the tcc CLI tool
 */
export interface TccConfigJson {
    /**
     * @description Path to the JSON schema for validation
     */
    $schema?: string;

    /**
     * @description Configuration for formatting
     */
    format?: FormatConfig;

    /**
     * @description Configuration for linting
     */
    lint?: LintConfig;

    /**
     * @description Configuration for rendering
     */
    render?: RenderConfig;

    /**
     * @description Configuration for making
     */
    make?: MakeConfig;

    /**
     * @description Paths to exclude from processing
     */
    exclude?: string[];
}
