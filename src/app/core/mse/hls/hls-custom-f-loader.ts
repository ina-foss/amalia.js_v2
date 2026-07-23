import Hls, {FragmentLoaderContext, Loader, LoaderContext} from 'hls.js';

/**
 * Specified custom loader when uses switch channel audio,  loader  retry to load audio channel segment
 */
export class CustomFragmentLoader extends (Hls.DefaultConfig.loader as new (config: any) => Loader<FragmentLoaderContext>) implements Loader<FragmentLoaderContext> {

    override load(context: FragmentLoaderContext, loaderConfig: any, callbacks: any) {
        const audioChannel = loaderConfig.loadPolicy.audioChannel || 1;
        const originalUrl = context.url;
        context.url = context.url.replace(/(\/seg-\d+-v\d+-a)\d+(\.ts)/i, '$1' + audioChannel + '$2');
        if (originalUrl !== context.url || /seg-\d+-v\d+-a\d+\.ts/i.test(originalUrl)) {
            // eslint-disable-next-line no-console
            console.debug(`[AUDIO_TRACK_DEBUG] fragment loader audioChannel=${audioChannel} url=${originalUrl} -> ${context.url}`);
        }
        super.load(context, loaderConfig, callbacks);
    }

}
