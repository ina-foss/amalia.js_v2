import Hls, {FragmentLoaderContext, Loader} from 'hls.js';

/**
 * Classe de base hissée dans une constante typée : un `extends (expr as ...)` inline fait
 * croire à l'analyse statique (Sonar S3854) que `super` n'est pas un constructeur.
 */
const BaseFragmentLoader = Hls.DefaultConfig.loader as unknown as new (config: any) => Loader<FragmentLoaderContext>;

/**
 * Specified custom loader when uses switch channel audio,  loader  retry to load audio channel segment.
 * Carries also the accurate-seek flag (armed at slide-mode mouseup): the first fragment requested
 * while the flag is set gets accurate_seek=1 so the server cuts the segment on the exact frame,
 * not the previous keyframe — then the flag is consumed (one-shot), so only the landing fragment
 * of the exact seek pays the accurate cut, never the live seeks of the drag nor normal playback.
 */
export class CustomFragmentLoader extends BaseFragmentLoader implements Loader<FragmentLoaderContext> {

    /**
     * Config hls complète reçue du constructeur (référence partagée avec hlsPlayer.config) :
     * hls.js ne passe au load() qu'une copie de fragLoadPolicy.default
     * (getLoaderConfigWithoutReties), la consommation one-shot doit donc se faire ici.
     */
    private readonly hlsConfig: any;

    constructor(config: any) {
        super(config);
        this.hlsConfig = config;
    }

    override load(context: FragmentLoaderContext, loaderConfig: any, callbacks: any) {
        const audioChannel = loaderConfig.loadPolicy.audioChannel || 1;
        const originalUrl = context.url;
        context.url = context.url.replace(/(\/seg-\d+-v\d+-a)\d+(\.ts)/i, '$1' + audioChannel + '$2');
        if (originalUrl !== context.url || /seg-\d+-v\d+-a\d+\.ts/i.test(originalUrl)) {
            // eslint-disable-next-line no-console
            console.debug(`[AUDIO_TRACK_DEBUG] fragment loader audioChannel=${audioChannel} url=${originalUrl} -> ${context.url}`);
        }
        if (loaderConfig.loadPolicy.accurateSeek) {
            const separator = context.url.includes('?') ? '&' : '?';
            context.url = `${context.url}${separator}accurate_seek=1`;
            if (this.hlsConfig?.fragLoadPolicy?.default) {
                this.hlsConfig.fragLoadPolicy.default.accurateSeek = false;
            }
        }
        super.load(context, loaderConfig, callbacks);
    }

}
