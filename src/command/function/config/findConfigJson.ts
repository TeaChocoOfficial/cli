// -Path: "cli/src/command/function/config/findConfigJson.ts"
import chalk from "chalk";
import * as path from "path";
import * as fs from "fs-extra";
import { TccConfigJson } from "../../types/config";

export default async function findConfigJson(
    rootPath: string,
): Promise<TccConfigJson> {
    const configFileName = "tcc.config.json";
    let currentPath = path.resolve(process.cwd(), rootPath);

    while (currentPath !== path.parse(currentPath).root) {
        const configPath = path.join(currentPath, configFileName);

        if (await fs.pathExists(configPath)) {
            try {
                const configContent = await fs.readFile(configPath, "utf8");
                const config = JSON.parse(configContent) as TccConfigJson;
                console.log(chalk.blue(`📄 Found tcc.config.json at ${configPath}\n`));
                return config;
            } catch (error) {
                throw new Error(
                    `Failed to parse ${configPath}: ${error instanceof Error ? error.message : String(error)}`,
                );
            }
        }

        currentPath = path.dirname(currentPath);
    }

    throw new Error("No tcc.config.json found");
}
