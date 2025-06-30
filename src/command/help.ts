//-Path: "cli/src/command/help.ts"
import { program } from "commander";

// แสดง help เมื่อไม่มี argument หรือใช้ -h
program.on("--help", () => {
    console.log("");
    console.log("Examples:");
    console.log(
        "  $ \"tcc render {path have teachoco-dev.yaml file}\"  Render project structure from YAML file",
    );
});
