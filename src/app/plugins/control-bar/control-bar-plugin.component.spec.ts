import {ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed, tick} from '@angular/core/testing';
import {ControlBarPluginComponent} from './control-bar-plugin.component';
import {MediaPlayerService} from '../../service/media-player-service';
import {ThumbnailService} from '../../service/thumbnail-service';
import {ElementRef, NO_ERRORS_SCHEMA} from '@angular/core';
import {MediaPlayerElement} from "../../core/media-player-element";
import {DefaultLogger} from "../../core/logger/default-logger";
import {HttpClient} from "@angular/common/http";
import {DefaultConfigLoader} from "../../core/config/loader/default-config-loader";
import {DefaultConfigConverter} from "../../core/config/converter/default-config-converter";
import {ConfigurationManager} from "../../core/config/configuration-manager";
import {DefaultMetadataLoader} from "../../core/metadata/loader/default-metadata-loader";
import {DefaultMetadataConverter} from "../../core/metadata/converter/default-metadata-converter";
import {MetadataManager} from "../../core/metadata/metadata-manager";
import {PlayerEventType} from "../../core/constant/event-type";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {TcFormatPipe} from "../../core/utils/tc-format.pipe";

const initTestData = (component: ControlBarPluginComponent, mediaPlayerElement: MediaPlayerElement, logger: DefaultLogger, httpClient: HttpClient) => {
    mediaPlayerElement = new MediaPlayerElement();
    logger = new DefaultLogger();
    component.logger = logger;
    const loader = new DefaultConfigLoader(new DefaultConfigConverter(), logger);
    mediaPlayerElement.configurationManager = new ConfigurationManager(loader, logger);
    const pluginsConfiguration = {
        "CONTROL_BAR-PLAYERONE2": {
            name: '',
            "data": [
                {
                    "label": "Barre de progression",
                    "control": "progressBar"
                },
                {
                    "label": "Pause / Lire (espace)",
                    "control": "playPause",
                    "zone": 1,
                    "priority": 1
                },
                {
                    "control": "volume",
                    "zone": 1,
                    "data": {
                        "channelMergeVolume": true
                    },
                    "priority": 1
                },
                {
                    "label": "Plein écran (f)",
                    "control": "toggleFullScreen",
                    "icon": "fullscreen",
                    "zone": 3,
                    "priority": 1
                }
            ]
        },
        "CONTROL_BAR-PLAYERONE1": {
            name: '',
            "data": [
                {
                    "label": "Barre de progression",
                    "control": "progressBar",
                    "priority": 1
                },
                {
                    "label": "Télécharger",
                    "control": "download",
                    "icon": "download",
                    "zone": 1,
                    "order": 1,
                    "data": {
                        "href": ""
                    },
                    "priority": 3,
                    "key": "d"
                },
                {
                    "label": "Playback rate custom steps",
                    "control": "playbackRateCustomSteps"
                },
                {
                    "label": "Playback rate steps",
                    "control": "playbackRateSteps"
                },
                {
                    "label": "Capture",
                    "control": "download",
                    "icon": "screenshot",
                    "key": "c",
                    "zone": 1,
                    "order": 2,
                    "data": {
                        "tcParam": "start",
                        "href": "https://image.wsmedia.sas.ina/thumbs/..../sl_hm/"
                    },
                    "priority": 1
                },
                {
                    "label": "Playback Rate",
                    "control": "playbackRate",
                    "zone": 1,
                    "priority": 1,
                    "order": 3
                },
                {
                    "label": "Aller au début du média",
                    "icon": "backward-start",
                    "control": "backward-start",
                    "zone": 2,
                    "priority": 1,
                    "key": "Shift + ArrowLeft"
                },
                {
                    "label": "Retour image par image",
                    "icon": "backward-frame",
                    "control": "backward-frame",
                    "zone": 2,
                    "priority": 1,
                    "key": "ArrowLeft"
                },
                {
                    "label": "Retour 5 secondes par 5 secondes",
                    "icon": "backward-5seconds",
                    "control": "backward-5seconds",
                    "zone": 2,
                    "priority": 1,
                    "key": "ArrowLeft"
                },
                {
                    "label": "Retour ralenti",
                    "icon": "slow-backward",
                    "control": "slow-backward",
                    "zone": 2,
                    "priority": 1,
                    "key": "Control + Shift + ArrowLeft"
                },
                {
                    "label": "Retour rapide",
                    "icon": "backward",
                    "control": "backward",
                    "zone": 2,
                    "priority": 1,
                    "key": "Control + ArrowLeft"
                },
                {
                    "label": "Pause / Lire",
                    "control": "playPause",
                    "zone": 2,
                    "priority": 1,
                    "key": "espace"
                },
                {
                    "label": "Avance rapide",
                    "icon": "forward",
                    "control": "forward",
                    "zone": 2,
                    "priority": 1,
                    "key": "Control + ArrowRight"
                },
                {
                    "label": "Avance ralentie",
                    "icon": "slow-forward",
                    "control": "slow-forward",
                    "zone": 2,
                    "priority": 1,
                    "key": "Control + Shift + ArrowRight"
                },
                {
                    "label": "Avance 5 secondes par 5 secondes",
                    "icon": "forward-5seconds",
                    "control": "forward-5seconds",
                    "zone": 2,
                    "priority": 1,
                    "key": "ArrowRight"
                },
                {
                    "label": "Avance image par image",
                    "icon": "forward-frame",
                    "control": "forward-frame",
                    "zone": 2,
                    "priority": 1,
                    "key": "ArrowRight"
                },
                {
                    "label": "Aller à la fin du média",
                    "icon": "forward-end",
                    "control": "forward-end",
                    "zone": 2,
                    "priority": 1,
                    "key": "Shift + ArrowRight"
                },
                {
                    "label": "Désactiver le son",
                    "control": "volume",
                    "zone": 3,
                    "priority": 1,
                    "key": "m",
                    "data": {
                        "channelMergeVolume": false,
                        "channelMergerNode": "",
                        "tracks": [
                            {
                                "track": 1,
                                "label": "fra"
                            },
                            {
                                "track": 2,
                                "label": "fra"
                            },
                            {
                                "track": 3,
                                "label": "qaa"
                            }
                        ]
                    }
                },
                {
                    "label": "Plein écran",
                    "control": "toggleFullScreen",
                    "icon": "fullscreen",
                    "zone": 3,
                    "priority": 1,
                    "key": "f"
                },
                {
                    "label": "Aspect ratio",
                    "control": "aspectRatio",
                    "zone": 3,
                    "priority": 3,
                    "key": "a"
                },
                {
                    "label": "Figer",
                    "control": "pinControls",
                    "icon": "pin",
                    "zone": 3,
                    "priority": 1,
                    "order": 1,
                    "key": "g"
                },
                {
                    "label": "Afficher les vitesses",
                    "control": "displaySlider",
                    "icon": "slider",
                    "zone": 3,
                    "priority": 2,
                    "order": 1,
                    "key": "v"
                },
                {
                    "label": "Plus d'options",
                    "control": "menu",
                    "icon": "dots",
                    "zone": 3,
                    "key": "r"
                }
            ],
            "pinnedControls": true
        },
        "TIME_BAR-PLAYERONE": {
            name: '',
            "data": {
                "timeFormat": ""
            }
        }
    };
    mediaPlayerElement.configurationManager.configData = {
        "tcOffset": 0,
        "player": {
            "backwardsSrc": "",
            "src": "",
            "autoplay": true,
            "ratio": "16:9",
            "hls": undefined,
            "crossOrigin": "anonymous"
        },
        "thumbnail": {
            "baseUrl": "https://image.wsmedia.sas.ina/thumbs/.../sl_hm/",
            "enableThumbnail": true,
            "tcParam": "start"
        },
        "dataSources": [],
        "displaySizes": {
            "large": 900,
            "medium": 700,
            "small": 550,
            "xsmall": 340
        },
        pluginsConfiguration: pluginsConfiguration as unknown as Map<string, any>
    };
    httpClient = TestBed.inject(HttpClient);
    const metadataLoader = new DefaultMetadataLoader(httpClient, new DefaultMetadataConverter(), logger);
    mediaPlayerElement.metadataManager = new MetadataManager(mediaPlayerElement.configurationManager, metadataLoader, logger);
    component.mediaPlayerElement = mediaPlayerElement;
    component.playerId = 'PLAYERONE';
    component.pluginInstance = '1';
    return mediaPlayerElement;
}
describe('ControlBarPluginComponent', () => {
    let component: ControlBarPluginComponent;
    let fixture: ComponentFixture<ControlBarPluginComponent>;
    let thumbnailService: ThumbnailService;
    let httpClient: HttpClient;
    let logger: DefaultLogger;
    let mediaPlayerElement: MediaPlayerElement;
    let videoElement: HTMLVideoElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ControlBarPluginComponent, TcFormatPipe],
            imports: [HttpClientTestingModule],
            providers: [
                MediaPlayerService, ThumbnailService
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ControlBarPluginComponent);
        component = fixture.componentInstance;
        mediaPlayerElement = initTestData(component, mediaPlayerElement, logger, httpClient);
        videoElement = document.createElement('video');
        mediaPlayerElement.setMediaPlayer(videoElement);
        const getPlayer = spyOn(component.playerService, 'get');
        getPlayer.and.returnValue(mediaPlayerElement);
        thumbnailService = TestBed.inject(ThumbnailService);
        const getThumbnailMock = spyOn(thumbnailService, 'getThumbnail');
        getThumbnailMock.and.resolveTo('blob');
        fixture.detectChanges();
        component.thumbnailElement = new ElementRef(document.createElement('img'));
        mediaPlayerElement.eventEmitter.emit(PlayerEventType.INIT);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize playback rates', () => {
        spyOn(component, 'initPlaybackrates');
        component.init();
        expect(component.initPlaybackrates).toHaveBeenCalled();
    });

    it('should handle playback rate change', () => {
        const playbackRate = 1;
        component.mediaPlayerElement.eventEmitter.emit(PlayerEventType.PLAYBACK_RATE_CHANGE, playbackRate);
        expect(component.currentPlaybackRate).toBe(playbackRate);
    });

    it('should handle duration change', () => {
        const getCurrentTimeMock = spyOn(component.mediaPlayerElement.getMediaPlayer(), 'getCurrentTime');
        getCurrentTimeMock.and.returnValue(120);
        const getDurationMock = spyOn(component.mediaPlayerElement.getMediaPlayer(), 'getDuration');
        getDurationMock.and.returnValue(1800);
        component.mediaPlayerElement.eventEmitter.emit(PlayerEventType.DURATION_CHANGE);
        expect(component.currentTime).toBe(120);
        expect(component.time).toBe(120);
        expect(component.duration).toBe(1800);
    });

    it('should handle time change', () => {
        const getCurrentTimeMock = spyOn(component.mediaPlayerElement.getMediaPlayer(), 'getCurrentTime');
        getCurrentTimeMock.and.returnValue(360);
        component.inverse = false;
        component.inSliding = false;
        component.duration = 1800;
        component.mediaPlayerElement.eventEmitter.emit(PlayerEventType.TIME_CHANGE);
        expect(component.progressBarValue).toBe(20);
        expect(component.time).toBe(360);
    });
    it('should handle time change inversed', () => {
        const getCurrentTimeMock = spyOn(component.mediaPlayerElement.getMediaPlayer(), 'getCurrentTime');
        getCurrentTimeMock.and.returnValue(360);
        component.inverse = true;
        component.inSliding = true;
        component.duration = 1800;
        component.mediaPlayerElement.eventEmitter.emit(PlayerEventType.TIME_CHANGE);
        expect(component.time).toBe(1440);
    });
    it('should handle aspect ratio change', fakeAsync(() => {
        tick(100);
        const aspectRatio = '16:9';
        component.mediaPlayerElement.eventEmitter.emit(PlayerEventType.ASPECT_RATIO_CHANGE, aspectRatio);
        tick(100);
        expect(component.aspectRatio).toBe(aspectRatio);
    }));

    it('should handle mouse enter and leave events', () => {
        component.mediaPlayerElement.eventEmitter.emit(PlayerEventType.PLAYER_MOUSE_ENTER);
        expect(component.activated).toBeTrue();
        component.mediaPlayerElement.eventEmitter.emit(PlayerEventType.PLAYER_MOUSE_LEAVE);
        expect(component.activated).toBeFalse();
    });

    it('should toggle fullscreen mode', () => {
        const emitMock = spyOn(component.mediaPlayerElement.eventEmitter, 'emit');
        component.controlClicked('toggleFullScreen');
        expect(emitMock).toHaveBeenCalledWith(PlayerEventType.FULLSCREEN_STATE_CHANGE);
    });

    it('should change playback rate', () => {
        component.controlClicked('backward-start');
        expect(component.currentPlaybackRate).toBe(1);
    });
});

