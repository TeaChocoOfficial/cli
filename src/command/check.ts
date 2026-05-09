// -Path: "cli/src/command/check.ts"
import { program } from 'commander';
import Actions from './function/Actions';

program
    .command('check')
    .argument('[path]', 'path to check', '.')
    .description('Check code (use -w or --watch for watch mode)')
    .option('-w, --watch', 'watch for changes')
    .action(Actions.check);
