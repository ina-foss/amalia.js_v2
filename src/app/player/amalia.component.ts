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
    public playerConfig: ConfigData = {
        player: {
            // src: 'https://www.w3schools.com/html/mov_bbb.mp4',
            // src: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
            src: 'I0VYVE0zVQojRVhULVgtVkVSU0lPTjozCiNFWFQtWC1QTEFZTElTVC1UWVBFOlZPRAojRVhULVgtVEFSR0' +
                'VURFVSQVRJT046MgojRVhULVgtTUVESUEtU0VRVUVOQ0U6MQojRVhUSU5GOjEwLjAsCmh0dHBzOi8vd3MtbWVkaWEtY3B1LmluYS5mci9tZWRpYXMvZWZw' +
                'L3NLWFV6cnJOaHJadHEvdEpuRVFVZ3drangzdDc1bGJteUNObWM3ZWJTK3cvelBkTk5SUWdqUmlYWWJrSmxHNCszb25pQXpVTjlMTGE2TWNhQ3kvNTJxMlF' +
                'nQ0ZSK1RYQkxWb2ZqV2FhVW85OS9xZVdwNEhRWmlZdDhGQmtvdTdQZFN5K1dvcEdiNzVGVVhRTVJhR2lRUHFSSlRudCt3K0hBMG1XSmJheS9DSFJmUHM3S0' +
                '9VRmZVblZNU0ROUGNCcUcxTEZ0Ky9ZQ3dCWmdkWm1TK0pXTnFIVFF3Q0xDWUZXQkg3RE1PTDBFZUY0SEYvZE9INTd4MG1HcFMwUGU0RVpoOThtQWUwNExBcU' +
                '5YcFpYNWxodm5kSzVYVlorbUkvRHpPRlNXMjNuZFROd2MwSEt5OWIzNUJnTWl3N2tlUDluRGFrRmhSSDlDdlBqQjFEd0FWRW16LzRuQk4wNDJtVndhZE5hQ3' +
                'QvN3A1MTAvR0Q2dE1wemRWUnVjbldUdUVURzkycURQZHVRM2l4Rzk1cC90N3NMVmpLM1hpU2xJaU41KzJscXh3UnVBK2pmNzRzOXhSdW5XYUhvZ3FwaHBwNU' +
                'lRcHFMZFJLWnJnVWNPZHRPMDQyL1REQ0lBdXNJN1BUdXBWRytTOFl6eUtLa1VGc0RDanhSOUNGOHFoekpBT3FlOGRaVkxDZzdhWXFUVXd1T1V4TCtaT1BaNX' +
                'I0RHdSa05zTEVlRTg1Ui9UUVByUWpQUkk3dkkzR09VTXVHRXV6RVlMeFkyaXNuU1dzZ0FIdGdzVnhmVkxKSklxcG5nVzVFaHZ3dnRWWU9LNnVJQ290S3pkdC' +
                's2dnBZL0ZFREZjelc3U1BzakduYVM2MWVwSDlCcVFiSDZidVVCMmE0cklCdElEVFplbFZ3RXExRkYvYWVrMjdFNVJYWjRBelQvc2xfaXYvZXpwN3Z6dzFpZ1' +
                'hDMzlLR3V2UzBvUT09L3NsX2htL3NlZy0xLXYxLWExLnRzCiNFWFRJTkY6MTAuMCwKaHR0cHM6Ly93cy1tZWRpYS1jcHUuaW5hLmZyL21lZGlhcy9lZnAvc0' +
                'tYVXpyck5oclp0cS90Sm5FUVVnd2tqeDN0NzVsYm15Q05tYzdlYlMrdy96UGROTlJRZ2pSaVhZYmtKbEc0KzNvbmlBelVOOUxMYTZNY2FDeS81MnEyUWdDRl' +
                'IrVFhCTFZvZmpXYWFVbzk5L3FlV3A0SFFaaVl0OEZCa291N1BkU3krV29wR2I3NUZVWFFNUmFHaVFQcVJKVG50K3crSEEwbVdKYmF5L0NIUmZQczdLT1VGZl' +
                'VuVk1TRE5QY0JxRzFMRnQrL1lDd0JaZ2RabVMrSldOcUhUUXdDTENZRldCSDdETU9MMEVlRjRIRi9kT0g1N3gwbUdwUzBQZTRFWmg5OG1BZTA0TEFxTlhwWl' +
                'g1bGh2bmRLNVhWWittSS9Eek9GU1cyM25kVE53YzBIS3k5YjM1QmdNaXc3a2VQOW5EYWtGaFJIOUN2UGpCMUR3QVZFbXovNG5CTjA0Mm1Wd2FkTmFDdC83cD' +
                'UxMC9HRDZ0TXB6ZFZSdWNuV1R1RVRHOTJxRFBkdVEzaXhHOTVwL3Q3c0xWakszWGlTbElpTjUrMmxxeHdSdUEramY3NHM5eFJ1bldhSG9ncXBocHA1SVFwcU' +
                'xkUktacmdVY09kdE8wNDIvVERDSUF1c0k3UFR1cFZHK1M4WXp5S0trVUZzRENqeFI5Q0Y4cWh6SkFPcWU4ZFpWTENnN2FZcVRVd3VPVXhMK1pPUFo1cjREd1' +
                'JrTnNMRWVFODVSL1RRUHJRalBSSTd2STNHT1VNdUdFdXpFWUx4WTJpc25TV3NnQUh0Z3NWeGZWTEpKSXFwbmdXNUVodnd2dFZZT0s2dUlDb3RLemR0KzZ2cF' +
                'kvRkVERmN6VzdTUHNqR25hUzYxZXBIOUJxUWJINmJ1VUIyYTRySUJ0SURUWmVsVndFcTFGRi9hZWsyN0U1UlhaNEF6VC9zbF9pdi9lenA3dnp3MWlnWEMzOU' +
                'tHdXZTMG9RPT0vc2xfaG0vc2VnLTItdjEtYTEudHMKI0VYVC1YLUVORExJU1QK',
            hls: {
                enable: true,
            },
            crossOrigin: 'anonymous'
        }
    };

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
    private inLoading = false;

    /**
     * true when player load content
     */
    private inError = false;

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
    }

    @AutoBind
    private handlePlaying() {
        this.logger.info('player is player in the amalia component');
    }

    @AutoBind
    private handleCaptureImage(event: any) {
        this.logger.info('Image captured', event);
    }


    @AutoBind
    private handleError(event: any) {
        this.inError = true;
        this.logger.error('Error', event);
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
