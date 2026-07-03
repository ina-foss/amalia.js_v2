import { ControlBarPluginComponent } from './control-bar-plugin.component';

describe('ControlBarPluginComponent volume initialization', () => {
    function createComponent(defaultVolume?: number) {
        const setVolume = jasmine.createSpy('setVolume');
        const configuration = {
            tcOffset: 0,
            player: {
                framerate: 25,
                ratio: '16:9',
                defaultVolume
            },
            thumbnail: {
                baseUrl: '',
                enableThumbnail: false
            }
        };
        const component = new ControlBarPluginComponent(
            {} as any,
            {} as any,
            {} as any,
            {} as any,
            {} as any
        );
        component.mediaPlayerElement = {
            eventEmitter: {},
            getConfiguration: () => configuration,
            getMediaPlayer: () => ({
                setVolume,
                getDuration: () => 0,
                getCurrentTime: () => 0
            }),
            getPluginConfiguration: () => null
        } as any;
        component.pluginConfiguration = {
            data: [],
            fixed: false,
            pinnedControls: false
        } as any;
        component.logger = {
            debug: jasmine.createSpy('debug')
        } as any;
        spyOn(component, 'initPlaybackrates');
        spyOn(component, 'initShortcuts');
        spyOn(component, 'addListener');
        spyOn<any>(component, 'getDefaultAspectRatio');
        spyOn<any>(component, 'handleDisplayState');
        spyOn<any>(component, 'initTracks');

        return { component, setVolume };
    }

    it('uses player.defaultVolume when the control bar is recreated', () => {
        const { component, setVolume } = createComponent(37);

        component.init();

        expect(setVolume).toHaveBeenCalledWith(37);
    });

    it('falls back to 50 when defaultVolume is not configured', () => {
        const { component, setVolume } = createComponent();

        component.init();

        expect(setVolume).toHaveBeenCalledWith(50);
    });
});
