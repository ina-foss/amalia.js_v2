import {MediaPlayerElement} from '../media-player-element';
import {PluginConfigData} from '../config/model/plugin-config-data';
import {DefaultLogger} from '../logger/default-logger';
import {Input, OnInit} from '@angular/core';
import {PlayerEventType} from '../constant/event-type';
import {MediaPlayerService} from '../../service/media-player-service';
import {AmaliaException} from '../exception/amalia-exception';

/**
 * Base class for create plugin
 */
export abstract class PluginBase<T> implements OnInit {

    @Input()
    public playerId = null;
    public timeFormat;
    public tcOffset;
    public fps;
    public initialized;
    /**
     * This plugin configuration
     */
    public _player;

    get player() {
        return this._player;
    }

    @Input()
    set player(value) {
        this._player = value;
    }

    public _pluginConfiguration: PluginConfigData<T>;

    get pluginConfiguration(): PluginConfigData<T> {
        return this._pluginConfiguration;
    }

    @Input()
    set pluginConfiguration(value: PluginConfigData<T>) {
        if (typeof value === 'string') {
            try {
                value = JSON.parse(value);
            } catch (e) {
                value = null;
                this.logger.warn(`Error to parse ${this.pluginName} plugin configuration json.`);
            }
        }
        this._pluginConfiguration = value;
    }

    public playerService: MediaPlayerService;
    @Input()
    public pluginInstance = '';
    public mediaPlayerElement: MediaPlayerElement;
    protected pluginName: string;
    protected readonly logger: DefaultLogger;

    /**
     * Plugin base constructor
     * @param playerService player service
     * @param pluginName plugin name, user for get configuration
     */
    protected constructor(playerService: MediaPlayerService, pluginName) {
        this.playerService = playerService;
        this.pluginName = pluginName;
        this.logger = new DefaultLogger(`${this.pluginName}`);
    }

    ngOnInit(): void {
        this.mediaPlayerElement = this.playerService.get(this.playerId);
        const mediaPlayerElement = this.mediaPlayerElement;
        if (this.pluginName === 'STORYBOARD' && this.mediaPlayerElement) {
            this.mediaPlayerElement.eventEmitter.on(PlayerEventType.INIT, function() {
                mediaPlayerElement.eventEmitter.emit(PlayerEventType.STORYBOARD);
            });
        }
        if (!this.mediaPlayerElement) {
            throw new AmaliaException(`Error to init plugin ${this.pluginName} (player id : ${this.playerId}).`);
        }
        if (!this.mediaPlayerElement.isMetadataLoaded && this.pluginName !== 'STORYBOARD') {
            this.mediaPlayerElement.eventEmitter.on(PlayerEventType.INIT, this.init.bind(this));
        } else if (this.pluginName !== 'STORYBOARD') {
            this.init();
        }
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.STORYBOARD, this.init.bind(this));
    }
    init() {
        const defaultConfig = this.getDefaultConfig();
        try {
            const customConfig = this.mediaPlayerElement.getPluginConfiguration(`${this.pluginName}-${this.playerId}${this.pluginInstance}`);
            if (customConfig) {
                if (this.pluginConfiguration) {
                    this.pluginConfiguration = {
                        ...defaultConfig,
                        ...customConfig,
                        ...this.pluginConfiguration
                    };
                } else {
                    this.pluginConfiguration = {
                        ...defaultConfig,
                        ...customConfig
                    };
                }
            }
        } catch (e) {
            this.logger.debug(`${this.pluginName} : init default configuration`);
        }
        if (!this.pluginConfiguration) {
            this.pluginConfiguration = defaultConfig;
        } else {
            this.pluginConfiguration.data = {
                ...defaultConfig.data,
                ...this.pluginConfiguration.data
            };
        }

        this.tcOffset = this.mediaPlayerElement.getConfiguration().tcOffset || 0;
        this.fps = this.mediaPlayerElement.getConfiguration().player.framerate || 25;
    }

    abstract getDefaultConfig(): PluginConfigData<T>;
}
