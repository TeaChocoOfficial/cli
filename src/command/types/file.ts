//-Path: "cli/src/types/file.ts"

export interface FileNode {
    type: string;
    name: string;
    code?: string[];
    children?: FileNode[];
}
