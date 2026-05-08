// -Path: "cli/src/command/function/format/formatDirectory.ts"
import * as path from "path";
import * as fs from "fs-extra";
import formatFile from "./formatFile";
import { TccConfigJson } from "../../types/config";

/**
 * Recursively format files in a directory
 */
export default async function formatDirectory(
    dirPath: string,
    configJson: TccConfigJson,
    exclude: string[] = [],
): Promise<void> {
    const files = await fs.readdir(dirPath);

    for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stat = await fs.stat(filePath);

        if (stat.isDirectory())
            await formatDirectory(filePath, configJson, exclude);
        else if (stat.isFile()) {
            const ext = path.extname(file);
            const supportedExtensions = [".ts", ".tsx", ".js", ".jsx", ".json"];

            if (supportedExtensions.includes(ext)) {
                const isExcluded = exclude.some((excludePath) =>
                    filePath.includes(excludePath),
                );

                if (!isExcluded) {
                    const code = await fs.readFile(filePath, "utf8");
                    const formatted = await formatFile(
                        filePath,
                        code,
                        configJson,
                    );

                    if (formatted !== code) {
                        await fs.writeFile(filePath, formatted, "utf8");
                    }
                }
            }
        }
    }
}
