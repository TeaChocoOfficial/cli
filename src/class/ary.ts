//-Path: "cli/src/class/ary.ts"
/**
 * Utility class for array operations
 */
export abstract class Ary {
    /**
     * Check if value is an array
     * @param ary - Value to check
     * @returns True if value is an array
     */
    static is(ary: unknown): ary is any[] {
        return Array.isArray(ary);
    }
    /**
     * Get first element of array
     * @param ary - Array to get first element from
     * @returns First element
     */
    static first<Value>(ary: Value[]): Value {
        return ary[0];
    }
    /**
     * Get last element of array
     * @param ary - Array to get last element from
     * @returns Last element
     */
    static last<Value>(ary: Value[]): Value {
        return ary[ary.length - 1];
    }
    /**
     * Get random element from array
     * @param array - Array to get random element from
     * @returns Random element
     */
    static random<Value>(array: Value[]): Value {
        return array.length > 0
            ? array[Math.floor(Math.random() * array.length)]
            : array[0];
    }
    /**
     * Shuffle array randomly
     * @param array - Array to shuffle
     * @returns Shuffled array
     */
    static shuffle<Value>(array: Value[]): Value[] {
        if (array?.length > 1) array.sort(() => Math.random() - 0.5);
        return array;
    }
}
