//-Path: "cli/src/class/obj.ts"
/**
 * Utility class for object operations
 */
export abstract class Obj {
    /**
     * Get object keys
     * @param value - Object to get keys from
     * @returns Array of keys
     */
    static keys<Value extends object>(value: Value): (keyof Value)[] {
        return Object.keys(value) as (keyof Value)[];
    }
    /**
     * Get object values
     * @param object - Object to get values from
     * @returns Array of values
     */
    static values<Value extends object>(object: Value): Value[keyof Value][] {
        return Object.values(object) as Value[keyof Value][];
    }
    /**
     * Check if value is an object
     * @param obj - Value to check
     * @returns True if value is an object
     */
    static isObject(obj: any): obj is object {
        return obj !== null && typeof obj === "object" && !Array.isArray(obj);
    }
    /**
     * Reduce object to a single value
     * @param obj - Object to reduce
     * @param callbackfn - Callback function for reduction
     * @param initialValue - Initial value for reduction
     * @returns Reduced value
     */
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
    /**
     * Amend object by transforming values
     * @param obj - Object to amend
     * @param callbackfn - Callback function to transform values
     * @returns Amended object
     */
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
    ): NewObject {
        return this.reduce<Object, NewObject>(
            obj,
            (previousValue, currentKey, currentValue, currentIndex, array) => {
                const newValue = callbackfn(
                    currentKey,
                    currentValue,
                    currentIndex,
                    array,
                );
                (previousValue as unknown as Object)[currentKey] =
                    newValue as unknown as Object[keyof Object];
                return previousValue;
            },
            obj as unknown as NewObject,
        );
    }
    /**
     * Map object values to new array
     * @param obj - Object to map
     * @param callbackfn - Callback function to transform values
     * @returns Mapped array
     */
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
    /**
     * Check if value is a plain object
     * @param obj - Value to check
     * @returns True if value is a plain object
     */
    static isPlainObject(obj: any): obj is object {
        if (!this.isObject(obj)) return false;
        const proto = Object.getPrototypeOf(obj);
        return proto === Object.prototype || proto === null;
    }

    /**
     * Check if value is a class instance
     * @param obj - Value to check
     * @returns True if value is a class instance
     */
    static isClassInstance(obj: any): obj is object {
        if (!this.isObject(obj)) return false;
        const proto = Object.getPrototypeOf(obj);
        return (
            proto !== Object.prototype &&
            proto !== null &&
            proto.constructor !== Object
        );
    }
    /**
     * Get object entries as key-value pairs
     * @param value - Object to get entries from
     * @returns Array of key-value pairs
     */
    static entries<Value extends object>(
        value: Value,
    ): { [K in keyof Value]: [K, Value[K]] }[keyof Value][] {
        return Object.entries(value) as {
            [K in keyof Value]: [K, Value[K]];
        }[keyof Value][];
    }
    /**
     * Omit specified keys from object
     * @param value - Object to omit keys from
     * @param keys - Keys to omit
     * @returns Object with omitted keys
     */
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
    /**
     * Deep merge multiple objects
     * @param objects - Objects to merge
     * @returns Merged object
     */
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
    /**
     * Check if object has own property
     * @param obj - Object to check
     * @param key - Key to check
     * @returns True if object has own property
     */
    static hasOwn<Object extends object>(
        obj: Object,
        key: keyof Object,
    ): key is keyof Object {
        return Object.prototype.hasOwnProperty.call(obj, key);
    }
    /**
     * Check if all object values pass test
     * @param object - Object to test
     * @param method - Test function
     * @returns True if all values pass test
     */
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
    /**
     * Filter object by values
     * @param object - Object to filter
     * @param method - Filter function
     * @returns Filtered object
     */
    static filter<Object extends object, NewObject extends object = Object>(
        object: Object,
        method: (
            value: Object[keyof Object],
            key: keyof Object,
            index: number,
            array: (keyof Object)[],
        ) => boolean,
    ): NewObject {
        return this.keys(object)
            .filter((key, index, array) =>
                method(object[key], key, index, array),
            )
            .reduce((result, key) => {
                (result as Object)[key] = object[key];
                return result;
            }, {}) as NewObject;
    }
    /**
     * Get number of keys in object
     * @param object - Object to count
     * @returns Number of keys
     */
    static leng(object: object) {
        return this.keys(object).length;
    }
}
