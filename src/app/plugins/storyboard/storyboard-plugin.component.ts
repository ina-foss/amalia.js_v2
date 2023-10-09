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
    public listOfThumbnailFilter: Array<number>;
    public storyboardElement: ElementRef<HTMLElement>;
    @ViewChild('scrollElement', {static: false})
    public scrollElement: ElementRef<HTMLElement>;
    @ViewChild('headerElement', {static: false})
    public headerElement: ElementRef<HTMLElement>;
    public currentTime = 0;
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
    public tcIntervals = [2, 5, 10, 30, 60, 120, 240];
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
    public tcInterval = 3;
    /**
     * thumbnails per line
     */
    public itemPerLine: number;
    /**
     * Height Thumbnail
     */
    public heightThumbnail: number;
    /**
     * default state of button synchro
     */
    public displaySynchro = false;
    public ignoreNextScroll = false;
    public activeThumbnail: any;
    public selectedTc = 0;

    constructor(playerService: MediaPlayerService) {
        super(playerService, StoryboardPluginComponent.PLUGIN_NAME);
        this.listOfThumbnailFilter = [];
        this.selectedInterval = ['tc', this.tcIntervals[this.tcInterval]];
    }

    @AutoBind
    init() {
        super.init();
        this.fps = this.mediaPlayerElement.getMediaPlayer().framerate;
        this.enableLabel = this.pluginConfiguration.data.enableLabel;
        this.itemPerLine = this.pluginConfiguration.data.itemPerLine;
        this.logger.info('data plugin storyboard', this.pluginConfiguration.data);
        // disable thumbnail when base url is empty
        if (this.pluginConfiguration.data.baseUrl !== '') {
            if (this.mediaPlayerElement.getMediaPlayer().getDuration() >= 0) {
                this.initStoryboard();
            }
            this.sizeThumbnail = this.getWindowWidth();
            this.mediaPlayerElement.eventEmitter.on(PlayerEventType.DURATION_CHANGE, this.handleDurationChange);
            this.mediaPlayerElement.eventEmitter.on(PlayerEventType.TIME_CHANGE, this.handleTimeChange);
            this.mediaPlayerElement.eventEmitter.on(PlayerEventType.SEEKED, this.handleTimeChange);
        }
        this.handleTimeChange();
        // this.init();
    }

    @ViewChild('storyboardElement')
    set ele2(v: ElementRef) {
        if (!this.storyboardElement) {
            this.storyboardElement = v;
            this.init();
        }
    }

    /**
     * Get width window
     */
    private getWindowWidth() {
        const width = window.innerWidth;
        let size;
        if (width <= 1280) {
            size = 'm';
        } else {
            size = 'l';
        }
        return size;
    }

    /**
     * Handle time change
     */
    @AutoBind
    public handleTimeChange() {
        this.currentTime = this.mediaPlayerElement.getMediaPlayer().getCurrentTime();
        const lastTc = this.listOfThumbnailFilter[this.listOfThumbnailFilter.length - 1];
        const firstTc = this.listOfThumbnailFilter[0];
        this.selectedTc = this.currentTime;
        if (this.currentTime > lastTc) {
            this.updateScrollHeight();
            const clientHeight = this.storyboardElement.nativeElement.clientHeight;
            const scrollTop = this.storyboardElement.nativeElement.parentElement.scrollTop;
            // scrollTop=(this.listOfThumbnail.indexOf(lastTc)/this.itemPerLine)*this.heightThumbnail;
            const elementStyle = this.storyboardElement.nativeElement.style;
            Object.assign(elementStyle, {
                transform: `translateY(${scrollTop}px)`
            });
            const start = this.listOfThumbnail.indexOf(lastTc);
            const end = start + (clientHeight / this.heightThumbnail) * this.itemPerLine;
            this.listOfThumbnailFilter = this.listOfThumbnail.slice(start, end);
        }
        if (this.currentTime < firstTc) {
            this.updateScrollHeight();
            const clientHeight = this.storyboardElement.nativeElement.clientHeight;
            const scrollTop = this.storyboardElement.nativeElement.parentElement.scrollTop;
            // scrollTop=(this.listOfThumbnail.indexOf(firstTc)/this.itemPerLine)*this.heightThumbnail;
            const elementStyle = this.storyboardElement.nativeElement.style;
            Object.assign(elementStyle, {
                transform: `translateY(${scrollTop}px)`
            });
            const end = this.listOfThumbnail.indexOf(firstTc);
            const start = end - (clientHeight / this.heightThumbnail) * this.itemPerLine;
            this.listOfThumbnailFilter = this.listOfThumbnail.slice(start, end);
        }
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
                labelSynchro: 'Synchronisation du storyboard',
                itemPerLine: 20
            }
        };
    }

    /**
     * Handle Scroll
     */
    public handleScroll(ignoreNextScroll?: boolean) {
        if (this.itemPerLine) {
            if (this.storyboardElement && this.storyboardElement.nativeElement.children.length > 0) {
                this.updateScrollHeight();
                const clientHeight = this.storyboardElement.nativeElement.clientHeight;
                const scrollTop = this.storyboardElement.nativeElement.parentElement.scrollTop;
                const elementStyle = this.storyboardElement.nativeElement.style;
                Object.assign(elementStyle, {
                    transform: `translateY(${scrollTop}px)`
                });
                const start = (scrollTop / this.heightThumbnail) * this.itemPerLine;
                const end = start + (clientHeight / this.heightThumbnail) * this.itemPerLine;
                this.listOfThumbnailFilter = this.listOfThumbnail.slice(start, end);
            } else {
                const is = 0;
                const ie = is + this.itemPerLine;
                this.listOfThumbnailFilter = this.listOfThumbnail.slice(is, ie);
            }
        }
        this.updateSynchro();
    }

    /**
     *
     * if scrolling and active thumbnail is not visible add synchro button
     */
    @AutoBind
    public updateSynchro() {
        let visible = true;
        const activeNode = this.activeThumbnail;
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
            this.displaySynchro = !visible;
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
        this.selectedTc = tc;
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
    public updateThumbnailSize() {
        let interval: number = this.selectedInterval[1];
        if (this.selectedInterval[0] === 'frame') {
            interval = (1 / this.fps) * interval;
        }
        this.listOfThumbnail = _.range(0, this.duration, interval);
        // close menu
        this.openIntervalList = false;
        this.updateScrollHeight();
        this.handleScroll(false);
        this.selectThumbnail();
    }

    /**
     * Select Thumbnail
     */
    public selectThumbnail() {
        if (this.storyboardElement) {
            const thumbnailElementNodes = Array.from(this.storyboardElement.nativeElement.querySelectorAll<HTMLElement>('.thumbnail'));
            const thumbnailFilteredNodes = thumbnailElementNodes
                    .filter(node => this.currentTime >= parseFloat(node.getAttribute('data-tc')));
            if (thumbnailFilteredNodes && thumbnailFilteredNodes.length > 0) {
                thumbnailFilteredNodes.forEach(thumbnailNode => {
                    this.activeThumbnail = this.storyboardElement.nativeElement.querySelector('.thumbnail.active');
                    if (this.activeThumbnail) {
                        this.activeThumbnail.classList.remove('active');
                    }
                    thumbnailNode.classList.add('active');
                    Object.assign(this.storyboardElement.nativeElement.parentElement.dataset, {
                        scrollTop: this.storyboardElement.nativeElement.parentElement.scrollTop,
                    });
                    this.scrollToThumbnail(thumbnailNode);
                });
            } else {
                this.activeThumbnail = this.storyboardElement.nativeElement.querySelector('.thumbnail.first');
                if (this.activeThumbnail != null) {
                    this.activeThumbnail.classList.add('active');
                    // this.updateScrollHeight();
                }
            }
        }
    }

    /**
     * In charge to update scroll height
     *
     */
    private updateScrollHeight() {
        if (this.storyboardElement) {
            const totalThumbnail = this.listOfThumbnail.length;
            this.heightThumbnail = this.storyboardElement.nativeElement.firstElementChild.getBoundingClientRect().height;
            const itemPos = this.storyboardElement.nativeElement.firstElementChild.getBoundingClientRect().top;
            let itemPerLine = 0;
            for (let i = 0; i < this.storyboardElement.nativeElement.children.length; i++) {
                const top = this.storyboardElement.nativeElement.children.item(i).getBoundingClientRect().top;
                if (itemPos === top) {
                    itemPerLine++;
                } else {
                    break;
                }
            }
            this.itemPerLine = itemPerLine;
            const nbLines = Math.round(totalThumbnail / this.itemPerLine);
            const storyBoardHeight = (this.heightThumbnail + 3) * (nbLines);
            Object.assign(this.scrollElement.nativeElement.style, {
                height: `${storyBoardHeight}px`
            });
            this.logger.info(`totalThumbnail : ${totalThumbnail} itemPerLine: ${this.itemPerLine} -${itemPerLine} heightThumbnail:${this.heightThumbnail}`);
        }
    }

    public handleThumbnailSizeChange(size: 'medium' | 'large') {
        this.size = size;
        setTimeout(() => {
            this.updateThumbnailSize();
        }, 250);
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
    public scrollToActiveThumbnail(tc: number, ignoreNextScroll: boolean = false, withSeek: boolean = false) {
        this.displaySynchro = false;
        this.handleScroll(this.ignoreNextScroll);
        const scrollTop = parseFloat(this.storyboardElement.nativeElement.parentElement.dataset.scrollTop);
        this.storyboardElement.nativeElement.parentElement.scrollTo({behavior: 'smooth', top: scrollTop});
        if (withSeek) {
            setTimeout(() => {
                this.seekToTc(this.selectedTc);
            }, 800);
        }

    }

    /**
     * Toggle openList
     */
    public toggleList() {
        this.openIntervalList = !this.openIntervalList;
    }
}
