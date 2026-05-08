// -Path: "cli/src/command/function/structure/make/scanDirectory.ts"
import path from 'path';
import fs from 'fs-extra';
import { FileNode } from "../../../types/file";
import { getFileExtension, getFileContent } from "./file";

export default async function scanDirectory(
    dirPath: string,
    ignorePatterns: string[] = ['node_modules', '.git', 'dist', 'build'],
): Promise<FileNode[]> {
    const nodes: FileNode[] = [];
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
        if (ignorePatterns.includes(entry.name)) continue;

        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
            const children = await scanDirectory(fullPath, ignorePatterns);
            nodes.push({
                name: entry.name,
                type: 'folder',
                children,
            });
        } else if (entry.isFile()) {
            const ext = getFileExtension(entry.name);
            if (['ts', 'tsx', 'png', 'jpg', 'jpeg', 'svg'].includes(ext)) {
                nodes.push({
                    name: path.parse(entry.name).name,
                    type: ext,
                    code:
                        ext !== 'png' && ext !== 'jpg' && ext !== 'jpeg' && ext !== 'svg'
                            ? getFileContent(fullPath)
                            : [],
                });
            }
        }
    }

    return nodes;
}
