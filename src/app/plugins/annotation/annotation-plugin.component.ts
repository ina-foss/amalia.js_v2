import {Component, OnInit} from '@angular/core';
import {PluginBase} from "../../core/plugin/plugin-base";
import {PluginConfigData} from "../../core/config/model/plugin-config-data";
import {AnnotationConfig} from "../../core/config/model/annotation-config";
import {MediaPlayerService} from "../../service/media-player-service";
import {AnnotationInfo, AnnotationLocalisation} from "../../core/metadata/model/annotation-localisation";

@Component({
    selector: 'amalia-annotation',
    templateUrl: './annotation-plugin.component.html',
    styleUrls: ['./annotation-plugin.component.scss']
})
export class AnnotationPluginComponent extends PluginBase<AnnotationConfig> implements OnInit {
    public static PLUGIN_NAME = 'ANNOTATION';
    public segmentsInfo: AnnotationInfo = null;
    public newSegment: AnnotationLocalisation = {
        displayMode: "new", selected: false,
        tc: "0",
        tcIn: "0", tcOut: "0"
    };
    public editNewSegmentActivated = false;

    getDefaultConfig(): PluginConfigData<AnnotationConfig> {
        return {
            name: AnnotationPluginComponent.PLUGIN_NAME,
            data: {title: AnnotationPluginComponent.PLUGIN_NAME}
        };
    }

    public ngOnInit() {
        super.ngOnInit();
        this.initializeNewSegment();
    }

    constructor(playerService: MediaPlayerService) {
        super(playerService);
        this.pluginName = AnnotationPluginComponent.PLUGIN_NAME;
    }

    public initializeNewSegment() {
        if (this.segmentsInfo == null) {
            this.segmentsInfo = {
                id: new Date() as unknown as string,
                label: 'Annotation',
                data: new Array<AnnotationLocalisation>()
            };
        }
        this.editNewSegmentActivated = true;
    }

    public editSegment() {
        const selectedSegment = this.segmentsInfo.data.find(segment => segment.selected);
        if (selectedSegment) {
            selectedSegment.displayMode = "edit";
        }
    }

    public createNewSegment(event: AnnotationLocalisation) {
        this.editNewSegmentActivated = false;
        this.segmentsInfo.data.push(event);
    }

    public cancelNewSegmentCreation() {
        this.editNewSegmentActivated = false;
    }

    manageSegment(event: string) {
        switch (event) {
            case 'create':
                return;
            case 'edit':
                this.editSegment();
                return;
            case 'cancel':
                this.cancelNewSegmentCreation();
                return;
            case 'clone':
                let newSegmentCopy: AnnotationLocalisation = {
                    displayMode: "new",
                    selected: true,
                    tc: "",
                    tcIn: "",
                    tcOut: ""
                };
                const sourceSegment = this.segmentsInfo.data.find(segment => segment.selected);
                Object.assign(newSegmentCopy, sourceSegment);
                if (newSegmentCopy) {
                    sourceSegment.selected = false;
                    newSegmentCopy.displayMode = "new";
                }
            case 'remove':
                this.segmentsInfo.data = this.segmentsInfo.data.filter(segment => !segment.selected);

        }
    }
}
