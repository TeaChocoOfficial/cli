//-Path: "cli/src/command/help.ts"
import { program } from "commander";

// Show help when no arguments are provided or when using -h
program.on("--help", () => {
    console.log("");
    console.log("Examples:");
    console.log(
        "  $ \"tcc render {path have teachoco-dev.yaml file}\"  Render project structure from YAML file",
    );
});
