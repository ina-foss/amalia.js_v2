import { Injectable } from '@angular/core';
import { AnnotationPluginComponent } from '../plugins/annotation/annotation-plugin.component';
import { Utils } from '../core/utils/utils';
import { PlayerEventType } from '../core/constant/event-type';
import { EventEmitter } from '@angular/core';
import { AnnotationAction } from '../core/metadata/model/annotation-localisation';

@Injectable({ providedIn: 'root' })
export class AnnotationsService {
    private readonly annotations: Set<AnnotationPluginComponent> = new Set();
    private focusedAnnotation: AnnotationPluginComponent;
    public actionEmitter: EventEmitter<AnnotationAction> = new EventEmitter<AnnotationAction>();

    public registerAnnotation(annotation: AnnotationPluginComponent) {
        this.annotations.add(annotation);
    }
    public getAnnotations() {
        return this.annotations;
    }

    public removeAnnotation(annotation: AnnotationPluginComponent) {
        Utils.unsubscribeTargetedElementEventListener(annotation, annotation.mediaPlayerElement.eventEmitter, PlayerEventType.SHORTCUT_KEYDOWN, annotation.handleShortcuts);
        this.annotations.delete(annotation);
        if (this.focusedAnnotation === annotation) {
            this.setFocusToNextAvailableAnnotation();
        }
    }

    public setFocusedAnnotation(annotation: AnnotationPluginComponent) {
        this.focusedAnnotation = annotation;
        if (annotation) {
            const OtherAnnotations = Array.from(this.annotations).filter(a => a !== annotation);
            for (const annotation of OtherAnnotations) {
                Utils.unsubscribeTargetedElementEventListener(annotation, annotation.mediaPlayerElement.eventEmitter, PlayerEventType.SHORTCUT_KEYDOWN, annotation.handleShortcuts);
            }
            annotation.addListener(annotation.mediaPlayerElement.eventEmitter, PlayerEventType.SHORTCUT_KEYDOWN, annotation.handleShortcuts);
            this.actionEmitter.unsubscribe();
            this.actionEmitter = new EventEmitter<AnnotationAction>();
            this.actionEmitter.subscribe(annotation.manageSegment.bind(annotation));
        }
    }

    public getFocusedAnnotation() {
        return this.focusedAnnotation;
    }

    public setFocusToNextAvailableAnnotation() {
        if (this.annotations.size > 0) {
            this.setFocusedAnnotation(this.annotations.values().next().value);
        }
    }
}