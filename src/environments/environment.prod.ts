import packageInfo from '../../package.json';

export const environment = {
    production: true,
    /**
     * Phase 9 (zoneless) : flip acté le 2026-08-14 (gate « 1 cycle de release » levé sur
     * décision) — zone.js n'est plus chargé (cf. src/zone-polyfill.ts) et le bootstrap
     * utilise provideZonelessChangeDetection(). Secours : `ng build -c zoneful`.
     * Cf. docs/refactoring/PLAN-PERF-2026.md.
     */
    zoneless: true,
    VERSION: packageInfo.version
};
