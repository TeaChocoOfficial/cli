//-Path: "cli/src/class/num.ts"
/**
 * Utility class for number operations
 */
export abstract class Num {
    /**
     * Format number with thousand separators
     * @param number - Number to format
     * @returns Formatted number string
     */
    static format(number: number): string {
        return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    }
    /**
     * Format number with suffix (k, m, g, t, p, e, z, y)
     * @param num - Number to format
     * @param decimal - Number of decimal places
     * @returns Formatted number with suffix
     */
    static count(num: number, decimal: number = 2): string {
        const suffixes = ["", "k", "m", "g", "t", "p", "e", "z", "y"];
        let i = 0;

        while (num >= 1000 && i < suffixes.length - 1) {
            num /= 1000;
            i++;
        }
        const formattedNum = this.rounding(num, decimal).toString();

        if (!formattedNum.includes(".")) {
            return `${formattedNum}${suffixes[i]}`;
        }

        const [integerPart, decimalPart] = formattedNum.split(".");
        if (!decimalPart.replace(/0/g, "")) {
            return `${integerPart}${suffixes[i]}`;
        }

        return `${formattedNum}${suffixes[i]}`;
    }
    /**
     * Round number to specified decimal places
     * @param num - Number to round
     * @param decimal - Number of decimal places
     * @returns Rounded number
     */
    static rounding(num: number, decimal: number = 2): number {
        const [integerPart, decimalPart] = String(num).split(".");
        if (decimalPart) {
            const fixedNumber = parseFloat(
                integerPart + "." + decimalPart.substring(0, decimal),
            );
            return fixedNumber;
        } else if (integerPart) {
            return parseFloat(integerPart);
        } else {
            return num;
        }
    }
    /**
     * Add leading zeros to number
     * @param num - Number to format
     * @param index - Number of digits
     * @returns Number string with leading zeros
     */
    static zeroNumber(num: number, index: number = 1): string {
        return (num < 10 ** index ? "0" + num : num).toString();
    }
    /**
     * Round number to 2 decimal places
     * @param num - Number to fix
     * @returns Number rounded to 2 decimal places
     */
    static fixed(num: number): number {
        return Math.round(num * 100) / 100;
    }
}
