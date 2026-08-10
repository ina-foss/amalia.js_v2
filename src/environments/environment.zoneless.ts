import packageInfo from '../../package.json';

/**
 * Variante zoneless (phase 9 du plan perf) : `ng serve -c zoneless` ou
 * `ng build -c zoneless` pour valider le player sans zone.js AVANT le flip
 * définitif. zone.js reste chargé par main.ts (compatible : le scheduler
 * zoneless n'en dépend pas), les listeners en politique 'zone' restent
 * fonctionnels (NgZone noop exécute le handler + markForCheck).
 */
export const environment = {
    production: true,
    zoneless: true,
    VERSION: packageInfo.version
};
