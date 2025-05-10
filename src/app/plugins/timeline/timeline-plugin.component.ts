import { PluginBase } from '../../core/plugin/plugin-base';
import {
    Component,
    computed,
    ElementRef,
    Input,
    OnInit,
    signal,
    ViewChild,
    ViewEncapsulation,
    WritableSignal
} from '@angular/core';
import { PluginConfigData } from '../../core/config/model/plugin-config-data';
import { MediaPlayerService } from '../../service/media-player-service';
import { TimelineConfig } from '../../core/config/model/timeline-config';
import interact from 'interactjs';
import { Options } from 'sortablejs';
import { PlayerEventType } from '../../core/constant/event-type';
import { DataType } from '../../core/constant/data-type';
import { Utils } from '../../core/utils/utils';
import { TimeLineBlock, TimelineLocalisation } from '../../core/metadata/model/timeline-localisation';
import * as _ from 'lodash';
import { Metadata } from '@ina/amalia-model';
import { TreeNode } from 'primeng/api/treenode';
import { MetadataManager } from 'src/app/core/metadata/metadata-manager';

@Component({
    selector: 'amalia-timeline',
    templateUrl: './timeline-plugin.component.html',
    styleUrls: ['./timeline-plugin.component.scss'],
    encapsulation: ViewEncapsulation.ShadowDom
})
export class TimelinePluginComponent extends PluginBase<TimelineConfig> implements OnInit {
    public static PLUGIN_NAME = 'TIMELINE';
    public title: string;
    public mainBlockColor: string;
    public mainLocalisations: Array<TimelineLocalisation>;
    public listOfBlocks: Array<TimeLineBlock>;
    public listOfBlocksIndexes: Array<number> = [];
    public configIsOpen = false;
    public currentTime = 0;
    public duration = 0;
    public tcOffset = 0;
    public focusTcIn = 0;
    public focusTcOut = 0;
    public selectionPosition = {
        x: 0,
        y: 0,
        startX: 0,
        startY: 0
    };
    public isDrawingRectangle = false;
    @Input()
    public colors: Array<string> = [
        '#609af8', '#4cd07d', '#eec137', '#ff6259', '#f06bac', '#8183f4', '#41c5b7', '#fa8e42', '#818ea1', '#b975f9', '#35c4dc',
        '#3b82f6', '#22c55e', '#eab308', '#ff3d32', '#ec4899', '#6366f1', '#14b8a6', '#f97316', '#64748b', '#a855f7', '#06b6d4',
        '#d0e1fd', '#caf1d8', '#faedc4', '#ffd0ce', '#fad3e7', '#dadafc', '#c7eeea', '#feddc7', '#dadee3', '#ead6fd', '#c3edf5',
        '#326fd1', '#1da750', '#c79807', '#d9342b', '#c93d82', '#5457cd', '#119c8d', '#d46213', '#556376', '#8f48d2', '#059bb4',
        '#abc9fb', '#a0e6ba', '#f6de95', '#ffaca7', '#f7b0d3', '#bcbdf9', '#9ae0d9', '#fcc39b', '#bcc3cd', '#dab6fc', '#94e0ed',
        '#295bac', '#188a42', '#a47d06', '#b32b23', '#a5326b', '#4547a9', '#0e8174', '#ae510f', '#465161', '#763cad', '#047f94',
        '#85b2f9', '#76db9b', '#f2d066', '#ff8780', '#f38ec0', '#9ea0f6', '#6dd3c8', '#fba86f', '#9fa9b7', '#c996fa', '#65d2e4',
        '#204887', '#136c34', '#816204', '#8c221c', '#822854', '#363885', '#0b655b', '#893f0c', '#37404c', '#5c2f88', '#036475',
        '#183462', '#0e4f26', '#5e4803', '#661814', '#5e1d3d', '#282960', '#084a42', '#642e09', '#282e38', '#432263', '#024955',];
    @ViewChild('focusContainer', { static: true })
    public focusContainer: ElementRef<HTMLElement>;
    @ViewChild('mainTimeline', { static: true })
    public mainTimeline: ElementRef<HTMLDivElement>;
    @ViewChild('mainBlockContainer', { static: true })
    public mainBlockContainer: ElementRef<HTMLElement>;
    @ViewChild('listOfBlocksContainer', { static: true })
    public listOfBlocksContainer: ElementRef<HTMLElement>;
    @ViewChild('selectedBlockElement', { static: true })
    public selectedBlockElement: any = null;
    @ViewChild('selectionContainer', { static: true })
    public selectionContainer: ElementRef<HTMLElement>;
    public selectedBlock: TimelineLocalisation = null;
    public sortableOptions: Options = {
        handle: '.drag',
        filter: '.filtered',
    };

