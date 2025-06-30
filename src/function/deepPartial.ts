//-Path: "cli/src/function/deepPartial.ts"

export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export function deepPartial<Data>(data: Data, deep: DeepPartial<Data>): Data {
    const newData = { ...data, ...deep };
    return newData;
}
