import {async} from '@angular/core/testing';
import {HLSMediaSourceExtension} from './hls-media-source-extension';
import {EventEmitter} from 'events';
import {PlayerConfigData} from '../../config/model/player-config-data';
import {DefaultLogger} from '../../logger/default-logger';
import Hls from 'hls.js';
import {PlayerEventType} from '../../constant/event-type';
import {HlsCustomFLoader} from './hls-custom-f-loader';
import LoaderConfig from 'hls.js';

describe('Test HLS custom loader', () => {
    const mediaSrc = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
    const backwardSrc = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
    const eventEmitter = new EventEmitter();
    const component = document.createElement('video');
    const logger =  new DefaultLogger('root-player');
    const config: PlayerConfigData = {
        autoplay: false, crossOrigin: null, data: null, defaultVolume: 0, duration: null, poster: '', src: mediaSrc
        , backwardsSrc: backwardSrc
    };
    const hlsPlayer = new HLSMediaSourceExtension(component, eventEmitter, config, logger);
    /* hlsPlayer.config.hls.config.fLoader = HlsCustomFLoader;
    //const lConfig: LoaderConfig = {timeout: 30, maxRetry: 4, retryDelay: 30, maxRetryDelay: 30};
    //const loader = new HlsCustomFLoader(lConfig);

    it('test Audio channel ', () => {
        expect(loader).toBeTruthy();
        expect(loader.audioChannel).toEqual(1);
        loader.audioChannel = 3;
        expect(loader.audioChannel).toEqual(3);
        });
        */
});


