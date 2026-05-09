// -Path: "cli/src/command/format.ts"
import { program } from 'commander';
import Actions from './function/Actions';

program
    .command('format')
    .argument('[path]', 'path to format', '.')
    .description('Format code (use -w or --watch for watch mode)')
    .option('-w, --watch', 'watch for changes')
    .action(Actions.format);
