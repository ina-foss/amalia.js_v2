import {BrowserModule} from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, Injector, NgModule} from '@angular/core';
import {AmaliaComponent} from './player/amalia.component';
import {createCustomElement} from '@angular/elements';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {TcFormatPipe} from './core/utils/tc-format.pipe';
import {TimeBarPluginComponent} from './plugins/time-bar/time-bar-plugin.component';
import {ControlBarPluginComponent} from './plugins/control-bar/control-bar-plugin.component';
import {TranscriptionPluginComponent} from './plugins/transcription/transcription-plugin.component';
import {SubtitlesPluginComponent} from './plugins/subtitles/subtitles-plugin.component';
import {StoryboardPluginComponent} from './plugins/storyboard/storyboard-plugin.component';
import {HistogramPluginComponent} from './plugins/histogram/histogram-plugin.component';
import {MediaPlayerService} from './service/media-player-service';
import {ThumbnailService} from './service/thumbnail-service';
import {SanitizeHtmlPipe} from './core/utils/sanitize-html.pipe';
import {TimelinePluginComponent} from './plugins/timeline/timeline-plugin.component';
import {TooltipModule} from 'ng2-tooltip-directive-major-angular-updates';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SortablejsDirective} from "./core/directive/inaSortablejs/sortablejs.directive";

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,
        TooltipModule
    ],
    declarations: [
        AmaliaComponent,
        TcFormatPipe,
        SanitizeHtmlPipe,
        ControlBarPluginComponent,
        TimeBarPluginComponent,
        TranscriptionPluginComponent,
        SubtitlesPluginComponent,
        StoryboardPluginComponent,
        HistogramPluginComponent,
        TimelinePluginComponent,
        SortablejsDirective
    ],
    providers: [
        MediaPlayerService,
        ThumbnailService
    ],

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

        const storyboardPluginComponent = createCustomElement(StoryboardPluginComponent, {injector: this.injector});
        customElements.define('amalia-storyboard', storyboardPluginComponent);

        const histogramPluginComponent = createCustomElement(HistogramPluginComponent, {injector: this.injector});
        customElements.define('amalia-histogram', histogramPluginComponent);

        const timelinePluginComponent = createCustomElement(TimelinePluginComponent, {injector: this.injector});
        customElements.define('amalia-timeline', timelinePluginComponent);

    }
}
