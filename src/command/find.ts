// -Path: "cli/src/command/find.ts"
import { program } from 'commander';
import Actions from './function/Actions';

program
    .command('find')
    .argument('[path]', 'path to find tcc.config.json', '.')
    .description('Find tcc.config.json in the specified directory')
    .action(Actions.find);
