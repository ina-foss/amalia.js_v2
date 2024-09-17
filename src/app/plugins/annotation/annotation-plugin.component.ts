import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
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

@Component({
    selector: 'amalia-annotation',
    templateUrl: './annotation-plugin.component.html',
    styleUrls: ['./annotation-plugin.component.scss'],
    encapsulation: ViewEncapsulation.ShadowDom
})
export class AnnotationPluginComponent extends PluginBase<AnnotationConfig> implements OnInit {
    public static PLUGIN_NAME = 'ANNOTATION';
    public static KARAOKE_TC_DELTA = 0.250;
    public static SELECTOR_SEGMENT = 'segment';
    public static SELECTOR_SELECTED = 'selected';

    public segmentsInfo: AnnotationLocalisation = {data: {}, tc: 0, tcIn: 0, tcOut: 0, subLocalisations: []};
    public tcDisplayFormat: 'h' | 'm' | 's' | 'minutes' | 'f' | 'ms' | 'mms' | 'hours' | 'seconds' = 's';
    public fps = DEFAULT.FPS;
    public autoScroll = true;
    public ignoreNextScroll = false;
    public displaySynchro = false;
    private lastSelectedNode = null;
    public segmentBeforeEdition: AnnotationLocalisation;
    public currentTime: number;
    @ViewChild('annotationElement', {static: false})
    public annotationElement: ElementRef<HTMLElement>;


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
                this.mediaPlayerElement.eventEmitter.on(PlayerEventType.TIME_CHANGE, this.handleOnTimeChange);
            }
        }
        if (this.mediaPlayerElement.isMetadataLoaded) {
            this.parseAnnotation();
        }
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.METADATA_LOADED, this.handleMetadataLoaded);
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.SEEKED, this.handleOnTimeChange);
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
                }
            });
            // Add sort by tcin
            if (this.segmentsInfo.subLocalisations) {
                this.segmentsInfo.subLocalisations = _.sortBy(this.segmentsInfo.subLocalisations, ['tcIn']);
            }
        }
    }

    /**
     * Invoked on metadata loaded
     */
    @AutoBind
    private handleMetadataLoaded() {
        this.parseAnnotation();
    }

    /**
     *  In charge to remove selected parent
     */
    private disableRemoveSelectedSegment() {
        // remove selected segment
        Array.from(this.annotationElement.nativeElement.querySelectorAll(`.${AnnotationPluginComponent.SELECTOR_SEGMENT}.${AnnotationPluginComponent.SELECTOR_SELECTED}`))
                .forEach(node => {
                    node.classList.remove(AnnotationPluginComponent.SELECTOR_SELECTED);
                });
    }

    @AutoBind
    private handleOnTimeChange() {
        this.currentTime = this.mediaPlayerElement.getMediaPlayer().getCurrentTime();
        if (this.currentTime && this.pluginConfiguration.data.autoScroll && this.annotationElement) {
            const karaokeTcDelta = this.pluginConfiguration.data?.karaokeTcDelta || AnnotationPluginComponent.KARAOKE_TC_DELTA;
            if (this.pluginConfiguration.data.mode === 1) {
                this.disableRemoveAllSelectedNodes();
            } else {
                this.disableRemoveSelectedSegment();
            }
            this.selectSegmentFromTc(karaokeTcDelta);
        }
    }

    /**
     * In charge to select segment
     */

    private selectSegmentFromTc(karaokeTcDelta: number) {
        const segmentElementNodes = Array.from(this.annotationElement.nativeElement.querySelectorAll<HTMLElement>('.segment'));
        if (segmentElementNodes) {
            const segmentFilteredNodes = segmentElementNodes
                    .filter(node => this.currentTime >= parseFloat(node.getAttribute('data-tcin')) - karaokeTcDelta
                            && this.currentTime < parseFloat(node.getAttribute('data-tcout')));
            if (segmentFilteredNodes && segmentFilteredNodes.length > 0) {
                segmentFilteredNodes.forEach(segmentNode => {
                    segmentNode.classList.add(AnnotationPluginComponent.SELECTOR_SELECTED);
                });

            }
            if (this.lastSelectedNode !== segmentFilteredNodes[0]) {
                this.lastSelectedNode = segmentFilteredNodes;
                this.scroll();
            }
        }
    }

    /**
     * Invoked to scroll to node
     * @param scrollNode scroll node element
     */
    private scrollToNode(scrollNode: HTMLElement) {
        if (scrollNode) {
            const minScroll = Math.round(this.annotationElement.nativeElement.offsetHeight / 3);
            const maxScrollPos = Math.round((2 * this.annotationElement.nativeElement.offsetHeight) / 3);
            const scrollPos = scrollNode.offsetTop - this.annotationElement.nativeElement.offsetTop;
            const visible = scrollPos < maxScrollPos;
            if (this.ignoreNextScroll && !visible) {
                this.ignoreNextScroll = false;
                this.displaySynchro = false;
            }
            if (this.currentTime === 0) {
                this.annotationElement.nativeElement.scrollTop = 0;
            }
            // scroll to node if he's not visible
            if (this.autoScroll) {
                if (!(visible) && this.displaySynchro === false) {
                    this.annotationElement.nativeElement.scrollTop = scrollPos - minScroll;
                }
            }
        }
    }

    /**
     * In charge transcription to scroll position is equal to segment position minus transcription block padding and segment height
     */
    private scroll() {
        const scrollNode: HTMLElement = this.annotationElement.nativeElement
                .querySelector(`.${AnnotationPluginComponent.SELECTOR_SEGMENT}.${AnnotationPluginComponent.SELECTOR_SELECTED}`);
        if (scrollNode && this.displaySynchro === false) {
            this.scrollToNode(scrollNode);
            this.displaySynchro = false;
        }
    }

    /**
     *  In charge to remove selected elements and disable progress bar
     */
    private disableRemoveAllSelectedNodes() {
        // remove selected word
        Array.from(this.annotationElement.nativeElement.querySelectorAll(`.${AnnotationPluginComponent.SELECTOR_SELECTED}`))
                .forEach(node => {
                    if (!node.parentElement.parentElement.classList.contains(AnnotationPluginComponent.SELECTOR_SELECTED)) {
                        node.classList.remove(AnnotationPluginComponent.SELECTOR_SELECTED);
                    }
                });
        // remove selected segment
        Array.from(this.annotationElement.nativeElement.querySelectorAll(`.${AnnotationPluginComponent.SELECTOR_SEGMENT}.${AnnotationPluginComponent.SELECTOR_SELECTED}`))
                .forEach(node => {
                    node.classList.remove(AnnotationPluginComponent.SELECTOR_SELECTED);
                });
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

    public ngOnInit() {
        super.ngOnInit();
    }

    constructor(private confirmationService: ConfirmationService, playerService: MediaPlayerService, private thumbnailService: ThumbnailService, private messageService: MessageService, private fileService: FileService) {
        super(playerService);
        this.pluginName = AnnotationPluginComponent.PLUGIN_NAME;
    }

    public initializeNewSegment() {
        this.unselectAllSegments();
        const tcIn = this.mediaPlayerElement.getMediaPlayer().getCurrentTime();
        const url = this.mediaPlayerElement.getThumbnailUrl(tcIn, false);
        const maxDuration = this.mediaPlayerElement.getMediaPlayer().getDuration();
        const segmentToBeAdded: AnnotationLocalisation = {
            label: 'Segment sans titre',
            data: {
                displayMode: "readonly",
                selected: true,
                tcMax: maxDuration,
            },
            tc: 0,
            tcIn: tcIn, tcOut: tcIn, tclevel: 1, tcOffset: this.tcOffset
        };
        this.thumbnailService.getThumbnail(url, tcIn).then((blob) => {
            if (typeof (blob) !== 'undefined') {
                segmentToBeAdded.thumb = blob;
            }
        });
        this.segmentsInfo.subLocalisations.push(segmentToBeAdded);
        this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.ANNOTATION_ADD, {
            type: 'init',
            payload: segmentToBeAdded
        });
    }

    public editSegment(segment) {
        if (segment) {
            const editing = this.segmentsInfo?.subLocalisations?.find((segment => segment.data.displayMode !== "readonly"));
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
                this.segmentsInfo.subLocalisations = this.segmentsInfo.subLocalisations.filter(seg => seg !== segment);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Confirmation',
                    detail: 'Le segment a bien été supprimé.', key: 'br',
                    life: 1500
                });
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
                this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.ANNOTATION_REMOVE, event);
                return;
            case 'updatethumbnail':
                this.updatethumbnail(event.payload);
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

    /**
     * handle scroll event
     */
    public handleScroll(ignoreNextScroll?: boolean) {
        this.ignoreNextScroll = true;
        setTimeout(() => this.updateSynchro(), 350);
    }

    /**
     * if scrolling and active segment is not visible add synchro button
     */
    @AutoBind
    public updateSynchro() {
        let visible;
        const selector = '';
        /* find the right selector value inspired by what is done in the transcriptions '.' + annotationElement.SELECTOR_SEGMENT + ' > .' + annotationElement.SELECTOR_SUBSEGMENT
        + ' > ' + '.text > .' + TranscriptionPluginComponent.SELECTOR_WORD + '.' + TranscriptionPluginComponent.SELECTOR_SELECTED;*/
        const activeNode: HTMLElement = this.annotationElement.nativeElement.querySelector(selector);
        if (activeNode) {
            const positionA = this.annotationElement.nativeElement.getBoundingClientRect();
            const positionB = activeNode.getBoundingClientRect();
            // check if active element is visible
            const top = (positionB.top) >= positionA.top;
            const bottom = (positionB.top - activeNode.clientHeight) < (this.annotationElement.nativeElement.clientHeight + positionA.top);
            if (!(top && bottom)) {
                visible = false;
            }
            // display  button synchro if active node is not visible
            this.displaySynchro = visible === false;
        }
    }

    private setTc(segment) {
        segment.tc = segment.tcOut - segment.tcIn;
    }

    public setTcIn() {
        const selectedSegment = this.segmentsInfo.subLocalisations.find(seg => seg.data.selected);
        if (selectedSegment) {
            const mediaTc = this.mediaPlayerElement.getMediaPlayer().getCurrentTime();
            const segmentTcOut = selectedSegment.tcOut;
            if (mediaTc > segmentTcOut) {
                this.displaySnackBar('le TC IN doit être inférieur au TC OUT et compris entre le TC IN et le TC OUT de l\'intégral');
            } else {
                //set tcIn
                selectedSegment.tcIn = mediaTc;
                //set tc
                this.setTc(selectedSegment);
            }
        }
    }

    public setTcOut() {
        const selectedSegment = this.segmentsInfo.subLocalisations.find(seg => seg.data.selected);
        if (selectedSegment) {
            const mediaTc = this.mediaPlayerElement.getMediaPlayer().getCurrentTime();
            if (mediaTc < selectedSegment.tcIn) {
                this.displaySnackBar('Le TC OUT doit être supérieur au TC IN et compris entre le TC IN et le TC OUT du fichier intégral');
            } else {
                //set tcOut
                selectedSegment.tcOut = mediaTc;
                //set tc
                this.setTc(selectedSegment);
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

    public updatethumbnail(segment) {
        this.unselectAllSegments();
        segment.data.selected = true;
        segment.thumb = this.mediaPlayerElement.getMediaPlayer().captureImage(1);
        segment.data.tcThumbnail = this.mediaPlayerElement.getMediaPlayer().getCurrentTime();
    }

}
