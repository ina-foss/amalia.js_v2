import Hls, {FragmentLoaderContext, Loader, LoaderContext, LoaderStats} from 'hls.js';


// export let randomLoaderConfig = (config) => {
//     const loader = new Hls.DefaultConfig.loader(config);
//     const audioChannel = 1;
//
//     this.abort = () => loader.abort();
//     this.destroy = () => loader.destroy();
//     this.load = (context, config, callbacks) => {
//         let {type, url} = context;
//         context.url = context.url.replace(/(\/seg-\d+-v\d+-a)\d+(\.ts)/i, '$1' + this.audioChannel + '$2');
//         if (type === 'manifest') {
//             console.log(`Manifest ${url} will be loaded.`);
//         }
//         loader.load(context, config, callbacks);
//     };
// };


/**
 * Specified custom loader when uses switch channel audio,  loader  retry to load audio channel segment
 * // TODO fix Audio channel
 */
export class CustomFragmentLoader extends (Hls.DefaultConfig.loader as new (config: any) => Loader<FragmentLoaderContext>) implements Loader<FragmentLoaderContext> {
    private _audioChannel = 2;

    constructor(config: any) {
        super(config);
    }

    load(context: LoaderContext, loaderConfig: any, callbacks: any) {
        //Todo
        const audioChannel = 1;// context.frag.loader._audioChannel || 1;
        context.url = context.url.replace(/(\/seg-\d+-v\d+-a)\d+(\.ts)/i, '$1' + audioChannel + '$2');
        super.load(context, loaderConfig, callbacks);
    }

    public setAudioChannel(track: number) {
        this._audioChannel = track;
    }

}
