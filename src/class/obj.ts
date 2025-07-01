//-Path: "cli/src/class/obj.ts"
export abstract class Obj {
    static keys<Value extends object>(value: Value): (keyof Value)[] {
        return Object.keys(value) as (keyof Value)[];
    }
    static values<Value extends object>(object: Value): Value[keyof Value][] {
        return Object.values(object) as Value[keyof Value][];
    }
    static isObject(obj: any): obj is object {
        return obj !== null && typeof obj === "object" && !Array.isArray(obj);
    }
    static reduce<Object extends object = object, InitialValue = Object>(
        obj: Object,
        callbackfn: (
            previousValue: InitialValue,
            currentKey: keyof Object,
            currentValue: Object[keyof Object],
            currentIndex: number,
            array: (keyof Object)[],
        ) => InitialValue,
        initialValue: InitialValue,
    ) {
        return this.keys(obj).reduce(
            (previousValue, currentKey, currentIndex, array) => {
                const currentValue = obj[currentKey];
                return callbackfn(
                    previousValue,
                    currentKey,
                    currentValue,
                    currentIndex,
                    array,
                );
            },
            initialValue,
        );
    }
    static amend<
        Object extends object = object,
        NewObject extends object = Object,
    >(
        obj: Object,
        callbackfn: (
            currentKey: keyof Object,
            currentValue: Object[keyof Object],
            currentIndex: number,
            array: (keyof Object)[],
        ) => NewObject[keyof NewObject],
    ) {
        return this.reduce<Object, Object>(
            obj,
            (previousValue, currentKey, currentValue, currentIndex, array) => {
                const newValue = callbackfn(
                    currentKey,
                    currentValue,
                    currentIndex,
                    array,
                );
                previousValue[currentKey] =
                    newValue as unknown as Object[keyof Object];
                return previousValue;
            },
            obj,
        );
    }
    static map<Value, Object extends object = object>(
        obj: Object,
        callbackfn: (
            value: Object[keyof Object],
            key: keyof Object,
            index: number,
            array: (keyof Object)[],
        ) => Value,
    ): Value[] {
        return this.keys(obj).map((key, index, array) => {
            const value = obj[key];
            return callbackfn(value, key, index, array);
        }, []);
    }
    static isPlainObject(obj: any): obj is object {
        if (!this.isObject(obj)) return false;
        const proto = Object.getPrototypeOf(obj);
        return proto === Object.prototype || proto === null;
    }

    static isClassInstance(obj: any): obj is object {
        if (!this.isObject(obj)) return false;
        const proto = Object.getPrototypeOf(obj);
        return (
            proto !== Object.prototype &&
            proto !== null &&
            proto.constructor !== Object
        );
    }
    static entries<Value extends object>(
        value: Value,
    ): { [K in keyof Value]: [K, Value[K]] }[keyof Value][] {
        return Object.entries(value) as {
            [K in keyof Value]: [K, Value[K]];
        }[keyof Value][];
    }
    static omit<Value extends object, Key extends keyof Value>(
        value: Value,
        ...keys: Key[]
    ): Omit<Value, Key> {
        const result = { ...value };
        keys.forEach((key) => {
            delete result[key];
        });
        return result as Omit<Value, Key>;
    }
    static mix<MixObject extends object>(...objects: object[]): MixObject {
        return objects.reduce(
            (result: Record<string, any>, current: Record<string, any>) => {
                if (!this.isPlainObject(current)) return result;
                this.keys(current).forEach((key: string) => {
                    const resultValue = result[key];
                    const currentValue = current[key];
                    if (
                        this.isPlainObject(resultValue) &&
                        this.isPlainObject(currentValue)
                    ) {
                        result[key] = this.mix(resultValue, currentValue);
                    } else if (currentValue !== undefined) {
                        result[key] = currentValue;
                    }
                });
                return result;
            },
            {} as MixObject,
        ) as MixObject;
    }
    static hasOwn<Object extends object>(
        obj: Object,
        key: keyof Object,
    ): key is keyof Object {
        return Object.prototype.hasOwnProperty.call(obj, key);
    }
    static every<Object extends object>(
        object: Object,
        method: (
            value: Object[keyof Object],
            key: keyof Object,
            index: number,
            array: (keyof Object)[],
        ) => boolean,
    ): boolean {
        return this.keys(object).every((key, index, array) =>
            method(object[key], key, index, array),
        );
    }
}
