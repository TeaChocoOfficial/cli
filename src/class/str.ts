//-Path: "cli/src/class/str.ts"

/**
 * Utility class for string operations
 */
export abstract class Str {
    /**
     * Truncate text to maximum length
     * @param text - Text to truncate
     * @param max - Maximum length
     * @returns Truncated text with ellipsis or original text
     */
    static max(text?: string | number, max: number = 20): string | undefined {
        if (typeof text == "string") {
            const Text = text.toString();
            return Text.length > max ? Text.substring(0, max) + "..." : Text;
        }
    }
}
