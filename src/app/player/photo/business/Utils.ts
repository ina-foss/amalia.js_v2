export default class Utils {
    private static guidCounter = 0;
    /**
     * Check if needle is in haystack array
     * @public
     * @static
     * @param {} needle
     * @param {array} haystack
     * @return boolean
     */
    public static inArray(needle: any, haystack: any[]): boolean {
        return haystack.filter((f: any) => {
            return JSON.stringify(f) === JSON.stringify(needle);
        }).length > 0;
    }

    public static guid(): string {
        const ts = Date.now().toString(36);
        return `amaliaPhotoPlayer${ts}${Utils.getUniqueSuffix()}`;
    }

    public static truncate(str: string, limit: number = 60, overflow: string = '...') {
        const arrStr: string[] = str.trim().split('');

        if (arrStr.length > 60) {
            return arrStr.slice(0, limit).join('') + overflow;
        }
        return str;
    }

    public static isObject(item: any): boolean {
        return item && typeof item === 'object' && !Array.isArray(item);
    }

    public static mergeDeep(target: any, ...sources: any): any {
        if (!sources.length) {
            return target;
        }
        for (const source of sources) {
            Utils.mergeDeepObject(target, source);
        }
        return target;
    }

    private static mergeDeepObject(target: any, source: any): void {
        if (!Utils.isObject(target) || !Utils.isObject(source)) {
            return;
        }
        for (const key of Object.keys(source)) {
            const sourceValue = source[key];
            if (Utils.isObject(sourceValue)) {
                target[key] = Utils.isObject(target[key]) ? Object.assign({}, target[key]) : {};
                Utils.mergeDeepObject(target[key], sourceValue);
                continue;
            }
            target[key] = sourceValue;
        }
    }

    private static getUniqueSuffix(): string {
        const cryptoObj = globalThis?.crypto;
        if (cryptoObj?.getRandomValues) {
            const buffer = new Uint32Array(1);
            cryptoObj.getRandomValues(buffer);
            return buffer[0].toString(36);
        }
        Utils.guidCounter += 1;
        return Utils.guidCounter.toString(36);
    }

    public static roundToMultiple(n: number, m: number): number {
        return Math.floor(n / m) * m;
    }

    public static roundToSteps(value: number, steps: number[] = [], which: string = 'next'): number {
        for (let i: number = 0; i < steps.length - 1; i++) {
            const prev: number = steps[i];
            const next: number = steps[i + 1];
            if (which === 'prev' && value > prev && value <= next) {
                value = prev;
                break;
            } else if (which === 'next' && value >= prev && value < next) {
                value = next;
                break;
            }
        }
        return value;
    }
}
