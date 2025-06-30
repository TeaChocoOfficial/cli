//-Path: "cli/src/class/str.ts"

export abstract class Str {
    static max(text?: string | number, max: number = 20): string | undefined {
        if (typeof text == "string") {
            const Text = text.toString();
            return Text.length > max ? Text.substring(0, max) + "..." : Text;
        }
    }
}
