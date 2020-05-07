export class BaseUtils {
    /**
     * Handle decode base 64
     */
    public static base64DecToArr(sBase64: string): Uint8Array {
        const binaryString = decodeURIComponent(escape(window.atob(sBase64)));
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    }

    /**
     * generate groups of 4 random characters
     * @example getUniqueId(1) : 607f
     * @example getUniqueId(2) : 95ca-361a-f8a1-1e73
     */
    public static getUniqueId(parts: number = 1): string {
        const stringArr = [];
        for (let i = 0; i < parts; i++) {
            // tslint:disable-next-line:no-bitwise
            const S4 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            stringArr.push(S4);
        }
        return stringArr.join('-');
    }
}