describe('ControlBarPluginComponent 2', () => {
    let component: ControlBarPluginComponent;
    let fixture: ComponentFixture<ControlBarPluginComponent>;
    let thumbnailService: ThumbnailService;
    let httpClient: HttpClient;
    let logger: DefaultLogger;
    let mediaPlayerElement: MediaPlayerElement;
    let videoElement: HTMLVideoElement;
    let getThumbnailMock;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ControlBarPluginComponent, TcFormatPipe],
            imports: [HttpClientTestingModule],
            providers: [
                MediaPlayerService, ThumbnailService
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ControlBarPluginComponent);
        component = fixture.componentInstance;
        mediaPlayerElement = initTestData(component, mediaPlayerElement, logger, httpClient);
        videoElement = document.createElement('video');
        mediaPlayerElement.setMediaPlayer(videoElement);
        const getPlayer = spyOn(component.playerService, 'get');
        getPlayer.and.returnValue(mediaPlayerElement);
        thumbnailService = TestBed.inject(ThumbnailService);
        getThumbnailMock = spyOn(thumbnailService, 'getThumbnail');
        getThumbnailMock.and.resolveTo('blob');
        component.pluginConfiguration = mediaPlayerElement.getPluginConfiguration('CONTROL_BAR-PLAYERONE1')
    });
    it('should set pluginConfSetThroughInit to false', fakeAsync(() => {
        fixture.detectChanges();
        component.thumbnailElement = new ElementRef(document.createElement('img'));
        mediaPlayerElement.eventEmitter.emit(PlayerEventType.INIT);
        tick(100);
        expect(component.pluginConfSetThroughInit).toBeFalse();
        expect(getThumbnailMock).toHaveBeenCalled();
    }));
    it('should call init() with no need to call emit(INIT)', fakeAsync(() => {
        component.mediaPlayerElement.isMetadataLoaded = true;
        const initMock = spyOn(component, 'init');
        initMock.and.callThrough();
        fixture.detectChanges();
        component.thumbnailElement = new ElementRef(document.createElement('img'));
        tick(100);
        expect(component.pluginConfSetThroughInit).toBeFalse();
        expect(getThumbnailMock).toHaveBeenCalled();
        expect(initMock).toHaveBeenCalled();
    }));

    it('should call init() with no need to call emit(INIT) and with a call to emit(INIT)', fakeAsync(() => {
        component.mediaPlayerElement.isMetadataLoaded = true;
        const initMock = spyOn(component, 'init');
        initMock.and.callThrough();
        fixture.detectChanges();
        component.thumbnailElement = new ElementRef(document.createElement('img'));
        mediaPlayerElement.eventEmitter.emit(PlayerEventType.INIT);
        tick(100);
        expect(component.pluginConfSetThroughInit).toBeFalse();
        expect(getThumbnailMock).toHaveBeenCalledTimes(2);
        expect(initMock).toHaveBeenCalledTimes(2);
    }));
});
