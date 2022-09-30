import {PluginBase} from '../../core/plugin/plugin-base';
import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {PlayerEventType} from '../../core/constant/event-type';
import {AutoBind} from '../../core/decorator/auto-bind.decorator';
import {PluginConfigData} from '../../core/config/model/plugin-config-data';
import {BaseUtils} from '../../core/utils/base-utils';
import {HistogramConfig} from '../../core/config/model/histogram-config';
import {isArrayLike} from 'rxjs/internal-compatibility';
import {Histogram} from '../../core/metadata/model/histogram';
import {MediaPlayerService} from '../../service/media-player-service';
import {HttpClient} from '@angular/common/http';
import {AmaliaException} from '../../core/exception/amalia-exception';
import {LABEL} from '../../core/constant/labels';
import interact from 'interactjs';

@Component({
    selector: 'amalia-histogram',
    templateUrl: './histogram-plugin.component.html',
    styleUrls: ['./histogram-plugin.component.scss'],
    encapsulation: ViewEncapsulation.ShadowDom
})
export class HistogramPluginComponent extends PluginBase<HistogramConfig> implements OnInit {
    public static PLUGIN_NAME = 'HISTOGRAM';
    private readonly httpClient: HttpClient;
    constructor(httpClient: HttpClient, playerService: MediaPlayerService) {
        super(playerService, HistogramPluginComponent.PLUGIN_NAME);
        this.httpClient = httpClient;
        if (!this.httpClient) {
            throw new AmaliaException('Error to implement http config loader');
        }
    }
     /**
      * state of video
      */
    public isplaying: boolean;
    /**
     * Return  current time
     */
    public currentTime: number;
    /**
     * Media duration
     */
    public duration: number;
    /**
     * Enable focus container
     */
    public withFocus = false;
    /**
     * left slider position
     */
    public sliderPosition = 0;
    /**
     * Zoomed histogram histogram
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
    public listOfHistograms: Array< { paths: [string, string], nbBins: number, posMax: number, negMax: number, scale: [string, string] } > ;
    /**
     * state of hover cursor
     */
    public active = false;
    /**
     * state of histograms
     */
    public moving = false;
    /**
     * html element histogramContainer
     */
    @ViewChild('histogramContainer')
    public histogramContainerElement: ElementRef<HTMLElement>;
    @ViewChild('slider')
    public sliderElement: ElementRef<HTMLElement>;
    @ViewChild('histograms')
    public histograms: ElementRef<HTMLElement>;
    @ViewChild('zoomedHistograms')
    public zoomedHistograms: ElementRef<HTMLElement>;
    /**
     * Mouse Positions
     */
    public position: number;
    public zoomedWidth;
    public style = 'translate('  + this.sliderPosition + 'px)';
    public label;
    /**
     * Plugin display state
     */
    public displayState;

