import packageInfo from '../../package.json';

export const environment = {
    production: true,
    /**
     * Phase 9 (zoneless) : false tant que le gate « phases 1-8 en prod ≥ 1 cycle de
     * release » n'est pas passé. Le flip final = passer ce flag à true (et retirer
     * l'import de zone.js dans main.ts). Cf. docs/refactoring/PLAN-PERF-2026.md.
     */
    zoneless: false,
    VERSION: packageInfo.version
};
