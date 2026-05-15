import {PluginBase} from '../../core/plugin/plugin-base';
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {PlayerEventType} from '../../core/constant/event-type';
import {PluginConfigData} from '../../core/config/model/plugin-config-data';
import {HistogramConfig} from '../../core/config/model/histogram-config';
import {MediaPlayerService} from '../../service/media-player-service';
import {DefaultLogger} from '../../core/logger/default-logger';
import WaveSurfer from 'wavesurfer.js';
import Minimap from 'wavesurfer.js/dist/plugins/minimap.js';
import Timeline from 'wavesurfer.js/dist/plugins/timeline.js';
import Zoom from 'wavesurfer.js/dist/plugins/zoom.js';

/**
 * Shape of the peaks payload expected to live in `Metadata.data` for the
 * histogram plugin (produced by a custom converter on the consumer side).
 */
interface SurferPeaks {
    posbins: number[];
    negbins: number[];
}

/**
 * Histogram plugin backed by wavesurfer.js.
 *
 * Reads peaks (`{posbins, negbins}`) from the amalia {@link MetadataManager}
 * via the metadata id referenced by `pluginConfiguration.metadataIds[0]`, then
 * renders a wavesurfer instance synchronised with the main Amalia media player.
 * The component only displays the waveform (no internal media playback): time
 * is driven by {@link PlayerEventType.TIME_CHANGE} from the player and user
 * clicks on the waveform delegate to `mediaPlayer.setCurrentTime()`.
 */
@Component({
    selector: 'amalia-histogram',
    templateUrl: './histogram-plugin.component.html',
    styleUrls: ['./histogram-plugin.component.scss'],
    encapsulation: ViewEncapsulation.ShadowDom
})
export class HistogramPluginComponent extends PluginBase<HistogramConfig> implements OnInit, AfterViewInit {
    public static PLUGIN_NAME = 'HISTOGRAM';
    public static DEFAULT_PAD_PEAKS = 32;
    public static DEFAULT_WAVE_COLOR = 'rgb(54,76,97)';
    public static DEFAULT_CURSOR_COLOR = '#ffffff';
    public static DEFAULT_MIN_PX_PER_SEC = 20;
    public static DEFAULT_MIN_PX_PER_SEC_SPECTROGRAM = 180;
    public static DEFAULT_MINIMAP_HEIGHT = 30;
    private static readonly ERROR_MSG_WAVE_FORMS = 'Les formes d\'ondes n\'ont pas pu être chargées';

    @ViewChild('wavesurferContainer')
    public wavesurferContainer: ElementRef<HTMLElement>;

    /** Wavesurfer instance, created once peaks are loaded. */
    private wavesurfer: WaveSurfer | null = null;
    /** Latest peaks payload (used to recreate wavesurfer on duration change). */
    private peaks: SurferPeaks | null = null;
    /** Cached duration. */
    private duration = 0;

    public override logger: DefaultLogger;

    constructor(playerService: MediaPlayerService, private cd: ChangeDetectorRef) {
        super(playerService);
        this.pluginName = HistogramPluginComponent.PLUGIN_NAME;
    }

    ngOnInit(): void {
        this.logger = new DefaultLogger(`${this.pluginName}`);
        try {
            super.ngOnInit();
        } catch (e) {
            this.logger.debug(`An error occurred when initializing the plugin ${this.pluginName}`, e);
        }
        const config = this.mediaPlayerElement?.getConfiguration();
        if (config && config.loadMetadataOnDemand) {
            this.initWrapperWithoutAutoBind();
        }
    }

    ngAfterViewInit(): void {
        const config = this.mediaPlayerElement?.getConfiguration();
        if (config && config.loadMetadataOnDemand) {
            this.handleMetadataLoaded();
            this.cd.detectChanges();
        }
    }

    /** Exposed for test purposes (called by player when metadata loaded). */
    public handleMetaDataLoadedWrapperWithoutAutoBind(): void {
        this.handleMetadataLoaded();
    }

