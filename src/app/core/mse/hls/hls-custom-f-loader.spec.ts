import { EventEmitter } from '../../utils/event-emitter';
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

    it('one-shot : le fragment d\'atterrissage consomme accurateSeek sur la policy partagée', () => {
        spyOn(Object.getPrototypeOf(CustomFragmentLoader.prototype), 'load');
        const hlsConfig = {
            timeout: 30, maxRetry: 4, retryDelay: 30, maxRetryDelay: 30,
            fragLoadPolicy: {default: {accurateSeek: true}},
        } as any;
        const oneShotLoader = new CustomFragmentLoader(hlsConfig);

        // hls.js passe au load() une copie de fragLoadPolicy.default (getLoaderConfigWithoutReties)
        const landing = {url: 'https://wsmedia.test/video/x/sl_hm/seg-70-v1-a1.ts'} as any;
        oneShotLoader.load(landing, {loadPolicy: {...hlsConfig.fragLoadPolicy.default}} as any, {} as any);
        expect(landing.url).toBe('https://wsmedia.test/video/x/sl_hm/seg-70-v1-a1.ts?accurate_seek=1');
        expect(hlsConfig.fragLoadPolicy.default.accurateSeek).toBeFalse();

        // Le fragment suivant (lecture normale après l'atterrissage) repart sans accurate_seek
        const next = {url: 'https://wsmedia.test/video/x/sl_hm/seg-71-v1-a1.ts'} as any;
        oneShotLoader.load(next, {loadPolicy: {...hlsConfig.fragLoadPolicy.default}} as any, {} as any);
        expect(next.url).toBe('https://wsmedia.test/video/x/sl_hm/seg-71-v1-a1.ts');
    });

    it('accurate_seek=1 ajouté au fragment quand loadPolicy.accurateSeek est armé (mouseup en mode glissement)', () => {
        const superLoad = spyOn(Object.getPrototypeOf(CustomFragmentLoader.prototype), 'load');
        const context = {url: 'https://wsmedia.test/video/x/sl_hm/seg-70-v1-a1.ts'} as any;

        loader.load(context, {loadPolicy: {accurateSeek: true}} as any, {} as any);

        expect(context.url).toBe('https://wsmedia.test/video/x/sl_hm/seg-70-v1-a1.ts?accurate_seek=1');
        expect(superLoad).toHaveBeenCalled();
    });

    it('accurate_seek: séparateur & quand l\'URL a déjà une query, rien quand le flag est absent', () => {
        spyOn(Object.getPrototypeOf(CustomFragmentLoader.prototype), 'load');

        const withQuery = {url: 'https://wsmedia.test/video/x/sl_hm/seg-70-v1-a1.ts?token=abc'} as any;
        loader.load(withQuery, {loadPolicy: {accurateSeek: true}} as any, {} as any);
        expect(withQuery.url).toBe('https://wsmedia.test/video/x/sl_hm/seg-70-v1-a1.ts?token=abc&accurate_seek=1');

        const flagOff = {url: 'https://wsmedia.test/video/x/sl_hm/seg-70-v1-a1.ts'} as any;
        loader.load(flagOff, {loadPolicy: {}} as any, {} as any);
        expect(flagOff.url).toBe('https://wsmedia.test/video/x/sl_hm/seg-70-v1-a1.ts');
    });
});


