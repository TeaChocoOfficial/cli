// -Path: "cli/src/command/init.ts"
import { program } from 'commander';
import Actions from './function/Actions';

program
    .command('init')
    .argument('[path]', 'path to create config file', '.')
    .description('Create a default tcc.config.json in the specified directory')
    .option('-f, --force', 'overwrite existing config file')
    .action(Actions.init);
