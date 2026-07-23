// Polyfills : à charger avant tout code Angular (remplacent l'ancien couple
// polyfills.ts + scripts[] d'angular.json, concaténés en tête du bundle).
import 'zone.js';
// Polyfill customized built-in elements (Safari) — IIFE auto-exécutée sans exports.
import '@ungap/custom-elements';
import {enableProdMode} from '@angular/core';

import {bootstrapAmaliaElements} from './app/bootstrap';
import {environment} from './environments/environment';

if (environment.production) {
    enableProdMode();
}

bootstrapAmaliaElements().catch(err => console.error(err));
