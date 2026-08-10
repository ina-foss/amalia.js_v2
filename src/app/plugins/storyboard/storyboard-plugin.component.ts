import { PluginBase } from "../../core/plugin/plugin-base";
import { ChangeDetectionStrategy, Component, ElementRef, OnInit, signal, ViewChild, ViewEncapsulation } from "@angular/core";
import { PlayerEventType } from "../../core/constant/event-type";
import { PluginConfigData } from "../../core/config/model/plugin-config-data";
import { StoryboardConfig } from "../../core/config/model/storyboard-config";
import throttle from "lodash/throttle";
import range from "lodash/range";
import { MediaPlayerService } from "../../service/media-player-service";
import { Tooltip } from "primeng/tooltip";
import { NgClass } from "@angular/common";
import { TcFormatPipe } from "../../core/utils/tc-format.pipe";
import {
    OutsideZoneMousemoveDirective,
    OutsideZoneScrollDirective,
} from "../../core/directive/outside-zone-event.directive";

@Component({
    selector: "amalia-storyboard",
    templateUrl: "./storyboard-plugin.component.html",
    styleUrls: ["./storyboard-plugin.component.scss"],
    encapsulation: ViewEncapsulation.ShadowDom,
    imports: [Tooltip, NgClass, TcFormatPipe, OutsideZoneMousemoveDirective, OutsideZoneScrollDirective],
    // OnPush (phase 7 vague 2) : les trois champs template mutés hors handlers de template
    // (displaySynchro, openIntervalList, listOfThumbnailFilter — timers, listeners player)
    // sont des signals ; le reste est soit constant, soit muté uniquement par des handlers
    // de template (size, selectedInterval → la vue est marquée dirty par l'événement), soit
    // renseigné dans init() (baseUrl, enableLabel, fps, sizeThumbnail, tcOffset — couvert
    // par le listener INIT 'zone' ou le METADATA_LOADED 'schedule'). Le TIME_CHANGE throttlé
    // et SEEKED/SEEKING ne font que du DOM (classList/scroll) et des écritures de signals →
    // policy 'none'.
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoryboardPluginComponent extends PluginBase<StoryboardConfig> implements OnInit {
    public static DEFAULT_THROTTLE_INVOCATION_TIME = 500;
    public static PLUGIN_NAME = "STORYBOARD";
    public static AUTO_SYNC_DELAY = 8000;
    public second = "seconde";
    public minute = "minute";
    public images = "images";
    public baseUrl: string;
    public msgMedium = "Affichage moyennes miniatures";
    public msgLarge = "Affichage grandes miniatures";
    public listOfThumbnail: Array<number>;
    /**
     * Fenêtre de miniatures rendue par le @for du template — signal : mutée depuis des
     * timers (auto-sync, resize différé) et des listeners player hors zone.
     */
    public readonly listOfThumbnailFilter = signal<Array<number>>([]);
    public storyboardElement: ElementRef<HTMLElement>;
    @ViewChild("scrollElement", { static: false })
    public scrollElement: ElementRef<HTMLElement>;
    @ViewChild("headerElement", { static: false })
    public headerElement: ElementRef<HTMLElement>;
    public currentTime = 0;
    public throttleTimeChange: any;
    /**
     * Media duration
     */
    public duration: number;
    /**
     * thumbnail size
     */
    public size: "medium" | "large" = "large";
    /**
     * Display format specifier h|m|s|f|ms|mms
     */
    public displayFormat: "h" | "m" | "s" | "minutes" | "f" | "ms" | "mms" | "hours" | "seconds" = "f";
    /**
     * Media fps
     */
    public override fps: number;
    /**
     * show time code label
     */
    public enableLabel: boolean;
    /**
     * orientation of the plugin (horizontal|vertical)
     */
    public theme: "v" | "h" = "v";

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
     * state list of interval — signal : refermé par updateThumbnailSize depuis des timers
     * (handleThumbnailSizeChange) et le listener METADATA_LOADED.
     */
    public readonly openIntervalList = signal(false);

    /**
     * Default size of thumbnails
     */
    public sizeThumbnail = "m";
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
     * default state of button synchro — signal : basculé par les listeners SEEKED/scroll
     * et le timer d'auto-synchronisation, tous hors zone Angular.
     */
    public readonly displaySynchro = signal(false);
    public activeThumbnail: any;
    public selectedTc = 0;
    public selectedIntervalitem = 0;
    public usedSelectedtc = 0;
    public stopScroll = false;
    private autoSyncTimer: ReturnType<typeof setTimeout> | null = null;
    private isAutoScrolling = false;

    /**
     * Handlers des événements haute fréquence migrés hors zone + throttle rAF (phase 8,
     * directives OutsideZone*Directive) : exécutés hors zone Angular, au plus 1×/frame.
     * handleScroll/updateSynchro n'écrivent que les signals listOfThumbnailFilter et
     * displaySynchro plus du DOM (transform/scrollTop) ; resetAutoSyncTimer ne manipule
     * que des timers.
     */
    public readonly onScrollOutside = (): void => this.handleScroll();
    public readonly onMousemoveOutside = (): void => this.resetAutoSyncTimer();

    constructor(playerService: MediaPlayerService) {
        super(playerService);
        this.pluginName = StoryboardPluginComponent.PLUGIN_NAME;
        this.selectedInterval = ["tc", this.tcIntervals[this.tcInterval]];
        this.throttleTimeChange = throttle(
            this.handleSeeked,
            StoryboardPluginComponent.DEFAULT_THROTTLE_INVOCATION_TIME,
        );
    }

    override init() {
        super.init();
        this.currentTime = this.mediaPlayerElement.getMediaPlayer().getCurrentTime();
        this.fps = this.mediaPlayerElement.getMediaPlayer().framerate;
        this.enableLabel = this.pluginConfiguration.data.enableLabel;
        this.itemPerLine = this.pluginConfiguration.data.itemPerLine;
        this.logger.info("data plugin storyboard", this.pluginConfiguration.data);
        // disable thumbnail when base url is empty
        if (this.pluginConfiguration.data.baseUrl !== "") {
            if (this.mediaPlayerElement.getMediaPlayer().getDuration() >= 0) {
                this.initStoryboard();
            }
            this.sizeThumbnail = this.getWindowWidth();
            // TIME_CHANGE/SEEKED/SEEKING ne font que du DOM (classList active, scrollTop) et
            // des écritures de signals (displaySynchro, listOfThumbnailFilter) → policy 'none' :
            // pas de zone.run ni de markForCheck, l'écriture de signal notifie la vue OnPush.
            this.addListener(
                this.mediaPlayerElement.eventEmitter,
                PlayerEventType.TIME_CHANGE,
                this.throttleTimeChange,
                { policy: "none" },
            );
            this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.SEEKED, this.handleSeekedEvent, {
                policy: "none",
            });
            this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.SEEKING, this.handleSeeking, {
                policy: "none",
            });
            // handleMetadataLoaded écrit aussi des champs plats lus par le template (baseUrl,
            // duration via initStoryboard) → 'schedule' : handler tel quel + markForCheck hors
            // zone (tick coalescé par le scheduler hybride).
            this.addListener(
                this.mediaPlayerElement.eventEmitter,
                PlayerEventType.METADATA_LOADED,
                this.handleMetadataLoaded,
                { policy: "schedule" },
            );
        }
        this.handleSeeked();
    }

    /**
     * In charge to load image
     */
    initObserverForLoadImages() {
        const observer = new MutationObserver(() => {
            const thumbnailElementNodes = Array.from(
                this.storyboardElement.nativeElement.querySelectorAll<HTMLElement>(".image"),
            );
            thumbnailElementNodes.forEach((thumbnailNode) => {
                if (thumbnailNode && thumbnailNode.dataset.imgsrc) {
                    thumbnailNode.setAttribute("src", thumbnailNode.dataset.imgsrc);
                }
            });
        });
        const observerConfig = {
            attributes: false,
            childList: true,
            characterData: false,
        };
        const targetNode = this.storyboardElement.nativeElement;
        observer.observe(targetNode, observerConfig);
    }

    @ViewChild("storyboardElement")
    set ele2(v: ElementRef) {
        if (!this.storyboardElement && !this.stopScroll) {
            this.storyboardElement = v;
            this.init();
            this.initObserverForLoadImages();
        }
    }

    /**
     * Get width window
     */
    private getWindowWidth(): string {
        const width = window.innerWidth;
        let size: string;
        if (width <= 1280) {
            size = "m";
        } else {
            size = "l";
        }
        return size;
    }

    private isHandleSeekNeeded(): boolean {
        return (
            this.currentTime !== 0 && this.storyboardElement && this.storyboardElement.nativeElement.children.length > 0
        );
    }

    private getOutRange(isForward: boolean, firstTc: number, lastTc: number): boolean {
        return isForward
            ? !(firstTc < this.selectedTc && this.selectedTc < lastTc)
            : this.selectedTc < firstTc && this.selectedTc < lastTc;
    }

    private computeFirstTc(outRange, selectedTc, isForward, firstTc) {
        if (outRange && !isForward) {
            return this.getNearSeekTc(selectedTc);
        }
        return firstTc;
    }

    private computeLastTc(outRange, selectedTc, isForward, lastTc) {
        if (outRange && isForward) {
            return this.getNearSeekTc(this.selectedTc);
        }
        return lastTc;
    }

    private predicateIsNodeTcInRange(currentTime) {
        return (node) =>
            currentTime >= parseFloat(node.getAttribute("data-tc")) &&
            parseFloat(node.getAttribute("data-tc")) <= currentTime;
    }

    /**
     * Handle seek
     */

    public handleSeeked(time?: number) {
        // Annule un appel "trailing" du throttle TIME_CHANGE en attente : evite qu'un
        // appel differe (jusqu'a 500ms) base sur une position intermediaire d'un seek
        // precedent n'ecrase l'etat frais calcule ici, ce qui desynchronise le storyboard
        // de la zone de visionnage apres plusieurs clics rapides sur la barre de progression.
        this.throttleTimeChange?.cancel?.();
        // time fourni (ex. depuis SEEKING pendant le glisse du slider) : on suit la position
        // candidate du curseur plutot que la position reelle du media (qui ne bouge qu'au relachement).
        this.currentTime = Number.isFinite(time) ? time : this.mediaPlayerElement.getMediaPlayer().getCurrentTime();

        if (this.isHandleSeekNeeded()) {
            const listOfThumbnailFilter = this.listOfThumbnailFilter();
            let lastTc = listOfThumbnailFilter[listOfThumbnailFilter.length - 1];
            let firstTc = listOfThumbnailFilter[0];
            this.selectedTc = this.currentTime;
            const isForward = !this.mediaPlayerElement.getMediaPlayer().reverseMode;
            const outRange = this.getOutRange(isForward, firstTc, lastTc);
            lastTc = this.computeLastTc(outRange, this.selectedTc, isForward, lastTc);
            firstTc = this.computeFirstTc(outRange, this.selectedTc, isForward, firstTc);

            const thumbnailElementNodes = Array.from(
                this.storyboardElement.nativeElement.querySelectorAll<HTMLElement>(".thumbnail"),
            );
            const thumbnailFilteredNodes = thumbnailElementNodes.filter(
                this.predicateIsNodeTcInRange(this.currentTime),
            );
            if (thumbnailFilteredNodes && thumbnailFilteredNodes.length > 0) {
                thumbnailFilteredNodes.forEach((thumbnailNode) => {
                    this.activeThumbnail = this.storyboardElement.nativeElement.querySelector(".thumbnail.active");
                    if (this.activeThumbnail) {
                        this.activeThumbnail.classList.remove("active");
                    }
                    thumbnailNode.classList.add("active");
                });
            }
            if (isForward && outRange && this.displaySynchro() === false) {
                this.updateScrollForTimeCode(lastTc, isForward);
            } else if (!isForward && outRange && this.displaySynchro() === false) {
                this.updateScrollForTimeCode(firstTc, isForward);
            }
        }
    }

    /**
     * Suit en direct le deplacement du curseur de la barre de progression : le slider emet un
     * SEEKING en continu pendant le glisse (le media, lui, ne bouge qu'au relachement), donc on
     * met a jour l'imagette active sur la position candidate plutot que d'attendre le SEEKED final.
     */
    public handleSeeking = (time: number): void => {
        this.handleSeeked(time);
    };

    protected override handleMetadataLoaded(): void {
        if (
            this.pluginConfiguration?.data?.baseUrl !== "" &&
            this.mediaPlayerElement.getMediaPlayer().getDuration() >= 0
        ) {
            this.initStoryboard();
            // Resynchronise la vignette active une fois les miniatures re-rendues (le @for lit
            // le signal listOfThumbnailFilter écrit par initStoryboard→handleScroll) :
            // afterNextRender remplace l'ancien setTimeout(100) — audit setTimeout catégorie c.
            this.runAfterNextRender(() => {
                this.currentTime = this.mediaPlayerElement.getMediaPlayer().getCurrentTime();
                this.handleSeeked();
            });
        }
    }

    private handleSeekedEvent = (): void => {
        this.displaySynchro.set(false);
        if (this.autoSyncTimer !== null) {
            clearTimeout(this.autoSyncTimer);
            this.autoSyncTimer = null;
        }
        this.handleSeeked();
    };

    /**
     * Return start index
     */ getNearSeekTc(tc: number) {
        if (this.listOfThumbnail) {
            for (const item of this.listOfThumbnail) {
                if (item > tc) {
                    const t = this.listOfThumbnail.indexOf(item);
                    return this.listOfThumbnail[t - 1];
                } else if (
                    item === tc ||
                    (this.listOfThumbnail[this.listOfThumbnail.length - 2] + this.selectedIntervalitem === item &&
                        item < this.listOfThumbnail[this.listOfThumbnail.length - 1] + this.selectedIntervalitem)
                ) {
                    return item;
                }
            }
        }
        return 0;
    }

    /**
     * Update scroll based on timecode
     * @param timeCode timeCode
     * @param isForward true forward
     */
    updateScrollForTimeCode(timeCode: number, isForward: boolean) {
        this.updateScrollHeight();
        const clientHeight = this.storyboardElement.nativeElement.clientHeight;
        const index = this.listOfThumbnail.indexOf(timeCode);
        if (index > -1) {
            const offset = Math.ceil((clientHeight / this.heightThumbnail) * this.itemPerLine);
            const start = isForward ? index : Math.max(index - offset, 0);
            const scrollTop = (start / this.itemPerLine) * this.heightThumbnail;
            const element = this.storyboardElement.nativeElement.parentElement;
            this.isAutoScrolling = true;
            element.scrollTop = scrollTop;
            setTimeout(() => {
                this.isAutoScrolling = false;
            }, 100);
            Object.assign(element, {
                transform: `translateY(${scrollTop}px)`,
            });
        } else {
            this.logger.info("TC not found");
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
            this.baseUrl = baseUrl.search("\\?") === -1 ? `${baseUrl}?${tcParam}=` : `${baseUrl}&${tcParam}=`;
            this.theme = this.pluginConfiguration.data.theme
                ? this.pluginConfiguration.data.theme
                : this.getDefaultConfig().data.theme;
            this.updateThumbnailSize();
        } else {
            this.duration = null;
            this.logger.error("Error to init storyboard, please check media duration");
        }
    }

    /**
     * Return default config
     */
    getDefaultConfig(): PluginConfigData<StoryboardConfig> {
        return {
            name: StoryboardPluginComponent.PLUGIN_NAME,
            data: {
                baseUrl: "",
                enableLabel: true,
                tcParam: "tc",
                tcIntervals: this.tcIntervals,
                frameIntervals: this.frameIntervals,
                displayFormat: "f",
                theme: "v",
                labelSynchro: "Synchronisation du storyboard",
                itemPerLine: 20,
            },
        };
    }

    /**
     * Handle Scroll
     */
    public handleScroll() {
        if (this.itemPerLine) {
            if (this.storyboardElement && this.storyboardElement.nativeElement.children.length > 0) {
                this.updateScrollHeight();
                const clientHeight = this.storyboardElement.nativeElement.clientHeight;
                const scrollTop = this.storyboardElement.nativeElement.parentElement.scrollTop;
                const elementStyle = this.storyboardElement.nativeElement.style;
                const maxScroll =
                    (this.listOfThumbnail.length /
                        Math.trunc((clientHeight / this.heightThumbnail) * this.itemPerLine)) *
                    clientHeight;
                if (scrollTop <= maxScroll) {
                    Object.assign(elementStyle, {
                        transform: `translateY(${scrollTop}px)`,
                    });
                }
                const start = (scrollTop / this.heightThumbnail) * this.itemPerLine;
                const end = start + (clientHeight / this.heightThumbnail) * this.itemPerLine;
                this.listOfThumbnailFilter.set(this.listOfThumbnail.slice(start, end));
            } else {
                const is = 0;
                const ie = is + this.itemPerLine;
                this.listOfThumbnailFilter.set(this.listOfThumbnail.slice(is, ie));
            }
        }
        this.updateSynchro();
        setTimeout(() => {
            this.selectThumbnail();
        }, 800);
    }

    /**
     *
     * if scrolling and active thumbnail is not visible add synchro button
     */

    public updateSynchro() {
        if (this.isAutoScrolling) {
            return;
        }
        let visible = true;
        const activeNode = this.activeThumbnail;
        if (activeNode) {
            const positionA = this.storyboardElement.nativeElement.getBoundingClientRect();
            const positionB = activeNode.getBoundingClientRect();
            // check if active element is visible
            const top = positionB.top + activeNode.clientHeight >= positionA.top;
            const bottom = positionB.top - activeNode.clientHeight < this.storyboardElement.nativeElement.clientHeight;
            if (!(top && bottom)) {
                visible = false;
            }
            this.displaySynchro.set(!visible);
            if (this.displaySynchro()) {
                this.startAutoSyncTimer();
            } else if (this.autoSyncTimer !== null) {
                clearTimeout(this.autoSyncTimer);
                this.autoSyncTimer = null;
            }
        } else {
            this.displaySynchro.set(false);
        }
    }

    /**
     * (Re)start the timer that automatically scrolls back to the active thumbnail
     */
    private startAutoSyncTimer() {
        if (this.autoSyncTimer !== null) {
            clearTimeout(this.autoSyncTimer);
        }
        this.autoSyncTimer = setTimeout(() => {
            this.autoSyncTimer = null;
            this.scrollToActiveThumbnail(this.currentTime);
        }, StoryboardPluginComponent.AUTO_SYNC_DELAY);
    }

    /**
     * Postpone the automatic resync while the user is actively browsing the storyboard
     */
    public resetAutoSyncTimer() {
        if (this.displaySynchro() && this.autoSyncTimer !== null) {
            this.startAutoSyncTimer();
        }
    }

    /**
     * Handle to seek to time code
     * @param tc time code
     */
    public seekToTc(tc: number) {
        this.displaySynchro.set(false);
        this.selectedTc = tc;
        this.mediaPlayerElement.getMediaPlayer().playbackRate = 1;
        this.mediaPlayerElement.getMediaPlayer().setCurrentTime(tc);
    }

    /**
     * handle change thumbnail size
     * @param type type interval
     * @param tc time code
     */

    public selectedThumbnailSize(type: string, tc: number) {
        this.selectedInterval = [type, tc];
        this.updateThumbnailSize();
    }

    /**
     * Handle interval
     */
    public updateThumbnailSize() {
        let interval: number = this.selectedInterval[1];
        this.selectedIntervalitem = interval;
        if (this.selectedInterval[0] === "frame") {
            interval = (1 / this.fps) * interval;
        }
        this.listOfThumbnail = range(0, this.duration, interval);
        // close menu
        this.openIntervalList.set(false);
        this.updateScrollHeight();
        this.handleScroll();
        this.selectThumbnail();
    }

    /**
     * Select Thumbnail
     */
    public selectThumbnail() {
        if (this.storyboardElement) {
            const currentTime = this.mediaPlayerElement.getMediaPlayer().getCurrentTime();
            const thumbnailElementNodes = Array.from(
                this.storyboardElement.nativeElement.querySelectorAll<HTMLElement>(".thumbnail"),
            );
            const thumbnailFilteredNodes = thumbnailElementNodes.filter(
                (node) =>
                    currentTime >= parseFloat(node.getAttribute("data-tc")) &&
                    currentTime <= parseFloat(node.getAttribute("data-tc")) + this.selectedIntervalitem,
            );
            if (thumbnailFilteredNodes && thumbnailFilteredNodes.length > 0) {
                thumbnailFilteredNodes.forEach((thumbnailNode) => {
                    this.activeThumbnail = this.storyboardElement.nativeElement.querySelector(".thumbnail.active");
                    if (this.activeThumbnail) {
                        this.activeThumbnail.classList.remove("active");
                    }
                    thumbnailNode.classList.add("active");
                    Object.assign(this.storyboardElement.nativeElement.parentElement.dataset, {
                        scrollTop: this.storyboardElement.nativeElement.parentElement.scrollTop,
                    });
                });
                this.usedSelectedtc = Number(thumbnailFilteredNodes[0].dataset.tc);
                const lastThumbnailFilteredNodes = this.listOfThumbnail[this.listOfThumbnail.length - 1];
                if (this.usedSelectedtc === lastThumbnailFilteredNodes) {
                    this.stopScroll = true;
                }
            }
        }
    }

    /**
     * In charge to update scroll height
     */
    private updateScrollHeight() {
        if (this.storyboardElement) {
            const totalThumbnail = this.listOfThumbnail.length;
            this.heightThumbnail =
                this.storyboardElement.nativeElement.firstElementChild.getBoundingClientRect().height;
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
            const storyBoardHeight = (this.heightThumbnail + 3) * nbLines;
            Object.assign(this.scrollElement.nativeElement.style, {
                height: `${storyBoardHeight}px`,
            });
        }
    }

    public handleThumbnailSizeChange(size: "medium" | "large") {
        this.size = size;
        setTimeout(() => {
            this.updateThumbnailSize();
        }, 250);
    }

    /**
     * Invoked on click button synchro
     */
    public scrollToActiveThumbnail(tc: number, withSeek: boolean = false) {
        this.displaySynchro.set(false);
        this.isAutoScrolling = true;
        this.handleScroll();
        const scrollTop = parseFloat(this.storyboardElement.nativeElement.parentElement.dataset.scrollTop);
        this.storyboardElement.nativeElement.parentElement.scrollTo({ behavior: "smooth", top: scrollTop });
        setTimeout(() => {
            this.isAutoScrolling = false;
        }, 600);
        if (withSeek) {
            setTimeout(() => {
                this.seekToTc(this.currentTime);
            }, 800);
        }
        this.displaySynchro.set(false);
    }

    /**
     * Toggle openList
     */
    public toggleList() {
        this.openIntervalList.update((open) => !open);
    }

    waitAndReload(event: any) {
        if (
            parseInt(event.target.getAttribute("data-retry"), 10) !==
            parseInt(event.target.getAttribute("data-max-retry"), 10)
        ) {
            event.target.setAttribute("data-retry", parseInt(event.target.getAttribute("data-retry"), 10) + 1);
            event.target.src = "/assets/images/placeholder.png";
            setTimeout(() => {
                if (event.target) {
                    event.target.src = event.target.dataset.imgsrc;
                }
            }, 500);
        } else {
            event.target.src = "/assets/images/placeholder.png";
        }
    }

    override ngOnDestroy(): void {
        // Annule un appel "trailing" du throttle TIME_CHANGE encore en attente : le handler
        // (policy 'none') ferait du DOM sur un composant détruit.
        this.throttleTimeChange?.cancel?.();
        if (this.autoSyncTimer !== null) {
            clearTimeout(this.autoSyncTimer);
        }
        super.ngOnDestroy();
    }
}
