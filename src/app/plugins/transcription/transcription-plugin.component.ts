import { PluginBase } from "../../core/plugin/plugin-base";
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    PipeTransform,
    signal,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";
import { PlayerEventType } from "../../core/constant/event-type";
import { PluginConfigData } from "../../core/config/model/plugin-config-data";
import { TranscriptionConfig } from "../../core/config/model/transcription-config";
import { Utils } from "../../core/utils/utils";
import { TranscriptionLocalisation } from "../../core/metadata/model/transcription-localisation";
import { DEFAULT } from "../../core/constant/default";
import { TextUtils } from "../../core/utils/text-utils";
import { MediaPlayerService } from "../../service/media-player-service";
import sortBy from "lodash/sortBy";
import { FormatUtils } from "../../core/utils/format-utils";
import { DefaultLogger } from "../../core/logger/default-logger";
import { ToastComponent } from "src/app/core/toast/toast.component";
import { NgClass } from "@angular/common";
import { Tooltip } from "primeng/tooltip";
import { TcFormatPipe as TcFormatPipe_1 } from "../../core/utils/tc-format.pipe";
import { SanitizeHtmlPipe } from "../../core/utils/sanitize-html.pipe";
import {
    OutsideZoneMousemoveDirective,
    OutsideZoneScrollDirective,
} from "../../core/directive/outside-zone-event.directive";

export class TcFormatPipe implements PipeTransform {
    transform(
        tc: number,
        format: "h" | "m" | "s" | "minutes" | "f" | "ms" | "mms" | "hours" | "seconds" = null,
        defaultFps: number = 25,
    ) {
        return FormatUtils.formatTime(tc, format, defaultFps);
    }
}

