//-Path: "cli/src/command/render.ts"
import * as path from "path"; 
import * as fs from "fs-extra";
import * as yaml from "js-yaml";
import { program } from "commander";
import { FileNode } from "./types/file";
import { createStructure } from "./function/structure";

// กำหนดคำสั่ง 'render'
program
    .command("render")
    .argument("<path>", "path to YAML file")
    .description("Render folder structure from YAML file")
    .action(async (yamlPath: string) => {
        try {
            // อ่านไฟล์ YAML
            const teachocoDev = path.resolve(yamlPath, "teachoco-dev.yaml");
            const yamlContent = await fs.readFile(teachocoDev, "utf8");
            const config = yaml.load(yamlContent) as {
                name: string;
                run: string;
                pack: Record<string, any>;
                src: FileNode[];
            };
            console.log();
            console.log(config);
            console.log();

            if (!config.name || !config.src) {
                throw new Error(
                    "Invalid YAML configuration: 'name' and 'src' are required",
                );
            }

            // สร้าง root directory
            const rootPath = path.join(process.cwd(), yamlPath, config.name);
            await fs.ensureDir(rootPath);

            // สร้างโครงสร้างไฟล์จาก src
            if (config.src) {
                for (const node of config.src) {
                    await createStructure(node, rootPath);
                }
            }

            console.log(
                `Successfully created project structure at ${rootPath}`,
            );
        } catch (error) {
            console.error(
                "Failed to render structure:",
                error instanceof Error ? error.message : error,
            );
            process.exit(1);
        }
    });
