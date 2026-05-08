// -Path: "cli/src/function/deepPartial.ts"

/**
 * Deep partial type - makes all nested properties optional
 */
export type DeepPartial<Object> = {
    [Key in keyof Object]?: Object[Key] extends object
        ? DeepPartial<Object[Key]>
        : Object[Key];
};

/**
 * Merge data with deep partial
 * @param data - Original data
 * @param deep - Partial data to merge
 * @returns Merged data
 */
export function deepPartial<Data>(data: Data, deep: DeepPartial<Data>): Data {
    const newData = { ...data, ...deep };
    return newData;
}
