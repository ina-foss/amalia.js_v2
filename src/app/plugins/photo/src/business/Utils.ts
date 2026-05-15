export default class Utils {
    /**
     * Check if needle is in haystack array
     * @public
     * @static
     * @param {} needle
     * @param {array} haystack
     * @return boolean
     */
    public static inArray(needle: any, haystack: any[]): boolean {
        return haystack.some((f: any) => {
            return JSON.stringify(f) === JSON.stringify(needle);
        });
    }

    public static guid(): string {
        const randomSeed = new Uint32Array(1);
        globalThis.crypto.getRandomValues(randomSeed);
        return 'amaliaPhotoPlayer-' + Date.now().toString() + '-' + randomSeed[0].toString();
    }

    public static truncate(str: string, limit: number = 60, overflow: string = '...') {
        const arrStr: string[] = str.trim().split('');

        if (arrStr.length > limit) {
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
        const source: any = sources.shift();

        if (Utils.isObject(target) && Utils.isObject(source)) {
            for (let key in source) {
                if (!source.hasOwnProperty(key)) {
                    continue;
                }
                if (Utils.isObject(source[key])) {
                    if (!target[key]) {
                        Object.assign(target, {[key]: {}});
                    } else {
                        target[key] = Object.assign({}, target[key])
                    }
                    Utils.mergeDeep(target[key], source[key]);
                } else {
                    Object.assign(target, {[key]: source[key]});
                }
            }
        }

        return Utils.mergeDeep(target, ...sources);
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
