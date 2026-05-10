// -Path: "cli/src/command/function/config/getConfig.ts"
import { Obj } from '../../../class/obj';
import findConfigJson from './findConfigJson';
import { TccConfigJson } from '../../types/config/config';

export default async function getConfig(
    targetPath: string,
    optionConfigs: TccConfigJson = {},
): Promise<TccConfigJson> {
    try {
        const configJson = await findConfigJson(targetPath);
        return Obj.mix(configJson, optionConfigs);
    } catch (_err) {
        return optionConfigs;
    }
}
