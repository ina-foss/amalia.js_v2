import {BrowserModule} from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, Injector, NgModule} from '@angular/core';
import {AmaliaComponent} from './player/amalia.component';
import {createCustomElement} from '@angular/elements';
import {HttpClientModule} from '@angular/common/http';
import {MediaPlayerElement} from './core/media-player-element';
import {DefaultLogger} from './core/logger/default-logger';
import {FormsModule} from '@angular/forms';
import {TcFormatPipe} from './core/utils/tc-format.pipe';
import {TimeBarPluginComponent} from './plugins/time-bar/time-bar-plugin.component';
import {ControlBarPluginComponent} from './plugins/control-bar/control-bar-plugin.component';
import {TranscriptionPluginComponent} from './plugins/transcription/transcription-plugin.component';
import {SubtitlesPluginComponent} from './plugins/subtitles/subtitles-plugin.component';

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule
    ],
    declarations: [
        AmaliaComponent,
        TcFormatPipe,
        ControlBarPluginComponent,
        TimeBarPluginComponent,
        TranscriptionPluginComponent,
        SubtitlesPluginComponent
    ],
    entryComponents: [AmaliaComponent],
    providers: [DefaultLogger, MediaPlayerElement],
    bootstrap: [],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class AppModule {
    private readonly injector: Injector;

    constructor(injector: Injector) {
        this.injector = injector;
    }

    ngDoBootstrap() {
        const customElementAmalia = createCustomElement(AmaliaComponent, {injector: this.injector});
        customElements.define('amalia-player', customElementAmalia);

        const timeBarPlugin = createCustomElement(TimeBarPluginComponent, {injector: this.injector});
        customElements.define('amalia-time-bar', timeBarPlugin);

        const controlBarPlugin = createCustomElement(ControlBarPluginComponent, {injector: this.injector});
        customElements.define('amalia-control-bar', controlBarPlugin);

        const transcriptionPlugin = createCustomElement(TranscriptionPluginComponent, {injector: this.injector});
        customElements.define('amalia-transcription', transcriptionPlugin);

        const subtitlesPluginComponent = createCustomElement(SubtitlesPluginComponent, {injector: this.injector});
        customElements.define('amalia-subtitles', subtitlesPluginComponent);
    }
}
