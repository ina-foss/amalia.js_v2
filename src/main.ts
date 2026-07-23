// Polyfills : à charger avant tout code Angular (remplacent l'ancien couple
// polyfills.ts + scripts[] d'angular.json, concaténés en tête du bundle).
import 'zone.js';
// Polyfill customized built-in elements (Safari) — IIFE auto-exécutée sans exports.
import '@ungap/custom-elements';
import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule, {
    // Coalesce les ré-entrées de zone (7 zone.run par timeupdate via PluginBase.wrapInZone)
    // et les événements DOM en un seul cycle de change detection par frame.
    ngZoneEventCoalescing: true,
    ngZoneRunCoalescing: true,
})
    .catch(err => console.error(err));
