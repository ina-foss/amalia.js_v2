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


    /**
     * Convert Base64 string to array encoding
     */
    private static uint6ToB64(nUint6: number) {
        return nUint6 < 26 ? nUint6 + 65 : nUint6 < 52 ? nUint6 + 71 : nUint6 < 62 ? nUint6 - 4 : nUint6 === 62 ? 43 : nUint6 === 63 ? 47 : 65;
    }

    /**
     * Array of bytes to base64 string decoding
     *
     */
    private static b64ToUint6(nChr: number) {
        return nChr > 64 && nChr < 91 ? nChr - 65 : nChr > 96 && nChr < 123 ? nChr - 71 : nChr > 47 && nChr < 58 ? nChr + 4 : nChr === 43 ? 62 : nChr === 47 ? 63 : 0;

    }

    /**
     * Decode base64 to array
     * @deprecated
     */
    public static base64DecToArrOld(sBase64: string, nBlocksSize: number) {
        const sB64Enc: string = sBase64.replace(/[^A-Za-z0-9\+\/]/g, ''), nInLen = sB64Enc.length,
            nOutLen = nBlocksSize ? Math.ceil((nInLen * 3 + 1 >> 2) / nBlocksSize) * nBlocksSize : nInLen * 3 + 1 >> 2,
            taBytes = new Uint8Array(nOutLen);

        for (let nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++) {
            nMod4 = nInIdx & 3;
            nUint24 |= BaseUtils.b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << 18 - 6 * nMod4;
            if (nMod4 === 3 || nInLen - nInIdx === 1) {
                for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++) {
                    taBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255;
                }
                nUint24 = 0;
            }
        }
        return taBytes;
    }
}
