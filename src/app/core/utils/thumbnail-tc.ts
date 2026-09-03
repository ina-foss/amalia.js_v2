/**
 * Grille temporelle des vignettes : pas de 0,04 s (grille 25 fps).
 * Source unique de vérité partagée entre la construction des URLs
 * (MediaPlayerElement.getThumbnailUrl) et les clés de cache (ThumbnailService),
 * pour que clé ⇔ URL ⇔ image restent 1:1 (cache et dédup en vol effectifs).
 */
export const THUMBNAIL_TC_STEP = 0.04;

/**
 * Quantifie un timecode sur la grille des vignettes (multiple de 0,04 s).
 * Comportement identique à l'historique MediaPlayerElement.roundThumbnailTimeCode :
 * - valeurs non finies renvoyées telles quelles (les gardes isFinite amont restent maîtresses) ;
 * - toFixed(2) final sans perte sur une grille 0,04 (un multiple de 0,04 a au plus deux
 *   décimales) : il gomme le bruit binaire de round*step (247.60000000000002 → 247.6)
 *   et donne un représentant canonique stable, utilisable comme clé de Map.
 */
export function quantizeThumbnailTc(tc: number): number {
    if (!Number.isFinite(tc)) {
        return tc;
    }
    const rounded = Math.round((tc + Number.EPSILON) / THUMBNAIL_TC_STEP) * THUMBNAIL_TC_STEP;
    return Number(rounded.toFixed(2));
}
