// -Path: "cli/src/command/function/structure/StructureData.ts"
import fs from 'fs-extra';
import chalk from 'chalk';
import yaml from 'js-yaml';
import path from 'node:path';
import ActionConfig from '../config/ActionConfig';
import { StructureDataJson } from '../../types/structure/structure';

export default class StructureData extends ActionConfig {
    public structureData: StructureDataJson | null = null;

    getPath(
        targetPath: string,
        basePath: string = '.',
        structurePath: string = 'teachoco-dev.yaml',
    ): string {
        super.getPath(targetPath, basePath);
        const fullStructurePath = path.join(process.cwd(), this.basePath, structurePath);
        return fullStructurePath;
    }

    async getData(structurePath: string): Promise<StructureDataJson | null> {
        if (!fs.existsSync(structurePath)) return null;
        const structureContent = await fs.readFile(structurePath, 'utf8');
        console.log(chalk.green(`🦴 Reading structure from ${structurePath}`));
        if (structurePath.endsWith('.yaml') || structurePath.endsWith('.yml'))
            return this.setData(yaml.load(structureContent) as StructureDataJson);
        else if (structurePath.endsWith('.json'))
            return this.setData(JSON.parse(structureContent) as StructureDataJson);
        throw new Error('Structure file must be a YAML or JSON file');
    }

    setData = (data: StructureDataJson) => (this.structureData = data);

    getRootPath = (...paths: string[]) => path.join(process.cwd(), this.basePath, ...paths);
}
