import { ComponentFixture, DeferBlockState, TestBed } from "@angular/core/testing";
import { fakeAsync, tick } from "@angular/core/testing";
import { TranscriptionPluginComponent } from "./transcription-plugin.component";
import { MediaPlayerService } from "../../service/media-player-service";
import { ApplicationRef, CUSTOM_ELEMENTS_SCHEMA, ElementRef } from "@angular/core";
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
import { MessageModule } from "primeng/message";
import { MessageService } from "primeng/api";
import { PlayerEventType } from "../../core/constant/event-type";

const initTestData = (
    component: TranscriptionPluginComponent,
    mediaPlayerElement: MediaPlayerElement,
    logger: DefaultLogger,
    httpClient: HttpClient,
) => {
    mediaPlayerElement = new MediaPlayerElement();
    logger = new DefaultLogger();
    component.logger = logger;
    const loader = new DefaultConfigLoader(new DefaultConfigConverter(), logger);
    mediaPlayerElement.configurationManager = new ConfigurationManager(loader, logger);
    mediaPlayerElement.configurationManager.configData = {
        tcOffset: null,
        player: {
            backwardsSrc: "",
            src: "",
            autoplay: false,
            crossOrigin: "anonymous",
        },
        thumbnail: {
            baseUrl: "",
            enableThumbnail: false,
            tcParam: "start",
        },
        dataSources: [
            {
                url: "/notilusDossier/segments/stock?itemBusinessIdentifier=95F05001SA0338_01&tcin=0&tcout=28800000&format=AMALIA&clientId=annotations",
                headers: ["Authorization: Bearer ..."],
                plugin: "annotations",
            },
            {
                url: "https://media.example.com/waveform/.../sl_hm/?canal=0&format=1024&mid=waveform-1024-0",
                headers: ["Authorization: Bearer ..."],
                plugin: "histogram",
            },
            {
                url: "https://media.example.com/waveform/.../sl_hm/?canal=1&format=1024&mid=waveform-1024-1",
                headers: ["Authorization: Bearer ..."],
                plugin: "histogram",
            },
            {
                url: "https://media.example.com/waveform/.../sl_hm/?canal=0&format=4096&mid=waveform-4096-0",
                headers: ["Authorization: Bearer ..."],
                plugin: "histogram",
            },
            {
                url: "https://media.example.com/waveform/.../sl_hm/?canal=1&format=4096&mid=waveform-4096-1",
                headers: ["Authorization: Bearer ..."],
                plugin: "histogram",
            },
        ],
        debug: false,
        logLevel: "info",
        displaySizes: {
            large: 900,
            medium: 700,
            small: 550,
            xsmall: 340,
        },
    };
    component.pluginConfiguration = {
        data: {
            key: "Enter",
            timeFormat: "s",
            fps: 0,
            autoScroll: true,
            parseLevel: 0,
            withSubLocalisations: false,
            label: "",
            labelSynchro: "",
        },
        name: "",
        metadataIds: ["waveform-1024-0", "waveform-1024-1", "waveform-4096-0", "waveform-4096-1"],
    };
    httpClient = TestBed.inject(HttpClient);
    const metadataLoader = new DefaultMetadataLoader(httpClient, new DefaultMetadataConverter(), logger);
    mediaPlayerElement.metadataManager = new MetadataManager(
        mediaPlayerElement.configurationManager,
        metadataLoader,
        logger,
    );
    component.mediaPlayerElement = mediaPlayerElement;
    return mediaPlayerElement;
};

