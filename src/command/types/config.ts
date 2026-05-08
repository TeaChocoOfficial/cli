// -Path: "cli/src/command/types/config.ts"
import { MakeConfig } from './make';
import { FormatConfig } from './format';
import { RenderConfig } from './render';

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
