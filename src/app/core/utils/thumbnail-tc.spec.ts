import {quantizeThumbnailTc, THUMBNAIL_TC_STEP} from './thumbnail-tc';

describe('quantizeThumbnailTc', () => {
    it('projette sur la grille 0,04 s : le même représentant que celui soudé dans l\'URL', () => {
        expect(quantizeThumbnailTc(247.592909)).toBe(247.6); // parité avec getThumbnailUrl (spec historique)
        expect(quantizeThumbnailTc(36.152)).toBe(36.16); // cible réelle mesurée en rafale ±5s
        expect(quantizeThumbnailTc(21.152)).toBe(21.16);
        expect(quantizeThumbnailTc(36.15)).toBe(36.16); // ex-clé toFixed(2) désalignée
        expect(quantizeThumbnailTc(36.2)).toBe(36.2); // déjà sur la grille
        expect(quantizeThumbnailTc(0)).toBe(0);
        expect(quantizeThumbnailTc(100)).toBe(100);
    });

    it('est idempotente (clé stable en re-normalisation)', () => {
        for (const tc of [0.01, 3.14159, 36.152, 3600.037, 5]) {
            const once = quantizeThumbnailTc(tc);
            expect(quantizeThumbnailTc(once)).toBe(once);
        }
    });

    it('laisse passer les valeurs non finies telles quelles', () => {
        expect(quantizeThumbnailTc(Number.NaN)).toBeNaN();
        expect(quantizeThumbnailTc(Infinity)).toBe(Infinity);
        expect(quantizeThumbnailTc(-Infinity)).toBe(-Infinity);
    });

    it('deux tc distants de moins d\'un pas partagent le même représentant', () => {
        expect(quantizeThumbnailTc(36.15)).toBe(quantizeThumbnailTc(36.17)); // écart 0.02 < 0.04
        expect(THUMBNAIL_TC_STEP).toBe(0.04);
    });
});
