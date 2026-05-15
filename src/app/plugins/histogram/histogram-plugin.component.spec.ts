import {ComponentFixture, TestBed} from '@angular/core/testing';
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
    destroy: jasmine.Spy;
    on: jasmine.Spy;
    getDuration: jasmine.Spy;
    getActivePlugins: jasmine.Spy;
    renderer: { renderProgress: jasmine.Spy };
}

const buildFakeWaveSurfer = (): FakeWaveSurfer => ({
    setTime: jasmine.createSpy('setTime'),
    destroy: jasmine.createSpy('destroy'),
    on: jasmine.createSpy('on'),
    getDuration: jasmine.createSpy('getDuration').and.returnValue(120),
    getActivePlugins: jasmine.createSpy('getActivePlugins').and.returnValue([]),
    renderer: {renderProgress: jasmine.createSpy('renderProgress')}
});

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

    it('should sync wavesurfer time on TIME_CHANGE', () => {
        registerPeaksMetadata(mediaPlayerElement, [1], [-1]);
        fakeMedia.getCurrentTime.and.returnValue(42);
        spyOn(component.playerService, 'get').and.returnValue(mediaPlayerElement);
        component.ngOnInit();
        mediaPlayerElement.eventEmitter.emit(PlayerEventType.TIME_CHANGE);
        expect(fakeMedia.getCurrentTime).toHaveBeenCalled();
        expect(fakeWavesurfer.setTime).toHaveBeenCalledWith(42);
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
        expect(fakeWavesurfer.renderer.renderProgress).toHaveBeenCalledWith(0.5);
    });
});
