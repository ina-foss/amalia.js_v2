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
     * Turns an image that was previously endoded in base 64 to its URL
     * @param base64EncodedThumb
     */
    public static getEncodedImage(base64EncodedThumb: string): string {
        const decodedBase64String = atob(base64EncodedThumb);
        const finalThumb = new Uint8Array(decodedBase64String.length);
        for (let i = 0; i < decodedBase64String.length; i++) {
            finalThumb[i] = decodedBase64String.charCodeAt(i);
        }
        const blob = new Blob([finalThumb], {type: 'image/png'});
        return URL.createObjectURL(blob);
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
