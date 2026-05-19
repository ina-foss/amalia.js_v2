import {ComponentFixture, fakeAsync, flush, TestBed, tick} from '@angular/core/testing';
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
import {Renderer2} from '@angular/core';
import {ShortcutEvent, ShortcutControl, Shortcut} from 'src/app/core/config/model/shortcuts-event';
import {EventEmitter} from 'events';

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
                    data: {'tcParam': 'start', 'href': ''},
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
                    data: {'channelMergeVolume': false, 'channelMergerNode': ''},
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
        "extractTcIn": 10,
        "extractTcOut": 200,
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
    component.extractTcIn=10
    component.extractTcOut=300
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
        expect(component.extractTcIn).toBe(10);
        expect(component.extractTcOut).toBe(200);
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
        expect(component.extractTcIn).toBe(10);
        expect(component.extractTcOut).toBe(200);
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
        expect(component.extractTcIn).toBe(10);
        expect(component.extractTcOut).toBe(200);
        expect(getThumbnailMock).toHaveBeenCalledTimes(2);
        expect(initMock).toHaveBeenCalledTimes(2);
    }));

    it('should apply shortcut and call controlClicked', () => {
        const shortcut: Shortcut = {key: 'p', ctrl: false, shift: false, alt: false, meta: false};
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

    it('should apply shortcut and call controlClicked', () => {
        const shortcut: Shortcut = {key: 'p', ctrl: false, shift: false, alt: false, meta: false};
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
        const shortcut: Shortcut = {key: 'v', ctrl: false, shift: false, alt: false, meta: false};
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
        const shortcut: Shortcut = {key: 'arrowup', ctrl: false, shift: false, alt: false, meta: false};
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
        const shortcut: Shortcut = {key: 'arrowdown', ctrl: false, shift: false, alt: false, meta: false};
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
        addClass: () => {
        },
        removeClass: () => {
        },
        setStyle: () => {
        },
        removeStyle: () => {
        },
        setAttribute: () => {
        },
        removeAttribute: () => {
        },
        listen: () => () => {
        },
        createElement: () => document.createElement('div') as any,
        createText: () => document.createTextNode('') as any,
        appendChild: () => {
        },
        removeChild: () => {
        },
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

            mse: {setMaxBufferLengthConfig: jasmine.createSpy('setMaxBufferLengthConfig')}
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
            eventEmitter: {emit: emitSpy},
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
                    shortcut: {key: 'p', ctrl: false, shift: false, alt: false, meta: false},
                    control: 'playPause'
                }
            ];

            const evt = {
                shortcut: {key: 'p', ctrl: false, shift: false, alt: false, meta: false},
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
                    shortcut: {key: 'm', ctrl: false, shift: false, alt: false, meta: false},
                    control: 'volume'
                }
            ];

            const evt = {
                shortcut: {key: 'm', ctrl: false, shift: false, alt: false, meta: false},
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
                shortcut: {key: 'arrowup', ctrl: false, shift: false, alt: false, meta: false},
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
                shortcut: {key: 'arrowup', ctrl: false, shift: false, alt: false, meta: false},
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
                shortcut: {key: 'arrowdown', ctrl: false, shift: false, alt: false, meta: false},
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
                shortcut: {key: 'arrowdown', ctrl: false, shift: false, alt: false, meta: false},
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
                    shortcut: {key: 'x', ctrl: false, shift: false, alt: false, meta: false},
                    control: 'playPause'
                }
            ];

            const evt = {
                shortcut: {key: 'y', ctrl: false, shift: false, alt: false, meta: false},
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

        it('appelle seekTc(), ()',() => {
            const spySeekTo = spyOn<any>(component, 'seekTo').and.callThrough();
            component.seekTo(2);
            expect(spySeekTo).toHaveBeenCalledTimes(1);
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

        it('backward-5seconds: accumule les frames et exécute après debounce', fakeAsync(() => {
            mediaPlayer.framerate = 25; // 5 s => 125 frames
            mediaPlayer.isPaused.and.returnValue(false);

            component.controlClicked('backward-5seconds');
            
            // Avant le debounce, rien n'est exécuté
            expect(mediaPlayer.pauseOnly).not.toHaveBeenCalled();
            expect(mediaPlayer.movePrevFrame).not.toHaveBeenCalled();
            
            // Après le délai de debounce (150ms)
            tick(150);
            
            expect(mediaPlayer.pauseOnly).toHaveBeenCalled();
            expect(mediaPlayer.movePrevFrame).toHaveBeenCalledOnceWith(125);
            expect(mediaPlayer.play).toHaveBeenCalled();
        }));

        it('backward-5seconds: accumule plusieurs clics rapides', fakeAsync(() => {
            mediaPlayer.framerate = 25; // 5 s => 125 frames
            mediaPlayer.isPaused.and.returnValue(false);

            // 3 clics rapides = 375 frames (15 secondes)
            component.controlClicked('backward-5seconds');
            component.controlClicked('backward-5seconds');
            component.controlClicked('backward-5seconds');
            
            tick(150);
            
            expect(mediaPlayer.movePrevFrame).toHaveBeenCalledOnceWith(375);
        }));

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

        it('forward-5seconds: accumule les frames et exécute après debounce', fakeAsync(() => {
            mediaPlayer.framerate = 25; // 5 s => 125 frames
            mediaPlayer.isPaused.and.returnValue(false);

            component.controlClicked('forward-5seconds');
            
            // Avant le debounce, rien n'est exécuté
            expect(mediaPlayer.pauseOnly).not.toHaveBeenCalled();
            expect(mediaPlayer.moveNextFrame).not.toHaveBeenCalled();
            
            // Après le délai de debounce (150ms)
            tick(150);
            
            expect(mediaPlayer.pauseOnly).toHaveBeenCalled();
            expect(mediaPlayer.moveNextFrame).toHaveBeenCalledOnceWith(125);
            expect(mediaPlayer.play).toHaveBeenCalled();
        }));

        it('forward-5seconds: accumule plusieurs clics rapides', fakeAsync(() => {
            mediaPlayer.framerate = 25; // 5 s => 125 frames
            mediaPlayer.isPaused.and.returnValue(false);

            // 3 clics rapides = 375 frames (15 secondes)
            component.controlClicked('forward-5seconds');
            component.controlClicked('forward-5seconds');
            component.controlClicked('forward-5seconds');
            
            tick(150);
            
            expect(mediaPlayer.moveNextFrame).toHaveBeenCalledOnceWith(375);
        }));

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

describe('ControlBarPluginComponent (focused methods)', () => {
    let component: ControlBarPluginComponent;
    let fixture: ComponentFixture<ControlBarPluginComponent>;
    let rendererSpy: jasmine.SpyObj<Renderer2>;
    // Mocks simples pour les services
    let thumbnailService: ThumbnailService;
    let mediaPlayerElement = {
        getDisplayState: jasmine.createSpy('getDisplayState').and.returnValue('m'),
        getThumbnailUrl: jasmine.createSpy('getThumbnailUrl').and.callFake((tc: number) => `thumb?tc=${tc}`),
        // ci-dessous non utilisés par nos 4 méthodes visées, mais utiles au besoin :
        getMediaPlayer: jasmine.createSpy('getMediaPlayer').and.returnValue({}),
        eventEmitter: new EventEmitter()
    } as any;
    let playerService = jasmine.createSpyObj('MediaPlayerService', ['get']);
    playerService.get.and.returnValue(mediaPlayerElement);

    beforeEach(async () => {
        rendererSpy = jasmine.createSpyObj<Renderer2>('Renderer2', [
            'addClass',
            'removeClass',
            'setAttribute',
            'removeAttribute',
            'appendChild',
            'createElement',
            'setProperty',
            'setStyle',
            'removeStyle',
            'insertBefore',
            'selectRootElement',
            'listen',
            // on ne les utilise pas toutes, mais ça évite les erreurs d’API incomplète
        ]);

        await TestBed.configureTestingModule({
            declarations: [ControlBarPluginComponent, TcFormatPipe],
            imports: [HttpClientTestingModule],
            providers: [
                {provide: Renderer2, useValue: rendererSpy},
                {provide: MediaPlayerService, useValue: playerService},// si le token réel est exporté, remplace 'MediaPlayerService' par la classe
                ThumbnailService,     // idem
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
                // note: si tu as les classes concrètes, remplace les tokens string par les vraies classes
                .overrideComponent(ControlBarPluginComponent, {
                    set: { // pas de template requis pour ces tests
                        template: '<div></div>'
                    }
                })
                .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ControlBarPluginComponent);
        component = fixture.componentInstance;
        thumbnailService = TestBed.inject(ThumbnailService);
        const getThumbnailMock = spyOn(thumbnailService, 'getThumbnail');
        getThumbnailMock.and.resolveTo('data:image/png;base64,xxx');
        // ---- Mocks minimaux sur mediaPlayerElement utilisés par nos méthodes testées
        component['mediaPlayerElement'] = mediaPlayerElement;
        // ---- ViewChild simulés
        const progressBar = document.createElement('div');
        Object.defineProperty(progressBar, 'offsetWidth', {value: 100}); // largeur container
        component.progressBarElement = new ElementRef(progressBar);

        const controlBarContainer = document.createElement('div');
        component.controlBarContainer = new ElementRef(controlBarContainer);

        const thumbnailImg = document.createElement('img');
        component.thumbnailElement = new ElementRef(thumbnailImg);

        // Valeurs par défaut utilisées dans les calculs
        component.duration = 200; // ex: 200s

        fixture.detectChanges();
    });

    // ============ updateThumbnail ============
    it('updateThumbnail() doit calculer le tc et appeler setThumbnail avec l’URL et le currentTime attendus', () => {
        // ---- ViewChild simulés
        const progressBar = document.createElement('div');
        Object.defineProperty(progressBar, 'offsetWidth', {value: 100}); // largeur container
        component.progressBarElement = new ElementRef(progressBar);

        const controlBarContainer = document.createElement('div');
        component.controlBarContainer = new ElementRef(controlBarContainer);

        const thumbnailImg = document.createElement('img');
        component.thumbnailElement = new ElementRef(thumbnailImg);

        // Valeurs par défaut utilisées dans les calculs
        component.duration = 200; // ex: 200s

        // offsetX = 50, containerWidth = 100, duration = 200 -> tc = 100
        const evt = {offsetX: 50} as any;
        const setThumbnailSpy = spyOn(component, 'setThumbnail');

        component.updateThumbnail(evt);

        expect((component as any).mediaPlayerElement.getThumbnailUrl).toHaveBeenCalledWith(100, true);
        expect(setThumbnailSpy).toHaveBeenCalledOnceWith('thumb?tc=100', 100);
    });

    it('updateThumbnail() ne doit rien faire si tc n’est pas fini (containerWidth = 0)', () => {
        // ---- ViewChild simulés
        const progressBar = document.createElement('div');
        Object.defineProperty(progressBar, 'offsetWidth', {value: 0}); // largeur container
        component.progressBarElement = new ElementRef(progressBar);

        const controlBarContainer = document.createElement('div');
        component.controlBarContainer = new ElementRef(controlBarContainer);

        const thumbnailImg = document.createElement('img');
        component.thumbnailElement = new ElementRef(thumbnailImg);

        // Valeurs par défaut utilisées dans les calculs
        component.duration = 200; // ex: 200s

        //const progressBarNativeElement = component.progressBarElement.nativeElement as HTMLDivElement;
        //Object.defineProperty(progressBarNativeElement, 'offsetWidth', { value: 0 });
        const evt = {offsetX: 10} as any;

        const setThumbnailSpy = spyOn(component, 'setThumbnail');

        component.updateThumbnail(evt);

        expect(setThumbnailSpy).not.toHaveBeenCalled();
    });

    // ============ handleDisplayState ============
    describe('handleDisplayState()', () => {
        beforeEach(() => {
            // Élément de config couvrant les priorités 5/4/3/2 et différentes zones
            component.elements = [
                {control: 'c1', zone: 1, priority: 5},
                {control: 'c2', zone: 2, priority: 4},
                {control: 'c3', zone: 3, priority: 3},
                {control: 'c4', zone: 1, priority: 2},
                {control: 'c5', zone: 2, priority: 5, notInMenu: true}, // doit être filtré
            ] as any;
            spyOn(component, 'updatePinAndSpeedSliderPositions'); // on vérifie l’appel sans exécuter la logique DOM
        });

        it('affiche uniquement les priorités 5 en mode "m" et filtre notInMenu', fakeAsync(() => {
            (component as any).mediaPlayerElement.getDisplayState = jasmine.createSpy().and.returnValue('m');

            component.handleDisplayState();
            tick(120); // > 100ms pour le setTimeout
            const names = component.controls.map((c: any) => c.control);
            expect(names).toEqual(['c1']); // c5 est filtré (notInMenu)
            expect(component.updatePinAndSpeedSliderPositions).toHaveBeenCalled();
        }));

        it('affiche p5+p4 en mode "sm"', fakeAsync(() => {
            (component as any).mediaPlayerElement.getDisplayState = jasmine.createSpy().and.returnValue('sm');

            component.handleDisplayState();
            tick(120);

            const names = component.controls.map((c: any) => c.control).sort();
            expect(names).toEqual(['c1', 'c2'].sort());
        }));

        it('affiche p5+p4+p3 en mode "s"', fakeAsync(() => {
            (component as any).mediaPlayerElement.getDisplayState = jasmine.createSpy().and.returnValue('s');

            component.handleDisplayState();
            tick(120);

            const names = component.controls.map((c: any) => c.control).sort();
            expect(names).toEqual(['c1', 'c2', 'c3'].sort());
        }));

        it('affiche p5+p4+p3+p2 en mode "xs"', fakeAsync(() => {
            (component as any).mediaPlayerElement.getDisplayState = jasmine.createSpy().and.returnValue('xs');

            component.handleDisplayState();
            tick(120);

            const names = component.controls.map((c: any) => c.control).sort();
            expect(names).toEqual(['c1', 'c2', 'c3', 'c4'].sort());
        }));
    });

    // ============ hideAll ============
    describe('hideAll()', () => {
        it('doit replier tous les panneaux sauf "menu" quand control="menu"', () => {
            component.enableMenu = true;
            component.enableVolumeSlider = true;
            component.enableListPositionsSubtitle = true;
            component.enableListRatio = true;

            component.hideAll('menu');

            // menu reste ouvert, le reste se replie
            expect(component.enableMenu).toBeTrue();
            expect(component.enableVolumeSlider).toBeFalse();
            expect(component.enableListPositionsSubtitle).toBeFalse();
            expect(component.enableListRatio).toBeFalse();
        });

        it('doit replier aussi le menu quand control != "menu"', () => {
            component.enableMenu = true;
            component.enableVolumeSlider = true;
            component.enableListPositionsSubtitle = false;
            component.enableListRatio = true;

            component.hideAll('other');

            expect(component.enableMenu).toBeFalse();
            expect(component.enableVolumeSlider).toBeFalse();
            expect(component.enableListPositionsSubtitle).toBeFalse();
            expect(component.enableListRatio).toBeFalse();
        });

        it('ne change rien si tous sont déjà fermés', () => {
            component.enableMenu = false;
            component.enableVolumeSlider = false;
            component.enableListPositionsSubtitle = false;
            component.enableListRatio = false;

            component.hideAll();

            expect(component.enableMenu).toBeFalse();
            expect(component.enableVolumeSlider).toBeFalse();
            expect(component.enableListPositionsSubtitle).toBeFalse();
            expect(component.enableListRatio).toBeFalse();
        });
    });

    // ============ aspectRatioMouseEnter ============
    describe('aspectRatioMouseEnter()', () => {
        it('appelle hideAll("ratio"), ouvre la liste et la referme après 4s', fakeAsync(() => {
            const hideAllSpy = spyOn(component, 'hideAll').and.callThrough();

            component.aspectRatioMouseEnter();
            expect(hideAllSpy).toHaveBeenCalledOnceWith('ratio');
            expect(component.enableListRatio).toBeTrue();

            // après 4s, la liste se referme
            tick(4000);
            expect(component.enableListRatio).toBeFalse();
        }));

        it('annule un timer précédent s’il existe', fakeAsync(() => {
            const clearSpy = spyOn(window, 'clearTimeout').and.callThrough();
            // on installe un timer existant
            component.aspectRatioMouseEnterTimeOut = setTimeout(() => {
            }, 999999);

            component.aspectRatioMouseEnter();
            expect(clearSpy).toHaveBeenCalled(); // le timer précédent est annulé

            // cleanup timers
            tick(4000);
        }));
    });
});

describe('ControlBarPluginComponent (coverage boost)', () => {
    let component: ControlBarPluginComponent;
    let renderer: jasmine.SpyObj<Renderer2>;
    let mediaPlayer: any;
    let eventEmitter: { emit: jasmine.Spy };
    let thumbnailService: any;

    beforeEach(() => {
        renderer = jasmine.createSpyObj<Renderer2>('Renderer2', ['addClass', 'removeClass']);
        thumbnailService = {getThumbnail: jasmine.createSpy('getThumbnail').and.resolveTo('blob:data')};

        component = new ControlBarPluginComponent({} as any, thumbnailService as any, renderer);
        (component as any).logger = {
            debug: jasmine.createSpy('debug'),
            info: jasmine.createSpy('info'),
            warn: jasmine.createSpy('warn')
        };

        mediaPlayer = {
            withMergeVolume: false,
            reverseMode: false,
            playbackRate: 1,
            framerate: 25,
            mse: {
                setMaxBufferLengthConfig: jasmine.createSpy('setMaxBufferLengthConfig'),
                switchToMainSrc: jasmine.createSpy('switchToMainSrc').and.resolveTo(undefined)
            },
            setVolume: jasmine.createSpy('setVolume'),
            setCurrentTime: jasmine.createSpy('setCurrentTime'),
            getCurrentTime: jasmine.createSpy('getCurrentTime').and.returnValue(12.34),
            getDuration: jasmine.createSpy('getDuration').and.returnValue(120),
            getVolume: jasmine.createSpy('getVolume').and.callFake((side?: string) => side ? 20 : 30),
            isPaused: jasmine.createSpy('isPaused').and.returnValue(false),
            play: jasmine.createSpy('play'),
            pause: jasmine.createSpy('pause'),
            pauseOnly: jasmine.createSpy('pauseOnly'),
            moveNextFrame: jasmine.createSpy('moveNextFrame'),
            movePrevFrame: jasmine.createSpy('movePrevFrame'),
            mute: jasmine.createSpy('mute'),
            unmute: jasmine.createSpy('unmute'),
            initAudioChannelMerger: jasmine.createSpy('initAudioChannelMerger'),
            setReverseMode: jasmine.createSpy('setReverseMode'),
            seekToBegin: jasmine.createSpy('seekToBegin'),
            seekToEnd: jasmine.createSpy('seekToEnd'),
            playPause: jasmine.createSpy('playPause'),
            captureImage: jasmine.createSpy('captureImage')
        };
        eventEmitter = {emit: jasmine.createSpy('emit')};

        component.mediaPlayerElement = {
            getMediaPlayer: () => mediaPlayer,
            eventEmitter,
            getDisplayState: () => 'm',
            getThumbnailUrl: (tc: number) => `thumb?tc=${tc}`,
            aspectRatio: '4:3',
            getConfiguration: () => ({thumbnail: {baseUrl: 'x', enableThumbnail: true}})
        } as any;

        component.pluginConfiguration = {
            data: [{control: 'volume', data: {tracks: [{label: 'Track A', track: 'a'}]}}]
        } as any;
        component.elements = component.pluginConfiguration.data as any;
    });

    it('handles display slider/pin icon classes', () => {
        const pin = document.createElement('div');
        const pinSvg = document.createElement('svg');
        pin.appendChild(pinSvg);
        const slider = document.createElement('div');
        const sliderSvg = document.createElement('svg');
        slider.appendChild(sliderSvg);

        slider.style.display = 'none';
        pin.style.display = 'block';
        document.body.appendChild(slider);
        document.body.appendChild(pin);
        component.displaySliderElement = new ElementRef(slider);
        component.pinControlsElement = new ElementRef(pin);
        component.listenToDisplaySliderDisplayChanges();
        component.listenToPinControlsDisplayChanges();
        expect(renderer.removeClass).toHaveBeenCalled();
        expect(renderer.addClass).toHaveBeenCalled();
        document.body.removeChild(slider);
        document.body.removeChild(pin);
    });

    it('updates pin/slider positions for missing element branches', () => {
        const pin = document.createElement('div');
        const pinSvg = document.createElement('svg');
        pin.appendChild(pinSvg);
        const slider = document.createElement('div');
        const sliderSvg = document.createElement('svg');
        slider.appendChild(sliderSvg);
        component.pinControlsElement = new ElementRef(pin);
        component.displaySliderElement = undefined as any;
        component.updatePinAndSpeedSliderPositions();

        component.pinControlsElement = undefined as any;
        component.displaySliderElement = new ElementRef(slider);
        component.updatePinAndSpeedSliderPositions();
        expect(renderer.removeClass).toHaveBeenCalled();
    });

    it('routes shortcuts and progress bar slide events', () => {
        const applySpy = spyOn(component, 'applyShortcut');
        component.handleShortcuts({targets: ['control_bar'], shortcut: {key: 'a', ctrl: false, shift: false, alt: false, meta: false}} as any);
        expect(applySpy).toHaveBeenCalled();

        spyOn(component, 'getMouseValue').and.returnValue(50);
        component.inSliding = true;
        component.duration = 200;
        component.inverse = true;
        component.handleProgressBarMouseMove({} as any);
        expect(component.currentTime).toBe(100);
        expect(component.time).toBe(100);
        expect(eventEmitter.emit).toHaveBeenCalledWith(PlayerEventType.SEEKING, 100);
    });

    it('handles callback, menu close and fullscreen flag update', () => {
        const callbackSpy = spyOn(component.callback, 'emit');
        component.handleCallback({control: 'playPause'} as any);
        expect(callbackSpy).toHaveBeenCalled();

        component.enableMenu = true;
        component.hideControlsMenuOnClickDocument();
        expect(component.enableMenu).toBeFalse();

        spyOn(component, 'handleDisplayState');
        Object.defineProperty(document, 'fullscreenElement', {value: {} as Element, configurable: true});
        component.handleWindowResize();
        expect(component.handleDisplayState).toHaveBeenCalled();
        expect(component.fullScreenMode).toBeTrue();
        Object.defineProperty(document, 'fullscreenElement', {value: null, configurable: true});
    });

    it('builds default config and shortcuts', () => {
        const cfg = component.getDefaultConfig();
        expect(cfg.name).toBe(ControlBarPluginComponent.PLUGIN_NAME);
        expect(cfg.data.length).toBe(3);

        component.initShortcuts([
            {control: 'download', key: 'Control + Shift + D'} as any,
            {control: 'volume', key: 'Alt + M'} as any
        ]);
        expect(component.listOfShortcuts.length).toBe(2);
        expect(component.listOfShortcuts[0].shortcut.ctrl).toBeTrue();
        expect(component.listOfShortcuts[0].shortcut.shift).toBeTrue();
        expect(component.listOfShortcuts[1].shortcut.alt).toBeTrue();
    });

    it('seeks and returns null collections when elements are absent', () => {
        component.seekTo(42);
        expect(mediaPlayer.setCurrentTime).toHaveBeenCalledWith(42);

        component.elements = null as any;
        expect(component.getControlsByZone(1)).toBeNull();
        expect(component.getControlsByPriority(1, 1)).toBeNull();
    });

    it('changes volume in merge and non-merge modes', () => {
        mediaPlayer.withMergeVolume = false;
        component.changeVolume(40, 'l');
        expect(mediaPlayer.setVolume).toHaveBeenCalledWith(40, 'l');

        mediaPlayer.withMergeVolume = true;
        component.volumeLeft = 65;
        component.volumeRight = 10;
        component.changeVolume(65, 'l');
        expect(component.volumeRight).toBe(65);
        expect(mediaPlayer.setVolume).toHaveBeenCalledWith(65);
    });

    it('moves slider cursor for reverse, image-mode and normal branches', () => {
        component.duration = 100;
        component.currentPlaybackRate = 1;
        component.moveSliderCursor(40);
        expect(component.playbackrateByImages).toBeFalse();

        mediaPlayer.reverseMode = true;
        component.moveSliderCursor(10);
        expect(mediaPlayer.setCurrentTime).toHaveBeenCalledWith(90);

        mediaPlayer.reverseMode = false;
        component.playbackrateByImages = true;
        component.currentPlaybackRate = 2;
        component.moveSliderCursor(20);
        expect(eventEmitter.emit).toHaveBeenCalledWith(PlayerEventType.PLAYBACK_RATE_IMAGES_CHANGE, 2);
    });

    it('moves tooltip and toggles aspect/default ratio', fakeAsync(() => {
        const tooltip = document.createElement('tooltip');
        document.body.appendChild(tooltip);
        const host = document.createElement('div');
        component.controlBarContainer = new ElementRef(host);
        component.fullScreenMode = true;
        component.changeTooltipEmplacement();
        tick(151);
        expect(host.querySelector('tooltip')).toBeTruthy();

        component.aspectRatio = '4:3';
        component.changeAspectRatio();
        expect((component.mediaPlayerElement as any).aspectRatio).toBe('16:9');
        component.getDefaultAspectRatio();
        expect(component.aspectRatio).toBe('16:9');
    }));

    it('updates playback rate, merge state and thumbnail visibility', () => {
        mediaPlayer.isPaused.and.returnValue(true);
        component.onChangePlaybackRate(0.5);
        expect(component.currentPlaybackRateSlider).toBe(0.5);
        expect(mediaPlayer.play).toHaveBeenCalled();

        component.volumeLeft = 10;
        component.volumeRight = 40;
        mediaPlayer.withMergeVolume = false;
        component.changeSameVolumeState();
        expect(component.volumeLeft).toBe(40);
        expect(component.volumeRight).toBe(40);

        component.enableThumbnail = true;
        component.inSliding = false;
        component.progressBarMouseEnter({} as any);
        expect(component.thumbnailHidden).toBeFalse();
        component.progressBarMouseLeave();
        expect(component.thumbnailHidden).toBeTrue();
    });

    it('handles progress bar move/down/up and getMouseValue', () => {
        const progress = document.createElement('div');
        Object.defineProperty(progress, 'offsetWidth', {value: 200});
        const thumb = document.createElement('img');
        Object.defineProperty(thumb, 'offsetWidth', {value: 50});
        component.progressBarElement = new ElementRef(progress);
        component.thumbnailElement = new ElementRef(thumb);
        component.enableThumbnail = true;
        component.thumbnailHidden = false;
        component.inSliding = false;
        component.duration = 100;
        component.throttleFunc = jasmine.createSpy('throttle');

        component.progressBarMouseMove({offsetX: 100} as any);
        expect(component.tcThumbnail).toBe(50);
        expect(component.thumbnailPosition).toBeGreaterThanOrEqual(0);

        component.handleProgressBarMouseDown();
        expect(component.inSliding).toBeTrue();
        spyOn(component, 'moveSliderCursor');
        component.handleProgressBarMouseUp({offsetX: 50} as any);
        expect(component.moveSliderCursor).toHaveBeenCalled();
        expect(eventEmitter.emit).toHaveBeenCalledWith(PlayerEventType.SEEKED, 25);
        expect(component.getMouseValue({offsetX: 100} as any)).toBe(50);
    });

    it('sets thumbnail only when blob is defined', fakeAsync(() => {
        const img = document.createElement('img');
        component.thumbnailElement = new ElementRef(img);
        const setAttrSpy = spyOn(img, 'setAttribute').and.callThrough();
        component.setThumbnail('u', 1);
        flush();
        expect(setAttrSpy).toHaveBeenCalledWith('src', 'blob:data');

        thumbnailService.getThumbnail.and.resolveTo(undefined);
        component.setThumbnail('u', 2);
        flush();
        expect(setAttrSpy.calls.count()).toBe(1);
    }));

    it('covers playback helpers and image playback branches', fakeAsync(() => {
        spyOn(component, 'selectActivePlaybackrate');
        component.currentPlaybackRate = 2;
        (component as any).prevPlaybackRate();
        expect(component.inverse).toBeTrue();
        expect(mediaPlayer.mse.setMaxBufferLengthConfig).toHaveBeenCalled();

        component.currentPlaybackRate = 2;
        (component as any).nextPlaybackRate();
        expect(mediaPlayer.mse.setMaxBufferLengthConfig).toHaveBeenCalled();

        component.currentPlaybackRate = 2;
        spyOn<any>(component, 'changePlaybackRate').and.callThrough();
        component.nextPlaybackRateImages(10);
        expect((component as any).changePlaybackRate).toHaveBeenCalled();

        component.currentPlaybackRate = 2;
        component.nextPlaybackRateImages(4);
        expect(eventEmitter.emit).toHaveBeenCalledWith(PlayerEventType.PLAYBACK_RATE_IMAGES_CHANGE, 6);

        component.currentPlaybackRate = -2;
        mediaPlayer.reverseMode = true;
        component.previousPlaybackRateImages(-4);
        flush();
        expect(mediaPlayer.mse.switchToMainSrc).toHaveBeenCalled();
        expect(mediaPlayer.setReverseMode).toHaveBeenCalledWith(false);
    }));

    it('covers subtitle, slider, pin, volume and tracks utilities', fakeAsync(() => {
        component.listOfSubtitles = [{label: 'Bas', key: 'down'}, {label: 'Haut', key: 'up'}];
        component.subtitlePosition = 'down';
        component.updateSubtitlePosition();
        expect(component.subtitlePosition).toBe('down');
        component.updateSubtitlePosition('down');
        expect(component.selectedLabel).toBe('Bas');

        component.enablePlaybackSlider = false;
        component.pinnedSlider = true;
        component.enablePinnedSlider = true;
        spyOn<any>(component, 'initDragThumb');
        (component as any).displaySlider();
        tick(11);
        expect(eventEmitter.emit).toHaveBeenCalled();

        (component as any).pinControls();
        expect(component.pinnedSlider).toBeFalse();
        component.setVideoAspectRatio('16:9');
        expect((component.mediaPlayerElement as any).aspectRatio).toBe('16:9');

        component.selectedSlider = 'slider1';
        component.changeSlider();
        tick(11);
        expect(component.selectedSlider).toBe('slider2');

        component.inverse = false;
        component.duration = 100;
        component.currentTime = 25;
        component.switchDisplayCurrentTime();
        expect(component.time).toBe(75);

        const clickSpy = jasmine.createSpy('click');
        component.volumeButton = new ElementRef({click: clickSpy} as any);
        component.volumeLeft = 30;
        component.volumeRight = 10;
        (component as any).toggleVolume();
        expect(mediaPlayer.mute).toHaveBeenCalled();
        component.volumeLeft = 0;
        component.volumeRight = 0;
        (component as any).toggleVolume();
        expect(mediaPlayer.unmute).toHaveBeenCalled();

        component.volumeMouseEnter({foo: 'bar'});
        tick(4001);
        expect(component.enableVolumeSlider).toBeFalse();

        component.initTracks();
        expect(component.selectedTrack).toBe('a');
        component.changeAudioTrack('a');
        expect(component.selectedTrackLabel).toBe('Track A');
    }));

    it('covers remaining playback and shortcut branches', fakeAsync(() => {
        component.handlePlaybackRateChangeByImages();
        expect(component.playbackrateByImages).toBeTrue();
        component.handlePlaybackRateChangeByImagesStop();
        expect(component.playbackrateByImages).toBeFalse();

        mediaPlayer.isPaused.and.returnValue(true);
        (component as any).handlePlaybackRateChange(0.5);
        expect(mediaPlayer.play).toHaveBeenCalled();
        expect(component.currentPlaybackRateSlider).toBe(0.5);

        component.inSliding = true;
        component.duration = 100;
        component.inverse = false;
        spyOn(component, 'getMouseValue').and.returnValue(25);
        component.handleProgressBarMouseMove({} as any);
        expect(component.time).toBe(25);

        mediaPlayer.framerate = 20;
        mediaPlayer.isPaused.and.returnValue(false);
        component.controlClicked('backward-second');
        component.controlClicked('backward-10seconds');
        expect(mediaPlayer.movePrevFrame).toHaveBeenCalledWith(20);
        expect(mediaPlayer.movePrevFrame).toHaveBeenCalledWith(200);
        expect(mediaPlayer.play).toHaveBeenCalled();

        component.onChangePlaybackRate(2);
        expect(component.currentPlaybackRateSlider).toBe(2);
    }));

    it('covers remaining menu/subtitle/fix branches', fakeAsync(() => {
        spyOn(component, 'selectActivePlaybackrate');
        spyOn<any>(component, 'changePlaybackRate');
        spyOn<any>(component, 'initDragThumb');

        component.currentPlaybackRate = -2;
        mediaPlayer.reverseMode = false;
        component.previousPlaybackRateImages(-8);
        expect((component as any).changePlaybackRate).toHaveBeenCalled();

        component.currentPlaybackRate = -2;
        component.previousPlaybackRateImages(-4);
        expect(eventEmitter.emit).toHaveBeenCalledWith(PlayerEventType.PLAYBACK_RATE_IMAGES_CHANGE, -6);

        component.currentPlaybackRate = 0.5;
        (component as any).nextSlowPlaybackRate();
        expect((component as any).changePlaybackRate).toHaveBeenCalled();
        (component as any).prevSlowPlaybackRate();
        expect((component as any).changePlaybackRate).toHaveBeenCalledTimes(3);

        component.handlePlayerMouseHover();
        expect(component.activated).toBeTrue();

        component.enablePlaybackSlider = false;
        component.pinnedSlider = false;
        component.enablePinnedSlider = false;
        (component as any).displaySlider();
        tick(11);
        expect(eventEmitter.emit).toHaveBeenCalledWith(PlayerEventType.PINNED_CONTROLBAR_CHANGE, false);

        component.enablePlaybackSlider = true;
        component.pinnedSlider = false;
        component.enablePinnedSlider = false;
        (component as any).pinControls();
        expect(eventEmitter.emit).toHaveBeenCalledWith(PlayerEventType.PINNED_SLIDER_CHANGE, true);

        (component as any).fixControlBar();
        expect(eventEmitter.emit).toHaveBeenCalledWith(PlayerEventType.PINNED_CONTROLBAR_CHANGE, true);

        component.inverse = true;
        component.currentTime = 10;
        component.duration = 80;
        component.switchDisplayCurrentTime();
        expect(component.inverse).toBeFalse();
        expect(component.time).toBe(10);

        const clearSpy = spyOn(window, 'clearTimeout').and.callThrough();
        component.volumeMouseEnterTimeOut = setTimeout(() => undefined, 9999);
        component.volumeMouseEnter({channelMergeVolume: true});
        expect(clearSpy).toHaveBeenCalled();
        tick(4001);
    }));

    it('covers download URL helpers', () => {
        const a = document.createElement('a');
        component.currentTime = 77;
        component.buildUrlWithTc(a, {data: {href: 'https://host/a', tcParam: 'start'}} as any);
        expect(a.getAttribute('href')).toBe('https://host/a?start=12.34');

        component.buildUrlWithTc(a, {data: {href: 'https://host/a?x=1', tcParam: 'start'}} as any);
        expect(a.getAttribute('href')).toBe('https://host/a?x=1&start=77');

        component.elements = [{control: 'download', key: 'd', data: {href: 'https://host/dl', tcParam: 'tc'}}] as any;
        component.keypressed = 'd';
        const openSpy = spyOn<any>(component, 'openDownloadUrl');
        component.downloadUrl('download');
        expect(openSpy).toHaveBeenCalled();
    });
});
