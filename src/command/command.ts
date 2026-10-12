//-Path: "cli/src/command/command.ts"
import './dev';
import './help';
import './find';
import './init';
import './lint';
import './check';
import './format';
import { pkg } from '../config/pkg';
import { program } from 'commander';

program
    .name('tcc')
    .description('TeaChoco CLI tool')
    .version(pkg.version)
    .action(() => {
        console.log(`🧋  Welcome to TeaChoco CLI ${pkg.version}`);
        program.outputHelp();
    });

program.parseAsync().catch((error) => {
    console.error(error);
    process.exit(1);
});
