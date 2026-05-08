// -Path: "cli/src/command/types/file.ts"

/**
 * @description File node structure for project generation
 */
export interface FileNode {
    /**
     * @description File or folder type (e.g., 'folder', 'ts', 'tsx', 'png')
     * @example 'folder', 'ts', 'tsx', 'png'
     */
    type: string;
    /**
     * @description File or folder name
     */
    name: string;
    /**
     * @description Code lines for files
     */
    code?: string[];
    /**
     * @description Child nodes for folders
     */
    children?: FileNode[];
}