@Component({
    selector: "amalia-transcription",
    templateUrl: "./transcription-plugin.component.html",
    styleUrls: ["./transcription-plugin.component.scss"],
    encapsulation: ViewEncapsulation.ShadowDom,
    imports: [
        NgClass,
        Tooltip,
        ToastComponent,
        TcFormatPipe_1,
        SanitizeHtmlPipe,
        OutsideZoneMousemoveDirective,
        OutsideZoneScrollDirective,
    ],
    // OnPush (phase 7 vague 2) : le karaoké (handleOnTimeChange) reste du DOM direct
    // (querySelectorAll + classList) hors template ; tout l'état lu par le template et muté
    // hors handlers de template est signalisé (transcriptions, displaySynchro, searching,
    // typing, index, listOfSearchedNodes). Les listeners player TIME_CHANGE/SEEKED/SEEKING/
    // METADATA_LOADED sont en policy 'none' (DOM + écritures de signals uniquement). Les
    // champs restés plats (tcDisplayFormat, fps, tcOffset, resourceType, labels de config)
    // sont renseignés dans ngOnInit/init(), couverts par le listener INIT 'zone' de PluginBase.
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TranscriptionPluginComponent extends PluginBase<TranscriptionConfig> implements AfterViewInit {
    public static PLUGIN_NAME = "TRANSCRIPTION";
    public static KARAOKE_TC_DELTA = 0.25;
    public static AUTO_SYNC_DELAY = 8000;
    public static SELECTOR_SEGMENT = "segment";
    public static SELECTOR_SUBSEGMENT = "subsegment";
    public static SELECTOR_WORD = "w";
    public static SEARCH_SELECTOR = "selected-text";
    public static SEARCH_FOUNDED = "founded-text";
    public static SELECTOR_SELECTED = "selected";
    public static SELECTOR_ACTIVATED = "activated";
    public static SELECTOR_PROGRESS_BAR = ".progress-bar";
    public static BACKSPACE_KEY = "Backspace";
    public static SELECTOR_NAMED_ENTITY = "named-entity";
    public tcDisplayFormat: "h" | "m" | "s" | "minutes" | "f" | "ms" | "mms" | "hours" | "seconds" = "s";
    public override fps = DEFAULT.FPS;
    public autoScroll = false;
    public active = false;
    public ignoreNextScroll = false;
    @ViewChild("transcriptionElement", { static: false })
    public transcriptionElement: ElementRef<HTMLElement>;
    @ViewChild("header", { static: false })
    public headerElement: ElementRef<HTMLElement>;
    @ViewChild("searchText")
    public searchText: ElementRef;
    /** Recherche active (icône loupe/compteur) — signal : lu par le template. */
    public readonly searching = signal(false);
    /** Saisie en cours (icône clear) — signal : lu par le template. */
    public readonly typing = signal(false);
    /** Position 1-based du mot recherché courant — signal : lu par le template. */
    public readonly index = signal(0);
    /**
     * Return  current time
     */
    public currentTime: number;
    /**
     * Transcriptions parsées (null tant qu'aucune métadonnée n'est chargée) — signal :
     * écrites par parseTranscription sous le listener METADATA_LOADED (policy 'none').
     */
    public readonly transcriptions = signal<Array<TranscriptionLocalisation>>(null);
    /** Résultats de recherche (le template lit .length) — signal. */
    public readonly listOfSearchedNodes = signal<Array<HTMLElement>>(undefined);
    private searchedWordIndex = 0;
    /**
     * Bouton synchro — signal : basculé par les listeners SEEKED/TIME_CHANGE (policy 'none')
     * et le timer d'auto-synchronisation.
     */
    public readonly displaySynchro = signal(false);
    private lastSelectedNode = null;
    private lastSegmentTcIn: number | null = null;
    private lastSegmentTcOut: number | null = null;
    private _inGap: boolean = false;
    private prevSearchValue = "";
    public tcFormatPipe = new TcFormatPipe();
    override logger: DefaultLogger;

    @ViewChild("messages") messagesComponent!: ToastComponent;

    public resourceType: "stock" | "flux";
    automaticallyScrolled: boolean = false;
    private autoSyncTimer: ReturnType<typeof setTimeout> | null = null;
    private isAutoScrolling = false;

    /**
     * Rendu par-mot différé (@defer par segment) — feature-flag `data.deferredRendering`
     * (défaut true), renseigné dans init() avant le premier rendu (comme les autres champs
     * plats de config, couvert par le listener INIT 'zone' de PluginBase).
     */
    public deferredRendering = true;
    /**
     * Force l'hydratation de tous les blocs @defer (condition `when` du template) — signal :
     * passé à true par la seule recherche (searchWord), qui a besoin de tous les mots dans le
     * DOM. Le surlignage des entités nommées, lui, est marqué sur les données
     * ({@link markNamedEntities}) et n'hydrate donc plus rien.
     */
    public readonly forceRenderAll = signal(false);
    /**
     * tcIn du segment actif (karaoké) — signal : condition `when` du @defer du segment
     * correspondant, pour que le segment actif s'hydrate même hors viewport (seek lointain
     * en pause) via le cycle de rendu Angular (déterministe, contrairement au trigger
     * `on viewport` qui dépend de l'IntersectionObserver).
     */
    public readonly activeSegmentTcIn = signal<number | null>(null);
    /** Vrai une fois l'hydratation globale (forceRenderAll) rendue : les mots sont dans le DOM. */
    private wordsRendered = false;
    /** Garde anti-boucle : tcIn du dernier segment pour lequel un refresh karaoké a été programmé. */
    private karaokeRefreshTcIn: number | null = null;

    /**
     * Handlers des événements haute fréquence migrés hors zone + throttle rAF (phase 8,
     * directives OutsideZone*Directive) : exécutés hors zone Angular, au plus 1×/frame.
     * handleScroll/updateSynchro n'écrivent que le signal displaySynchro et des flags non
     * bindés ; resetAutoSyncTimer ne manipule que des timers.
     */
    public readonly onScrollOutside = (): void => this.handleScroll(true);
    public readonly onMousemoveOutside = (): void => this.resetAutoSyncTimer();

    constructor(playerService: MediaPlayerService) {
        super(playerService);
        this.pluginName = TranscriptionPluginComponent.PLUGIN_NAME;
    }

    override ngOnInit() {
        try {
            super.ngOnInit();
            this.resourceType = this.pluginConfiguration?.data?.resourceType;
        } catch (e) {
            this.logger.debug("An error occured when initializing the pluging " + this.pluginName, e);
        }
        if (
            this.mediaPlayerElement &&
            this.mediaPlayerElement.getConfiguration() &&
            this.mediaPlayerElement.getConfiguration().loadMetadataOnDemand
        ) {
            this.init();
            this.handleMetadataLoaded();
        }
    }

    override init() {
        super.init();
        if (this.pluginConfiguration.data) {
            // Feature-flag du rendu par-mot différé (@defer par segment), défaut true.
            this.deferredRendering = this.pluginConfiguration.data.deferredRendering !== false;
            this.tcDisplayFormat = this.pluginConfiguration.data.timeFormat || this.getDefaultConfig().data.timeFormat;
            if (this.pluginConfiguration.data.fps) {
                this.fps = this.pluginConfiguration.data.fps;
            }
            if (this.pluginConfiguration.data.autoScroll) {
                this.autoScroll = true;
                // Karaoké 100 % DOM direct (querySelectorAll + classList) + écritures de
                // signals (displaySynchro) → policy 'none' : ni zone.run ni markForCheck.
                this.addListener(
                    this.mediaPlayerElement.eventEmitter,
                    PlayerEventType.TIME_CHANGE,
                    this.handleOnTimeChange,
                    { policy: "none" },
                );
            }
        }
        if (this.mediaPlayerElement.isMetadataLoaded) {
            this.parseTranscription();
        }
        // handleMetadataLoaded n'écrit que le signal transcriptions (parseTranscription) puis
        // du DOM différé ; SEEKED/SEEKING ne font que du DOM + le signal displaySynchro → 'none'.
        this.addListener(
            this.mediaPlayerElement.eventEmitter,
            PlayerEventType.METADATA_LOADED,
            this.handleMetadataLoaded,
            { policy: "none" },
        );
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.SEEKED, this.handleSeekedEvent, {
            policy: "none",
        });
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.SEEKING, this.handleSeekingEvent, {
            policy: "none",
        });
    }

    /**
     * handle call
     * @param tc time code
     */
    public callSeek(tc) {
        this.mediaPlayerElement.getMediaPlayer().setCurrentTime(tc);
    }

    public copy(localisation: any) {
        const tcOffset = this.mediaPlayerElement.getConfiguration()?.tcOffset;
        const tcIn = this.tcFormatPipe.transform(localisation.tcIn + tcOffset, this.tcDisplayFormat);
        const tcOut = this.tcFormatPipe.transform(localisation.tcOut + tcOffset, this.tcDisplayFormat);
        const copiedText = "[" + tcIn + "][" + tcOut + "]\n\n" + TextUtils.formatCopiedText(localisation.text);
        window.navigator.clipboard.writeText(copiedText).then(() => {
            this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.PLAYER_COPY_BOARD, localisation);
        });
    }
    copyAll() {
        const tcOffset = this.mediaPlayerElement.getConfiguration()?.tcOffset;
        const copiedText = this.transcriptions()
            .map((localisation) => {
                const tcIn = this.tcFormatPipe.transform(localisation.tcIn + tcOffset, this.tcDisplayFormat);
                const tcOut = this.tcFormatPipe.transform(localisation.tcOut + tcOffset, this.tcDisplayFormat);
                return "[" + tcIn + "][" + tcOut + "]\n" + TextUtils.formatCopiedText(localisation.text);
            })
            .join("\n\n");
        window.navigator.clipboard.writeText(copiedText).then(() => {
            this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.PLAYER_COPY_BOARD, copiedText);
        });
    }

    /**
     * Return default config
     */
    public getDefaultConfig(): PluginConfigData<TranscriptionConfig> {
        return {
            name: TranscriptionPluginComponent.PLUGIN_NAME,
            data: {
                timeFormat: "s",
                fps: DEFAULT.FPS,
                autoScroll: true,
                parseLevel: 1,
                withSubLocalisations: false,
                karaokeTcDelta: TranscriptionPluginComponent.KARAOKE_TC_DELTA,
                progressBar: false,
                mode: 2,
                label: "Rechercher dans la transcription",
                key: "Enter",
                labelSynchro: "Synchronisation de la transcription",
                deferredRendering: true,
            },
        };
    }

    /**
     * handle to seek work with defined tc delta
     * @param e mouse event
     */
    public seekToWord(e: MouseEvent): void {
        const element = e.target as HTMLElement;
        const tcIn = Number.parseFloat(element.getAttribute("data-tcin"));
        if (tcIn) {
            let seekTc;
            if (this.pluginConfiguration.data.resourceType === "stock" && this.pluginConfiguration?.data?.tcIn > 0) {
                seekTc = this.pluginConfiguration.data.tcDelta
                    ? tcIn - this.pluginConfiguration.data.tcDelta - this.pluginConfiguration.data.tcIn
                    : tcIn - this.pluginConfiguration.data.tcIn;
            } else {
                seekTc = this.pluginConfiguration.data.tcDelta ? tcIn - this.pluginConfiguration.data.tcDelta : tcIn;
            }
            const reverseMode = this.mediaPlayerElement.getMediaPlayer().reverseMode;
            this.mediaPlayerElement
                .getMediaPlayer()
                .setCurrentTime(reverseMode ? this.mediaPlayerElement.getMediaPlayer().getDuration() - seekTc : seekTc);
            this.scroll();
        }
    }

    /**
     * Invoked time change event for :
     * - update current time
     */

    private handleSeekedEvent = (): void => {
        this.displaySynchro.set(false);
        if (this.autoSyncTimer !== null) {
            clearTimeout(this.autoSyncTimer);
            this.autoSyncTimer = null;
        }
        this.handleOnTimeChange();
    };

    private handleSeekingEvent = (time: number): void => {
        this.handleOnTimeChange(time);
    };

    private handleOnTimeChange(seekingTime?: number) {
        const tcIn = this.pluginConfiguration?.data?.tcIn;
        const rawTime =
            seekingTime !== undefined ? seekingTime : this.mediaPlayerElement.getMediaPlayer().getCurrentTime();
        this.currentTime = tcIn > 0 ? rawTime + tcIn : rawTime;
        if (Number.isFinite(this.currentTime) && this.transcriptionElement) {
            const karaokeTcDelta =
                this.pluginConfiguration.data?.karaokeTcDelta || TranscriptionPluginComponent.KARAOKE_TC_DELTA;
            if (
                this.lastSegmentTcIn !== null &&
                this.lastSegmentTcOut !== null &&
                this.currentTime >= this.lastSegmentTcIn - karaokeTcDelta &&
                this.currentTime < this.lastSegmentTcOut
            ) {
                if (this.pluginConfiguration.data.mode !== 1 && this.pluginConfiguration.data.withSubLocalisations) {
                    this.disableSelectedWords();
                    this.selectWords(karaokeTcDelta);
                }
                return;
            }
            if (this.pluginConfiguration.data.mode === 1) {
                this.disableRemoveAllSelectedNodes();
            } else {
                this.disableSelectedWords();
                this.disableRemoveSelectedSegment();
            }
            this.selectSegment(karaokeTcDelta);
        }
    }

    /** @internal */
    public _handleOnTimeChangeForTesting() {
        this.handleOnTimeChange();
    }

    /**
     * Handle change text on searching input
     */

    public handleChangeInput(value) {
        if (value.length > 0) {
            this.typing.set(true);
        }
        if (this.searching() === true) {
            this.searching.set(false);
            Array.from(
                this.transcriptionElement.nativeElement.querySelectorAll(
                    `.${TranscriptionPluginComponent.SELECTOR_WORD}`,
                ),
            ).forEach((node) => {
                node.classList.remove(TranscriptionPluginComponent.SEARCH_SELECTOR);
            });
        }
    }

    /**
     *  disabled selected words on rewinding
     */
    private disableSelectedWords() {
        Array.from(
            this.transcriptionElement.nativeElement.querySelectorAll(
                `.${TranscriptionPluginComponent.SELECTOR_WORD}.${TranscriptionPluginComponent.SELECTOR_SELECTED}`,
            ),
        ).forEach((node) => {
            node.classList.remove(TranscriptionPluginComponent.SELECTOR_SELECTED);
        });
    }

    /**
     *  In charge to remove selected parent
     */
    private disableRemoveSelectedSegment() {
        // remove selected segment
        Array.from(
            this.transcriptionElement.nativeElement.querySelectorAll(
                `.${TranscriptionPluginComponent.SELECTOR_SEGMENT}.${TranscriptionPluginComponent.SELECTOR_SELECTED}`,
            ),
        ).forEach((node) => {
            node.classList.remove(TranscriptionPluginComponent.SELECTOR_SELECTED);
        });
        // Remove activated world
        Array.from(
            this.transcriptionElement.nativeElement.querySelectorAll(
                `.${TranscriptionPluginComponent.SELECTOR_WORD}.${TranscriptionPluginComponent.SELECTOR_ACTIVATED}`,
            ),
        ).forEach((node) => {
            node.classList.remove(TranscriptionPluginComponent.SELECTOR_ACTIVATED);
        });
    }

    /**
     *  In charge to remove selected elements and disable progress bar
     */
    private disableRemoveAllSelectedNodes() {
        // remove selected word
        Array.from(
            this.transcriptionElement.nativeElement.querySelectorAll(
                `.${TranscriptionPluginComponent.SELECTOR_WORD}.${TranscriptionPluginComponent.SELECTOR_SELECTED}`,
            ),
        ).forEach((node) => {
            if (!node.parentElement.parentElement.classList.contains(TranscriptionPluginComponent.SELECTOR_SELECTED)) {
                node.classList.remove(TranscriptionPluginComponent.SELECTOR_SELECTED);
            }
        });
        // remove selected segment
        Array.from(
            this.transcriptionElement.nativeElement.querySelectorAll(
                `.${TranscriptionPluginComponent.SELECTOR_SEGMENT}.${TranscriptionPluginComponent.SELECTOR_SELECTED}`,
            ),
        ).forEach((node) => {
            node.classList.remove(TranscriptionPluginComponent.SELECTOR_SELECTED);
        });
    }

    /**
     * In charge to select word in time range
     * @param karaokeTcDelta time code delta
     */
    private selectWords(karaokeTcDelta: number) {
        const node = this.transcriptionElement.nativeElement.querySelector(".segment.selected");
        const elementNodes = node ? Array.from(node.querySelectorAll<HTMLElement>(".w")) : [];
        const filteredNodes = this.handleModeTranscription(elementNodes, karaokeTcDelta);
        if (filteredNodes.length > 0) {
            this.handleSelectedWordsStyle(filteredNodes, karaokeTcDelta);
        }
    }

    /**
     * handle mode 1 || mode 2
     */
    private handleModeTranscription(elementNodes, karaokeTcDelta) {
        let filteredNodes;
        if (this.pluginConfiguration.data.mode === 1) {
            filteredNodes = elementNodes.filter(
                (node) =>
                    this.currentTime >= parseFloat(node.getAttribute("data-tcin")) - karaokeTcDelta &&
                    this.currentTime <= parseFloat(node.getAttribute("data-tcout")),
            );
        } else {
            filteredNodes = elementNodes.filter(
                (node) => this.currentTime >= parseFloat(node.getAttribute("data-tcin")) - karaokeTcDelta,
            );
        }
        return filteredNodes;
    }

    /**
     * add TranscriptionPluginComponent.SELECTOR_SELECTED to selected words
     */
    private handleSelectedWordsStyle(filteredNodes, karaokeTcDelta) {
        if (filteredNodes && filteredNodes.length > 0) {
            filteredNodes.forEach((n) => {
                n.classList.add(TranscriptionPluginComponent.SELECTOR_ACTIVATED);
                // add active to parent segment
                if (
                    this.currentTime >=
                        parseFloat(n.parentElement.parentElement.getAttribute("data-tcin")) - karaokeTcDelta &&
                    this.currentTime < parseFloat(n.parentElement.parentElement.getAttribute("data-tcout"))
                ) {
                    n.parentElement.parentElement.classList.add(TranscriptionPluginComponent.SELECTOR_SELECTED);
                }
                if (
                    this.currentTime >= parseFloat(n.getAttribute("data-tcin")) - karaokeTcDelta &&
                    this.currentTime < parseFloat(n.getAttribute("data-tcout"))
                ) {
                    n.classList.add(TranscriptionPluginComponent.SELECTOR_SELECTED);
                }
            });
        }
    }

    /**
     * In charge to select segment
     */

    private selectSegment(karaokeTcDelta: number) {
        const segmentElementNodes = Array.from(
            this.transcriptionElement.nativeElement.querySelectorAll<HTMLElement>(".segment"),
        );
        if (segmentElementNodes) {
            const segmentFilteredNodes = segmentElementNodes.filter(
                (node) =>
                    this.currentTime >= parseFloat(node.getAttribute("data-tcin")) - karaokeTcDelta &&
                    this.currentTime < parseFloat(node.getAttribute("data-tcout")),
            );
            if (segmentFilteredNodes && segmentFilteredNodes.length > 0) {
                this._inGap = false;
                this.lastSegmentTcIn = parseFloat(segmentFilteredNodes[0].getAttribute("data-tcin"));
                this.lastSegmentTcOut = parseFloat(segmentFilteredNodes[0].getAttribute("data-tcout"));
                // Hydrate le bloc @defer du segment actif via la condition `when` du template
                // (écriture de signal → tick coalescé → rendu), y compris hors viewport.
                this.activeSegmentTcIn.set(this.lastSegmentTcIn);
                segmentFilteredNodes.forEach((segmentNode) => {
                    segmentNode.classList.add(TranscriptionPluginComponent.SELECTOR_SELECTED);
                });
                segmentElementNodes.forEach((n) => {
                    if (n.classList.value !== "segment selected") {
                        n.querySelector(".subsegment").classList.remove(TranscriptionPluginComponent.SELECTOR_SELECTED);
                        const subSegmentElement = n.querySelector<HTMLElement>(".subsegment");
                        const textElement = subSegmentElement.querySelector<HTMLElement>(".text");
                        const wElementNodes = Array.from(textElement.querySelectorAll<HTMLElement>(".w"));
                        wElementNodes.forEach((word) => {
                            word.classList.remove(TranscriptionPluginComponent.SELECTOR_ACTIVATED);
                        });
                    }
                });
                if (this.pluginConfiguration.data && this.pluginConfiguration.data.withSubLocalisations) {
                    this.selectWords(karaokeTcDelta);
                    // Rendu différé : si le segment actif vient seulement d'être déclenché
                    // (aucun `.w` encore rendu — hydratation asynchrone), re-exécute la
                    // sélection karaoké après le prochain rendu (cas seek lointain en pause :
                    // le scroll se fait sur les offsets des segments, toujours présents, puis
                    // le mot est re-sélectionné ici). Garde anti-boucle par segment.
                    if (
                        this.deferredRendering &&
                        !segmentFilteredNodes[0].querySelector(`.${TranscriptionPluginComponent.SELECTOR_WORD}`) &&
                        this.karaokeRefreshTcIn !== this.lastSegmentTcIn
                    ) {
                        this.karaokeRefreshTcIn = this.lastSegmentTcIn;
                        this.runAfterNextRender(() => this.handleOnTimeChange());
                    }
                }
                if (this.lastSelectedNode !== segmentFilteredNodes[0]) {
                    this.lastSelectedNode = segmentFilteredNodes;
                    this.scroll();
                }
            } else if (!this._inGap) {
                this._inGap = true;
                this.lastSegmentTcIn = null;
                this.lastSegmentTcOut = null;
                this.lastSelectedNode = null;
            }
        }
    }

    /**
     * In charge transcription to scroll position is equal to segment position minus transcription block padding and segment height
     */
    private scroll() {
        const scrollNode: HTMLElement = this.transcriptionElement.nativeElement.querySelector(
            `.${TranscriptionPluginComponent.SELECTOR_SEGMENT}.${TranscriptionPluginComponent.SELECTOR_SELECTED}`,
        );
        if (scrollNode && this.displaySynchro() === false) {
            this.scrollToNode(scrollNode);
            this.displaySynchro.set(false);
        }
    }

    /**
     * Invoked to scroll to node
     * @param scrollNode scroll node element
     */
    private scrollToNode(scrollNode: HTMLElement) {
        if (scrollNode) {
            const minScroll = Math.round(this.transcriptionElement.nativeElement.offsetHeight / 3);
            const maxScrollPos = Math.round((2 * this.transcriptionElement.nativeElement.offsetHeight) / 3);
            const scrollPos = scrollNode.offsetTop - this.transcriptionElement.nativeElement.offsetTop;
            const visible = scrollPos < maxScrollPos;
            if (this.ignoreNextScroll && !visible) {
                this.ignoreNextScroll = false;
                this.displaySynchro.set(false);
            }
            if (this.currentTime === 0) {
                this.transcriptionElement.nativeElement.scrollTop = 0;
            }
            // scroll to node if he's not visible
            if (this.autoScroll) {
                if (!visible && this.displaySynchro() === false) {
                    this.isAutoScrolling = true;
                    this.transcriptionElement.nativeElement.scrollTop = scrollPos - minScroll;
                    setTimeout(() => {
                        this.isAutoScrolling = false;
                    }, 50);
                }
            }
        }
    }

    /**
     * handle scroll event
     */
    public handleScroll(ignoreNextScroll?: boolean) {
        if (this.isAutoScrolling) {
            this.isAutoScrolling = false;
            return;
        }
        this.ignoreNextScroll = ignoreNextScroll;
        this.updateSynchro();
    }

    /**
     * Invoked on metadata loaded
     */

    protected override handleMetadataLoaded() {
        if (this.metaDataLoaded()) {
            this.parseTranscription();
            // Synchronisation initiale des mots une fois le template re-rendu (mode détaché,
            // vidéo en pause) : afterNextRender remplace l'ancien setTimeout(50) — audit
            // setTimeout catégorie c (« attendre le rendu »).
            this.runAfterNextRender(() => this.handleOnTimeChange());
        }
    }

    /** @internal */
    _handleMetadataLoadedForTesting() {
        this.handleMetadataLoaded();
    }

    /**
     * In charge to load metadata
     */
    private parseTranscription() {
        this.lastSegmentTcIn = null;
        this.lastSegmentTcOut = null;
        this._inGap = false;
        const currentTranscriptions = this.transcriptions();
        if (!currentTranscriptions || currentTranscriptions.length === 0) {
            const handleMetadataIds = this.pluginConfiguration.metadataIds;
            const metadataManager = this.mediaPlayerElement.metadataManager;
            this.logger.info(` Metadata loaded transcription ${handleMetadataIds}`);
            // Check if metadata is initialized
            if (metadataManager && handleMetadataIds && Utils.isArrayLike<string>(handleMetadataIds)) {
                // Construit la liste localement puis publie en une seule écriture de signal.
                let transcriptions = new Array<TranscriptionLocalisation>();
                handleMetadataIds.forEach((metadataId) => {
                    this.logger.info(`get metadata for ${metadataId}`);
                    const transcriptionLocalisations = metadataManager.getTranscriptionLocalisations(
                        metadataId,
                        this.pluginConfiguration.data.parseLevel,
                        this.pluginConfiguration.data.withSubLocalisations,
                    );
                    if (transcriptionLocalisations && transcriptionLocalisations.length > 0) {
                        transcriptions = transcriptions.concat(transcriptionLocalisations);
                    }
                });
                // Add sort by tcin
                if (transcriptions) {
                    transcriptions = sortBy(transcriptions, ["tcIn"]);
                    const tcIn = this.pluginConfiguration?.data?.tcIn;
                    const duration = this.pluginConfiguration?.data?.duration;
                    if (tcIn > 0 || duration > 0) {
                        let transcriptionsToBeRemoved = [];
                        transcriptions.forEach((transcription, index) => {
                            if (transcription.tcOut < tcIn) {
                                transcriptionsToBeRemoved.push(transcription);
                            }
                            if (duration > 0 && transcription.tcIn > tcIn + duration) {
                                transcriptionsToBeRemoved.push(transcription);
                            }
                        });
                        transcriptions = transcriptions.filter(
                            (transcription) => !transcriptionsToBeRemoved.includes(transcription),
                        );
                    }
                }
                // Marque les entités nommées sur les données avant publication : le premier rendu
                // porte déjà les classes, sans hydrater les blocs @defer (cf. markNamedEntities).
                this.markNamedEntities(transcriptions);
                this.transcriptions.set(transcriptions);
            }
        }
    }

    /**
     * Vrai quand le rendu différé est actif et que tous les mots ne sont pas encore dans le
     * DOM : les chemins qui font un querySelectorAll global sur `.w` (recherche, entités
     * nommées) doivent d'abord forcer l'hydratation des blocs @defer. La présence d'un
     * placeholder dans le DOM fait foi : un DOM sans placeholder (tout hydraté, ou DOM
     * fabriqué dans les specs) n'a besoin d'aucune hydratation.
     */
    private needsWordHydration(): boolean {
        if (!this.deferredRendering || this.wordsRendered) {
            return false;
        }
        return !!this.transcriptionElement?.nativeElement?.querySelector(".w-placeholder");
    }

    /**
     * Force l'hydratation de tous les blocs @defer (signal forceRenderAll → condition `when`
     * du template) puis ré-exécute `action` après le rendu — l'hydratation est asynchrone,
     * afterNextRender garantit que les mots sont dans le DOM au moment de la sélection.
     */
    private hydrateAllWordsThen(action: () => void): void {
        this.forceRenderAll.set(true);
        this.runAfterNextRender(() => {
            this.wordsRendered = true;
            action();
        });
    }

    /**
     * Search word and scroll to first result
     */

    public searchWord(searchText: string) {
        if (this.needsWordHydration()) {
            // Rendu différé : hydrate tous les segments puis relance la recherche sur le DOM complet.
            this.hydrateAllWordsThen(() => this.searchWord(searchText));
            return;
        }
        // Le tableau est poussé au fil de la boucle (synchrone) : le signal est publié une fois
        // en tête, la vue lit la longueur finale au rendu suivant.
        const listOfSearchedNodes = new Array<HTMLElement>();
        this.listOfSearchedNodes.set(listOfSearchedNodes);
        if (searchText !== "" && searchText !== this.pluginConfiguration.data.label) {
            this.searching.set(true);
            Array.from(
                this.transcriptionElement.nativeElement.querySelectorAll(
                    `.${TranscriptionPluginComponent.SELECTOR_WORD}`,
                ),
            ).forEach((node) => {
                node.classList.remove(TranscriptionPluginComponent.SEARCH_SELECTOR);
                if (TextUtils.hasSearchText(node.textContent, searchText)) {
                    listOfSearchedNodes.push(node as HTMLElement);
                    // add active class to first element
                    this.index.set(this.searchedWordIndex + 1);
                    listOfSearchedNodes.forEach((n) => {
                        n.classList.add(TranscriptionPluginComponent.SEARCH_FOUNDED);
                    });
                    listOfSearchedNodes[0].classList.add(TranscriptionPluginComponent.SEARCH_SELECTOR);
                    const scrollNode: HTMLElement = listOfSearchedNodes[0].parentElement.parentElement;
                    if (scrollNode) {
                        const scrollPos = scrollNode.offsetTop - this.transcriptionElement.nativeElement.offsetTop;
                        this.transcriptionElement.nativeElement.scrollTop = scrollPos;
                        this.ignoreNextScroll = true;
                    }
                }
            });
        }
    }

    /**
     * Scroll to next or previous searched word
     */

    public scrollToSearchedWord(direction: string) {
        const listOfSearchedNodes = this.listOfSearchedNodes();
        if (listOfSearchedNodes && listOfSearchedNodes.length > 0) {
            if (listOfSearchedNodes[this.searchedWordIndex]) {
                listOfSearchedNodes[this.searchedWordIndex].classList.remove(
                    TranscriptionPluginComponent.SEARCH_SELECTOR,
                );
            }
            if (direction === "up") {
                this.searchedWordIndex = this.searchedWordIndex - 1;
            } else {
                this.searchedWordIndex = this.searchedWordIndex + 1;
            }
            if (this.searchedWordIndex > listOfSearchedNodes.length - 1 && direction === "down") {
                this.searchedWordIndex = 0;
            } else if (this.searchedWordIndex < 0 && direction === "up") {
                this.searchedWordIndex = listOfSearchedNodes.length - 1;
            }
            this.index.set(this.searchedWordIndex + 1);
            this.ignoreNextScroll = true;
            this.autoScroll = false;
            listOfSearchedNodes[this.searchedWordIndex].classList.add(TranscriptionPluginComponent.SEARCH_SELECTOR);
            const scrollNode: HTMLElement = listOfSearchedNodes[this.searchedWordIndex].parentElement.parentElement;
            if (scrollNode) {
                const scrollPos = scrollNode.offsetTop - this.transcriptionElement.nativeElement.offsetTop;
                this.transcriptionElement.nativeElement.scrollTop = scrollPos;
            }
        }
    }

    /**
     * Invocked on click SYNCHRO button
     */

    public scrollToSelectedSegment() {
        if (this.autoSyncTimer !== null) {
            clearTimeout(this.autoSyncTimer);
            this.autoSyncTimer = null;
        }
        // Recalcule toujours la selection a partir du currentTime reel avant de chercher le noeud :
        // un .segment.selected peut deja exister mais correspondre a une ancienne position (ex. seek
        // declenche depuis le storyboard pas encore traite par handleOnTimeChange), ce qui ferait
        // scroller vers le mauvais segment tout en masquant le bouton de synchronisation.
        this.handleOnTimeChange();
        let scrollNode: HTMLElement = this.transcriptionElement.nativeElement.querySelector(
            `.${TranscriptionPluginComponent.SELECTOR_SEGMENT}.${TranscriptionPluginComponent.SELECTOR_SELECTED}`,
        );
        if (scrollNode) {
            const scrollPos = scrollNode.offsetTop - this.transcriptionElement.nativeElement.offsetTop;
            const minScroll = Math.round(this.transcriptionElement.nativeElement.offsetHeight / 3);
            this.isAutoScrolling = true;
            this.transcriptionElement.nativeElement.scrollTop = scrollPos - minScroll;
            this.automaticallyScrolled = true;
            setTimeout(() => {
                this.isAutoScrolling = false;
                this.automaticallyScrolled = false;
            }, 100);
        }
        this.displaySynchro.set(false);
    }

    /**
     * clear seach list onclick
     */

    public clearSearchList() {
        this.autoScroll = true;
        this.index.set(0);
        this.searchedWordIndex = 0;
        this.listOfSearchedNodes.set(null);
        this.searching.set(false);
        Array.from(
            this.transcriptionElement.nativeElement.querySelectorAll(`.${TranscriptionPluginComponent.SELECTOR_WORD}`),
        ).forEach((node) => {
            node.classList.remove(TranscriptionPluginComponent.SEARCH_SELECTOR);
            node.classList.remove(TranscriptionPluginComponent.SEARCH_FOUNDED);
        });
    }

    private isHandleShortCutNeeded(event): boolean {
        return (
            event.key === this.pluginConfiguration.data.key &&
            this.searching() === false &&
            this.searchText.nativeElement.value !== ""
        );
    }

    private isScrollToNextWordNeeded(): boolean {
        const listOfSearchedNodes = this.listOfSearchedNodes();
        return listOfSearchedNodes && listOfSearchedNodes.length !== 0 && this.searchedWordIndex !== null;
    }

    /***
     * handleShortcut on search button
     * */
    public handleShortcut(event) {
        if (this.isHandleShortCutNeeded(event)) {
            if (this.prevSearchValue !== this.searchText.nativeElement.value) {
                this.prevSearchValue = this.searchText.nativeElement.value;
                this.clearSearchList();
                this.searchWord(this.searchText.nativeElement.value);
                this.searching.set(true);
            } else {
                if (this.isScrollToNextWordNeeded()) {
                    let direction = this.computeDirection();
                    this.searching.set(true);
                    this.scrollToSearchedWord(direction);
                } else {
                    this.searchWord(this.searchText.nativeElement.value);
                    this.searching.set(true);
                }
            }
        }
        if (event.key === TranscriptionPluginComponent.BACKSPACE_KEY && this.searchText.nativeElement.value !== "") {
            this.clearSearchList();
            this.typing.set(false);
        }
    }

    private computeDirection = () => {
        let direction = "down";
        if (this.searchedWordIndex === this.listOfSearchedNodes().length) {
            direction = "up";
        }
        return direction;
    };

    /**
     * if scrolling and active segment is not visible add synchro button
     */

    public updateSynchro() {
        let visible;
        const selector =
            "." +
            TranscriptionPluginComponent.SELECTOR_SEGMENT +
            " > ." +
            TranscriptionPluginComponent.SELECTOR_SUBSEGMENT +
            " > " +
            ".text > ." +
            TranscriptionPluginComponent.SELECTOR_WORD +
            "." +
            TranscriptionPluginComponent.SELECTOR_SELECTED;
        const activeNode: HTMLElement = this.transcriptionElement.nativeElement.querySelector(selector);
        if (activeNode) {
            const positionA = this.transcriptionElement.nativeElement.getBoundingClientRect();
            const positionB = activeNode.getBoundingClientRect();
            // check if active element is visible
            const top = positionB.top >= positionA.top;
            const bottom =
                positionB.top - activeNode.clientHeight <
                this.transcriptionElement.nativeElement.clientHeight + positionA.top;
            if (!(top && bottom)) {
                visible = false;
            }
            this.displaySynchro.set(visible === false);
            if (this.displaySynchro() && this.autoScroll) {
                this.startAutoSyncTimer();
            } else if (!this.displaySynchro() && this.autoSyncTimer !== null) {
                clearTimeout(this.autoSyncTimer);
                this.autoSyncTimer = null;
            }
        }
    }

    /**
     * (Re)start the timer that automatically scrolls back to the active segment
     */
    private startAutoSyncTimer() {
        if (this.autoSyncTimer !== null) {
            clearTimeout(this.autoSyncTimer);
        }
        this.autoSyncTimer = setTimeout(() => {
            this.autoSyncTimer = null;
            this.scrollToSelectedSegment();
        }, TranscriptionPluginComponent.AUTO_SYNC_DELAY);
    }

    /**
     * Postpone the automatic resync while the user is actively browsing the transcription
     */
    public resetAutoSyncTimer() {
        if (this.displaySynchro() && this.autoSyncTimer !== null) {
            this.startAutoSyncTimer();
        }
    }

    /**
     * Marque sur les **données** les mots appartenant à une entité nommée (`isNamedEntity`), lu
     * ensuite par le template via `[class.named-entity]`.
     *
     * Remplace le surlignage historique en `querySelectorAll` : celui-ci exigeait que tous les
     * mots soient dans le DOM et forçait donc l'hydratation de tous les blocs `@defer` dès qu'un
     * seul segment portait une annotation — cas dominant sur les assets réels (mesuré sur un
     * flux TV d'une heure : 127 segments sur 151 annotés, 10 405 mots et 12 955 nœuds rendus au
     * chargement, soit le gain du rendu différé annulé). En marquant les données, le `@defer`
     * reste différé : un segment hydraté plus tard obtient ses classes par binding.
     *
     * L'algorithme de correspondance est celui d'origine, transposé du `NodeList` de `.w` vers le
     * tableau des sous-localisations, pour conserver le comportement à l'identique :
     * - `matchedText` composé (« Emmanuel Macron ») : les mots consécutifs doivent tous
     *   correspondre, sinon aucun n'est marqué ;
     * - `matchedText` simple : tout mot correspondant est marqué ;
     * - segment sans sous-localisations : le segment lui-même porte le drapeau (un tableau d'un
     *   seul élément, ce qui reproduit le fait qu'un texte composé n'y matche jamais).
     *
     * La comparaison passe toujours par {@link TextUtils.hasSearchText} (casse et diacritiques).
     */
    private markNamedEntities(transcriptions: Array<TranscriptionLocalisation>): void {
        if (!transcriptions || transcriptions.length === 0) {
            return;
        }
        transcriptions.forEach((tr) => {
            const words = tr.subLocalisations?.length > 0 ? tr.subLocalisations : [tr];
            words.forEach((word) => (word.isNamedEntity = false));
            if (!tr.annotations?.length) {
                return;
            }
            tr.annotations.forEach((annotation) => {
                const matchedTexts = Array.isArray(annotation.matchedText)
                    ? annotation.matchedText
                    : [annotation.matchedText];
                matchedTexts.forEach((matchedText) => this.markMatchedWords(matchedText, words));
            });
        });
    }

    /**
     * Marque les mots d'un segment correspondant à un `matchedText` d'annotation.
     */
    private markMatchedWords(matchedText: string, words: Array<TranscriptionLocalisation>): void {
        if (typeof matchedText !== "string") {
            return;
        }
        if (!matchedText.includes(" ")) {
            words.forEach((word) => {
                if (TextUtils.hasSearchText(word.text, matchedText)) {
                    word.isNamedEntity = true;
                }
            });
            return;
        }
        // Texte composé : la suite de mots à partir de l'index courant doit matcher entièrement.
        const parts = matchedText.split(" ");
        words.forEach((word, index) => {
            if (!TextUtils.hasSearchText(word.text, parts[0])) {
                return;
            }
            const candidates = [word];
            const allMatched = parts.every((part, pos) => {
                if (pos === 0) {
                    return true;
                }
                const next = words[index + pos];
                if (!next || !TextUtils.hasSearchText(next.text, part)) {
                    return false;
                }
                candidates.push(next);
                return true;
            });
            if (allMatched) {
                candidates.forEach((candidate) => (candidate.isNamedEntity = true));
            }
        });
    }

    ngAfterViewInit(): void {
        // Le surlignage des entités nommées ne dépend plus du DOM (markNamedEntities est appelé
        // par parseTranscription) : le Utils.waitFor qui attendait le rendu des mots a disparu.
        Utils.displaySnackBar(
            this.messagesComponent,
            "Les transcriptions sont issues d'un traitement par IA et peuvent contenir des erreurs.",
            "info",
        );
    }

    override ngOnDestroy(): void {
        if (this.autoSyncTimer !== null) {
            clearTimeout(this.autoSyncTimer);
        }
        super.ngOnDestroy();
    }
}
