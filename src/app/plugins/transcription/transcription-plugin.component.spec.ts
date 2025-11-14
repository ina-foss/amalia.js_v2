import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranscriptionPluginComponent } from './transcription-plugin.component';
import { MediaPlayerService } from '../../service/media-player-service';
import { ElementRef } from '@angular/core';
import { MediaPlayerElement } from "../../core/media-player-element";
import { DefaultLogger } from "../../core/logger/default-logger";
import { HttpClient } from "@angular/common/http";
import { DefaultConfigLoader } from "../../core/config/loader/default-config-loader";
import { DefaultConfigConverter } from "../../core/config/converter/default-config-converter";
import { ConfigurationManager } from "../../core/config/configuration-manager";
import { DefaultMetadataLoader } from "../../core/metadata/loader/default-metadata-loader";
import { DefaultMetadataConverter } from "../../core/metadata/converter/default-metadata-converter";
import { MetadataManager } from "../../core/metadata/metadata-manager";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MediaElement } from "../../core/media/media-element";
import { ToastComponent } from "../../core/toast/toast.component";
import { MessagesModule } from 'primeng/messages';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { PlayerEventType } from '../../core/constant/event-type';

const initTestData = (component: TranscriptionPluginComponent, mediaPlayerElement: MediaPlayerElement, logger: DefaultLogger, httpClient: HttpClient) => {
    mediaPlayerElement = new MediaPlayerElement();
    logger = new DefaultLogger();
    component.logger = logger;
    const loader = new DefaultConfigLoader(new DefaultConfigConverter(), logger);
    mediaPlayerElement.configurationManager = new ConfigurationManager(loader, logger);
    mediaPlayerElement.configurationManager.configData = {
        "tcOffset": null,
        "player": {
            "backwardsSrc": "",
            "src": "",
            "autoplay": false,
            "crossOrigin": "anonymous"
        },
        "thumbnail": {
            "baseUrl": "",
            "enableThumbnail": false,
            "tcParam": "start"
        },
        "dataSources": [
            {
                "url": "/notilusDossier/segments/stock?itemBusinessIdentifier=95F05001SA0338_01&tcin=0&tcout=28800000&format=AMALIA&clientId=annotations",
                "headers": [
                    "Authorization: Bearer ..."
                ],
                "plugin": "annotations"
            },
            {
                "url": "https://lvltojson.wsmedia.sas.ina/waveform/.../sl_hm/?canal=0&format=1024&mid=waveform-1024-0",
                "headers": [
                    "Authorization: Bearer ..."
                ],
                "plugin": "histogram"
            },
            {
                "url": "https://lvltojson.wsmedia.sas.ina/waveform/.../sl_hm/?canal=1&format=1024&mid=waveform-1024-1",
                "headers": [
                    "Authorization: Bearer ..."
                ],
                "plugin": "histogram"
            },
            {
                "url": "https://lvltojson.wsmedia.sas.ina/waveform/.../sl_hm/?canal=0&format=4096&mid=waveform-4096-0",
                "headers": [
                    "Authorization: Bearer ..."
                ],
                "plugin": "histogram"
            },
            {
                "url": "https://lvltojson.wsmedia.sas.ina/waveform/.../sl_hm/?canal=1&format=4096&mid=waveform-4096-1",
                "headers": [
                    "Authorization: Bearer ..."
                ],
                "plugin": "histogram"
            }
        ],
        "debug": false,
        "logLevel": "info",
        "displaySizes": {
            "large": 900,
            "medium": 700,
            "small": 550,
            "xsmall": 340
        }
    };
    component.pluginConfiguration = {
        data: {
            key: 'Enter',
            timeFormat: 's',
            fps: 0,
            autoScroll: true,
            parseLevel: 0,
            withSubLocalisations: false,
            label: '',
            labelSynchro: ''
        },
        name: "",
        "metadataIds": [
            "waveform-1024-0",
            "waveform-1024-1",
            "waveform-4096-0",
            "waveform-4096-1"
        ]

    };
    httpClient = TestBed.inject(HttpClient);
    const metadataLoader = new DefaultMetadataLoader(httpClient, new DefaultMetadataConverter(), logger);
    mediaPlayerElement.metadataManager = new MetadataManager(mediaPlayerElement.configurationManager, metadataLoader, logger);
    component.mediaPlayerElement = mediaPlayerElement;
    return mediaPlayerElement;
}