    /**
     * true for open all block
     */
    private blocksIsOpen = false;
    private lastSelectedColorIdx = -1;
    managedDataTypes = [DataType.SEGMENTATION, DataType.AUDIO_SEGMENTATION, DataType.FACES_RECOGNITION, DataType.DAY_SCHEDULE];

    nodes: TreeNode[] = [];
    selectedNodes: WritableSignal<TreeNode[]> = signal<TreeNode[]>([]);
    selectedNodesMap = computed(() => {
        let result = new Map<string, TreeNode>();
        this.selectedNodes().forEach(selectedNode => {
            result.set(selectedNode.key, selectedNode);
        });
        return result;
    }
    );
    selectedNodesBeforeChange: TreeNode[] = [];
    allNodesChecked: boolean = false;
    showTollbar: boolean = false;
    checkedSyncro: boolean = false;
    enableZoom: boolean = false;
    mouseX: number;
    mouseY: number;
    displaydash: any;

    showToolbar() {
        this.showTollbar = true;
    }
    hideToolbar() {
        this.showTollbar = false;
    }

    constructor(playerService: MediaPlayerService) {
        super(playerService);
        this.pluginName = TimelinePluginComponent.PLUGIN_NAME;
    }

    ngOnInit(): void {
        try {
            super.ngOnInit();
        } catch (e) {
            this.logger.debug("An error occured when initializing the pluging " + this.pluginName, e);
        }
        if (this.mediaPlayerElement && this.mediaPlayerElement.getConfiguration() && this.mediaPlayerElement.getConfiguration().loadMetadataOnDemand) {
            this.init();
            this.handleMetadataLoaded();
            this.handleOnDurationChange();
        }
    }

    getNewNodeFromMetadataElement = (metadata: { type: string; }) => {
        let { level1Label, icon } = this.getNodeLabelAndIcon(metadata);

        let level1Node: TreeNode = (icon === '') ? {
            key: metadata.type,
            label: level1Label,
            children: [],
            checked: true,
            expanded: true
        } : {
            key: metadata.type,
            label: level1Label,
            children: [],
            icon,
            checked: true,
            expanded: true
        };
        return level1Node;
    }

    private getNodeLabelAndIcon(metadata: { type: string; }) {
        let level1Label: string = '';
        let icon: string = undefined;
        const segmentationRegExp = new RegExp(DataType.SEGMENTATION, 'g');
        const facesRecognitionRegExp = new RegExp(DataType.FACES_RECOGNITION, 'g');
        const dayScheduleRegExp = new RegExp(DataType.DAY_SCHEDULE, 'g');

        if (segmentationRegExp.test(metadata.type)) {
            level1Label = metadata.type.replace(new RegExp(DataType.SEGMENTATION, 'g'), 'Segmentation sonore');
            icon = 'pi pi-fw pi-volume-down';
        }
        if (facesRecognitionRegExp.test(metadata.type)) {
            level1Label = metadata.type.replace(new RegExp(DataType.FACES_RECOGNITION, 'g'), 'Reconnaissance faciale');
            icon = 'pi pi-fw pi-eye';
        }
        if (dayScheduleRegExp.test(metadata.type)) {
            level1Label = metadata.type.replace(new RegExp(DataType.DAY_SCHEDULE, 'g'), 'Partie journée de  programme');
            icon = 'pi pi-fw pi-calendar';
        }

        if (level1Label.endsWith('-')) {
            level1Label = level1Label.substring(0, level1Label.length - 1);
        }
        return { level1Label, icon };
    }

    /**
     * Return color color
     */
    private getAvailableColor() {
        this.lastSelectedColorIdx = this.lastSelectedColorIdx + 1 > this.colors.length - 1 ? 0 : this.lastSelectedColorIdx + 1;
        return this.colors[this.lastSelectedColorIdx];
    }


