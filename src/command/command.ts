//-Path: "cli/src/command/command.ts"
import "./help";
import "./render";
import { program } from "commander";

// กำหนดข้อมูลพื้นฐานของโปรแกรม
program
    .name("tcc")
    .description("CLI tool to create project structure from YAML configuration")
    .version(process.version);

program.parse(process.argv);

// ถ้าไม่มี argument ให้แสดง help
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
