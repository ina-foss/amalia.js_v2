import {Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {PluginBase} from "../../core/plugin/plugin-base";
import {PluginConfigData} from "../../core/config/model/plugin-config-data";
import {AnnotationConfig} from "../../core/config/model/annotation-config";
import {MediaPlayerService} from "../../service/media-player-service";
import {DEFAULT} from "../../core/constant/default";
import {AnnotationLocalisation} from "../../core/metadata/model/annotation-localisation";
import {AutoBind} from "../../core/decorator/auto-bind.decorator";
import {PlayerEventType} from "../../core/constant/event-type";
import {Utils} from "../../core/utils/utils";
import * as _ from "lodash";
import {ThumbnailService} from "../../service/thumbnail-service";
import {ConfirmationService, MessageService} from "primeng/api";
import {FileService} from "../../service/file.service";
import {interval, of, Subscription, takeWhile, switchMap, takeUntil, timer} from "rxjs";

@Component({
    selector: 'amalia-annotation',
    templateUrl: './annotation-plugin.component.html',
    styleUrls: ['./annotation-plugin.component.scss'],
    encapsulation: ViewEncapsulation.ShadowDom
})
export class AnnotationPluginComponent extends PluginBase<AnnotationConfig> implements OnDestroy, OnInit {
    public static PLUGIN_NAME = 'ANNOTATION';
    public static KARAOKE_TC_DELTA = 0.250;
    subscriptionToWaitForMediaElementToLoad: Subscription;
    public segmentsInfo: AnnotationLocalisation = {
        data: {},
        tc: 0,
        tcIn: 0,
        tcOut: 0,
        subLocalisations: []
    };
    public tcDisplayFormat: 'h' | 'm' | 's' | 'minutes' | 'f' | 'ms' | 'mms' | 'hours' | 'seconds' = 's';
    public fps = DEFAULT.FPS;
    public autoScroll = true;
    public segmentBeforeEdition: AnnotationLocalisation;
    public currentTime: number;
    @ViewChild('annotationElement', {static: false})
    public annotationElement: ElementRef<HTMLElement>;
    public dataLoading: boolean = true;

    @AutoBind
    public mediaPlayerElementReady(): boolean {
        return !!(this.mediaPlayerElement) && !!(this.mediaPlayerElement.getMediaPlayer()) && !!(this.mediaPlayerElement.getConfiguration()) && !!(this.mediaPlayerElement.getConfiguration().tcOffset);
    }

    @AutoBind
    public waitForMediaElementToLoad(action: any): void {
        this.subscriptionToWaitForMediaElementToLoad = interval(10).pipe(// Vérifier toutes les 10 millisecondes
                switchMap(() => of(this.mediaPlayerElementReady())), takeWhile(conditionMet => !conditionMet, true) // Continuer tant que la condition n'est pas vérifiée
                , takeUntil(timer(30000))).subscribe({
            next: () => {
                if (this.mediaPlayerElementReady()) {
                    action(this.mediaPlayerElement.getConfiguration().tcOffset);
                }
            },
            complete: () => {
                if (this.mediaPlayerElementReady()) {
                    this.logger.info('Plugin Annotation', 'tcOffset bien renseigné');
                } else {
                    this.logger.info('Plugin Annotation', 'tcOffset n\' a pas  été renseigné');
                }
            }
        });
    }

    @AutoBind
    public setTcOffset(tcOffset: number) {
        this.logger.debug("setTcOffset");
        this.tcOffset = tcOffset
        this.dataLoading = false;
    }

    ngOnInit(): void {
        try {
            super.ngOnInit();
        } catch (e) {
            this.logger.debug("An error occured when initializing the pluging " + this.pluginName, e);
        }
        this.mediaPlayerElement.metadataManager.reloadDataSource('forAnnotations:').then(() => {
            this.handleMetadataLoaded();
        });
        this.waitForMediaElementToLoad(this.setTcOffset.bind(this));
    }

    @AutoBind
    init() {
        super.init();
        if (this.pluginConfiguration.data) {
            if (this.pluginConfiguration.data) {
                this.tcDisplayFormat = this.pluginConfiguration.data.timeFormat || this.getDefaultConfig().data.timeFormat;
            }
            if (this.pluginConfiguration.data.fps) {
                this.fps = this.pluginConfiguration.data.fps;
            }
            if (this.pluginConfiguration.data.autoScroll) {
                this.autoScroll = true;
            }
        }
    }

    /**
     * In charge to load metadata
     */
    private parseAnnotation() {
        const handleMetadataIds = this.pluginConfiguration.metadataIds;
        const metadataManager = this.mediaPlayerElement.metadataManager;
        this.logger.info(` Metadata loaded annotations ${handleMetadataIds}`);

        // Check if metadata is initialized
        if (metadataManager && handleMetadataIds && Utils.isArrayLike<string>(handleMetadataIds)) {

            handleMetadataIds.forEach((metadataId) => {
                this.logger.info(`get metadata for ${metadataId}`);
                const annotationLocalisations = metadataManager
                        .getAnnotationLocalisations(metadataId);
                if (annotationLocalisations && annotationLocalisations.length > 0) {
                    this.segmentsInfo.subLocalisations = this.segmentsInfo.subLocalisations.concat(annotationLocalisations);
                    this.waitForMediaElementToLoad(this.completeSegmentData.bind(this));
                }
                // Add sort by tcin
                if (this.segmentsInfo.subLocalisations && this.segmentsInfo.subLocalisations.length > 0) {
                    this.segmentsInfo.subLocalisations = _.sortBy(this.segmentsInfo.subLocalisations, ['tcIn']);
                }
            });
        }
    }

    /**
     * Invoked on metadata loaded
     */
    @AutoBind
    private handleMetadataLoaded() {
        this.parseAnnotation();
    }

    getDefaultConfig(): PluginConfigData<AnnotationConfig> {
        return {
            name: AnnotationPluginComponent.PLUGIN_NAME,
            data: {
                title: AnnotationPluginComponent.PLUGIN_NAME,
                timeFormat: 'f',
                fps: DEFAULT.FPS,
                autoScroll: true,
                parseLevel: 1,
                withSubLocalisations: false,
                karaokeTcDelta: AnnotationPluginComponent.KARAOKE_TC_DELTA,
                progressBar: false,
                mode: 2,
                label: 'Rechercher dans les annotations',
                key: 'Enter',
                labelSynchro: 'Synchronisation des annotations'
            }
        };
    }

    constructor(private confirmationService: ConfirmationService, playerService: MediaPlayerService, private thumbnailService: ThumbnailService, private messageService: MessageService, private fileService: FileService) {
        super(playerService);
        this.pluginName = AnnotationPluginComponent.PLUGIN_NAME;
    }

    public initializeNewSegment() {
        this.waitForMediaElementToLoad(this.initSegmentData.bind(this));
    }

    @AutoBind
    public initSegmentData(tcOffset: number) {
        this.unselectAllSegments();
        let tcIn = this.mediaPlayerElement.getMediaPlayer().getCurrentTime();
        tcIn = tcIn + tcOffset;
        const maxDuration = this.mediaPlayerElement.getMediaPlayer().getDuration() + tcOffset;
        const segmentToBeAdded: AnnotationLocalisation = {
            label: 'Segment sans titre',
            data: {
                displayMode: "readonly",
                selected: true,
                tcMax: maxDuration,
                tcThumbnail: tcIn
            },
            tc: 0,
            tcIn: tcIn, tcOut: tcIn, tclevel: 1, tcOffset
        };

        //Thumbnail
        segmentToBeAdded.thumb = this.mediaPlayerElement.getMediaPlayer().captureImage(1);
        segmentToBeAdded.data.tcThumbnail = this.mediaPlayerElement.getMediaPlayer().getCurrentTime();

        this.segmentsInfo.subLocalisations.push(segmentToBeAdded);
        this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.ANNOTATION_ADD, {
            type: 'init',
            payload: segmentToBeAdded
        });
    }

    @AutoBind
    public completeSegmentData(tcOffset: number) {
        this.segmentsInfo.subLocalisations.forEach(localisation => {
            localisation.tcOffset = tcOffset;
            localisation.data.tcMax = this.mediaPlayerElement.getMediaPlayer().getDuration() + tcOffset;
        })
    }

    public editSegment(segment) {
        if (segment) {
            const editing = this.segmentsInfo?.subLocalisations?.find((editModeSegment => editModeSegment.data.displayMode !== "readonly"));
            if (editing && editing !== segment) {
                this.confirmationService.confirm({
                    message: 'Etes-vous sûr de vouloir annuler les modifications du segment [' + editing.label + ']',
                    header: 'Confirmation',
                    icon: 'pi pi-exclamation-triangle',
                    rejectButtonStyleClass: "p-button-text",
                    rejectLabel: "Non",
                    acceptLabel: "Oui",
                    accept: () => {
                        this.cancelNewSegmentEdition(editing);
                        this.segmentBeforeEdition = structuredClone(segment);
                        segment.data.displayMode = "edit";
                        editing.data.selected = false;
                        segment.data.selected = true;
                    },
                    reject: () => {
                        editing.data.selected = true;
                        segment.data.selected = false;
                    }
                });
            } else {
                this.segmentBeforeEdition = structuredClone(segment);
                this.unselectAllSegments();
                segment.data.selected = true;
                segment.data.displayMode = "edit";
            }
        }
    }

    public unselectAllSegments() {
        this.segmentsInfo?.subLocalisations?.forEach(segment => segment.data.selected = false);
    }

    public saveSegment(segment) {
        segment.data.selected = true;
        segment.data.displayMode = "readonly";
        //code to save the segmentsIfo into the persistence unit
    }

    public cancelNewSegmentEdition(segment) {
        if (this.segmentBeforeEdition) {
            Object.assign(segment, this.segmentBeforeEdition)
        }
        segment.data.displayMode = "readonly";
    }

    public removeSegment(segment) {
        this.confirmationService.confirm({
            message: 'Etes-vous sûr de vouloir supprimer le segment [' + segment.label + ']',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            rejectButtonStyleClass: "p-button-text",
            rejectLabel: "Annuler",
            acceptLabel: "Supprimer",
            accept: () => {
                this.unselectAllSegments();
                const nbSegmentsBeforeEvent = this.segmentsInfo.subLocalisations.length;
                const info = {info: ''};
                this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.ANNOTATION_REMOVE, {
                    type: 'remove',
                    payload: {segment, segmentsInfo: this.segmentsInfo, info}
                });
                setTimeout(() => {
                    //On attend que le service supprime en base le segment
                    const nbSegmentsAfterEvent = this.segmentsInfo.subLocalisations.length;
                    if (nbSegmentsAfterEvent < nbSegmentsBeforeEvent) {
                        this.messageService.add(
                                {
                                    severity: 'success',
                                    summary: 'Confirmation',
                                    detail: 'Le segment a bien été supprimé.', key: 'br',
                                    life: 1500
                                })

                    } else {
                        this.messageService.add(
                                {
                                    severity: 'error',
                                    summary: 'Error',
                                    detail: "Le segment n'a pas été supprimé. " + info.info, key: 'br',
                                    life: 1500
                                })
                    }
                }, 1000)
            },
            reject: () => {
                //we do nothing
            }
        });
    }

    manageSegment(event) {
        switch (event.type) {
            case 'validate':
                this.saveSegment(event.payload);
                event.payload = {segment: event.payload, segmentBeforeEdition: this.segmentBeforeEdition};
                this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.ANNOTATION_UPDATE, event);
                return;
            case 'edit':
                this.editSegment(event.payload);
                this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.ANNOTATION_EDITING, event);
                return;
            case 'cancel':
                this.cancelNewSegmentEdition(event.payload);
                this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.ANNOTATION_CANCEL_EDITING, event);
                return;
            case 'clone':
                this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.ANNOTATION_ADD, {
                    type: event.type,
                    payload: this.cloneSegment(event.payload)
                });
                return;
            case 'remove':
                this.removeSegment(event.payload);
                return;
            case 'updatethumbnail':
                event.payload = {segment: event.payload, segmentBeforeEdition: this.updatethumbnail(event.payload)};
                this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.ANNOTATION_UPDATE, event);
                return;
        }
    }

    private cloneSegment(sourceSegment: AnnotationLocalisation): AnnotationLocalisation {
        const indexOfSourceElement = this.segmentsInfo.subLocalisations.indexOf(sourceSegment);
        const newSegmentCopy = structuredClone(sourceSegment);
        newSegmentCopy.data.displayMode = "readonly";
        newSegmentCopy.data.selected = true;
        newSegmentCopy.label = 'Copie de ' + sourceSegment.label;
        sourceSegment.data.selected = false;
        this.segmentsInfo.subLocalisations.splice(indexOfSourceElement + 1, 0, newSegmentCopy);
        return newSegmentCopy;
    }

    public selectSegment(event: AnnotationLocalisation) {
        this.unselectAllSegments();
        event.data.selected = true;
    }

    private setTc(segment) {
        segment.tc = segment.tcOut - segment.tcIn;
    }

    public setTcIn() {
        const selectedSegment = this.segmentsInfo.subLocalisations.find(seg => seg.data.selected);
        if (selectedSegment) {
            const segmentBeforeEdition = structuredClone(selectedSegment);
            const mediaTc = this.mediaPlayerElement.getMediaPlayer().getCurrentTime() + this.tcOffset;
            const maxTcOut = this.mediaPlayerElement.getMediaPlayer().getDuration() + this.tcOffset;
            const segmentTcOut = selectedSegment.tcOut;
            if (mediaTc > segmentTcOut && mediaTc <= maxTcOut) {
                selectedSegment.tcOut = mediaTc;
                selectedSegment.tcIn = mediaTc;
                this.setTc(selectedSegment);
                this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.ANNOTATION_UPDATE, {
                    type: 'setTcIn',
                    payload: {segment: selectedSegment, segmentBeforeEdition}
                });
            } else if (mediaTc <= maxTcOut) {
                //set tcIn
                selectedSegment.tcIn = mediaTc;
                //set tc
                this.setTc(selectedSegment);
                this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.ANNOTATION_UPDATE, {
                    type: 'setTcIn',
                    payload: {segment: selectedSegment, segmentBeforeEdition}
                });
            } else {
                this.displaySnackBar('le TC IN doit être compris entre le TC IN et le TC OUT de l\'intégral');
            }
        }
    }

    public setTcOut() {
        const selectedSegment = this.segmentsInfo.subLocalisations.find(seg => seg.data.selected);
        const maxTcOut = this.mediaPlayerElement.getMediaPlayer().getDuration() + this.tcOffset;
        if (selectedSegment) {
            const segmentBeforeEdition = structuredClone(selectedSegment);
            const mediaTc = this.mediaPlayerElement.getMediaPlayer().getCurrentTime() + this.tcOffset;
            if (mediaTc < selectedSegment.tcIn || mediaTc > maxTcOut) {
                this.displaySnackBar('Le TC OUT doit être supérieur au TC IN et compris entre le TC IN et le TC OUT du fichier intégral');
            } else {
                //set tcOut
                selectedSegment.tcOut = mediaTc;
                //set tc
                this.setTc(selectedSegment);
                this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.ANNOTATION_UPDATE, {
                    type: 'setTcOut',
                    payload: {segment: selectedSegment, segmentBeforeEdition}
                });
            }
        }

    }

    public downloadSegments() {
        const textFileContent = JSON.stringify(this.segmentsInfo);
        this.fileService.downloadFile(textFileContent, this.segmentsInfo.label + Date.now() + '.json');
    }

    public saveSegments() {
        this.segmentsInfo.data.itemBusinessIdentifier = '';
        this.segmentsInfo.data.creationUser = '';
        this.segmentsInfo.data.lastModificationUser = '';
    }

    public displaySnackBar(msgContent) {
        this.messageService.add({severity: 'error', summary: 'Error', detail: msgContent, key: 'br'});
    }

    public updatethumbnail(segment): AnnotationLocalisation {
        const segmentBeforeEdition = structuredClone(segment);
        this.unselectAllSegments();
        segment.data.selected = true;
        segment.data.tcThumbnail = this.mediaPlayerElement.getMediaPlayer().getCurrentTime();
        segment.thumb = this.mediaPlayerElement.getMediaPlayer().captureImage(1);
        return segmentBeforeEdition;
    }

    ngOnDestroy(): void {
        if (this.subscriptionToWaitForMediaElementToLoad) {
            this.subscriptionToWaitForMediaElementToLoad.unsubscribe();
        }
    }

}
