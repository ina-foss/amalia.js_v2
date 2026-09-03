import { PluginBase } from "../../core/plugin/plugin-base";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    NgZone,
    Output,
    Renderer2,
    signal,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";
import throttle from "lodash/throttle";
import orderBy from "lodash/orderBy";
import filter from "lodash/filter";
import find from "lodash/find";
import type { DebouncedFunc } from "lodash";
import { PlayerEventType } from "../../core/constant/event-type";
import { ControlBarConfig } from "../../core/config/model/control-bar-config";
import { PluginConfigData } from "../../core/config/model/plugin-config-data";
import { MediaPlayerService } from "../../service/media-player-service";
import { ThumbnailService } from "../../service/thumbnail-service";
import { quantizeThumbnailTc } from "../../core/utils/thumbnail-tc";
import interact from "interactjs";
import { matchesShortcut, Shortcut, ShortcutControl, ShortcutEvent } from "src/app/core/config/model/shortcuts-event";
import { NgClass, NgStyle } from "@angular/common";
import { Tooltip } from "primeng/tooltip";
import { FormsModule } from "@angular/forms";
import { TcFormatPipe } from "../../core/utils/tc-format.pipe";

@Component({
    selector: "amalia-control-bar",
    templateUrl: "./control-bar-plugin.component.html",
    styleUrls: ["./control-bar-plugin.component.scss"],
    encapsulation: ViewEncapsulation.ShadowDom,
    imports: [NgClass, NgStyle, Tooltip, FormsModule, TcFormatPipe],
    // OnPush (phase 7 vague 3) : tout champ lu par le template et muté depuis un listener
    // player, un setTimeout ou un chemin raccourci clavier est un signal — les listeners
    // correspondants passent en policy 'none' (l'écriture de signal programme elle-même le
    // tick, plus de zone.run ni markForCheck). Les champs restés plats sont soit écrits
    // uniquement dans init() (elements/controlsByZone, extractTcIn/Out, enableThumbnail,
    // listOfTracks, listOfSubtitles, defaultRatio, tcOffset — couverts par le listener INIT
    // de PluginBase en 'schedule' → markForCheck), soit mutés seulement par des handlers
    // de template (onProgressBar — l'événement marque la vue), soit non lus par le template
    // (keypressed, playbackrateByImages, indexPlaybackRate, enablePinnedSlider…). Les
    // lectures directes de isPaused()/withMergeVolume dans le template sont couvertes par
    // les listeners PLAYING/PAUSED/ENDED en 'schedule' (notifyPlayStateChanged) et par les
    // événements de template qui les font basculer.
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlBarPluginComponent extends PluginBase<Array<ControlBarConfig>> {
    public static PLUGIN_NAME = "CONTROL_BAR";
    public static DEFAULT_THROTTLE_INVOCATION_TIME = 150;
    /** Fenêtre d'accumulation des clics ±5s (rafale automatique). 400 ms : la cadence
     *  humaine mesurée plafonne à ~6 clics/s (médiane 162 ms, p90 183 ms, max 313 ms) —
     *  à 150 ms, 82 % des clics retombaient dans une fenêtre expirée et étaient traités
     *  en « isolés » (seek immédiat, aucune vignette). */
    public static RAFALE_ACCUMULATION_WINDOW_MS = 400;
    /**
     * Min playback rate
     */
    @Input()
    public minPlaybackRateSlider = -10;

    /**
     * Max playback rate
     */
    @Input()
    public maxPlaybackRateSlider = 10;

    /**
     * Playback rate step
     */
    @Input()
    public stepPlaybackRateSlider = 0.05;

    /**
     * list playback rate step (2/6/8)
     */
    @Input()
    public sliderListOfPlaybackRateStep: Array<number> = [
        -10, -8, -6, -4, -2, -1, -0.5, -0.25, 0, 0.25, 0.5, 1, 2, 4, 6, 8, 10,
    ];

    /**
     * List of playback rate
     */
    @Input()
    public sliderListOfPlaybackRateCustomSteps: Array<number> = [
        -10, -8, -6, -4, -2, -1, -0.5, -0.25, 0, 0.25, 0.5, 1, 2, 4, 6, 8, 10,
    ];
    /**
     * list of backward playback step
     */
    @Input()
    public backwardSlowPlaybackRateStep: Array<number> = [-0.25, -0.5];
    @Input()
    public backwardPlaybackRateStep: Array<number> = [-2, -6, -10];
    /**
     * list of forward playback step
     */
    public listBufferSize: Array<number> = [120, 180, 240];
    // public defaultBufferSize = 12;
    @Input()
    public forwardPlaybackRateStep: Array<number> = [2, 6, 10];
    @Input()
    public forwardSlowPlaybackRateStep: Array<number> = [0.25, 0.5];
    public sliderListOfPlaybackRateStepWidth: Array<number> = [];
    public posPlaybackrates: Array<number> = [];
    public negPlaybackrates: Array<number> = [];
    public maxCursor: number;
    public minCursor: number;
    public extractTcIn?: number = null;
    public extractTcOut?: number = null;
    public onProgressBar = false;
    // handle slider drag
    @ViewChild("dragThumb")
    public dragElement: ElementRef;
    public sliderPosition = 0;
    public moving = false;
    /**
     * Player playback rate — signal : muté par PLAYBACK_RATE_CHANGE ('none') et le drag interactjs.
     */
    public readonly currentPlaybackRate = signal(1);
    /**
     * Player playbackrate slider 1 — signal : muté avec currentPlaybackRate.
     */
    public readonly currentPlaybackRateSlider = signal(1);
    /**
     * Playbackrate slider state — signal : muté par displaySlider() (raccourci clavier possible).
     */
    public readonly enablePlaybackSlider = signal(false);
    /**
     * Pinned Controls state — signal : muté par pinControls() (raccourci clavier possible).
     */
    public readonly pinnedSlider = signal(false);
    /**
     * Pinned slider state (non lu par le template)
     */
    public enablePinnedSlider = false;
    /**
     *  Pinned slider and ControlBar — signal : muté avec pinnedSlider/enablePlaybackSlider.
     */
    public readonly pinned = signal(false);
    /**
     * Enable Menu — signal : muté par DOCUMENT_CLICK ('none') et les raccourcis.
     */
    public readonly enableMenu = signal(false);
    /**
     * In charge to notify download event
     */
    @Output()
    public callback = new EventEmitter<any>();

    /**
     * Volume left side — signal : muté par les raccourcis clavier (SHORTCUT_KEYDOWN 'none')
     * et mute/unmute ; lié en [(ngModel)] (two-way binding de signal).
     */
    public readonly volumeLeft = signal(50);

    /**
     * Volume right side — signal : idem volumeLeft.
     */
    public readonly volumeRight = signal(50);

    /**
     * Selected aspectRatio — signal : muté par ASPECT_RATIO_CHANGE ('none').
     */
    public readonly aspectRatio = signal<"16:9" | "4:3">("4:3");
    /**
     * Default aspect ratio (écrit uniquement dans init(), couvert par INIT 'schedule')
     */
    public defaultRatio;
    /**
     * return current time — signal : muté par TIME_CHANGE/DURATION_CHANGE ('none') et le drag.
     * Non dérivé de playback.displayTime() : pendant un drag en mode inverse, SEEKING est émis
     * avec duration-currentTime, le store ne peut donc pas restituer exactement ce champ.
     */
    public readonly currentTime = signal(0);
    /**
     * currentime affiché — signal : écrit exactement là où l'ancien champ l'était
     * (handleOnTimeChange applique inverse, handleOnDurationChange ne l'applique pas,
     * moveSliderCursor n'y touche pas) — pas un computed pour préserver ces nuances.
     */
    public readonly time = signal(0);
    /**
     * inverse display currentime — signal : muté par prevPlaybackRate (raccourci possible).
     */
    public readonly inverse = signal(false);

    /**
     * Progress bar value — signal : muté par TIME_CHANGE ('none') et le drag.
     */
    public readonly progressBarValue = signal(0);
    /**
     * Media duration — signal : muté par DURATION_CHANGE ('none') et resynchronisé dans init().
     */
    public readonly duration = signal(0);
    /**
     * List of Controls — signal : reconstruit par handleDisplayState (PLAYER_RESIZED 'none') ;
     * son écriture (nouvelle référence à chaque appel) notifie aussi la vue pour les champs
     * plats rafraîchis au même moment (elements/controlsByZone réordonnés, displayState).
     */
    public readonly controls = signal<Array<ControlBarConfig>>([]);
    public indexPlaybackRate = 3;
    /**
     * In sliding — signal (état du drag de la barre de progression).
     */
    public readonly inSliding = signal(false);
    /**
     * keypressed
     */
    public keypressed = "";
    /**
     * Volume slider state — signal : muté par les timeouts de volumeMouseEnter/applyShortcut.
     */
    public readonly enableVolumeSlider = signal(false);
    /**
     * Menu list ratio state — signal : muté par le timeout d'aspectRatioMouseEnter.
     */
    public readonly enableListRatio = signal(false);
    public readonly openPisteAudio = signal(false);
    /**
     * position of subtitles — signal : muté par updateSubtitlePosition (raccourci possible).
     */
    public readonly subtitlePosition = signal("none");
    /**
     * default label subtitle — signal : muté avec subtitlePosition.
     */
    public readonly selectedLabel = signal("Aucun (original)");
    /**
     * List positions subtitle state — signal : muté par hideAll() (timeouts/raccourcis).
     */
    public readonly enableListPositionsSubtitle = signal(false);
    /**
     * List of control for Zone 1
     */
    private _elements: Array<ControlBarConfig> = [];
    /**
     * Contrôles indexés par zone. getControlsByZone est appelé depuis un @for du template
     * (une fois par colonne et par cycle de change detection) : le cache évite de re-filtrer
     * la liste complète à chaque CD. Invalidé par le setter de `elements`.
     */
    private _controlsByZone: Map<number, Array<ControlBarConfig>> | null = null;

    get elements(): Array<ControlBarConfig> {
        return this._elements;
    }

    set elements(value: Array<ControlBarConfig>) {
        this._elements = value;
        if (!value) {
            this._controlsByZone = null;
            return;
        }
        this._controlsByZone = new Map();
        // Certaines configurations fournissent un objet au lieu d'un tableau ; l'ancien
        // _.filter itérait alors ses valeurs (sémantique lodash « collection »).
        const controls: ControlBarConfig[] = Array.isArray(value) ? value : Object.values(value);
        for (const control of controls) {
            const zoneControls = this._controlsByZone.get(control.zone);
            if (zoneControls) {
                zoneControls.push(control);
            } else {
                this._controlsByZone.set(control.zone, [control]);
            }
        }
    }
    /**
     * State of controlBar — signal : muté par PLAYER_MOUSE_ENTER/LEAVE ('none', chemin chaud).
     */
    public readonly activated = signal(false);
    /**
     * display state (s/m/l) — signal : muté par PLAYER_RESIZED ('none').
     */
    public readonly displayState = signal<string>("l");
    /**
     * FullScreenMode state — signal : muté par PLAYER_RESIZED ('none').
     */
    public readonly fullScreenMode = signal(false);
    /**
     * slider displayed — signal : lu par le drag interactjs hors CD.
     */
    public readonly selectedSlider = signal("slider1");
    /**
     * show menu slider
     */
    public enableMenuSlider = false;
    /**
     * clicked button volume
     */
    public clickedVolume = false;
    /**
     * list position subtitles (troisième entrée = valeurs initiales de selectedLabel/
     * subtitlePosition, comme avant leur passage en signals)
     */
    public listOfSubtitles = [
        { label: "Bas", key: "down" },
        {
            label: "Haut",
            key: "up",
        },
        { label: "Aucun (original)", key: "none" },
    ];
    /**
     * progressBar element
     */
    @ViewChild("progressBar")
    public progressBarElement: ElementRef<HTMLElement>;
    /**
     * Handle thumbnail
     */
    private readonly thumbnailService: ThumbnailService;
    /** Timecode de la vignette de survol — signal : muté par les mousemove de drag/survol. */
    public readonly tcThumbnail = signal(0);
    public enableThumbnail = false;
    private thumbnailConfigInitialized = false;
    /** Visibilité de la vignette — signal : mutée par les handlers de drag. */
    public readonly thumbnailHidden = signal(true);
    /** Position de la vignette — signal : mutée par les mousemove de drag/survol. */
    public readonly thumbnailPosition = signal(0);
    @ViewChild("thumbnail")
    public thumbnailElement: ElementRef<HTMLElement>;
    @ViewChild("thumbnailContainer")
    public thumbnailContainer: ElementRef<HTMLElement>;
    @ViewChild("controlBarContainer")
    public controlBarContainer: ElementRef<HTMLElement>;
    @ViewChild("volumeButton")
    public volumeButton: ElementRef<HTMLElement>;
    /**
     * list of shortcuts
     */
    public listOfShortcuts: Array<ShortcutControl> = [];
    // Menu of controls
    @ViewChild("controlsMenu")
    public controlsMenu: ElementRef<HTMLElement>;
    public throttleFunc;
    // slider volume
    @ViewChild("leftVolumeSlider")
    public leftVolumeSlider: ElementRef;
    @ViewChild("rightVolumeSlider")
    public rightVolumeSlider: ElementRef;
    public playbackrateByImages = false;
    public listOfTracks: Array<{ label: string; track: string }> = [];
    /** Piste audio sélectionnée — signal (écrite dans initTracks et changeAudioTrack). */
    public readonly selectedTrack = signal<string | null>(null);
    public readonly selectedTrackLabel = signal("");
    @ViewChild("displaySlider")
    displaySliderElement: ElementRef;
    @ViewChild("pinControls")
    pinControlsElement: ElementRef;
    aspectRatioMouseEnterTimeOut: any;
    volumeMouseEnterTimeOut: any;
    /**
     * Picture player magnify state — signal : muté par PICTURE_MAGNIFY ('none', remplace
     * l'ancien ngZone.run + markForCheck).
     */
    public readonly magnifyEnabled = signal(false);
    /**
     * Picture player crop mode state — signal (remplace le markForCheck manuel).
     */
    public readonly cropModeEnabled = signal(false);
    /**
     * Picture player annotation mode state ('draw' | 'text' | 'erase' | null) — signal
     * (remplace le markForCheck manuel).
     */
    public readonly annotationMode = signal<"draw" | "text" | "erase" | null>(null);
    /**
     * Available annotation colors
     */
    public readonly annotationColors: string[] = [
        "#ff0000",
        "#ff9800",
        "#ffeb3b",
        "#4caf50",
        "#2196f3",
        "#ffffff",
        "#000000",
    ];
    /**
     * Available annotation stroke sizes (label + line width + font size)
     */
    public readonly annotationSizes: { label: string; lineWidth: number; fontSize: number }[] = [
        { label: "Fine", lineWidth: 2, fontSize: 16 },
        { label: "Moyenne", lineWidth: 5, fontSize: 24 },
        { label: "Large", lineWidth: 10, fontSize: 40 },
    ];
    /**
     * Currently selected annotation color — signal (remplace le markForCheck manuel).
     */
    public readonly annotationColor = signal<string>("#ff0000");
    /**
     * Currently selected annotation stroke width — signal (remplace le markForCheck manuel).
     */
    public readonly annotationLineWidth = signal<number>(5);
    /**
     * Picture player current zoom level (%) — signal : muté par PICTURE_ZOOM_CHANGE ('none',
     * remplace l'ancien ngZone.run + markForCheck).
     */
    public readonly pictureZoomLevel = signal(100);
    private pendingFrameJump = 0;
    /**
     * true tant que le listener mouseup de niveau document (drag du slider) est attaché.
     */
    private documentMouseUpAttached = false;
    /**
     * true dès qu'un mousemove survient pendant le geste sur la barre — distingue le vrai
     * drag (seeks live + accurate_seek à l'atterrissage) du clic simple (seek classique).
     */
    private sliderMoved = false;
    /**
     * Throttlé (leading + trailing + maxWait) : exécute le saut accumulé au plus tard
     * toutes les RAFALE_ACCUMULATION_WINDOW_MS pendant une rafale de clics ±5s —
     * l'image suit les clics (l'ancien debounce trailing-only gelait l'image jusqu'à
     * la fin de la rafale).
     */
    private readonly throttledSeek: DebouncedFunc<() => void>;
    /**
     * Mode slide : seek réel throttlé pendant le drag du slider (leading + trailing,
     * cadence DEFAULT_THROTTLE_INVOCATION_TIME). La cible est lue au moment du tir, pas capturée.
     */
    private readonly throttledLiveSeek: DebouncedFunc<() => void>;

    constructor(
        playerService: MediaPlayerService,
        thumbnailService: ThumbnailService,
        private readonly renderer: Renderer2,
        private readonly cdr: ChangeDetectorRef,
        private readonly ngZone: NgZone,
    ) {
        super(playerService);
        this.pluginName = ControlBarPluginComponent.PLUGIN_NAME;
        this.thumbnailService = thumbnailService;
        this.throttleFunc = throttle(this.updateThumbnail, ControlBarPluginComponent.DEFAULT_THROTTLE_INVOCATION_TIME);
        this.throttledSeek = throttle(
            () => this.executeFrameJump(),
            ControlBarPluginComponent.RAFALE_ACCUMULATION_WINDOW_MS,
        );
        this.throttledLiveSeek = throttle(
            () => this.executeLiveSeek(),
            ControlBarPluginComponent.DEFAULT_THROTTLE_INVOCATION_TIME,
        );
    }

    override ngOnDestroy(): void {
        // Annule les appels "trailing" encore en attente : ils déreférenceraient un
        // mediaPlayer disposé après teardown.
        this.throttledSeek.cancel();
        this.throttledLiveSeek.cancel();
        this.throttleFunc?.cancel?.();
        this.pendingFrameJump = 0;
        this.detachDocumentMouseUp();
        super.ngOnDestroy();
    }

    listenToDisplaySliderDisplayChanges() {
        const sliderDisplayStyle = getComputedStyle(this.displaySliderElement.nativeElement).display;
        const displaySliderOff = !this.displaySliderElement || sliderDisplayStyle === "none";
        const svgPinControls = this.pinControlsElement.nativeElement.querySelector("svg");
        if (displaySliderOff) {
            svgPinControls && this.renderer.removeClass(svgPinControls, "amalia-svg-pin-size");
        } else {
            svgPinControls && this.renderer.addClass(svgPinControls, "amalia-svg-pin-size");
        }
    }

    listenToPinControlsDisplayChanges() {
        const pinControlsDisplayStyle = getComputedStyle(this.pinControlsElement.nativeElement).display;
        const pinControlsOff = !this.pinControlsElement || pinControlsDisplayStyle === "none";
        const svgDisplaySlider = this.displaySliderElement.nativeElement.querySelector("svg");
        if (pinControlsOff) {
            svgDisplaySlider && this.renderer.removeClass(svgDisplaySlider, "amalia-svg-slider-size");
        } else {
            svgDisplaySlider && this.renderer.addClass(svgDisplaySlider, "amalia-svg-slider-size");
        }
    }

    updatePinAndSpeedSliderPositions(): void {
        if (this.displaySliderElement && this.pinControlsElement) {
            this.listenToDisplaySliderDisplayChanges();
            this.listenToPinControlsDisplayChanges();
        } else if (!this.displaySliderElement && this.pinControlsElement) {
            const svgPinControls = this.pinControlsElement.nativeElement.querySelector("svg");
            svgPinControls && this.renderer.removeClass(svgPinControls, "amalia-svg-pin-size");
        } else if (!this.pinControlsElement && this.displaySliderElement) {
            const svgDisplaySlider = this.displaySliderElement.nativeElement.querySelector("svg");
            svgDisplaySlider && this.renderer.removeClass(svgDisplaySlider, "amalia-svg-slider-size");
        }
    }

    override init() {
        super.init();
        this.elements = this.pluginConfiguration?.data || [];
        // init playbackrates
        this.initPlaybackrates();
        // init volume — use defaultVolume from config to preserve volume across DOM moves
        const defaultVolume = (this.mediaPlayerElement.getConfiguration?.() as any)?.player?.defaultVolume ?? 50;
        this.mediaPlayerElement.getMediaPlayer()?.setVolume(defaultVolume);
        // init shortcuts
        this.initShortcuts(this.pluginConfiguration?.data || []);
        // Enable thumbnail
        // init() can be re-run (INIT/METADATA_LOADED re-init, grid re-attach) with a
        // mediaPlayerElement whose configuration is momentarily incomplete. Once resolved once,
        // don't let a transient missing thumbnail config silently disable an already-working
        // hover preview — only re-evaluate when a thumbnail config is actually present.
        const thumbnailConfig = this.mediaPlayerElement.getConfiguration().thumbnail;
        if (thumbnailConfig || !this.thumbnailConfigInitialized) {
            this.enableThumbnail =
                (thumbnailConfig && thumbnailConfig.baseUrl !== "" && thumbnailConfig.enableThumbnail) || false;
            this.thumbnailConfigInitialized = true;
        }

        const configuration = this.mediaPlayerElement.getConfiguration();
        this.extractTcIn = configuration.extractTcIn !== undefined ? configuration.extractTcIn : null;
        this.extractTcOut = configuration.extractTcOut !== undefined ? configuration.extractTcOut : null;

        // Show thumbnail when tc = 0
        if (this.enableThumbnail) {
            const url = this.mediaPlayerElement.getThumbnailUrl(0, true);
            this.setThumbnail(url, 0);
        }
        // fixed controlBar
        const fixedControlBar = this.pluginConfiguration?.fixed;
        if (fixedControlBar) {
            this.fixControlBar();
        }
        // pinned controls
        const pinnedControlBarWithControls = this.pluginConfiguration?.pinnedControls;
        if (pinnedControlBarWithControls && !this.pinnedSlider()) {
            this.applyPinnedControlsState(true);
        }

        // Resync slider position with the real media state (handles DOM reattachment on player deploy/detach)
        const player = this.mediaPlayerElement.getMediaPlayer();
        this.duration.set(player?.getDuration());
        this.currentTime.set(player?.getCurrentTime());
        if (!isNaN(this.currentTime()) && !isNaN(this.duration()) && this.duration() > 0) {
            this.progressBarValue.set(parseFloat(((this.currentTime() / this.duration()) * 100).toFixed(6)));
        }

        // Init Events — policy 'none' (phase 7 OnPush) : ces handlers n'écrivent que des
        // signals (l'écriture programme le tick) et/ou font du DOM pur — plus de zone.run
        // ni de markForCheck, y compris sur les chemins chauds TIME_CHANGE et MOUSE_ENTER/LEAVE.
        this.addListener(
            this.mediaPlayerElement.eventEmitter,
            PlayerEventType.DURATION_CHANGE,
            this.handleOnDurationChange,
            { policy: "none" },
        );
        this.addListener(
            this.mediaPlayerElement.eventEmitter,
            PlayerEventType.PLAYBACK_RATE_CHANGE,
            this.handlePlaybackRateChange,
            { policy: "none" },
        );
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.TIME_CHANGE, this.handleOnTimeChange, {
            policy: "none",
        });
        this.addListener(
            this.mediaPlayerElement.eventEmitter,
            PlayerEventType.ASPECT_RATIO_CHANGE,
            this.handleAspectRatioChange,
            { policy: "none" },
        );
        this.addListener(
            this.mediaPlayerElement.eventEmitter,
            PlayerEventType.PLAYER_MOUSE_ENTER,
            this.handlePlayerMouseenter,
            { policy: "none" },
        );
        this.addListener(
            this.mediaPlayerElement.eventEmitter,
            PlayerEventType.PLAYER_MOUSE_LEAVE,
            this.handlePlayerMouseleave,
            { policy: "none" },
        );
        this.addListener(
            this.mediaPlayerElement.eventEmitter,
            PlayerEventType.PLAYER_RESIZED,
            this.handleWindowResize,
            { policy: "none" },
        );
        this.addListener(
            this.mediaPlayerElement.eventEmitter,
            PlayerEventType.PICTURE_ZOOM_CHANGE,
            this.handlePictureZoomChange,
            { policy: "none" },
        );
        this.addListener(
            this.mediaPlayerElement.eventEmitter,
            PlayerEventType.PICTURE_MAGNIFY,
            this.handlePictureMagnifyChange,
            { policy: "none" },
        );
        this.addListener(
            this.mediaPlayerElement.eventEmitter,
            PlayerEventType.SHORTCUT_KEYDOWN,
            this.handleShortcuts,
            { policy: "none" },
        );
        this.addListener(
            this.mediaPlayerElement.eventEmitter,
            PlayerEventType.DOCUMENT_CLICK,
            this.hideControlsMenuOnClickDocument,
            { policy: "none" },
        );
        this.addListener(
            this.mediaPlayerElement.eventEmitter,
            PlayerEventType.PLAYER_SIMULATE_SLIDER,
            this.handlePlaybackRateChangeByImages,
            { policy: "none" },
        );
        this.addListener(
            this.mediaPlayerElement.eventEmitter,
            PlayerEventType.PLAYER_STOP_SIMULATE_PLAY,
            this.handlePlaybackRateChangeByImagesStop,
            { policy: "none" },
        );
        // Le template lit directement mediaPlayerElement.getMediaPlayer()?.isPaused() (icônes
        // play/pause) : sous OnPush, PLAYING/PAUSED/ENDED en 'schedule' marquent la vue pour
        // ré-évaluer ces expressions non-signal (déclenchés hors clic template, ex. API host).
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.PLAYING, this.notifyPlayStateChanged, {
            policy: "schedule",
        });
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.PAUSED, this.notifyPlayStateChanged, {
            policy: "schedule",
        });
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.ENDED, this.notifyPlayStateChanged, {
            policy: "schedule",
        });
        // Set default aspect ratio
        this.getDefaultAspectRatio();
        this.handleDisplayState();
        this.initTracks();
    }

    /**
     * Handler volontairement vide : le wrapper 'schedule' de PluginBase.addListener fait le
     * markForCheck — seule notification nécessaire pour ré-évaluer les lectures template
     * directes de isPaused() (voir enregistrements PLAYING/PAUSED/ENDED dans init()).
     */
    private notifyPlayStateChanged() {
        // markForCheck via la policy 'schedule'
    }

    /**
     * Events
     */
    /**
     * Invoked on duration change
     */

    private handleOnDurationChange() {
        this.currentTime.set(this.mediaPlayerElement.getMediaPlayer()?.getCurrentTime());
        this.time.set(this.currentTime());
        this.duration.set(this.mediaPlayerElement.getMediaPlayer()?.getDuration());
    }

    /**
     * Invoked time change event for :
     * - update progress bar
     */

    private handleOnTimeChange() {
        // Pendant le drag, chaque seek live renvoie TIME_CHANGE en écho ;
        // currentTime/time sont tenus par handleProgressBarMouseMove, ne pas les écraser.
        if (this.inSliding()) {
            return;
        }
        this.currentTime.set(this.mediaPlayerElement.getMediaPlayer()?.getCurrentTime());
        if (!this.inSliding() && !isNaN(this.currentTime())) {
            this.progressBarValue.set(parseFloat(((this.currentTime() / this.duration()) * 100).toFixed(6)));
        }
        if (this.inverse() === false) {
            this.time.set(this.currentTime());
        } else {
            this.time.set(this.duration() - this.currentTime());
        }
    }

    /**
     * SIMULATE SEEKING
     */

    public handlePlaybackRateChangeByImages() {
        this.playbackrateByImages = true;
    }

    /**
     * stop simulate seeking
     */
    public handlePlaybackRateChangeByImagesStop() {
        this.playbackrateByImages = false;
    }

    /**
     * Invoked on playback change
     * @param playbackRate playback rate
     */

    private handlePlaybackRateChange(playbackRate: number) {
        this.logger.info("Handle playback rate change", playbackRate);
        if (this.mediaPlayerElement.getMediaPlayer()?.isPaused() && playbackRate !== 1) {
            this.mediaPlayerElement.getMediaPlayer()?.play();
        }
        this.currentPlaybackRate.set(playbackRate);
        if (playbackRate === 1) {
            setTimeout(() => this.selectActivePlaybackrate(), 10);
        }
        if (this.currentPlaybackRate() >= 1 || this.currentPlaybackRate() <= -1) {
            this.currentPlaybackRateSlider.set(Math.round(this.currentPlaybackRate()));
        } else {
            this.currentPlaybackRateSlider.set(this.currentPlaybackRate());
        }
    }

    /**
     * Invoked on aspect ratio change
     * @param event aspect ratio
     */

    private handleAspectRatioChange(event) {
        this.aspectRatio.set(event);
    }

    /**
     * Invoked player mouse enter event for :
     * - animate controlBar
     */

    private handlePlayerMouseenter() {
        this.activated.set(true);
    }

    /**
     * Invoked player mouse leave event for :
     * - animate controlBar
     */

    private handlePlayerMouseleave() {
        this.activated.set(false);
    }

    /**
     * Update displayState on windowResize
     */

    public handleWindowResize() {
        this.handleDisplayState();
        // handle full screen on esc press
        this.fullScreenMode.set(document.fullscreenElement !== null);
    }

    // Écriture de signal pure : plus besoin de ngZone.run + markForCheck (phase 7) — le
    // scheduler hybride programme le tick même quand l'événement arrive hors zone.
    public handlePictureZoomChange(zoomLevel: number) {
        this.pictureZoomLevel.set(zoomLevel ?? 100);
    }

    public handlePictureMagnifyChange(event: CustomEvent) {
        this.magnifyEnabled.set(event.detail?.magnify ?? false);
    }

    /**
     * Apply shortcut if exists on keydown
     */

    public handleShortcuts(event: ShortcutEvent) {
        if (event.targets.find((target) => target.toLowerCase() === this.pluginName.toLowerCase())) {
            this.applyShortcut(event);
        }
    }

    /**
     * Progress bar on mouse move
     * @param event mouse event
     */
    public handleProgressBarMouseMove(event) {
        if (this.inSliding()) {
            const value = this.getMouseValue(event);
            this.progressBarValue.set(value);
            this.currentTime.set((value * this.duration()) / 100);
            if (this.inverse() === false) {
                this.time.set(this.currentTime());
            } else {
                this.time.set(this.duration() - this.currentTime());
            }
            this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.SEEKING, this.time());
            // Glissement automatique : l'image vidéo suit le curseur pendant le geste.
            this.sliderMoved = true;
            this.throttledLiveSeek();
            // Pas de petite vignette pendant le drag (spec) : l'overlay plein cadre (SEEKING
            // ci-dessus) assure seul le retour visuel, la vignette hover reste cachée.
        }
    }

    /**
     * Handle callback
     */
    public handleCallback(control: ControlBarConfig) {
        this.callback.emit(control);
    }

    public hideControlsMenuOnClickDocument() {
        // click outside the player
        if (this.enableMenu()) {
            this.enableMenu.set(!this.enableMenu());
        }
    }

    /**
     * Return plugin configuration
     */
    getDefaultConfig(): PluginConfigData<Array<ControlBarConfig>> {
        const listOfControls = new Array<ControlBarConfig>();
        listOfControls.push({ label: "Barre de progression", control: "progressBar", priority: 1 });
        listOfControls.push({ label: "Play / Pause", control: "playPause", zone: 2, priority: 1 });
        listOfControls.push({
            label: "Fullscreen",
            control: "toggleFullScreen",
            icon: "fullscreen",
            zone: 3,
            priority: 1,
        });
        return {
            name: ControlBarPluginComponent.PLUGIN_NAME,
            data: listOfControls,
        };
    }

    /**
     * init array of shortcuts
     */
    public initShortcuts(data: Array<ControlBarConfig>) {
        this.listOfShortcuts = [];
        for (const i in data) {
            if (typeof data[i] === "object") {
                const controlConfig = data[i];
                if (typeof controlConfig.key !== "undefined" && typeof controlConfig.control !== "undefined") {
                    let key = controlConfig.key
                        .replace("Control", "")
                        .replace("Shift", "")
                        .replace("Alt", "")
                        .replace("Meta", "")
                        .replaceAll("+", "")
                        .replaceAll(" ", "")
                        .toLowerCase();
                    const shortCut: Shortcut = {
                        key,
                        ctrl:
                            controlConfig.key.includes("Control") ||
                            controlConfig.key.includes("Ctrl") ||
                            controlConfig.key.includes("control") ||
                            controlConfig.key.includes("ctrl"),
                        shift: controlConfig.key.includes("Shift") || controlConfig.key.includes("shift"),
                        alt: controlConfig.key.includes("Alt") || controlConfig.key.includes("alt"),
                        meta: controlConfig.key.includes("Meta") || controlConfig.key.includes("meta"),
                    };

                    const shortcutControl: ShortcutControl = {
                        shortcut: shortCut,
                        control: controlConfig.control,
                    };
                    this.listOfShortcuts.push(shortcutControl);
                }
            }
        }
    }

    /**
     * If key is declared in config apply control
     */
    public applyShortcut(shortcutToBeApplied: ShortcutEvent) {
        let shortcutFound = false;
        for (const shortcutControl of this.listOfShortcuts) {
            if (shortcutFound === false && matchesShortcut(shortcutControl, shortcutToBeApplied.shortcut)) {
                this.keypressed = shortcutControl.shortcut.key;
                if (shortcutControl.control === "volume") {
                    this.handleMuteUnmuteVolume();
                } else {
                    this.controlClicked(shortcutControl.control);
                }
                shortcutFound = true;
            }
        }
        const volumeUpShortcut: ShortcutControl = {
            shortcut: { key: "arrowup", ctrl: false, shift: false, alt: false, meta: false },
            control: "volume",
        };
        const volumeDownShortcut: ShortcutControl = {
            shortcut: { key: "arrowdown", ctrl: false, shift: false, alt: false, meta: false },
            control: "volume",
        };
        if (matchesShortcut(volumeUpShortcut, shortcutToBeApplied.shortcut)) {
            this.volumeButton.nativeElement.dispatchEvent(new MouseEvent("mouseenter"));
            this.volumeRight.set(Math.min(this.volumeRight() + 5, 100));
            this.volumeLeft.set(Math.min(this.volumeLeft() + 5, 100));
            if (this.volumeMouseEnterTimeOut) {
                clearTimeout(this.volumeMouseEnterTimeOut);
            }
            this.volumeMouseEnterTimeOut = setTimeout(() => {
                this.hideAll();
            }, 1500);
        }
        if (matchesShortcut(volumeDownShortcut, shortcutToBeApplied.shortcut)) {
            this.volumeButton.nativeElement.dispatchEvent(new MouseEvent("mouseenter"));
            this.volumeRight.set(Math.max(this.volumeRight() - 5, 0));
            this.volumeLeft.set(Math.max(this.volumeLeft() - 5, 0));
            if (this.volumeMouseEnterTimeOut) {
                clearTimeout(this.volumeMouseEnterTimeOut);
            }
            this.volumeMouseEnterTimeOut = setTimeout(() => {
                this.hideAll();
            }, 1500);
        }
    }

    /**
     * Invoked seek time
     * @param time number
     */
    public seekTo(time: number) {
        if (this.mediaPlayerElement.getMediaPlayer()) {
            this.mediaPlayerElement.getMediaPlayer().setCurrentTime(time);
        }
    }

    /**
     * Mode rafale : tant que des clics ±5s s'accumulent entre deux exécutions throttlées
     * (pendingFrameJump non consommé), la frame réelle ne peut pas suivre le rythme des
     * fragments HLS — on émet SEEKING avec la cible projetée pour que le player affiche
     * la vignette de prévisualisation, comme pendant le drag du slider. Un clic isolé
     * (leading déjà exécuté, pendingFrameJump remis à 0) n'émet rien : la frame réelle
     * arrive assez vite, inutile de mobiliser des vignettes. N'est appelé qu'en mode rafale.
     */
    private previewPendingJumpTarget(mediaPlayer: any): void {
        if (this.pendingFrameJump === 0) return;
        const duration = mediaPlayer.getDuration();
        let target = mediaPlayer.getCurrentTime() + this.pendingFrameJump / mediaPlayer.framerate;
        if (Number.isFinite(duration) && duration > 0) {
            target = Math.min(target, duration - 1 / mediaPlayer.framerate);
        }
        this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.SEEKING, Math.max(0, target));
    }

    /**
     * Exécute le saut de frames accumulé (throttlé). Seek pur, sans pauseOnly()/play() :
     * un seek pendant la lecture ne l'interrompt pas, et en pause il peint la nouvelle
     * frame — supprime la course play()/pause() (AbortError) au rythme de la fenêtre rafale.
     */
    private executeFrameJump(): void {
        if (this.pendingFrameJump === 0) return;

        const mediaPlayer = this.mediaPlayerElement?.getMediaPlayer();
        if (!mediaPlayer) {
            this.pendingFrameJump = 0;
            return;
        }

        const frames = this.pendingFrameJump;
        this.pendingFrameJump = 0;
        if (frames > 0) {
            mediaPlayer.moveNextFrame(frames);
        } else {
            mediaPlayer.movePrevFrame(-frames);
        }
    }

    /**
     * Seek réel pendant le drag (throttlé). La cible est lue au moment du tir
     * dans progressBarValue (tenu par handleProgressBarMouseMove) — le trailing seek là où
     * la souris est réellement, pas sur une capture vieille de 150 ms. Seek pur, sans
     * pauseOnly()/play() (même doctrine anti-AbortError qu'executeFrameJump) ; la
     * restauration du playbackRate reste au mouseup (moveSliderCursor).
     */
    private executeLiveSeek(): void {
        if (!this.inSliding()) {
            return;
        }
        const mediaPlayer = this.mediaPlayerElement?.getMediaPlayer();
        if (!mediaPlayer) {
            return;
        }
        const position = (this.progressBarValue() * this.duration()) / 100;
        if (!isFinite(position)) {
            return;
        }
        if (mediaPlayer.reverseMode === true) {
            mediaPlayer.setCurrentTime(this.duration() - position);
        } else {
            // Miroir de moveSliderCursor : stoppe la simulation par images avant le seek
            // (le clearInterval côté player est idempotent).
            this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.PLAYBACK_CLEAR_INTERVAL);
            mediaPlayer.setCurrentTime(position);
        }
    }

    /**
     * Invoked player with specified control function name
     * @param control control name
     */
    public controlClicked(control: string) {
        this.logger.debug("Click to control", control);
        const mediaPlayer = this.mediaPlayerElement.getMediaPlayer();
        const picturePlayer = this.mediaPlayerElement.getPicturePlayer();

        if (!mediaPlayer && !picturePlayer) {
            this.logger.warn("Control not implemented", control);
            return;
        }
        this.closeMenuIfOpen();

        if (this.handlePictureControl(control)) {
            return;
        }

        if (!mediaPlayer) {
            this.logger.warn("Control not implemented", control);
            return;
        }

        const paused = mediaPlayer.isPaused();

        if (this.handleTimelineControl(control, mediaPlayer, paused)) {
            return;
        }

        const actions: Record<string, () => void> = {
            playPause: () => mediaPlayer.playPause(),
            volume: () => this.toggleVolume(),
            viewRatio: () => mediaPlayer.playPause(),
            screenshot: () => mediaPlayer.captureImage(100),
            backward: () => this.prevPlaybackRate(),
            "slow-backward": () => this.prevSlowPlaybackRate(),
            "backward-start": () => {
                this.changePlaybackRate(1);
                mediaPlayer.seekToBegin();
            },
            forward: () => this.nextPlaybackRate(),
            "slow-forward": () => this.nextSlowPlaybackRate(),
            "forward-end": () => {
                this.changePlaybackRate(1);
                mediaPlayer.seekToEnd();
            },
            displaySlider: () => this.displaySlider(),
            pinControls: () => this.pinControls(),
            toggleFullScreen: () => this.toggleFullScreen(),
            aspectRatio: () => this.changeAspectRatio(),
            subtitles: () => this.updateSubtitlePosition(),
            download: () => this.downloadUrl(control),
        };

        const action = actions[control];
        if (action) {
            action();
            return;
        }
        this.logger.warn("Control not implemented", control);
    }

    private closeMenuIfOpen(): void {
        if (this.enableMenu()) {
            this.enableMenu.set(false);
        }
    }

    private handlePictureControl(control: string): boolean {
        const picturePlayer = this.mediaPlayerElement.getPicturePlayer();
        if (control === "magnify") {
            picturePlayer?.magnify();
            return true;
        }

        const pictureActions: Record<string, () => void> = {
            rotate: () => picturePlayer?.rotate(),
            fliph: () => picturePlayer?.flipH(),
            flipv: () => picturePlayer?.flipV(),
            fullsize: () => picturePlayer?.showRealSize(),
            fullscreen: () => this.toggleFullScreen(),
            fitToScreen: () => picturePlayer?.fitToScreen(),
            zoomIn: () => picturePlayer?.zoom(),
            zoomOut: () => picturePlayer?.unZoom(),
            pinControls: () => this.pinControls(),
            center: () => picturePlayer?.center(),
            crop: () => this.toggleCropMode(picturePlayer),
            draw: () => this.toggleAnnotationMode(picturePlayer, "draw"),
            text: () => this.toggleAnnotationMode(picturePlayer, "text"),
            erase: () => this.toggleAnnotationMode(picturePlayer, "erase"),
            reset: () => {
                picturePlayer?.clearAnnotations();
                if (this.annotationModeEnabled) {
                    picturePlayer?.disableAnnotationMode();
                    this.setAnnotationMode(null);
                }
            },
            snapshot: () => {
                const snapshot = picturePlayer?.takeSnapshot();
                if (snapshot) {
                    this.downloadSnapshot(snapshot);
                }
            },
        };

        const action = pictureActions[control];
        if (!action) {
            return false;
        }
        if (!this.magnifyEnabled()) {
            action();
        }
        return true;
    }

    public get drawModeEnabled(): boolean {
        return this.annotationMode() === "draw";
    }

    public get textModeEnabled(): boolean {
        return this.annotationMode() === "text";
    }

    public get eraseModeEnabled(): boolean {
        return this.annotationMode() === "erase";
    }

    public get annotationModeEnabled(): boolean {
        return this.annotationMode() !== null;
    }

    @HostListener("document:keydown.escape")
    public onEscapeKey(): void {
        const picturePlayer = this.mediaPlayerElement.getPicturePlayer();
        if (this.cropModeEnabled()) {
            picturePlayer?.disableCropMode();
            this.setCropModeEnabled(false);
        }
        if (this.annotationModeEnabled) {
            picturePlayer?.disableAnnotationMode();
            this.setAnnotationMode(null);
        }
    }

    private toggleCropMode(picturePlayer: any): void {
        if (this.cropModeEnabled()) {
            picturePlayer?.disableCropMode();
            this.setCropModeEnabled(false);
        } else {
            // Crop and annotation are mutually exclusive.
            if (this.annotationModeEnabled) {
                picturePlayer?.disableAnnotationMode();
                this.setAnnotationMode(null);
            }
            picturePlayer?.enableCropMode();
            this.setCropModeEnabled(true);
        }
    }

    private setCropModeEnabled(enabled: boolean): void {
        this.cropModeEnabled.set(enabled);
    }

    private toggleAnnotationMode(picturePlayer: any, mode: "draw" | "text" | "erase"): void {
        if (this.annotationMode() === mode) {
            picturePlayer?.disableAnnotationMode();
            this.setAnnotationMode(null);
            return;
        }
        // Crop and annotation are mutually exclusive.
        if (this.cropModeEnabled()) {
            picturePlayer?.disableCropMode();
            this.setCropModeEnabled(false);
        }
        picturePlayer?.enableAnnotationMode();
        if (mode === "draw") {
            picturePlayer?.enableDrawMode();
        } else if (mode === "text") {
            picturePlayer?.enableTextMode();
        } else {
            picturePlayer?.enableEraseMode();
        }
        this.applyAnnotationSettings(picturePlayer);
        this.setAnnotationMode(mode);
    }

    private setAnnotationMode(mode: "draw" | "text" | "erase" | null): void {
        this.annotationMode.set(mode);
    }

    private applyAnnotationSettings(picturePlayer: any): void {
        picturePlayer?.setAnnotationColor(this.annotationColor());
        picturePlayer?.setAnnotationLineWidth(this.annotationLineWidth());
        const size = this.annotationSizes.find((s) => s.lineWidth === this.annotationLineWidth());
        if (size) {
            picturePlayer?.setAnnotationFontSize(size.fontSize);
        }
    }

    public selectAnnotationColor(color: string): void {
        this.annotationColor.set(color);
        const picturePlayer = this.mediaPlayerElement.getPicturePlayer();
        picturePlayer?.setAnnotationColor(color);
    }

    public selectAnnotationSize(size: { label: string; lineWidth: number; fontSize: number }): void {
        this.annotationLineWidth.set(size.lineWidth);
        const picturePlayer = this.mediaPlayerElement.getPicturePlayer();
        picturePlayer?.setAnnotationLineWidth(size.lineWidth);
        picturePlayer?.setAnnotationFontSize(size.fontSize);
    }

    private downloadSnapshot(dataUrl: string): void {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `snapshot-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    private handleTimelineControl(control: string, mediaPlayer: any, paused: boolean): boolean {
        if (control === "backward-5seconds" || control === "forward-5seconds") {
            // Rafale automatique : clic isolé = seek immédiat (leading du throttle 400 ms,
            // seek pur sans pauseOnly/play), clics enchaînés = accumulation + cible projetée.
            const frames = (control === "forward-5seconds" ? 5 : -5) * mediaPlayer.framerate;
            this.pendingFrameJump += frames;
            this.throttledSeek();
            this.previewPendingJumpTarget(mediaPlayer);
            return true;
        }

        const frameMoves: Record<string, number> = {
            "backward-second": -mediaPlayer.framerate,
            "backward-10seconds": -10 * mediaPlayer.framerate,
            "forward-second": mediaPlayer.framerate,
            "forward-10seconds": 10 * mediaPlayer.framerate,
        };
        if (frameMoves[control] !== undefined) {
            this.jumpFrames(mediaPlayer, frameMoves[control], paused);
            return true;
        }

        if (control === "backward-frame") {
            mediaPlayer.pauseOnly();
            mediaPlayer.movePrevFrame(1);
            return true;
        }
        if (control === "forward-frame") {
            mediaPlayer.pauseOnly();
            mediaPlayer.moveNextFrame(1);
            return true;
        }
        if (control === "backward-1h") {
            this.shiftTimeByHour(mediaPlayer, -1);
            return true;
        }
        if (control === "forward-1h") {
            this.shiftTimeByHour(mediaPlayer, 1);
            return true;
        }
        return false;
    }

    private jumpFrames(mediaPlayer: any, frames: number, paused: boolean): void {
        mediaPlayer.pauseOnly();
        if (frames < 0) {
            mediaPlayer.movePrevFrame(Math.abs(frames));
        } else {
            mediaPlayer.moveNextFrame(frames);
        }
        if (!paused) {
            mediaPlayer.play()?.catch?.((err: unknown) => this.logger.debug("play() interrompu par une pause concurrente", err));
        }
    }

    private shiftTimeByHour(mediaPlayer: any, direction: 1 | -1): void {
        let currentTime = mediaPlayer.reverseMode
            ? mediaPlayer.getDuration() - mediaPlayer.getCurrentTime()
            : mediaPlayer.getCurrentTime();
        currentTime = mediaPlayer.reverseMode ? currentTime - direction * 3600 : currentTime + direction * 3600;
        mediaPlayer.setCurrentTime(currentTime);
    }

    /**
     * Return true if the component is in the configuration without a zone
     * @param componentName compoent name
     */
    public hasComponentWithoutZone(componentName: string): boolean {
        if (!this.pluginConfiguration || !this.pluginConfiguration.data) {
            return false;
        }
        const control = find<ControlBarConfig>(this.pluginConfiguration.data, { control: componentName });
        return control !== undefined && control !== null;
    }

    /**
     * Return list controls by zone id
     * @param zone zone id
     */
    public getControlsByZone(zone: number): Array<ControlBarConfig> {
        if (this._controlsByZone) {
            return this._controlsByZone.get(zone) ?? [];
        }
        return null;
    }

    /**
     * Check if control should be shown based on priority and display state
     * @param priority control priority
     * @returns true if control should be shown
     */
    public shouldShowControl(priority: number): boolean {
        if (priority === 1) {
            return true;
        }
        if (this.displayState() === "l") {
            return priority >= 2 && priority <= 5;
        }
        if (this.displayState() === "m") {
            return priority >= 2 && priority <= 4;
        }
        if (this.displayState() === "sm") {
            return priority >= 2 && priority <= 3;
        }
        if (this.displayState() === "s") {
            return priority === 2;
        }
        return false;
    }

    public getControlsByPriority(priority: number, zone: number): Array<ControlBarConfig> {
        if (this.elements) {
            this.elements = orderBy(this.elements, ["order"]);
            return filter<ControlBarConfig>(this.elements, { priority, zone });
        }
        return [];
    }

    /**
     * Change volume
     * @param value volume percentage
     * @param volumeSide volume side (l or r)
     */
    public changeVolume(value: string | number, volumeSide?: string) {
        if (this.mediaPlayerElement?.getMediaPlayer()?.withMergeVolume) {
            if (volumeSide === "l") {
                this.volumeRight.set(this.volumeLeft());
            } else {
                this.volumeLeft.set(this.volumeRight());
            }
            this.mediaPlayerElement.getMediaPlayer()?.setVolume(Number(value));
        } else {
            this.mediaPlayerElement.getMediaPlayer()?.setVolume(Number(value), volumeSide);
        }
    }

    /**
     * Invoked on mouse move
     * @param value change value
     */

    public moveSliderCursor(value: any) {
        this.logger.info("moveSliderCursor ", value);
        this.progressBarValue.set(value);
        this.currentTime.set((value * this.duration()) / 100);
        const oldPlaybackrate = this.currentPlaybackRate();
        if (this.currentPlaybackRate() === 1) {
            this.playbackrateByImages = false;
        }
        const mediaPlayer = this.mediaPlayerElement.getMediaPlayer();
        if (!mediaPlayer) {
            return;
        }
        if (mediaPlayer.reverseMode === true) {
            this.currentTime.set(this.duration() - this.currentTime());
            mediaPlayer.setCurrentTime(this.currentTime());
        } else {
            this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.PLAYBACK_CLEAR_INTERVAL);
            mediaPlayer.setCurrentTime(this.currentTime());
            if (this.playbackrateByImages) {
                this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.PLAYBACK_RATE_IMAGES_CHANGE, oldPlaybackrate);
            } else {
                mediaPlayer.playbackRate = oldPlaybackrate;
            }
        }
    }

    /**
     * PrimeNG's Tooltip appends its overlay (.p-tooltip) to document.body — outside the
     * fullscreened subtree when the player is in fullscreen (the Fullscreen API only renders
     * descendants of the fullscreened element), so it would stay invisible. Move it into the
     * control bar container (part of the fullscreened subtree) so it remains visible.
     */
    public changeTooltipEmplacement() {
        if (this.fullScreenMode() === true) {
            setTimeout(() => {
                const tooltip = document.body.querySelector(".p-tooltip");
                if (tooltip) {
                    document.body.removeChild(tooltip);
                    this.controlBarContainer.nativeElement.appendChild(tooltip);
                }
            }, 150);
        }
    }

    /**
     * switch container class based on width
     */

    public handleDisplayState() {
        this.controls.set([]);
        this.displayState.set(this.mediaPlayerElement.getDisplayState());
        // Controls priority 5
        let controlsP5 = [];
        // Controls priority 4
        let controlsP4 = [];
        // Controls priority 3
        let controlsP3 = [];
        let controlsP2 = [];
        for (let zone = 1; zone < 4; zone++) {
            // Controls priority 5
            controlsP5 = controlsP5.concat(this.getControlsByPriority(5, zone));
            // Controls priority 4
            controlsP4 = controlsP4.concat(this.getControlsByPriority(4, zone));
            // Controls priority 3
            controlsP3 = controlsP3.concat(this.getControlsByPriority(3, zone));
            // Controls priority 2
            controlsP2 = controlsP2.concat(this.getControlsByPriority(2, zone));
        }
        controlsP5 ??= [];
        controlsP4 ??= [];
        controlsP3 ??= [];
        controlsP2 ??= [];

        if (this.displayState() === "l") {
            // En "l" toutes les priorités 1-5 sont déjà rendues sur la barre : le menu
            // n'a plus rien à porter (plus aucun contrôle réservé au menu).
            this.controls.set([]);
        } else if (this.displayState() === "m") {
            this.controls.set(controlsP5);
        } else if (this.displayState() === "sm") {
            this.controls.set(controlsP5.concat(controlsP4));
        } else if (this.displayState() === "s") {
            this.controls.set(controlsP5.concat(controlsP4).concat(controlsP3));
        } else if (this.displayState() === "xs") {
            this.controls.set(controlsP5.concat(controlsP4).concat(controlsP3).concat(controlsP2));
        }
        //remove controls not in menu
        this.controls.set(this.controls().filter((control) => !control.notInMenu));
        //readjust Pin and speed slider
        setTimeout(() => {
            this.updatePinAndSpeedSliderPositions();
        }, 100);
        // Update picture player displayState
        this.updatePicturePlayerDisplayState();
    }

    /**
     * Update picture player displayState
     */
    private updatePicturePlayerDisplayState() {
        const picturePlayer = this.mediaPlayerElement.getPicturePlayer();
        if (picturePlayer) {
            picturePlayer.setDisplayState(this.displayState());
        }
    }

    /**
     * Invoked for change aspect ratio
     */
    public changeAspectRatio() {
        this.mediaPlayerElement.aspectRatio = this.aspectRatio() === "4:3" ? "16:9" : "4:3";
    }

    /**
     * get default aspect ratio
     */

    public getDefaultAspectRatio() {
        this.defaultRatio = this.mediaPlayerElement.aspectRatio;
        this.aspectRatio.set(this.defaultRatio);
    }

    /**
     * Invoked on change playback rate
     */
    public onChangePlaybackRate(value: number) {
        this.currentPlaybackRate.set(value);
        if (this.currentPlaybackRate() < 1 && this.currentPlaybackRate() > -1) {
            this.currentPlaybackRateSlider.set(this.currentPlaybackRate());
        } else {
            this.currentPlaybackRateSlider.set(Math.round(this.currentPlaybackRate()));
        }
        if (this.mediaPlayerElement.getMediaPlayer()?.isPaused() && value !== 1) {
            this.mediaPlayerElement.getMediaPlayer()?.play();
        }
        const mp = this.mediaPlayerElement.getMediaPlayer();
        if (mp) {
            mp.playbackRate = this.currentPlaybackRate();
        }
    }

    /**
     * Change volume state
     */
    public changeSameVolumeState() {
        const mediaPlayer = this.mediaPlayerElement.getMediaPlayer();
        if (!mediaPlayer) {
            return;
        }
        mediaPlayer.withMergeVolume = !mediaPlayer.withMergeVolume;
        if (mediaPlayer.withMergeVolume) {
            const v = Math.max(this.volumeRight(), this.volumeLeft());
            this.volumeLeft.set(v);
            this.volumeRight.set(v);
            this.changeVolume(v);
        }
    }

    /**
     * Handle mouse enter on progress bar
     * @param event mouse enter
     */
    public progressBarMouseEnter(event: MouseEvent) {
        if (this.enableThumbnail && !this.inSliding()) {
            this.thumbnailHidden.set(false);
        }
    }

    /**
     * Handle mouse leave on progress bar
     */
    public progressBarMouseLeave() {
        if (this.enableThumbnail && !this.inSliding()) {
            this.thumbnailHidden.set(true);
        }
    }

    /**
     * Handle mouse move on progress bar
     * @param event mouse move
     */
    public progressBarMouseMove(event: MouseEvent) {
        if (this.enableThumbnail && !this.inSliding() && this.thumbnailHidden() === false) {
            const containerWidth = this.progressBarElement.nativeElement.offsetWidth;
            const thumbnailSize = this.thumbnailElement.nativeElement.offsetWidth;
            const value = this.getMouseValue(event);
            const tc = parseFloat(((value * this.duration()) / 100).toFixed(6));
            if (isFinite(tc)) {
                this.tcThumbnail.set(tc);
                this.thumbnailPosition.set(Math.min(
                    Math.max(0, event.offsetX - thumbnailSize / 2),
                    containerWidth - thumbnailSize,
                ));
            }
            this.throttleFunc(event);
        }
    }

    /**
     * Progress bar on mouse down
     */
    public handleProgressBarMouseDown() {
        this.inSliding.set(true);
        // Distingue le vrai drag (mousemove pendant le geste) du clic simple sur la barre :
        // seul un vrai drag arme accurate_seek au relâchement (finalizeSliderDrag).
        this.sliderMoved = false;
        if (!this.documentMouseUpAttached) {
            document.addEventListener("mouseup", this.handleDocumentMouseUp);
            this.documentMouseUpAttached = true;
        }
        // Spec : la petite vignette n'apparaît qu'au hover hors drag — la cacher dès le
        // mousedown (les handlers hover sont neutralisés tant qu'inSliding est vrai).
        if (this.enableThumbnail) {
            this.thumbnailHidden.set(true);
        }
    }

    /**
     * get value
     * @param event click event
     */
    public getMouseValue(event) {
        const containerWidth = this.progressBarElement.nativeElement.offsetWidth;
        return (event.offsetX / containerWidth) * 100;
    }

    /**
     * Équivalent de getMouseValue pour un événement de niveau document : offsetX y est
     * relatif à l'élément sous le pointeur (inutilisable), on repasse par la géométrie
     * de la barre, clampée à 0-100 %.
     */
    private getMouseValueFromClientX(clientX: number): number {
        const rect = this.progressBarElement?.nativeElement?.getBoundingClientRect();
        if (!rect || rect.width === 0) {
            return this.progressBarValue();
        }
        return Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    }

    /**
     * Progress bar on mouse up
     * @param event  click event
     */
    public handleProgressBarMouseUp(event) {
        this.finalizeSliderDrag(this.getMouseValue(event));
        // Le pointeur est encore sur la barre : le hover redevient légitime — ré-afficher la
        // vignette resynchronisée sur la position du mouseup (sinon flash de l'image d'avant-drag).
        if (this.enableThumbnail) {
            this.thumbnailHidden.set(false);
            this.progressBarMouseMove(event);
        }
    }

    /**
     * mouseup au niveau document : relâcher hors de l'<input type="range"> (au-dessus du
     * player, hors fenêtre…) ne déclenche jamais son (mouseup) — inSliding restait bloqué
     * à true et _seekingTime figé. Champ flèche pour qu'add/removeEventListener partagent
     * la même référence. Si le relâchement a lieu sur l'input, son handler (phase cible)
     * détache ce listener avant que l'événement n'atteigne document : pas de double tir.
     */
    private readonly handleDocumentMouseUp = (event: MouseEvent): void => {
        if (!this.inSliding()) {
            this.detachDocumentMouseUp();
            return;
        }
        this.finalizeSliderDrag(this.getMouseValueFromClientX(event.clientX));
        // Relâchement hors de la barre : la vignette est cachée depuis le mousedown et le
        // reste — le prochain mouseenter sur la barre la remontrera.
    };

    /**
     * Finalisation commune du drag (mouseup sur l'input ou au niveau document) : annule le
     * trailing du seek live AVANT le seek exact (il tirerait après lui), puis chemin mouseup
     * historique — moveSliderCursor (seek exact + restauration playbackRate/reverseMode) et
     * SEEKED avec le pourcentage (quirk conservé : playback-state ignore le payload).
     */
    private finalizeSliderDrag(value: number): void {
        this.throttledLiveSeek.cancel();
        this.detachDocumentMouseUp();
        this.inSliding.set(false);
        // Les seeks live du drag restent en fragments normaux ; seul le seek exact du mouseup
        // porte accurate_seek=1 (coupe précise côté serveur). Armé uniquement après un vrai
        // drag (le clic simple garde le seek classique), consommé en one-shot par le fragment
        // d'atterrissage (CustomFragmentLoader).
        if (this.sliderMoved) {
            this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.ACCURATE_SEEK_CHANGE, true);
        }
        this.moveSliderCursor(value);
        this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.SEEKED, value);
    }

    private detachDocumentMouseUp(): void {
        if (this.documentMouseUpAttached) {
            document.removeEventListener("mouseup", this.handleDocumentMouseUp);
            this.documentMouseUpAttached = false;
        }
    }

    /**
     * Handle thumbnail pos
     * @param event mouse event
     */
    public updateThumbnail(event: MouseEvent) {
        const containerWidth = this.progressBarElement.nativeElement.offsetWidth;
        const tc = (event.offsetX * this.duration()) / containerWidth;
        // Clé de cache et URL partagent la même quantification (grille des vignettes) :
        // deux positions de souris à moins de 0,04 s donnent une seule requête et une
        // seule entrée — réutilisable telle quelle par la rafale ±5s.
        const currentTime = quantizeThumbnailTc(tc);
        const url = this.mediaPlayerElement.getThumbnailUrl(currentTime, true);
        if (isFinite(tc)) {
            this.setThumbnail(url, currentTime);
        }
    }

    private thumbnailRequestToken = 0;
    /** Jeton de la dernière réponse peinte — peinture monotone (voir setThumbnail). */
    private thumbnailPaintedToken = 0;

    // Fast hover sweeps fire many overlapping thumbnail fetches with out-of-order resolutions.
    // Painting is monotonic: a response older than the image on screen is dropped, but any
    // newer response paints even if it is no longer the latest request — during a continuous
    // sweep the preview keeps scrolling instead of freezing until the gesture stops (a
    // latest-request-only guard would discard every response while the token keeps moving).
    public setThumbnail(url, currentTime) {
        const requestToken = ++this.thumbnailRequestToken;
        this.thumbnailService
            .getThumbnail(url, currentTime, 'small', {priority: 'display'})
            .then((blob) => {
                if (requestToken <= this.thumbnailPaintedToken) {
                    return;
                }
                if (typeof blob !== "undefined") {
                    this.thumbnailPaintedToken = requestToken;
                    this.thumbnailElement?.nativeElement?.setAttribute("src", blob);
                }
            })
            .catch(() => undefined);
    }

    /**
     * Invoked for change playback rate
     */
    private prevPlaybackRate() {
        this.inverse.set(true);
        this.changePlaybackRate(this.getPlaybackStepValue(this.backwardPlaybackRateStep));
        const index = this.forwardPlaybackRateStep.indexOf(this.currentPlaybackRate());
        const bufferSize = this.changeBufferSize(index);
        this.mediaPlayerElement.getMediaPlayer()?.mse.setMaxBufferLengthConfig(bufferSize);
        this.mediaPlayerElement.getMediaPlayer()?.mse.setMaxBufferLengthConfig(bufferSize);
    }

    /**
     * Invoked for change playback rate
     */
    private nextPlaybackRate() {
        this.changePlaybackRate(this.getPlaybackStepValue(this.forwardPlaybackRateStep));
        const index = this.forwardPlaybackRateStep.indexOf(this.currentPlaybackRate());
        const bufferSize = this.changeBufferSize(index);
        this.mediaPlayerElement.getMediaPlayer()?.mse.setMaxBufferLengthConfig(bufferSize);
    }

    private changeBufferSize(index) {
        return this.listBufferSize[index];
    }

    /**
     * Invoked for change playback rate
     * When playbackrate >= 6 display images
     */

    public nextPlaybackRateImages(speed) {
        this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.PLAYBACK_CLEAR_INTERVAL);
        if (this.getPlaybackStepValue(this.forwardPlaybackRateStep, true) < speed) {
            this.changePlaybackRate(this.getPlaybackStepValue(this.forwardPlaybackRateStep));
        } else {
            this.currentPlaybackRate.set(this.getPlaybackStepValue(this.forwardPlaybackRateStep, true));
            this.mediaPlayerElement.eventEmitter.emit(
                PlayerEventType.PLAYBACK_RATE_IMAGES_CHANGE,
                this.currentPlaybackRate(),
            );
        }
        setTimeout(() => this.selectActivePlaybackrate(), 10);
    }

    /**
     * Invoked for change playback rate
     * When playbackrate >= speed configuration display images
     */

    public previousPlaybackRateImages(speed) {
        this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.PLAYBACK_CLEAR_INTERVAL);
        if (this.getPlaybackStepValue(this.backwardPlaybackRateStep, true) > speed) {
            this.changePlaybackRate(this.getPlaybackStepValue(this.backwardPlaybackRateStep));
        } else {
            this.currentPlaybackRate.set(this.getPlaybackStepValue(this.backwardPlaybackRateStep, true));
            const mediaPlayer = this.mediaPlayerElement.getMediaPlayer();
            const mainSource = !mediaPlayer?.reverseMode;
            if (this.currentPlaybackRate() < 0 && mainSource === false) {
                const tc = mediaPlayer?.getCurrentTime();
                mediaPlayer?.mse.switchToMainSrc().then(() => {
                    this.mediaPlayerElement.getMediaPlayer()?.setReverseMode(false);
                    this.mediaPlayerElement.getMediaPlayer()?.setCurrentTime(Math.max(0, tc));
                    this.mediaPlayerElement.eventEmitter.emit(
                        PlayerEventType.PLAYBACK_RATE_IMAGES_CHANGE,
                        this.currentPlaybackRate(),
                    );
                });
            } else {
                this.mediaPlayerElement.eventEmitter.emit(
                    PlayerEventType.PLAYBACK_RATE_IMAGES_CHANGE,
                    this.currentPlaybackRate(),
                );
            }
        }
    }

    /**
     * Invoked for change slow playback rate
     */
    private prevSlowPlaybackRate() {
        this.changePlaybackRate(this.getPlaybackStepValue(this.backwardSlowPlaybackRateStep));
    }

    /**
     * Invoked for change slow playback rate
     */
    private nextSlowPlaybackRate() {
        this.changePlaybackRate(this.getPlaybackStepValue(this.forwardSlowPlaybackRateStep));
    }

    /**
     * Return playback step value
     * @param playbackRateStep list of steps
     * @param ignoreSetPlaybackrate
     * @return return playback step if true, does not set the playbackRate on mediaPlayerElement.getMediaPlayer()
     */
    private getPlaybackStepValue(playbackRateStep: Array<number>, ignoreSetPlaybackrate?: boolean): number {
        let playbackRate;
        let indexOfCurrentPlaybackRate = playbackRateStep.indexOf(this.currentPlaybackRate());
        indexOfCurrentPlaybackRate = indexOfCurrentPlaybackRate + 1;
        if (indexOfCurrentPlaybackRate > playbackRateStep.length - 1) {
            indexOfCurrentPlaybackRate = 0;
        }
        playbackRate = playbackRateStep[indexOfCurrentPlaybackRate];
        if (!ignoreSetPlaybackrate) {
            const mp = this.mediaPlayerElement.getMediaPlayer();
            if (mp) {
                mp.playbackRate = playbackRate;
            }
        }
        return playbackRate;
    }

    /**
     * Invoked for change playback rate
     */
    private changePlaybackRate(value: number) {
        this.currentPlaybackRate.set(value);
        const mp = this.mediaPlayerElement.getMediaPlayer();
        if (mp) {
            mp.playbackRate = this.currentPlaybackRate();
        }
        setTimeout(() => this.selectActivePlaybackrate(), 10);
    }

    public handlePlayerMouseHover() {
        this.activated.set(true);
    }

    /**
     * update position subtitle onclick
     * @param subtitlePosition subtitle position
     */

    public updateSubtitlePosition(subtitlePosition?: string) {
        if (typeof subtitlePosition === "undefined") {
            this.updateSubtitleInfos();
        } else {
            for (const subtitle of this.listOfSubtitles) {
                if (subtitlePosition === subtitle.key) {
                    this.selectedLabel.set(subtitle.label);
                    this.subtitlePosition.set(subtitlePosition);
                }
            }
        }
        this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.POSITION_SUBTITLE_CHANGE, subtitlePosition);
    }

    // update Subtitle position & subtitle label {

    public updateSubtitleInfos() {
        let j: number;
        for (let i = 0; i < this.listOfSubtitles.length; i++) {
            if (this.subtitlePosition() === this.listOfSubtitles[i].key) {
                if (i === this.listOfSubtitles.length - 1) {
                    j = 0;
                } else {
                    j = i + 1;
                }
                this.subtitlePosition.set(this.listOfSubtitles[j].key);
                this.selectedLabel.set(this.listOfSubtitles[j].label);
            }
        }
    }

    /**
     * Toggle Display playbackslider
     */
    private displaySlider() {
        this.enablePlaybackSlider.set(!this.enablePlaybackSlider());
        if (this.enablePlaybackSlider() && this.pinnedSlider()) {
            this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.PINNED_SLIDER_CHANGE, this.enablePinnedSlider);
        } else {
            this.mediaPlayerElement.eventEmitter.emit(
                PlayerEventType.PINNED_CONTROLBAR_CHANGE,
                this.enablePinnedSlider,
            );
        }
        this.pinned.set(this.enablePlaybackSlider() && this.pinnedSlider());
        setTimeout(() => this.initDragThumb(), 10);
    }

    private fixControlBar() {
        this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.PINNED_CONTROLBAR_CHANGE, true);
    }

    /**
     * Toggle Pinned class playback slider
     */
    private pinControls() {
        this.applyPinnedControlsState(!this.pinnedSlider());
    }

    /**
     * Sets the pinned state directly (idempotent) rather than toggling it — used both by the
     * user-driven pinControls() toggle above and by the pluginConfiguration.pinnedControls
     * default-on init below. init() can run more than once for the same plugin instance (DOM
     * reattachment on fullscreen/detach, config reload, etc. — see the volume/audio-track reinit
     * fix for the same class of bug), and pinnedControls being applied via the pinControls()
     * toggle on every init() would flip pinnedSlider back to false on an even number of
     * re-inits, silently un-pinning a controlbar the config says should always stay pinned.
     */
    private applyPinnedControlsState(pinnedSlider: boolean) {
        this.pinnedSlider.set(pinnedSlider);
        this.enablePinnedSlider = pinnedSlider;
        if (this.enablePlaybackSlider() && this.pinnedSlider()) {
            this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.PINNED_SLIDER_CHANGE, this.enablePinnedSlider);
        } else {
            this.mediaPlayerElement.eventEmitter.emit(
                PlayerEventType.PINNED_CONTROLBAR_CHANGE,
                this.enablePinnedSlider,
            );
        }
        this.pinned.set(this.enablePlaybackSlider() && this.pinnedSlider());
    }

    /**
     * Set aspect Ratio
     */
    public setVideoAspectRatio(ratio) {
        this.mediaPlayerElement.aspectRatio = ratio;
    }

    /**
     * Toggle fullscreen player
     */
    private toggleFullScreen() {
        this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.FULLSCREEN_STATE_CHANGE);
    }

    /**
     * Handle to download url
     * @param element html element
     * @param control control bar config
     */
    public buildUrlWithTc(element: HTMLElement, control: ControlBarConfig) {
        const baseUrl = control.data.href;
        const tcParam = control.data?.tcParam || "tc";
        const currentTime = (this.mediaPlayerElement.getMediaPlayer()?.getCurrentTime() ?? 0).toFixed(2);
        if (baseUrl !== "") {
            element.setAttribute(
                "href",
                baseUrl.search("\\?") === -1
                    ? `${baseUrl}?${tcParam}=${currentTime}`
                    : `${baseUrl}&${tcParam}=${this.currentTime()}`,
            );
        }
    }

    /**
     * Download URL on shortcut
     */
    public downloadUrl(control) {
        const currentTime = (this.mediaPlayerElement.getMediaPlayer()?.getCurrentTime() ?? 0).toFixed(2);
        const data = this.elements;
        for (const i in data) {
            if (typeof data[i] === "object") {
                const c = data[i];
                this.openDownloadUrl(c, control, currentTime);
            }
        }
    }

    private openDownloadUrl(c, control, currentTime) {
        if (typeof c.key !== "undefined") {
            if (c.control === control && c.key === this.keypressed) {
                let baseUrl = c.data.href;
                const tcParam = c.data?.tcParam || "tc";
                baseUrl =
                    baseUrl.search("\\?") === -1
                        ? baseUrl + "?" + tcParam + "=" + currentTime
                        : baseUrl + "&" + tcParam + "=" + currentTime;
                window.location.href = baseUrl;
            }
        }
    }

    /**
     * change slider displayed
     */

    public changeSlider() {
        if (this.selectedSlider() === "slider1") {
            this.selectedSlider.set("slider2");
        } else {
            this.selectedSlider.set("slider1");
        }
        setTimeout(() => this.initDragThumb(), 10);
    }

    /**
     * switch timeCode display onclick
     */

    public switchDisplayCurrentTime() {
        if (this.inverse() === true) {
            this.inverse.set(false);
            this.time.set(this.currentTime());
        } else {
            this.inverse.set(true);
            this.time.set(this.duration() - this.currentTime());
        }
    }

    public hideAll(control?) {
        if (this.enableMenu() && control !== "menu") {
            this.enableMenu.set(!this.enableMenu());
        }
        if (this.enableVolumeSlider()) {
            this.enableVolumeSlider.set(!this.enableVolumeSlider());
        }
        if (this.enableListPositionsSubtitle()) {
            this.enableListPositionsSubtitle.set(!this.enableListPositionsSubtitle());
        }
        if (this.enableListRatio()) {
            this.enableListRatio.set(!this.enableListRatio());
        }
    }

    /**
     * .controls-menu used a fixed `right: 10px` (relative to its positioning parent,
     * .controls-container), which only lines the menu up with the "..." button when that
     * button happens to sit right at the container's own right edge. Once other controls
     * before it get hidden differently per display state/layout, the button can end up well
     * short of that edge, leaving the menu visibly offset from the button that opens it.
     * Align the menu's right edge with the actual trigger button's right edge instead, measured
     * fresh against their shared positioning parent every time the menu opens.
     */
    public alignMenuToTrigger(trigger: EventTarget | null): void {
        const menuEl = this.controlsMenu?.nativeElement;
        const container = menuEl?.parentElement;
        if (!menuEl || !container || !(trigger instanceof HTMLElement)) {
            return;
        }
        const containerRect = container.getBoundingClientRect();
        const triggerRect = trigger.getBoundingClientRect();
        const rightOffset = Math.max(0, containerRect.right - triggerRect.right);
        menuEl.style.right = `${rightOffset}px`;
    }

    aspectRatioMouseEnter() {
        this.hideAll("ratio");
        this.enableListRatio.set(true);
        if (this.aspectRatioMouseEnterTimeOut) {
            clearTimeout(this.aspectRatioMouseEnterTimeOut);
        }
        this.aspectRatioMouseEnterTimeOut = setTimeout(() => {
            this.enableListRatio.set(false);
        }, 4000);
    }

    volumeMouseEnter(data: any) {
        this.hideAll("volume");
        this.enableVolumeSlider.set(true);
        this.openVolume(data);
        if (this.volumeMouseEnterTimeOut) {
            clearTimeout(this.volumeMouseEnterTimeOut);
        }
        this.volumeMouseEnterTimeOut = setTimeout(() => {
            this.enableVolumeSlider.set(false);
            this.openPisteAudio.set(false);
        }, 4000);
    }

    /**
     * Mute sound
     */
    public mute() {
        this.volumeRight.set(0);
        this.volumeLeft.set(0);
        return this.mediaPlayerElement.getMediaPlayer()?.mute();
    }

    /**
     * unmute sound
     */
    public unmute() {
        const mediaPlayer = this.mediaPlayerElement.getMediaPlayer();
        if (!mediaPlayer) {
            return;
        }
        this.volumeRight.set(mediaPlayer.getVolume("r"));
        this.volumeLeft.set(mediaPlayer.getVolume("l"));
        if (this.volumeLeft() < 50 || this.volumeRight() < 50) {
            mediaPlayer.setVolume(50, "r");
            mediaPlayer.setVolume(50, "l");
            this.volumeRight.set(mediaPlayer.getVolume("r"));
            this.volumeLeft.set(mediaPlayer.getVolume("l"));
        }
        return mediaPlayer.unmute();
    }

    public initPlaybackrates() {
        let speed;
        const negPlaybackrates: Array<number> = [];
        const posPlaybackrates: Array<number> = [];
        const playbackrates = this.sliderListOfPlaybackRateCustomSteps;
        for (speed of playbackrates) {
            if (Math.sign(speed) === 1) {
                posPlaybackrates.push(speed);
            } else if (Math.sign(speed) === -1) {
                negPlaybackrates.push(speed);
            }
        }
        this.negPlaybackrates = [...negPlaybackrates].reverse();
        negPlaybackrates.reverse();
        this.posPlaybackrates = posPlaybackrates;
        this.minCursor = this.negPlaybackrates.length * -1;
        this.maxCursor = this.posPlaybackrates.length;
    }

    public initDragThumb() {
        // init drag slider
        const selected: HTMLElement = this.controlBarContainer.nativeElement.querySelector<HTMLElement>(
            ".selected > .playback-rate-values > .playbackrate-value.active",
        );
        const step = Math.ceil(selected.offsetWidth);
        const values = this.controlBarContainer.nativeElement.querySelectorAll<HTMLElement>(
            ".selected > .playback-rate-values > .playbackrate-value",
        );
        let left = step / 2;
        values.forEach((value) => {
            value.setAttribute("data-x", left.toString());
            left += step;
        });
        let position = { x: Number(selected.getAttribute("data-x")) };
        const container = this.dragElement.nativeElement;
        const self = this;
        const valuesContainer = this.controlBarContainer.nativeElement.querySelector<HTMLElement>(
            ".selected > .playback-rate-values",
        );
        const maxWidth = valuesContainer.offsetWidth;
        container.style.paddingLeft = position.x + "px";
        container.setAttribute("data-x", position.x);
        interact(container).styleCursor(false);
        interact(container).draggable({
            origin: "self",
            inertia: true,
            modifiers: [
                interact.modifiers.restrict({
                    restriction: "self",
                }),
            ],
            listeners: {
                move(event) {
                    if (self.selectedSlider() === "slider2") {
                        setTimeout(() => self.handleMoveDragThumb(event, position, step, maxWidth), 50);
                        event.stopImmediatePropagation();
                    } else {
                        event.preventDefault();
                        position = { x: Number(container.getAttribute("data-x")) };
                        position.x += event.dx;
                        if (position.x < step / 2) {
                            event.target.style.paddingLeft = "0px";
                            event.target.setAttribute("data-x", 0);
                        } else if (position.x > Number(maxWidth - step / 2) || position.x > maxWidth) {
                            event.target.style.paddingLeft = Number(maxWidth - 10) + "px";
                            event.target.setAttribute("data-x", Number(maxWidth - 10).toString());
                        } else if (position.x > 0) {
                            self.handleThumbPosition(values, event, position, step);
                        }
                    }
                },
                end(event) {
                    if (self.selectedSlider() === "slider2") {
                        setTimeout(() => self.handleStopMoveDragThumb(values, position.x), 10);
                        event.stopImmediatePropagation();
                    }
                },
            },
        });
    }

    // Handle thumb position slider
    private handleThumbPosition(values, event, position, step) {
        values.forEach((value) => {
            const v = Number(value.getAttribute("data-x"));
            const p = Number(value.getAttribute("data"));
            if (value.nextElementSibling) {
                const nextP = Number(value.nextElementSibling.getAttribute("data-x"));
                const nextValue = Number(value.nextElementSibling.getAttribute("data"));
                const difference = nextValue - p;
                if (position.x >= v && position.x < nextP) {
                    const percentage = Math.round(((position.x - v) * 100) / step);
                    const pr = p + (percentage * difference) / 100;
                    const playbackrate = pr.toFixed(1);
                    event.target.style.paddingLeft = position.x + "px";
                    event.target.setAttribute("data-x", position.x);
                    if (Number(playbackrate) !== 0) {
                        event.stopImmediatePropagation();
                        this.changePlaybackrate(playbackrate);
                    }
                }
            }
        });
    }

    /**
     * Handle stop move drag thumb
     */
    public handleStopMoveDragThumb(values, position) {
        values.forEach((value) => {
            const v = Number(value.getAttribute("data-x"));
            if (position === v) {
                const pr = value.getAttribute("data");
                if (Number(pr) !== 0) {
                    this.changePlaybackrate(pr);
                }
            }
        });
    }

    /**
     * handle move drag thumb
     */
    public handleMoveDragThumb(event, position, step, maxWidth) {
        event.speed = 20;
        const oldPosition = position.x;
        const pos = position.x + event.dx;
        if (pos > oldPosition) {
            position.x += step;
        } else {
            position.x -= step;
        }
        if (position.x === step / 2) {
            event.target.style.paddingLeft = "0px";
            event.target.setAttribute("data-x", 0);
        } else if (position.x === Number(maxWidth - step / 2) || position.x > maxWidth) {
            event.target.style.paddingLeft = Number(maxWidth - 10) + "px";
            event.target.setAttribute("data-x", Number(maxWidth - 10).toString());
        } else if (position.x > 0) {
            event.target.style.paddingLeft = position.x + "px";
            event.target.setAttribute("data-x", position.x);
            event.stopImmediatePropagation();
        }
    }

    public togglePlaybackrate(value) {
        let pr;
        if (Math.sign(value) === 1) {
            pr = this.posPlaybackrates[value - 1];
        } else if (Math.sign(value) === -1) {
            pr = this.negPlaybackrates[Math.abs(value) - 1];
        }
        this.indexPlaybackRate = value;
        if (value !== 0) {
            this.onChangePlaybackRate(pr);
        } else {
            this.mediaPlayerElement.getMediaPlayer()?.pause();
        }
    }

    public changePlaybackrate(pr, click?) {
        if (pr !== 0) {
            if (Math.sign(pr) === 1) {
                this.indexPlaybackRate = this.posPlaybackrates.indexOf(pr);
            } else if (Math.sign(pr) === -1) {
                this.indexPlaybackRate = -1 * (this.negPlaybackrates.indexOf(pr) + 1);
            }
            this.onChangePlaybackRate(pr);
        } else {
            this.mediaPlayerElement.getMediaPlayer()?.pause();
        }
        if (click) {
            setTimeout(() => this.selectActivePlaybackrate(), 10);
        }
    }

    /**
     * AutoBind Select Playbackrate
     */

    public selectActivePlaybackrate() {
        const container = this.dragElement.nativeElement;
        const selected: HTMLElement = this.controlBarContainer.nativeElement.querySelector<HTMLElement>(
            ".selected > .playback-rate-values > .playbackrate-value.active",
        );
        if (selected) {
            const position = Number(selected.getAttribute("data-x"));
            container.style.paddingLeft = position + "px";
            container.setAttribute("data-x", position);
        }
    }

    /***
     * toggle Volume
     */

    private toggleVolume() {
        this.volumeButton.nativeElement.click();
        if (this.volumeLeft() > 0 || this.volumeRight() > 0) {
            this.mute();
        }
        if (this.volumeLeft() === 0 && this.volumeRight() === 0) {
            this.unmute();
        }
    }

    initTracks() {
        if (!this.pluginConfiguration || !this.pluginConfiguration.data) {
            return;
        }
        const control = find<ControlBarConfig>(this.pluginConfiguration.data, { control: "volume" });
        if (control && control.data && control.data.tracks) {
            this.listOfTracks = control.data.tracks;
            this.selectedTrack.set(this.listOfTracks[0].track);
            this.selectedTrackLabel.set(this.listOfTracks.find((x) => x.track === this.selectedTrack()).label);
            this.logger.debug(
                `[AUDIO_TRACK_DEBUG] initTracks listOfTracks=${JSON.stringify(this.listOfTracks)} selectedTrack=${this.selectedTrack()}`,
            );
        }
    }

    /**
     * In charge to open Volume
     * @param data volume paramèter
     */
    openVolume(data: any) {
        this.mediaPlayerElement.getMediaPlayer()?.initAudioChannelMerger(data);
    }

    /**
     * In charge to handle click volume
     */
    handleMuteUnmuteVolume(side = "") {
        const mediaPlayer = this.mediaPlayerElement.getMediaPlayer();
        if (!mediaPlayer) {
            return;
        }
        const vol = mediaPlayer.getVolume();
        if (side === "") {
            if (vol === 0) {
                this.unmute();
            } else {
                this.mute();
            }
        } else {
            if (side === "r") {
                const oldVolumeRight = mediaPlayer.getVolume("r");
                this.volumeRight.set(oldVolumeRight === 0 ? 50 : 0);
                this.changeVolume(this.volumeRight(), side);
            } else if (side === "l") {
                const oldVolumeLeft = mediaPlayer.getVolume("l");
                this.volumeLeft.set(oldVolumeLeft === 0 ? 50 : 0);
                this.changeVolume(this.volumeLeft(), side);
            }
        }
    }

    /**
     * handle change track
     * @param trackId track id
     */
    changeAudioTrack(trackId: any) {
        this.logger.debug(`[AUDIO_TRACK_DEBUG] changeAudioTrack -> trackId=${trackId}`);
        this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.AUDIO_CHANNEL_CHANGE, trackId);
        this.selectedTrack.set(trackId);
        this.selectedTrackLabel.set(this.listOfTracks.find((x) => x.track === this.selectedTrack()).label);
    }
}
