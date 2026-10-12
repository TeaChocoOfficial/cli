// -Path: "cli/src/command/function/server/Dev.ts"
import fs from 'fs-extra';
import chalk from 'chalk';
import path from 'node:path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { createServer, Plugin } from 'vite';
import configureServer from './configureServer';
import ActionConfig from '../config/ActionConfig';

export default class Dev extends ActionConfig {
    getHost(): string {
        return this.tccConfig.server?.host ?? '127.0.0.1';
    }

    getPort(): number {
        const port = Number(this.tccConfig.server?.port);
        if (port) return port;
        const random = Math.floor(Math.random() * 10000) + 10000;
        return random;
    }

    getBase(): string {
        return this.tccConfig.server?.base ?? '/';
    }

    private getDevUiPath(): string {
        const bundled = path.join(__dirname, 'ui');
        if (fs.existsSync(bundled)) return bundled;
        return path.resolve(__dirname, '../../../../ui');
    }

    apiPlugin(): Plugin {
        return { name: 'api-server', configureServer };
    }

    async listen(): Promise<void> {
        const time = Date.now();
        const host = this.getHost();
        const port = this.getPort();
        const base = this.getBase();
        const devUiPath = this.getDevUiPath();
        const open = this.tccConfig.server?.open ?? true;

        const server = await createServer({
            plugins: [react(), tailwindcss(), this.apiPlugin()],
            root: devUiPath,
            base,
            server: { host, port, open },
            resolve: { preserveSymlinks: false },
        });

        await server.listen();

        console.log(
            ` 🧋  ${chalk.bold(chalk.hex('#FF69B4')('Choco Developer Server'))} ${chalk.gray('created by')} ${chalk.bold(chalk.blue('TeaChoco'))} ${chalk.gray(`ready in ${Date.now() - time} ms`)}\n`,
        );
        server.printUrls();
    }
}