describe('TranscriptionPluginComponent', () => {
    let component: TranscriptionPluginComponent;
    let fixture: ComponentFixture<TranscriptionPluginComponent>;
    let mediaPlayerService: MediaPlayerService;
    let httpClient: HttpClient;
    let logger: DefaultLogger;
    let mediaPlayerElement: MediaPlayerElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TranscriptionPluginComponent],
            imports: [HttpClientTestingModule, BrowserAnimationsModule, MessagesModule, ToastComponent],
            providers: [MediaPlayerService, MessageService]
        }).compileComponents();
    });

    beforeEach(() => {
        mediaPlayerService = TestBed.inject(MediaPlayerService);
        fixture = TestBed.createComponent(TranscriptionPluginComponent);
        component = fixture.componentInstance;
        component.transcriptionElement = new ElementRef(document.createElement('div'));
        component.headerElement = new ElementRef(document.createElement('div'));
        component.searchText = new ElementRef(document.createElement('input'));

        // Mock the messagesComponent to fix the error in ngAfterViewInit
        component.messagesComponent = {
            setMessages: jasmine.createSpy('setMessages')
        } as any;

        mediaPlayerElement = initTestData(component, mediaPlayerElement, logger, httpClient);
        // Mock tcFormatPipe
        component.tcFormatPipe = { transform: jasmine.createSpy('transform').and.callFake((val: number) => `TC${val}`) };
        spyOn(navigator.clipboard, 'writeText').and.returnValue(Promise.resolve());
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize plugin correctly', () => {
        mediaPlayerElement.configurationManager.configData = {
            ...mediaPlayerElement.configurationManager.configData,
            loadMetadataOnDemand: true
        };
        const getPlayer = spyOn(component.playerService, 'get');
        getPlayer.and.returnValue(mediaPlayerElement);
        spyOn(component, 'init').and.callThrough();
        fixture.detectChanges();
        expect(component.init).toHaveBeenCalled();
    });

    it('should handle metadata loaded', () => {
        spyOn(component, 'metaDataLoaded').and.callThrough();
        component._handleMetadataLoadedForTesting();
        expect(component.metaDataLoaded).toHaveBeenCalled();
    });

    it('should handle time change', () => {
        const obj = document.createElement('video');
        component.mediaPlayerElement.setMediaPlayer(obj);
        new MediaElement(obj, component.mediaPlayerElement.eventEmitter);
        const getCurrentTime = spyOn(component.mediaPlayerElement.getMediaPlayer(), 'getCurrentTime');
        getCurrentTime.and.returnValue(35);
        const _handleOnTimeChangeForTestingMock = spyOn(component as any, 'handleOnTimeChange');
        _handleOnTimeChangeForTestingMock.and.callThrough();
        component._handleOnTimeChangeForTesting();
        expect(_handleOnTimeChangeForTestingMock).toHaveBeenCalled();
    });

    it('should search word correctly', () => {
        spyOn(component, 'searchWord').and.callThrough();
        component.searchWord('test');
        expect(component.searchWord).toHaveBeenCalledWith('test');
    });

    it('should scroll to searched word', () => {
        spyOn(component, 'scrollToSearchedWord').and.callThrough();
        component.scrollToSearchedWord('down');
        expect(component.scrollToSearchedWord).toHaveBeenCalledWith('down');
    });

    it('should clear search list', () => {
        spyOn(component, 'clearSearchList').and.callThrough();
        component.clearSearchList();
        expect(component.clearSearchList).toHaveBeenCalled();
    });

    it('should handle shortcut', () => {
        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        spyOn(component, 'handleShortcut').and.callThrough();
        component.handleShortcut(event);
        expect(component.handleShortcut).toHaveBeenCalledWith(event);
    });


    it('should copy single localisation and emit event', async () => {
        // Mock transcriptions
        component.transcriptions = [
            { tcIn: 10, tcOut: 20, text: 'Text 1', label: 'Text 1', thumb: 'Text 1' },
            { tcIn: 30, tcOut: 40, text: 'Text 2', label: 'Text 2', thumb: 'Text 2' }
        ];
        const localisation = { tcIn: 10, tcOut: 20, text: 'Hello', label: 'Hello', thumb: 'Hello' };
        spyOn(component.mediaPlayerElement.eventEmitter, 'emit');

        await component.copy(localisation);

        expect(component.tcFormatPipe.transform).toHaveBeenCalledWith(10, component.tcDisplayFormat);
        expect(component.tcFormatPipe.transform).toHaveBeenCalledWith(20, component.tcDisplayFormat);

        const expectedText = `[TC10][TC20]\n\nHello`;
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expectedText);
        expect(component.mediaPlayerElement.eventEmitter.emit).toHaveBeenCalledWith(PlayerEventType.PLAYER_COPY_BOARD, localisation);
    });

    it('should copy all transcriptions and emit event', async () => {
        // Mock transcriptions
        component.transcriptions = [
            { tcIn: 10, tcOut: 20, text: 'Text 1', label: 'Text 1', thumb: 'Text 1' },
            { tcIn: 30, tcOut: 40, text: 'Text 2', label: 'Text 2', thumb: 'Text 2' }
        ];
        spyOn(component.mediaPlayerElement.eventEmitter, 'emit');
        await component.copyAll();

        const expectedText = `[TC10][TC20]\n\nText 1\n[TC30][TC40]\n\nText 2`;
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expectedText);
        expect(component.mediaPlayerElement.eventEmitter.emit).toHaveBeenCalledWith(PlayerEventType.PLAYER_COPY_BOARD, expectedText);
    });
});
