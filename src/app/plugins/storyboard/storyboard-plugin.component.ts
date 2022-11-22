import {PluginBase} from '../../core/plugin/plugin-base';
import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {PlayerEventType} from '../../core/constant/event-type';
import {AutoBind} from '../../core/decorator/auto-bind.decorator';
import {PluginConfigData} from '../../core/config/model/plugin-config-data';
import {StoryboardConfig} from '../../core/config/model/storyboard-config';
import * as _ from 'lodash';
import {MediaPlayerService} from '../../service/media-player-service';

@Component({
    selector: 'amalia-storyboard',
    templateUrl: './storyboard-plugin.component.html',
    styleUrls: ['./storyboard-plugin.component.scss'],
    encapsulation: ViewEncapsulation.ShadowDom
})
export class StoryboardPluginComponent extends PluginBase<StoryboardConfig> implements OnInit {
    public static PLUGIN_NAME = 'STORYBOARD';
    public static SELECTOR_THUMBNAIL = 'thumbnail';
    public static SELECTOR_SELECTED = 'active';
    public second = 'seconde';
    public minute = 'minute';
    public images = 'images';
    public baseUrl: string;
    public msgMedium = 'Affichage moyennes miniatures';
    public msgLarge = 'Affichage grandes miniatures';
    public listOfThumbnail: Array<number>;
    @ViewChild('storyboardElement', {static: false})
    public storyboardElement: ElementRef<HTMLElement>;
    @ViewChild('headerElement', {static: false})
    public headerElement: ElementRef<HTMLElement>;
    public currentTime: number;
    /**
     * Media duration
     */
    public duration: number;
    /**
     * thumbnail size
     */
    public size: 'medium' | 'large' = 'medium';
    /**
     * Display format specifier h|m|s|f|ms|mms
     */
    public displayFormat: 'h' | 'm' | 's' | 'minutes' | 'f' | 'ms' | 'mms' | 'hours' | 'seconds' = 'f';
    /**
     * Media fps
     */
    public fps: number;
    /**
     * show time code label
     */
    public enableLabel: boolean;
    /**
     * orientation of the plugin (horizontal|vertical)
     */
    public theme: 'v' | 'h' = 'v';

    /**
     * Time code interval
     */
    public tcIntervals = [2 , 5 , 10 , 30 , 60 , 120 , 240];
    /**
     * frame intervals
     */
    public frameIntervals = [60, 90, 180, 360];

    /**
     * Selected interval
     */
    public selectedInterval: [string, number];
    /**
     * state list of interval
     */
    public openIntervalList: boolean;

    /**
     * Default size of thumbnails
     */
    public sizeThumbnail = 'm';
    /**
     *  Personalized selected Interval
     */
    public tcInterval = 2;
    /**
     * default state of button synchro
     */
    public displaySynchro = false;
    public ignoreNextScroll = false;
    constructor(playerService: MediaPlayerService) {
        super(playerService, StoryboardPluginComponent.PLUGIN_NAME);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.selectedInterval = ['tc', this.tcIntervals[this.tcInterval]];
    }

    @AutoBind
    init() {
        super.init();
        this.fps = this.mediaPlayerElement.getMediaPlayer().framerate;
        this.enableLabel = this.pluginConfiguration.data.enableLabel;
        this.logger.info('data plugin storyboard' , this.pluginConfiguration.data);
        // disable thumbnail when base url is empty
        if (this.pluginConfiguration.data.baseUrl !== '') {
            if (this.mediaPlayerElement.getMediaPlayer().getDuration() >= 0) {
                this.initStoryboard();
            }
            this.mediaPlayerElement.eventEmitter.on(PlayerEventType.DURATION_CHANGE, this.handleDurationChange);
            this.mediaPlayerElement.eventEmitter.on(PlayerEventType.TIME_CHANGE, this.handleTimeChange);
            this.mediaPlayerElement.eventEmitter.on(PlayerEventType.SEEKED, this.handleTimeChange);
        }
    }
    /**
     * Handle time change
     */
    @AutoBind
    public handleTimeChange() {
        this.currentTime = this.mediaPlayerElement.getMediaPlayer().getCurrentTime();
        if (this.storyboardElement && this.displaySynchro === false) {
            this.selectThumbnail();
        }
    }
    /**
     * Init storyboard
     */
    initStoryboard() {
        const duration = this.mediaPlayerElement.getMediaPlayer().getDuration();
        if (!isNaN(duration) && isFinite(duration)) {
            this.duration = duration;
            const baseUrl = this.pluginConfiguration.data.baseUrl;
            const tcParam = this.pluginConfiguration.data.tcParam;
            this.baseUrl = baseUrl.search('\\?') === -1 ? `${baseUrl}?${tcParam}=` : `${baseUrl}&${tcParam}=`;
            this.theme = (this.pluginConfiguration.data.theme) ? this.pluginConfiguration.data.theme : this.getDefaultConfig().data.theme;
            this.updateThumbnailSize();
        } else {
            this.duration = null;
            this.logger.error('Error to init storyboard, please check media duration');
        }
    }

    /**
     * Return default config
     */
    getDefaultConfig(): PluginConfigData<StoryboardConfig> {
        return {
            name: StoryboardPluginComponent.PLUGIN_NAME, data: {
                baseUrl: '',
                enableLabel: true,
                tcParam: 'tc',
                tcIntervals: this.tcIntervals,
                frameIntervals: this.frameIntervals,
                displayFormat: 'f',
                theme: 'v',
                labelSynchro: 'Synchronisation du storyboard'
            }
        };
    }

