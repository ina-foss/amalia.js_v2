import { PluginBase } from "../../core/plugin/plugin-base";
import { ChangeDetectionStrategy, Component, computed, ElementRef, OnInit, signal, ViewChild, ViewEncapsulation } from "@angular/core";
import { PlayerEventType } from "../../core/constant/event-type";
import { TimeBarConfig } from "../../core/config/model/time-bar-config";
import { PluginConfigData } from "../../core/config/model/plugin-config-data";
import { DEFAULT } from "../../core/constant/default";
import { LABEL } from "../../core/constant/labels";
import { MediaPlayerService } from "../../service/media-player-service";
import { Utils } from "src/app/core/utils/utils";
import { FormatUtils } from "src/app/core/utils/format-utils";
import { NgClass } from "@angular/common";
import { TcFormatPipe } from "../../core/utils/tc-format.pipe";

@Component({
    selector: "amalia-time-bar",
    templateUrl: "./time-bar-plugin.component.html",
    styleUrls: ["./time-bar-plugin.component.scss"],
    encapsulation: ViewEncapsulation.ShadowDom,
    imports: [NgClass, TcFormatPipe],
    // OnPush (phase 7 vague 1) : les timecodes dérivent du store PlaybackState (computeds,
    // plus de listeners TIME_CHANGE/DURATION_CHANGE/SEEKING), active/displayState sont des
    // signals alimentés par des listeners 'schedule'. Les champs restés plats (theme,
    // labels, displayFormat, fps) ne changent que dans init(), exécuté avant le premier
    // rendu ou sous le listener INIT de PluginBase (policy 'schedule' → markForCheck).
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeBarPluginComponent extends PluginBase<TimeBarConfig> implements OnInit {
    @ViewChild("tooltip")
    tooltip: ElementRef<HTMLDivElement>;

    @ViewChild("tooltip2")
    tooltip2: ElementRef<HTMLDivElement>;

    public static PLUGIN_NAME = "TIME_BAR";

    /**
     * Miroir signal du tcOffset de la configuration (champ plat de PluginBase, réécrit à
     * chaque init()) : les computeds de timecode en dépendent.
     */
    private readonly tcOffsetSignal = signal(0);
    /**
     * Miroir signal de pluginConfiguration.data.first_tc (renseigné dans init()).
     */
    private readonly firstTcSignal = signal(0);
    /**
     * Décalage commun appliqué aux trois timecodes : tcOffset + first_tc.
     */
    private readonly tcBase = computed(() => this.tcOffsetSignal() + this.firstTcSignal());

    /**
     * Timecode de début (tcOffset + first_tc) — anciennement recalculé sur DURATION_CHANGE.
     */
    public readonly startTc = computed(() => this.tcBase());

    /**
     * Timecode courant : pendant un drag de la barre de progression, la cible du seek prime
     * (playback.displayTime = seekingTime ?? currentTime) — remplace les listeners
     * TIME_CHANGE + SEEKING. NaN tant que le store n'est pas disponible : comme l'ancien
     * champ non initialisé, il fait échouer le garde `>= 0` du template.
     */
    public readonly timeTimeBar = computed<number>(() => {
        // tcBase lu en premier, inconditionnellement : garantit un producteur au computed
        // tant que mediaPlayerElement/playback n'est pas encore disponible.
        const base = this.tcBase();
        const playback = this.mediaPlayerElement?.playback;
        return playback ? base + playback.displayTime() : Number.NaN;
    });

    /**
     * Timecode de fin (durée + décalages) — NaN tant que la durée est inconnue, pour
     * conserver le masquage historique de la barre avant le premier DURATION_CHANGE.
     */
    public readonly durationTimeBar = computed<number>(() => {
        const base = this.tcBase();
        const playback = this.mediaPlayerElement?.playback;
        if (!playback) {
            return Number.NaN;
        }
        const duration = playback.duration();
        return duration > 0 ? base + duration : Number.NaN;
    });

    /**
     * Display format specifier h|m|s|f|ms|mms
     */
    public displayFormat: "h" | "m" | "s" | "minutes" | "f" | "ms" | "mms" | "hours" | "seconds" = "f";
    /**
     * Media fps
     */
    public override fps = DEFAULT.FPS;

    /**
     * Plugin display state
     */
    public readonly displayState = signal<string | undefined>(undefined);
    /**
     * Show timeBar
     */
    public readonly active = signal(true);
    /**
     * label tcin
     */
    public labelTcIn;
    /**
     * label tcout
     */
    public labelTcOut;

    /**
     * theme
     */
    public theme: "inside" | "outside";

    constructor(playerService: MediaPlayerService) {
        super(playerService);
        this.pluginName = TimeBarPluginComponent.PLUGIN_NAME;
    }

    override ngOnInit(): void {
        super.ngOnInit();
    }

    override init() {
        super.init();
        this.tcOffsetSignal.set(this.tcOffset || 0);
        this.firstTcSignal.set(this.pluginConfiguration?.data?.first_tc || 0);
        this.handleDisplayState();
        this.theme = this.pluginConfiguration.data.theme;
        this.timeFormat = this.pluginConfiguration.data.timeFormat;
        this.displayFormat = this.timeFormat ? this.timeFormat : this.getDefaultConfig().data.timeFormat;
        if (this.pluginConfiguration.data.timeFormat === "hours") {
            this.labelTcIn = LABEL.START_HOUR;
            this.labelTcOut = LABEL.END_HOUR;
        } else {
            this.labelTcIn = LABEL.START_TC;
            this.labelTcOut = LABEL.END_TC;
        }
        // Ces handlers n'écrivent que les signals active/displayState : 'schedule' notifie la
        // vue OnPush (markForCheck hors zone → tick coalescé) sans ré-entrer dans la zone.
        if (this.theme === "inside") {
            this.addListener(
                this.mediaPlayerElement.eventEmitter,
                PlayerEventType.PLAYER_MOUSE_LEAVE,
                this.hideTimeBar,
                { policy: "schedule" },
            );
            this.addListener(
                this.mediaPlayerElement.eventEmitter,
                PlayerEventType.PLAYER_MOUSE_ENTER,
                this.showTimeBar,
                { policy: "schedule" },
            );
        }
        this.addListener(
            this.mediaPlayerElement.eventEmitter,
            PlayerEventType.PLAYER_RESIZED,
            this.handleDisplayState,
            { policy: "schedule" },
        );
    }

    /**
     * switch container class based on width
     */

    public handleDisplayState() {
        this.displayState.set(this.mediaPlayerElement.getDisplayState());
    }

    public hideTimeBar() {
        this.active.set(false);
    }

    public showTimeBar() {
        const displayState = this.displayState();
        this.active.set(displayState !== "s" && displayState !== "xs");
    }

    /**
     * Return default config
     */
    getDefaultConfig(): PluginConfigData<TimeBarConfig> {
        return { name: TimeBarPluginComponent.PLUGIN_NAME, data: { timeFormat: "f", theme: "outside" } };
    }

    copyToClipBoard(tc: number, event: Event) {
        const text = FormatUtils.formatTime(tc, "f", this.fps);
        const mouseEvent = event as MouseEvent;
        Utils.copyToClipBoard(text, this.tooltip?.nativeElement, mouseEvent.clientX, mouseEvent.clientY);
    }
    copyAllToClipBoard(tc: number, event: Event) {
        const text = FormatUtils.formatTime(tc, "f", this.fps);
        const mouseEvent = event as MouseEvent;
        Utils.copyToClipBoard(text, this.tooltip2?.nativeElement, mouseEvent.clientX, mouseEvent.clientY);
    }
}
