// Polyfills : à charger avant tout code Angular (remplacent l'ancien couple
// polyfills.ts + scripts[] d'angular.json, concaténés en tête du bundle).
// Zoneless (phase 9) : no-op par défaut ; la configuration de secours `zoneful`
// substitue zone-polyfill.zoneful.ts qui recharge zone.js.
import './zone-polyfill';
// Polyfill customized built-in elements (Safari) — IIFE auto-exécutée sans exports.
import '@ungap/custom-elements';
// Patch PrimeNG : getScrollableParents jetait sur le ShadowRoot (getComputedStyle)
// et les overlays/tooltips n'attachaient jamais leurs listeners — voir le module.
import './app/core/patches/primeng-dom-scrollable-parents';
import {enableProdMode} from '@angular/core';

import {bootstrapAmaliaElements} from './app/bootstrap';
import {environment} from './environments/environment';

if (environment.production) {
    enableProdMode();
}

bootstrapAmaliaElements().catch(err => console.error(err));
