import {PluginBase} from '../../core/plugin/plugin-base';
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostBinding,
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
    public static DEFAULT_MINIMAP_OVERLAY_COLOR = 'rgba(100,100,100,0.5)';
    public static DEFAULT_MIN_PX_PER_SEC = 0;
    public static DEFAULT_MIN_PX_PER_SEC_SPECTROGRAM = 180;
    public static DEFAULT_MINIMAP_HEIGHT = 30;
    public static DEFAULT_WAVEFORM_HEIGHT = 128;
    private static readonly DURATION_CHANGE_EPSILON_SECONDS = 0.1;
    private static readonly RERENDER_DEBOUNCE_MS = 200;
    private static readonly ERROR_MSG_WAVE_FORMS = 'Les formes d\'ondes n\'ont pas pu être chargées';

    @ViewChild('wavesurferContainer')
    public wavesurferContainer!: ElementRef<HTMLElement>;
    @ViewChild('minimapContainer')
    public minimapContainer!: ElementRef<HTMLElement>;
    @ViewChild('minimapHitArea')
    public minimapHitArea!: ElementRef<HTMLElement>;

    @HostBinding('style.--amalia-histogram-bottom-inset')
    public histogramBottomInset = '0px';

    public pinned = false;
    public pinnedControlbar = false;
    public displayState: string = 'l';
    private resizeDebounce: any = null;
    private pendingTimeouts = new Set<ReturnType<typeof setTimeout>>();
    private destroyed = false;
    private waveformResizeObserver: ResizeObserver | null = null;
    private controlBarResizeObserver: ResizeObserver | null = null;
    private observedControlBar: HTMLElement | null = null;
    private minimapViewportDragCleanup: (() => void) | null = null;
    private lastAppliedWaveformHeight = 0;
    private lastAppliedMinimapHeight = 0;
    private minimapPlugin: any | null = null;

    /** Wavesurfer instance, created once peaks are loaded. */
    private wavesurfer: WaveSurfer | null = null;
    /** Latest peaks payload (used to recreate wavesurfer on duration change). */
    private peaks: SurferPeaks | null = null;
    /** Cached duration. */
    private duration = 0;

    public override logger: DefaultLogger;

    constructor(
        playerService: MediaPlayerService,
        private cd: ChangeDetectorRef,
        private hostElement: ElementRef<HTMLElement>
    ) {
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
        this.scheduleTimeout(() => {
            this.attachControlBarResizeObserver();
            this.syncBottomInsetIfNeeded();
        });
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
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.CONTROL_BAR_TOGGLED, this.handleControlBarToggled);
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.PLAYER_RESIZED, this.handlePlayerResized);
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.PINNED_CONTROLBAR_CHANGE, this.handlePinnedControlbarChange);
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.PINNED_SLIDER_CHANGE, this.handlePinnedSliderChange);
        this.displayState = this.mediaPlayerElement.getDisplayState() ?? 'l';
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
        if (!this.wavesurferContainer || !this.minimapContainer || !this.minimapHitArea || !this.peaks) {
            return;
        }
        this.destroyWavesurfer();

        const data = this.pluginConfiguration.data;
        const withSpectrogram = !!data.withSpectrogram;
        const waveColor = data.waveColor ?? HistogramPluginComponent.DEFAULT_WAVE_COLOR;
        const progressColor = data.progressColor ?? waveColor;
        const minimapWaveColor = data.minimapWaveColor ?? waveColor;
        const minimapProgressColor = data.minimapProgressColor ?? progressColor;
        const minimapOverlayColor = data.minimapOverlayColor ?? HistogramPluginComponent.DEFAULT_MINIMAP_OVERLAY_COLOR;
        const cursorColor = data.cursorColor ?? HistogramPluginComponent.DEFAULT_CURSOR_COLOR;
        const minPxPerSec = data.minPxPerSec ?? (withSpectrogram
                ? HistogramPluginComponent.DEFAULT_MIN_PX_PER_SEC_SPECTROGRAM
                : HistogramPluginComponent.DEFAULT_MIN_PX_PER_SEC);
        const splitChannels = withSpectrogram ? false : [{waveColor, progressColor}, {waveColor, progressColor}];
        const waveformHeight = this.getWaveformChannelHeight(splitChannels);
        const minimapChannelHeight = this.getChannelHeight(this.getMinimapTotalHeight(), splitChannels);

        const minimapPlugin = Minimap.create({
            container: this.minimapContainer.nativeElement,
            overlayColor: minimapOverlayColor,
            barWidth: 1,
            barGap: 0.1,
            cursorColor,
            cursorWidth: 2,
            splitChannels: splitChannels as any,
            waveColor: minimapWaveColor,
            progressColor: minimapProgressColor,
            height: minimapChannelHeight,
            minPxPerSec: 0,
            fillParent: true,
            interact: false,
            dragToSeek: false
        });
        minimapPlugin.on('click', (progress: number) => this.navigateMinimapToProgress(progress));
        this.attachMinimapViewportDrag();
        this.minimapPlugin = minimapPlugin;
        this.lastAppliedMinimapHeight = minimapChannelHeight;

        const plugins: any[] = [minimapPlugin];
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
            progressColor,
            height: waveformHeight,
            minPxPerSec,
            fillParent: true,
            hideScrollbar: true,
            autoCenter: false,
            autoScroll: false,
            dragToSeek: false,
            cursorColor,
            cursorWidth: 2,
            plugins
        });

        const mediaPlayer = this.mediaPlayerElement.getMediaPlayer();
        const overriddenGetCurrentTime = () => mediaPlayer.getCurrentTime();
        const overriddenSeekTo = (progress: number) => this.seekMediaPlayerToProgress(progress);
        (this.wavesurfer as any).getCurrentTime = overriddenGetCurrentTime;
        (this.wavesurfer as any).seekTo = overriddenSeekTo;

        // User-driven seeking on the waveform delegates back to the main player.
        this.wavesurfer.on('interaction', (newTime: number) => {
            this.seekMediaPlayerToTime(newTime);
        });
        this.wavesurfer.on('ready', () => {
            const minimapPlugin: any = this.wavesurfer?.getActivePlugins().find((plugin: any) => plugin?.miniWavesurfer);
            if (minimapPlugin?.miniWavesurfer) {
                minimapPlugin.miniWavesurfer.getCurrentTime = overriddenGetCurrentTime;
                minimapPlugin.miniWavesurfer.seekTo = overriddenSeekTo;
            }
            const currentTime = this.mediaPlayerElement.getMediaPlayer()?.getCurrentTime() ?? 0;
            if (!isNaN(currentTime)) {
                this.renderVisualProgress(currentTime);
            }
        });
        this.lastAppliedWaveformHeight = waveformHeight;
        this.attachWaveformResizeObserver();
    }

    private destroyWavesurfer(): void {
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        this.queuedTime = null;
        this.waveformResizeObserver?.disconnect();
        this.waveformResizeObserver = null;
        this.minimapViewportDragCleanup?.();
        this.minimapViewportDragCleanup = null;
        this.minimapPlugin = null;
        this.lastAppliedWaveformHeight = 0;
        this.lastAppliedMinimapHeight = 0;
        if (this.wavesurfer) {
            try {
                this.wavesurfer.destroy();
            } catch (e) {
                this.logger?.warn('Error while destroying wavesurfer', e);
            }
            this.wavesurfer = null;
        }
    }

    private getChannelHeight(totalHeight: number, splitChannels: false | Array<unknown>): number {
        const safeHeight = Math.max(1, Math.floor(totalHeight || HistogramPluginComponent.DEFAULT_WAVEFORM_HEIGHT));
        return splitChannels ? Math.max(1, Math.floor(safeHeight / splitChannels.length)) : safeHeight;
    }

    private getWaveformChannelHeight(splitChannels: false | Array<unknown>): number {
        return this.getChannelHeight(this.wavesurferContainer?.nativeElement?.clientHeight ?? 0, splitChannels);
    }

    private getMinimapTotalHeight(): number {
        return Math.floor((this.minimapContainer?.nativeElement?.clientHeight ?? 0) || HistogramPluginComponent.DEFAULT_MINIMAP_HEIGHT);
    }

    private getConfiguredSplitChannels(): false | Array<unknown> {
        return this.pluginConfiguration.data.withSpectrogram ? false : [{}, {}];
    }

    private attachWaveformResizeObserver(): void {
        if (!this.wavesurferContainer || typeof ResizeObserver !== 'function') {
            return;
        }
        this.waveformResizeObserver?.disconnect();
        this.waveformResizeObserver = new ResizeObserver(() => this.scheduleWaveformSizeSync());
        this.waveformResizeObserver.observe(this.wavesurferContainer.nativeElement);
        if (this.minimapContainer) {
            this.waveformResizeObserver.observe(this.minimapContainer.nativeElement);
        }
    }

    private scheduleWaveformSizeSync(): void {
        this.cancelTimeout(this.resizeDebounce);
        this.resizeDebounce = this.scheduleTimeout(
            () => this.syncWaveformSize(),
            HistogramPluginComponent.RERENDER_DEBOUNCE_MS
        );
    }

    private syncWaveformSize(): void {
        if (!this.wavesurfer) {
            return;
        }
        this.waveformResizeObserver?.disconnect();
        const splitChannels = this.getConfiguredSplitChannels();
        const waveformHeight = this.getWaveformChannelHeight(splitChannels);
        const minimapHeight = this.getChannelHeight(this.getMinimapTotalHeight(), splitChannels);
        let changed = false;
        if (waveformHeight !== this.lastAppliedWaveformHeight) {
            this.lastAppliedWaveformHeight = waveformHeight;
            this.wavesurfer.setOptions({height: waveformHeight, fillParent: true});
            changed = true;
        }
        if (minimapHeight !== this.lastAppliedMinimapHeight) {
            this.lastAppliedMinimapHeight = minimapHeight;
            this.minimapPlugin?.miniWavesurfer?.setOptions({height: minimapHeight, fillParent: true});
            changed = true;
        }
        if (changed) {
            const currentTime = this.mediaPlayerElement.getMediaPlayer().getCurrentTime();
            this.renderVisualProgress(currentTime);
        }
        this.scheduleTimeout(() => this.attachWaveformResizeObserver());
    }

    private lastRenderedTime = -1;
    private queuedTime: number | null = null;
    private animationFrameId: number | null = null;
    private static readonly MIN_TIME_DELTA_BEFORE_REPAINT = 0.02;

    private clampProgress(progress: number): number {
        return Math.max(0, Math.min(progress, 1));
    }

    private renderProgressRatio(progress: number): void {
        if (!this.wavesurfer || isNaN(progress)) {
            return;
        }
        const safeProgress = this.clampProgress(progress);
        const renderer = (this.wavesurfer as any).getRenderer?.() ?? (this.wavesurfer as any).renderer;
        if (renderer?.renderProgress) {
            renderer.renderProgress(safeProgress, false);
        } else {
            this.wavesurfer.setTime(safeProgress * this.duration);
        }

        const activePlugins = this.wavesurfer.getActivePlugins() as any[];
        const minimapPlugin = activePlugins.find((plugin: any) => plugin?.miniWavesurfer);
        const minimapRenderer = minimapPlugin?.miniWavesurfer?.getRenderer?.() ?? minimapPlugin?.miniWavesurfer?.renderer;
        minimapRenderer?.renderProgress?.(safeProgress, false);
    }

    private renderVisualProgress(time: number): void {
        if (!this.wavesurfer || !this.duration || isNaN(time)) {
            return;
        }
        this.renderProgressRatio(time / this.duration);
    }

    private attachMinimapViewportDrag(): void {
        const hitArea = this.minimapHitArea?.nativeElement;
        if (!hitArea) {
            return;
        }

        this.minimapViewportDragCleanup?.();
        hitArea.style.cursor = 'pointer';
        hitArea.style.touchAction = 'none';

        let activePointerId: number | null = null;
        let draggingViewport = false;
        let hasMoved = false;
        let startX = 0;

        const stopEvent = (event: Event) => {
            event.preventDefault();
            event.stopPropagation();
        };
        const getProgressFromPointer = (event: PointerEvent) => {
            const rect = hitArea.getBoundingClientRect();
            return this.clampProgress((event.clientX - rect.left) / Math.max(1, rect.width));
        };
        const onPointerDown = (event: PointerEvent) => {
            if (!this.wavesurfer) {
                return;
            }
            stopEvent(event);
            activePointerId = event.pointerId;
            draggingViewport = this.canScrollWaveform();
            hasMoved = false;
            startX = event.clientX;
            hitArea.style.cursor = draggingViewport ? 'grabbing' : 'pointer';
            hitArea.setPointerCapture?.(event.pointerId);
            if (draggingViewport) {
                this.panWaveformViewportToProgress(getProgressFromPointer(event));
            }
        };
        const onPointerMove = (event: PointerEvent) => {
            if (activePointerId !== event.pointerId || !this.wavesurfer) {
                return;
            }
            stopEvent(event);
            const deltaX = event.clientX - startX;
            hasMoved = hasMoved || Math.abs(deltaX) > 4;
            if (draggingViewport) {
                this.panWaveformViewportToProgress(getProgressFromPointer(event));
            }
        };
        const onPointerUp = (event: PointerEvent) => {
            if (activePointerId !== event.pointerId) {
                return;
            }
            stopEvent(event);
            if (!draggingViewport && !hasMoved) {
                this.seekMediaPlayerToProgress(getProgressFromPointer(event));
            }
            activePointerId = null;
            draggingViewport = false;
            hasMoved = false;
            hitArea.style.cursor = 'pointer';
            hitArea.releasePointerCapture?.(event.pointerId);
        };
        const onClick = (event: MouseEvent) => {
            // WaveSurfer's minimap click seeks its own hidden instance first.
            // We handle the click on pointerup so the Amalia player remains the source of truth.
            stopEvent(event);
        };

        hitArea.addEventListener('pointerdown', onPointerDown, true);
        hitArea.addEventListener('pointermove', onPointerMove, true);
        hitArea.addEventListener('pointerup', onPointerUp, true);
        hitArea.addEventListener('pointercancel', onPointerUp, true);
        hitArea.addEventListener('click', onClick, true);
        this.minimapViewportDragCleanup = () => {
            hitArea.removeEventListener('pointerdown', onPointerDown, true);
            hitArea.removeEventListener('pointermove', onPointerMove, true);
            hitArea.removeEventListener('pointerup', onPointerUp, true);
            hitArea.removeEventListener('pointercancel', onPointerUp, true);
            hitArea.removeEventListener('click', onClick, true);
        };
    }

    private canScrollWaveform(): boolean {
        const metrics = this.getWaveformViewportMetrics();
        return !!metrics && metrics.totalWidth > metrics.visibleWidth;
    }

    private panWaveformViewportToProgress(progress: number): void {
        if (!this.wavesurfer || isNaN(progress)) {
            return;
        }
        const metrics = this.getWaveformViewportMetrics();
        if (!metrics || metrics.totalWidth <= metrics.visibleWidth) {
            return;
        }
        const maxScroll = metrics.totalWidth - metrics.visibleWidth;
        const targetScroll = Math.max(0, Math.min(this.clampProgress(progress) * metrics.totalWidth - metrics.visibleWidth / 2, maxScroll));
        this.wavesurfer.setScroll(targetScroll);
    }

    private navigateMinimapToProgress(progress: number): void {
        if (this.canScrollWaveform()) {
            this.panWaveformViewportToProgress(progress);
            return;
        }
        this.seekMediaPlayerToProgress(progress);
    }

    private getWaveformViewportMetrics(): { totalWidth: number; visibleWidth: number } | null {
        if (!this.wavesurfer) {
            return null;
        }
        const wrapper = this.wavesurfer.getWrapper();
        const totalWidth = Math.max(wrapper?.clientWidth ?? 0, wrapper?.scrollWidth ?? 0);
        const visibleWidth = this.wavesurfer.getWidth();
        if (!totalWidth || !visibleWidth) {
            return null;
        }
        return {totalWidth, visibleWidth};
    }

    private seekMediaPlayerToProgress(progress: number): void {
        if (!this.duration || isNaN(progress)) {
            return;
        }
        this.seekMediaPlayerToTime(this.clampProgress(progress) * this.duration);
    }

    private seekMediaPlayerToTime(time: number): void {
        if (!this.duration || isNaN(time)) {
            return;
        }
        const safeTime = Math.max(0, Math.min(time, this.duration));
        const mediaPlayer = this.mediaPlayerElement.getMediaPlayer();
        const target = mediaPlayer.reverseMode ? this.duration - safeTime : safeTime;
        mediaPlayer.setCurrentTime(target);
        this.renderVisualProgress(target);
    }

    private queueTimeRender(time: number): void {
        if (!this.wavesurfer || isNaN(time)) return;
        if (this.lastRenderedTime >= 0
            && Math.abs(time - this.lastRenderedTime) < HistogramPluginComponent.MIN_TIME_DELTA_BEFORE_REPAINT) {
            return;
        }
        this.queuedTime = time;
        if (this.animationFrameId !== null) return;
        this.animationFrameId = requestAnimationFrame(() => {
            this.animationFrameId = null;
            if (!this.wavesurfer || this.queuedTime === null) return;
            this.renderVisualProgress(this.queuedTime);
            this.lastRenderedTime = this.queuedTime;
            this.queuedTime = null;
        });
    }

    /** Push the player time onto the waveform cursor on every TIME_CHANGE. */
    private handleOnTimeChange = (): void => {
        if (!this.wavesurfer) return;
        const currentTime = this.mediaPlayerElement.getMediaPlayer().getCurrentTime();
        if (!isNaN(currentTime)) {
            this.queueTimeRender(currentTime);
        }
    };

    private handleOnDurationChange = (): void => {
        const newDuration = this.mediaPlayerElement.getMediaPlayer().getDuration();
        if (!newDuration || isNaN(newDuration)) {
            return;
        }
        if (Math.abs(newDuration - this.duration) < HistogramPluginComponent.DURATION_CHANGE_EPSILON_SECONDS) {
            return;
        }

        this.duration = newDuration;
        this.cancelTimeout(this.resizeDebounce);
        this.resizeDebounce = this.scheduleTimeout(() => {
            if (this.wavesurfer) {
                this.wavesurfer.setOptions({duration: this.duration});
            } else if (this.peaks) {
                this.createOrUpdateWavesurfer();
            } else if (this.mediaPlayerElement.isMetadataLoaded) {
                this.handleMetadataLoaded();
            }
        }, HistogramPluginComponent.RERENDER_DEBOUNCE_MS);
    };

    private handleStartSeeking = (): void => {
        this.mediaPlayerElement.getMediaPlayer().pause();
    };

    private handleSeeking = (time: number): void => {
        this.mediaPlayerElement.getMediaPlayer().pause();
        this.renderVisualProgress(time);
    };

    private handleControlBarToggled = (): void => {
        this.scheduleTimeout(() => this.syncBottomInsetIfNeeded());
    };

    private handlePlayerResized = (): void => {
        this.displayState = this.mediaPlayerElement.getDisplayState() ?? 'l';
        this.scheduleWaveformSizeSync();
        this.scheduleTimeout(() => this.syncBottomInsetIfNeeded());
    };

    private handlePinnedControlbarChange = (enabled: boolean): void => {
        this.pinnedControlbar = !!enabled;
        this.scheduleTimeout(() => this.syncBottomInsetIfNeeded());
        this.scheduleTimeout(() => this.syncBottomInsetIfNeeded(), 150);
    };

    private handlePinnedSliderChange = (enabled: boolean): void => {
        this.pinned = !!enabled;
        this.scheduleTimeout(() => this.syncBottomInsetIfNeeded());
    };

    public onHistogramMouseEnter(): void {
        this.scheduleTimeout(() => this.syncBottomInsetIfNeeded());
    }

    public onHistogramMouseLeave(): void {
        this.scheduleTimeout(() => this.syncBottomInsetIfNeeded());
    }

    private scheduleTimeout(callback: () => void, delay = 0): ReturnType<typeof setTimeout> {
        const timeout = setTimeout(() => {
            this.pendingTimeouts.delete(timeout);
            if (!this.destroyed) {
                callback();
            }
        }, delay);
        this.pendingTimeouts.add(timeout);
        return timeout;
    }

    private cancelTimeout(timeout: ReturnType<typeof setTimeout> | null): void {
        if (timeout === null) {
            return;
        }
        clearTimeout(timeout);
        this.pendingTimeouts.delete(timeout);
    }

    private syncBottomInsetIfNeeded(): void {
        const controlBarElement = this.getControlBarElement();
        const nextBottomInset = (controlBarElement && this.pinnedControlbar)
            ? `${Math.max(0, Math.ceil(controlBarElement.getBoundingClientRect().height || 0))}px`
            : '0px';
        if (this.histogramBottomInset === nextBottomInset) {
            return;
        }
        this.histogramBottomInset = nextBottomInset;
        this.scheduleWaveformSizeSync();
    }

    private attachControlBarResizeObserver(): void {
        const controlBarElement = this.getControlBarElement();
        if (!controlBarElement || typeof ResizeObserver !== 'function' || this.observedControlBar === controlBarElement) {
            return;
        }
        this.controlBarResizeObserver?.disconnect();
        this.controlBarResizeObserver = new ResizeObserver(() => this.syncBottomInsetIfNeeded());
        this.controlBarResizeObserver.observe(controlBarElement);
        this.observedControlBar = controlBarElement;
    }

    private getControlBarElement(): HTMLElement | null {
        let node: Node = this.hostElement.nativeElement;
        while (node) {
            const root = node.getRootNode();
            if (root instanceof ShadowRoot) {
                const found = root.querySelector('amalia-control-bar');
                if (found) return found as HTMLElement;
                // Remonter au host du shadow root pour chercher dans le DOM parent
                const host = root.host;
                const parent = host?.parentElement;
                if (parent) {
                    const foundInParent = parent.querySelector('amalia-control-bar');
                    if (foundInParent) return foundInParent as HTMLElement;
                }
                node = host;
            } else {
                return (root as Document | DocumentFragment).querySelector?.('amalia-control-bar') as HTMLElement | null ?? null;
            }
        }
        return null;
    }

    public onResize(): void {
        this.scheduleWaveformSizeSync();
    }

    override ngOnDestroy(): void {
        this.destroyed = true;
        this.pendingTimeouts.forEach(timeout => clearTimeout(timeout));
        this.pendingTimeouts.clear();
        this.resizeDebounce = null;
        this.controlBarResizeObserver?.disconnect();
        this.controlBarResizeObserver = null;
        this.observedControlBar = null;
        this.destroyWavesurfer();
        super.ngOnDestroy();
    }
}
