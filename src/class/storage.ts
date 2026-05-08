//-Path: "cli/src/class/storage.ts"

/**
 * Get data from localStorage
 * @param key - Storage key
 * @returns Stored data or undefined
 */
export function getStorage<Data = string>(key: string): Data | undefined {
    if (localStorage?.getItem !== undefined) {
        const data = localStorage.getItem(key) as Data;
        if (data === null) {
            return undefined;
        } else {
            try {
                return JSON.parse(localStorage.getItem(key) as string) as Data;
            } catch (_) {
                return localStorage.getItem(key) as Data;
            }
        }
    }
}

/**
 * Set data to localStorage
 * @param key - Storage key
 * @param value - Value to store
 */
export function setStorage<Data = string | undefined>(
    key: string,
    value: Data,
) {
    if (localStorage?.setItem !== undefined) {
        localStorage.setItem(
            key,
            typeof value === "string" ? value : JSON.stringify(value),
        );
    }
}

/**
 * Get boolean setting from localStorage
 * @param key - Setting key
 * @param defaultValue - Default value if not set
 * @returns Setting value or default
 */
export function getSetting<Data = boolean | undefined>(
    key: string,
    defaultValue: Data = undefined as Data,
) {
    if (localStorage?.getItem !== undefined) {
        const data = localStorage.getItem(`setting ${key}`);
        if (data === "true") {
            return true as Data;
        } else if (data === "false") {
            return false as Data;
        } else if (data === null) {
            if (defaultValue !== undefined) {
                setSetting(key, defaultValue);
            }
            return defaultValue;
        } else {
            return data as Data;
        }
    }
}

/**
 * Set boolean setting to localStorage
 * @param key - Setting key
 * @param value - Value to store
 */
export function setSetting<Data = boolean | undefined>(
    key: string,
    value: Data,
) {
    if (localStorage?.setItem !== undefined) {
        localStorage.setItem(
            `setting ${key}`,
            typeof value === "boolean"
                ? value === true
                    ? "true"
                    : "false"
                : typeof value === "string"
                ? value
                : JSON.stringify(value),
        );
    }
}
