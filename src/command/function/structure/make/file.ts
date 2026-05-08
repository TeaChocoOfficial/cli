// -Path: "cli/src/command/function/structure/make/file.ts"
import path from 'path';
import fs from 'fs-extra';

export function getFileExtension(filename: string): string {
    const ext = path.extname(filename).slice(1);
    return ext || 'unknown';
}

export function getFileContent(filePath: string): string[] {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        return content.split('\n');
    } catch {
        return [];
    }
}
