import { ElementRef } from '@angular/core';
import { MediaPlayerService } from '../../service/media-player-service';
import { PhotoPluginComponent } from './photo-plugin.component';

describe('PhotoPluginComponent', () => {
    let component: PhotoPluginComponent;
    let warnSpy: jasmine.Spy;

    beforeEach(() => {
        component = new PhotoPluginComponent({} as MediaPlayerService);
        warnSpy = jasmine.createSpy('warn');
        (component as any).logger = { warn: warnSpy };
        component.playerId = 'PLAYER';
        component.pluginInstance = '';
        component.photoHost = new ElementRef(document.createElement('div'));
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should return default PHOTO config', () => {
        const config = component.getDefaultConfig();

        expect(config.name).toBe('PHOTO');
        expect(config.data.mode).toBe('simple');
        expect(config.data.imagesSrc).toEqual([]);
        expect(config.data.showGallery).toBeFalse();
        expect(config.data.zoomStep).toBe(25);
        expect(config.data.zoomMax).toBe(300);
        expect(config.data.zoomMin).toBe(10);
        expect(config.data.magnifyValue).toBe(400);
    });

    it('should warn and skip render when imagesSrc is empty', () => {
        const createPhotoPlayerSpy = spyOn<any>(component, 'createPhotoPlayer');
        component.pluginConfiguration = { name: 'PHOTO', data: { imagesSrc: [] } } as any;

        (component as any).renderPhoto();

        expect(warnSpy).toHaveBeenCalledWith('PHOTO plugin not rendered: imagesSrc is empty.');
        expect(createPhotoPlayerSpy).not.toHaveBeenCalled();
    });

    it('should render photo player when imagesSrc is provided', () => {
        const destroySpy = jasmine.createSpy('destroy');
        const createPhotoPlayerSpy = spyOn<any>(component, 'createPhotoPlayer').and.returnValue({ destroy: destroySpy } as any);
        const config = {
            mode: 'standard',
            imagesSrc: [
                {
                    name: 'Image 1',
                    path: 'https://example.com/image-1.png',
                    thumbPath: 'https://example.com/thumb-1.png'
                }
            ]
        };
        component.pluginConfiguration = { name: 'PHOTO', data: config } as any;

        (component as any).renderPhoto();

        expect(component.photoHost.nativeElement.id).toBe('photo-plugin-PLAYER-default');
        expect(createPhotoPlayerSpy).toHaveBeenCalledWith('#photo-plugin-PLAYER-default', config);
    });

    it('should destroy previous player instance before re-rendering', () => {
        const firstDestroySpy = jasmine.createSpy('destroy');
        const secondDestroySpy = jasmine.createSpy('destroy');
        const createPhotoPlayerSpy = spyOn<any>(component, 'createPhotoPlayer');
        createPhotoPlayerSpy.and.returnValues(
            { destroy: firstDestroySpy } as any,
            { destroy: secondDestroySpy } as any
        );

        component.pluginConfiguration = {
            name: 'PHOTO',
            data: {
                imagesSrc: [{ name: 'One', path: 'https://example.com/1.png', thumbPath: 'https://example.com/1-t.png' }]
            }
        } as any;

        (component as any).renderPhoto();
        (component as any).renderPhoto();

        expect(firstDestroySpy).toHaveBeenCalledTimes(1);
        expect(createPhotoPlayerSpy).toHaveBeenCalledTimes(2);
    });

    it('should destroy player instance on ngOnDestroy', () => {
        const destroySpy = jasmine.createSpy('destroy');
        (component as any).playerInstance = { destroy: destroySpy };

        component.ngOnDestroy();

        expect(destroySpy).toHaveBeenCalledTimes(1);
        expect((component as any).playerInstance).toBeNull();
    });
});
