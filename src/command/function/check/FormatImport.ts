// -Path: 'cli\src\command\function\check\FormatImport.ts'
import ActionConfig from '../config/ActionConfig';
import { TccConfigJson } from '../../types/config/config';
import { ImportPattern } from '../../types/config/format/importSort';
import { ActivePattern, ImportNode, ParsedBlock } from '../../types/check/importSort';

export default class FormatImport extends ActionConfig {
    private ext: string;
    private defaultPatterns: ImportPattern[] = [
        {
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'],
            match: '^import\\s+.*?\\s+from\\s+[\'"]([^\'"]+)[\'"];?$|^import\\s+[\'"]([^\'"]+)[\'"];?$',
            extract: '[\'"]([^\'"]+)[\'"]',
        },
        {
            extensions: ['.py'],
            match: '^(?:from\\s+([\\w.]+)\\s+import|import\\s+([\\w.]+))',
            extract: '(?:from\\s+([\\w.]+)|import\\s+([\\w.]+))',
        },
        {
            extensions: ['.rs'],
            match: '^use\\s+([\\w:]+);?$|^extern\\s+crate\\s+([\\w]+);?$',
            extract: '(?:use\\s+([\\w:]+)|extern\\s+crate\\s+([\\w]+))',
        },
        {
            extensions: ['.c', '.cpp', '.h', '.hpp', '.cc'],
            match: '^#include\\s+[<"]([^>"]+)[>"]',
            extract: '[<"]([^>"]+)[>"]',
        },
        {
            extensions: ['.go'],
            match: '^import\\s+\\(?|import\\s+[\'"]([^\'"]+)[\'"]',
            extract: '[\'"]([^\'"]+)[\'"]',
        },
        {
            extensions: ['.java', '.kt'],
            match: '^import\\s+([\\w.]+);?$',
            extract: 'import\\s+([\\w.]+)',
        },
        {
            extensions: ['.rb'],
            match: '^require\\s+[\'"]([^\'"]+)[\'"]|^require_relative\\s+[\'"]([^\'"]+)[\'"]|^import\\s+[\'"]([^\'"]+)[\'"]',
            extract: '[\'"]([^\'"]+)[\'"]',
        },
        {
            extensions: ['.php'],
            match: '^(?:require|include|require_once|include_once)\\s*\\(?\\s*[\'"]([^\'"]+)[\'"]',
            extract: '[\'"]([^\'"]+)[\'"]',
        },
        {
            extensions: ['.swift'],
            match: '^import\\s+([\\w.]+)$',
            extract: 'import\\s+([\\w.]+)',
        },
    ];

    constructor(
        tccConfig: TccConfigJson,
        filePath: string,
    ) {
        super(tccConfig);
        this.ext = filePath.split('.').pop()?.toLowerCase() ?? '';
        if (this.ext) this.ext = '.' + this.ext;
    }

    sort(code: string): string {
        const importConfig = this.tccConfig.format?.importSort;
        if (importConfig?.enabled === false) return code;

        const pattern = this.getPattern(importConfig?.patterns);
        if (!pattern) return code;

        const block = this.extractImportBlock(code, pattern);
        if (block.imports.length === 0) return code;
        console.log('block: ', block);

        const sorted = this.sortImports(block.imports);
        const sortedCode = sorted.map((node) => node.code).join('\n');

        return `${block.before}${sortedCode}\n${block.after}`;
    }

    private getPattern(customPatterns?: ImportPattern[]): ActivePattern | null {
        const patterns =
            customPatterns && customPatterns.length > 0 ? customPatterns : this.defaultPatterns;

        for (const pattern of patterns) {
            if (pattern.extensions.includes(this.ext)) {
                return {
                    match: pattern.match,
                    regex: new RegExp(pattern.match, 'gm'),
                    extract: new RegExp(pattern.extract),
                };
            }
        }

        return null;
    }

    private extractImportBlock(code: string, pattern: ActivePattern): ParsedBlock {
        const lines = code.split('\n');
        const imports: ImportNode[] = [];
        const beforeLines: string[] = [];
        const afterLines: string[] = [];

        let inImportBlock = false;
        let hasSeenImport = false;
        let importBuffer: string[] = [];

        for (const line of lines) {
            const isImport = pattern.regex.test(line);
            pattern.regex.lastIndex = 0;

            if (isImport) {
                inImportBlock = true;
                hasSeenImport = true;
                importBuffer.push(line);
            } else {
                if (inImportBlock) {
                    if (line.trim() === '') {
                        importBuffer.push(line);
                    } else {
                        inImportBlock = false;
                        this.flushImports(importBuffer, imports, pattern.extract, pattern.match);
                        importBuffer = [];
                        afterLines.push(line);
                    }
                } else if (hasSeenImport) {
                    afterLines.push(line);
                } else {
                    beforeLines.push(line);
                }
            }
        }

        if (inImportBlock) this.flushImports(importBuffer, imports, pattern.extract, pattern.match);

        return {
            before: beforeLines.join('\n') + (beforeLines.length > 0 ? '\n' : ''),
            imports,
            after: (afterLines.length > 0 ? '\n' : '') + afterLines.join('\n'),
        };
    }

    private flushImports(
        buffer: string[],
        imports: ImportNode[],
        extract: RegExp,
        matchPattern: string,
    ): void {
        const code = buffer.join('\n').trim();
        if (!code) return;

        const lines = code.split('\n');
        let currentImport = '';
        const importRegex = new RegExp(matchPattern, 'm');

        for (const line of lines) {
            const isStart = importRegex.test(line);

            if (isStart) {
                if (currentImport) this.pushImport(currentImport, imports, extract);
                currentImport = line;
            } else if (currentImport) currentImport += '\n' + line;
        }

        if (currentImport) this.pushImport(currentImport, imports, extract);
    }

    private pushImport(code: string, imports: ImportNode[], extract: RegExp): void {
        const match = extract.exec(code);
        extract.lastIndex = 0;

        const source = match ? match[1] || match[2] || '' : '';

        imports.push({
            code: code.trim(),
            source,
            lineLength: code.length,
        });
    }

    private sortImports(imports: ImportNode[]): ImportNode[] {
        const importConfig = this.tccConfig.format?.importSort;
        const strategy = importConfig?.strategy ?? 'length';
        const copy = [...imports];

        switch (strategy) {
            case 'length':
                return copy.sort(
                    (a, b) => a.lineLength - b.lineLength || a.source.localeCompare(b.source),
                );
            case 'alphabetical':
                return copy.sort((a, b) => a.source.localeCompare(b.source));
            case 'dependency':
                return this.sortByDependency(copy);
            default:
                return copy;
        }
    }

    private sortByDependency(imports: ImportNode[]): ImportNode[] {
        const nodeBuiltins = imports.filter((node) => node.source.startsWith('node:'));
        const externals = imports.filter(
            (node) => !node.source.startsWith('node:') && !node.source.startsWith('.'),
        );
        const relatives = imports.filter((node) => node.source.startsWith('.'));

        const sortBySource = (nodes: ImportNode[]) =>
            nodes.sort((a, b) => a.source.localeCompare(b.source));

        return [
            ...sortBySource(nodeBuiltins),
            ...sortBySource(externals),
            ...sortBySource(relatives),
        ];
    }
}
