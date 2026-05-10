// -Path: "cli/src/command/types/config/importSort.ts"

export interface ImportPattern {
    /**
     * @description File extensions to apply this pattern (e.g. ['.ts', '.tsx'])
     */
    extensions: string[];

    /**
     * @description Regex pattern to match import/include/use lines
     * @example "^import\\s+.*?\\s+from\\s+['\"]([^'\"]+)['\"];?$"
     */
    match: string;

    /**
     * @description Regex pattern to extract source/module name from matched line
     * @example "['\"]([^'\"]+)['\"]"
     */
    extract: string;
}

export interface ImportSortConfig {
    /**
     * @description Enable import sorting
     * @default true
     */
    enabled?: boolean;

    /**
     * @description Sorting strategy
     * @default 'length'
     */
    strategy?: 'length' | 'alphabetical' | 'dependency';

    /**
     * @description Custom import patterns by language (overrides defaults)
     */
    patterns?: ImportPattern[];
}
