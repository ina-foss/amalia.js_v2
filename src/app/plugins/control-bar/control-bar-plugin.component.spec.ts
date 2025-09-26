import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ControlBarPluginComponent } from './control-bar-plugin.component';
import { MediaPlayerService } from '../../service/media-player-service';
import { ThumbnailService } from '../../service/thumbnail-service';
import { ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { MediaPlayerElement } from "../../core/media-player-element";
import { DefaultLogger } from "../../core/logger/default-logger";
import { HttpClient } from "@angular/common/http";
import { DefaultConfigLoader } from "../../core/config/loader/default-config-loader";
import { DefaultConfigConverter } from "../../core/config/converter/default-config-converter";
import { ConfigurationManager } from "../../core/config/configuration-manager";
import { DefaultMetadataLoader } from "../../core/metadata/loader/default-metadata-loader";
import { DefaultMetadataConverter } from "../../core/metadata/converter/default-metadata-converter";
import { MetadataManager } from "../../core/metadata/metadata-manager";
import { PlayerEventType } from "../../core/constant/event-type";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TcFormatPipe } from "../../core/utils/tc-format.pipe";
import { Renderer2 } from '@angular/core';
import { ShortcutEvent, ShortcutControl, Shortcut } from 'src/app/core/config/model/shortcuts-event';

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
            data: [
                {
                    label: 'Barre de progression',
                    control: 'progressBar',
                    priority: 1
                },
                {
                    label: "Télécharger",
                    control: "download",
                    icon: "download",
                    zone: 1,
                    order: 1,
                    priority: 5,
                    key: 'd',
                },
                {
                    label: 'Playback rate custom steps',
                    control: 'playbackRateCustomSteps'
                },
                {
                    label: 'Playback rate steps',
                    control: 'playbackRateSteps'
                },
                {
                    label: 'Capture',
                    control: 'download',
                    icon: 'screenshot',
                    key: 'c',
                    zone: 1,
                    order: 2,
                    data: { 'tcParam': 'start', 'href': '' },
                    priority: 2
                },
                {
                    label: 'Playback Rate',
                    control: 'playbackRate',
                    zone: 1,
                    priority: 3,
                    order: 3
                },
                {
                    label: 'Aller au début du média',
                    icon: 'backward-start',
                    control: 'backward-start',
                    zone: 2,
                    priority: 5,
                    key: 'Home',
                    notInMenu: true
                },
                {
                    label: 'Retour rapide',
                    icon: 'backward',
                    control: 'backward',
                    zone: 2,
                    priority: 3,
                    key: 'Shift + ArrowLeft'
                },
                {
                    label: 'Retour ralenti',
                    icon: 'slow-backward',
                    control: 'slow-backward',
                    zone: 2,
                    priority: 4,
                    key: 'Alt + ArrowLeft',
                    notInMenu: true
                },
                {
                    label: 'Retour 5 secondes par 5 secondes',
                    icon: 'backward-5seconds',
                    control: 'backward-5seconds',
                    zone: 2,
                    priority: 2,
                    key: 'Control + ArrowLeft'
                },
                {
                    label: 'Retour image par image',
                    icon: 'backward-frame',
                    control: 'backward-frame',
                    zone: 2,
                    priority: 3,
                    key: 'ArrowLeft'
                },
                {
                    label: 'Pause / Lire',
                    control: 'playPause',
                    zone: 2,
                    priority: 2,
                    key: 'espace'
                },
                {
                    label: 'Avance image par image',
                    icon: 'forward-frame',
                    control: 'forward-frame',
                    zone: 2,
                    priority: 3,
                    key: 'ArrowRight'
                },
                {
                    label: 'Avance 5 secondes par 5 secondes',
                    icon: 'forward-5seconds',
                    control: 'forward-5seconds',
                    zone: 2,
                    priority: 2,
                    key: 'Control + ArrowRight'
                },
                {
                    label: 'Avance ralentie',
                    icon: 'slow-forward',
                    control: 'slow-forward',
                    zone: 2,
                    priority: 4,
                    key: 'Alt + ArrowRight',
                    notInMenu: true
                },
                {
                    label: 'Avance rapide',
                    icon: 'forward',
                    control: 'forward',
                    zone: 2,
                    priority: 3,
                    key: 'Shift + ArrowRight'
                },
                {
                    label: 'Aller à la fin du média',
                    icon: 'forward-end',
                    control: 'forward-end',
                    zone: 2,
                    priority: 5,
                    key: 'End',
                    notInMenu: true
                },
                {
                    label: 'Désactiver le son',
                    control: 'volume',
                    zone: 3,
                    priority: 2,
                    key: 'm',
                    data: { 'channelMergeVolume': false, 'channelMergerNode': '' },
                },
                {
                    label: 'Plein écran',
                    control: 'toggleFullScreen',
                    icon: 'fullscreen',
                    zone: 3,
                    priority: 2,
                    key: 'f'
                },
                {
                    label: 'Aspect ratio',
                    control: 'aspectRatio',
                    zone: 3,
                    priority: 5,
                    key: 'a'
                },
                {
                    label: 'Figer',
                    control: 'pinControls',
                    icon: 'pin',
                    zone: 3,
                    priority: 4,
                    key: 'p',
                },
                {
                    label: 'Afficher les vitesses',
                    control: 'displaySlider',
                    icon: 'slider',
                    zone: 3,
                    priority: 5,
                    key: 'v',
                },
                {
                    label: 'Plus d\'options',
                    control: 'menu',
                    icon: 'dots',
                    zone: 3,
                    priority: 3,
                    key: 'r'
                }

            ],
            pinnedControls: true,
        }
        ,
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

    it('should apply shortcut and call controlClicked', () => {
        const shortcut: Shortcut = { key: 'p', ctrl: false, shift: false, alt: false, meta: false };
        const shortcutControl: ShortcutControl = {
            shortcut,
            control: 'playPause'
        };

        spyOn(component, 'controlClicked');
        component.listOfShortcuts = [shortcutControl];

        const event: ShortcutEvent = {
            shortcut,
            targets: ['CONTROL_BAR']
        };

        component.applyShortcut(event);

        expect(component.keypressed).toBe('p');
        expect(component.controlClicked).toHaveBeenCalledWith('playPause');
    });

    it('should apply volume shortcut and call handleMuteUnmuteVolume', () => {
        const shortcut: Shortcut = { key: 'v', ctrl: false, shift: false, alt: false, meta: false };
        const shortcutControl: ShortcutControl = {
            shortcut,
            control: 'volume'
        };

        spyOn(component, 'handleMuteUnmuteVolume');
        component.listOfShortcuts = [shortcutControl];

        const event: ShortcutEvent = {
            shortcut,
            targets: ['CONTROL_BAR']
        };

        component.applyShortcut(event);

        expect(component.keypressed).toBe('v');
        expect(component.handleMuteUnmuteVolume).toHaveBeenCalled();
    });

    it('should increase volume on ArrowUp shortcut', fakeAsync(() => {
        const shortcut: Shortcut = { key: 'arrowup', ctrl: false, shift: false, alt: false, meta: false };
        const event: ShortcutEvent = {
            shortcut,
            targets: ['CONTROL_BAR']
        };

        component.volumeLeft = 45;
        component.volumeRight = 45;
        component.volumeButton = {
            nativeElement: {
                dispatchEvent: jasmine.createSpy('dispatchEvent')
            }
        } as any;

        spyOn(component, 'hideAll');

        component.applyShortcut(event);
        tick(5000);
        expect(component.volumeLeft).toBe(50);
        expect(component.volumeRight).toBe(50);
        expect(component.volumeButton.nativeElement.dispatchEvent).toHaveBeenCalled();
        expect(component.hideAll).toHaveBeenCalled();
    }));

    it('should decrease volume on ArrowDown shortcut', fakeAsync(() => {
        const shortcut: Shortcut = { key: 'arrowdown', ctrl: false, shift: false, alt: false, meta: false };
        const event: ShortcutEvent = {
            shortcut,
            targets: ['CONTROL_BAR']
        };

        component.volumeLeft = 50;
        component.volumeRight = 50;
        component.volumeButton = {
            nativeElement: {
                dispatchEvent: jasmine.createSpy('dispatchEvent')
            }
        } as any;

        spyOn(component, 'hideAll');

        component.applyShortcut(event);
        tick(5000);
        expect(component.volumeLeft).toBe(45);
        expect(component.volumeRight).toBe(45);
        expect(component.volumeButton.nativeElement.dispatchEvent).toHaveBeenCalled();
        expect(component.hideAll).toHaveBeenCalled();
    }));
});