// -Path: "cli/src/command/make.ts"
import { program } from 'commander';
import Actions from './function/Actions';

export interface MakeOptions {
    run?: string;
    name?: string;
    force?: boolean;
    watch?: boolean;
    output?: string;
    basePath?: string;
}

program
    .command('make')
    .argument('[path]', 'path to scan for folder structure (default: current directory)', '.')
    .option('-f, --force', 'force overwrite existing files')
    .option('-b, --base [path]', 'base path for the project', '.')
    .option('-w, --watch', 'watch for changes and update the output file')
    .option('-o, --output <file>', 'output YAML or JSON file name')
    .option('-n, --name <name>', 'workspace name', 'my-workspace')
    .option('-r, --run <command>', 'run command', 'npm start')
    .description('Generate teachoco-dev.yaml from existing folder structure')
    .action(Actions.make);
