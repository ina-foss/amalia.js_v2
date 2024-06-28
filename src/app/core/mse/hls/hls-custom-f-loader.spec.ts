import {EventEmitter} from 'events';
import {PlayerConfigData} from '../../config/model/player-config-data';
import {DefaultLogger} from '../../logger/default-logger';
import {HLSMediaSourceExtension} from "./hls-media-source-extension";
import {CustomFragmentLoader} from "./hls-custom-f-loader";

describe('Test HLS custom loader', () => {
    const mediaSrc = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
    const backwardSrc = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
    const eventEmitter = new EventEmitter();
    const component = document.createElement('video');
    const logger = new DefaultLogger('root-player');
    const config: PlayerConfigData = {
        autoplay: false, crossOrigin: null, data: null, defaultVolume: 0, duration: null, poster: '', src: mediaSrc
        , backwardsSrc: backwardSrc
    };

    const hlsPlayer = new HLSMediaSourceExtension(component, eventEmitter, config, logger);
    hlsPlayer.config.hls.config.fLoader = CustomFragmentLoader;
    const lConfig = {timeout: 30, maxRetry: 4, retryDelay: 30, maxRetryDelay: 30};
    const loader = new CustomFragmentLoader(lConfig);

    it('test Audio channel ', () => {
        expect(loader).toBeTruthy();
    });
});


