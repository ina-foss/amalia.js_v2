import * as _ from 'lodash';

/**
 * In charge to handle search text
 */
export class TextUtils {
    /** Removes all special characters from a string (ex: 'é' => 'e') */
    public static removeDiacritics(str: string): string {
        return str.normalize('NFD').replace(/\p{Diacritic}/gu, '');
    }
    /**
     * Utils in charge search text with normalize
     * @param text main text
     * @param searchText search text
     */
    public static hasSearchText(text: string, searchText: string): boolean {
        if (typeof text === 'string' && typeof searchText === 'string') {
            let normalizeText = text.trim().toLocaleLowerCase();
            let normalizeSearchText = searchText.trim().toLocaleLowerCase();
            normalizeText = this.removeDiacritics(normalizeText);
            normalizeSearchText = this.removeDiacritics(normalizeSearchText);
            const searchRegexp = new RegExp('(^' + normalizeSearchText + '\\w*)', 'i');
            // const searchRegexp = new RegExp(searchText.normalize('NFC').toLocaleLowerCase(), 'i');
            return normalizeText.search(searchRegexp) !== -1;
        }
        return false;
    }
}
