// -Path: "cli/src/command/types/make.ts"

export interface MakeConfig {
    /**
     * @description Watch for changes and update the output file
     * @default false
     */
    watch?: boolean;

    /**
     * @description Output file name
     */
    output?: string;

    /**
     * @description Workspace name
     */
    name?: string;

    /**
     * @description Run command
     */
    run?: string;
}
