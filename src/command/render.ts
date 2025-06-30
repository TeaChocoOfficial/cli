//-Path: "cli/src/command/render.ts"
import * as path from "path";
import * as fs from "fs-extra";
import * as yaml from "js-yaml";
import chokidar from "chokidar";
import { program } from "commander";
import { FileNode } from "./types/file";
import { createStructure } from "./function/structure";

// ฟังก์ชันสำหรับสร้างโครงสร้างจาก YAML
async function renderStructure(yamlPath: string) {
    try {
        // อ่านไฟล์ YAML โดยใช้ process.cwd() เพื่ออ้างอิงจากตำแหน่ง command line
        const teachocoDev = path.join(
            process.cwd(),
            yamlPath,
            "teachoco-dev.yaml",
        );
        const yamlContent = await fs.readFile(teachocoDev, "utf8");
        const config = yaml.load(yamlContent) as {
            name: string;
            run: string;
            pack: Record<string, any>;
            src: FileNode[];
        };

        if (!config.name || !config.src) {
            throw new Error(
                "Invalid YAML configuration: 'name' and 'src' are required",
            );
        }

        // สร้าง root directory โดยใช้ dirname ของ yamlPath เพื่อหลีกเลี่ยงการซ้ำซ้อน
        const rootPath = path.join(process.cwd(), yamlPath, config.name);
        await fs.ensureDir(rootPath);

        // ลบโฟลเดอร์เก่าถ้ามี เพื่อให้แน่ใจว่าโครงสร้างใหม่ถูกสร้าง
        await fs.emptyDir(rootPath);

        // สร้างโครงสร้างไฟล์จาก src
        if (config.src) {
            for (const node of config.src) {
                await createStructure(node, rootPath);
            }
        }

        console.log(`Successfully created project structure at ${rootPath}`);
    } catch (error) {
        console.error(
            "Failed to render structure:",
            error instanceof Error ? error.message : error,
        );
        process.exit(1);
    }
}

// กำหนดคำสั่ง 'render'
program
    .command("render")
    .argument("<path>", "path to YAML file (e.g., ./path/to/projects)")
    .description("Render folder structure from YAML file")
    .option("-w, --watch", "watch for changes in the YAML file and re-render")
    .action(async (yamlPath: string, options: { watch?: boolean }) => {
        // รันครั้งแรก
        await renderStructure(yamlPath);

        // ถ้ามีตัวเลือก --watch
        if (options.watch) {
            console.log(`Watching for changes in ${yamlPath}...`);
            const yamlFilePath = path.resolve(process.cwd(), yamlPath);

            // ใช้ chokidar เพื่อตรวจจับการเปลี่ยนแปลง
            const watcher = chokidar.watch(yamlFilePath, {
                persistent: true,
                ignoreInitial: false,
            });

            watcher.on("change", async (filePath) => {
                console.log(`File ${filePath} changed, re-rendering...`);
                await renderStructure(yamlPath);
            });

            // จัดการข้อผิดพลาดของ watcher
            watcher.on("error", (error) => {
                console.error("Watcher error:", error);
            });
        }
    });
