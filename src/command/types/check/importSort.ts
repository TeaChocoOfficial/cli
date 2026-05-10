// -Path: 'cli\src\command\types\check\importSort.ts'

export interface ImportNode {
    code: string;
    source: string;
    lineLength: number;
}

export interface ParsedBlock {
    before: string;
    imports: ImportNode[];
    after: string;
}

export interface ActivePattern {
    match: string;
    regex: RegExp;
    extract: RegExp;
}
