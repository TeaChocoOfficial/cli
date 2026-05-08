// -Path: "cli/src/command/types/structure.ts"
import { FileNode } from './file';

export interface StructureData {
    $schema?: string;
    workspaces: WorkSpace[];
}

export interface WorkSpace {
    name: string;
    run: string;
    pack: Record<string, any>;
    src: FileNode[];
}
