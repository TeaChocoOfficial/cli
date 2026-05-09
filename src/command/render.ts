// -Path: "cli/src/command/render.ts"
import { program } from 'commander';
import Actions from './function/Actions';

export type RenderOptions = {
    name?: string;
    force?: boolean;
    watch?: boolean;
};

program
    .command('render')
    .argument('[path]', 'path to YAML file (e.g., ./path/to/projects)', '.')
    .description('Render folder structure from YAML file')
    .option('-w, --watch', 'watch for changes in the YAML file and re-render')
    .option('-f, --force', 'force re-render even if no changes detected')
    .option('-n, --name <name>', 'render specific workspace by name')
    .action(Actions.render);
