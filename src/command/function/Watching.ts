// -Path: "cli/src/command/function/Watching.ts"
import chalk from 'chalk';
import chokidar from 'chokidar';

export default class Watching {
    private onceCallback: () => Promise<void> = async () => {};
    private onChangeCallback?: (filePath: string) => Promise<void>;

    constructor(private watchingPath: string) {}

    async once(callback: () => Promise<void>) {
        this.onceCallback = callback;
        return this;
    }

    async onChange(callback: (filePath: string) => Promise<void>) {
        this.onChangeCallback = callback;
        return this;
    }

    async runing(watching?: boolean) {
        if (watching) {
            console.log(chalk.blue.bold(`👀 Watching for changes in ${this.watchingPath}\\...\n`));
            await this.onceCallback();

            // Use chokidar to detect changes
            const watcher = chokidar.watch(this.watchingPath, {
                persistent: true,
                ignoreInitial: false,
            });

            watcher.on('change', this.onChangeCallback ?? this.onceCallback);

            watcher.on('error', (error) => console.error(chalk.red(`❌ Watcher error: ${error}`)));
        } else {
            await this.onceCallback();
        }
    }
}
