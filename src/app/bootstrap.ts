import {ApplicationRef, provideZonelessChangeDetection, provideZoneChangeDetection, Type} from '@angular/core';
import {createApplication} from '@angular/platform-browser';
import {environment} from '../environments/environment';
import {provideHttpClient} from '@angular/common/http';
import {createCustomElement} from '@angular/elements';
import {ConfirmationService, MessageService} from 'primeng/api';
import {providePrimeNG} from 'primeng/config';
import {AmaliaComponent} from './player/amalia.component';
import {TimeBarPluginComponent} from './plugins/time-bar/time-bar-plugin.component';
import {ControlBarPluginComponent} from './plugins/control-bar/control-bar-plugin.component';
import {TranscriptionPluginComponent} from './plugins/transcription/transcription-plugin.component';
import {SubtitlesPluginComponent} from './plugins/subtitles/subtitles-plugin.component';
import {StoryboardPluginComponent} from './plugins/storyboard/storyboard-plugin.component';
import {HistogramPluginComponent} from './plugins/histogram/histogram-plugin.component';
import {TimelinePluginComponent} from './plugins/timeline/timeline-plugin.component';
import {AnnotationPluginComponent} from './plugins/annotation/annotation-plugin.component';
import {MediaPlayerService} from './service/media-player-service';
import {ThumbnailService} from './service/thumbnail-service';
import {FileService} from './service/file.service';
import {AmaliaPreset} from './core/styles/amalia-primeng-preset';

/**
 * Custom elements exposés par le player : sélecteur → composant Angular (standalone).
 * Même liste que l'ancien `AppModule.ngDoBootstrap()`.
 */
export const AMALIA_CUSTOM_ELEMENTS: ReadonlyArray<readonly [string, Type<unknown>]> = [
    ['amalia-player', AmaliaComponent],
    ['amalia-time-bar', TimeBarPluginComponent],
    ['amalia-control-bar', ControlBarPluginComponent],
    ['amalia-transcription', TranscriptionPluginComponent],
    ['amalia-subtitles', SubtitlesPluginComponent],
    ['amalia-storyboard', StoryboardPluginComponent],
    ['amalia-histogram', HistogramPluginComponent],
    ['amalia-timeline', TimelinePluginComponent],
    ['amalia-annotation', AnnotationPluginComponent],
];

/**
 * Démarre l'application sans composant racine (`createApplication`) puis enregistre les
 * custom elements Amalia. Remplace l'ancien couple `AppModule` (déclarations + NgModules
 * PrimeNG) / `platformBrowserDynamic().bootstrapModule(...)` : les composants sont
 * désormais standalone et portent leurs propres imports.
 */
export async function bootstrapAmaliaElements(): Promise<ApplicationRef> {
    const appRef = await createApplication({
        providers: [
            // Phase 9 (zoneless) : flip acté le 2026-08-14 — zoneless par défaut dans tous les
            // environnements (zone.js n'est plus chargé, cf. src/zone-polyfill.ts). La branche
            // zone + coalescing ne sert plus qu'à la configuration de secours `zoneful`
            // (ng build -c zoneful), conservée le temps d'une release.
            environment.zoneless
                ? provideZonelessChangeDetection()
                : provideZoneChangeDetection({eventCoalescing: true, runCoalescing: true}),
            // Remplace HttpClientModule (déprécié) — les loaders/services injectent HttpClient.
            provideHttpClient(),
            MediaPlayerService,
            ThumbnailService,
            FileService,
            MessageService,
            ConfirmationService,
            providePrimeNG({
                theme: {
                    preset: AmaliaPreset,
                    options: {
                        darkModeSelector: false
                    }
                }
            })
        ]
    });
    for (const [selector, component] of AMALIA_CUSTOM_ELEMENTS) {
        if (!customElements.get(selector)) {
            customElements.define(selector, createCustomElement(component, {injector: appRef.injector}));
        }
    }
    return appRef;
}
