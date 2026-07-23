import {enableProdMode} from '@angular/core';
import 'zone.js';
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
