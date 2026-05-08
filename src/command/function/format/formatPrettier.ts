// -Path: "cli/src/command/function/format/formatPrettier.ts"
import * as prettier from "prettier";
import { TccConfigJson } from "../../types/config";

export default async function formatPrettier(
    filePath: string,
    code: string,
    tccConfigJson: TccConfigJson,
): Promise<string> {
    const prettierConfig = tccConfigJson.format?.prettier;

    const defaultOptions: prettier.Options = {
        semi: true,
        tabWidth: 4,
        useTabs: true,
        endOfLine: "lf",
        printWidth: 80,
        quoteProps: "as-needed",
        singleQuote: true,
        arrowParens: "always",
        trailingComma: "all",
        bracketSpacing: true,
        jsxSingleQuote: true,
        bracketSameLine: false,
        htmlWhitespaceSensitivity: "strict",
    };
    const options: prettier.Options = {
        filepath: filePath,
        semi: prettierConfig?.semicolon,
        tabWidth: prettierConfig?.tabWidth,
        useTabs: prettierConfig?.useTabs,
        endOfLine: prettierConfig?.endOfLine,
        printWidth: prettierConfig?.printWidth,
        quoteProps: prettierConfig?.quoteProps,
        singleQuote: prettierConfig?.singleQuote,
        arrowParens: prettierConfig?.arrowParens,
        trailingComma: prettierConfig?.trailingComma,
        bracketSpacing: prettierConfig?.bracketSpacing,
        jsxSingleQuote: prettierConfig?.jsxSingleQuote,
        bracketSameLine: prettierConfig?.bracketSameLine,
        htmlWhitespaceSensitivity: prettierConfig?.htmlSpace,
    };
    const prettierOptions = { ...defaultOptions, ...options };

    const formatted = await prettier.format(code, prettierOptions);
    return formatted;
}
