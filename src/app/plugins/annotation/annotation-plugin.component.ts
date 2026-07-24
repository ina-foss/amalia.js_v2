import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    computed,
    effect,
    ElementRef,
    OnDestroy,
    signal,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";
import { PluginBase } from "../../core/plugin/plugin-base";
import { PluginConfigData } from "../../core/config/model/plugin-config-data";
import { AnnotationConfig } from "../../core/config/model/annotation-config";
import { MediaPlayerService } from "../../service/media-player-service";
import { DEFAULT } from "../../core/constant/default";
import { AnnotationLocalisation } from "../../core/metadata/model/annotation-localisation";
import { PlayerEventType } from "../../core/constant/event-type";
import { Utils } from "../../core/utils/utils";
import sortBy from "lodash/sortBy";
import { ConfirmationService, PrimeTemplate } from "primeng/api";
import { FileService } from "../../service/file.service";
import { FormatUtils } from "../../core/utils/format-utils";
import { ToastComponent } from "../../core/toast/toast.component";
import { SegmentComponent } from "./segment/segment.component";
import { ShortcutEvent } from "src/app/core/config/model/shortcuts-event";
import { AnnotationsService } from "src/app/service/annotations.service";
import { Bind } from "primeng/bind";
import { Button } from "primeng/button";
import { ConfirmDialog } from "primeng/confirmdialog";
import { ProgressSpinner } from "primeng/progressspinner";

export interface ExportColumnsHeader {
    Lien: string;
    "ID du materiel": string;
    "ID du segment": string;
    Titre: string;
    "TC Debut": string;
    "TC Fin": string;
    Duree: string;
    Mots_cles: string;
    Categories: string;
    Description: string;
    "Lien de l\'imagette": string;
    "Id Document": string;
    "Type Document": string;
    "Titre de l\'instance": string;
}

