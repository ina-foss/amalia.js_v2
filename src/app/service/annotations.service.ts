import { Injectable, signal } from '@angular/core';
import { AnnotationPluginComponent } from '../plugins/annotation/annotation-plugin.component';
import { Utils } from '../core/utils/utils';
import { PlayerEventType } from '../core/constant/event-type';
import { EventEmitter } from '@angular/core';
import { AnnotationAction } from '../core/metadata/model/annotation-localisation';

/**
 * État du signal de synchronisation inter-instances d'annotation.
 */
export interface AnnotationsRefresh {
    /** Compteur monotone : chaque rechargement de la datasource l'incrémente. */
    version: number;
    /** technical_id de l'instance à l'origine du rechargement (déjà à jour, ne se resynchronise pas). */
    sourceTechnicalId: string | null;
}

@Injectable({ providedIn: 'root' })
export class AnnotationsService {
    private readonly annotations: Set<AnnotationPluginComponent> = new Set();
    private focusedAnnotation: AnnotationPluginComponent;
    public actionEmitter: EventEmitter<AnnotationAction> = new EventEmitter<AnnotationAction>();
    /**
     * Signal partagé de synchronisation (phase 7 OnPush) : remplace les boucles
     * `annotation.cdr.detectChanges()` croisées de syncOtherAnnotationsComponents. L'instance
     * qui recharge la datasource notifie via {@link notifyAnnotationsRefreshed} ; chaque
     * composant annotation lit ce signal dans un effect et se resynchronise lui-même —
     * aucun composant n'appelle le ChangeDetectorRef d'un autre.
     */
    public readonly refreshedBy = signal<AnnotationsRefresh>({ version: 0, sourceTechnicalId: null });

    /** Signale aux instances sœurs que la datasource des annotations vient d'être rechargée. */
    public notifyAnnotationsRefreshed(sourceTechnicalId: string): void {
        this.refreshedBy.update(({ version }) => ({ version: version + 1, sourceTechnicalId }));
    }

    public registerAnnotation(annotation: AnnotationPluginComponent) {
        this.annotations.add(annotation);
    }
    public getAnnotations() {
        return this.annotations;
    }

    public removeAnnotation(annotation: AnnotationPluginComponent) {
        if (annotation.mediaPlayerElement?.eventEmitter) {
            Utils.unsubscribeTargetedElementEventListener(annotation, annotation.mediaPlayerElement.eventEmitter, PlayerEventType.SHORTCUT_KEYDOWN, annotation.handleShortcuts);
        }
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
                if (annotation.mediaPlayerElement?.eventEmitter) {
                    Utils.unsubscribeTargetedElementEventListener(annotation, annotation.mediaPlayerElement.eventEmitter, PlayerEventType.SHORTCUT_KEYDOWN, annotation.handleShortcuts);
                }
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