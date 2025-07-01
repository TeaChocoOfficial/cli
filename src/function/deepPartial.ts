//-Path: "cli/src/function/deepPartial.ts"

export type DeepPartial<Object> = {
    [Key in keyof Object]?: Object[Key] extends object
        ? DeepPartial<Object[Key]>
        : Object[Key];
};

export function deepPartial<Data>(data: Data, deep: DeepPartial<Data>): Data {
    const newData = { ...data, ...deep };
    return newData;
}
