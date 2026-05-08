// -Path: "cli/src/command/make.ts"
import * as path from 'path';
import { program } from 'commander';
import getConfig from './function/config/getConfig';
import makeStructure from './function/structure/make/makeStructure';

program
    .command('make')
    .argument('[path]', 'path to scan for folder structure (default: current directory)', '.')
    .option('-w, --watch', 'watch for changes and update the output file')
    .option('-o, --output <file>', 'output YAML or JSON file name', 'teachoco-dev.yaml')
    .option('-n, --name <name>', 'workspace name', 'my-workspace')
    .option('-r, --run <command>', 'run command', 'npm start')
    .description('Generate teachoco-dev.yaml from existing folder structure')
    .action(
        async (
            targetPath: string,
            options: { output?: string; name?: string; run?: string; watch?: boolean },
        ) => {
            const fullPath = path.resolve(process.cwd(), targetPath);
            const configJson = await getConfig(targetPath, {
                make: {
                    watch: options.watch,
                    output: options.output,
                    name: options.name,
                    run: options.run,
                },
            });
            await makeStructure(fullPath, configJson);
        },
    );
