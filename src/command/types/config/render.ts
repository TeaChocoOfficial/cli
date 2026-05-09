// -Path: "cli/src/command/types/render.ts"

export interface RenderConfig {
    /**
     * @description Watch for changes in the YAML file and re-render
     * @default false
     */
    watch?: boolean;

    /**
     * @description Force re-render even if no changes detected
     * @default false
     */
    force?: boolean;

    /**
     * @description Base path for rendering
     */
    basePath?: string;

    /**
     * @description Path to the YAML or JSON structure file
     */
    structurePath?: string;
}
