import { SubtitlesPluginComponent } from './subtitles-plugin.component';
import { MediaPlayerService } from '../../service/media-player-service';
import { DefaultLogger } from '../../core/logger/default-logger';
import { PlayerEventType } from '../../core/constant/event-type';

describe('SubtitlesPluginComponent', () => {
    let component: SubtitlesPluginComponent;

    beforeEach(() => {
        component = new SubtitlesPluginComponent({} as MediaPlayerService);
        (component as any).logger = new DefaultLogger('subtitles-spec');
        (component as any).pluginConfiguration = {
            metadataIds: ['m1', 'm2'],
            data: { parseLevel: 2, tcDelta: 0.25 }
        };
        (component as any).mediaPlayerElement = {
            eventEmitter: { on: jasmine.createSpy('on') },
            getDisplayState: jasmine.createSpy('getDisplayState').and.returnValue('m'),
            getConfiguration: jasmine.createSpy('getConfiguration').and.returnValue({
                tcOffset: 0,
                player: { framerate: 25 }
            }),
            getMediaPlayer: jasmine.createSpy('getMediaPlayer').and.returnValue({
                getCurrentTime: jasmine.createSpy('getCurrentTime').and.returnValue(12.5)
            }),
            metadataManager: {
                getTranscriptionLocalisations: jasmine.createSpy('getTranscriptionLocalisations').and.callFake((id: string) => {
                    if (id === 'm1') {
                        return [{ tcIn: 10, tcOut: 13, text: 'bonjour' }];
                    }
                    return [{ tcIn: 12, tcOut: 14, text: 'monde' }];
                })
            }
        };
    });

    it('should expose default config', () => {
        expect(component.getDefaultConfig()).toEqual({
            name: 'SUBTITLE',
            data: { parseLevel: 2, tcDelta: 0.5 }
        });
    });

    it('init should set display state and register listeners', () => {
        const addListenerSpy = spyOn(component as any, 'addListener').and.callFake(() => undefined);
        const handleDisplayStateSpy = spyOn(component, 'handleDisplayState').and.callThrough();

        component.init();

        expect(handleDisplayStateSpy).toHaveBeenCalled();
        expect(addListenerSpy).toHaveBeenCalledWith((component as any).mediaPlayerElement.eventEmitter, PlayerEventType.TIME_CHANGE, (component as any).handleOnTimeChange);
        expect(addListenerSpy).toHaveBeenCalledWith((component as any).mediaPlayerElement.eventEmitter, PlayerEventType.METADATA_LOADED, (component as any).handleMetadataLoaded);
        expect(addListenerSpy).toHaveBeenCalledWith((component as any).mediaPlayerElement.eventEmitter, PlayerEventType.POSITION_SUBTITLE_CHANGE, (component as any).changeSubtitlePosition);
    });

    it('handleDisplayState should mirror media player state', () => {
        component.handleDisplayState();
        expect(component.displayState).toBe('m');
    });

    it('handleOnTimeChange should refresh subtitle for current time', () => {
        (component as any).transcriptions = [{ tcIn: 12, tcOut: 13, text: 'alpha' }];
        (component as any).handleOnTimeChange();
        expect(component.currentTime).toBe(12.5);
        expect(component.subTitle).toBe('alpha');
    });

    it('handleMetadataLoaded should refresh metadata', () => {
        const refreshSpy = spyOn(component as any, 'refreshMetadata').and.callThrough();
        (component as any).handleMetadataLoaded();
        expect(refreshSpy).toHaveBeenCalled();
        expect((component as any).transcriptions.length).toBe(2);
    });

    it('refreshMetadata should no-op when metadata ids are missing', () => {
        (component as any).pluginConfiguration = { data: { parseLevel: 2 } };
        (component as any).transcriptions = null;
        (component as any).refreshMetadata();
        expect((component as any).transcriptions).toBeNull();
    });

    it('updateSubtitleContent should clear subtitle when no match or no data', () => {
        (component as any).transcriptions = [{ tcIn: 1, tcOut: 2, text: 'old' }];
        component.currentTime = 10;
        (component as any).updateSubtitleContent();
        expect(component.subTitle).toBeNull();

        (component as any).transcriptions = null;
        (component as any).updateSubtitleContent();
        expect(component.subTitle).toBeNull();
    });

    it('changeSubtitlePosition should set requested position', () => {
        (component as any).changeSubtitlePosition('down');
        expect(component.posSubtitle).toBe('down' as any);
    });
});
