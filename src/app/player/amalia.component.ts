import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {DefaultConfigLoader} from '../core/config/loader/default-config-loader';
import {DefaultConfigConverter} from '../core/config/converter/default-config-converter';
import {DefaultMetadataConverter} from '../core/metadata/converter/default-metadata-converter';
import {DefaultMetadataLoader} from '../core/metadata/loader/default-metadata-loader';
import {MediaPlayerElement} from '../core/media-player-element';
import {HttpClient} from '@angular/common/http';
import {DefaultLogger} from '../core/logger/default-logger';
import {Loader} from '../core/loader/loader';
import {ConfigData} from '../core/config/model/config-data';
import {Converter} from '../core/converter/converter';
import {Metadata} from '@ina/amalia-model';
import {environment} from '../../environments/environment';
import {PlayerState} from '../core/constant/player-state';
import {PlayerEventType} from '../core/constant/event-type';
import {AutoBind} from '../core/decorator/auto-bind.decorator';
import {HttpConfigLoader} from '../core/config/loader/http-config-loader';

@Component({
    selector: 'amalia-player',
    templateUrl: './amalia.component.html',
    styleUrls: ['./amalia.component.scss'],
    encapsulation: ViewEncapsulation.ShadowDom
})
export class AmaliaComponent implements OnInit {
    /**
     * version of player
     */
    public version = environment.VERSION;

    /**
     * player state
     */
    public state: PlayerState;

    /**
     * Selected aspectRatio
     */
    public aspectRatio: '16by9' | '4by3' = '4by3';

    /**
     * True for shown context menu
     */
    public contextMenuState: boolean;

    /**
     * player state 4by3
     */
    public PlayerState = PlayerState;

    /**
     * Player configuration
     */
    public playerConfig: ConfigData;


    private _config: any;


    get config(): any {
        return this._config;
    }

    @Input()
    set config(value: any) {
        if (typeof value === 'string') {
            try {
                value = JSON.parse(value);
            } catch (e) {
                this.logger.warn(`Error to deserialize player configuration.`);
            }
        }
        this._config = value;
    }

    /**
     * Config loader in charge to load config data
     */
    @Input()
    public configLoader: Loader<ConfigData>;

    /**
     * Metadata converter, converter metadata parameter
     */
    @Input()
    public metadataConverter: Converter<Metadata>;

    /**
     * Metadata loader
     */
    @Input()
    public metadataLoader: Loader<Array<Metadata>>;

    /**
     * Amalia events
     */
    @Output()
    public amaliaEvent = new EventEmitter();

    /**
     * get video html element
     */
    @ViewChild('video', {static: true})
    public mediaPlayer: ElementRef<HTMLVideoElement>;

    /**
     * Get context menu html element
     */
    @ViewChild('contextMenu', {static: true})
    public contextMenu: ElementRef<HTMLElement>;

    /**
     * true when player load content
     */
    public inLoading = false;

    /**
     * true when player load content
     */
    public inError = false;

    /**
     * In charge to load resource
     */
    private readonly httpClient: HttpClient;
    /**
     * Amalia player main manager
     */
    private readonly _mediaPlayerElement: MediaPlayerElement;

    constructor(mediaPlayerElement: MediaPlayerElement, httpClient: HttpClient) {
        this.httpClient = httpClient;
        this._mediaPlayerElement = mediaPlayerElement;
    }

    /**
     * Default loader
     */
    private _logger = new DefaultLogger();

    get logger(): DefaultLogger {
        return this._logger;
    }

    /**
     * In charge to return media element
     */
    get mediaPlayerElement(): MediaPlayerElement {
        return this._mediaPlayerElement;
    }

    /**setMediaPlayer
     * Invoked immediately after the  first time the component has initialised
     */
    ngOnInit() {
        this.state = PlayerState.CREATED;
        this.inLoading = true;
        // init default manager (converter, metadata loader)
        this.initDefaultHandlers();
        this.playerConfig = this.config;

        if (this.configLoader && this.metadataConverter && this.metadataLoader) {
            // set media player in charge to player video or audio files
            this._mediaPlayerElement.setMediaPlayer(this.mediaPlayer.nativeElement);
            this._mediaPlayerElement.init(this.playerConfig, this.metadataLoader, this.configLoader)
                .then((state) => this.onInitConfig(state))
                .catch((state) => this.onErrorInitConfig(state));
            // bind events
            this.bindEvents();
        } else {
            this._logger.error('Error to initialize media player element.');
        }
    }

    /**
     * Invoked on click context menu
     * @param event mouse event
     * @return return false for disable browser context menu
     */
    public onContextMenu(event: MouseEvent) {
        this.contextMenuState = true;
        const defaultMouseMargin = 15;
        this.contextMenu.nativeElement.style.left = `${event.clientX - defaultMouseMargin}px`;
        this.contextMenu.nativeElement.style.top = `${event.clientY - defaultMouseMargin}px`;
        return false;
    }

    /**
     * In charge to bin events
     */
    private bindEvents() {
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.PLAYING, this.handlePlaying);
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.IMAGE_CAPTURE, this.handleCaptureImage);
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.ERROR, this.handleError);
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.ASPECT_RATIO_CHANGE, this.handleAspectRatioChange);
    }

    @AutoBind
    private handlePlaying() {
        this.logger.info('player is player in the amalia component');
    }

    @AutoBind
    private handleCaptureImage(event: any) {
        this.logger.info('Image captured', event);
    }

    /**
     * Invoked when error event
     * @param event error type
     */
    @AutoBind
    private handleError(event: any) {
        this.inError = true;
        this.logger.error('Error', event);
    }

    /**
     * Invoked on aspect ratio change
     * @param event aspect ratio
     */
    @AutoBind
    private handleAspectRatioChange(event) {
        this.logger.debug('handleAspectRatioChange', event);
        this.aspectRatio = event;

    }

    /**
     * In charge to init default handlers when input not specified
     */
    private initDefaultHandlers() {
        if (!this.configLoader) {
            if (this.config && typeof this.config === 'string' && this.config.search('^http') !== -1) {
                this.configLoader = new HttpConfigLoader(new DefaultConfigConverter(), this.httpClient, this._logger);
            } else {
                // Default Config load this loader use input config parameter
                this.configLoader = new DefaultConfigLoader(new DefaultConfigConverter(), this._logger);
            }

        }
        if (!this.metadataConverter) {
            // Default use parameter load metadata
            this.metadataConverter = new DefaultMetadataConverter();
        }
        if (!this.metadataLoader) {
            // Default use load source form http request
            this.metadataLoader = new DefaultMetadataLoader(this.httpClient, this.metadataConverter, this._logger);
        }
    }

    /**
     * Invoked on  init config
     * @param state player init state
     */
    private onInitConfig(state: PlayerState) {
        this.state = state;
        this.inLoading = false;

    }

    /**
     * Invoked on error to init config
     * @param state player init state
     */
    private onErrorInitConfig(state: PlayerState) {
        this.state = state;
        this.inLoading = false;
        this.inError = true;
        this._logger.error(`Error to initialize player.`);
    }
}
