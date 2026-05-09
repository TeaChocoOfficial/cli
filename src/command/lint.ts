// -Path: "cli/src/command/lint.ts"
import { program } from 'commander';
import Actions from './function/Actions';

program
    .command('lint')
    .argument('[path]', 'path to lint', '.')
    .description('Lint code (use -w or --watch for watch mode)')
    .option('-w, --watch', 'watch for changes')
    .action(Actions.lint);
