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
import interact from 'interactjs';

@Component({
    selector: 'amalia-histogram',
    templateUrl: './histogram-plugin.component.html',
    styleUrls: ['./histogram-plugin.component.scss'],
    encapsulation: ViewEncapsulation.ShadowDom,
})
export class HistogramPluginComponent extends PluginBase<HistogramConfig> implements OnInit {
    private readonly httpClient: HttpClient;

    constructor(httpClient: HttpClient, playerService: MediaPlayerService) {
        super(playerService, HistogramPluginComponent.PLUGIN_NAME);
        this.httpClient = httpClient;
        if (!this.httpClient) {
            throw new AmaliaException('Error to implement http config loader');
        }
        this.listOfZoomedHistograms = new Array<{ paths: [string, string], nbBins: number, maxHeight: number }>();
    }
    public static PLUGIN_NAME = 'HISTOGRAM';
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
     * Max zoom size 10% of container width
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
    public listOfHistograms: Array<{ paths: [string, string], nbBins: number, maxHeight: number }>;
    /**
     * list of zoomed histograms
     */
    public listOfZoomedHistograms: Array<{ paths: [string, string], nbBins: number, maxHeight: number }>;
    /**
     * html element histogramContainer
     */
    @ViewChild('histogramContainer')
    public histogramContainerElement: ElementRef<HTMLElement>;
    @ViewChild('slider')
    public sliderElement: ElementRef<HTMLElement>;
    /**
     * Mouse Positions
     */
    public position: number;

    ngOnInit(): void {
        super.ngOnInit();
    }

