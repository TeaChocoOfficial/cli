// -Path: "cli/src/command/function/config/ActionConfig.ts"
import path from 'node:path';
import { TccConfigJson } from '../../types/config/config';

export default abstract class ActionConfig {
    protected basePath: string = '.';

    constructor(protected tccConfig: TccConfigJson) {}

    protected getPath(targetPath: string, basePath: string): string {
        this.basePath = path.join(targetPath, basePath ?? '.');
        const fullPath = path.join(process.cwd(), this.basePath);
        return fullPath;
    }
}