    /**
     * Handle Scroll
     */
    public handleScroll(ignoreNextScroll?: boolean) {
        this.ignoreNextScroll = ignoreNextScroll && ignoreNextScroll === true ? ignoreNextScroll : false;
        this.updateSynchro();
    }

    /**
     *
     * if scrolling and active thumbnail is not visible add synchro button
     */
    @AutoBind
    public updateSynchro() {
        let visible = true;
        const activeNode: HTMLElement = this.storyboardElement.nativeElement
            .querySelector(`.${StoryboardPluginComponent.SELECTOR_THUMBNAIL}.${StoryboardPluginComponent.SELECTOR_SELECTED}`);
        if (activeNode) {
            const positionA = this.storyboardElement.nativeElement.getBoundingClientRect();
            const positionB = activeNode.getBoundingClientRect();
            // check if active element is visible
            const top = (positionB.top + activeNode.clientHeight) >= positionA.top;
            const bottom = (positionB.top - activeNode.clientHeight) < this.storyboardElement.nativeElement.clientHeight;
            if (!(top && bottom)) {
                visible = false;
            }
            // display button synchro if active node is not visible
            !visible ? this.displaySynchro = true : this.displaySynchro = false;
        } else {
            this.displaySynchro = false;
        }
    }
    /**
     * Handle to seek to time code
     * @param tc time code
     */
    public seekToTc(tc: number) {
        this.displaySynchro = false;
        this.mediaPlayerElement.getMediaPlayer().playbackRate = 1;
        this.mediaPlayerElement.getMediaPlayer().setCurrentTime(tc);
    }

    /**
     * handle change thumbnail size
     * @param type type interval
     * @param tc time code
     */
    @AutoBind
    public selectedThumbnailSize(type: string, tc: number) {
        this.selectedInterval = [type, tc];
        // this.openIntervalList = false;
        this.updateThumbnailSize();
    }

    /**
     * Invoked on duration change
     */
    @AutoBind
    private handleDurationChange() {
        this.initStoryboard();
    }

    /**
     * Handle interval
     */
    @AutoBind
    private updateThumbnailSize() {
        let interval: number = this.selectedInterval[1];
        if (this.selectedInterval[0] === 'frame') {
            interval = (1 / this.fps) * interval;
        }
        this.listOfThumbnail = _.range(0, this.duration, interval);
        // close menu
        this.openIntervalList = false;
        this.selectThumbnail();
    }

    /**
     * Select Thumbnail
     */
    @AutoBind
    public selectThumbnail() {
        const thumbnailElementNodes = Array.from(this.storyboardElement.nativeElement.querySelectorAll<HTMLElement>('.thumbnail'));
        if (thumbnailElementNodes) {
            const thumbnailFilteredNodes = thumbnailElementNodes
                .filter(node => this.currentTime >= parseFloat(node.getAttribute('data-tc')));
            if (thumbnailFilteredNodes && thumbnailFilteredNodes.length > 0) {
                thumbnailFilteredNodes.forEach(thumbnailNode => {
                    const activeThumbnail = this.storyboardElement.nativeElement.querySelector('.thumbnail.active');
                    if (activeThumbnail) {
                        activeThumbnail.classList.remove('active');
                    }
                    thumbnailNode.classList.add('active');
                    this.scrollToThumbnail(thumbnailNode);
                });
            } else {
                const activeThumbnail = this.storyboardElement.nativeElement.querySelector('.thumbnail.first');
                if (activeThumbnail != null) {
                    activeThumbnail.classList.add('active');
                }
            }
        }
    }
    /**
     * Invoked to scroll to thumbnail
     * @param thumbnailNode element to scroll
     */
    private scrollToThumbnail(thumbnailNode: HTMLElement) {
        const scrollPos = thumbnailNode.offsetTop - this.storyboardElement.nativeElement.offsetTop;
        const reverseMode = this.mediaPlayerElement.getMediaPlayer().reverseMode;
        const positionA = this.storyboardElement.nativeElement.getBoundingClientRect();
        const positionB = thumbnailNode.getBoundingClientRect();
        // check if active element is not visible
        const visible = (positionB.top + thumbnailNode.clientHeight) >= positionA.top &&
            (positionB.top + thumbnailNode.clientHeight) <= this.storyboardElement.nativeElement.clientHeight;
        if (!(visible)) {
            if (!reverseMode) {
                this.storyboardElement.nativeElement.scrollTop = scrollPos;
            } else {
                if (scrollPos > thumbnailNode.clientHeight) {
                    this.storyboardElement.nativeElement.scrollTop = (this.storyboardElement.nativeElement.clientHeight - thumbnailNode.clientHeight) + scrollPos;
                } else {
                    this.storyboardElement.nativeElement.scrollTop = scrollPos;
                }

            }
        }
    }

    /**
     * Invoked on click button synchro
     */
    public scrollToActiveThumbnail() {
        const scrollNode: HTMLElement = this.storyboardElement.nativeElement
            .querySelector(`.${StoryboardPluginComponent.SELECTOR_THUMBNAIL}.${StoryboardPluginComponent.SELECTOR_SELECTED}`);
        if (scrollNode) {
            this.storyboardElement.nativeElement.scrollTop = scrollNode.offsetTop - this.storyboardElement.nativeElement.offsetTop;
        }
    }

    /**
     * Toggle openList
     */
    public toggleList() {
        this.openIntervalList = !this.openIntervalList;
    }
}
