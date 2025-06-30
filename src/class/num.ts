//-Path: "cli/src/class/num.ts"
export abstract class Num {
    static format(number: number): string {
        return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    }
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
    static zeroNumber(num: number, index: number = 1): string {
        return (num < 10 ** index ? "0" + num : num).toString();
    }
    static fixed(num: number): number {
        return Math.round(num * 100) / 100;
    }
}
