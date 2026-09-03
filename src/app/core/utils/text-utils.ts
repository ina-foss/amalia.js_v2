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
            const searchRegexp = new RegExp('(.*' + normalizeSearchText + '.*)', 'i');
            return normalizeText.search(searchRegexp) !== -1;
        }
        return false;
    }

    /**
     * Mets le premier caractère du mot en majuscule
     */
    public static capitalizeFirstLetter(word) {
        if (!word) return word; // Vérifie si le mot n'est pas vide
        return word.charAt(0).toUpperCase() + word.slice(1);
    }

    /**
     * Nettoie un texte de transcription avant copie : supprime les espaces multiples
     * ainsi que les espaces autour des apostrophes et des tirets de mots composés
     * (ex: "d 'un", "d' un" => "d'un", "France -Ukraine" => "France-Ukraine").
     */
    public static formatCopiedText(text: string): string {
        if (!text) return text;
        return text
            .replace(/(\w)\s*'\s*(\w)/g, "$1'$2")
            .replace(/(\w)\s*-\s*(\w)/g, '$1-$2')
            .replace(/[ \t]{2,}/g, ' ')
            .trim();
    }
}
