import {Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
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
    @Input()
    public playerConfig: ConfigData = {player: {src: 'https://www.w3schools.com/html/mov_bbb.mp4'}};
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
     * containe media player
     */
    @ViewChild('video', {static: true})
    public mediaPlayer: ElementRef<HTMLMediaElement>;

    @ViewChild('contextMenu', {static: true})
    public contextMenu: ElementRef<HTMLMediaElement>;
    /**
     * true when player load content
     */
    private inLoading = false;
    /**
     * true when player load content
     */
    private inError = false;
    /**
     * In charge to load resource
     */
    private readonly httpClient: HttpClient;

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
     * Amalia player main manager
     */
    private _mediaPlayerElement: MediaPlayerElement;

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
        if (this.configLoader && this.metadataConverter && this.metadataLoader) {
            // set media player in charge to player video or audio files
            this._mediaPlayerElement.setMediaPlayer(this.mediaPlayer.nativeElement);
            this._mediaPlayerElement.init(this.playerConfig, this.metadataLoader, this.configLoader)
                .then((state) => this.onInitConfig(state))
                .catch((state) => this.onErrorInitConfig(state));
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
     * In charge to init default handlers when input not specified
     */
    private initDefaultHandlers() {
        if (!this.configLoader) {
            // Default Config load this loader use input config parameter
            this.configLoader = new DefaultConfigLoader(new DefaultConfigConverter(), this._logger);
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