    init(): void {
        super.init();
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.TIME_CHANGE, this.handleOnTimeChange);
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.DURATION_CHANGE, this.handleOnDurationChange);
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.METADATA_LOADED, this.handleMetadataLoaded);
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.START_SEEKING, this.handleStartSeeking);
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.SEEKING, this.handleSeeking);
        // If metadata are already loaded by the time this plugin is created
        // (typical lazy-load via `loadDataSourceForPlugin('histogram')` resolved
        // before insertion), render immediately. Otherwise we rely on the
        // METADATA_LOADED event listener registered above.
        if (this.mediaPlayerElement.isMetadataLoaded) {
            this.handleMetadataLoaded();
        }
    }

    /** Wrapper kept for backward-compatibility with the previous SVG implementation. */
    initWrapperWithoutAutoBind(): void {
        this.init();
    }

    getDefaultConfig(): PluginConfigData<HistogramConfig> {
        return {
            name: HistogramPluginComponent.PLUGIN_NAME,
            data: {
                padPeaks: HistogramPluginComponent.DEFAULT_PAD_PEAKS,
                withSpectrogram: false,
                waveColor: HistogramPluginComponent.DEFAULT_WAVE_COLOR,
                cursorColor: HistogramPluginComponent.DEFAULT_CURSOR_COLOR,
                minimapHeight: HistogramPluginComponent.DEFAULT_MINIMAP_HEIGHT
            }
        };
    }

    /**
     * Read peaks from {@link MetadataManager} and (re)create wavesurfer.
     * Called at init when metadata are already loaded and on every METADATA_LOADED event.
     */
    public handleMetadataLoaded = (): void => {
        const metadataId = this.pluginConfiguration?.metadataIds?.[0];
        if (!metadataId) {
            this.logger?.warn('metadataIds is missing in plugin configuration');
            return;
        }
        const metadataManager = this.mediaPlayerElement?.metadataManager;
        if (!metadataManager?.hasMetadataKey(metadataId)) {
            // Metadata not yet loaded for this id; the plugin will react when
            // the METADATA_LOADED event eventually fires.
            return;
        }
        const peaks = this.extractPeaks(metadataId);
        if (!peaks) {
            this.logger?.warn(`No usable peaks payload found in metadata '${metadataId}'`);
            this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.ERROR, HistogramPluginComponent.ERROR_MSG_WAVE_FORMS);
            return;
        }
        this.peaks = peaks;
        this.duration = this.mediaPlayerElement.getMediaPlayer()?.getDuration();
        if (!this.duration || isNaN(this.duration)) {
            // Duration not ready yet; createOrUpdateWavesurfer will be called
            // again from handleOnDurationChange once the player knows it.
            return;
        }
        this.createOrUpdateWavesurfer();
        this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.ERASE_ERROR, HistogramPluginComponent.ERROR_MSG_WAVE_FORMS);
    };

    /**
     * Extract peaks from the Metadata block. The custom converter on the
     * consumer side is expected to place the surfer payload into either
     * `metadata.data` or `metadata.localisation`.
     */
    private extractPeaks(metadataId: string): SurferPeaks | null {
        try {
            const metadata = this.mediaPlayerElement.metadataManager.getMetadata(metadataId);
            const payload: any = metadata?.data ?? metadata?.localisation;
            if (payload && Array.isArray(payload.posbins) && Array.isArray(payload.negbins)) {
                return {posbins: payload.posbins, negbins: payload.negbins};
            }
        } catch (e) {
            this.logger?.warn(`Error reading peaks metadata '${metadataId}'`, e);
        }
        return null;
    }

    /**
     * Build the 2D peaks array consumed by wavesurfer (left/right channels), prepending
     * `padPeaks` zero samples on each channel as the reference implementation does.
     */
    private buildPeakData(): number[][] {
        const padCount = this.pluginConfiguration?.data?.padPeaks ?? HistogramPluginComponent.DEFAULT_PAD_PEAKS;
        const padPeaks = new Array(Math.max(0, padCount)).fill(0);
        return [
            [...padPeaks, ...(this.peaks?.posbins ?? [])],
            [...padPeaks, ...(this.peaks?.negbins ?? [])]
        ];
    }

    /**
     * Create the wavesurfer instance (destroying any previous one).
     */
    private createOrUpdateWavesurfer(): void {
        if (!this.wavesurferContainer || !this.peaks) {
            return;
        }
        this.destroyWavesurfer();

        const data = this.pluginConfiguration.data;
        const withSpectrogram = !!data.withSpectrogram;
        const waveColor = data.waveColor ?? HistogramPluginComponent.DEFAULT_WAVE_COLOR;
        const cursorColor = data.cursorColor ?? HistogramPluginComponent.DEFAULT_CURSOR_COLOR;
        const minimapHeight = data.minimapHeight ?? HistogramPluginComponent.DEFAULT_MINIMAP_HEIGHT;
        const minPxPerSec = data.minPxPerSec ?? (withSpectrogram
                ? HistogramPluginComponent.DEFAULT_MIN_PX_PER_SEC_SPECTROGRAM
                : HistogramPluginComponent.DEFAULT_MIN_PX_PER_SEC);
        const splitChannels = withSpectrogram ? false : [{waveColor}, {waveColor}];

        const plugins: any[] = [
            Timeline.create(),
            Minimap.create({
                insertPosition: 'beforebegin',
                overlayColor: 'rgba(100,100,100,0.5)',
                barWidth: 1,
                barGap: 0.1,
                cursorColor,
                cursorWidth: 2,
                splitChannels: splitChannels as any,
                waveColor,
                height: minimapHeight,
                dragToSeek: false
            })
        ];
        if (!withSpectrogram) {
            plugins.push(Zoom.create({exponentialZooming: true, maxZoom: 400}));
        }

        this.wavesurfer = WaveSurfer.create({
            container: this.wavesurferContainer.nativeElement,
            duration: this.duration,
            peaks: this.buildPeakData() as any,
            normalize: true,
            splitChannels: splitChannels as any,
            waveColor,
            minPxPerSec,
            hideScrollbar: true,
            autoCenter: true,
            autoScroll: true,
            dragToSeek: false,
            cursorColor,
            cursorWidth: 2,
            plugins
        });

        // Sync wavesurfer's "current time" with the Amalia player.
        const mediaPlayer = this.mediaPlayerElement.getMediaPlayer();
        const overriddenGetCurrentTime = () => mediaPlayer.getCurrentTime();
        const overriddenSeekTo = (progress: number) => {
            const t = mediaPlayer.reverseMode ? 1 - progress : progress;
            this.wavesurfer?.setTime(this.wavesurfer.getDuration() * t);
        };
        (this.wavesurfer as any).getCurrentTime = overriddenGetCurrentTime;
        (this.wavesurfer as any).seekTo = overriddenSeekTo;

        // User-driven seeking on the waveform delegates back to the main player.
        this.wavesurfer.on('interaction', (newTime: number) => {
            const target = mediaPlayer.reverseMode ? this.duration - newTime : newTime;
            mediaPlayer.setCurrentTime(target);
        });

        // Once wavesurfer is ready, mirror the override on the minimap sub-wavesurfer.
        this.wavesurfer.on('ready', () => {
            const minimapPlugin: any = this.wavesurfer?.getActivePlugins().find((p: any) => p.miniWavesurfer);
            if (minimapPlugin?.miniWavesurfer) {
                minimapPlugin.miniWavesurfer.getCurrentTime = overriddenGetCurrentTime;
                minimapPlugin.miniWavesurfer.seekTo = overriddenSeekTo;
            }
        });
    }

    private destroyWavesurfer(): void {
        if (this.wavesurfer) {
            try {
                this.wavesurfer.destroy();
            } catch (e) {
                this.logger?.warn('Error while destroying wavesurfer', e);
            }
            this.wavesurfer = null;
        }
    }

    /** Push the player time onto the waveform cursor on every TIME_CHANGE. */
    private handleOnTimeChange = (): void => {
        if (!this.wavesurfer) {
            return;
        }
        const currentTime = this.mediaPlayerElement.getMediaPlayer().getCurrentTime();
        // setTime is synchronous; guard against NaN.
        if (!isNaN(currentTime)) {
            this.wavesurfer.setTime(currentTime);
        }
    };

    private handleOnDurationChange = (): void => {
        const newDuration = this.mediaPlayerElement.getMediaPlayer().getDuration();
        if (newDuration && newDuration !== this.duration) {
            this.duration = newDuration;
            if (this.peaks) {
                this.createOrUpdateWavesurfer();
            } else if (this.mediaPlayerElement.isMetadataLoaded) {
                this.handleMetadataLoaded();
            }
        }
    };

    private handleStartSeeking = (): void => {
        this.mediaPlayerElement.getMediaPlayer().pause();
    };

    private handleSeeking = (time: number): void => {
        this.mediaPlayerElement.getMediaPlayer().pause();
        if (this.wavesurfer && this.duration > 0) {
            // Update progress directly without re-emitting interaction events.
            const renderer: any = (this.wavesurfer as any).renderer;
            if (renderer?.renderProgress) {
                renderer.renderProgress(time / this.duration);
            } else {
                this.wavesurfer.setTime(time);
            }
        }
    };

    override ngOnDestroy(): void {
        this.destroyWavesurfer();
        super.ngOnDestroy();
    }
}
