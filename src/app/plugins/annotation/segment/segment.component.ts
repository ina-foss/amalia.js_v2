import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AnnotationLocalisation} from "../../../core/metadata/model/annotation-localisation";

@Component({
    selector: 'amalia-segment',
    templateUrl: './segment.component.html',
    styleUrl: './segment.component.scss',
})
export class SegmentComponent {
    @Input()
    public segment: AnnotationLocalisation;
    @Input()
    public displayMode: "new" | "edit" | "readonly" = "readonly";
    @Output()
    public actionEmitter: EventEmitter<string> = new EventEmitter<string>();
    @Output()
    public createSegment: EventEmitter<AnnotationLocalisation> = new EventEmitter<AnnotationLocalisation>();


    public createNewSegment() {
        const tmpSegment: AnnotationLocalisation = Object.assign({}, this.segment);
        this.actionEmitter.emit("create");
        this.createSegment.emit(tmpSegment);
    }

    public editSegment() {
        this.actionEmitter.emit("edit");
    }

    public cancelNewSegmentCreation() {
        this.actionEmitter.emit("cancel");
    }

    public cloneSegment() {
        this.actionEmitter.emit("clone");
    }

    public removeSegment() {
        this.actionEmitter.emit("remove");
    }
}
