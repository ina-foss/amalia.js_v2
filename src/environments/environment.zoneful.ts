import packageInfo from '../../package.json';

/**
 * Configuration de secours post-flip zoneless (phase 9 du plan perf) :
 * `ng build -c zoneful` produit un bundle de production zoné (zone.js rechargé par
 * zone-polyfill.zoneful.ts + provideZoneChangeDetection avec coalescing), identique au
 * comportement pré-flip. À supprimer après une release zoneless sans incident.
 */
export const environment = {
    production: true,
    zoneless: false,
    VERSION: packageInfo.version
};
