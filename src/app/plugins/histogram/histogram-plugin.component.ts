import {PluginBase} from '../../core/plugin/plugin-base';
import {AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {PlayerEventType} from '../../core/constant/event-type';
import {AutoBind} from '../../core/decorator/auto-bind.decorator';
import {PluginConfigData} from '../../core/config/model/plugin-config-data';
import {BaseUtils} from '../../core/utils/base-utils';
import {HistogramConfig} from '../../core/config/model/histogram-config';
import {Utils} from '../../core/utils/utils';
import {Histogram} from '../../core/metadata/model/histogram';
import {MediaPlayerService} from '../../service/media-player-service';
import {HttpClient} from '@angular/common/http';
import {AmaliaException} from '../../core/exception/amalia-exception';
import interact from 'interactjs';
import {DefaultLogger} from "../../core/logger/default-logger";

@Component({
    selector: 'amalia-histogram',
    templateUrl: './histogram-plugin.component.html',
    styleUrls: ['./histogram-plugin.component.scss'],
    encapsulation: ViewEncapsulation.ShadowDom
})
export class HistogramPluginComponent extends PluginBase<HistogramConfig> implements OnInit, AfterViewInit {
    public static PLUGIN_NAME = 'HISTOGRAM';
    public static CURSOR_ELM = 'cursor';
    public static HISTOGRAM_ELM = 'histogram';
    public static ZOOM_HISTOGRAM_ELM = 'zoom-histogram';
    private readonly httpClient: HttpClient;

    /**
     * True when user resize the focus container
     */
    public inResizing = false;
    /**
     * Return  current time
     */
    public currentTime: number;
    /**
     * Media duration
     */
    public duration: number;
    /**
     * Enable focus conteneur
     */
    public withFocus = false;
    /**
     * left slider position
     */
    public sliderPosition = 0;
    /**
     * Zoomed histogram
     */
    public histogramPosition = 0;
    /**
     * zoom size 10% of container width
     */
    public zoomSize = 10;
    /**
     * Min zoom size 10% of container width
     */
    public minZoomSize = 1;
    /**
     * Cursor position
     */
    public cursorPosition = 0;
    /**
     * Cursor zoom position
     */
    public cursorZoomPosition = 0;
    /**
     * list of histograms
     */
    public listOfHistograms: {
        paths: [string, string];
        nbBins: number;
        posMax: number;
        negMax: number;
        viewBox: string;
        label: string,
        zoom: boolean
    }[];
    /**
     * state of hover cursor
     */
    public active = false;

    @ViewChild('sliderElement')
    public sliderElement: ElementRef<HTMLElement>;

    @ViewChild('histograms')
    public histograms: ElementRef<HTMLElement>;
    /**
     * Pinned ControlBar state
     */
    public pinned = false;
    /**
     * Pinned Slider state
     */
    public pinnedControlbar = false;
    /**
     * Mouse Positions
     */
    public position: number;
    /**
     * Plugin display state
     */
    public displayState;

    /**
     * List of histogram drawn
     */
    private histogramsList = [];

    logger: DefaultLogger;


    constructor(httpClient: HttpClient, playerService: MediaPlayerService) {
        super(playerService);
        this.pluginName = HistogramPluginComponent.PLUGIN_NAME;
        this.httpClient = httpClient;
        if (!this.httpClient) {
            throw new AmaliaException('Error to implement http config loader');
        }
    }

    ngOnInit(): void {
        this.logger = new DefaultLogger(`${this.pluginName}`);
        try {
            super.ngOnInit();
            this.mediaPlayerElement.eventEmitter.on(PlayerEventType.PINNED_CONTROLBAR_CHANGE, this.handlePinnedControlbarChange);
        } catch (e) {
            this.logger.debug("An error occured when initializing the pluging " + this.pluginName, e);
        }
        if (this.mediaPlayerElement && this.mediaPlayerElement.getConfiguration() && !this.mediaPlayerElement.getConfiguration().dynamicMetadataPreLoad) {
            this.initWrapperWithoutAutoBind();
        }
    }

    public handleMetaDataLoadedWrapperWithoutAutoBind() {
        this.handleMetadataLoaded();
    }

    ngAfterViewInit(): void {
        if (this.mediaPlayerElement && this.mediaPlayerElement.getConfiguration() && !this.mediaPlayerElement.getConfiguration().dynamicMetadataPreLoad) {
            this.handleMetaDataLoadedWrapperWithoutAutoBind();
        }
    }

    @AutoBind
    init() {
        super.init();
        this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.PLAYER_LOADING_BEGIN);
        this.handleDisplayState();
        this.withFocus = this.pluginConfiguration.data.withFocus;
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.TIME_CHANGE, this.handleOnTimeChange);
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.DURATION_CHANGE, this.handleOnDurationChange);
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.METADATA_LOADED, this.handleMetadataLoaded);
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.PLAYER_RESIZED, this.handleWindowResize);
    }

    /**
     * For the tests purposes
     */
    initWrapperWithoutAutoBind() {
        this.init();
    }

    getDuration = () => {
        return this.mediaPlayerElement.getMediaPlayer().getDuration();
    }

    @AutoBind
    public handlePinnedControlbarChange(event) {
        this.pinnedControlbar = event;
        this.pinned = false;
    }

    @AutoBind
    public handlePinnedSliderChange(event) {
        this.pinned = event;
        this.pinnedControlbar = false;
    }

    /**
     * Handle draw histogram return tuple with positive bins and negative bins
     * In charge to create svg paths
     * @param posBins positive bins
     * @param negBins negative bins
     * @param posMax max positive bin
     * @param negMax max negative bin
     * @param mirror true for enable mirror histogram
     * @param zoom true for enable zoom container
     * @param label histogram label
     */
    public drawHistogram(posBins: string, negBins: string, posMax: number, negMax: number, mirror = false, zoom: boolean, label: string):
            {
                paths: [string, string],
                nbBins: number,
                posMax: number,
                negMax: number,
                viewBox: string,
                label: string,
                zoom: boolean
            } {
        const positiveValues = (posBins && posBins !== '') ? BaseUtils.base64DecToArr(posBins) : null;
        const negativeValues = (negBins && negBins !== '') ? BaseUtils.base64DecToArr(negBins) : null;
        if (positiveValues !== null) {
            const nbBins = Math.max(positiveValues.length, negativeValues != null ? negativeValues.length : 0);
            let itemPositiveValue = null;
            let itemNegativeValue = null;
            let positivePath = ``;
            let negativePath = '';
            for (let posX = 0; posX < nbBins; posX++) {
                itemPositiveValue = positiveValues[posX];
                positivePath += `M${posX},${posMax},L${posX},${posMax - itemPositiveValue}z `;
                if (negativeValues !== null) {
                    itemNegativeValue = negativeValues[posX];
                    negativePath += `M${posX},${posMax},L${posX},${posMax + itemNegativeValue}z `;
                } else if (mirror) {
                    negativePath += `M${posX},${posMax},L${posX},${posMax + itemPositiveValue}z `;
                }
            }
            return {
                paths: [positivePath, negativePath],
                nbBins,
                posMax,
                negMax,
                viewBox: `0 0 ${nbBins} ${Math.round(posMax * 2 + 10)}`,
                label,
                zoom
            };
        }
        return null;
    }


    /**
     * Return default config
     */
    getDefaultConfig(): PluginConfigData<HistogramConfig> {
        return {
            name: HistogramPluginComponent.PLUGIN_NAME,
            data: {
                withFocus: true,
                enableMirror: false,
                zoomMetadataIdx: [],
                labels: [],
                focusMin: 10,
                focusMax: 40,
                focusMinOffset: 10,
                focusMaxOffset: 90
            }
        };
    }

    /**
     * Handle draw histogram
     * @param histograms list of histogram metadata
     * @param labels histogram labels
     * @param zoomMetadataIdx list of index
     */
    private drawHistograms(histograms: Array<Histogram>, labels: Array<string>, zoomMetadataIdx: Array<number>) {
        if (histograms && histograms.length > 0) {
            this.listOfHistograms = new Array<{
                paths: [string, string],
                nbBins: number,
                posMax: number,
                negMax: number,
                viewBox: string,
                label: string,
                zoom: boolean
            }>();
            let index = 0;
            let label = '';
            histograms.forEach((hData) => {
                label = labels && labels.hasOwnProperty(index) ? labels[index] : '';
                const histogram = this.drawHistogram(hData.posbins, hData.negbins, hData.posmax, hData.negmax, this.pluginConfiguration.data.enableMirror,
                        zoomMetadataIdx.includes(index), label);
                if (histogram) {
                    this.listOfHistograms.push(histogram);
                    index++;
                }
            });
        }
    }

    /**
     * Invoked time change event
     */
    @AutoBind
    private handleOnTimeChange() {
        this.currentTime = this.mediaPlayerElement.getMediaPlayer().getCurrentTime();
        if (this.pluginConfiguration.data.focusMaxOffset === null && this.pluginConfiguration.data.focusMinOffset === null) {
            this.slideFocusWithMid(this.currentTime);
        } else {
            this.slideFocus(this.currentTime);
        }
        this.updateCursors(this.currentTime);
    }

    /**
     * Invoked on duration change
     */
    @AutoBind
    private handleOnDurationChange() {
        if (this.mediaPlayerElement.isMetadataLoaded) {
            this.handleMetadataLoaded();
        }
        this.updateTc();
    }

    /**
     * Invoked on metadata loaded
     */
    @AutoBind
    handleMetadataLoaded() {
        const handleMetadataIds = this.pluginConfiguration.metadataIds;
        const zoomMetadataIdx = this.pluginConfiguration.data.zoomMetadataIdx;
        const labels = this.pluginConfiguration.data.labels;
        const metadataManager = this.mediaPlayerElement.metadataManager;
        this.duration = this.getDuration();
        this.logger.info(` Metadata loaded plugin histogram handle metadata ids:  ${handleMetadataIds} ${labels} Zoom:  ${zoomMetadataIdx}`);
        // Check if metadata is initialized
        if (metadataManager && handleMetadataIds && Utils.isArrayLike<string>(handleMetadataIds)) {
            const histoList = metadataManager.getHistograms(handleMetadataIds);
            if (histoList.length > 0) {
                this.histogramsList = histoList;
                this.drawHistograms(this.histogramsList, labels, zoomMetadataIdx);
                this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.PLAYER_LOADING_END);
                if (this.sliderElement && this.pluginConfiguration.data.withFocus) {
                    this.initSliderEvents();
                } else {
                    this.logger.info(`Focus is disabled ...`);
                }
                this.updateTc();
            } else {
                this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.ERROR, 'Les formes d\'ondes n\'ont pas pu ètre chargées');
            }
        }
    }


    /**
     * switch container class based on width
     */
    @AutoBind
    public handleDisplayState() {
        this.displayState = this.mediaPlayerElement.getDisplayState();
    }

    /**
     * update all scales on window resize
     */
    @AutoBind
    public handleWindowResize() {
        this.handleDisplayState();
    }

    /**
     * slider events
     */
    @AutoBind
    public initSliderEvents() {
        const self = this;
        const container = self.sliderElement.nativeElement;
        interact(container).draggable({
            startAxis: 'x',
            lockAxis: 'x',
            modifiers: [
                interact.modifiers.restrictRect({
                    restriction: '.histograms'
                })
            ],
            listeners: {
                start() {
                    self.inResizing = true;
                },
                move(event) {
                    const left = (self.sliderElement.nativeElement.offsetLeft * 100) / self.sliderElement.nativeElement.parentElement.offsetWidth;
                    const dx = Math.max(0, left + event.dx / 10);
                    const containerWidthPercent = event.target.offsetWidth * 100 / self.sliderElement.nativeElement.parentElement.offsetWidth;
                    const moveXPercent = Math.min(dx, 100 - containerWidthPercent);
                    event.target.style.left = `${moveXPercent}%`;
                },
                end() {
                    self.inResizing = false;
                    self.updateTc();
                }
            }
        });

        interact(container).resizable({
            edges: {
                top: false,
                bottom: false,
                right: '.drag-right',
                left: '.drag-left'
            },
            invert: 'reposition',
            modifiers: [
                // keep the edges inside the parent
                interact.modifiers.restrictEdges({
                    outer: 'parent'
                })
            ],
            listeners: {
                start() {
                    self.inResizing = true;
                },
                move(event) {
                    const containerWidth = Math.max(event.rect.width * 100 / self.sliderElement.nativeElement.parentElement.offsetWidth, self.pluginConfiguration.data.focusMin);
                    if (event.deltaRect.right === 0) {
                        const left = (self.sliderElement.nativeElement.offsetLeft * 100) / self.sliderElement.nativeElement.parentElement.offsetWidth;
                        event.target.style.left = `${left - 0.1}%`;
                    }
                    event.target.style.width = `${Math.min((containerWidth), self.pluginConfiguration.data.focusMax)}%`;
                },
                end() {
                    self.inResizing = false;
                    self.updateTc();
                }
            }
        });
    }

    /**
     * In charge to calculate TC with slider
     */
    private updateTc(): void {
        let zTcIn: number;
        let zTcOut: number;
        const duration = this.getDuration();
        const width = this.sliderElement.nativeElement.parentElement.offsetWidth;
        const focusWidth = this.sliderElement.nativeElement.offsetWidth;
        const focusLeft = this.sliderElement.nativeElement.offsetLeft;
        zTcIn = Math.max(focusLeft * duration / width, 0);
        zTcOut = Math.min(zTcIn + (focusWidth * duration / width), duration);
        this.logger.info(`Zoom TcIn:  ${zTcIn} TcOut:  ${zTcOut}`);
        this.updateZoomContainer(zTcIn, zTcOut);
    }

    /**
     * In charge to update zoom container size
     * @param zTcIn start time code
     * @param zTcOut end time code
     */
    private updateZoomContainer(zTcIn: number, zTcOut: number) {
        const histograms = this.histograms.nativeElement.getElementsByClassName(HistogramPluginComponent.ZOOM_HISTOGRAM_ELM);
        if (histograms?.length > 0) {
            const zDuration = zTcOut - zTcIn;
            const duration = this.getDuration();
            const zWidth = duration * 100 / zDuration;
            const zLeft = zTcIn * zWidth / duration;
            for (const elementKey in Object.keys(histograms)) {
                const element: any = histograms.item(Number(elementKey));
                Object.assign(element.dataset, {
                    zTcIn,
                    zTcOut
                });
                Object.assign(element.getElementsByClassName('svg-content')[0].style, {
                    width: `${zWidth}%`,
                    left: `${-zLeft}%`
                });
            }
        }
    }

    /**
     * Update cursor
     * @param tc time code
     */
    private updateCursors(tc: number) {
        const histograms = this.histograms.nativeElement.getElementsByClassName(HistogramPluginComponent.HISTOGRAM_ELM);
        for (const elementKey in Object.keys(histograms)) {
            if (histograms.hasOwnProperty(elementKey)) {
                let tcIn = 0;
                let tcOut = this.getDuration();
                const element: any = histograms.item(Number(elementKey));
                if (element.classList.contains(HistogramPluginComponent.ZOOM_HISTOGRAM_ELM)) {
                    tcIn = (parseFloat(element.dataset.zTcIn) || 0);
                    tcOut = (parseFloat(element.dataset.zTcOut) || 0);
                }
                const leftPos = ((this.currentTime - tcIn) * 100) / (tcOut - tcIn);
                Object.assign(element.getElementsByClassName(HistogramPluginComponent.CURSOR_ELM)[0].style, {
                    left: `${leftPos}%`
                });
            }
        }
    }

    /**
     * Slide with cursor in middle
     * @param tc timecode
     */
    private slideFocusWithMid(tc) {
        if (this.sliderElement && this.inResizing === false) {
            const elm = this.sliderElement.nativeElement;
            const containerWidthPercent = elm.offsetWidth * 100 / elm.parentElement.offsetWidth;
            const leftPercent = tc * 100 / this.getDuration();
            this.sliderElement.nativeElement.style.left = `${Math.min(Math.max(leftPercent - containerWidthPercent / 2, 0), 100 - containerWidthPercent)}%`;
        }
        this.updateTc();
    }

    /**
     * Slide focus container
     * @param tc timecode
     */
    private slideFocus(tc) {
        if (this.sliderElement && this.inResizing === false) {
            const {focusMinOffset, focusMaxOffset} = this.pluginConfiguration.data;
            const elm = this.sliderElement.nativeElement;
            const containerWidthPercent = (elm.offsetWidth * 100 / elm.parentElement.offsetWidth) * (focusMaxOffset / 100);
            const tcLeftPercent = tc * 100 / this.getDuration();
            const posLeft = (elm.offsetLeft * 100) / elm.parentElement.offsetWidth;
            const start = posLeft + (containerWidthPercent * (focusMinOffset / 100));
            const end = posLeft + containerWidthPercent;
            if (tcLeftPercent > start && tcLeftPercent > end) {
                this.sliderElement.nativeElement.style.left = `${Math.min(Math.max(tcLeftPercent - 1, 0), 100 - containerWidthPercent)}%`;
            }
            this.updateTc();
        }
    }

    /**
     * Handle on click to histogram
     * @param event mouse event
     */
    public handleHistogramClick(event) {
        const tcIn = (parseFloat(event.currentTarget.dataset.zTcIn) || 0);
        const tcOut = (parseFloat(event.currentTarget.dataset.zTcOut) || this.getDuration());
        const duration = tcOut - tcIn;
        const width = event.currentTarget.offsetWidth;
        const tc = Math.min(tcIn + (event.clientX * duration / width), this.getDuration());
        this.mediaPlayerElement.getMediaPlayer().setCurrentTime(tc);
    }
}
