import {enableProdMode} from '@angular/core';
import 'zone.js';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule, {ngZone: (window as any).amaliaNgZone})
    .catch(err => console.error(err));
