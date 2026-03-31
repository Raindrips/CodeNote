export namespace Utils {
    // 货币, 逗号, 小数点保留2位
    export function formatCurrency(chips: number, currency: string) {
        chips = point(chips);
        return numberToSplitClamp(chips, 0, 2, currency);
    }

    // 逗号,小数点保留2位
    export function formatNumber(chips: number) {
        chips = point(chips);
        return numberToSplitClamp(chips, 0, 2);
    }

    /**
     * 数字保留N位小数     point(1.2345678)  return 1.23
     * @param val
     * @param n
     * @returns
     */
    export function point(val: number, n: number = 2) {
        const p = n * Math.pow(10, n);
        return Math.round(val * p) / p;
    }

    /**
     * 转美式计数字符串
     * @param value 数字
     * @example
     * 123456789 = 123,456,789
     */
    export function numberToSplitClamp(
        value: number,
        minFD: number,
        maxFD: number,
        currency?: string
    ): string {
        if (currency && currency.length > 0) {
            return value.toLocaleString(undefined, {
                style: "currency",
                currency: currency,
                minimumFractionDigits: minFD,
                maximumFractionDigits: maxFD,
            });
        } else {
            return value.toLocaleString(undefined, {
                minimumFractionDigits: minFD,
                maximumFractionDigits: maxFD,
            });
        }
    }
}

// example
console.log(Utils.formatCurrency(100123456, "CNY"));
console.log(Utils.formatNumber(100123456.5677));
