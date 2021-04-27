import {DefaultMediaSourceExtension} from './default-media-source-extension';
import {EventEmitter} from 'events';
import {PlayerConfigData} from '../config/model/player-config-data';
import {DefaultLogger} from '../logger/default-logger';

describe('Test default Source extension', () => {
    const mediaSrc = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
    const backwardSrc = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
    const eventEmitter = new EventEmitter();
    const component = document.createElement('video');
    const logger =  new DefaultLogger('root-player');
    const config: PlayerConfigData = {
        autoplay: false, crossOrigin: null, data: null, defaultVolume: 0, duration: null, poster: '', src: mediaSrc
        , backwardsSrc: backwardSrc
    };
    const player = new DefaultMediaSourceExtension(component, eventEmitter, config, logger);
    it('test switch function ', () => {
        player.setSrc(config);
        expect(player.getSrc()).toEqual(mediaSrc);
        expect(player.getBackwardsSrc()).toEqual(backwardSrc);
        player.switchToMainSrc().then(() => {
            expect(player.mainSource.src).toEqual(mediaSrc);
        });
        player.switchToMainSrc();
        expect(player.mainSource.src).toEqual(mediaSrc);
        player.switchToBackwardsSrc().then(() => {
            expect(player.mainSource.src).toEqual(backwardSrc);
        });
        player.switchToBackwardsSrc();
        expect(player.mainSource.src).toEqual(backwardSrc);
    });

    it('test destroy function ', () => {
        player.destroy();
        expect(player).toBeTruthy();
    });
    it('test handle error ', () => {
        spyOn(eventEmitter, 'emit');
        player.handleError('ERROR');
        expect(eventEmitter.emit).toHaveBeenCalled();
    });
});


