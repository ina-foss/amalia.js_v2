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


describe('ControlBarPluginComponent – applyShortcut & controlClicked', () => {
    let component: ControlBarPluginComponent;

    // Spies & stubs communs
    let emitSpy: jasmine.Spy;
    let mediaPlayer: any;
    let volumeButtonEl: HTMLButtonElement;

    // Renderer minimal
    const rendererStub: Partial<Renderer2> = {
        addClass: () => { },
        removeClass: () => { },
        setStyle: () => { },
        removeStyle: () => { },
        setAttribute: () => { },
        removeAttribute: () => { },
        listen: () => () => { },
        createElement: () => document.createElement('div') as any,
        createText: () => document.createTextNode('') as any,
        appendChild: () => { },
        removeChild: () => { },
        selectRootElement: () => document.createElement('div') as any
    };

    /** Crée un mediaPlayer mocké avec des spies utiles pour les tests */
    function createMediaPlayerStub() {
        mediaPlayer = {
            framerate: 25,
            reverseMode: false,
            isPaused: jasmine.createSpy('isPaused').and.returnValue(false),

            playPause: jasmine.createSpy('playPause'),
            pauseOnly: jasmine.createSpy('pauseOnly'),
            play: jasmine.createSpy('play'),
            captureImage: jasmine.createSpy('captureImage'),

            movePrevFrame: jasmine.createSpy('movePrevFrame'),
            moveNextFrame: jasmine.createSpy('moveNextFrame'),

            getDuration: jasmine.createSpy('getDuration').and.returnValue(10000),
            getCurrentTime: jasmine.createSpy('getCurrentTime').and.returnValue(5000),
            setCurrentTime: jasmine.createSpy('setCurrentTime'),

            seekToBegin: jasmine.createSpy('seekToBegin'),
            seekToEnd: jasmine.createSpy('seekToEnd'),

            mse: { setMaxBufferLengthConfig: jasmine.createSpy('setMaxBufferLengthConfig') }
        };
    }

    beforeEach(() => {
        // Instanciation
        component = new ControlBarPluginComponent(
            {} as any,           // MediaPlayerService (non utilisé ici)
            {} as any,           // ThumbnailService (non utilisé ici)
            rendererStub as Renderer2
        );

        // Logger neutre pour éviter des erreurs
        (component as any).logger = {
            debug: jasmine.createSpy('debug'),
            info: jasmine.createSpy('info'),
            warn: jasmine.createSpy('warn')
        };

        // mediaPlayerElement + eventEmitter
        emitSpy = jasmine.createSpy('emit');

        createMediaPlayerStub();

        (component as any).mediaPlayerElement = {
            // Fournit le mediaPlayer mocké
            getMediaPlayer: () => mediaPlayer,
            // Petite API dont on n’a pas besoin ici mais que la classe pourrait appeler
            getDisplayState: () => 'm',
            eventEmitter: { emit: emitSpy },
            aspectRatio: '4:3'
        };

        // Bouton volume (utilisé par applyShortcut pour ArrowUp/ArrowDown)
        volumeButtonEl = document.createElement('button');
        spyOn(volumeButtonEl, 'dispatchEvent').and.callThrough();
        component.volumeButton = new ElementRef(volumeButtonEl);

        // État initial des volumes
        component.volumeLeft = 50;
        component.volumeRight = 50;

        // Nettoyage des timeouts par défaut
        if ((jasmine as any).clock) {
            jasmine.clock().uninstall();
        }
    });

    // -------------------------------------------------------------------------
    // applyShortcut
    // -------------------------------------------------------------------------
    describe('applyShortcut', () => {
        it('doit appeler controlClicked et mettre à jour keypressed si un raccourci (non volume) correspond', () => {
            spyOn(component, 'controlClicked');

            component.listOfShortcuts = [
                {
                    shortcut: { key: 'p', ctrl: false, shift: false, alt: false, meta: false },
                    control: 'playPause'
                }
            ];

            const evt = {
                shortcut: { key: 'p', ctrl: false, shift: false, alt: false, meta: false },
                targets: ['CONTROL_BAR']
            } as any;

            component.applyShortcut(evt);

            expect(component.keypressed).toBe('p');
            expect(component.controlClicked).toHaveBeenCalledOnceWith('playPause');
        });

        it('doit appeler handleMuteUnmuteVolume si un raccourci volume correspond', () => {
            const muteSpy = spyOn(component, 'handleMuteUnmuteVolume');

            component.listOfShortcuts = [
                {
                    shortcut: { key: 'm', ctrl: false, shift: false, alt: false, meta: false },
                    control: 'volume'
                }
            ];

            const evt = {
                shortcut: { key: 'm', ctrl: false, shift: false, alt: false, meta: false },
                targets: ['CONTROL_BAR']
            } as any;

            component.applyShortcut(evt);

            expect(component.keypressed).toBe('m');
            expect(muteSpy).toHaveBeenCalledTimes(1);
        });

        it('ArrowUp: affiche le slider volume, +5 sur L/R (max 100), puis hideAll après 1500ms', () => {
            spyOn(component, 'hideAll');
            jasmine.clock().install();

            const evt = {
                shortcut: { key: 'arrowup', ctrl: false, shift: false, alt: false, meta: false },
                targets: ['CONTROL_BAR']
            } as any;

            component.volumeLeft = 98;
            component.volumeRight = 99;

            component.applyShortcut(evt);

            // Mouseenter déclenché sur le bouton volume
            expect(volumeButtonEl.dispatchEvent).toHaveBeenCalled();
            // Volumes incrémentés et bornés à 100
            expect(component.volumeLeft).toBe(100);
            expect(component.volumeRight).toBe(100);

            // hideAll doit être appelé après 1s
            jasmine.clock().tick(1499);
            expect(component.hideAll).not.toHaveBeenCalled();
            jasmine.clock().tick(1);
            expect(component.hideAll).toHaveBeenCalledTimes(1);

            jasmine.clock().uninstall();
        });


        it('ArrowUp: affiche le slider volume, +5 sur L/R (max 100), puis encore le slider puis hideAll après 1500ms', () => {
            spyOn(component, 'hideAll');
            jasmine.clock().install();

            const evt = {
                shortcut: { key: 'arrowup', ctrl: false, shift: false, alt: false, meta: false },
                targets: ['CONTROL_BAR']
            } as any;

            component.volumeLeft = 90;
            component.volumeRight = 90;

            component.applyShortcut(evt);

            // Mouseenter déclenché sur le bouton volume
            expect(volumeButtonEl.dispatchEvent).toHaveBeenCalled();
            // Volumes incrémentés et bornés à 100
            expect(component.volumeLeft).toBe(95);
            expect(component.volumeRight).toBe(95);
            jasmine.clock().tick(1499);
            component.applyShortcut(evt);
            expect(component.volumeMouseEnterTimeOut).not.toBeNull();
            jasmine.clock().tick(1);
            expect(component.hideAll).not.toHaveBeenCalled();
            expect(component.volumeLeft).toBe(100);
            expect(component.volumeRight).toBe(100);
            // hideAll doit être appelé après 1,5s
            jasmine.clock().tick(1499);
            expect(component.hideAll).toHaveBeenCalledTimes(1);
            jasmine.clock().uninstall();
        });

        it('ArrowDown: affiche le slider volume, -5 sur L/R (min 0), puis hideAll après 1500ms', () => {
            spyOn(component, 'hideAll');
            jasmine.clock().install();

            const evt = {
                shortcut: { key: 'arrowdown', ctrl: false, shift: false, alt: false, meta: false },
                targets: ['CONTROL_BAR']
            } as any;

            component.volumeLeft = 1;
            component.volumeRight = 4;

            component.applyShortcut(evt);

            expect(volumeButtonEl.dispatchEvent).toHaveBeenCalled();
            expect(component.volumeLeft).toBe(0);
            expect(component.volumeRight).toBe(0);

            jasmine.clock().tick(1500);
            expect(component.hideAll).toHaveBeenCalledTimes(1);

            jasmine.clock().uninstall();
        });
        it('ArrowDown: affiche le slider volume, -5 sur L/R (min 0) puis encore -5 puis hideAll après 1500ms', () => {
            spyOn(component, 'hideAll');
            jasmine.clock().install();

            const evt = {
                shortcut: { key: 'arrowdown', ctrl: false, shift: false, alt: false, meta: false },
                targets: ['CONTROL_BAR']
            } as any;

            component.volumeLeft = 11;
            component.volumeRight = 14;

            component.applyShortcut(evt);
            expect(component.volumeLeft).toBe(6);
            expect(component.volumeRight).toBe(9);
            jasmine.clock().tick(1499);
            component.applyShortcut(evt);
            expect(component.volumeMouseEnterTimeOut).not.toBeNull();
            jasmine.clock().tick(1);
            expect(component.hideAll).not.toHaveBeenCalled();
            expect(component.volumeLeft).toBe(1);
            expect(component.volumeRight).toBe(4);

            jasmine.clock().tick(1499);
            expect(component.hideAll).toHaveBeenCalledTimes(1);

            jasmine.clock().uninstall();
        });
        it('ne fait rien si aucun raccourci ne correspond (et pas ArrowUp/ArrowDown)', () => {
            const muteSpy = spyOn(component, 'handleMuteUnmuteVolume');
            const clickSpy = spyOn(component, 'controlClicked');

            component.listOfShortcuts = [
                {
                    shortcut: { key: 'x', ctrl: false, shift: false, alt: false, meta: false },
                    control: 'playPause'
                }
            ];

            const evt = {
                shortcut: { key: 'y', ctrl: false, shift: false, alt: false, meta: false },
                targets: ['CONTROL_BAR']
            } as any;

            component.applyShortcut(evt);

            expect(muteSpy).not.toHaveBeenCalled();
            expect(clickSpy).not.toHaveBeenCalled();
        });
    });

    // -------------------------------------------------------------------------
    // controlClicked
    // -------------------------------------------------------------------------
    describe('controlClicked', () => {
        it('playPause: appelle mediaPlayer.playPause() et ferme le menu si ouvert', () => {
            component.enableMenu = true;

            component.controlClicked('playPause');

            expect(mediaPlayer.playPause).toHaveBeenCalledTimes(1);
            expect(component.enableMenu).toBeFalse();
        });

        it('volume: appelle la méthode privée toggleVolume()', () => {
            const toggleVolumeSpy = spyOn<any>(component, 'toggleVolume');
            component.controlClicked('volume');
            expect(toggleVolumeSpy).toHaveBeenCalledTimes(1);
        });

        it('viewRatio: appelle playPause() (même comportement que playPause)', () => {
            component.controlClicked('viewRatio');
            expect(mediaPlayer.playPause).toHaveBeenCalledTimes(1);
        });

        it('screenshot: captureImage(100)', () => {
            component.controlClicked('screenshot');
            expect(mediaPlayer.captureImage).toHaveBeenCalledOnceWith(100);
        });

        it('backward: déclenche prevPlaybackRate()', () => {
            const spyPrev = spyOn<any>(component, 'prevPlaybackRate');
            component.controlClicked('backward');
            expect(spyPrev).toHaveBeenCalledTimes(1);
        });

        it('slow-backward: déclenche prevSlowPlaybackRate()', () => {
            const spyPrevSlow = spyOn<any>(component, 'prevSlowPlaybackRate');
            component.controlClicked('slow-backward');
            expect(spyPrevSlow).toHaveBeenCalledTimes(1);
        });

        it('backward-5seconds: pauseOnly, movePrevFrame(frames) et play() si non en pause', () => {
            mediaPlayer.framerate = 25; // 5 s => 125 frames
            mediaPlayer.isPaused.and.returnValue(false);

            component.controlClicked('backward-5seconds');

            expect(mediaPlayer.pauseOnly).toHaveBeenCalled();
            expect(mediaPlayer.movePrevFrame).toHaveBeenCalledOnceWith(125);
            expect(mediaPlayer.play).toHaveBeenCalled();
        });

        it('forward-second: pauseOnly, moveNextFrame(frames) et pas de play() si en pause', () => {
            mediaPlayer.framerate = 30; // 1 s => 30 frames
            mediaPlayer.isPaused.and.returnValue(true);

            component.controlClicked('forward-second');

            expect(mediaPlayer.pauseOnly).toHaveBeenCalled();
            expect(mediaPlayer.moveNextFrame).toHaveBeenCalledOnceWith(30);
            expect(mediaPlayer.play).not.toHaveBeenCalled();
        });

        it('backward-frame: pauseOnly puis movePrevFrame(1)', () => {
            component.controlClicked('backward-frame');

            expect(mediaPlayer.pauseOnly).toHaveBeenCalled();
            expect(mediaPlayer.movePrevFrame).toHaveBeenCalledOnceWith(1);
        });

        it('backward-1h: recule de 3600 s (mode normal)', () => {
            mediaPlayer.reverseMode = false;
            mediaPlayer.getCurrentTime.and.returnValue(7200);

            component.controlClicked('backward-1h');

            expect(mediaPlayer.setCurrentTime).toHaveBeenCalledOnceWith(7200 - 3600);
        });

        it('forward-1h: en reverseMode, avance logique => time - 3600', () => {
            mediaPlayer.reverseMode = true;
            mediaPlayer.getDuration.and.returnValue(10000);
            mediaPlayer.getCurrentTime.and.returnValue(1000); // current = 9000 => 9000 - 3600 = 5400

            component.controlClicked('forward-1h');

            expect(mediaPlayer.setCurrentTime).toHaveBeenCalledOnceWith(5400);
        });

        it('backward-start: remet la vitesse à 1 puis seekToBegin()', () => {
            const spyChangeRate = spyOn<any>(component, 'changePlaybackRate');
            component.controlClicked('backward-start');

            expect(spyChangeRate).toHaveBeenCalledOnceWith(1);
            expect(mediaPlayer.seekToBegin).toHaveBeenCalledTimes(1);
        });

        it('forward: déclenche nextPlaybackRate()', () => {
            const spyNext = spyOn<any>(component, 'nextPlaybackRate');
            component.controlClicked('forward');
            expect(spyNext).toHaveBeenCalledTimes(1);
        });

        it('slow-forward: déclenche nextSlowPlaybackRate()', () => {
            const spyNextSlow = spyOn<any>(component, 'nextSlowPlaybackRate');
            component.controlClicked('slow-forward');
            expect(spyNextSlow).toHaveBeenCalledTimes(1);
        });

        it('forward-10seconds: pauseOnly puis moveNextFrame(10*framerate) et play() si non en pause', () => {
            mediaPlayer.framerate = 24; // 10 s => 240 frames
            mediaPlayer.isPaused.and.returnValue(false);

            component.controlClicked('forward-10seconds');

            expect(mediaPlayer.pauseOnly).toHaveBeenCalled();
            expect(mediaPlayer.moveNextFrame).toHaveBeenCalledOnceWith(240);
            expect(mediaPlayer.play).toHaveBeenCalled();
        });

        it('forward-frame: pauseOnly puis moveNextFrame(1)', () => {
            component.controlClicked('forward-frame');

            expect(mediaPlayer.pauseOnly).toHaveBeenCalled();
            expect(mediaPlayer.moveNextFrame).toHaveBeenCalledOnceWith(1);
        });

        it('forward-end: remet la vitesse à 1 puis seekToEnd()', () => {
            const spyChangeRate = spyOn<any>(component, 'changePlaybackRate');
            component.controlClicked('forward-end');

            expect(spyChangeRate).toHaveBeenCalledOnceWith(1);
            expect(mediaPlayer.seekToEnd).toHaveBeenCalledTimes(1);
        });

        it('displaySlider: appelle la méthode privée displaySlider()', () => {
            const spyDisplay = spyOn<any>(component, 'displaySlider');
            component.controlClicked('displaySlider');
            expect(spyDisplay).toHaveBeenCalledTimes(1);
        });

        it('pinControls: appelle la méthode privée pinControls()', () => {
            const spyPin = spyOn<any>(component, 'pinControls');
            component.controlClicked('pinControls');
            expect(spyPin).toHaveBeenCalledTimes(1);
        });

        it('toggleFullScreen: appelle la méthode privée toggleFullScreen()', () => {
            const spyFs = spyOn<any>(component, 'toggleFullScreen');
            component.controlClicked('toggleFullScreen');
            expect(spyFs).toHaveBeenCalledTimes(1);
        });

        it('aspectRatio: appelle changeAspectRatio()', () => {
            const spyRatio = spyOn(component, 'changeAspectRatio');
            component.controlClicked('aspectRatio');
            expect(spyRatio).toHaveBeenCalledTimes(1);
        });

        it('subtitles: appelle updateSubtitlePosition()', () => {
            const spySub = spyOn(component, 'updateSubtitlePosition');
            component.controlClicked('subtitles');
            expect(spySub).toHaveBeenCalledTimes(1);
        });

        it('download: appelle downloadUrl(control)', () => {
            const spyDl = spyOn(component, 'downloadUrl');
            component.controlClicked('download');
            expect(spyDl).toHaveBeenCalledOnceWith('download');
        });

        it('par défaut: log.warn("Control not implemented", control)', () => {
            component.controlClicked('not-implemented');
            expect((component as any).logger.warn)
                .toHaveBeenCalledWith('Control not implemented', 'not-implemented');
        });
    });
});
