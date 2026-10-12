// -Path: "cli/src/command/dev.ts"
import { program } from 'commander';
import Actions from './function/Actions';

program
    .command('dev')
    .argument('[path]', 'path to dev', '.')
    .description('Dev command')
    .option('-p, --port <port>', 'Port to run the dev server on (default is random port)')
    .option('-h, --host <host>', 'Host to run the dev server on (default is 127.0.0.1)')
    .action(Actions.dev);
