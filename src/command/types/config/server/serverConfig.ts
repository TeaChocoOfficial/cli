// -Path: "cli/src/command/types/config/server/serverConfig.ts"

export interface ServerConfig {
    /**
     * @description Host to run the dev server on
     * @default "127.0.0.1"
     */
    host?: string;
    
    /**
     * @description Port to run the dev server on (undefined is random)
     * @default undefined
     */
    port?: number;

    /**
     * @description Base path for the dev server
     * @default "/"
     */
    base?: string;

    /**
     * @description Whether to open the dev server in the browser
     * @default true
     */
    open?: boolean;
}
