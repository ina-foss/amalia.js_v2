import Hls, {FragmentLoaderContext, Loader, LoaderContext} from 'hls.js';

/**
 * Specified custom loader when uses switch channel audio,  loader  retry to load audio channel segment
 */
export class CustomFragmentLoader extends (Hls.DefaultConfig.loader as new (config: any) => Loader<FragmentLoaderContext>) implements Loader<FragmentLoaderContext> {

    constructor(config: any) {
        super(config);
    }

    load(context: LoaderContext, loaderConfig: any, callbacks: any) {
        const audioChannel = loaderConfig.loadPolicy.audioChannel || 1;
        context.url = context.url.replace(/(\/seg-\d+-v\d+-a)\d+(\.ts)/i, '$1' + audioChannel + '$2');
        super.load(context, loaderConfig, callbacks);
    }

}