    /**
     * List of histogram drawn
     */
    private histogramsList = [];
    /**
     * Handle draw histogram return tuple with positive bins and negative bins
     * In charge to create svg paths
     * @param posBins positive bins
     * @param negBins negative bins
     * @param posMax max positive bin
     * @param negMax max negative bin
     * @param mirror true for enable mirror histogram
     */
    public drawHistogram(nbBins: number , posBins: string, negBins: string, posMax: number, negMax: number, mirror = false, zoomed, label?):
        { paths: [string, string], nbBins: number,  posMax: number, negMax: number, scale: [string, string], label?: string } {
        const positiveValues = (posBins && posBins !== '') ? BaseUtils.base64DecToArr(posBins) : null;
        const negativeValues = (negBins && negBins !== '') ? BaseUtils.base64DecToArr(negBins) : null;
        if (positiveValues !== null) {
            if (typeof(nbBins) === 'undefined') {
                nbBins = positiveValues.length;
            }
            // const nbBins = positiveValues.length;
            let itemPositiveValue = null;
            let itemNegativeValue = null;
            let positivePath = '';
            let negativePath = '';
            for (let i = 0; i < nbBins; i++) {
                itemPositiveValue = positiveValues[i];
                positivePath += 'M' + i + ' ' + posMax + 'l 0 -' + itemPositiveValue;
                if (negativeValues !== null) {
                    itemNegativeValue = negativeValues[i];
                    negativePath += 'M' + i + ' ' + negMax + 'l 0 ' + itemNegativeValue;
                } else if (mirror) {
                    negativePath += 'M' + i + ' ' + posMax + 'l 0 ' + itemPositiveValue;
                }
            }
            let containerWidth = this.histogramContainerElement.nativeElement.offsetWidth;
            // 50% of the svg height
            let height = this.histograms.nativeElement.offsetHeight / 4;
            if (zoomed === true) {
                containerWidth = Math.round(this.getZoomedWidth(containerWidth, this.zoomSize));
                this.zoomedWidth = containerWidth;
                // 50% of the svg height
                height = this.zoomedHistograms.nativeElement.offsetHeight / 4;
            }
            const scaleX = containerWidth / nbBins;
            // 70 = 50% of the svg height
            const posScaleY  = height / posMax;
            const negScaleY = height / negMax;
            const positiveScale = 'matrix(' + scaleX + ',0,0,' + posScaleY + ',0,0)';
            const negativeScale = 'matrix(' + scaleX + ',0,0,' + negScaleY + ',0,0)';
            return {paths: [positivePath, negativePath], nbBins, posMax, negMax, scale: [positiveScale, negativeScale], label};

        }
        return null;
    }
    ngOnInit(): void {
        super.ngOnInit();
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
     * Return default config
     */
    getDefaultConfig(): PluginConfigData<HistogramConfig> {
        return {
            name: HistogramPluginComponent.PLUGIN_NAME,
            data: {withFocus: true, enableMirror: true}
        };
    }
    /**
     * Handle draw histogram
     * @param histograms list of histogram metadata
     */
    private drawHistograms(histograms: Array<Histogram>) {
        let zoomed = false;
        if (histograms && histograms.length > 0) {
            this.listOfHistograms = new Array<{ paths: [string, string], nbBins: number, posMax: number, negMax: number, scale: [string, string]}>();
            let index = 0;
            histograms.forEach((hData) => {
                const nbbins = Number(hData.nbbins);
                if (index > 1) {
                    zoomed = true;
                }
                this.setLabel(index);
                if (!(zoomed && this.displayState === 'sm')) {
                    const histogram = this.drawHistogram(nbbins, hData.posbins, hData.negbins, hData.posmax, hData.negmax, this.pluginConfiguration.data.enableMirror,
                    zoomed , this.label);
                    if (histogram) {
                        this.listOfHistograms.push(histogram);
                        index++;
                    }
                }
            });
        }
    }
    // Set label
    private setLabel(index) {
        if (index % 2 === 0) {
            this.label = LABEL.LEFT_CANAL;
        } else {
            this.label = LABEL.RIGHT_CANAL;
        }
    }
    /**
     * Invoked time change event
     */
    @AutoBind
    private handleOnTimeChange() {
        this.currentTime = this.mediaPlayerElement.getMediaPlayer().getCurrentTime();
        this.handleCursorMove(this.currentTime);
    }
    /**
     * Invoked cursor move event
     */
    @AutoBind
    private handleCursorMove(currentTime) {
        const duration = this.mediaPlayerElement.getMediaPlayer().getDuration();
        const ratio = ((duration * this.zoomSize) / 100) / 2;
        // when media is stopped
        if (currentTime === 0) {
            this.initializeCursors();
        }
        if (currentTime <= ratio) {
            this.updateTimeCursors(currentTime, ratio, true);
        } else if (currentTime >= duration -  ratio) {
            this.updateCursors(currentTime);
            this.updateTimeCursors(currentTime, ratio, false);
        } else if  (currentTime >= ratio && currentTime <= duration - ratio) {
            this.updateCursors(currentTime);
            this.cursorPosition = 50;
            this.cursorZoomPosition = 50;
        }
    }
    @AutoBind
    public handleHistogramsClick(event) {
        if (this.moving === false) {
            const duration = this.mediaPlayerElement.getMediaPlayer().getDuration();
            const currentTime =  ((event.clientX / this.histograms.nativeElement.offsetWidth) * duration);
            this.mediaPlayerElement.getMediaPlayer().setCurrentTime(currentTime);
        } else {
            this.moving = false;
        }
    }
    /**
     * Initialize cursors
     */
    @AutoBind
    public initializeCursors() {
        this.sliderPosition = 0;
        this.style = 'translate('  + this.sliderPosition + 'px)';
        this.cursorPosition = 0;
        this.cursorZoomPosition = 0;
        this.histogramPosition = 0;
    }
    /**
     * update time cursor
     */
    @AutoBind
    public updateTimeCursors(currentTime,  ratio, start) {
        let tcout;
        let tcin;
        const duration  =  this.mediaPlayerElement.getMediaPlayer().getDuration();
        if (start === true) {
            tcin = 0;
            tcout = (this.zoomSize * duration) / 100;
            this.histogramPosition = 0;
            this.sliderPosition = 0;
        } else {
            tcin = (duration - ratio * 2);
            tcout = duration;
        }
        const position = ((currentTime - tcin) * 100) / (tcout - tcin);
        this.cursorPosition = position;
        this.cursorZoomPosition = position;
    }
    /**
     * update slider position
     */
    @AutoBind
    public updateCursors(currentTime)  {
        let zoomedWidth;
        let containerWidth;
        if (document.fullscreenElement === null) {
            containerWidth = this.histogramContainerElement.nativeElement.offsetWidth;
            zoomedWidth = Math.round(this.getZoomedWidth(containerWidth, this.zoomSize));
        } else {
            containerWidth = window.outerWidth;
            zoomedWidth = Math.round(this.getZoomedWidth(containerWidth, this.zoomSize));
        }
        const duration = this.mediaPlayerElement.getMediaPlayer().getDuration();
        const time  =  currentTime - (((this.zoomSize / 2) * duration) / 100);
        let position =  ((time) * 100) / duration;
        const maxPosition = (100 - this.zoomSize);

        let zoomPosition;
        let  negativeLeft;
        if (position < maxPosition && (currentTime < duration && currentTime > 0)) {
            zoomPosition = (position * zoomedWidth) / 100;
            negativeLeft = '-' + zoomPosition;
            this.sliderPosition = Math.round((position * containerWidth) / 100);
            this.histogramPosition = negativeLeft;
        } else if (position >= maxPosition && (currentTime <= duration && currentTime > 0)) {
            zoomPosition = (maxPosition * zoomedWidth) /  100;
            negativeLeft = '-' + zoomPosition;
            const tcin = duration - ((this.zoomSize * duration) /  100);
            position =  ((currentTime - tcin) * 100) / (duration - tcin);
            this.cursorPosition = position;
            this.cursorZoomPosition = position;
            this.sliderPosition = Math.round((maxPosition  * containerWidth) / 100);
            this.histogramPosition = negativeLeft;
        }
        this.style = 'translate('  + this.sliderPosition + 'px)';
    }
    /**
     * return zoomed svg Width
     */
    private getZoomedWidth(width, zoom) {
        const duration = this.mediaPlayerElement.getMediaPlayer().getDuration();
        const zoomValue = (duration * zoom) / 100;
        const zoomedWidth =  width * (duration / zoomValue);
        return zoomedWidth;
    }
    /**
     * Invoked on duration change
     */
    @AutoBind
    private handleOnDurationChange() {
        if (this.mediaPlayerElement.isMetadataLoaded) {
            this.handleMetadataLoaded();
        }
    }
    /**
     * Invoked on metadata loaded
     */
    @AutoBind
    private handleMetadataLoaded() {
        const handleMetadataIds = this.pluginConfiguration.metadataIds;
        const metadataManager = this.mediaPlayerElement.metadataManager;
        this.duration = this.mediaPlayerElement.getMediaPlayer().getDuration();
        this.logger.info(` Metadata loaded plugin histogram handle metadata ids:  ${handleMetadataIds}`);
        // Check if metadata is initialized
        if (metadataManager && handleMetadataIds && isArrayLike<string>(handleMetadataIds)) {
            if (metadataManager.getHistograms(handleMetadataIds).length > 0) {
                this.histogramsList = metadataManager.getHistograms(handleMetadataIds);
                this.drawHistograms(this.histogramsList);
                this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.PLAYER_LOADING_END);
                this.initSliderEvents();
            } else {
                // this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.ERROR, 'Les formes d\'ondes n\'ont pas pu ètre chargées');
            }
        }
    }
    /**
     * slider events
     */
    @AutoBind
    public initSliderEvents() {
        const position = {x: this.sliderPosition};
        const self = this;
        const duration = self.mediaPlayerElement.getMediaPlayer().getDuration();
        const container = self.sliderElement.nativeElement;
        interact(container).draggable({
            modifiers: [
                interact.modifiers.restrictRect({
                    restriction: '.histograms'
                })
            ],
            listeners: {
                start() {
                    position.x = self.sliderPosition;
                    //  store the state of the player when  drag
                    if (self.mediaPlayerElement.getMediaPlayer().isPaused() === false && typeof(self.isplaying) !== 'undefined') {
                        self.isplaying = true;
                        self.mediaPlayerElement.getMediaPlayer().pause();
                    } else {
                        self.isplaying = false;
                    }
                },
                move(event) {
                    position.x += event.dx;
                    event.target.style.transform = 'translate(' + position.x + 'px)';
                    event.target.setAttribute('data-x', position.x);
                    // 4 = border width
                    const left = position.x;
                    const width = self.sliderElement.nativeElement.offsetWidth;
                    const pos = ((left + width / 2 + 4) / self.histogramContainerElement.nativeElement.offsetWidth) * 100;
                    let currentTime = (duration * pos) / 100;
                    currentTime = parseFloat(currentTime.toFixed(2));
                    self.handleCursorMove(currentTime);
                    self.mediaPlayerElement.getMediaPlayer().setCurrentTime(currentTime);
                },
                end() {
                    if (self.isplaying === true) {
                        self.mediaPlayerElement.getMediaPlayer().play();
                    }
                    // reset
                    self.isplaying = null;
                    self.moving = true;
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
            modifiers: [
                // keep the edges inside the parent
                interact.modifiers.restrictEdges({
                    outer: 'parent'
                }),
            ],
            listeners: {
                move(event) {
                    self.moving = true;
                    const target = event.target;
                    let x = (parseFloat(target.getAttribute('data-x')) || 0);
                    // update the element's style
                    target.style.width = event.rect.width + 'px';
                    // translate when resizing from left
                    x += event.deltaRect.left;
                    target.style.transform = 'translate(' + x + 'px)';
                    target.setAttribute('data-x', x);
                },
                end(event) {
                    self.moving = true;
                    const containerWidth = self.histogramContainerElement.nativeElement.offsetWidth;
                    const zoomSize = (event.rect.width / containerWidth ) * 100;
                    const x = event.target.getAttribute('data-x');
                    self.zoomSize = Math.round(zoomSize);
                    self.zoomedWidth = self.getZoomedWidth(containerWidth, self.zoomSize);
                    const currentTime = parseFloat((((x + event) * duration) / containerWidth).toFixed(2));
                    if (isFinite(currentTime)) {
                        // self.handleCursorMove(currentTime);
                        self.mediaPlayerElement.getMediaPlayer().setCurrentTime(currentTime);
                        self.updateZoomedSvg(true);
                    }
                },
            }
        });
    }

    /**
     * update scale of zoomed svg on zoom resize
     */
    @AutoBind
    public updateZoomedSvg(onlyResized) {
        let height;
        // resize all SVG
        if (onlyResized === false) {
            const containerWidth = this.histogramContainerElement.nativeElement.offsetWidth;
            this.zoomedWidth =  this.getZoomedWidth(containerWidth, this.zoomSize);
            const scX = containerWidth / this.listOfHistograms[0].nbBins;
            height = this.histograms.nativeElement.offsetHeight / 4;
            const posScY  = height / this.listOfHistograms[0].posMax;
            const negScY = height / this.listOfHistograms[0].negMax;
            const posScale = 'matrix(' + scX + ',0,0,' + posScY + ',0,0)';
            const negScale = 'matrix(' + scX + ',0,0,' + negScY + ',0,0)';
            if (this.listOfHistograms[0].posMax === this.listOfHistograms[1].posMax) {
                this.listOfHistograms[0].scale = [posScale, negScale];
                this.listOfHistograms[1].scale = [posScale, negScale];
            } else {
                const scX2 = containerWidth / this.listOfHistograms[1].nbBins;
                const posSc2  = height / this.listOfHistograms[1].posMax;
                const negSc2 = height / this.listOfHistograms[1].negMax;
                const posScale2 = 'matrix(' + scX2 + ',0,0,' + posSc2 + ',0,0)';
                const negScale2 = 'matrix(' + scX2 + ',0,0,' + negSc2 + ',0,0)';
                this.listOfHistograms[0].scale = [posScale, negScale];
                this.listOfHistograms[1].scale = [posScale2, negScale2];
            }
        }
        // resize only zoomed SVG
        const scaleX = this.zoomedWidth / this.listOfHistograms[2].nbBins;
        height = this.zoomedHistograms.nativeElement.offsetHeight / 4;
        const posScaleY  = height / this.listOfHistograms[2].posMax;
        const negScaleY = height / this.listOfHistograms[2].negMax;
        const positiveScale = 'matrix(' + scaleX + ',0,0,' + posScaleY + ',0,0)';
        const negativeScale = 'matrix(' + scaleX + ',0,0,' + negScaleY + ',0,0)';
        if (this.listOfHistograms[2].posMax === this.listOfHistograms[3].posMax) {
            this.listOfHistograms[2].scale = [positiveScale, negativeScale];
            this.listOfHistograms[3].scale = [positiveScale, negativeScale];
        } else {
            const scaleX2 = this.zoomedWidth / this.listOfHistograms[3].nbBins;
            const posScaleY2  = height / this.listOfHistograms[3].posMax;
            const negScaleY2 = height / this.listOfHistograms[3].negMax;
            const positiveScale2 = 'matrix(' + scaleX2 + ',0,0,' + posScaleY2 + ',0,0)';
            const negativeScale2 = 'matrix(' + scaleX2 + ',0,0,' + negScaleY2 + ',0,0)';
            this.listOfHistograms[2].scale = [positiveScale, negativeScale];
            this.listOfHistograms[3].scale = [positiveScale2, negativeScale2];
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
        this.updateHistograms(this.listOfHistograms);
    }
    /**
     * Invoked on click context menu
     * @param event mouse event
     * @return return false for disable browser context menu
     */
    public onContextMenu(event: MouseEvent) {
        this.mediaPlayerElement.eventEmitter.emit('contextmenu', event);
    }
    @AutoBind
    public updateHistograms(list) {
        if (list.length > 0) {
            const handleMetadataIds = this.pluginConfiguration.metadataIds;
            const metadataManager = this.mediaPlayerElement.metadataManager;
            setTimeout(() => this.drawHistograms(metadataManager.getHistograms(handleMetadataIds)), 500);
            this.initSliderEvents();
        }
    }
    public handleHover() {
        this.zoomedHistograms.nativeElement.click();
        this.histogramContainerElement.nativeElement.focus();

    }
    public handleKeyDownHistogramEvent(event) {
        this.mediaPlayerElement.eventEmitter.emit('ina.player.KEYDOWN_HISTOGRAM', event);
    }
    public handleKeyUpHistogramEvent(event) {
        this.mediaPlayerElement.eventEmitter.emit('ina.player.KEYUP_HISTOGRAM', event);
    }
}
