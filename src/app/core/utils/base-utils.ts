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
        const randomBuffer = new Uint16Array(parts);
        globalThis.crypto.getRandomValues(randomBuffer);
        for (let i = 0; i < parts; i++) {
            const S4 = randomBuffer[i].toString(16).padStart(4, '0');
            stringArr.push(S4);
        }
        return stringArr.join('-');
    }
}