    @AutoBind
    init() {
        super.init();
        this.withFocus = this.pluginConfiguration.data.withFocus;
        this.getZoomedHistogramData();
        this.initSliderEvents();
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.TIME_CHANGE, this.handleOnTimeChange);
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.DURATION_CHANGE, this.handleOnDurationChange);
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.METADATA_LOADED, this.handleMetadataLoaded);

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
     * Handle draw histogram return tuple with positive bins and negative bins
     * In charge to create svg paths
     * @param posBins positive bins
     * @param negBins negative bins
     * @param posMax max positive bin
     * @param negMax max negative bin
     * @param mirror true for enable mirror histogram
     */
    public static drawHistogram(posBins: string, negBins: string, posMax: number, negMax: number, mirror = false): { paths: [string, string], nbBins: number, maxHeight: number } {
        const positiveValues = (posBins && posBins !== '') ? BaseUtils.base64DecToArr(posBins) : null;
        const negativeValues = (negBins && negBins !== '') ? BaseUtils.base64DecToArr(negBins) : null;
        if (positiveValues !== null) {
            const nbBins = positiveValues.length;
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
            return {paths: [positivePath, negativePath], nbBins, maxHeight: Math.max(posMax, negMax)};
        }
        return null;
    }

    /**
     * Handle draw histogram
     * @param histograms list of histogram metadata
     */
    private drawHistograms(histograms: Array<Histogram>) {
        if (histograms && histograms.length > 0) {
            this.listOfHistograms = new Array<{ paths: [string, string], nbBins: number, maxHeight: number }>();
            histograms.forEach((hData) => {
                const histogram = HistogramPluginComponent.drawHistogram(hData.posbins, hData.negbins, hData.posmax, hData.negmax, this.pluginConfiguration.data.enableMirror);
                if (histogram) {
                    this.listOfHistograms.push(histogram);
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
        const duration = this.mediaPlayerElement.getMediaPlayer().getDuration();
        const ratio = ((duration * this.zoomSize) / 100) / 2;
        // when media is stopped
        if (this.currentTime === 0) {
            this.initializeCursors();
        }
        if (this.currentTime <= ratio) {
            this.updateTimeCursors(this.currentTime, ratio, true);
        } else if (this.currentTime >= duration -  ratio) {
            this.updateCursors(this.currentTime);
            this.updateTimeCursors(this.currentTime, ratio, false);
        } else if  (this.currentTime >= ratio && this.currentTime <= duration - ratio) {
            this.updateCursors(this.currentTime);
            this.cursorPosition = 50;
            this.cursorZoomPosition = 50;
        }
    }
    /**
     * Initialize cursors
     */
    @AutoBind
    public initializeCursors() {
        this.sliderPosition = 0;
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
        if (document.fullscreenElement === null) {
            const containerWidth = this.histogramContainerElement.nativeElement.offsetWidth;
            zoomedWidth = Math.round(this.getZoomedWidth(containerWidth,this.zoomSize));
        } else {
            const widthContainer = window.outerWidth;
            zoomedWidth = Math.round(this.getZoomedWidth(widthContainer, this.zoomSize));
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
            this.sliderPosition = position;
            this.histogramPosition = negativeLeft;
        } else if (position >= maxPosition && (currentTime <= duration && currentTime > 0)) {
            zoomPosition = (maxPosition * zoomedWidth) /  100;
            negativeLeft = '-' + zoomPosition;
            const tcin = duration - ((this.zoomSize * duration) /  100);
            position =  ((currentTime - tcin) * 100) / (duration - tcin);
            this.cursorPosition = position;
            this.cursorZoomPosition = position;
            this.sliderPosition = maxPosition;
            this.histogramPosition = negativeLeft;
        }
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
        this.duration = this.mediaPlayerElement.getMediaPlayer().getDuration();
    }
    /**
     * Invoked on metadata loaded
     */
    @AutoBind
    private handleMetadataLoaded() {
        const handleMetadataIds = this.pluginConfiguration.metadataIds;
        const metadataManager = this.mediaPlayerElement.metadataManager;
        this.logger.info(` Metadata loaded plugin histogram handle metadata ids:  ${handleMetadataIds}`);
        // Check if metadata is initialized
        if (metadataManager && handleMetadataIds && isArrayLike<string>(handleMetadataIds)) {
            this.drawHistograms(metadataManager.getHistograms(handleMetadataIds));
        }
    }
    /**
     * Called on start dragging element
     */
    public startDragging(event) {
        // store the state of the player when drag
        const mediaPlayer = this.mediaPlayerElement.getMediaPlayer();
        if (mediaPlayer.isPaused() === false && typeof(this.isplaying) !== 'undefined') {
            this.isplaying = true;
            mediaPlayer.pause();
        } else {
            this.isplaying = false;
        }
    }
    /**
     * Called on stop dragging element
     */
    public  stopDragging(event) {
        // 4 = border width
        const mediaPlayer = this.mediaPlayerElement.getMediaPlayer();
        const duration = mediaPlayer.getDuration();
        const nativeElement = this.sliderElement.nativeElement;
        const position =  ((nativeElement.offsetLeft + nativeElement.offsetWidth / 2) / this.histogramContainerElement.nativeElement.offsetWidth) * 100;
        let currentTime =  (duration * position) / 100;
        currentTime = parseFloat(currentTime.toFixed(2));
        mediaPlayer.setCurrentTime(currentTime);
        if (this.isplaying === true) {
            mediaPlayer.play();
        }
        // reset
        this.isplaying = null;
    }
    /**
     * get zoomed histogram data from api
     */
    private getZoomedHistogramData(){
        const  url = this.pluginConfiguration.data.url;
        let format = this.pluginConfiguration.data.format;

        if (typeof(format) === 'undefined') {
            if (document.fullscreenElement === null) {
                const containerWidth = this.histogramContainerElement.nativeElement.offsetWidth;
                format = Math.round(this.getZoomedWidth(containerWidth, this.zoomSize));
            }  else {
                const widthContainer = window.outerWidth;
                format = Math.round(this.getZoomedWidth(widthContainer, this.zoomSize));

            }
            format = Math.round(format / 3);
        }
        const urlHistogramL = url + '?format=' + format + '&canal=0';
        const urlHistogramR = url + '?format=' + format + '&canal=1';
        this.loadHistogram(urlHistogramL);
        this.loadHistogram(urlHistogramR);
    }
    /**
     * slider events
     */
    private initSliderEvents() {
        console.log(this.sliderElement);
        const container = interact(this.sliderElement.nativeElement);
        container.draggable({
            onmove(event) {
                console.log(event);
            }
        });
    }

    /**
     * call api to get histogram data
     */

    private loadHistogram(url) {
       const self = this;
       this.httpClient.get(url).toPromise()
            .then(
                res => {
                    this.logger.info('Histogram data loaded ...');
                    if (res) {
                        self.addHistogram(res);
                    }
                },
                error => {
                    this.logger.error('Error to load histogram data ...', error);
                }
            );
    }
    /**
     * add histogram to list of zoomed histograms
     */
    private addHistogram(data) {
       data = data.localisation[0];
       for (let i = 0;
            i < data.data.histogram.length;
            i++) {
                const hData = data.data.histogram[i];
                const histogram = HistogramPluginComponent.drawHistogram(hData.posbins, hData.negbins, hData.posmax, hData.negmax, this.pluginConfiguration.data.enableMirror);
                if (histogram) {
                   this.listOfZoomedHistograms.push(histogram);
               }
       }
    }
}
