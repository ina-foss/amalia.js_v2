import {Component, OnInit} from '@angular/core';
import {PluginBase} from "../../core/plugin/plugin-base";
import {PluginConfigData} from "../../core/config/model/plugin-config-data";
import {AnnotationConfig} from "../../core/config/model/annotation-config";
import {MediaPlayerService} from "../../service/media-player-service";


@Component({
    selector: 'amalia-annotation',
    templateUrl: './annotation-plugin.component.html',
    styleUrls: ['./annotation-plugin.component.scss']
})
export class AnnotationPluginComponent extends PluginBase<AnnotationConfig> implements OnInit {
    public static PLUGIN_NAME = 'ANNOTATION';
    public segmentsInfo: AnnotationInfo = {
        id: new Date() as unknown as string,
        label: 'Annotation',
        data: new Set<AnnotationLocalisation>()
    };

    public segmentBeforeEdition: AnnotationLocalisation;

    getDefaultConfig(): PluginConfigData<AnnotationConfig> {
        return {
            name: AnnotationPluginComponent.PLUGIN_NAME,
            data: {title: AnnotationPluginComponent.PLUGIN_NAME}
        };
    }

    public ngOnInit() {
        super.ngOnInit();
    }

    constructor(playerService: MediaPlayerService) {
        super(playerService);
        this.pluginName = AnnotationPluginComponent.PLUGIN_NAME;
    }

    public initializeNewSegment() {
        this.unselectAllSegments();
        const segmentToBeAdded: AnnotationLocalisation = {
            label: 'Segment sans titre',
            displayMode: "readonly", selected: true,
            tc: "00:00:00:00",
            tcIn: "00:00:00:00", tcOut: "00:00:00:00"
        };
        this.segmentsInfo.data.add(segmentToBeAdded);
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
        this.segmentsInfo.data.delete(segment);
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
            displayMode: "new",
            selected: true,
            tc: "",
            tcIn: "",
            tcOut: ""
        };
        Object.assign(newSegmentCopy, sourceSegment);
        if (newSegmentCopy) {
            sourceSegment.selected = false;
            newSegmentCopy.displayMode = "new";
            this.segmentsInfo.data.add(newSegmentCopy);
        }
    }

    public selectSegment(event: AnnotationLocalisation) {
        this.unselectAllSegments();
        event.selected = true;
    }
}