describe("TranscriptionPluginComponent", () => {
    let component: TranscriptionPluginComponent;
    let fixture: ComponentFixture<TranscriptionPluginComponent>;
    let mediaPlayerService: MediaPlayerService;
    let httpClient: HttpClient;
    let logger: DefaultLogger;
    let mediaPlayerElement: MediaPlayerElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, MessageModule, TranscriptionPluginComponent],
            providers: [MediaPlayerService, MessageService],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        mediaPlayerService = TestBed.inject(MediaPlayerService);
        fixture = TestBed.createComponent(TranscriptionPluginComponent);
        component = fixture.componentInstance;
        component.transcriptionElement = new ElementRef(document.createElement("div"));
        component.headerElement = new ElementRef(document.createElement("div"));
        component.searchText = new ElementRef(document.createElement("input"));

        // Mock the messagesComponent to fix the error in ngAfterViewInit
        component.messagesComponent = {
            setMessages: jasmine.createSpy("setMessages"),
        } as any;

        mediaPlayerElement = initTestData(component, mediaPlayerElement, logger, httpClient);
        // Mock tcFormatPipe
        component.tcFormatPipe = {
            transform: jasmine.createSpy("transform").and.callFake((val: number) => `TC${val}`),
        };
        spyOn(navigator.clipboard, "writeText").and.returnValue(Promise.resolve());
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should initialize plugin correctly", () => {
        mediaPlayerElement.configurationManager.configData = {
            ...mediaPlayerElement.configurationManager.configData,
            loadMetadataOnDemand: true,
        };
        const getPlayer = spyOn(component.playerService, "get");
        getPlayer.and.returnValue(mediaPlayerElement);
        spyOn(component, "init").and.callThrough();
        fixture.detectChanges();
        expect(component.init).toHaveBeenCalled();
    });

    it("should handle metadata loaded", () => {
        spyOn(component, "metaDataLoaded").and.callThrough();
        component._handleMetadataLoadedForTesting();
        expect(component.metaDataLoaded).toHaveBeenCalled();
    });

    it("should handle time change", () => {
        const obj = document.createElement("video");
        component.mediaPlayerElement.setMediaPlayer(obj);
        new MediaElement(obj, component.mediaPlayerElement.eventEmitter);
        const getCurrentTime = spyOn(component.mediaPlayerElement.getMediaPlayer(), "getCurrentTime");
        getCurrentTime.and.returnValue(35);
        const _handleOnTimeChangeForTestingMock = spyOn(component as any, "handleOnTimeChange");
        _handleOnTimeChangeForTestingMock.and.callThrough();
        component._handleOnTimeChangeForTesting();
        expect(_handleOnTimeChangeForTestingMock).toHaveBeenCalled();
    });

    it("should search word correctly", () => {
        spyOn(component, "searchWord").and.callThrough();
        component.searchWord("test");
        expect(component.searchWord).toHaveBeenCalledWith("test");
    });

    it("should scroll to searched word", () => {
        spyOn(component, "scrollToSearchedWord").and.callThrough();
        component.scrollToSearchedWord("down");
        expect(component.scrollToSearchedWord).toHaveBeenCalledWith("down");
    });

    it("should clear search list", () => {
        spyOn(component, "clearSearchList").and.callThrough();
        component.clearSearchList();
        expect(component.clearSearchList).toHaveBeenCalled();
    });

    it("should handle shortcut", () => {
        const event = new KeyboardEvent("keydown", { key: "Enter" });
        spyOn(component, "handleShortcut").and.callThrough();
        component.handleShortcut(event);
        expect(component.handleShortcut).toHaveBeenCalledWith(event);
    });

    it("should copy single localisation and emit event", async () => {
        // Mock transcriptions
        component.transcriptions.set([
            { tcIn: 10, tcOut: 20, text: "Text 1", label: "Text 1", thumb: "Text 1" },
            { tcIn: 30, tcOut: 40, text: "Text 2", label: "Text 2", thumb: "Text 2" },
        ]);
        const localisation = { tcIn: 10, tcOut: 20, text: "Hello", label: "Hello", thumb: "Hello" };
        spyOn(component.mediaPlayerElement.eventEmitter, "emit");

        await component.copy(localisation);

        expect(component.tcFormatPipe.transform).toHaveBeenCalledWith(10, component.tcDisplayFormat);
        expect(component.tcFormatPipe.transform).toHaveBeenCalledWith(20, component.tcDisplayFormat);

        const expectedText = `[TC10][TC20]\n\nHello`;
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expectedText);
        expect(component.mediaPlayerElement.eventEmitter.emit).toHaveBeenCalledWith(
            PlayerEventType.PLAYER_COPY_BOARD,
            localisation,
        );
    });

    it("should copy all transcriptions and emit event", async () => {
        // Mock transcriptions
        component.transcriptions.set([
            { tcIn: 10, tcOut: 20, text: "Text 1", label: "Text 1", thumb: "Text 1" },
            { tcIn: 30, tcOut: 40, text: "Text 2", label: "Text 2", thumb: "Text 2" },
        ]);
        spyOn(component.mediaPlayerElement.eventEmitter, "emit");
        await component.copyAll();

        const expectedText = `[TC10][TC20]\nText 1\n\n[TC30][TC40]\nText 2`;
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expectedText);
        expect(component.mediaPlayerElement.eventEmitter.emit).toHaveBeenCalledWith(
            PlayerEventType.PLAYER_COPY_BOARD,
            expectedText,
        );
    });

    it("should select segment at tc 0 on time change", () => {
        const obj = document.createElement("video");
        component.mediaPlayerElement.setMediaPlayer(obj);
        new MediaElement(obj, component.mediaPlayerElement.eventEmitter);
        spyOn(component.mediaPlayerElement.getMediaPlayer(), "getCurrentTime").and.returnValue(0);
        component.pluginConfiguration.data.mode = 2;
        component.pluginConfiguration.data.autoScroll = true;

        const container = document.createElement("div");
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

        expect(container.querySelector(".segment.selected")).toBeTruthy();
    });

    it("should update the selected word while staying in the same segment", () => {
        const obj = document.createElement("video");
        component.mediaPlayerElement.setMediaPlayer(obj);
        new MediaElement(obj, component.mediaPlayerElement.eventEmitter);
        spyOn(component.mediaPlayerElement.getMediaPlayer(), "getCurrentTime").and.returnValue(1.5);
        component.pluginConfiguration.data.mode = 2;
        component.pluginConfiguration.data.withSubLocalisations = true;
        component.pluginConfiguration.data.karaokeTcDelta = 0.25;
        (component as any).lastSegmentTcIn = 0;
        (component as any).lastSegmentTcOut = 3;

        const container = document.createElement("div");
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

        const words = container.querySelectorAll(".w");
        expect(words[0].classList.contains("selected")).toBeFalse();
        expect(words[1].classList.contains("selected")).toBeTrue();
        expect(words[1].classList.contains("activated")).toBeTrue();
    });

    it("should apply word styles once per time update", () => {
        const obj = document.createElement("video");
        component.mediaPlayerElement.setMediaPlayer(obj);
        new MediaElement(obj, component.mediaPlayerElement.eventEmitter);
        spyOn(component.mediaPlayerElement.getMediaPlayer(), "getCurrentTime").and.returnValue(2.5);
        component.pluginConfiguration.data.mode = 2;
        component.pluginConfiguration.data.withSubLocalisations = true;
        component.pluginConfiguration.data.karaokeTcDelta = 0.25;
        (component as any).lastSegmentTcIn = 0;
        (component as any).lastSegmentTcOut = 4;

        const container = document.createElement("div");
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
        const applyStyles = spyOn<any>(component, "handleSelectedWordsStyle").and.callThrough();

        component._handleOnTimeChangeForTesting();

        expect(applyStyles).toHaveBeenCalledTimes(1);
        expect((applyStyles.calls.mostRecent().args[0] as HTMLElement[]).length).toBe(3);
        expect(container.querySelectorAll(".w")[2].classList.contains("selected")).toBeTrue();
    });

    it("should refresh selected segment before sync scroll", () => {
        const obj = document.createElement("video");
        component.mediaPlayerElement.setMediaPlayer(obj);
        new MediaElement(obj, component.mediaPlayerElement.eventEmitter);
        spyOn(component.mediaPlayerElement.getMediaPlayer(), "getCurrentTime").and.returnValue(0);
        component.pluginConfiguration.data.mode = 2;
        component.pluginConfiguration.data.autoScroll = true;

        const container = document.createElement("div");
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
        component.displaySynchro.set(true);
        const handleOnTimeChangeSpy = spyOn<any>(component, "handleOnTimeChange").and.callThrough();

        component.scrollToSelectedSegment();

        expect(handleOnTimeChangeSpy).toHaveBeenCalled();
        expect(container.querySelector(".segment.selected")).toBeTruthy();
        expect(component.displaySynchro()).toBeFalse();
    });

    it("should call media seek in callSeek", () => {
        const media = {
            setCurrentTime: jasmine.createSpy("setCurrentTime"),
        } as any;
        spyOn(component.mediaPlayerElement, "getMediaPlayer").and.returnValue(media);

        component.callSeek(42);

        expect(media.setCurrentTime).toHaveBeenCalledWith(42);
    });

    it("should set typing and clear selected class on handleChangeInput", () => {
        const node = document.createElement("span");
        node.className = "w selected-text";
        component.transcriptionElement.nativeElement.appendChild(node);
        component.searching.set(true);

        component.handleChangeInput("abc");

        expect(component.typing()).toBeTrue();
        expect(component.searching()).toBeFalse();
        expect(node.classList.contains("selected-text")).toBeFalse();
    });

    it("seekToWord should apply stock offset and tcDelta", () => {
        const media = {
            setCurrentTime: jasmine.createSpy("setCurrentTime"),
            getDuration: jasmine.createSpy("getDuration").and.returnValue(100),
            reverseMode: false,
        } as any;
        spyOn(component.mediaPlayerElement, "getMediaPlayer").and.returnValue(media);
        spyOn(component as any, "scroll");
        component.pluginConfiguration.data.resourceType = "stock" as any;
        component.pluginConfiguration.data.tcIn = 10 as any;
        component.pluginConfiguration.data.tcDelta = 2 as any;

        const target = document.createElement("span");
        target.setAttribute("data-tcin", "50");
        component.seekToWord({ target } as any);

        expect(media.setCurrentTime).toHaveBeenCalledWith(38);
        expect((component as any).scroll).toHaveBeenCalled();
    });

    it("seekToWord should apply reverse mode", () => {
        const media = {
            setCurrentTime: jasmine.createSpy("setCurrentTime"),
            getDuration: jasmine.createSpy("getDuration").and.returnValue(100),
            reverseMode: true,
        } as any;
        spyOn(component.mediaPlayerElement, "getMediaPlayer").and.returnValue(media);
        component.pluginConfiguration.data.resourceType = "flux" as any;
        component.pluginConfiguration.data.tcDelta = 0 as any;

        const target = document.createElement("span");
        target.setAttribute("data-tcin", "30");
        component.seekToWord({ target } as any);

        expect(media.setCurrentTime).toHaveBeenCalledWith(70);
    });

    it("handleScroll should set ignoreNextScroll and call updateSynchro", () => {
        const spy = spyOn(component, "updateSynchro");

        component.handleScroll(true);

        expect(component.ignoreNextScroll).toBeTrue();
        expect(spy).toHaveBeenCalled();
    });

    it("parseTranscription should read metadata and filter by tcIn/duration", () => {
        component.pluginConfiguration.metadataIds = ["m1"] as any;
        component.pluginConfiguration.data.parseLevel = 0 as any;
        component.pluginConfiguration.data.withSubLocalisations = false as any;
        component.pluginConfiguration.data.tcIn = 10 as any;
        component.pluginConfiguration.data.duration = 20 as any;
        const getTranscriptionLocalisations = spyOn(
            component.mediaPlayerElement.metadataManager as any,
            "getTranscriptionLocalisations",
        ).and.returnValue([
            { tcIn: 1, tcOut: 5, text: "drop", annotations: [] },
            { tcIn: 12, tcOut: 15, text: "keep", annotations: [] },
            { tcIn: 40, tcOut: 45, text: "drop2", annotations: [] },
        ] as any);

        (component as any).parseTranscription();

        expect(getTranscriptionLocalisations).toHaveBeenCalled();
        expect(component.transcriptions().length).toBe(1);
        expect((component.transcriptions()[0] as any).text).toBe("keep");
    });

    it("searchWord should find words, mark them and set scroll", () => {
        component.pluginConfiguration.data.label = "placeholder" as any;
        const wrapper = document.createElement("div");
        wrapper.innerHTML = `
            <div class="segment"><div class="subsegment"><div class="text">
              <span class="w">bonjour</span>
              <span class="w">salut</span>
            </div></div></div>`;
        component.transcriptionElement = new ElementRef(wrapper);

        component.searchWord("bon");

        expect(component.searching()).toBeTrue();
        expect(component.listOfSearchedNodes().length).toBe(1);
        expect(component.listOfSearchedNodes()[0].classList.contains("selected-text")).toBeTrue();
    });

    it("scrollToSearchedWord should wrap indexes up and down", () => {
        const a = document.createElement("span");
        const b = document.createElement("span");
        const parent = document.createElement("div");
        const p2 = document.createElement("div");
        parent.appendChild(p2);
        p2.appendChild(a);
        p2.appendChild(b);
        component.transcriptionElement = new ElementRef(parent);
        component.listOfSearchedNodes.set([a as any, b as any]);
        (component as any).searchedWordIndex = 1;

        component.scrollToSearchedWord("down");
        expect((component as any).searchedWordIndex).toBe(0);

        component.scrollToSearchedWord("up");
        expect((component as any).searchedWordIndex).toBe(1);
    });

    it("clearSearchList should reset state and css classes", () => {
        const n = document.createElement("span");
        n.className = "w selected-text founded-text";
        component.transcriptionElement.nativeElement.appendChild(n);
        component.listOfSearchedNodes.set([n as any]);
        component.searching.set(true);

        component.clearSearchList();

        expect(component.searching()).toBeFalse();
        expect(component.listOfSearchedNodes()).toBeNull();
        expect(n.classList.contains("selected-text")).toBeFalse();
        expect(n.classList.contains("founded-text")).toBeFalse();
    });

    it("handleShortcut should search, iterate and clear on backspace", () => {
        component.searchText.nativeElement.value = "foo";
        component.pluginConfiguration.data.key = "Enter" as any;
        const clearSpy = spyOn(component, "clearSearchList").and.callThrough();
        const searchSpy = spyOn(component, "searchWord").and.callFake(() => {
            component.listOfSearchedNodes.set([document.createElement("span") as any]);
        });
        const scrollSpy = spyOn(component, "scrollToSearchedWord");
        component.listOfSearchedNodes.set([]);
        (component as any).searchedWordIndex = 0;

        component.handleShortcut({ key: "Enter" } as any);
        component.searching.set(false);
        component.handleShortcut({ key: "Enter" } as any);
        component.handleShortcut({ key: "Backspace" } as any);

        expect(searchSpy).toHaveBeenCalledWith("foo");
        expect(scrollSpy).toHaveBeenCalled();
        expect(clearSpy).toHaveBeenCalled();
        expect(component.typing()).toBeFalse();
    });

    it("updateSynchro should set displaySynchro when selected word is not visible", () => {
        const container = document.createElement("div");
        container.style.height = "100px";
        const seg = document.createElement("div");
        seg.className = "segment";
        const sub = document.createElement("div");
        sub.className = "subsegment";
        const text = document.createElement("div");
        text.className = "text";
        const w = document.createElement("span");
        w.className = "w selected";
        text.appendChild(w);
        sub.appendChild(text);
        seg.appendChild(sub);
        container.appendChild(seg);
        component.transcriptionElement = new ElementRef(container);
        spyOn(container, "getBoundingClientRect").and.returnValue({ top: 100 } as any);
        spyOn(w, "getBoundingClientRect").and.returnValue({ top: 10 } as any);
        Object.defineProperty(w, "clientHeight", { value: 10, configurable: true });
        Object.defineProperty(container, "clientHeight", { value: 50, configurable: true });
        component.automaticallyScrolled = false;

        component.updateSynchro();

        expect(component.displaySynchro()).toBeTrue();
    });

    // Les entités nommées sont marquées sur les données (isNamedEntity) et rendues par le binding
    // [class.named-entity] : plus aucun querySelectorAll, donc plus d'hydratation forcée des
    // blocs @defer. Les specs assertent donc les drapeaux, au niveau du nouveau contrat.
    const segmentAvecMots = (mots: string[], matchedText: string | string[]) => ({
        tcIn: 0,
        tcOut: 2,
        text: mots.join(" "),
        subLocalisations: mots.map((text, i) => ({ text, tcIn: i, tcOut: i + 1 })),
        annotations: [{ matchedText }],
    });
    const drapeaux = (segment: any) => segment.subLocalisations.map((w: any) => w.isNamedEntity === true);

    it("should mark composed named entity on the words", () => {
        const segment = segmentAvecMots(["Emmanuel", "Macron"], "Emmanuel Macron");

        (component as any).markNamedEntities([segment]);

        expect(drapeaux(segment)).toEqual([true, true]);
    });

    it("should mark words when matchedText is an array of strings", () => {
        const segment = segmentAvecMots(["Emmanuel", "Macron", "Paris"], ["Emmanuel Macron", "Paris"]);

        (component as any).markNamedEntities([segment]);

        // 2 mots pour le texte composé + 1 mot simple
        expect(drapeaux(segment)).toEqual([true, true, true]);
    });

    it("should mark single-word entity when matchedText is an array with one entry", () => {
        const segment = segmentAvecMots(["Paris"], ["Paris"]);

        (component as any).markNamedEntities([segment]);

        expect(drapeaux(segment)).toEqual([true]);
    });

    it("should not mark a composed entity when the following words do not match", () => {
        const segment = segmentAvecMots(["Emmanuel", "Dupont"], "Emmanuel Macron");

        (component as any).markNamedEntities([segment]);

        expect(drapeaux(segment)).toEqual([false, false]);
    });

    it("should mark only the matching words of a segment", () => {
        const segment = segmentAvecMots(["le", "president", "Macron", "parle"], "Macron");

        (component as any).markNamedEntities([segment]);

        expect(drapeaux(segment)).toEqual([false, false, true, false]);
    });

    it("should fall back on the segment itself when there is no sub-localisation", () => {
        const segment: any = { tcIn: 0, tcOut: 2, text: "Paris", annotations: [{ matchedText: "Paris" }] };

        (component as any).markNamedEntities([segment]);

        expect(segment.isNamedEntity).toBeTrue();
    });

    it("should leave words unmarked when the segment carries no annotation", () => {
        const segment: any = {
            tcIn: 0,
            tcOut: 2,
            text: "Emmanuel Macron",
            subLocalisations: [
                { text: "Emmanuel", tcIn: 0, tcOut: 1 },
                { text: "Macron", tcIn: 1, tcOut: 2 },
            ],
        };

        (component as any).markNamedEntities([segment]);

        expect(drapeaux(segment)).toEqual([false, false]);
    });

    it("should not force the @defer hydration when named entities are present", () => {
        component.deferredRendering = true;
        component.forceRenderAll.set(false);

        (component as any).markNamedEntities([segmentAvecMots(["Emmanuel", "Macron"], "Emmanuel Macron")]);

        expect(component.forceRenderAll()).toBeFalse();
    });

    it("scrollToSelectedSegment should reset auto flag after timeout", fakeAsync(() => {
        const obj = document.createElement("video");
        component.mediaPlayerElement.setMediaPlayer(obj);
        new MediaElement(obj, component.mediaPlayerElement.eventEmitter);
        spyOn(component.mediaPlayerElement.getMediaPlayer(), "getCurrentTime").and.returnValue(0);
        component.pluginConfiguration.data.mode = 2;

        const container = document.createElement("div");
        container.innerHTML = `<div class="segment selected" data-tcin="0" data-tcout="2"></div>`;
        component.transcriptionElement = new ElementRef(container);

        component.scrollToSelectedSegment();
        expect(component.automaticallyScrolled).toBeTrue();

        tick(101);
        expect(component.automaticallyScrolled).toBeFalse();
    }));

    describe("rendu par-mot différé (@defer, phase 8)", () => {
        /** Deux segments avec sous-localisations (7 mots au total) + annotations vides. */
        const segments = () =>
            [
                {
                    tcIn: 0,
                    tcOut: 2,
                    text: "Bonjour tout le monde",
                    label: "seg1",
                    thumb: "",
                    annotations: [],
                    subLocalisations: [
                        { tcIn: 0, tcOut: 0.5, text: "Bonjour", label: "", thumb: "" },
                        { tcIn: 0.5, tcOut: 1, text: "tout", label: "", thumb: "" },
                        { tcIn: 1, tcOut: 1.5, text: "le", label: "", thumb: "" },
                        { tcIn: 1.5, tcOut: 2, text: "monde", label: "", thumb: "" },
                    ],
                },
                {
                    tcIn: 2,
                    tcOut: 4,
                    text: "Deuxième segment ici",
                    label: "seg2",
                    thumb: "",
                    annotations: [],
                    subLocalisations: [
                        { tcIn: 2, tcOut: 2.5, text: "Deuxième", label: "", thumb: "" },
                        { tcIn: 2.5, tcOut: 3, text: "segment", label: "", thumb: "" },
                        { tcIn: 3, tcOut: 4, text: "ici", label: "", thumb: "" },
                    ],
                },
            ] as any;

        beforeEach(() => {
            spyOn(component.playerService, "get").and.returnValue(component.mediaPlayerElement);
            component.tcOffset = 0;
        });

        it("rend le texte brut du segment en placeholder puis les mots après hydratation", async () => {
            component.transcriptions.set(segments());
            fixture.detectChanges();
            const deferBlocks = await fixture.getDeferBlocks();
            expect(deferBlocks.length).toBe(2);
            await deferBlocks[0].render(DeferBlockState.Placeholder);
            const shadow = fixture.nativeElement.shadowRoot;
            const firstSegment = shadow.querySelectorAll(".segment")[0];
            expect(firstSegment.querySelectorAll(".w-placeholder").length).toBe(1);
            expect(firstSegment.querySelector(".w-placeholder").textContent).toContain("Bonjour tout le monde");
            expect(firstSegment.querySelectorAll(".w").length).toBe(0);
            await deferBlocks[0].render(DeferBlockState.Complete);
            expect(firstSegment.querySelectorAll(".w").length).toBe(4);
            expect(firstSegment.querySelectorAll(".w-placeholder").length).toBe(0);
        });

        it("deferredRendering=false : rendu direct des mots, sans bloc @defer", async () => {
            component.deferredRendering = false;
            component.transcriptions.set(segments());
            fixture.detectChanges();
            const deferBlocks = await fixture.getDeferBlocks();
            expect(deferBlocks.length).toBe(0);
            const shadow = fixture.nativeElement.shadowRoot;
            expect(shadow.querySelectorAll(".w").length).toBe(7);
            expect(shadow.querySelectorAll(".w-placeholder").length).toBe(0);
        });

        it("recherche : force l'hydratation des blocs puis relance la recherche sur le DOM complet", async () => {
            component.transcriptions.set(segments());
            fixture.detectChanges();
            const deferBlocks = await fixture.getDeferBlocks();
            for (const block of deferBlocks) {
                await block.render(DeferBlockState.Placeholder);
            }

            component.searchWord("Bonjour");

            // La recherche est différée : hydratation d'abord (forceRenderAll), sélection ensuite.
            expect(component.forceRenderAll()).toBeTrue();
            expect(component.searching()).toBeFalse();

            for (const block of deferBlocks) {
                await block.render(DeferBlockState.Complete);
            }
            // Flush du afterNextRender one-shot qui ré-exécute la recherche sur le DOM hydraté.
            TestBed.inject(ApplicationRef).tick();

            expect(component.searching()).toBeTrue();
            expect(fixture.nativeElement.shadowRoot.querySelectorAll(".founded-text").length).toBe(1);
        });

        it("écrit activeSegmentTcIn (condition when d'hydratation) quand un segment devient actif", () => {
            const obj = document.createElement("video");
            component.mediaPlayerElement.setMediaPlayer(obj);
            new MediaElement(obj, component.mediaPlayerElement.eventEmitter);
            spyOn(component.mediaPlayerElement.getMediaPlayer(), "getCurrentTime").and.returnValue(0);
            component.pluginConfiguration.data.mode = 2;

            const container = document.createElement("div");
            container.innerHTML = `
                <div class="segment" data-tcin="0" data-tcout="2">
                    <div class="subsegment"><div class="text">
                        <span class="w" data-tcin="0" data-tcout="2">Bonjour</span>
                    </div></div>
                </div>`;
            component.transcriptionElement = new ElementRef(container);

            component._handleOnTimeChangeForTesting();

            expect(component.activeSegmentTcIn()).toBe(0);
        });

        it("programme une re-sélection karaoké après hydratation quand le segment actif n'a pas encore ses mots", () => {
            const obj = document.createElement("video");
            component.mediaPlayerElement.setMediaPlayer(obj);
            new MediaElement(obj, component.mediaPlayerElement.eventEmitter);
            spyOn(component.mediaPlayerElement.getMediaPlayer(), "getCurrentTime").and.returnValue(0);
            component.pluginConfiguration.data.mode = 2;
            component.pluginConfiguration.data.withSubLocalisations = true;

            // Segment actif non hydraté : placeholder présent, aucun mot .w rendu.
            const container = document.createElement("div");
            container.innerHTML = `
                <div class="segment" data-tcin="0" data-tcout="2">
                    <div class="subsegment"><div class="text">
                        <span class="w-placeholder" data-tcin="0" data-tcout="2">Bonjour tout le monde</span>
                    </div></div>
                </div>`;
            component.transcriptionElement = new ElementRef(container);
            const scheduleSpy = spyOn<any>(component, "runAfterNextRender");

            component._handleOnTimeChangeForTesting();
            expect(scheduleSpy).toHaveBeenCalledTimes(1);

            // Garde anti-boucle : un second passage sur le même segment ne reprogramme rien.
            scheduleSpy.calls.reset();
            component._handleOnTimeChangeForTesting();
            expect(scheduleSpy).not.toHaveBeenCalled();
        });
    });
});
