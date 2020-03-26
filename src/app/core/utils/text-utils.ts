import * as _ from 'lodash';

/**
 * In charge to handle search text
 */
export class TextUtils {
    /**
     * Utils in charge search text with normalize
     * @param text main text
     * @param searchText search text
     */
    public static hasSearchText(text: string, searchText: string): boolean {
        if (typeof text === 'string' && typeof searchText === 'string') {
            const normalizeText = _.deburr(text.normalize('NFC').trim().toLocaleLowerCase());
            const searchRegexp = new RegExp(searchText.normalize('NFC').toLocaleLowerCase(), 'ig');
            return normalizeText.search(searchRegexp) !== -1;
        }
        return false;
    }
}
