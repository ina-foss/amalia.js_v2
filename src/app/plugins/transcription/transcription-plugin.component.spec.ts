import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TranscriptionPluginComponent} from './transcription-plugin.component';
import {MediaPlayerService} from '../../service/media-player-service';
import {ElementRef} from '@angular/core';
import {HistogramPluginComponent} from "../histogram/histogram-plugin.component";
import {MediaPlayerElement} from "../../core/media-player-element";
import {DefaultLogger} from "../../core/logger/default-logger";
import {HttpClient} from "@angular/common/http";
import {DefaultConfigLoader} from "../../core/config/loader/default-config-loader";
import {DefaultConfigConverter} from "../../core/config/converter/default-config-converter";
import {ConfigurationManager} from "../../core/config/configuration-manager";
import {DefaultMetadataLoader} from "../../core/metadata/loader/default-metadata-loader";
import {DefaultMetadataConverter} from "../../core/metadata/converter/default-metadata-converter";
import {MetadataManager} from "../../core/metadata/metadata-manager";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {MediaElement} from "../../core/media/media-element";

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
            imports: [HttpClientTestingModule],
            providers: [MediaPlayerService]
        }).compileComponents();
    });

    beforeEach(() => {
        mediaPlayerService = TestBed.inject(MediaPlayerService);
        fixture = TestBed.createComponent(TranscriptionPluginComponent);
        component = fixture.componentInstance;
        component.transcriptionElement = new ElementRef(document.createElement('div'));
        component.headerElement = new ElementRef(document.createElement('div'));
        component.searchText = new ElementRef(document.createElement('input'));
        mediaPlayerElement = initTestData(component, mediaPlayerElement, logger, httpClient);
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
        spyOn(component, '_handleMetadataLoadedForTesting').and.callThrough();
        component._handleMetadataLoadedForTesting();
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
        const event = new KeyboardEvent('keydown', {key: 'Enter'});
        spyOn(component, 'handleShortcut').and.callThrough();
        component.handleShortcut(event);
        expect(component.handleShortcut).toHaveBeenCalledWith(event);
    });
});
