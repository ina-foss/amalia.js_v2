import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AnnotationAction, AnnotationLocalisation} from "../../../core/metadata/model/annotation-localisation";

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
    public actionEmitter: EventEmitter<AnnotationAction> = new EventEmitter<AnnotationAction>();

    public validateNewSegment() {
        this.actionEmitter.emit({type: "validate", payload: this.segment});
    }

    public editSegment() {
        this.actionEmitter.emit({type: "edit", payload: this.segment});
    }

    public cancelNewSegmentCreation() {
        this.actionEmitter.emit({type: "cancel", payload: this.segment});
    }

    public cloneSegment() {
        const tmpSegment: AnnotationLocalisation = Object.assign({}, this.segment);
        this.actionEmitter.emit({type: "clone", payload: tmpSegment});
    }

    public removeSegment() {
        this.actionEmitter.emit({type: "remove", payload: this.segment});
    }
}
