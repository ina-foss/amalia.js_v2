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
            const normalizeText = text.normalize('NFC').trim().toLocaleLowerCase();
            const searchRegexp = new RegExp('(^' + searchText.normalize('NFC').toLocaleLowerCase() + '$)', 'i');
            // const searchRegexp = new RegExp(searchText.normalize('NFC').toLocaleLowerCase(), 'i');
            return normalizeText.search(searchRegexp) !== -1;
        }
        return false;
    }
}
