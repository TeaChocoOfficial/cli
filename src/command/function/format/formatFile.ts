// -Path: "cli/src/command/function/format/formatFile.ts"
import chalk from "chalk";
import formatLog from "./formatLog";
import formatComment from "./formatComment";
import formatPrettier from "./formatPrettier";
import { TccConfigJson } from "../../types/config";

export default async function formatFile(
    filePath: string,
    code: string,
    tccConfigJson: TccConfigJson,
): Promise<string> {
    try {
        const formatted = await formatPrettier(filePath, code, tccConfigJson);
        const commented = formatComment(filePath, formatted, tccConfigJson);
        const afterCode = commented;
        formatLog(filePath, code, afterCode);

        return afterCode;
    } catch (error) {
        if ((error as any).code === "EBUSY") {
            console.error(chalk.yellow(`⚠️  File busy, skipping: ${filePath}`));
        } else {
            console.error(
                chalk.red(`❌ Failed to format ${filePath}: ${error}`),
            );
        }
        return code;
    }
}
