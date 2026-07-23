import { PluginBase } from "../../core/plugin/plugin-base";
import { ChangeDetectionStrategy, Component, computed, OnInit, signal, ViewEncapsulation } from "@angular/core";
import { PlayerEventType } from "../../core/constant/event-type";
import { PluginConfigData } from "../../core/config/model/plugin-config-data";
import { Utils } from "../../core/utils/utils";
import { TranscriptionLocalisation } from "../../core/metadata/model/transcription-localisation";
import { SubtitleConfig } from "../../core/config/model/subtitle-config";
import filter from "lodash/filter";
import map from "lodash/map";
import trim from "lodash/trim";
import { MediaPlayerService } from "../../service/media-player-service";

@Component({
    selector: "amalia-subtitles",
    templateUrl: "./subtitles-plugin.component.html",
    styleUrls: ["./subtitles-plugin.component.scss"],
    encapsulation: ViewEncapsulation.ShadowDom,
    // OnPush (phase 7 vague 1, conversion modèle) : tout l'état lu par le template est
    // signal/computed — le sous-titre dérive du store PlaybackState (plus de listener
    // TIME_CHANGE), les autres listeners n'écrivent que des signals (policy 'none').
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubtitlesPluginComponent extends PluginBase<SubtitleConfig> implements OnInit {
    public static PLUGIN_NAME = "SUBTITLE";
    public static TC_DELTA = 0.5;
    /**
     * Transcriptions parsées depuis les métadonnées (null tant qu'aucune n'est chargée).
     */
    public readonly transcriptions = signal<Array<TranscriptionLocalisation> | null>(null);
    /**
     * Sous-titre courant, dérivé du temps de lecture (`playback.currentTime()`) et des
     * transcriptions — remplace l'ancien couple listener TIME_CHANGE + updateSubtitleContent.
     */
    public readonly subTitle = computed<string | null>(() => {
        // Lu en premier, inconditionnellement : garantit au computed au moins un producteur
        // (et donc une ré-évaluation) tant que mediaPlayerElement/playback n'est pas prêt.
        const transcriptions = this.transcriptions();
        const playback = this.mediaPlayerElement?.playback;
        if (!transcriptions || !playback) {
            return null;
        }
        const currentTime = playback.currentTime();
        const tcDelta = this.pluginConfiguration?.data?.tcDelta || SubtitlesPluginComponent.TC_DELTA;
        const listOfTranscription = filter(transcriptions, (l) => {
            return currentTime >= l.tcIn - tcDelta && currentTime < l.tcOut + tcDelta;
        });
        if (listOfTranscription && listOfTranscription.length) {
            let texts: any = map(listOfTranscription, "text");
            texts = trim(texts);
            return texts.toString();
        }
        return null;
    });
    /**
     * Position d'affichage du sous-titre (POSITION_SUBTITLE_CHANGE).
     */
    public readonly posSubtitle = signal<"none" | "up" | "down" | undefined>(undefined);
    /**
     * Plugin display state
     */
    public readonly displayState = signal<string | undefined>(undefined);
    constructor(playerService: MediaPlayerService) {
        super(playerService);
        this.pluginName = SubtitlesPluginComponent.PLUGIN_NAME;
    }

    override ngOnInit(): void {
        super.ngOnInit();
    }

    override init(): void {
        super.init();
        this.handleDisplayState();
        // Les deux handlers n'écrivent que des signals : l'écriture notifie elle-même la vue
        // (OnPush), pas besoin de zone.run ni de markForCheck → policy 'none'.
        this.addListener(
            this.mediaPlayerElement.eventEmitter,
            PlayerEventType.METADATA_LOADED,
            this.handleMetadataLoaded,
            { policy: "none" },
        );
        this.addListener(
            this.mediaPlayerElement.eventEmitter,
            PlayerEventType.POSITION_SUBTITLE_CHANGE,
            this.changeSubtitlePosition,
            { policy: "none" },
        );
    }
    /**
     * switch container class based on width
     */

    public handleDisplayState() {
        this.displayState.set(this.mediaPlayerElement.getDisplayState());
    }

    /**
     * Return default config
     */
    public getDefaultConfig(): PluginConfigData<SubtitleConfig> {
        return {
            name: SubtitlesPluginComponent.PLUGIN_NAME,
            data: { parseLevel: 2, tcDelta: SubtitlesPluginComponent.TC_DELTA },
        };
    }

    /**
     * Invoked on metadata loaded
     */

    protected override handleMetadataLoaded() {
        this.refreshMetadata();
    }

    /**
     * Invoked for reload and parse metadata
     */
    private refreshMetadata() {
        const handleMetadataIds = this.pluginConfiguration.metadataIds;
        const metadataManager = this.mediaPlayerElement.metadataManager;
        this.logger.info(`Metadata loaded subtitle handle metadata ids: ${handleMetadataIds}`);
        // Check if metadata is initialized
        if (metadataManager && handleMetadataIds && Utils.isArrayLike<string>(handleMetadataIds)) {
            let transcriptions = new Array<TranscriptionLocalisation>();
            handleMetadataIds.forEach((metadataId) => {
                this.logger.info(`get metadata for ${metadataId}`);
                const transcriptionLocalisations = metadataManager.getTranscriptionLocalisations(
                    metadataId,
                    this.pluginConfiguration.data.parseLevel,
                    false,
                );
                if (transcriptionLocalisations && transcriptionLocalisations.length > 0) {
                    transcriptions = transcriptions.concat(transcriptionLocalisations);
                }
            });
            this.transcriptions.set(transcriptions);
        }
    }

    /**
     * Invoked when user change subtitle position
     */

    private changeSubtitlePosition(event) {
        this.logger.debug("Change position subtitles", event);
        this.posSubtitle.set(event);
    }
}
