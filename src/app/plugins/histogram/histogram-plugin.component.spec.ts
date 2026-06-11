import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {HistogramPluginComponent} from './histogram-plugin.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ChangeDetectorRef} from '@angular/core';
import {MediaPlayerService} from '../../service/media-player-service';
import {PlayerEventType} from '../../core/constant/event-type';
import {MediaPlayerElement} from '../../core/media-player-element';
import {DefaultConfigLoader} from '../../core/config/loader/default-config-loader';
import {DefaultConfigConverter} from '../../core/config/converter/default-config-converter';
import {DefaultLogger} from '../../core/logger/default-logger';
import {ConfigurationManager} from '../../core/config/configuration-manager';
import {MetadataManager} from '../../core/metadata/metadata-manager';
import {DefaultMetadataLoader} from '../../core/metadata/loader/default-metadata-loader';
import {DefaultMetadataConverter} from '../../core/metadata/converter/default-metadata-converter';
import {HttpClient} from '@angular/common/http';
import WaveSurfer from 'wavesurfer.js';

interface FakeWaveSurfer {
    setTime: jasmine.Spy;
    setOptions: jasmine.Spy;
    setScroll: jasmine.Spy;
    destroy: jasmine.Spy;
    on: jasmine.Spy;
    getDuration: jasmine.Spy;
    getActivePlugins: jasmine.Spy;
    getRenderer: jasmine.Spy;
    getWrapper: jasmine.Spy;
    getWidth: jasmine.Spy;
    getScroll: jasmine.Spy;
    renderer: { renderProgress: jasmine.Spy };
}

const buildFakeWaveSurfer = (): FakeWaveSurfer => {
    const renderer = {renderProgress: jasmine.createSpy('renderProgress')};
    return {
        setTime: jasmine.createSpy('setTime'),
        setOptions: jasmine.createSpy('setOptions'),
        setScroll: jasmine.createSpy('setScroll'),
        destroy: jasmine.createSpy('destroy'),
        on: jasmine.createSpy('on').and.returnValue(() => undefined),
        getDuration: jasmine.createSpy('getDuration').and.returnValue(120),
        getActivePlugins: jasmine.createSpy('getActivePlugins').and.returnValue([]),
        getRenderer: jasmine.createSpy('getRenderer').and.returnValue(renderer),
        getWrapper: jasmine.createSpy('getWrapper').and.returnValue({clientWidth: 1000, scrollWidth: 1000}),
        getWidth: jasmine.createSpy('getWidth').and.returnValue(1000),
        getScroll: jasmine.createSpy('getScroll').and.returnValue(0),
        renderer
    };
};

interface FakeMediaElement {
    getDuration: jasmine.Spy;
    getCurrentTime: jasmine.Spy;
    setCurrentTime: jasmine.Spy;
    pause: jasmine.Spy;
    reverseMode: boolean;
}

const buildFakeMediaElement = (): FakeMediaElement => ({
    getDuration: jasmine.createSpy('getDuration').and.returnValue(120),
    getCurrentTime: jasmine.createSpy('getCurrentTime').and.returnValue(0),
    setCurrentTime: jasmine.createSpy('setCurrentTime'),
    pause: jasmine.createSpy('pause'),
    reverseMode: false
});

const METADATA_ID = 'histogram-waveform-surfer';

const buildMediaPlayerElement = (component: HistogramPluginComponent, logger: DefaultLogger, httpClient: HttpClient, fakeMedia: FakeMediaElement): MediaPlayerElement => {
    const mpe = new MediaPlayerElement();
    component.logger = logger;
    const loader = new DefaultConfigLoader(new DefaultConfigConverter(), logger);
    mpe.configurationManager = new ConfigurationManager(loader, logger);
    mpe.configurationManager.configData = {
        tcOffset: null,
        player: {backwardsSrc: '', src: '', autoplay: false, crossOrigin: 'anonymous', framerate: 25},
        thumbnail: {baseUrl: '', enableThumbnail: false, tcParam: 'start'},
        dataSources: [],
        debug: false,
        logLevel: 'info',
        displaySizes: {large: 900, medium: 700, small: 550, xsmall: 340}
    } as any;
    component.pluginConfiguration = {
        name: HistogramPluginComponent.PLUGIN_NAME,
        metadataIds: [METADATA_ID],
        data: {
            padPeaks: 4,
            withSpectrogram: false
        }
    };
    const metadataLoader = new DefaultMetadataLoader(httpClient, new DefaultMetadataConverter(), logger);
    mpe.metadataManager = new MetadataManager(mpe.configurationManager, metadataLoader, logger);
    (mpe as any).mediaPlayer = fakeMedia;
    mpe.isMetadataLoaded = true;
    component.mediaPlayerElement = mpe;
    return mpe;
};

