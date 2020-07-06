import {Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
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
import {BaseUtils} from '../core/utils/base-utils';
import {MediaPlayerService} from '../service/media-player-service';

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
    public aspectRatio;

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

    /**
     * In charge to show preview thumbnail
     */
    public enablePreviewThumbnail = false;
    /**
     * preview thumbnail url
     */
    public previewThumbnailUrl = '';

    /**
     * Generate player base id
     */
    @Input()
    public playerId = BaseUtils.getUniqueId();
    /**
     * Preview thumbnail container
     */
    @ViewChild('previewThumbnail', {static: true})
    public previewThumbnailElement: ElementRef<HTMLVideoElement>;

    /**
     * Set player autoplay state
     */
    public autoplay: boolean;

    /**
     * Enable thumbnail
     */
    private enableThumbnail: boolean;

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
                this.logger.debug(`Config not json ${value}`);
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
    public callback: EventEmitter<any> = new EventEmitter<any>();

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
     * Default loader
     */
    public logger = new DefaultLogger();
    /**
     * default aspect ratio
     */
    public ratio = '16-9';
    /**
     * In charge to get instance of player
     */
    public playerService: MediaPlayerService;
    /**
     * Pinned ControlBar state
     */
    public pinned = false;
    /**
     * In charge to load resource
     */
    private readonly httpClient: HttpClient;
    /**
     * mediaContainer element
     */
    @ViewChild('mediaContainer', {static: true})
    public mediaContainer: ElementRef<HTMLElement>;
    /**
     * Return player interface
     */
    @Output()
    public initApi: EventEmitter<MediaPlayerElement> = new EventEmitter<MediaPlayerElement>();

    /**
     * Amalia player main manager
     */
    private mediaPlayerElement: MediaPlayerElement;

    constructor(playerService: MediaPlayerService, httpClient: HttpClient) {
        this.httpClient = httpClient;
        this.playerService = playerService;
    }

    /**
     * Invoked immediately after the  first time the component has initialised
     */
    public ngOnInit() {
        // Init media player
        this.mediaPlayerElement = this.playerService.get(this.playerId);
        this.state = PlayerState.CREATED;
        this.inLoading = true;
        // init default manager (converter, metadata loader)
        this.initDefaultHandlers();
        this.playerConfig = this.config;
        if (this.configLoader && this.metadataConverter && this.metadataLoader) {
            // set media player in charge to player video or audio files
            this.mediaPlayerElement.setMediaPlayer(this.mediaPlayer.nativeElement);
            this.mediaPlayerElement.init(this.playerConfig, this.metadataLoader, this.configLoader)
                .then((state) => this.onInitConfig(state))
                .catch((state) => this.onErrorInitConfig(state));
            // bind events
            this.bindEvents();
            // set mediaPlayer width for responsive grid
            this.mediaPlayerElement.setMediaPlayerWidth(this.mediaContainer.nativeElement.offsetWidth);
            this.initApi.emit(this.mediaPlayerElement);
        } else {
            this.logger.error('Error to initialize media player element.');
        }
    }

    /**
     * update mediaPlayerWidth on window resize
     */
    @AutoBind
    private handleWindowResize() {
        const mediaContainer = this.mediaContainer.nativeElement;
        this.mediaPlayerElement.setMediaPlayerWidth(mediaContainer.clientWidth);
    }

    /**
     * Invoked on click context menu
     * @param event mouse event
     * @return return false for disable browser context menu
     */
    public onContextMenu(event: MouseEvent) {
        this.contextMenuState = true;
        const defaultMouseMargin = 15;
        this.contextMenu.nativeElement.style.left = `${event.offsetX - defaultMouseMargin}px`;
        this.contextMenu.nativeElement.style.top = `${event.offsetY - defaultMouseMargin}px`;
        return false;
    }

    /**
     * In charge to update player size with aspect ratio
     */
    @HostListener('window:resize', ['$event'])
    private updatePlayerSizeWithAspectRatio() {
        const htmlElement = this.mediaPlayer.nativeElement;
        if (this.aspectRatio && this.aspectRatio !== '') {
            const maxWidth = htmlElement.parentElement.offsetWidth;
            const maxHeight = this.mediaPlayer.nativeElement.parentElement.offsetHeight;
            const aspectRatio = this.aspectRatio ? parseFloat(this.aspectRatio.split(':')[0]) / parseFloat(this.aspectRatio.split(':')[1]) : 16 / 9;
            let w = Math.max(maxHeight * aspectRatio, maxWidth);
            let h = w / aspectRatio;
            if (w > maxWidth) {
                h = Math.floor(maxWidth * h / w);
                w = maxWidth;
            }
            if (h > maxHeight) {
                w = Math.floor(maxHeight * w / h);
                h = maxHeight;
            }
            htmlElement.style.width = `${w}px`;
            htmlElement.style.height = `${h}px`;
            htmlElement.style.left = `${Math.max(0, (maxWidth - w) / 2)}px`;
            htmlElement.style.top = `${Math.max(0, (maxHeight - h) / 2)}px`;
            htmlElement.style['object-fit'] = 'fill';
        } else {
            htmlElement.style.width = `100%`;
            htmlElement.style.height = `100%`;
            htmlElement.style.left = `0`;
            htmlElement.style.top = `0`;
            htmlElement.style['object-fit'] = 'none';
        }

        if (this.previewThumbnailElement) {
            const previewThumbnailElement = this.previewThumbnailElement.nativeElement;
            previewThumbnailElement.style.width = htmlElement.style.width;
            previewThumbnailElement.style.height = htmlElement.style.height;
            previewThumbnailElement.style.left = htmlElement.style.left;
            previewThumbnailElement.style.top = htmlElement.style.top;
        }
    }

    /**
     * In charge to bin events
     */
    private bindEvents() {
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.SEEKED, this.handleSeeked);
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.SEEKING, this.handleSeeking);
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.ERROR, this.handleError);
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.ASPECT_RATIO_CHANGE, this.handleAspectRatioChange);
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.FULLSCREEN_STATE_CHANGE, this.handleFullScreenChange);
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.PLAYER_RESIZED, this.handleWindowResize);
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.PINNED_CONTROLBAR_CHANGE, this.handlePinnedControlbarChange);
    }
    @AutoBind
    public handlePinnedControlbarChange(event) {
        this.pinned = event;
    }
    @AutoBind
    private handleSeeking(tc: number) {
        if (this.enableThumbnail) {
            this.setPreviewThumbnail(tc);
            this.enablePreviewThumbnail = true;
        }
    }

    @AutoBind
    private handleSeeked() {
        if (this.enableThumbnail) {
            this.enablePreviewThumbnail = false;
            this.previewThumbnailUrl = '';
        }
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
        this.updatePlayerSizeWithAspectRatio();
    }

    /**
     * In charge to init default handlers when input not specified
     */
    private initDefaultHandlers() {
        if (!this.configLoader) {
            if (this.config && typeof this.config === 'string' && this.config.search('^http') !== -1) {
                this.configLoader = new HttpConfigLoader(new DefaultConfigConverter(), this.httpClient, this.logger);
            } else {
                // Default Config load this loader use input config parameter
                this.configLoader = new DefaultConfigLoader(new DefaultConfigConverter(), this.logger);
            }

        }
        if (!this.metadataConverter) {
            // Default use parameter load metadata
            this.metadataConverter = new DefaultMetadataConverter();
        }
        if (!this.metadataLoader) {
            // Default use load source form http request
            this.metadataLoader = new DefaultMetadataLoader(this.httpClient, this.metadataConverter, this.logger);
        }
    }

    /**
     * In charge to update thumbnail
     */
    private setPreviewThumbnail(tc: number) {
        if (!isNaN(tc)) {
            this.previewThumbnailUrl = this.mediaPlayerElement.getThumbnailUrl(Math.round(tc));
        }
    }

    /**
     * Invoked on  init config
     * @param state player init state
     */
    private onInitConfig(state: PlayerState) {
        this.state = state;
        this.inLoading = false;
        this.autoplay = this.mediaPlayerElement.getConfiguration().player.autoplay;
        this.enableThumbnail = this.mediaPlayerElement.getConfiguration().thumbnail.enableThumbnail || false;
        this.aspectRatio = this.mediaPlayerElement.getConfiguration().player.ratio;
        this.ratio = this.aspectRatio.replace(':' , '-');
    }

    /**
     * Invoked on error to init config
     * @param state player init state
     */
    private onErrorInitConfig(state: PlayerState) {
        this.state = state;
        this.inLoading = false;
        this.inError = true;
        this.logger.error(`Error to initialize player.`);
    }

    /**
     * Invoked on mouseenter and mouseleave events
     */
    public displayControlBar(_displayControlBar: boolean) {
        if (_displayControlBar === true) {
            this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.PLAYER_MOUSE_ENTER);
        } else if (_displayControlBar === false) {
            this.mediaPlayerElement.eventEmitter.emit(PlayerEventType.PLAYER_MOUSE_LEAVE);
        }
    }

    /**
     * Invoked on fullscreen change
     */
    @AutoBind
    public handleFullScreenChange() {
        const element = this.mediaPlayer.nativeElement.offsetParent as HTMLElement;
        const parent = element.offsetParent as HTMLElement;
        this.mediaPlayerElement.toggleFullscreen(parent);
    }
}
