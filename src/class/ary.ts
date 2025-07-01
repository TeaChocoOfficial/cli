//-Path: "cli/src/class/ary.ts"
export abstract class Ary {
    static is(ary: unknown): ary is any[] {
        return Array.isArray(ary);
    }
    static first<Value>(ary: Value[]): Value {
        return ary[0];
    }
    static last<Value>(ary: Value[]): Value {
        return ary[ary.length - 1];
    }
    static random<Value>(array: Value[]): Value {
        return array.length > 0
            ? array[Math.floor(Math.random() * array.length)]
            : array[0];
    }
    static shuffle<Value>(array: Value[]): Value[] {
        if (array?.length > 1) array.sort(() => Math.random() - 0.5);
        return array;
    }
}
