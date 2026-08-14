import { PluginBase } from "../../core/plugin/plugin-base";
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    computed,
    ElementRef,
    inject,
    Input,
    NgZone,
    OnInit,
    signal,
    ViewChild,
    ViewEncapsulation,
    WritableSignal,
} from "@angular/core";
import { PluginConfigData } from "../../core/config/model/plugin-config-data";
import { MediaPlayerService } from "../../service/media-player-service";
import { TimelineConfig } from "../../core/config/model/timeline-config";
import interact from "interactjs";
import { Options } from "sortablejs";
import { PlayerEventType } from "../../core/constant/event-type";
import { DataType } from "../../core/constant/data-type";
import { Utils } from "../../core/utils/utils";
import { TimeLineBlock, TimelineLocalisation } from "../../core/metadata/model/timeline-localisation";
import find from "lodash/find";
import { Metadata } from "@ina/amalia-model";
import { TreeNode, PrimeTemplate } from "primeng/api";
import { MetadataManager } from "src/app/core/metadata/metadata-manager";
import { ToastComponent } from "../../core/toast/toast.component";
import { Bind } from "primeng/bind";
import { Toolbar } from "primeng/toolbar";
import { Button } from "primeng/button";
import { NgStyle, NgClass } from "@angular/common";
import { PreventCtrlScrollDirective } from "../../core/directive/inaSortablejs/prevent-ctrl-scroll.directive";
import { SortablejsDirective } from "../../core/directive/inaSortablejs/sortablejs.directive";
import { Accordion, AccordionPanel, AccordionHeader, AccordionContent } from "primeng/accordion";
import { Draggable, Droppable } from "primeng/dragdrop";
import { Ripple } from "primeng/ripple";
import { Checkbox } from "primeng/checkbox";
import { FormsModule } from "@angular/forms";
import { Tree } from "primeng/tree";
import { ChevronDownIcon, ChevronRightIcon } from "primeng/icons";
import { TcFormatPipe } from "../../core/utils/tc-format.pipe";