    init() {
        super.init();
        if (this.pluginConfiguration.data) {
            this.timeFormat = this.pluginConfiguration.data.timeFormat || this.getDefaultConfig().data.timeFormat;
        }
        this.title = this.pluginConfiguration.data.title;
        if (this.pluginConfiguration.data.mainBlockColor) {
            this.mainBlockColor = this.pluginConfiguration.data.mainBlockColor;
        }
        this.initFocusResizable(this.focusContainer.nativeElement);
        this.addListener(this.listOfBlocksContainer.nativeElement, PlayerEventType.HTML_ELEMENT_MOUSE_MOVE, this.handleMouseMoveToDrawRect);
        if (this.mediaPlayerElement.isMetadataLoaded) {
            this.parseTimelineMetadata();
            this.handleOnDurationChange();
        }
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.METADATA_LOADED, this.handleMetadataLoaded);
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.TIME_CHANGE, this.handleOnTimeChange);
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.DURATION_CHANGE, this.handleOnDurationChange);
    }

    /**
     * In charge to parse metadata
     */
    parseTimelineMetadata() {
        this.listOfBlocks = [];
        this.listOfBlocksIndexes = [];
        const listOfMetadata: Array<Metadata> = [];
        const handleMetadataIds = this.pluginConfiguration.metadataIds;
        const metadataManager = this.mediaPlayerElement.metadataManager;
        const mainMetadataIds = this.pluginConfiguration.data.mainMetadataIds;
        if (!handleMetadataIds) {
            this.managedDataTypes.forEach((type) => {
                const metadata = metadataManager.getMetadataByType(`${type}-${this.pluginInstance}`);
                if (metadata && metadata.length > 0) {
                    listOfMetadata.push(...metadata);
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

        if (!handleMetadataIds) {
            listOfMetadata.forEach((metadata) => {
                mainMetadataIds.push(metadata.id);
            });
        }
        this.mainLocalisations = this.createMainMetadataIds(mainMetadataIds, metadataManager);
    }

    // Handle metadata properties
    handleMetadataProperties(listOfMetadata: any[] | Map<string, { localisation: { sublocalisations: { localisation: { data: { text: string[]; attribute: { value: string; name: string; score: number; }[]; }; type: string; tcin: string; tcout: string; tclevel: number; }[]; }; type: string; tcin: string; tcout: string; tclevel: number; }[]; type: string; label: string; algorithm: string; processor: string; processed: number; version: number; id: string; }>, metadataManager: any) {
        listOfMetadata.forEach((metadata: any) => {
            let listOfLocalisations = null;
            try {
                listOfLocalisations = metadataManager.getTimelineLocalisations(metadata);
                listOfLocalisations.forEach((l: { tcIn: number; tcOut: number; }) => {
                    if (l.tcIn) {
                        l.tcIn += this.tcOffset;
                    }
                    if (l.tcOut) {
                        l.tcOut += this.tcOffset;
                    }
                });
            } catch (e) {
                this.logger.warn('Error to parse metadata', e);
            }
            const color = (metadata?.viewControl?.color) ?? this.getAvailableColor();
            this.listOfBlocks.push({
                id: metadata.id,
                label: (metadata?.label) ?? metadata.id,
                expendable: this.pluginConfiguration.data.expendable,
                defaultColor: color,
                displayState: true,
                data: listOfLocalisations,
                icon: this.getNodeLabelAndIcon(metadata).icon
            });
            this.listOfBlocksIndexes.push(this.listOfBlocks.length - 1);
            let level1NodeAlreadyAdded: boolean = false;
            this.nodes.forEach(node => {
                if (node.key === metadata.type) {
                    node.children.push(this.getNewChildNodeFromMetadataElement(metadata, color));
                    level1NodeAlreadyAdded = true;
                }
            });
            if (!level1NodeAlreadyAdded) {
                let level1Node = this.getNewNodeFromMetadataElement(metadata);
                level1Node.children.push(this.getNewChildNodeFromMetadataElement(metadata, color));
                this.nodes.push(level1Node);
            }
        });
        this.selectedNodes.set(this.getAllNodes(this.nodes));
        this.allNodesChecked = true;
    }

    getNewChildNodeFromMetadataElement = (metadata: any, color: string) => {
        return {
            key: metadata.id,
            label: (metadata?.label) ?? metadata.id,
            data: { color },
            checked: true,
            expanded: true,
            icon: this.getNodeLabelAndIcon(metadata).icon
        };
    }
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
                title: 'Timeline globale',
                mainBlockColor: null,
                timeFormat: 's',
                expendable: true,
                mainMetadataIds: [],
                resizeable: true
            }
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
                move: (event) => {
                    const target = event.target;
                    let x = (parseFloat(target.getAttribute('data-x')) || 0);
                    // translate when resizing from top or left edges
                    x += event.deltaRect.left;
                    const y = (parseFloat(target.getAttribute('data-y')) || 0);
                    const parentElement = target.parentElement;
                    const parentWidth = parentElement.clientWidth;
                    const leftPos = Math.min(x * 100 / parentWidth, 100);
                    // update the element's style
                    target.style.width = Math.min(100, event.rect.width * 100 / parentWidth) + '%';
                    target.style.left = +leftPos + '%';
                    target.setAttribute('data-x', x.toFixed(2));
                    target.setAttribute('data-y', y.toFixed(2));
                }
            },
            modifiers: [
                // keep the edges inside the parent
                interact.modifiers.restrictEdges({
                    outer: 'parent'
                }),
                // minimum size
                interact.modifiers.restrictSize({
                    min: { width: 10, height: null }
                })
            ],
            inertia: true
        });
        container.draggable({
            listeners: {
                move(event) {
                    const target = event.target;
                    // keep the dragged position in the data-x/data-y attributes
                    const x = (parseFloat(target.getAttribute('data-x')) || 0) + parseFloat(event.dx);
                    const y = (parseFloat(target.getAttribute('data-y')) || 0);
                    const parentWidth = target.parentElement.clientWidth;
                    // update the element's style
                    const leftPos = Math.min(x * 100 / parentWidth, 100);
                    // translate the element
                    target.style.left = leftPos + '%';
                    // update the position attributes
                    target.setAttribute('data-x', x.toFixed(2));
                    target.setAttribute('data-y', y.toFixed(2));
                }
            },
            // keep the element within the area of it's parent
            modifiers: [
                interact.modifiers.restrictRect({
                    restriction: 'parent'
                })
            ],
        });
        container.on('dragend resizeend', this.handleZoomRangeChange.bind(this));
    }

    /**
     * In charge to change display state
     * @param mainElement parent element
     */
    public toggleState(mainElement: HTMLElement) {
        if (mainElement.classList.contains('small')) {
            mainElement.classList.remove('small');
        } else {
            mainElement.classList.add('small');
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
            stateControl.classList.add('close');
        } else {
            stateControl.classList.remove('close');
        }
        const elementNodes = mainElement.querySelectorAll('.timeline-block');
        elementNodes.forEach((node) => {
            if (this.blocksIsOpen) {
                node.classList.add('small');
            } else {
                node.classList.remove('small');
            }
        });
    }

    /**
     * In charge of save or not display block states
     * @param isValid true for save display block
     */
    public handleDisplayBlocks(isValid: boolean) {
        if (isValid) {
            this.listOfBlocks.forEach((block) => {
                block.displayState = this.selectedNodesMap().has(block.id);
            });
        } else {
            this.selectedNodes.set([]);
            this.selectedNodesBeforeChange.forEach(selectedNodeBeforeChange => {
                this.selectedNodes().push(selectedNodeBeforeChange);
            })
        }
        this.toggleConfig();
    }

    /**
     * Hides a block
     * @param block block to hide
     */
    removeBlock(block: any) {
        this.listOfBlocks.find(b => b.id === block.id).displayState = false;
        this.selectedNodes.set(this.getAllNodes(this.nodes).filter(node => node.id !== block.id));
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
        this.duration = this.mediaPlayerElement.getMediaPlayer().getDuration();
        this.focusTcIn = this.tcOffset + this.currentTime;
        this.focusTcOut = this.tcOffset + this.duration;
    }


    /**
     * In charge to change focus container
     */

    public handleZoomRangeChange() {
        const focusWidth = this.focusContainer.nativeElement.offsetWidth;
        const leftPos = Math.abs(this.focusContainer.nativeElement.offsetLeft);
        const mainContainerWidth = this.mainBlockContainer.nativeElement.clientWidth;
        this.focusTcIn = this.tcOffset + Math.max((leftPos * this.duration / mainContainerWidth), 0);
        this.focusTcOut = this.tcOffset + Math.min(((leftPos + focusWidth) * this.duration / mainContainerWidth), this.duration);
        const startElement: HTMLSpanElement = this.focusContainer.nativeElement.querySelector(".start");
        const startElementClientRect = startElement ? startElement.getBoundingClientRect() : null;
        const endElement: HTMLSpanElement = this.focusContainer.nativeElement.querySelector(".end");
        const endElementClientRect = endElement ? endElement.getBoundingClientRect() : null;
        this.displaydash = (endElementClientRect ? endElementClientRect.left <= startElementClientRect.right + 10 : false);
        this.refreshTimeCursor();
    }

    /**
     * In charge to refresh time cursor
     */
    public refreshTimeCursor() {
        if (isFinite(this.currentTime) && isFinite(this.duration)) {
            const selector = '.tc-cursor';
            const mainTimelineWidth = this.mainTimeline.nativeElement.offsetWidth;
            const mainTimelineLeftPosition = this.mainTimeline.nativeElement.offsetLeft;
            const mainBlock: HTMLElement = this.mainBlockContainer.nativeElement.querySelector(selector);
            const listBlock: HTMLElement = this.listOfBlocksContainer.nativeElement.querySelector(selector);
            const listBlockTimeline: HTMLElement = this.listOfBlocksContainer.nativeElement.querySelector('.timeline');
            const listBlockTimelineLeftPosition = listBlockTimeline ? listBlockTimeline.offsetLeft : mainTimelineLeftPosition;
            mainBlock.style.left = `${mainTimelineLeftPosition + (this.currentTime * mainTimelineWidth / this.duration)}px`;
            listBlock.style.left = `${listBlockTimelineLeftPosition + (this.tcOffset + this.currentTime - this.focusTcIn) * mainTimelineWidth / (this.focusTcOut - this.focusTcIn)}px`;
        }
    }

    /**
     * In charge to un-zoom
     */
    public unZoom() {
        const container: HTMLElement = this.focusContainer.nativeElement;
        container.style.left = `0`;
        container.style.width = `100%`;
        container.setAttribute('data-x', '0');
        container.setAttribute('data-y', '0');
        this.handleZoomRangeChange();
    }

    /**
     * Called when metadata loaded
     */

    protected handleMetadataLoaded() {
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
                const blockMetadata: any = _.find<TimeLineBlock>(this.listOfBlocks, { id: metadataId });
                const baseColor = (metadata?.viewControl?.color) ? metadata.viewControl.color : blockMetadata.defaultColor;
                let localisations = null;
                try {
                    localisations = metadataManager.getTimelineLocalisations(metadata);
                    if (localisations) {
                        localisations.forEach((l: TimelineLocalisation) => {
                            l.color = baseColor;
                            listOfLocalisations.push(l);
                        });
                    }
                } catch (e) {
                    this.logger.warn('Error to parse metadata');
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
    public handleMouseEnterOnTc(event: MouseEvent, localisation: TimelineLocalisation) {
        const defaultMouseMargin = 20;
        const selectedBlockElement = this.selectedBlockElement.nativeElement;
        const currentTarget = event.target as HTMLElement;
        selectedBlockElement.style.left = `${currentTarget.offsetLeft}px`;
        selectedBlockElement.style.top = `${currentTarget.parentElement.parentElement.offsetTop + defaultMouseMargin}px`;
        selectedBlockElement.style.display = 'block';
        this.selectedBlock = localisation;

    }

    /**
     * On mouse enter on tc bloc
     * @param $event any
     */
    public handleMouseLeaveOnTc($event: any) {
        this.selectedBlockElement.nativeElement.style.display = 'none';
        this.selectedBlock = null;
    }


    /**
     * handle mouse to drawxit
     * @param event mouse event
     */
    handleMouseMoveToDrawRect(event: MouseEvent) {
        this.updateMouseEvent(event);
    }

    /**
     * Update mouse position
     * @param event mouse event
     */
    updateMouseEvent(event: any) {
        const mainContainer: Element = this.listOfBlocksContainer.nativeElement.offsetParent;
        const targetContainer: HTMLElement = this.listOfBlocksContainer.nativeElement;
        this.selectionPosition.x = parseInt(event.clientX, 0) - mainContainer.parentElement.offsetLeft - targetContainer.offsetLeft;
        this.selectionPosition.y = parseInt(event.clientY, 0) - mainContainer.parentElement.offsetTop - targetContainer.offsetTop;
    }

    filterNodes(event: any) {
        const query = event.target.value.toLowerCase();
        this.nodes.forEach(node => {
            this.filterNode(node, query);
        });
    }

    filterNode(node: TreeNode, query: string): boolean {
        let visible = node.label.toLowerCase().includes(query);
        if (node.children) {
            node.children.forEach(child => {
                visible = this.filterNode(child, query) || visible;
            });
        }
        node.styleClass = visible ? '' : 'hidden-node';
        return visible;
    }


    toggleAllNodes() {
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
        this.configIsOpen = !this.configIsOpen;
        if (this.configIsOpen) {
            this.selectedNodesBeforeChange = [];
            this.selectedNodes().forEach(selectedNode => {
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
    }

}
