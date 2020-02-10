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
   * player state enum
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
  /**
   * Default loader
   */
  private logger = new DefaultLogger();
  /**
   * true when player load content
   */
  private inLoading = false;
  /**
   * true when player load content
   */
  private inError = false;
  /**
   * Amalia player main manager
   */
  private mediaPlayerElement: MediaPlayerElement;
  /**
   * In charge to load resource
   */
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
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
      // Created media player element
      this.mediaPlayerElement = new MediaPlayerElement(this.metadataLoader, this.logger);
      // set media player in charge to player video or audio files
      this.mediaPlayerElement.setMediaPlayer(this.mediaPlayer.nativeElement);
      this.mediaPlayerElement.init(this.playerConfig, this.configLoader)
        .then((state) => this.onInitConfig(state))
        .catch((state) => this.onErrorInitConfig(state));
    } else {
      this.logger.error('Error to initialize media player element.');
    }
  }

  /**
   * In charge to init default handlers when input not specified
   */
  private initDefaultHandlers() {
    if (!this.configLoader) {
      // Default Config load this loader use input config parameter
      this.configLoader = new DefaultConfigLoader(new DefaultConfigConverter(), this.logger);
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
    this.logger.error(`Error to initialize player.`);
  }
}
