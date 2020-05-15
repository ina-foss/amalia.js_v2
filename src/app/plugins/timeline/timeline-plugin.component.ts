import {PluginBase} from '../../core/plugin/plugin-base';
import {Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {AutoBind} from '../../core/decorator/auto-bind.decorator';
import {PluginConfigData} from '../../core/config/model/plugin-config-data';
import {MediaPlayerService} from '../../service/media-player-service';
import {TimelineConfig} from '../../core/config/model/timeline-config';
import interact from 'interactjs';
import {Options} from 'sortablejs';
import {PlayerEventType} from '../../core/constant/event-type';
import {isArrayLike} from 'rxjs/internal-compatibility';
import {TimelineLocalisation} from '../../core/metadata/model/timeline-localisation';

@Component({
    selector: 'amalia-timeline',
    templateUrl: './timeline-plugin.component.html',
    styleUrls: ['./timeline-plugin.component.scss'],
    encapsulation: ViewEncapsulation.ShadowDom
})
export class TimelinePluginComponent extends PluginBase<TimelineConfig> implements OnInit {
    public static PLUGIN_NAME = 'TIMELINE';
    public title: string;
    public mainLocalisations: Array<TimelineLocalisation>;
    public listOfBlocks: Array<{ id?: string, label?: string, expendable: boolean, defaultColor?: string, displayState: boolean, data: Array<TimelineLocalisation> }>;
    public enableDragDrop = false;
    public configIsOpen = false;
    public currentTime = 0;
    public duration = 0;
    public tcOffset = 0;
    public focusTcIn = 0;
    public focusTcOut = 0;
    @Input()
    public colors: Array<string> = [
        '#1ABC9C', '#f1c40e', '#95A5A6', '#2ECC71',
        '#E67E21', '#34495E', '#3498DB', '#D8D8D8',
        '#E74C3C', '#F35CF2', '#8E44AD'
    ];
    @ViewChild('focusContainer', {static: true})
    public focusContainer: ElementRef<HTMLElement>;
    @ViewChild('mainBlockContainer', {static: true})
    public mainBlockContainer: ElementRef<HTMLElement>;
    @ViewChild('listOfBlocksContainer', {static: true})
    public listOfBlocksContainer: ElementRef<HTMLElement>;
    public sortableOptions: Options = {
        handle: '.drag',
        filter: '.filtered',
    };
    /**
     * true for open all block
     */
    private blocksIsOpen = false;
    private lastSelectedColorIdx = -1;
    private blocksDisplayStates: Map<string, boolean> = new Map<string, boolean>();

    constructor(playerService: MediaPlayerService) {
        super(playerService, TimelinePluginComponent.PLUGIN_NAME);
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    /**
     * Return color color
     */
    private getAvailableColor() {
        this.lastSelectedColorIdx = this.lastSelectedColorIdx + 1 > this.colors.length - 1 ? 0 : this.lastSelectedColorIdx + 1;
        return this.colors[this.lastSelectedColorIdx];
    }

    @AutoBind
    init() {
        super.init();
        if (this.pluginConfiguration.data) {
            this.timeFormat = this.pluginConfiguration.data.timeFormat || this.getDefaultConfig().data.timeFormat;
        }
        this.title = this.pluginConfiguration.data.title;
        this.initFocusResizable(this.focusContainer.nativeElement);
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.METADATA_LOADED, this.handleMetadataLoaded);
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.TIME_CHANGE, this.handleOnTimeChange);
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.DURATION_CHANGE, this.handleOnDurationChange);
    }

    /**
     * Handle call
     * @param tc time code
     */
    public callSeek(tc: number) {
        this.mediaPlayerElement.getMediaPlayer().setCurrentTime(tc);
    }

    /**
     * Return default config
     */
    public getDefaultConfig(): PluginConfigData<TimelineConfig> {
        return {
            name: TimelinePluginComponent.PLUGIN_NAME,
            data: {
                title: 'Timeline globale',
                timeFormat: 'mms',
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
            edges: {left: true, right: true, bottom: false, top: false},
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
                    min: {width: 10, height: null}
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
        container.on('dragend resizeend', this.handleZoomRangeChange);
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
        console.log(mainElement.classList);
    }

    /**
     * In charge to change display state for all blocks
     * @param mainElement parent element
     * @param stateControl old state
     */
    public toggleAllBlocksState(mainElement: HTMLElement, stateControl) {
        this.blocksIsOpen = !this.blocksIsOpen;
        if (this.blocksIsOpen) {
            stateControl.classList.add('close');
        } else {
            stateControl.classList.remove('close');
        }
        const elementNodes = mainElement.querySelectorAll('.block');
        elementNodes.forEach((node) => {
            if (this.blocksIsOpen) {
                node.classList.add('small');
            } else {
                node.classList.remove('small');
            }
        });
    }

    /**
     * In charge to store display state change change display state
     */
    public changeDisplayState(event: MouseEvent, block: {
        id?: string, label?: string, expendable: boolean,
        defaultColor?: string, displayState: boolean, data: Array<TimelineLocalisation>
    }) {
        const displayState = (event.target as HTMLInputElement).checked;
        this.blocksDisplayStates.set(block.id, displayState);
    }

    /**
     * In charge of save or not display block states
     * @param isValid true for save display block
     */
    public handleDisplayBlocks(isValid) {
        if (isValid) {
            this.listOfBlocks.forEach((block) => {
                if (this.blocksDisplayStates && this.blocksDisplayStates.has(block.id)) {
                    block.displayState = this.blocksDisplayStates.get(block.id);
                }
            });
        }
        this.blocksDisplayStates.clear();
        this.configIsOpen = false;
    }

    /**
     * Invoked time change event for :
     * - update progress bar
     */
    @AutoBind
    private handleOnTimeChange() {
        this.currentTime = this.mediaPlayerElement.getMediaPlayer().getCurrentTime();
        this.refreshTimeCursor();
    }

    /**
     * Invoked on duration change
     */
    @AutoBind
    private handleOnDurationChange() {
        this.currentTime = this.mediaPlayerElement.getMediaPlayer().getCurrentTime();
        this.duration = this.mediaPlayerElement.getMediaPlayer().getDuration();
        this.focusTcIn = this.tcOffset + this.currentTime;
        this.focusTcOut = this.tcOffset + this.duration;
    }

    @AutoBind
    public handleZoomRangeChange() {
        const mainContainerWidth = this.mainBlockContainer.nativeElement.clientWidth;
        const focusWidth = this.focusContainer.nativeElement.offsetWidth;
        const leftPos = Math.abs(this.focusContainer.nativeElement.offsetLeft);
        this.focusTcIn = this.tcOffset + (leftPos * this.duration / mainContainerWidth);
        this.focusTcOut = this.tcOffset + ((leftPos + focusWidth) * this.duration / mainContainerWidth);
        this.refreshTimeCursor();
    }

    /**
     * In charge to refresh time cursor
     */
    public refreshTimeCursor() {
        if (isFinite(this.currentTime) && isFinite(this.duration)) {
            const selector = '.tc-cursor';
            const focusLeftPos = (this.currentTime - this.focusTcIn) * 100 / (this.focusTcOut - this.focusTcIn);
            (this.mainBlockContainer.nativeElement.querySelector(selector) as HTMLElement).style.left = `${this.currentTime * 100 / this.duration}%`;
            (this.listOfBlocksContainer.nativeElement.querySelector(selector) as HTMLElement).style.left = `${focusLeftPos}%`;
        }
    }

    /**
     * In charge to un-zoom
     */
    public unZoom() {
        const container = (this.focusContainer.nativeElement as HTMLElement);
        container.style.left = `0`;
        container.style.width = `100%`;
        container.setAttribute('data-x', '0');
        container.setAttribute('data-y', '0');
        this.handleZoomRangeChange();
    }

    /**
     * Called when metadata loaded
     */
    @AutoBind
    public handleMetadataLoaded() {
        this.listOfBlocks = [];
        const handleMetadataIds = this.pluginConfiguration.metadataIds;
        const metadataManager = this.mediaPlayerElement.metadataManager;
        this.mainLocalisations = this.createMainMetadataIds(this.pluginConfiguration.data.mainMetadataIds, metadataManager);
        this.logger.info(` Metadata loaded transcription ${handleMetadataIds}`, this.pluginConfiguration);
        // Check if metadata is initialized
        if (metadataManager && handleMetadataIds && isArrayLike<string>(handleMetadataIds)) {
            handleMetadataIds.forEach((metadataId) => {
                let listOfLocalisations = null;
                try {
                    listOfLocalisations = metadataManager.getTimelineLocalisations(metadataId);
                } catch (e) {
                    this.logger.warn('Error to parse metadata');
                }
                this.listOfBlocks.push({
                    id: metadataId,
                    label: metadataId,
                    expendable: this.pluginConfiguration.data.expendable,
                    defaultColor: this.getAvailableColor(),
                    displayState: true,
                    data: listOfLocalisations
                });
            });
        }
    }

    /**
     * In charge to main timeline
     */
    public createMainMetadataIds(handleMetadataIds, metadataManager) {
        const listOfLocalisations = new Array<TimelineLocalisation>();
        if (handleMetadataIds) {
            this.pluginConfiguration.data.mainMetadataIds.forEach((metadataId) => {
                let localisations = null;
                try {
                    localisations = metadataManager.getTimelineLocalisations(metadataId);
                    if (localisations) {
                        listOfLocalisations.push(...localisations);
                    }
                } catch (e) {
                    this.logger.warn('Error to parse metadata');
                }
            });
        }
        return listOfLocalisations;
    }
}