@Component({
    selector: "amalia-annotation",
    templateUrl: "./annotation-plugin.component.html",
    styleUrls: ["./annotation-plugin.component.scss"],
    encapsulation: ViewEncapsulation.ShadowDom,
    imports: [Bind, Button, ToastComponent, ConfirmDialog, PrimeTemplate, ProgressSpinner, SegmentComponent],
    // OnPush (phase 7 vague 3) : la liste de segments est mutée en place par des timers
    // (Utils.waitFor) — le template itère sur segments(), copie superficielle recalculée à
    // chaque notifySegmentsChanged() (signal segmentsVersion), et chaque mutateur bump ce
    // signal. dataLoading (champ plat de PluginBase) est doublé par le signal
    // dataLoadingState (override setDataLoading). La synchro inter-instances passe par le
    // signal AnnotationsService.refreshedBy + un effect local — plus aucun appel au cdr
    // d'un autre composant. Les champs restés plats (availableCategories/Keywords, fps,
    // noSpinner, technical_id, assetId, link) ne changent qu'à l'init ; enabledExportButtons
    // n'est muté que par des handlers de template (l'événement marque la vue). Les
    // detectChanges restants (tous sur le cdr PROPRE du composant) sont conservés et
    // commentés : ils matérialisent la vue depuis des contextes timer sans zone.
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnotationPluginComponent extends PluginBase<AnnotationConfig> implements OnDestroy {
    public static PLUGIN_NAME = "ANNOTATIONS";
    public static KARAOKE_TC_DELTA = 0.25;

    public segmentsInfo: AnnotationLocalisation = {
        data: {},
        tc: 0,
        tcIn: 0,
        tcOut: 0,
        subLocalisations: [],
    };
    public tcDisplayFormat: "h" | "m" | "s" | "minutes" | "f" | "ms" | "mms" | "hours" | "seconds" = "s";
    public override fps = DEFAULT.FPS;
    public autoScroll = true;
    public segmentBeforeEdition: AnnotationLocalisation;
    public currentTime: number;
    @ViewChild("annotationElement", { static: false })
    public annotationElement: ElementRef<HTMLElement>;
    @ViewChild("toast")
    public toast: ToastComponent;

    availableCategories: string[] = [];
    availableKeywords: string[] = [];
    assetId: string;
    link: string;
    enabledExportButtons: boolean = false;
    public technical_id: string;

    /**
     * Compteur de version de la liste de segments : subLocalisations est mutée en place
     * (souvent depuis des timers Utils.waitFor, hors de tout événement de template) — chaque
     * mutateur appelle {@link notifySegmentsChanged} pour notifier la vue OnPush.
     */
    public readonly segmentsVersion = signal(0);
    /**
     * Source du @for du template : copie superficielle recalculée à chaque bump de
     * segmentsVersion (nouvelle référence → re-diff du @for, identités des segments
     * préservées → DOM réutilisé).
     */
    public readonly segments = computed<AnnotationLocalisation[]>(() => {
        this.segmentsVersion();
        return [...(this.segmentsInfo?.subLocalisations ?? [])];
    });
    /**
     * Miroir signal de PluginBase.dataLoading (champ plat), seul lu par le template —
     * setDataLoading est appelé depuis les timers Utils.waitFor.
     */
    public readonly dataLoadingState = signal(false);

    public override setDataLoading(dataLoading: boolean) {
        super.setDataLoading(dataLoading);
        this.dataLoadingState.set(dataLoading);
    }

    /** Notifie la vue OnPush qu'une mutation en place de la liste de segments a eu lieu. */
    public notifySegmentsChanged(): void {
        this.segmentsVersion.update((version) => version + 1);
    }

    sortAnnotations() {
        if (this.segmentsInfo.subLocalisations && this.segmentsInfo.subLocalisations.length > 0) {
            this.segmentsInfo.subLocalisations = sortBy(this.segmentsInfo.subLocalisations, ["tcIn"]);
            this.notifySegmentsChanged();
            // detectChanges conservé (phase 7) : appelé depuis ngOnInit et depuis les timers
            // Utils.waitFor — matérialise synchroniquement la liste triée avant les mesures/
            // scrolls qui suivent dans le flux (comportement historique).
            this.cdr.detectChanges();
        }
    }

    override ngOnInit() {
        try {
            super.ngOnInit();
        } catch (e) {
            this.logger.debug("An error occured when initializing the pluging " + this.pluginName, e);
        }
        if (this.mediaPlayerElement) {
            this.init();
            this.handleMetadataLoaded();
            this.annotationsService.setFocusedAnnotation(this);
        }
    }

    /**
     * Apply shortcut if exists on keydown
     */
    public handleShortcuts(event: ShortcutEvent) {
        if (event.targets.find((target) => target.toLowerCase() === this.pluginName.toLowerCase())) {
            this.applyShortcut(event);
        }
    }
    applyShortcut(event: ShortcutEvent) {
        if (
            event.shortcut.key === "i" &&
            event.shortcut.ctrl !== true &&
            event.shortcut.shift !== true &&
            event.shortcut.alt !== true &&
            event.shortcut.meta !== true
        ) {
            this.initializeNewSegment();
            return;
        }
        if (
            event.shortcut.key === "o" &&
            event.shortcut.ctrl !== true &&
            event.shortcut.shift !== true &&
            event.shortcut.alt !== true &&
            event.shortcut.meta !== true
        ) {
            this.setTcOut();
            return;
        }
        if (
            event.shortcut.key === "d" &&
            event.shortcut.ctrl === true &&
            event.shortcut.shift !== true &&
            event.shortcut.alt !== true &&
            event.shortcut.meta !== true
        ) {
            this.downloadSegmentJsonFormat();
            return;
        }
    }

    override init() {
        super.init();
        if (this.pluginConfiguration.data) {
            this.tcDisplayFormat = this.pluginConfiguration.data.timeFormat || this.getDefaultConfig().data.timeFormat;

            if (this.pluginConfiguration.data.fps) {
                this.fps = this.pluginConfiguration.data.fps;
            }
            if (this.pluginConfiguration.data.autoScroll) {
                this.autoScroll = true;
            }
            if (this.pluginConfiguration.data.noSpinner != undefined) {
                this.noSpinner = this.pluginConfiguration.data.noSpinner;
            }
            this.setAnnotationsInfoFromConfig();
        }
    }

    setAnnotationsInfoFromConfig = () => {
        if (this.pluginConfiguration.data.availableCategories) {
            this.availableCategories = this.pluginConfiguration.data.availableCategories;
        }
        if (this.pluginConfiguration.data.availableKeywords) {
            this.availableKeywords = this.pluginConfiguration.data.availableKeywords;
        }
        if (this.pluginConfiguration.data.timeout) {
            this.timeout = this.pluginConfiguration.data.timeout;
        }
        if (this.pluginConfiguration.data.assetId) {
            this.assetId = this.pluginConfiguration.data.assetId;
        }
        if (this.pluginConfiguration.data.link) {
            this.link = this.pluginConfiguration.data.link;
        }
    };

    /**
     * In charge to load metadata
     */

    private parseAnnotation() {
        const handleMetadataIds = this.pluginConfiguration.metadataIds;
        const metadataManager = this.mediaPlayerElement.metadataManager;
        this.logger.info(` Metadata loaded annotations ${handleMetadataIds}`);

        // Check if metadata is initialized
        if (metadataManager && handleMetadataIds && Utils.isArrayLike<string>(handleMetadataIds)) {
            this.segmentsInfo.subLocalisations = [];
            for (const metadataId of handleMetadataIds) {
                this.logger.info(`get metadata for ${metadataId}`);
                const annotationLocalisations = metadataManager.getAnnotationLocalisations(metadataId);
                if (annotationLocalisations && annotationLocalisations.length > 0) {
                    this.segmentsInfo.subLocalisations = this.segmentsInfo.subLocalisations.concat(
                        annotationLocalisations.map((al) => {
                            al.data.hierarchy_technical_id = this.technical_id;
                            al.data.media = al.media;
                            al.data.isTitleEditing = false;
                            al.data.isTcInEditing = false;
                            al.data.isTcOutEditing = false;
                            al.data.isTcEditing = false;
                            al.data.isCategoriesEditing = false;
                            al.data.isKeywordsEditing = false;
                            al.data.isDescriptionEditing = false;
                            return al;
                        }),
                    );
                    this.subscriptionToEventsEmitters.push(
                        Utils.waitFor(
                            this.mediaPlayerElementReady.bind(this),
                            this.setSegmentsTcOffsetAndTcMax.bind(this),
                            this.logWaitForTcOffsetComplete.bind(this),
                            this.intervalStep,
                            this.timeout,
                            this.setDataLoading.bind(this),
                        ),
                    );
                }
                // Add sort by tcin
                this.sortAnnotations();
            }
            // Notifie la vue OnPush même quand la liste rechargée est vide (sortAnnotations
            // ne bump que si elle contient des éléments).
            this.notifySegmentsChanged();
        }
    }

    /**
     * Invoked on metadata loaded
     */

    override handleMetadataLoaded() {
        this.parseAnnotation();
    }

    getDefaultConfig(): PluginConfigData<AnnotationConfig> {
        return {
            name: AnnotationPluginComponent.PLUGIN_NAME,
            data: {
                title: AnnotationPluginComponent.PLUGIN_NAME,
                timeFormat: "f",
                fps: DEFAULT.FPS,
                autoScroll: true,
                parseLevel: 1,
                withSubLocalisations: false,
                karaokeTcDelta: AnnotationPluginComponent.KARAOKE_TC_DELTA,
                progressBar: false,
                mode: 2,
                label: "Rechercher dans les annotations",
                key: "Enter",
                labelSynchro: "Synchronisation des annotations",
            },
        };
    }

    constructor(
        private readonly confirmationService: ConfirmationService,
        playerService: MediaPlayerService,
        private readonly fileService: FileService,
        private readonly cdr: ChangeDetectorRef,
        private readonly annotationsService: AnnotationsService,
    ) {
        super(playerService);
        this.pluginName = AnnotationPluginComponent.PLUGIN_NAME;
        this.technical_id = crypto.randomUUID();
        annotationsService.registerAnnotation(this);
        // Synchronisation inter-instances (phase 7) : remplace l'ancienne boucle
        // annotation.cdr.detectChanges() de syncOtherAnnotationsComponents — chaque instance
        // réagit elle-même au signal partagé du service.
        effect(() => {
            const refresh = this.annotationsService.refreshedBy();
            if (refresh.version === 0 || refresh.sourceTechnicalId === this.technical_id) {
                return;
            }
            if (!this.mediaPlayerElement) {
                return;
            }
            // Déféré hors du passage de CD porteur de l'effect : handleMetadataLoaded →
            // sortAnnotations exécute un detectChanges synchrone, interdit pendant un cycle
            // de change detection (même séquencement que l'ancien .then() de promesse).
            queueMicrotask(() => {
                this.handleMetadataLoaded();
                this.setDataLoading(false);
            });
        });
    }

    public initializeNewSegment() {
        this.subscriptionToEventsEmitters.push(
            Utils.waitFor(
                this.mediaPlayerElementReady.bind(this),
                undefined,
                this.initSegmentData.bind(this),
                this.intervalStep,
                this.timeout,
                this.setDataLoading.bind(this),
            ),
        );
    }

    public async initSegmentData() {
        if (this.mediaPlayerElementReady()) {
            const tcOffset = this.mediaPlayerElement.getConfiguration().tcOffset;
            this.unselectAllSegments();
            let tcIn = this.mediaPlayerElement.getMediaPlayer().getCurrentTime();
            tcIn = tcIn + tcOffset;
            const maxDuration = this.mediaPlayerElement.getMediaPlayer().getDuration() + tcOffset;
            const segmentToBeAdded: AnnotationLocalisation = {
                label: "",
                data: {
                    selected: true,
                    tcMax: maxDuration,
                    tcThumbnail: tcIn,
                    hierarchy_technical_id: this.technical_id,
                    isTitleEditing: false,
                    isTcInEditing: false,
                    isTcOutEditing: false,
                    isTcEditing: false,
                    isCategoriesEditing: false,
                    isKeywordsEditing: false,
                    isDescriptionEditing: false,
                },
                tc: 0,
                tcIn: tcIn,
                tcOut: tcIn,
                tclevel: 1,
                tcOffset,
            };

            //Thumbnail
            if (this.mediaPlayerElement.getMediaPlayer()?.mse?.mediaType === "VIDEO") {
                segmentToBeAdded.data.media = "VIDEO";
                segmentToBeAdded.thumb = this.mediaPlayerElement.getMediaPlayer().captureImage(1);
            } else {
                segmentToBeAdded.data.media = "AUDIO";
                segmentToBeAdded.thumb = "/assets/amalia/images/newAudioBackGround.png";
            }

            segmentToBeAdded.data.tcThumbnail =
                (this.mediaPlayerElement.getMediaPlayer().getCurrentTime() + tcOffset) * 1000;

            const event: any = {
                type: "init",
                payload: segmentToBeAdded,
            };
            // detectChanges conservé (phase 7) : contexte timer Utils.waitFor (hors zone/
            // événement) — matérialise la désélection avant l'émission d'ANNOTATION_ADD,
            // dont le handler hôte peut lire le DOM (comportement historique).
            this.cdr.detectChanges();
            this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.ANNOTATION_ADD, event);
            this.subscriptionToEventsEmitters.push(
                Utils.waitFor(
                    () => event.status != undefined,
                    undefined,
                    {
                        fn: this.addSegmentToSegmentsInfo.bind(this),
                        param: event,
                    },
                    this.intervalStep,
                    10000,
                    this.setDataLoading.bind(this),
                ),
            );
            this.manageEventResponseStatus(event, true);
        } else {
            this.logWaitForTcOffsetComplete();
        }
    }

    private addSegmentToSegmentsInfo(event) {
        if (event.status === "success") {
            const segment = event.payload;
            if (this.segmentsInfo.subLocalisations.length === 0) {
                this.segmentsInfo.subLocalisations.push(event.payload);
            } else {
                let insertAt: number = 0;
                for (let i = this.segmentsInfo.subLocalisations.length - 1; i >= 0; i--) {
                    if (this.segmentsInfo.subLocalisations[i].tcIn <= segment.tcIn) {
                        insertAt = i + 1;
                        break;
                    }
                }
                if (insertAt === this.segmentsInfo.subLocalisations.length) {
                    this.segmentsInfo.subLocalisations.push(segment);
                } else {
                    this.segmentsInfo.subLocalisations.splice(insertAt, 0, segment);
                }
            }
            // Exécuté depuis un timer Utils.waitFor : le bump notifie la vue OnPush.
            this.notifySegmentsChanged();
            setTimeout(this.scroll.bind(this), 50);
        }
    }

    private removeSegmentFromSegmentsInfo(event) {
        if (event.status === "success") {
            const indexOfSegment = this.segmentsInfo.subLocalisations.indexOf(event.payload);
            this.segmentsInfo.subLocalisations.splice(indexOfSegment, 1);
            this.notifySegmentsChanged();
        }
    }

    public setSegmentsTcOffsetAndTcMax() {
        if (this.mediaPlayerElementReady()) {
            const tcOffset = this.mediaPlayerElement.getConfiguration().tcOffset || 0;
            this.segmentsInfo.subLocalisations.forEach((localisation) => {
                localisation.tcOffset = tcOffset;
                localisation.data.tcMax = this.mediaPlayerElement.getMediaPlayer().getDuration() + tcOffset;
                if (this.mediaPlayerElement.getMediaPlayer()?.mse?.mediaType === "AUDIO") {
                    localisation.thumb = "/assets/amalia/images/newAudioBackGround.png";
                }
            });
            // Timer Utils.waitFor : mutations en place (tcOffset/tcMax/thumb) lues par les
            // segments enfants → bump.
            this.notifySegmentsChanged();
        }
    }

    public editSegment(segment) {
        if (segment) {
            this.segmentBeforeEdition = structuredClone(segment);
            this.unselectAllSegments();
            segment.data.selected = true;
            if (segment.label !== undefined && segment.label.includes(SegmentComponent.SEGMENT_SANS_TITRE)) {
                segment.label = "";
            }
            this.notifySegmentsChanged();
        }
    }

    public unselectAllSegments() {
        this.segmentsInfo?.subLocalisations?.forEach((segment) => (segment.data.selected = false));
        this.notifySegmentsChanged();
    }

    public saveSegment(event) {
        if (event.status === "success") {
            event.payload.segment.data.selected = true;
            // Timer Utils.waitFor : mutation en place lue par le segment enfant → bump.
            this.notifySegmentsChanged();
        }
    }

    public cancelNewSegmentEdition(segment) {
        if (this.segmentBeforeEdition) {
            Object.assign(segment, this.segmentBeforeEdition);
            for (const key in segment) {
                if (this.segmentBeforeEdition[key] === undefined) {
                    delete segment[key];
                }
            }
            this.notifySegmentsChanged();
        }
    }

    public removeSegment(segment) {
        console.group("removeSegment" + " " + Date.now());

        const msg =
            segment.label === undefined || segment.label === "" ? SegmentComponent.SEGMENT_SANS_TITRE : segment.label;
        this.confirmationService.confirm({
            message: `Etes-vous sûr de vouloir supprimer le segment ['${msg}']`,
            header: "Confirmation",
            // note : pas d'icône ici — le template pTemplate="headless" du p-confirmDialog
            // ne rend pas message.icon (la propriété était sans effet).
            rejectButtonStyleClass: "p-button-text",
            rejectLabel: "Annuler",
            acceptLabel: "Supprimer",
            key: this.technical_id,
            accept: () => {
                console.group("removeSegment accept" + " " + Date.now());
                this.unselectAllSegments();
                const event: any = {
                    type: "remove",
                    payload: segment,
                };
                this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.ANNOTATION_REMOVE, event);
                this.subscriptionToEventsEmitters.push(
                    Utils.waitFor(
                        () => event.status != undefined,
                        undefined,
                        {
                            fn: this.removeSegmentFromSegmentsInfo.bind(this),
                            param: event,
                        },
                        this.intervalStep,
                        10000,
                        this.setDataLoading.bind(this),
                    ),
                );
                this.manageEventResponseStatus(event);
                console.groupEnd();
            },
            reject: () => {
                //we do nothing
            },
        });
        console.groupEnd();
    }

    displayEventResponseStatus(params: { event: any; noSuccessSnackBar?: boolean }) {
        const { event, noSuccessSnackBar = false } = params;
        if (event.status) {
            noSuccessSnackBar === false && this.displaySnackBar(event.responseMessage, event.status);
            if (event.status === "success") {
                this.syncOtherAnnotationsComponents();
                // detectChanges conservé (phase 7, cdr PROPRE du composant) : contexte timer
                // Utils.waitFor — rafraîchit la vue locale après les mutations du cycle
                // événementiel (selected, tc, thumb) sans attendre le prochain tick.
                this.cdr.detectChanges();
            }
        } else {
            this.displaySnackBar(event.type + " delai d'attente dépassé", event.status);
        }
    }

    manageEventResponseStatus(event, noSuccessSnackBar: boolean = false) {
        this.subscriptionToEventsEmitters.push(
            Utils.waitFor(
                () => event.status != undefined,
                undefined,
                {
                    fn: this.displayEventResponseStatus.bind(this),
                    param: { event, noSuccessSnackBar },
                },
                this.intervalStep,
                10000,
                this.setDataLoading.bind(this),
            ),
        );
    }

    manageSegment(event) {
        switch (event.type) {
            case "validate":
                event.payload = { segment: event.payload, updatedSegment: this.segmentBeforeEdition };
                this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.ANNOTATION_UPDATE, event);
                //après émission de l'évènement, nous attendons que son status soit renseigné avant d'appeler saveSegment
                this.subscriptionToEventsEmitters.push(
                    Utils.waitFor(
                        () => event.status != undefined,
                        undefined,
                        {
                            fn: this.saveSegment.bind(this),
                            param: event,
                        },
                        this.intervalStep,
                        10000,
                        this.setDataLoading.bind(this),
                    ),
                );
                //On gère ici l'affichage d'un message en réponse au status de l'évènement
                this.manageEventResponseStatus(event, true);
                return;
            case "edit":
                this.editSegment(event.payload);
                this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.ANNOTATION_EDITING, event);
                return;
            case "cancel":
                this.cancelNewSegmentEdition(event.payload);
                this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.ANNOTATION_CANCEL_EDITING, event);
                return;
            case "clone":
                {
                    const _event: any = {
                        type: event.type,
                        payload: this.cloneSegment(event.payload),
                    };
                    this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.ANNOTATION_ADD, _event);
                    //Nous attendons un retour après l'émission de l'évènement. Quand on a un success, on ajoute le segment cloné
                    const param = { index: 0, sourceSegment: event.payload, event: _event };
                    param.index = this.segmentsInfo.subLocalisations.indexOf(event.payload) + 1;
                    this.subscriptionToEventsEmitters.push(
                        Utils.waitFor(
                            () => _event.status === "success",
                            undefined,
                            {
                                fn: this.addSegmentAtIndex.bind(this),
                                param,
                            },
                            this.intervalStep,
                            10000,
                            this.setDataLoading.bind(this),
                        ),
                    );
                    this.manageEventResponseStatus(_event);
                }
                return;
            case "remove":
                this.removeSegment(event.payload);
                return;
            case "updatethumbnail": {
                const updatedSegment = structuredClone(event.payload);
                updatedSegment.data.tcThumbnail =
                    (this.mediaPlayerElement.getMediaPlayer().getCurrentTime() + this.tcOffset) * 1000;
                updatedSegment.thumb = this.mediaPlayerElement.getMediaPlayer().captureImage(1);
                const segment = event.payload;
                event.payload = { updatedSegment, segment };
                this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.ANNOTATION_UPDATE, event);
                this.subscriptionToEventsEmitters.push(
                    Utils.waitFor(
                        () => event.status != undefined,
                        undefined,
                        {
                            fn: this.updatethumbnail.bind(this),
                            param: event,
                        },
                        this.intervalStep,
                        10000,
                        this.setDataLoading.bind(this),
                    ),
                );
                this.manageEventResponseStatus(event, true);
                return;
            }
            case "playMedia": {
                const reverseMode = this.mediaPlayerElement.getMediaPlayer().reverseMode;
                const tcIn = event.payload.tcIn - event.payload.tcOffset;
                const duration = this.mediaPlayerElement.getMediaPlayer().getDuration();
                this.mediaPlayerElement.getMediaPlayer().setCurrentTime(reverseMode ? duration - tcIn : tcIn);
                this.mediaPlayerElement.getMediaPlayer().play();
                return;
            }
            case "muteShortCuts": {
                this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.SHORTCUT_MUTE);
                return;
            }
            case "unmuteShortCuts": {
                this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.SHORTCUT_UNMUTE);
                return;
            }
            case "openNotilusMaterial": {
                this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.OPEN_NOTILUS_MATERIAL, event);
                return;
            }
        }
    }

    syncOtherAnnotationsComponents() {
        const otherAnnotations: AnnotationPluginComponent[] = Array.from(
            this.annotationsService.getAnnotations(),
        ).filter((annotation) => annotation !== this);
        for (const annotation of otherAnnotations) {
            // Écriture du signal dataLoadingState de l'instance sœur (spinner on) : la vue
            // OnPush de la sœur est notifiée par sa propre écriture de signal, pas par un cdr.
            annotation.setDataLoading(true);
        }
        this.mediaPlayerElement.metadataManager.loadDataSourceForPlugin(AnnotationPluginComponent.PLUGIN_NAME).then(
            () => {
                // phase 7 : plus de handleMetadataLoaded()/cdr.detectChanges() imposés aux
                // instances sœurs — le signal du service les notifie et chacune se
                // resynchronise via son effect (voir constructeur).
                this.annotationsService.notifyAnnotationsRefreshed(this.technical_id);
            },
            () => {
                for (const annotation of otherAnnotations) {
                    annotation.setDataLoading(false);
                }
            },
        );
    }

    private cloneSegment(sourceSegment: AnnotationLocalisation): AnnotationLocalisation {
        const newSegmentCopy = structuredClone(sourceSegment);
        newSegmentCopy.data.selected = true;
        newSegmentCopy.label =
            sourceSegment.label === "" || sourceSegment.label === undefined
                ? `Copie de ${SegmentComponent.SEGMENT_SANS_TITRE}`
                : "Copie de " + sourceSegment.label;
        newSegmentCopy.id = undefined;
        return newSegmentCopy;
    }

    private addSegmentAtIndex(param: { index: number; sourceSegment: AnnotationLocalisation; event: any }) {
        if (param.event.status === "success") {
            this.segmentsInfo.subLocalisations.splice(param.index, 0, param.event.payload);
            param.sourceSegment.data.selected = false;
            this.notifySegmentsChanged();
            // detectChanges conservé (phase 7) : contexte timer Utils.waitFor — matérialise
            // synchroniquement le segment cloné avant le scroll différé qui le cherche dans
            // le DOM (comportement historique).
            this.cdr.detectChanges();
            setTimeout(this.scroll.bind(this), 50);
        }
    }

    public selectSegment(event: AnnotationLocalisation) {
        this.unselectAllSegments();
        event.data.selected = true;
        this.notifySegmentsChanged();
        this.annotationsService.setFocusedAnnotation(this);
    }

    private setTc(segment) {
        segment.tc = segment.tcOut - segment.tcIn;
    }

    public setTcInFn(event: any) {
        if (event.status === "success") {
            event.payload.segment.tcOut = event.payload.updatedSegment.tcOut;
            event.payload.segment.tcIn = event.payload.updatedSegment.tcIn;
            event.payload.segment.tc = event.payload.updatedSegment.tc;
            // Timer Utils.waitFor : tcIn/tcOut sont des inputs des segments enfants → bump.
            this.notifySegmentsChanged();
        }
    }

    public setTcIn() {
        const selectedSegment = this.segmentsInfo.subLocalisations.find((seg) => seg.data.selected);
        if (selectedSegment) {
            const updatedSegment = structuredClone(selectedSegment);
            const mediaTc = this.mediaPlayerElement.getMediaPlayer().getCurrentTime() + this.tcOffset;
            const maxTcOut = this.mediaPlayerElement.getMediaPlayer().getDuration() + this.tcOffset;
            const segmentTcOut = updatedSegment.tcOut;
            if (mediaTc <= maxTcOut) {
                if (mediaTc > segmentTcOut) {
                    updatedSegment.tcOut = mediaTc;
                }
                updatedSegment.tcIn = mediaTc;
                this.setTc(updatedSegment);
                const event: any = {
                    type: "setTcIn",
                    payload: { updatedSegment, segment: selectedSegment },
                };

                this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.ANNOTATION_UPDATE, event);
                this.subscriptionToEventsEmitters.push(
                    Utils.waitFor(
                        () => event.status != undefined,
                        undefined,
                        {
                            fn: this.setTcInFn.bind(this),
                            param: event,
                        },
                        this.intervalStep,
                        10000,
                        this.setDataLoading.bind(this),
                    ),
                );
                this.manageEventResponseStatus(event, true);
            } else {
                this.displaySnackBar("le TC Début doit être compris entre le TC Début et le TC OUT de l'intégral");
            }
        }
    }

    public setTcOutFn(event: any) {
        if (event.status === "success") {
            event.payload.segment.tcOut = event.payload.updatedSegment.tcOut;
            event.payload.segment.tc = event.payload.updatedSegment.tc;
            this.notifySegmentsChanged();
        }
    }

    public setTcOut() {
        const selectedSegment = this.segmentsInfo.subLocalisations.find((seg) => seg.data.selected);
        const maxTcOut = this.mediaPlayerElement.getMediaPlayer().getDuration() + this.tcOffset;
        if (selectedSegment) {
            const updatedSegment = structuredClone(selectedSegment);
            const mediaTc = this.mediaPlayerElement.getMediaPlayer().getCurrentTime() + this.tcOffset;
            if (mediaTc < selectedSegment.tcIn || mediaTc > maxTcOut) {
                this.displaySnackBar(
                    "Le TC Fin doit être supérieur au TC Début et compris entre le TC Début et le TC Fin du fichier intégral",
                );
            } else {
                //set tcOut
                updatedSegment.tcOut = mediaTc;
                //set tc
                this.setTc(updatedSegment);
                const event: any = {
                    type: "setTcOut",
                    payload: { updatedSegment, segment: selectedSegment },
                };

                this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.ANNOTATION_UPDATE, event);
                this.subscriptionToEventsEmitters.push(
                    Utils.waitFor(
                        () => event.status != undefined,
                        undefined,
                        {
                            fn: this.setTcOutFn.bind(this),
                            param: event,
                        },
                        this.intervalStep,
                        10000,
                        this.setDataLoading.bind(this),
                    ),
                );
                this.manageEventResponseStatus(event, true);
            }
        }
    }

    private getFileName = (extension?) => {
        const assetIdParts = this.assetId.split(":");
        let currentDateTime = new Date().toISOString().replaceAll(":", "");
        currentDateTime = currentDateTime.replaceAll("Z", "");
        currentDateTime = currentDateTime.replaceAll(".", "Z");
        currentDateTime = currentDateTime.replaceAll("-", "");
        if (this.assetId.search("stock") != -1) {
            return `${assetIdParts[1]}_${currentDateTime}${extension ?? ""}`;
        } else {
            return `${assetIdParts[2]}_${assetIdParts[3]}_${currentDateTime}${extension ?? ""}`;
        }
    };

    public downloadSegmentJsonFormat() {
        const textFileContent = JSON.stringify(this.getJsonDataFromAnnotations());
        let fileName = this.getFileName(".json");
        this.fileService.downloadFile(textFileContent, fileName);
    }

    public downloadSegments() {
        const jsonData = this.getJsonDataFromAnnotations();
        let fileName = this.getFileName();
        this.fileService.exportToExcel(jsonData, fileName);
    }

    getJsonDataFromAnnotations = (): ExportColumnsHeader[] => {
        return this.segmentsInfo.subLocalisations.map((localisation) => {
            let tcThumbnail = localisation.data.tcThumbnail - localisation.tcOffset * 1000;
            tcThumbnail = parseFloat((tcThumbnail / 1000).toFixed(9));
            const row: any = {
                Lien: this.link,
                "ID du materiel": this.assetId,
                "ID du segment": localisation.id,
                Titre: localisation.label,
                "TC Debut": FormatUtils.formatTime(localisation.tcIn, this.tcDisplayFormat, this.fps),
                "TC Fin": FormatUtils.formatTime(localisation.tcOut, this.tcDisplayFormat, this.fps),
                Duree: FormatUtils.formatTime(localisation.tc, this.tcDisplayFormat, this.fps),
                Mots_cles: localisation.property
                    ?.filter((value) => value.key === "keyword")
                    .map((value) => value.value)
                    .join("; "),
                Categories: localisation.property
                    ?.filter((value) => value.key === "category")
                    .map((value) => value.value)
                    .join("; "),
                Description: localisation.description,
                "Lien de l\'imagette": this.mediaPlayerElement?.getThumbnailUrl(tcThumbnail, true),
                "Id Document": localisation.data.idDocument,
                "Type Document": localisation.data.typeDocument,
                "Titre de l'instance": localisation.data.instanceTitle,
            };
            return row;
        });
    };

    public saveSegments() {
        this.segmentsInfo.data.itemBusinessIdentifier = "";
        this.segmentsInfo.data.creationUser = "";
        this.segmentsInfo.data.lastModificationUser = "";
    }

    public displaySnackBar(
        msgContent,
        severity?: "error" | "success" | "warn" | "info" | "contrast" | "secondary",
        life?: number,
    ) {
        const _severity = severity ? severity : "error";

        this.toast.addMessage({
            severity: _severity,
            summary: undefined,
            detail: msgContent,
            key: "br",
            life: life ?? 5000,
            data: { progress: 0 },
        });
    }

    public updatethumbnail(event: any) {
        if (event.status === "success") {
            this.unselectAllSegments();
            event.payload.segment.data.selected = true;
            event.payload.segment.data.tcThumbnail = event.payload.updatedSegment.data.tcThumbnail;
            event.payload.segment.thumb = event.payload.updatedSegment.thumb;
            this.notifySegmentsChanged();
        }
    }

    private scrollToNode() {
        const scrollNode: HTMLElement = this.annotationElement.nativeElement.querySelector(".segment-selected");
        if (scrollNode) {
            scrollNode.scrollIntoView({ behavior: "smooth", block: "center" });
            // detectChanges conservé (phase 7) : contexte timer Utils.waitFor — comportement
            // historique (rafraîchit la vue après le scroll).
            this.cdr.detectChanges();
        }
        const pluginTitle = document.querySelector(".plugin-title");
        if (pluginTitle) {
            pluginTitle.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    private scroll() {
        this.subscriptionToEventsEmitters.push(
            Utils.waitFor(
                () =>
                    this.annotationElement.nativeElement.querySelector(".segment-selected") !== null &&
                    this.annotationElement.nativeElement.querySelector(".segment-selected") != undefined,
                undefined,
                this.scrollToNode.bind(this),
                this.intervalStep,
                100,
            ),
        );
    }

    override ngOnDestroy(): void {
        if (!!this.subscriptionToEventsEmitters && this.subscriptionToEventsEmitters.length > 0) {
            for (const subscription of this.subscriptionToEventsEmitters) {
                subscription.unsubscribe();
            }
        }
        this.annotationsService.removeAnnotation(this);
    }

    toggleExportMenu() {
        this.enabledExportButtons = !this.enabledExportButtons;
    }
    isMainAnnotationComponent(): boolean {
        return this.annotationsService.getFocusedAnnotation() === this;
    }
}
