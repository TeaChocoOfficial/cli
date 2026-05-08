// -Path: "cli/src/command/function/config/getConfig.ts"
import { Obj } from "../../../class/obj";
import findConfigJson from "./findConfigJson";
import { TccConfigJson } from "../../types/config";

export default async function getConfig(
    targetPath: string,
    defaultConfig: TccConfigJson,
): Promise<TccConfigJson> {
    try {
        const configJson = await findConfigJson(targetPath);
        return Obj.mix(defaultConfig, configJson);
    } catch (_err) {
        return defaultConfig;
    }
}
