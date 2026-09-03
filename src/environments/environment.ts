// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import packageInfo from '../../package.json';

export const environment = {
    production: false,
    /** Phase 9 : change detection zoneless, flip acté (cf. environment.prod.ts et le plan perf). */
    zoneless: true,
    VERSION: packageInfo.version
};
