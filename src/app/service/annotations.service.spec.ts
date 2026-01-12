import { AnnotationsService } from './annotations.service';
import { AnnotationPluginComponent } from '../plugins/annotation/annotation-plugin.component';
import { Utils } from '../core/utils/utils';
import { PlayerEventType } from '../core/constant/event-type';

describe('AnnotationsService', () => {
    let service: AnnotationsService;
    let mockAnnotation1: jasmine.SpyObj<AnnotationPluginComponent>;
    let mockAnnotation2: jasmine.SpyObj<AnnotationPluginComponent>;

    beforeEach(() => {
        service = new AnnotationsService();
        mockAnnotation1 = jasmine.createSpyObj('AnnotationPluginComponent', ['addListener', 'handleShortcuts','manageSegment'], {
            mediaPlayerElement: { eventEmitter: {} }
        }, );
        mockAnnotation2 = jasmine.createSpyObj('AnnotationPluginComponent', ['addListener', 'handleShortcuts','manageSegment'], {
            mediaPlayerElement: { eventEmitter: {} }
        });
        spyOn(Utils, 'unsubscribeTargetedElementEventListener');
    });

    it('should register an annotation', () => {
        service.registerAnnotation(mockAnnotation1);
        expect(service.getAnnotations().has(mockAnnotation1)).toBeTrue();
    });

    it('should return all annotations', () => {
        service.registerAnnotation(mockAnnotation1);
        service.registerAnnotation(mockAnnotation2);
        expect(service.getAnnotations().size).toBe(2);
    });

    it('should remove annotation and update focus if needed', () => {
        service.registerAnnotation(mockAnnotation1);
        service.registerAnnotation(mockAnnotation2);
        service.setFocusedAnnotation(mockAnnotation1);
        service.removeAnnotation(mockAnnotation1);
        expect(service.getAnnotations().has(mockAnnotation1)).toBeFalse();
        expect(service.getFocusedAnnotation()).toBe(mockAnnotation2);
    });

    it('should set focused annotation and unsubscribe others', () => {
        service.registerAnnotation(mockAnnotation1);
        service.registerAnnotation(mockAnnotation2);
        service.setFocusedAnnotation(mockAnnotation1);
        expect(service.getFocusedAnnotation()).toBe(mockAnnotation1);
        expect(Utils.unsubscribeTargetedElementEventListener).toHaveBeenCalledWith(
            mockAnnotation2,
            mockAnnotation2.mediaPlayerElement.eventEmitter,
            PlayerEventType.SHORTCUT_KEYDOWN,
            mockAnnotation2.handleShortcuts
        );
        expect(mockAnnotation1.addListener).toHaveBeenCalledWith(
            mockAnnotation1.mediaPlayerElement.eventEmitter,
            PlayerEventType.SHORTCUT_KEYDOWN,
            mockAnnotation1.handleShortcuts
        );
    });

    it('should return focused annotation', () => {
        service.setFocusedAnnotation(mockAnnotation1);
        expect(service.getFocusedAnnotation()).toBe(mockAnnotation1);
    });

    it('should set focus to next available annotation', () => {
        service.registerAnnotation(mockAnnotation1);
        service.registerAnnotation(mockAnnotation2);
        service.setFocusToNextAvailableAnnotation();
        expect(service.getFocusedAnnotation()).toBeDefined();
    });
});
