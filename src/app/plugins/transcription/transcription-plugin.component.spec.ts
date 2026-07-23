import { ComponentFixture, TestBed } from '@angular/core/testing';
import { fakeAsync, tick } from '@angular/core/testing';
import { TranscriptionPluginComponent } from './transcription-plugin.component';
import { MediaPlayerService } from '../../service/media-player-service';
import { CUSTOM_ELEMENTS_SCHEMA, ElementRef } from '@angular/core';
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
import { MessageModule } from 'primeng/message';
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
            imports: [HttpClientTestingModule, MessageModule],
            providers: [MediaPlayerService, MessageService],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
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

        const expectedText = `[TC10][TC20]\nText 1\n\n[TC30][TC40]\nText 2`;
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expectedText);
        expect(component.mediaPlayerElement.eventEmitter.emit).toHaveBeenCalledWith(PlayerEventType.PLAYER_COPY_BOARD, expectedText);
    });

    it('should select segment at tc 0 on time change', () => {
        const obj = document.createElement('video');
        component.mediaPlayerElement.setMediaPlayer(obj);
        new MediaElement(obj, component.mediaPlayerElement.eventEmitter);
        spyOn(component.mediaPlayerElement.getMediaPlayer(), 'getCurrentTime').and.returnValue(0);
        component.pluginConfiguration.data.mode = 2;
        component.pluginConfiguration.data.autoScroll = true;

        const container = document.createElement('div');
        container.innerHTML = `
            <div class="segment" data-tcin="0" data-tcout="2">
                <div class="subsegment">
                    <div class="text">
                        <span class="w" data-tcin="0" data-tcout="2">Bonjour</span>
                    </div>
                </div>
            </div>
        `;
        component.transcriptionElement = new ElementRef(container);

        component._handleOnTimeChangeForTesting();

        expect(container.querySelector('.segment.selected')).toBeTruthy();
    });

    it('should update the selected word while staying in the same segment', () => {
        const obj = document.createElement('video');
        component.mediaPlayerElement.setMediaPlayer(obj);
        new MediaElement(obj, component.mediaPlayerElement.eventEmitter);
        spyOn(component.mediaPlayerElement.getMediaPlayer(), 'getCurrentTime').and.returnValue(1.5);
        component.pluginConfiguration.data.mode = 2;
        component.pluginConfiguration.data.withSubLocalisations = true;
        component.pluginConfiguration.data.karaokeTcDelta = 0.25;
        (component as any).lastSegmentTcIn = 0;
        (component as any).lastSegmentTcOut = 3;

        const container = document.createElement('div');
        container.innerHTML = `
            <div class="segment selected" data-tcin="0" data-tcout="3">
                <div class="subsegment">
                    <div class="text">
                        <span class="w activated selected" data-tcin="0" data-tcout="1">Bonjour</span>
                        <span class="w" data-tcin="1" data-tcout="2">tout</span>
                    </div>
                </div>
            </div>
        `;
        component.transcriptionElement = new ElementRef(container);

        component._handleOnTimeChangeForTesting();

        const words = container.querySelectorAll('.w');
        expect(words[0].classList.contains('selected')).toBeFalse();
        expect(words[1].classList.contains('selected')).toBeTrue();
        expect(words[1].classList.contains('activated')).toBeTrue();
    });

    it('should apply word styles once per time update', () => {
        const obj = document.createElement('video');
        component.mediaPlayerElement.setMediaPlayer(obj);
        new MediaElement(obj, component.mediaPlayerElement.eventEmitter);
        spyOn(component.mediaPlayerElement.getMediaPlayer(), 'getCurrentTime').and.returnValue(2.5);
        component.pluginConfiguration.data.mode = 2;
        component.pluginConfiguration.data.withSubLocalisations = true;
        component.pluginConfiguration.data.karaokeTcDelta = 0.25;
        (component as any).lastSegmentTcIn = 0;
        (component as any).lastSegmentTcOut = 4;

        const container = document.createElement('div');
        container.innerHTML = `
            <div class="segment selected" data-tcin="0" data-tcout="4">
                <div class="subsegment">
                    <div class="text">
                        <span class="w" data-tcin="0" data-tcout="1">Un</span>
                        <span class="w" data-tcin="1" data-tcout="2">deux</span>
                        <span class="w" data-tcin="2" data-tcout="3">trois</span>
                    </div>
                </div>
            </div>
        `;
        component.transcriptionElement = new ElementRef(container);
        const applyStyles = spyOn<any>(component, 'handleSelectedWordsStyle').and.callThrough();

        component._handleOnTimeChangeForTesting();

        expect(applyStyles).toHaveBeenCalledTimes(1);
        expect((applyStyles.calls.mostRecent().args[0] as HTMLElement[]).length).toBe(3);
        expect(container.querySelectorAll('.w')[2].classList.contains('selected')).toBeTrue();
    });

    it('should refresh selected segment before sync scroll', () => {
        const obj = document.createElement('video');
        component.mediaPlayerElement.setMediaPlayer(obj);
        new MediaElement(obj, component.mediaPlayerElement.eventEmitter);
        spyOn(component.mediaPlayerElement.getMediaPlayer(), 'getCurrentTime').and.returnValue(0);
        component.pluginConfiguration.data.mode = 2;
        component.pluginConfiguration.data.autoScroll = true;

        const container = document.createElement('div');
        container.innerHTML = `
            <div class="segment" data-tcin="0" data-tcout="2">
                <div class="subsegment">
                    <div class="text">
                        <span class="w" data-tcin="0" data-tcout="2">Bonjour</span>
                    </div>
                </div>
            </div>
        `;
        component.transcriptionElement = new ElementRef(container);
        component.displaySynchro = true;
        const handleOnTimeChangeSpy = spyOn<any>(component, 'handleOnTimeChange').and.callThrough();

        component.scrollToSelectedSegment();

        expect(handleOnTimeChangeSpy).toHaveBeenCalled();
        expect(container.querySelector('.segment.selected')).toBeTruthy();
        expect(component.displaySynchro).toBeFalse();
    });

    it('should call media seek in callSeek', () => {
        const media = {
            setCurrentTime: jasmine.createSpy('setCurrentTime')
        } as any;
        spyOn(component.mediaPlayerElement, 'getMediaPlayer').and.returnValue(media);

        component.callSeek(42);

        expect(media.setCurrentTime).toHaveBeenCalledWith(42);
    });

    it('should set typing and clear selected class on handleChangeInput', () => {
        const node = document.createElement('span');
        node.className = 'w selected-text';
        component.transcriptionElement.nativeElement.appendChild(node);
        component.searching = true;

        component.handleChangeInput('abc');

        expect(component.typing).toBeTrue();
        expect(component.searching).toBeFalse();
        expect(node.classList.contains('selected-text')).toBeFalse();
    });

    it('seekToWord should apply stock offset and tcDelta', () => {
        const media = {
            setCurrentTime: jasmine.createSpy('setCurrentTime'),
            getDuration: jasmine.createSpy('getDuration').and.returnValue(100),
            reverseMode: false
        } as any;
        spyOn(component.mediaPlayerElement, 'getMediaPlayer').and.returnValue(media);
        spyOn(component as any, 'scroll');
        component.pluginConfiguration.data.resourceType = 'stock' as any;
        component.pluginConfiguration.data.tcIn = 10 as any;
        component.pluginConfiguration.data.tcDelta = 2 as any;

        const target = document.createElement('span');
        target.setAttribute('data-tcin', '50');
        component.seekToWord({ target } as any);

        expect(media.setCurrentTime).toHaveBeenCalledWith(38);
        expect((component as any).scroll).toHaveBeenCalled();
    });

    it('seekToWord should apply reverse mode', () => {
        const media = {
            setCurrentTime: jasmine.createSpy('setCurrentTime'),
            getDuration: jasmine.createSpy('getDuration').and.returnValue(100),
            reverseMode: true
        } as any;
        spyOn(component.mediaPlayerElement, 'getMediaPlayer').and.returnValue(media);
        component.pluginConfiguration.data.resourceType = 'flux' as any;
        component.pluginConfiguration.data.tcDelta = 0 as any;

        const target = document.createElement('span');
        target.setAttribute('data-tcin', '30');
        component.seekToWord({ target } as any);

        expect(media.setCurrentTime).toHaveBeenCalledWith(70);
    });

    it('handleScroll should set ignoreNextScroll and call updateSynchro', () => {
        const spy = spyOn(component, 'updateSynchro');

        component.handleScroll(true);

        expect(component.ignoreNextScroll).toBeTrue();
        expect(spy).toHaveBeenCalled();
    });

    it('parseTranscription should read metadata and filter by tcIn/duration', () => {
        component.pluginConfiguration.metadataIds = ['m1'] as any;
        component.pluginConfiguration.data.parseLevel = 0 as any;
        component.pluginConfiguration.data.withSubLocalisations = false as any;
        component.pluginConfiguration.data.tcIn = 10 as any;
        component.pluginConfiguration.data.duration = 20 as any;
        const getTranscriptionLocalisations = spyOn(component.mediaPlayerElement.metadataManager as any, 'getTranscriptionLocalisations')
            .and.returnValue([
                { tcIn: 1, tcOut: 5, text: 'drop', annotations: [] },
                { tcIn: 12, tcOut: 15, text: 'keep', annotations: [] },
                { tcIn: 40, tcOut: 45, text: 'drop2', annotations: [] }
            ] as any);

        (component as any).parseTranscription();

        expect(getTranscriptionLocalisations).toHaveBeenCalled();
        expect(component.transcriptions.length).toBe(1);
        expect((component.transcriptions[0] as any).text).toBe('keep');
    });

    it('searchWord should find words, mark them and set scroll', () => {
        component.pluginConfiguration.data.label = 'placeholder' as any;
        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
            <div class="segment"><div class="subsegment"><div class="text">
              <span class="w">bonjour</span>
              <span class="w">salut</span>
            </div></div></div>`;
        component.transcriptionElement = new ElementRef(wrapper);

        component.searchWord('bon');

        expect(component.searching).toBeTrue();
        expect(component.listOfSearchedNodes.length).toBe(1);
        expect(component.listOfSearchedNodes[0].classList.contains('selected-text')).toBeTrue();
    });

    it('scrollToSearchedWord should wrap indexes up and down', () => {
        const a = document.createElement('span');
        const b = document.createElement('span');
        const parent = document.createElement('div');
        const p2 = document.createElement('div');
        parent.appendChild(p2);
        p2.appendChild(a);
        p2.appendChild(b);
        component.transcriptionElement = new ElementRef(parent);
        component.listOfSearchedNodes = [a as any, b as any];
        (component as any).searchedWordIndex = 1;

        component.scrollToSearchedWord('down');
        expect((component as any).searchedWordIndex).toBe(0);

        component.scrollToSearchedWord('up');
        expect((component as any).searchedWordIndex).toBe(1);
    });

    it('clearSearchList should reset state and css classes', () => {
        const n = document.createElement('span');
        n.className = 'w selected-text founded-text';
        component.transcriptionElement.nativeElement.appendChild(n);
        component.listOfSearchedNodes = [n as any];
        component.searching = true;

        component.clearSearchList();

        expect(component.searching).toBeFalse();
        expect(component.listOfSearchedNodes).toBeNull();
        expect(n.classList.contains('selected-text')).toBeFalse();
        expect(n.classList.contains('founded-text')).toBeFalse();
    });

    it('handleShortcut should search, iterate and clear on backspace', () => {
        component.searchText.nativeElement.value = 'foo';
        component.pluginConfiguration.data.key = 'Enter' as any;
        const clearSpy = spyOn(component, 'clearSearchList').and.callThrough();
        const searchSpy = spyOn(component, 'searchWord').and.callFake(() => {
            component.listOfSearchedNodes = [document.createElement('span') as any];
        });
        const scrollSpy = spyOn(component, 'scrollToSearchedWord');
        component.listOfSearchedNodes = [];
        (component as any).searchedWordIndex = 0;

        component.handleShortcut({ key: 'Enter' } as any);
        component.searching = false;
        component.handleShortcut({ key: 'Enter' } as any);
        component.handleShortcut({ key: 'Backspace' } as any);

        expect(searchSpy).toHaveBeenCalledWith('foo');
        expect(scrollSpy).toHaveBeenCalled();
        expect(clearSpy).toHaveBeenCalled();
        expect(component.typing).toBeFalse();
    });

    it('updateSynchro should set displaySynchro when selected word is not visible', () => {
        const container = document.createElement('div');
        container.style.height = '100px';
        const seg = document.createElement('div');
        seg.className = 'segment';
        const sub = document.createElement('div');
        sub.className = 'subsegment';
        const text = document.createElement('div');
        text.className = 'text';
        const w = document.createElement('span');
        w.className = 'w selected';
        text.appendChild(w);
        sub.appendChild(text);
        seg.appendChild(sub);
        container.appendChild(seg);
        component.transcriptionElement = new ElementRef(container);
        spyOn(container, 'getBoundingClientRect').and.returnValue({ top: 100 } as any);
        spyOn(w, 'getBoundingClientRect').and.returnValue({ top: 10 } as any);
        Object.defineProperty(w, 'clientHeight', { value: 10, configurable: true });
        Object.defineProperty(container, 'clientHeight', { value: 50, configurable: true });
        component.automaticallyScrolled = false;

        component.updateSynchro();

        expect(component.displaySynchro).toBeTrue();
    });

    it('should match composed named entity and apply css class', () => {
        const container = document.createElement('div');
        container.innerHTML = `
          <div class="segment" data-tcin="0" data-tcout="2">
            <div class="subsegment"><div class="text">
              <span class="w">Emmanuel</span>
              <span class="w">Macron</span>
            </div></div>
          </div>`;
        component.transcriptionElement = new ElementRef(container);
        component.transcriptions = [{
            tcIn: 0,
            tcOut: 2,
            text: 'Emmanuel Macron',
            annotations: [{ matchedText: 'Emmanuel Macron' }]
        } as any];

        (component as any).handleMatchedTextStyle();

        const marked = container.querySelectorAll('.named-entity');
        expect(marked.length).toBe(2);
    });

    it('should apply css class when matchedText is an array of strings', () => {
        const container = document.createElement('div');
        container.innerHTML = `
          <div class="segment" data-tcin="0" data-tcout="2">
            <div class="subsegment"><div class="text">
              <span class="w">Emmanuel</span>
              <span class="w">Macron</span>
              <span class="w">Paris</span>
            </div></div>
          </div>`;
        component.transcriptionElement = new ElementRef(container);
        component.transcriptions = [{
            tcIn: 0,
            tcOut: 2,
            text: 'Emmanuel Macron Paris',
            annotations: [{ matchedText: ['Emmanuel Macron', 'Paris'] }]
        } as any];

        (component as any).handleMatchedTextStyle();

        const marked = container.querySelectorAll('.named-entity');
        // 2 mots pour le texte composé + 1 mot simple
        expect(marked.length).toBe(3);
    });

    it('should match single-word entity when matchedText is an array with one entry', () => {
        const container = document.createElement('div');
        container.innerHTML = `
          <div class="segment" data-tcin="0" data-tcout="2">
            <div class="subsegment"><div class="text">
              <span class="w">Paris</span>
            </div></div>
          </div>`;
        component.transcriptionElement = new ElementRef(container);
        component.transcriptions = [{
            tcIn: 0,
            tcOut: 2,
            text: 'Paris',
            annotations: [{ matchedText: ['Paris'] }]
        } as any];

        (component as any).handleMatchedTextStyle();

        const marked = container.querySelectorAll('.named-entity');
        expect(marked.length).toBe(1);
    });

    it('scrollToSelectedSegment should reset auto flag after timeout', fakeAsync(() => {
        const obj = document.createElement('video');
        component.mediaPlayerElement.setMediaPlayer(obj);
        new MediaElement(obj, component.mediaPlayerElement.eventEmitter);
        spyOn(component.mediaPlayerElement.getMediaPlayer(), 'getCurrentTime').and.returnValue(0);
        component.pluginConfiguration.data.mode = 2;

        const container = document.createElement('div');
        container.innerHTML = `<div class="segment selected" data-tcin="0" data-tcout="2"></div>`;
        component.transcriptionElement = new ElementRef(container);

        component.scrollToSelectedSegment();
        expect(component.automaticallyScrolled).toBeTrue();

        tick(101);
        expect(component.automaticallyScrolled).toBeFalse();
    }));
});

