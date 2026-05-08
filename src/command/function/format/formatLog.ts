// -Path: "cli/src/command/function/format/formatLog.ts"
import chalk from "chalk";
import * as diff from "diff";

export default function formatLog(
    filePath: string,
    code: string,
    afterCode: string,
): void {
    if (afterCode !== code) {
        const charDiff = afterCode.length - code.length;
        const diffText = charDiff > 0 ? `+${charDiff}` : `${charDiff}`;
        const diffColor = charDiff > 0 ? chalk.green : chalk.red;

        console.log(chalk.cyan(`  📝 ${filePath}`));
        console.log(chalk.gray(`     Before: ${code.length} chars`));
        console.log(
            chalk.gray(`     After:  ${afterCode.length} chars `) +
                diffColor(`(${diffText})`),
        );

        const changes = diff.diffLines(code, afterCode);
        changes.forEach((change: diff.Change) => {
            if (change.added) {
                console.log(chalk.green(`     + ${change.count} lines added`));
            } else if (change.removed) {
                console.log(chalk.red(`     - ${change.count} lines removed`));
            }
        });

        console.log("");
    }
}
