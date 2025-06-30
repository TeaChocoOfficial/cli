//-Path: "cli/src/function/structure.ts"
import * as path from "path";
import * as fs from "fs-extra";
import { FileNode } from "../types/file";

export async function createStructure(node: FileNode, basePath: string) {
    const currentPath = path.join(basePath, node.name);

    if (node.type === "folder") {
        await fs.ensureDir(currentPath);
        if (node.children) {
            for (const child of node.children) {
                await createStructure(child, currentPath);
            }
        }
    } else {
        let content = "";
        let ext = node.type;

        if (node.code && node.code.length > 0) {
            content = node.code.join("\n");
        }

        const supportedTypes = ["folder", "ts", "tsx", "png"];
        if (!supportedTypes.includes(node.type)) {
            throw new Error(`Unsupported file type: ${node.type}`);
        }

        switch (node.type) {
            case "ts":
            case "tsx":
                ext = `.${node.type}`;
                break;
            case "png":
                content = node.code?.[0] || "";
                // TODO: เพิ่มการจัดการไฟล์ภาพ เช่น แปลง base64 หรือคัดลอกไฟล์
                break;
        }

        await fs.writeFile(`${currentPath}${ext}`, content);
    }
}