const registerPeaksMetadata = (mpe: MediaPlayerElement, posbins: number[], negbins: number[]) => {
    mpe.metadataManager.addMetadata({
        id: METADATA_ID,
        type: 'WAVEFORM_PEAKS',
        data: {posbins, negbins}
    } as any);
};

describe('HistogramPluginComponent (wavesurfer + MetadataManager)', () => {
    let component: HistogramPluginComponent;
    let fixture: ComponentFixture<HistogramPluginComponent>;
    let httpClient: HttpClient;
    let logger: DefaultLogger;
    let mediaPlayerElement: MediaPlayerElement;
    let fakeMedia: FakeMediaElement;
    let fakeWavesurfer: FakeWaveSurfer;
    let createSpy: jasmine.Spy;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [HistogramPluginComponent],
            imports: [HttpClientTestingModule],
            providers: [MediaPlayerService, ChangeDetectorRef]
        }).compileComponents();
        httpClient = TestBed.inject(HttpClient);
        logger = new DefaultLogger();
        fixture = TestBed.createComponent(HistogramPluginComponent);
        component = fixture.componentInstance;
        fakeMedia = buildFakeMediaElement();
        mediaPlayerElement = buildMediaPlayerElement(component, logger, httpClient, fakeMedia);
        fakeWavesurfer = buildFakeWaveSurfer();
        createSpy = spyOn(WaveSurfer, 'create').and.returnValue(fakeWavesurfer as unknown as WaveSurfer);
        component.wavesurferContainer = {nativeElement: document.createElement('div')} as any;
        component.minimapContainer = {nativeElement: document.createElement('div')} as any;
        component.minimapHitArea = {nativeElement: document.createElement('div')} as any;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should expose default config values (no urlWaveform)', () => {
        const config = component.getDefaultConfig();
        expect(config.name).toEqual(HistogramPluginComponent.PLUGIN_NAME);
        expect(config.data.padPeaks).toEqual(HistogramPluginComponent.DEFAULT_PAD_PEAKS);
        expect(config.data.waveColor).toEqual(HistogramPluginComponent.DEFAULT_WAVE_COLOR);
        expect(config.data.cursorColor).toEqual(HistogramPluginComponent.DEFAULT_CURSOR_COLOR);
        expect((config.data as any).urlWaveform).toBeUndefined();
    });

    it('should not call WaveSurfer.create when metadataIds is missing', () => {
        component.pluginConfiguration.metadataIds = undefined as any;
        component.handleMetadataLoaded();
        expect(createSpy).not.toHaveBeenCalled();
    });

    it('should not call WaveSurfer.create when metadata are not yet loaded', () => {
        // Metadata not registered in metadataManager → noop.
        component.handleMetadataLoaded();
        expect(createSpy).not.toHaveBeenCalled();
    });

    it('should not call WaveSurfer.create when duration is not ready', () => {
        registerPeaksMetadata(mediaPlayerElement, [1, 2], [-1, -2]);
        fakeMedia.getDuration.and.returnValue(NaN);
        component.handleMetadataLoaded();
        expect(createSpy).not.toHaveBeenCalled();
    });

    it('should emit ERROR when metadata exists but has no peaks payload', () => {
        mediaPlayerElement.metadataManager.addMetadata({
            id: METADATA_ID,
            type: 'WAVEFORM_PEAKS',
            data: {something: 'else'}
        } as any);
        const emitSpy = spyOn(mediaPlayerElement.eventEmitter, 'emit').and.callThrough();
        component.handleMetadataLoaded();
        expect(createSpy).not.toHaveBeenCalled();
        expect(emitSpy).toHaveBeenCalledWith(PlayerEventType.ERROR, jasmine.any(String));
    });

    it('should pad peaks with the configured number of zeros and render wavesurfer', () => {
        registerPeaksMetadata(mediaPlayerElement, [10, 20], [-10, -20]);
        component.handleMetadataLoaded();
        expect(createSpy).toHaveBeenCalled();
        const created = createSpy.calls.mostRecent().args[0] as any;
        expect(created.peaks.length).toBe(2);
        expect(created.peaks[0].length).toBe(6); // padPeaks=4 + 2 real
        expect(created.peaks[0].slice(0, 4)).toEqual([0, 0, 0, 0]);
        expect(created.peaks[0].slice(4)).toEqual([10, 20]);
        expect(created.peaks[1].slice(4)).toEqual([-10, -20]);
    });

    it('should register all expected listeners on init', () => {
        spyOn(component.playerService, 'get').and.returnValue(mediaPlayerElement);
        component.ngOnInit();
        const ee = component.mediaPlayerElement.eventEmitter;
        expect(ee.listenerCount(PlayerEventType.TIME_CHANGE)).toBeGreaterThanOrEqual(1);
        expect(ee.listenerCount(PlayerEventType.DURATION_CHANGE)).toBeGreaterThanOrEqual(1);
        expect(ee.listenerCount(PlayerEventType.METADATA_LOADED)).toBeGreaterThanOrEqual(1);
        expect(ee.listenerCount(PlayerEventType.START_SEEKING)).toBeGreaterThanOrEqual(1);
        expect(ee.listenerCount(PlayerEventType.SEEKING)).toBeGreaterThanOrEqual(1);
    });

    it('should auto-render at init when metadata are already loaded', () => {
        registerPeaksMetadata(mediaPlayerElement, [1, 2], [-1, -2]);
        spyOn(component.playerService, 'get').and.returnValue(mediaPlayerElement);
        component.ngOnInit();
        expect(createSpy).toHaveBeenCalled();
    });

    it('should re-render when METADATA_LOADED event fires after late metadata arrival', () => {
        spyOn(component.playerService, 'get').and.returnValue(mediaPlayerElement);
        // Pretend metadata are not loaded yet at init time. PluginBase will
        // defer init() until the INIT event is emitted by the player.
        mediaPlayerElement.isMetadataLoaded = false;
        component.ngOnInit();
        expect(createSpy).not.toHaveBeenCalled();
        // Player finishes initialising → INIT triggers plugin init() and binds listeners.
        mediaPlayerElement.eventEmitter.emit(PlayerEventType.INIT);
        // Metadata arrive late → register them and notify the plugin.
        registerPeaksMetadata(mediaPlayerElement, [3, 4], [-3, -4]);
        mediaPlayerElement.eventEmitter.emit(PlayerEventType.METADATA_LOADED);
        expect(createSpy).toHaveBeenCalled();
    });

    it('should destroy wavesurfer and clear listeners on ngOnDestroy', () => {
        registerPeaksMetadata(mediaPlayerElement, [1], [-1]);
        spyOn(component.playerService, 'get').and.returnValue(mediaPlayerElement);
        component.ngOnInit();
        const ee = component.mediaPlayerElement.eventEmitter;
        const before = ee.listenerCount(PlayerEventType.TIME_CHANGE);
        component.ngOnDestroy();
        expect(fakeWavesurfer.destroy).toHaveBeenCalled();
        expect(ee.listenerCount(PlayerEventType.TIME_CHANGE)).toBeLessThan(before);
    });

    it('should reserve the control bar height as histogram bottom inset', () => {
        const controlBar = document.createElement('div');
        spyOn(controlBar, 'getBoundingClientRect').and.returnValue({height: 63} as DOMRect);
        spyOn<any>(component, 'getControlBarElement').and.returnValue(controlBar);
        component.pinnedControlbar = true;

        (component as any).syncBottomInsetIfNeeded();

        expect(component.histogramBottomInset).toBe('63px');
    });

    it('should refresh histogram inset when the control bar toggles', fakeAsync(() => {
        const syncSpy = spyOn<any>(component, 'syncBottomInsetIfNeeded');
        spyOn(component.playerService, 'get').and.returnValue(mediaPlayerElement);

        component.ngOnInit();
        mediaPlayerElement.eventEmitter.emit(PlayerEventType.CONTROL_BAR_TOGGLED, {
            pinnedControlbar: true,
            pinnedTimeBar: false
        });
        tick();

        expect(syncSpy).toHaveBeenCalled();
    }));

    it('should sync wavesurfer time on TIME_CHANGE', () => {
        registerPeaksMetadata(mediaPlayerElement, [1], [-1]);
        fakeMedia.getCurrentTime.and.returnValue(42);
        spyOn(window, 'requestAnimationFrame').and.callFake((callback: FrameRequestCallback): number => {
            callback(0);
            return 1;
        });
        spyOn(component.playerService, 'get').and.returnValue(mediaPlayerElement);
        component.ngOnInit();
        mediaPlayerElement.eventEmitter.emit(PlayerEventType.TIME_CHANGE);
        expect(fakeMedia.getCurrentTime).toHaveBeenCalled();
        expect(fakeWavesurfer.renderer.renderProgress).toHaveBeenCalledWith(0.35, false);
    });

    it('should pause player on START_SEEKING', () => {
        spyOn(component.playerService, 'get').and.returnValue(mediaPlayerElement);
        component.ngOnInit();
        mediaPlayerElement.eventEmitter.emit(PlayerEventType.START_SEEKING);
        expect(fakeMedia.pause).toHaveBeenCalled();
    });

    it('should pause and update progress on SEEKING', () => {
        registerPeaksMetadata(mediaPlayerElement, [1], [-1]);
        spyOn(component.playerService, 'get').and.returnValue(mediaPlayerElement);
        component.ngOnInit();
        mediaPlayerElement.eventEmitter.emit(PlayerEventType.SEEKING, 60);
        expect(fakeMedia.pause).toHaveBeenCalled();
        expect(fakeWavesurfer.renderer.renderProgress).toHaveBeenCalledWith(0.5, false);
    });

    it('should fall back to setTime on SEEKING when no renderer is available', () => {
        registerPeaksMetadata(mediaPlayerElement, [1], [-1]);
        spyOn(component.playerService, 'get').and.returnValue(mediaPlayerElement);
        component.ngOnInit();
        // Simulate a wavesurfer instance without renderer.renderProgress.
        delete (fakeWavesurfer as any).renderer;
        fakeWavesurfer.getRenderer.and.returnValue(undefined);
        fakeWavesurfer.setTime.calls.reset();
        mediaPlayerElement.eventEmitter.emit(PlayerEventType.SEEKING, 30);
        expect(fakeMedia.pause).toHaveBeenCalled();
        expect(fakeWavesurfer.setTime).toHaveBeenCalledWith(30);
    });

    it('should noop on TIME_CHANGE when wavesurfer is not yet built', () => {
        spyOn(component.playerService, 'get').and.returnValue(mediaPlayerElement);
        // No metadata registered → no wavesurfer.
        component.ngOnInit();
        mediaPlayerElement.eventEmitter.emit(PlayerEventType.TIME_CHANGE);
        expect(fakeWavesurfer.setTime).not.toHaveBeenCalled();
    });

    it('should ignore NaN currentTime on TIME_CHANGE', () => {
        registerPeaksMetadata(mediaPlayerElement, [1], [-1]);
        fakeMedia.getCurrentTime.and.returnValue(NaN);
        spyOn(component.playerService, 'get').and.returnValue(mediaPlayerElement);
        component.ngOnInit();
        fakeWavesurfer.setTime.calls.reset();
        mediaPlayerElement.eventEmitter.emit(PlayerEventType.TIME_CHANGE);
        expect(fakeWavesurfer.setTime).not.toHaveBeenCalled();
    });

    it('should re-render on DURATION_CHANGE when peaks are already loaded', fakeAsync(() => {
        registerPeaksMetadata(mediaPlayerElement, [1, 2], [-1, -2]);
        spyOn(component.playerService, 'get').and.returnValue(mediaPlayerElement);
        component.ngOnInit();
        createSpy.calls.reset();
        // New duration → triggers re-render via createOrUpdateWavesurfer.
        fakeMedia.getDuration.and.returnValue(240);
        mediaPlayerElement.eventEmitter.emit(PlayerEventType.DURATION_CHANGE);
        tick(250);
        expect(fakeWavesurfer.setOptions).toHaveBeenCalledWith({duration: 240});
    }));

    it('should re-fetch metadata on DURATION_CHANGE when peaks are not yet loaded', fakeAsync(() => {
        spyOn(component.playerService, 'get').and.returnValue(mediaPlayerElement);
        // Defer init until after listeners are attached: no peaks at init.
        mediaPlayerElement.isMetadataLoaded = false;
        component.ngOnInit();
        mediaPlayerElement.eventEmitter.emit(PlayerEventType.INIT);
        // Now register peaks but do not fire METADATA_LOADED yet.
        registerPeaksMetadata(mediaPlayerElement, [1], [-1]);
        mediaPlayerElement.isMetadataLoaded = true;
        fakeMedia.getDuration.and.returnValue(300);
        mediaPlayerElement.eventEmitter.emit(PlayerEventType.DURATION_CHANGE);
        tick(250);
        expect(createSpy).toHaveBeenCalled();
    }));

    it('should ignore DURATION_CHANGE when duration has not changed', () => {
        registerPeaksMetadata(mediaPlayerElement, [1], [-1]);
        spyOn(component.playerService, 'get').and.returnValue(mediaPlayerElement);
        component.ngOnInit();
        createSpy.calls.reset();
        // Same duration as before — should be a noop.
        fakeMedia.getDuration.and.returnValue(120);
        mediaPlayerElement.eventEmitter.emit(PlayerEventType.DURATION_CHANGE);
        expect(createSpy).not.toHaveBeenCalled();
    });

    it('should swallow exceptions thrown by wavesurfer.destroy', () => {
        registerPeaksMetadata(mediaPlayerElement, [1], [-1]);
        spyOn(component.playerService, 'get').and.returnValue(mediaPlayerElement);
        component.ngOnInit();
        fakeWavesurfer.destroy.and.throwError('boom');
        expect(() => component.ngOnDestroy()).not.toThrow();
    });

    it('should not call WaveSurfer.create when wavesurferContainer is missing', () => {
        registerPeaksMetadata(mediaPlayerElement, [1], [-1]);
        component.wavesurferContainer = undefined as any;
        component.handleMetadataLoaded();
        expect(createSpy).not.toHaveBeenCalled();
    });

    it('should expose handleMetaDataLoadedWrapperWithoutAutoBind as a public alias', () => {
        registerPeaksMetadata(mediaPlayerElement, [1], [-1]);
        component.handleMetaDataLoadedWrapperWithoutAutoBind();
        expect(createSpy).toHaveBeenCalled();
    });

    it('should expose initWrapperWithoutAutoBind that runs init()', () => {
        spyOn(component.playerService, 'get').and.returnValue(mediaPlayerElement);
        // The plugin needs a configured player before init() can run.
        // First call ngOnInit (without loadMetadataOnDemand) so PluginBase is ready
        // but does not auto-bind init listeners again.
        const initSpy = spyOn(component, 'init').and.callThrough();
        component.initWrapperWithoutAutoBind();
        expect(initSpy).toHaveBeenCalled();
    });

    it('should run loadMetadataOnDemand path through ngOnInit and ngAfterViewInit', () => {
        spyOn(component.playerService, 'get').and.returnValue(mediaPlayerElement);
        (mediaPlayerElement.configurationManager.configData as any).loadMetadataOnDemand = true;
        registerPeaksMetadata(mediaPlayerElement, [1], [-1]);
        const initWrapperSpy = spyOn(component, 'initWrapperWithoutAutoBind').and.callThrough();
        component.ngOnInit();
        expect(initWrapperSpy).toHaveBeenCalled();
        // ngAfterViewInit should also call handleMetadataLoaded directly.
        createSpy.calls.reset();
        component.ngAfterViewInit();
        expect(createSpy).toHaveBeenCalled();
    });

    it('should noop in ngAfterViewInit when loadMetadataOnDemand is disabled', () => {
        spyOn(component.playerService, 'get').and.returnValue(mediaPlayerElement);
        // Default: loadMetadataOnDemand absent/false.
        component.ngAfterViewInit();
        expect(createSpy).not.toHaveBeenCalled();
    });

    it('should swallow extractPeaks errors and emit ERROR', () => {
        // Insert metadata with an id whose getMetadata throws inside extractPeaks.
        const id = METADATA_ID;
        mediaPlayerElement.metadataManager.addMetadata({id, type: 'WAVEFORM_PEAKS', data: {}} as any);
        spyOn(mediaPlayerElement.metadataManager, 'getMetadata').and.throwError('boom');
        const emitSpy = spyOn(mediaPlayerElement.eventEmitter, 'emit').and.callThrough();
        component.handleMetadataLoaded();
        expect(emitSpy).toHaveBeenCalledWith(PlayerEventType.ERROR, jasmine.any(String));
        expect(createSpy).not.toHaveBeenCalled();
    });

    it('should use metadata.localisation as a fallback peaks source', () => {
        mediaPlayerElement.metadataManager.addMetadata({
            id: METADATA_ID,
            type: 'WAVEFORM_PEAKS',
            localisation: {posbins: [5, 6], negbins: [-5, -6]} as any
        } as any);
        component.handleMetadataLoaded();
        expect(createSpy).toHaveBeenCalled();
    });

    it('should disable Zoom plugin and use spectrogram defaults when withSpectrogram is true', () => {
        component.pluginConfiguration.data.withSpectrogram = true;
        registerPeaksMetadata(mediaPlayerElement, [1], [-1]);
        component.handleMetadataLoaded();
        const created = createSpy.calls.mostRecent().args[0] as any;
        expect(created.minPxPerSec).toEqual(HistogramPluginComponent.DEFAULT_MIN_PX_PER_SEC_SPECTROGRAM);
        // splitChannels is set to false (no left/right split) when spectrogram is on.
        expect(created.splitChannels).toBe(false);
    });

    it('should wire wavesurfer "interaction" handler back to mediaPlayer.setCurrentTime', () => {
        registerPeaksMetadata(mediaPlayerElement, [1], [-1]);
        component.handleMetadataLoaded();
        // The component registers two `on()` handlers: 'interaction' and 'ready'.
        const interactionCall = fakeWavesurfer.on.calls.allArgs().find(args => args[0] === 'interaction');
        expect(interactionCall).toBeDefined();
        const interactionHandler = interactionCall![1] as (t: number) => void;
        interactionHandler(45);
        expect(fakeMedia.setCurrentTime).toHaveBeenCalledWith(45);
    });

    it('should invert interaction time when the player is in reverseMode', () => {
        registerPeaksMetadata(mediaPlayerElement, [1], [-1]);
        fakeMedia.reverseMode = true;
        fakeMedia.getDuration.and.returnValue(100);
        component.handleMetadataLoaded();
        const interactionHandler = fakeWavesurfer.on.calls.allArgs().find(args => args[0] === 'interaction')![1] as (t: number) => void;
        interactionHandler(20);
        expect(fakeMedia.setCurrentTime).toHaveBeenCalledWith(80);
    });

    it('should mirror getCurrentTime/seekTo on the minimap sub-wavesurfer when "ready" fires', () => {
        registerPeaksMetadata(mediaPlayerElement, [1], [-1]);
        const miniWavesurfer: any = {};
        fakeWavesurfer.getActivePlugins.and.returnValue([{miniWavesurfer}]);
        component.handleMetadataLoaded();
        const readyHandler = fakeWavesurfer.on.calls.allArgs().find(args => args[0] === 'ready')![1] as () => void;
        readyHandler();
        expect(typeof miniWavesurfer.getCurrentTime).toBe('function');
        expect(typeof miniWavesurfer.seekTo).toBe('function');
        // Exercise the overridden seekTo (covers overriddenSeekTo body).
        fakeWavesurfer.getDuration.and.returnValue(200);
        miniWavesurfer.seekTo(0.5);
        expect(fakeMedia.setCurrentTime).toHaveBeenCalledWith(60);
    });

    it('should skip minimap mirroring when no minimap plugin is found', () => {
        registerPeaksMetadata(mediaPlayerElement, [1], [-1]);
        fakeWavesurfer.getActivePlugins.and.returnValue([{}]); // no miniWavesurfer
        component.handleMetadataLoaded();
        const readyHandler = fakeWavesurfer.on.calls.allArgs().find(args => args[0] === 'ready')![1] as () => void;
        expect(() => readyHandler()).not.toThrow();
    });

    it('should invert progress in overriddenSeekTo when reverseMode is on', () => {
        registerPeaksMetadata(mediaPlayerElement, [1], [-1]);
        fakeMedia.reverseMode = true;
        component.handleMetadataLoaded();
        // Trigger ready handler to expose miniWavesurfer.seekTo (which uses the same override).
        const miniWavesurfer: any = {};
        fakeWavesurfer.getActivePlugins.and.returnValue([{miniWavesurfer}]);
        const readyHandler = fakeWavesurfer.on.calls.allArgs().find(args => args[0] === 'ready')![1] as () => void;
        readyHandler();
        miniWavesurfer.seekTo(0.25);
        // reverseMode uses the media duration captured at render time: 120 - (0.25 * 120) = 90.
        expect(fakeMedia.setCurrentTime).toHaveBeenCalledWith(90);
    });

    it('overriddenGetCurrentTime should delegate to mediaPlayer.getCurrentTime', () => {
        registerPeaksMetadata(mediaPlayerElement, [1], [-1]);
        fakeMedia.getCurrentTime.and.returnValue(7);
        component.handleMetadataLoaded();
        // The wavesurfer's getCurrentTime was overridden in createOrUpdateWavesurfer.
        const overridden = (fakeWavesurfer as any).getCurrentTime;
        expect(typeof overridden).toBe('function');
        expect(overridden()).toBe(7);
    });
});
