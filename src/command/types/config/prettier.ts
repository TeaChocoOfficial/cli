// -Path: "cli/src/command/types/prettier.ts"

export interface PrettierConfig {
    /**
     * @description Add semicolon at the end of line
     * @default true
     */
    semicolon?: boolean;

    /**
     * @description Tab width
     * @default 4
     */
    tabWidth?: number;

    /**
     * @description Use tabs instead of spaces
     * @default true
     */
    useTabs?: boolean;

    /**
     * @description End of line
     * @default "lf"
     */
    endOfLine?: "lf" | "crlf" | "cr" | "auto";

    /**
     * @description Print width
     * @default 80
     */
    printWidth?: number;

    /**
     * @description Quote props
     * @default "as-needed"
     */
    quoteProps?: "as-needed" | "consistent" | "preserve";

    /**
     * @description Use single quotes instead of double quotes
     * @default true
     */
    singleQuote?: boolean;

    /**
     * @description Arrow parens
     * @default "always"
     */
    arrowParens?: "avoid" | "always";

    /**
     * @description Trailing comma
     * @default "all"
     */
    trailingComma?: "all" | "es5" | "none";

    /**
     * @description Bracket spacing
     * @default true
     */
    bracketSpacing?: boolean;

    /**
     * @description JSX single quote
     * @default true
     */
    jsxSingleQuote?: boolean;

    /**
     * @description Bracket same line
     * @default false
     */
    bracketSameLine?: boolean;

    /**
     * @description HTML whitespace sensitivity
     * @default "strict"
     */
    htmlSpace?: "ignore" | "strict" | "css";
}
