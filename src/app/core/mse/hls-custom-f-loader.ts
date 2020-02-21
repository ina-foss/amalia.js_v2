import * as Hls from 'hls.js';

/**
 * Specified custom loader when uses switch channel audio,  loader  retry to load audio channel segment
 */
export class HlsCustomFLoader extends Hls.DefaultConfig.loader {
    constructor(config: Hls.LoaderConfig) {
        super(config);
        const load = this.load.bind(this);
        // tslint:disable-next-line:no-shadowed-variable
        this.load = (context, config, callbacks) => {
            context.url = context.url.replace(/(\/seg-\d+-v\d+-a)\d+(\.ts)/i, '$1' + this._audioChannel + '$2');
            const originalCallback = callbacks;
            const onSuccess = callbacks.onSuccess;
            // tslint:disable-next-line:no-shadowed-variable
            callbacks.onSuccess = (response, stats, context) => {
                if ((response.data as ArrayBuffer).byteLength === 0) {
                    setTimeout(() => {
                        load(context, config, originalCallback);
                    }, 500);
                } else {
                    onSuccess(response, stats, context);
                }
            };
            load(context, config, callbacks);
        };
    }

    private _audioChannel = 1;

    get audioChannel(): number {
        return this._audioChannel;
    }

    set audioChannel(value: number) {
        this._audioChannel = value;
    }
}