@Component({
    selector: "amalia-timeline",
    templateUrl: "./timeline-plugin.component.html",
    styleUrls: ["./timeline-plugin.component.scss"],
    encapsulation: ViewEncapsulation.ShadowDom,
    imports: [
        Bind,
        Toolbar,
        Button,
        NgStyle,
        PreventCtrlScrollDirective,
        SortablejsDirective,
        Accordion,
        AccordionPanel,
        Draggable,
        Droppable,
        NgClass,
        Ripple,
        AccordionHeader,
        AccordionContent,
        Checkbox,
        FormsModule,
        Tree,
        ChevronDownIcon,
        ChevronRightIcon,
        PrimeTemplate,
        ToastComponent,
        TcFormatPipe,
    ],
    // OnPush (phase 7 vague 2) : duration/focusTcIn/focusTcOut/configIsOpen sont des signals
    // (mutés par les listeners DURATION_CHANGE/ELEMENT_CLICK 'none' et par les fins de drag/
    // resize interactjs exécutées hors zone) ; selectedNodes était déjà un signal. Les
    // collections restées plates (listOfBlocks, listOfBlocksIndexes, nodes, mainLocalisations,
    // allNodesChecked, indeterminate) ne sont mutées que par des handlers de template (vue
    // marquée dirty par l'événement) ou sous les listeners METADATA_LOADED/USER_SEGMENT_CHANGED
    // en 'schedule' (markForCheck après le handler) : parseTimelineMetadata mute ces champs
    // en place et met à jour les TreeNode PrimeNG. Le setTimeout d'updateTreeComponent
    // notifie lui-même la CD (markForCheck, audit setTimeout phase 8) et est zoneless-safe.
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelinePluginComponent extends PluginBase<TimelineConfig> implements OnInit, AfterViewInit {
    public static PLUGIN_NAME = "TIMELINE";
    public title: string;
    public mainBlockColor: string;
    public mainLocalisations: Array<TimelineLocalisation>;
    public listOfBlocks: Array<TimeLineBlock> = [];
    public listOfBlocksIndexes: Array<number> = [];
    /** Menu de filtres ouvert — signal : refermé par le listener document ELEMENT_CLICK ('none'). */
    public readonly configIsOpen = signal(false);
    public currentTime = 0;
    /** Durée du média — signal : écrite par DURATION_CHANGE ('none') et le waitFor d'init. */
    public readonly duration = signal(0);
    public override tcOffset = 0;
    /** Bornes du zoom (fenêtre focus) — signals : écrites par les fins de drag/resize interactjs
     *  exécutées hors zone Angular et par DURATION_CHANGE ('none'). */
    public readonly focusTcIn = signal(0);
    public readonly focusTcOut = signal(0);
    public tcIn = 0;
    public durationFromConfig = 0;
    public resourceType: "stock" | "flux";
    public selectionPosition = {
        x: 0,
        y: 0,
        startX: 0,
        startY: 0,
    };
    public isDrawingRectangle = false;
    @Input()
    public colors: Array<string> = [
        "#609af8",
        "#4cd07d",
        "#eec137",
        "#ff6259",
        "#f06bac",
        "#8183f4",
        "#41c5b7",
        "#fa8e42",
        "#818ea1",
        "#b975f9",
        "#35c4dc",
        "#3b82f6",
        "#22c55e",
        "#eab308",
        "#ff3d32",
        "#ec4899",
        "#6366f1",
        "#14b8a6",
        "#f97316",
        "#64748b",
        "#a855f7",
        "#06b6d4",
        "#326fd1",
        "#1da750",
        "#c79807",
        "#d9342b",
        "#c93d82",
        "#5457cd",
        "#119c8d",
        "#d46213",
        "#556376",
        "#8f48d2",
        "#059bb4",
        "#295bac",
        "#188a42",
        "#a47d06",
        "#b32b23",
        "#a5326b",
        "#4547a9",
        "#0e8174",
        "#ae510f",
        "#465161",
        "#763cad",
        "#047f94",
        "#85b2f9",
        "#76db9b",
        "#f2d066",
        "#ff8780",
        "#f38ec0",
        "#9ea0f6",
        "#6dd3c8",
        "#fba86f",
        "#9fa9b7",
        "#c996fa",
        "#65d2e4",
        "#204887",
        "#136c34",
        "#816204",
        "#8c221c",
        "#822854",
        "#363885",
        "#0b655b",
        "#893f0c",
        "#37404c",
        "#5c2f88",
        "#036475",
        "#183462",
        "#0e4f26",
        "#5e4803",
        "#661814",
        "#5e1d3d",
        "#282960",
        "#084a42",
        "#642e09",
        "#282e38",
        "#432263",
        "#024955",
    ];
    @ViewChild("focusContainer", { static: true })
    public focusContainer: ElementRef<HTMLElement>;
    @ViewChild("mainTimeline", { static: true })
    public mainTimeline: ElementRef<HTMLDivElement>;
    @ViewChild("mainBlockContainer", { static: true })
    public mainBlockContainer: ElementRef<HTMLElement>;
    @ViewChild("listOfBlocksContainer", { static: true })
    public listOfBlocksContainer: ElementRef<HTMLElement>;
    @ViewChild("listOfBlocksAccordion", { static: true })
    public listOfBlocksAccordion: ElementRef<HTMLElement>;
    @ViewChild("selectedBlockElement", { static: true })
    public selectedBlockElement: any = null;
    @ViewChild("selectionContainer", { static: true })
    public selectionContainer: ElementRef<HTMLElement>;
    @ViewChild("menuContainer", { static: true })
    public menuContainer: ElementRef<HTMLElement>;
    public selectedBlock: TimelineLocalisation = null;
    public sortableOptions: Options = {
        handle: ".drag",
        filter: ".filtered",
    };

    /**
     * true for open all block
     */
    private blocksIsOpen = false;
    private lastSelectedColorIdx = -1;
    managedDataTypes = [
        DataType.SEGMENTATION,
        DataType.AUDIO_SEGMENTATION,
        DataType.FACES_RECOGNITION,
        DataType.DAY_SCHEDULE,
        DataType.DOCUMENTS_LIES,
        DataType.EXTRAITS_UTILISATEUR,
    ];

    nodes: TreeNode[] = [];
    selectedNodes: WritableSignal<TreeNode[]> = signal<TreeNode[]>([]);
    selectedNodesMap = computed(() => {
        let result = new Map<string, TreeNode>();
        this.selectedNodes().forEach((selectedNode) => {
            result.set(selectedNode.key, selectedNode);
        });
        return result;
    });
    selectedNodesBeforeChange: TreeNode[] = [];
    allNodesChecked: boolean = false;
    isSelectSegmentsFocused: boolean = false;
    enableZoom: boolean = false;
    mouseX: number;
    mouseY: number;
    indeterminate: boolean = false;
    mapOfBlocksIndexes: Map<TimeLineBlock, number> = new Map<TimeLineBlock, number>();

    @ViewChild("messages") messagesComponent!: ToastComponent;
    tvDaysEnabled: boolean = false;

    /**
     * Zone Angular locale (celle de PluginBase est privée) : l'installation interactjs
     * (drag/resize de la fenêtre de zoom) tourne hors zone pour que chaque pointermove du
     * drag ne déclenche pas de change detection ; les résultats sont commités via signals.
     */
    private readonly ngZone: NgZone | null = TimelinePluginComponent.tryInjectNgZone();

    private static tryInjectNgZone(): NgZone | null {
        try {
            return inject(NgZone, { optional: true });
        } catch {
            return null;
        }
    }

    /** Exécute `fn` hors zone Angular quand la zone est disponible, sinon telle quelle. */
    private runOutsideAngular<T>(fn: () => T): T {
        return this.ngZone ? this.ngZone.runOutsideAngular(fn) : fn();
    }

    constructor(
        playerService: MediaPlayerService,
        private cdr: ChangeDetectorRef,
    ) {
        super(playerService);
        this.pluginName = TimelinePluginComponent.PLUGIN_NAME;
    }

    ngAfterViewInit(): void {
        this.subscriptionToEventsEmitters.push(
            Utils.waitFor(
                this.mediaPlayerElementReady.bind(this),
                undefined,
                this.initAfterMediaPlayerElementIsReady.bind(this),
                this.intervalStep,
                this.timeout,
                this.setDataLoading.bind(this),
            ),
        );
        Utils.displaySnackBar(
            this.messagesComponent,
            "Des segments sont issus de traitements IA et peuvent contenir des erreurs.",
            "info",
        );
    }

    override ngOnInit(): void {
        try {
            // closeMenu n'écrit que des signals (configIsOpen, selectedNodes) → 'none' :
            // plus de zone.run/markForCheck sur chaque clic document.
            this.addListener(document, PlayerEventType.ELEMENT_CLICK, this.closeMenu, { policy: "none" });
            this.resourceType = this.pluginConfiguration?.data?.resourceType;
            this.tcIn = this.pluginConfiguration?.data?.tcIn;
            this.durationFromConfig = this.pluginConfiguration?.data?.duration;
            this.tvDaysEnabled = this.pluginConfiguration?.data?.tvDaysEnabled;
            super.ngOnInit();
        } catch (e) {
            this.logger.debug("An error occured when initializing the pluging " + this.pluginName, e);
        }
        this.subscriptionToEventsEmitters.push(
            Utils.waitFor(
                this.mediaPlayerElementReady.bind(this),
                undefined,
                this.initAfterMediaPlayerElementIsReady.bind(this),
                this.intervalStep,
                this.timeout,
                this.setDataLoading.bind(this),
            ),
        );
    }

    initAfterMediaPlayerElementIsReady() {
        this.duration.set(this.mediaPlayerElement.getMediaPlayer().getDuration());
        if (this.mediaPlayerElement.getConfiguration().loadMetadataOnDemand) {
            this.init();
            this.handleMetadataLoaded();
            this.handleOnDurationChange();
        }
        this.refreshTimeCursor();
        this.updateTimeCodePosition();
        // Appelé depuis le timer de Utils.waitFor (hors de tout listener player) : init/
        // handleMetadataLoaded mutent des champs plats lus par le template (listOfBlocks,
        // nodes, mainLocalisations…) → notification explicite de la vue OnPush.
        this.cdr.markForCheck();
    }

    closeMenu(event: any) {
        if (this.configIsOpen() === true) {
            if (
                !Utils.isInComposedPath("menu-content", event) &&
                !Utils.isInComposedPath("timeline-toolbar-filter-button", event)
            ) {
                this.handleDisplayBlocks(false);
            }
        }
    }

    getNewNodeFromMetadataElement = (metadata: { type: string }) => {
        let { level1Label, icon } = this.getNodeLabelAndIcon(metadata);

        let level1Node: TreeNode =
            icon === ""
                ? {
                      key: metadata.type,
                      label: level1Label,
                      children: [],
                      checked: true,
                      expanded: true,
                  }
                : {
                      key: metadata.type,
                      label: level1Label,
                      children: [],
                      data: { spriteIcon: icon },
                      checked: true,
                      expanded: true,
                  };
        return level1Node;
    };

    getNodeLabelAndIcon(metadata: { type: string }) {
        let level1Label: string = "";
        // `icon` = id d'un symbole du sprite SVG (src/assets/svgs/symbol/svg/sprite.symbol.svg)
        let icon: string = undefined;
        const segmentationRegExp = new RegExp(DataType.SEGMENTATION, "g");
        const facesRecognitionRegExp = new RegExp(DataType.FACES_RECOGNITION, "g");
        const dayScheduleRegExp = new RegExp(DataType.DAY_SCHEDULE, "g");
        const documentLieRegExp = new RegExp(DataType.DOCUMENTS_LIES, "g");
        const extraitsUtilisateurRegExp = new RegExp(DataType.EXTRAITS_UTILISATEUR, "g");

        if (segmentationRegExp.test(metadata.type)) {
            level1Label = metadata.type.replace(new RegExp(DataType.SEGMENTATION, "g"), "Segmentation sonore");
            icon = "pi-volume-down";
        }
        if (facesRecognitionRegExp.test(metadata.type)) {
            level1Label = metadata.type.replace(new RegExp(DataType.FACES_RECOGNITION, "g"), "Reconnaissance faciale");
            icon = "pi-eye";
        }
        if (dayScheduleRegExp.test(metadata.type)) {
            level1Label = metadata.type.replace(new RegExp(DataType.DAY_SCHEDULE, "g"), "Partie journée de programme");
            icon = "pi-calendar";
        }
        if (documentLieRegExp.test(metadata.type)) {
            level1Label = metadata.type.replace(new RegExp(DataType.DOCUMENTS_LIES, "g"), "Documents liés segmentés");
            icon = "pi-file";
        }
        if (extraitsUtilisateurRegExp.test(metadata.type)) {
            level1Label = metadata.type.replace(new RegExp(DataType.EXTRAITS_UTILISATEUR, "g"), "Extraits utilisateur");
            icon = "pi-tags";
        }
        if (level1Label.endsWith("-")) {
            level1Label = level1Label.substring(0, level1Label.length - 1);
        }
        return { level1Label, icon };
    }

    /**
     * Return color color
     */
    private getAvailableColor() {
        this.lastSelectedColorIdx =
            this.lastSelectedColorIdx + 1 > this.colors.length - 1 ? 0 : this.lastSelectedColorIdx + 1;
        return this.colors[this.lastSelectedColorIdx];
    }

    override init() {
        super.init();
        if (this.pluginConfiguration.data) {
            this.timeFormat = this.pluginConfiguration.data.timeFormat || this.getDefaultConfig().data.timeFormat;
        }
        this.title = this.pluginConfiguration.data.title;
        if (this.pluginConfiguration.data.mainBlockColor) {
            this.mainBlockColor = this.pluginConfiguration.data.mainBlockColor;
        }
        // Installation interactjs (resizable + draggable + dragend/resizeend) hors zone :
        // les pointermove du drag/resize ne déclenchent plus de change detection, les
        // résultats (handleZoomRangeChange) sont commités via les signals focusTcIn/focusTcOut.
        this.runOutsideAngular(() => this.initFocusResizable(this.focusContainer.nativeElement));
        // Le mousemove ne fait qu'actualiser selectionPosition (non lu par le template) → 'none'.
        this.addListener(
            this.listOfBlocksContainer.nativeElement,
            PlayerEventType.HTML_ELEMENT_MOUSE_MOVE,
            this.handleMouseMoveToDrawRect,
            { policy: "none" },
        );
        if (this.mediaPlayerElement.isMetadataLoaded) {
            this.parseTimelineMetadata();
            this.handleOnDurationChange();
        }
        // METADATA_LOADED/USER_SEGMENT_CHANGED restent en 'schedule' (défaut PluginBase) :
        // parseTimelineMetadata mute en place des collections plates lues par le template
        // (listOfBlocks, listOfBlocksIndexes, nodes, mainLocalisations) et les TreeNode
        // PrimeNG — le markForCheck du wrapper notifie la vue OnPush. (Le setTimeout
        // d'updateTreeComponent notifie lui-même la CD — audit setTimeout phase 8.)
        this.addListener(
            this.mediaPlayerElement.eventEmitter,
            PlayerEventType.METADATA_LOADED,
            this.handleMetadataLoaded,
        );
        this.addListener(
            this.mediaPlayerElement.eventEmitter,
            PlayerEventType.USER_SEGMENT_CHANGED,
            this.handleMetadataLoaded,
        );
        // TIME_CHANGE (chemin chaud) : currentTime n'est pas lu par le template et
        // refreshTimeCursor ne fait que du DOM → 'none'. DURATION_CHANGE n'écrit que les
        // signals duration/focusTcIn/focusTcOut (+ DOM) → 'none'.
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.TIME_CHANGE, this.handleOnTimeChange, {
            policy: "none",
        });
        this.addListener(
            this.mediaPlayerElement.eventEmitter,
            PlayerEventType.DURATION_CHANGE,
            this.handleOnDurationChange,
            { policy: "none" },
        );
    }

    /**
     * In charge to parse metadata
     */
    parseTimelineMetadata() {
        const previousFilterState = this.captureFilterState();
        this.listOfBlocks = [];
        this.listOfBlocksIndexes = [];
        const listOfMetadata: Array<Metadata> = [];
        const handleMetadataIds = this.pluginConfiguration.metadataIds;
        const metadataManager = this.mediaPlayerElement.metadataManager;
        const mainMetadataIds = this.pluginConfiguration.data.mainMetadataIds;
        if (handleMetadataIds === null || handleMetadataIds === undefined) {
            this.managedDataTypes.forEach((type) => {
                const metadata = metadataManager.getMetadataByType(`${type}-${this.pluginInstance}`);
                if (metadata && metadata.length > 0) {
                    listOfMetadata.push(...metadata);
                    if (type === DataType.EXTRAITS_UTILISATEUR) {
                        this.patchExtraitUtilisateur(metadata as any);
                    }
                }
            });
        } else {
            this.logger.info(` Metadata loaded timeline ${handleMetadataIds}`, this.pluginConfiguration);
            // Check if metadata is initialized
            if (metadataManager && handleMetadataIds && Utils.isArrayLike<string>(handleMetadataIds)) {
                handleMetadataIds.forEach((metadataId) => {
                    const metadata = metadataManager.getMetadata(metadataId);
                    if (metadata) {
                        listOfMetadata.push(metadata);
                    }
                });
            }
        }
        this.handleMetadataProperties(listOfMetadata, metadataManager);
        this.restoreFilterState(previousFilterState);

        if (!handleMetadataIds) {
            mainMetadataIds.length = 0;
            listOfMetadata.forEach((metadata) => {
                mainMetadataIds.push(metadata.id);
            });
        }
        this.mainLocalisations = this.createMainMetadataIds(mainMetadataIds, metadataManager);
    }

    patchExtraitUtilisateur(metadata: { label?: string; localisation?: any[]; sublocalisations?: any }[]) {
        const patchLabel = (item: { label?: string; localisation?: any[]; sublocalisations?: any }) => {
            item.label ||= "Extrait sans titre";
            item.localisation?.forEach(patchLabel);
        };
        metadata.forEach(patchLabel);
    }

    checkTcForStock(l: { tcIn: number; tcOut: number }, tcOut: number) {
        if (this.tcIn <= l.tcOut && l.tcOut <= tcOut) {
            return true;
        }
        if (this.tcIn <= l.tcIn && l.tcIn <= tcOut) {
            return true;
        }
        if (l.tcIn <= this.tcIn && this.tcIn <= l.tcOut) {
            return true;
        }
        return false;
    }

    adjustTcsForFlux(listOfLocalisations: { tcIn: number; tcOut: number }[]) {
        if (this.resourceType === "stock") {
            return;
        }
        for (const l of listOfLocalisations) {
            if (!isNaN(l.tcIn)) {
                l.tcIn += this.tcOffset;
            }
            if (!isNaN(l.tcOut)) {
                l.tcOut += this.tcOffset;
            }
        }
    }

    adjustForStock(listOfLocalisations: { tcIn: number; tcOut: number }[]) {
        if (this.resourceType === "stock" && (!isNaN(this.tcIn) || this.durationFromConfig > 0)) {
            const tcOut =
                this.durationFromConfig > 0 ? this.tcIn + this.durationFromConfig : this.tcIn + this.duration();
            return listOfLocalisations.filter((l: { tcIn: number; tcOut: number }) => this.checkTcForStock(l, tcOut));
        }
        return listOfLocalisations;
    }
    private persistedDisplayStateById: Map<string, boolean> = new Map<string, boolean>();
    private persistedBlockOrder: string[] = [];

    private getStableMetadataKey(id: string): string {
        return id.replace(/^([A-Z_]+-)\d+/, "$1");
    }

    private captureFilterState(): { hasState: boolean; displayStateById: Map<string, boolean>; blockOrder: string[] } {
        this.listOfBlocks.forEach((block) => {
            const stableKey = this.getStableMetadataKey(block.id);
            this.persistedDisplayStateById.set(stableKey, block.displayState);
            if (!this.persistedBlockOrder.includes(stableKey)) {
                this.persistedBlockOrder.push(stableKey);
            }
        });
        return {
            hasState: this.nodes.length > 0,
            displayStateById: new Map(this.persistedDisplayStateById),
            blockOrder: [...this.persistedBlockOrder],
        };
    }

    private restoreFilterState(previousState: {
        hasState: boolean;
        displayStateById: Map<string, boolean>;
        blockOrder: string[];
    }) {
        if (!previousState.hasState) {
            // Open all blocks by default when there's no previous state
            this.listOfBlocksIndexes = this.listOfBlocks.map((_, index) => index);
            return;
        }

        this.listOfBlocks.forEach((block) => {
            const stableKey = this.getStableMetadataKey(block.id);
            if (previousState.displayStateById.has(stableKey)) {
                block.displayState = previousState.displayStateById.get(stableKey);
            }
        });

        const blocksByStableKey = new Map<string, TimeLineBlock[]>();
        this.listOfBlocks.forEach((block) => {
            const stableKey = this.getStableMetadataKey(block.id);
            if (!blocksByStableKey.has(stableKey)) {
                blocksByStableKey.set(stableKey, []);
            }
            blocksByStableKey.get(stableKey).push(block);
        });
        const orderedBlocks: TimeLineBlock[] = [];
        previousState.blockOrder.forEach((stableKey) => {
            if (blocksByStableKey.has(stableKey)) {
                orderedBlocks.push(...blocksByStableKey.get(stableKey));
                blocksByStableKey.delete(stableKey);
            }
        });
        blocksByStableKey.forEach((blocks) => orderedBlocks.push(...blocks));
        this.listOfBlocks = orderedBlocks;
        this.listOfBlocksIndexes = orderedBlocks.map((_, index) => index);
        this.mapOfBlocksIndexes = new Map<TimeLineBlock, number>();
        orderedBlocks.forEach((block, index) => this.mapOfBlocksIndexes.set(block, index));

        const allNodes = this.getAllNodes(this.nodes);
        const displayedIds = new Set(this.listOfBlocks.filter((block) => block.displayState).map((block) => block.id));
        const selected = allNodes.filter((node) => !node.children && displayedIds.has(node.key));
        const selectedLeafKeys = new Set(selected.map((node) => node.key));
        this.nodes.forEach((parentNode) => {
            if (
                parentNode.children?.length &&
                parentNode.children.every((child: any) => selectedLeafKeys.has(child.key))
            ) {
                selected.push(parentNode);
            }
        });
        this.selectedNodes.set(selected);
        this.updateTreeComponent();
        // detectChanges conservé (phase 7) : listOfBlocks/listOfBlocksIndexes sont réordonnés
        // en place (références inchangées) — il faut matérialiser synchroniquement l'accordéon
        // et l'arbre reconstruits avant les mesures DOM qui suivent dans le flux d'init
        // (refreshTimeCursor mesure .p-accordion). Non remplaçable par une écriture de signal.
        this.cdr.detectChanges();
    }

    // Handle metadata properties
    handleMetadataProperties(
        listOfMetadata:
            | any[]
            | Map<
                  string,
                  {
                      localisation: {
                          sublocalisations: {
                              localisation: {
                                  data: { text: string[]; attribute: { value: string; name: string; score: number }[] };
                                  type: string;
                                  tcin: string;
                                  tcout: string;
                                  tclevel: number;
                              }[];
                          };
                          type: string;
                          tcin: string;
                          tcout: string;
                          tclevel: number;
                      }[];
                      type: string;
                      label: string;
                      algorithm: string;
                      processor: string;
                      processed: number;
                      version: number;
                      id: string;
                  }
              >,
        metadataManager: any,
    ) {
        this.nodes = [];
        this.listOfBlocks = [];
        this.listOfBlocksIndexes = [];
        this.mapOfBlocksIndexes = new Map<TimeLineBlock, number>();
        this.selectedNodes.update(signal<TreeNode[]>([]));
        this.allNodesChecked = false;

        for (const metadata of listOfMetadata) {
            let listOfLocalisations = null;
            try {
                listOfLocalisations = metadataManager.getTimelineLocalisations(metadata);
                listOfLocalisations = this.adjustForStock(listOfLocalisations);
                this.adjustTcsForFlux(listOfLocalisations);
            } catch (e) {
                this.logger.warn("Error to parse metadata", e);
            }
            if (!listOfLocalisations || listOfLocalisations.length === 0) {
                continue;
            }
            const color = metadata?.viewControl?.color ?? this.getAvailableColor();
            let block: TimeLineBlock = {
                id: metadata.id,
                label: metadata?.label ?? metadata.id,
                expendable: this.pluginConfiguration.data.expendable,
                defaultColor: color,
                displayState: true,
                data: listOfLocalisations,
                icon: this.getNodeLabelAndIcon(metadata).icon,
            };
            this.listOfBlocks.push(block);

            this.listOfBlocksIndexes.push(this.listOfBlocks.length - 1);
            this.mapOfBlocksIndexes.set(block, this.listOfBlocks.length - 1);

            let level1NodeAlreadyAdded: boolean = false;
            for (const node of this.nodes.filter((n: TreeNode) => n.key === metadata.type)) {
                node.children.push(this.getNewChildNodeFromMetadataElement(metadata, color));
                level1NodeAlreadyAdded = true;
            }
            if (!level1NodeAlreadyAdded) {
                let level1Node = this.getNewNodeFromMetadataElement(metadata);
                level1Node.children.push(this.getNewChildNodeFromMetadataElement(metadata, color));
                this.nodes.push(level1Node);
            }
        }
        this.selectedNodes.set(this.getAllNodes(this.nodes));
        this.allNodesChecked = true;
    }

    getNewChildNodeFromMetadataElement = (metadata: any, color: string) => {
        return {
            key: metadata.id,
            label: metadata?.label ?? metadata.id,
            data: { color, spriteIcon: this.getNodeLabelAndIcon(metadata).icon },
            checked: true,
            expanded: true,
        };
    };
    filterHidden: boolean = false;

    /**
     * Handle call
     * @param tc time code
     */
    public callSeek(tc: number) {
        this.mediaPlayerElement.getMediaPlayer().playbackRate = 1;
        this.mediaPlayerElement.getMediaPlayer().setCurrentTime(tc - this.tcOffset);
    }

    /**
     * Return default config
     */
    public getDefaultConfig(): PluginConfigData<TimelineConfig> {
        return {
            name: TimelinePluginComponent.PLUGIN_NAME,
            data: {
                title: "Timeline globale",
                mainBlockColor: null,
                timeFormat: "s",
                expendable: true,
                mainMetadataIds: [],
                resizeable: true,
            },
        };
    }

    /**
     * Init focus
     * @param element focus element
     */
    public initFocusResizable(element: HTMLElement) {
        const container = interact(element);
        container.resizable({
            // resize from all edges and corners
            edges: { left: true, right: true, bottom: false, top: false },
            listeners: {
                move: this.moveElement,
            },
            modifiers: [
                // keep the edges inside the parent
                interact.modifiers.restrictEdges({
                    outer: "parent",
                }),
                // minimum size
                interact.modifiers.restrictSize({
                    min: { width: 33, height: null },
                }),
            ],
            inertia: true,
        });
        container.draggable({
            listeners: {
                move: this.dragElement,
            },
            // keep the element within the area of it's parent
            modifiers: [
                interact.modifiers.restrictRect({
                    restriction: "parent",
                }),
            ],
        });
        container.on("dragend resizeend", this.handleZoomRangeChange.bind(this));
    }

    dragElement(event) {
        const target = event.target;
        // keep the dragged position in the data-x/data-y attributes
        const x = (parseFloat(target.getAttribute("data-x")) || 0) + parseFloat(event.dx);
        const y = parseFloat(target.getAttribute("data-y")) || 0;
        const parentWidth = target.parentElement.clientWidth;
        // update the element's style
        const leftPos = Math.min((x * 100) / parentWidth, 100);
        // translate the element
        target.style.left = leftPos + "%";
        // update the position attributes
        target.setAttribute("data-x", x.toFixed(2));
        target.setAttribute("data-y", y.toFixed(2));
    }

    moveElement(event) {
        const target = event.target;
        let x = parseFloat(target.getAttribute("data-x")) || 0;
        // translate when resizing from top or left edges
        x += event.deltaRect.left;
        const y = parseFloat(target.getAttribute("data-y")) || 0;
        const parentElement = target.parentElement;
        const parentWidth = parentElement.clientWidth;
        const leftPos = Math.min((x * 100) / parentWidth, 100);
        // update the element's style
        target.style.width = Math.min(100, (event.rect.width * 100) / parentWidth) + "%";
        target.style.left = +leftPos + "%";
        target.setAttribute("data-x", x.toFixed(2));
        target.setAttribute("data-y", y.toFixed(2));
    }

    /**
     * In charge to change display state
     * @param mainElement parent element
     */
    public toggleState(mainElement: HTMLElement) {
        if (mainElement.classList.contains("small")) {
            mainElement.classList.remove("small");
        } else {
            mainElement.classList.add("small");
        }
    }

    /**
     * In charge to change display state for all blocks
     * @param mainElement parent element
     * @param stateControl old state
     */
    public toggleAllBlocksState(mainElement: HTMLElement, stateControl: HTMLDivElement) {
        this.blocksIsOpen = !this.blocksIsOpen;
        if (this.blocksIsOpen) {
            stateControl.classList.add("close");
        } else {
            stateControl.classList.remove("close");
        }
        const elementNodes = mainElement.querySelectorAll(".timeline-block");
        elementNodes.forEach((node) => {
            if (this.blocksIsOpen) {
                node.classList.add("small");
            } else {
                node.classList.remove("small");
            }
        });
    }

    /**
     * In charge of save or not display block states
     * @param isValid true for save display block
     */
    public handleDisplayBlocks(isValid: boolean) {
        if (isValid) {
            let nodeAdded: boolean = false;
            this.listOfBlocks.forEach((block, index) => {
                if (block.displayState === false && this.selectedNodesMap().has(block.id)) {
                    //newly selected
                    block.displayState = true;
                    this.listOfBlocksIndexes.push(index);
                    this.mapOfBlocksIndexes.set(block, index);
                    nodeAdded = true;
                }
                block.displayState = this.selectedNodesMap().has(block.id);
            });
            if (nodeAdded) {
                this.listOfBlocksIndexes.sort((a, b) => a - b);
                // detectChanges conservé (phase 7) : le tri mute listOfBlocksIndexes en place
                // (même référence), le [(value)] du p-accordion ne verrait pas le changement
                // sans un passage de CD synchrone.
                this.cdr.detectChanges();
            }
        } else {
            this.selectedNodes.set([]);
            this.selectedNodesBeforeChange.forEach((selectedNodeBeforeChange) => {
                this.selectedNodes().push(selectedNodeBeforeChange);
            });
        }
        this.toggleConfig();
    }

    /**
     * Hides a block
     * @param block block to hide
     */
    removeBlock(block: any) {
        this.listOfBlocks.find((b) => b.id === block.id).displayState = false;
        const allNodes = this.getAllNodes(this.nodes);
        const nodeToRemove = allNodes.find((n) => n.key === block.id);
        this.selectedNodes.set(this.selectedNodes().filter((node) => node.key !== nodeToRemove.key));
        let parentNode = nodeToRemove.parent;
        do {
            parentNode.checked = false;
            let allChildsUnchecked: boolean = true;
            parentNode.children.forEach((child: any) => {
                if (this.listOfBlocks.find((b) => b.id === child.key).displayState === true) {
                    allChildsUnchecked = false;
                }
            });
            parentNode.partialSelected = !allChildsUnchecked;
            this.selectedNodes.set(this.selectedNodes().filter((node) => node.key !== parentNode.key));
            parentNode = parentNode.parent;
        } while (parentNode);
        this.updateTreeComponent();
    }

    /**
     * Invoked time change event for :
     * - update progress bar
     */

    private handleOnTimeChange() {
        this.currentTime = this.mediaPlayerElement.getMediaPlayer().getCurrentTime();
        this.refreshTimeCursor();
    }

    /**
     * Invoked on duration change
     */

    private handleOnDurationChange() {
        this.currentTime = this.mediaPlayerElement.getMediaPlayer().getCurrentTime();
        this.duration.set(this.mediaPlayerElement.getMediaPlayer().getDuration());
        this.focusTcIn.set(this.tcOffset);
        this.focusTcOut.set(this.tcOffset + this.duration());
        this.refreshTimeCursor();
    }

    /**
     * In charge to change focus container
     */

    public handleZoomRangeChange() {
        const focusWidth = this.focusContainer.nativeElement.offsetWidth;
        const leftPos = Math.abs(this.focusContainer.nativeElement.offsetLeft);
        const mainContainerWidth = this.mainBlockContainer.nativeElement.clientWidth;
        const duration = this.duration();
        // Écritures de signals : exécuté hors zone (dragend/resizeend interactjs), la
        // notification de la vue OnPush passe par le scheduler hybride.
        this.focusTcIn.set(this.tcOffset + Math.max((leftPos * duration) / mainContainerWidth, 0));
        this.focusTcOut.set(
            this.tcOffset + Math.min(((leftPos + focusWidth) * duration) / mainContainerWidth, duration),
        );
        this.updateTimeCodePosition();
        this.refreshTimeCursor();
    }

    updateTimeCodePosition() {
        const focusContainer: HTMLElement = this.focusContainer.nativeElement;
        const focusContainerClientRect = focusContainer ? focusContainer.getBoundingClientRect() : null;

        const timeCodeContainer: HTMLElement = this.focusContainer.nativeElement.querySelector(".time-code");
        let timeCodeContainerClientRect = timeCodeContainer ? timeCodeContainer.getBoundingClientRect() : null;

        const startElement: HTMLSpanElement = this.focusContainer.nativeElement.querySelector(".start");
        const startElementClientRect = startElement ? startElement.getBoundingClientRect() : null;

        const middleElement: HTMLSpanElement = this.focusContainer.nativeElement.querySelector(".middle");
        const middleElementClientRect = middleElement ? middleElement.getBoundingClientRect() : null;

        const endElement: HTMLSpanElement = this.focusContainer.nativeElement.querySelector(".end");
        const endElementClientRect = endElement ? endElement.getBoundingClientRect() : null;

        if (
            focusContainerClientRect &&
            startElementClientRect &&
            endElementClientRect &&
            middleElementClientRect &&
            timeCodeContainerClientRect
        ) {
            if (endElementClientRect.left <= startElementClientRect.right + 7) {
                this.displayDashInTimeCode(
                    middleElement,
                    startElementClientRect,
                    timeCodeContainer,
                    endElementClientRect,
                    startElement,
                    endElement,
                    focusContainerClientRect,
                );
            } else {
                middleElement.style.display = "none";
                timeCodeContainer.style.minWidth = "0";
                timeCodeContainer.style.transform = "translateX(0)";
                setTimeout(() => {
                    if (endElementClientRect.left > startElementClientRect.right + 6 + 12 + 12) {
                        startElement.style.left = "12px";
                        endElement.style.right = "12px";
                    }
                }, 100);
            }
        }
    }

    displayDashInTimeCode(
        middleElement: HTMLSpanElement,
        startElementClientRect: DOMRect,
        timeCodeContainer: HTMLElement,
        endElementClientRect: DOMRect,
        startElement: HTMLSpanElement,
        endElement: HTMLSpanElement,
        focusContainerClientRect: DOMRect,
    ) {
        middleElement.style.display = "block";
        middleElement.style.left = `${startElementClientRect.width + 12 + 2}px`;
        timeCodeContainer.style.minWidth = `${12 + startElementClientRect.width + 6 + endElementClientRect.width + 12}px`;
        startElement.style.left = "12px";
        endElement.style.right = "12px";

        setTimeout(() => {
            const timeCodeContainerClientRect = timeCodeContainer.getBoundingClientRect();
            const timeCodeContainerCenter = (timeCodeContainerClientRect.left + timeCodeContainerClientRect.right) / 2;
            const focusContainerCenter = (focusContainerClientRect.left + focusContainerClientRect.right) / 2;
            const offset = focusContainerCenter - timeCodeContainerCenter;
            timeCodeContainer.style.transform = `translateX(${offset}px)`;
            setTimeout(() => {
                const timeCodeContainerClientRect = timeCodeContainer.getBoundingClientRect();
                const mainBlockContainerClientRect = this.mainBlockContainer.nativeElement.getBoundingClientRect();
                if (timeCodeContainerClientRect.left < mainBlockContainerClientRect.left) {
                    const offset = mainBlockContainerClientRect.left - timeCodeContainerClientRect.left;
                    timeCodeContainer.style.transform = `translateX(${offset}px)`;
                }
                if (timeCodeContainerClientRect.right > mainBlockContainerClientRect.right) {
                    const offset = mainBlockContainerClientRect.right - timeCodeContainerClientRect.right;
                    timeCodeContainer.style.transform = `translateX(${offset}px)`;
                }
            }, 100);
        }, 100);
    }

    /**
     * In charge to refresh time cursor
     */
    public refreshTimeCursor(event?: any) {
        if (isFinite(this.currentTime) && isFinite(this.duration())) {
            const selector = ".tc-cursor";
            const mainTimelineWidth = this.mainTimeline.nativeElement.offsetWidth;
            const mainTimelineLeftPosition = this.mainTimeline.nativeElement.offsetLeft;
            const mainBlock: HTMLElement = this.mainBlockContainer.nativeElement.querySelector(selector);
            const listBlock: HTMLElement = this.listOfBlocksContainer.nativeElement.querySelector(selector);
            const listBlockTimeline: HTMLElement = this.listOfBlocksContainer.nativeElement.querySelector(".timeline");
            const listBlocksContainerRect = this.listOfBlocksContainer.nativeElement.getBoundingClientRect();
            const listBlockTimelineRect = listBlockTimeline?.getBoundingClientRect();
            const listBlockTimelineLeftPosition = listBlockTimelineRect
                ? listBlockTimelineRect.left - listBlocksContainerRect.left
                : mainTimelineLeftPosition;
            mainBlock.style.left = `${mainTimelineLeftPosition + (this.currentTime * mainTimelineWidth) / this.duration()}px`;
            mainBlock.style.width = `2px`;
            listBlock.style.left = `${listBlockTimelineLeftPosition + ((this.tcOffset + this.currentTime - this.focusTcIn()) * mainTimelineWidth) / (this.focusTcOut() - this.focusTcIn())}px`;
            const accordion: HTMLElement = this.listOfBlocksContainer.nativeElement.querySelector(".p-accordion");
            const accordionBoundRect = accordion?.getBoundingClientRect();
            listBlock.style.height = `${accordionBoundRect?.height}px`;
            listBlock.style.width = `2px`;
        }
        if (event instanceof Array) {
            this.listOfBlocksIndexes = event;
            this.listOfBlocks.forEach((block: TimeLineBlock, index: number) => {
                if (this.listOfBlocksIndexes.includes(index)) {
                    this.mapOfBlocksIndexes.set(block, index);
                } else {
                    this.mapOfBlocksIndexes.delete(block);
                }
            });
        }
    }
    /**
     * In charge to un-zoom
     */
    public unZoom() {
        const container: HTMLElement = this.focusContainer.nativeElement;
        container.style.left = `0`;
        container.style.width = `100%`;
        container.setAttribute("data-x", "0");
        container.setAttribute("data-y", "0");
        this.handleZoomRangeChange();
    }

    /**
     * Called when metadata loaded
     */

    protected override handleMetadataLoaded() {
        this.parseTimelineMetadata();
    }

    /**
     * In charge to main timeline
     */
    public createMainMetadataIds(handleMetadataIds: string[], metadataManager: MetadataManager) {
        const listOfLocalisations = new Array<TimelineLocalisation>();
        if (handleMetadataIds) {
            this.pluginConfiguration.data.mainMetadataIds.forEach((metadataId) => {
                const metadata = metadataManager.getMetadata(metadataId);
                const blockMetadata: TimeLineBlock = find<TimeLineBlock>(this.listOfBlocks, { id: metadataId });
                if (!blockMetadata) {
                    return;
                }
                const baseColor = metadata?.viewControl?.color
                    ? metadata.viewControl.color
                    : blockMetadata.defaultColor;
                let localisations = null;
                try {
                    localisations =
                        this.resourceType === "stock" && (this.tcIn < 0 || this.durationFromConfig > 0)
                            ? blockMetadata.data
                            : metadataManager.getTimelineLocalisations(metadata);
                    if (localisations) {
                        localisations.forEach((l: TimelineLocalisation) => {
                            l.color = baseColor;
                            listOfLocalisations.push(l);
                        });
                    }
                } catch (e) {
                    this.logger.warn("Error to parse metadata");
                }
            });
        }
        return listOfLocalisations;
    }

    /**
     * On mouse enter on tc bloc
     * @param event event
     * @param localisation localisation
     */
    public handleMouseEnterOnTc(event: Event, localisation: TimelineLocalisation) {
        const defaultMouseMargin = 20;
        const selectedBlockElement = this.selectedBlockElement.nativeElement;
        const currentTarget = event.target as HTMLElement;
        const rect = currentTarget.getBoundingClientRect();
        selectedBlockElement.style.left = `${rect.left}px`;
        selectedBlockElement.style.top = `${rect.top + defaultMouseMargin}px`;
        selectedBlockElement.style.bottom = `auto`;
        selectedBlockElement.style.display = "block";
        selectedBlockElement.style.transform = "none";
        this.selectedBlock = localisation;
        setTimeout(() => {
            const selectedBlockElementBoundRect = selectedBlockElement.getBoundingClientRect();
            const listOfBlocksContainerBoundRect = this.listOfBlocksContainer.nativeElement.getBoundingClientRect();

            if (selectedBlockElementBoundRect.left < listOfBlocksContainerBoundRect.left) {
                const offset = listOfBlocksContainerBoundRect.left - selectedBlockElementBoundRect.left;
                selectedBlockElement.style.transform = `translateX(${offset}px)`;
            }
            if (selectedBlockElementBoundRect.right > listOfBlocksContainerBoundRect.right) {
                const offset = listOfBlocksContainerBoundRect.right - selectedBlockElementBoundRect.right;
                selectedBlockElement.style.transform = `translateX(${offset}px)`;
            }
            const ancestor = Utils.getShadowRoot(this.listOfBlocksContainer);
            if (ancestor) {
                const ancestorBoundRect = ancestor.host.getBoundingClientRect();
                if (selectedBlockElementBoundRect.bottom > ancestorBoundRect.bottom) {
                    const display = selectedBlockElement.style.display;
                    selectedBlockElement.style.display = "none";
                    selectedBlockElement.style.bottom = `${ancestorBoundRect.bottom - rect.top + 16}px`;
                    selectedBlockElement.style.top = `auto`;
                    selectedBlockElement.style.display = display;
                }
            }
        }, 10);
    }

    /**
     * On mouse enter on tc bloc
     * @param $event any
     */
    public handleMouseLeaveOnTc($event: any) {
        this.selectedBlockElement.nativeElement.style.display = "none";
        this.selectedBlock = null;
    }

    /**
     * handle mouse to drawxit
     * @param event mouse event
     */
    handleMouseMoveToDrawRect(event: any) {
        this.updateMouseEvent(event);
    }

    /**
     * Update mouse position
     * @param event mouse event
     */
    updateMouseEvent(event: any) {
        const mainContainer: Element = this.listOfBlocksContainer.nativeElement.offsetParent;
        const targetContainer: HTMLElement = this.listOfBlocksContainer.nativeElement;
        this.selectionPosition.x =
            parseInt(event.clientX, 0) - mainContainer.parentElement.offsetLeft - targetContainer.offsetLeft;
        this.selectionPosition.y =
            parseInt(event.clientY, 0) - mainContainer.parentElement.offsetTop - targetContainer.offsetTop;
    }

    toggleAllNodes() {
        this.allNodesChecked = !this.allNodesChecked;
        this.indeterminate = false;
        if (this.allNodesChecked) {
            this.selectedNodes.set(this.getAllNodes(this.nodes));
        } else {
            this.selectedNodes.set([]);
        }
    }

    /**
     * Gets all the nodes and their children from the given nodes
     * @param nodes nodes
     * @returns all nodes
     */
    getAllNodes(nodes: any[]): any[] {
        let allNodes: any[] = [];
        for (let node of nodes) {
            allNodes.push(node);
            if (node.children) {
                allNodes = allNodes.concat(this.getAllNodes(node.children));
            }
        }
        return allNodes;
    }

    toggleConfig() {
        this.configIsOpen.update((open) => !open);
        if (this.configIsOpen()) {
            this.selectedNodesBeforeChange = [];
            this.selectedNodes().forEach((selectedNode) => {
                this.selectedNodesBeforeChange.push(selectedNode);
            });
        }
    }

    toggleFilter() {
        this.filterHidden = !this.filterHidden;
    }

    startIndex: number;

    onDragStart(index: number) {
        this.startIndex = index;
    }

    onDrop(dropIndex: number) {
        const item = this.listOfBlocks[this.startIndex];
        this.listOfBlocks.splice(this.startIndex, 1);
        this.listOfBlocks.splice(dropIndex, 0, item);
        this.listOfBlocksIndexes = [];
        this.mapOfBlocksIndexes.forEach((_, key) => {
            let indexOfKeyInListOfBlocks = this.listOfBlocks.indexOf(key);
            this.listOfBlocksIndexes.push(indexOfKeyInListOfBlocks);
        });
    }

    updateTreeComponent() {
        // Le setTimeout(10) attend que PrimeNG ait propagé la sélection (ngModel/selectionChange)
        // avant de recalculer checked/partialSelected sur les TreeNode.
        setTimeout(() => {
            this.refreshParentNodesSelectionState();
            // Les TreeNode PrimeNG (checked/partialSelected) sont lus par le template de p-tree
            // et ne sont pas signalisables : on notifie explicitement la CD — markForCheck hors
            // zone programme un tick coalescé via le scheduler hybride, ce qui rend ce timer
            // zoneless-safe (audit setTimeout, catégorie b).
            this.cdr.markForCheck();
        }, 10);
        const nbNodes = this.getAllNodes(this.nodes).length;
        const nbSelectedNodes = this.selectedNodes().length;
        this.allNodesChecked = nbSelectedNodes === nbNodes;
        this.indeterminate = nbSelectedNodes > 0 && nbSelectedNodes < nbNodes;
    }

    /**
     * Recalcule checked/partialSelected de chaque nœud parent à partir de la sélection courante
     * (lookup O(1) via selectedNodesMap, indexée par clé de nœud).
     */
    private refreshParentNodesSelectionState() {
        const selectedNodesByKey = this.selectedNodesMap();
        this.nodes.forEach((parentNode) => {
            const children = parentNode.children ?? [];
            const nbCheckedChildren = children.filter((child: any) => selectedNodesByKey.has(child.key)).length;
            parentNode.checked = nbCheckedChildren === children.length;
            parentNode.partialSelected = nbCheckedChildren > 0 && nbCheckedChildren < children.length;
        });
    }
    /**
     * Export the tv days
     * Sends an event through the mediaPlayerElement eventListener asking for the tv days to be exported
     */
    exportTvDays() {
        this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.TIMELINE_EXPORT_TV_DAYS);
    }
}
