import {Component, ElementRef, OnInit, PipeTransform, ViewChild} from '@angular/core';
import {PluginBase} from "../../core/plugin/plugin-base";
import {PluginConfigData} from "../../core/config/model/plugin-config-data";
import {AnnotationConfig} from "../../core/config/model/annotation-config";
import {MediaPlayerService} from "../../service/media-player-service";
import {DEFAULT} from "../../core/constant/default";
import {AnnotationInfo, AnnotationLocalisation} from "../../core/metadata/model/annotation-localisation";
import {AutoBind} from "../../core/decorator/auto-bind.decorator";
import {PlayerEventType} from "../../core/constant/event-type";
import {Utils} from "../../core/utils/utils";
import * as _ from "lodash";
import {FormatUtils} from "../../core/utils/format-utils";
import {ThumbnailService} from "../../service/thumbnail-service";

export class TcFormatPipe implements PipeTransform {
    transform(tc: number, format: 'h' | 'm' | 's' | 'minutes' | 'f' | 'ms' | 'mms' | 'hours' | 'seconds' = null, defaultFps: number = 25) {
        return FormatUtils.formatTime(tc, format, defaultFps);
    }
}

@Component({
    selector: 'amalia-annotation',
    templateUrl: './annotation-plugin.component.html',
    styleUrls: ['./annotation-plugin.component.scss']
})
export class AnnotationPluginComponent extends PluginBase<AnnotationConfig> implements OnInit {
    public static PLUGIN_NAME = 'ANNOTATION';
    public static KARAOKE_TC_DELTA = 0.250;
    public static SELECTOR_SEGMENT = 'segment';
    public static SELECTOR_SELECTED = 'selected';

    public segmentsInfo: AnnotationInfo = {
        id: new Date() as unknown as string,
        label: 'Annotation',
        data: new Array<AnnotationLocalisation>()
    };
    public tcDisplayFormat: 'h' | 'm' | 's' | 'minutes' | 'f' | 'ms' | 'mms' | 'hours' | 'seconds' = 's';
    public fps = DEFAULT.FPS;
    public autoScroll = true;
    public ignoreNextScroll = false;
    public displaySynchro = false;
    private lastSelectedNode = null;
    public segmentBeforeEdition: AnnotationLocalisation;
    public currentTime: number;
    public tcFormatPipe = new TcFormatPipe();
    @ViewChild('annotationElement', {static: false})
    public annotationElement: ElementRef<HTMLElement>;
    /**
     * Handle thumbnail
     */
    private readonly thumbnailService: ThumbnailService;

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
            // this.parseTranscription();
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
                        .getAnnotationLocalisations(metadataId, this.pluginConfiguration.data.parseLevel, this.pluginConfiguration.data.withSubLocalisations);
                if (annotationLocalisations && annotationLocalisations.length > 0) {
                    this.segmentsInfo.data = this.segmentsInfo.data.concat(annotationLocalisations);
                }
            });
            // Add sort by tcin
            if (this.segmentsInfo.data) {
                this.segmentsInfo.data = _.sortBy(this.segmentsInfo.data, ['tcIn']);
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
                    const tcIn = Math.round(parseFloat(segmentNode.getAttribute('data-tcin')));
                    const tcOut = Math.round(parseFloat(segmentNode.getAttribute('data-tcout')));
                    const percentWidth = ((Math.round(this.currentTime) - tcIn) * 100) / (tcOut - tcIn);
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

    constructor(playerService: MediaPlayerService, thumbnailService: ThumbnailService) {
        super(playerService);
        this.pluginName = AnnotationPluginComponent.PLUGIN_NAME;
        this.thumbnailService = thumbnailService;
    }

    public initializeNewSegment() {
        this.unselectAllSegments();
        const tcIn = this.mediaPlayerElement.getMediaPlayer().getCurrentTime();
        const formattedTcIn = FormatUtils.formatTime(tcIn, this.tcDisplayFormat, this.fps);
        const url = this.mediaPlayerElement.getThumbnailUrl(tcIn, false);

        const segmentToBeAdded: AnnotationLocalisation = {
            label: 'Segment sans titre',
            displayMode: "readonly", selected: true,
            tc: FormatUtils.formatTime(0, this.tcDisplayFormat, this.fps),
            tcIn: formattedTcIn, tcOut: formattedTcIn
        };
        this.thumbnailService.getThumbnail(url, tcIn).then((blob) => {
            if (typeof (blob) !== 'undefined') {
                segmentToBeAdded.thumb = blob;
            }
        });
        this.segmentsInfo.data.push(segmentToBeAdded);
    }

    public editSegment(segment) {
        if (segment) {
            this.segmentBeforeEdition = {
                label: '',
                thumb: '',
                tcIn: '',
                tcOut: '',
                tc: '',
                categories: new Array<string>(),
                description: '',
                keywords: new Array<string>(),
                selected: false,
                displayMode: "readonly"
            };
            Object.assign(this.segmentBeforeEdition, segment);
            segment.displayMode = "edit";
        }
    }

    public unselectAllSegments() {
        this.segmentsInfo?.data?.forEach(segment => segment.selected = false);
    }

    public saveSegment(segment) {
        segment.selected = true;
        segment.displayMode = "readonly";
        //code to save the segmentsIfo into the persistence unit
    }

    public cancelNewSegmentEdition(segment) {
        if (this.segmentBeforeEdition) {
            Object.assign(segment, this.segmentBeforeEdition)
        }
        segment.displayMode = "readonly";
    }

    public removeSegment(segment) {
        this.unselectAllSegments();
        this.segmentsInfo.data = this.segmentsInfo.data.filter(seg => seg !== segment);
    }

    manageSegment(event) {
        switch (event.type) {
            case 'validate':
                this.saveSegment(event.payload);
                return;
            case 'edit':
                this.editSegment(event.payload);
                return;
            case 'cancel':
                this.cancelNewSegmentEdition(event.payload);
                return;
            case 'clone':
                this.cloneSegment(event.payload);
                return;
            case 'remove':
                this.removeSegment(event.payload);
                return;
        }
    }

    private cloneSegment(sourceSegment: AnnotationLocalisation) {
        const newSegmentCopy: AnnotationLocalisation = {
            displayMode: "readonly",
            selected: true,
            tc: "",
            tcIn: "",
            tcOut: ""
        };
        const indexOfSourceElement = this.segmentsInfo.data.indexOf(sourceSegment);
        Object.assign(newSegmentCopy, sourceSegment, {displayMode : "readonly", label:'Copie de ' + sourceSegment.label, selected:true});
        sourceSegment.selected = false;
         this.segmentsInfo.data.splice(indexOfSourceElement + 1, 0, newSegmentCopy);
      }

    public selectSegment(event: AnnotationLocalisation) {
        this.unselectAllSegments();
        event.selected = true;
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
}
