import {MediaPlayerElement} from '../media-player-element';
import {PluginConfigData} from '../config/model/plugin-config-data';
import {DefaultLogger} from '../logger/default-logger';
import {Input, OnInit} from '@angular/core';
import {PlayerEventType} from '../constant/event-type';
import {AutoBind} from '../decorator/auto-bind.decorator';

/**
 * Base class for create plugin
 */
export abstract class PluginBase<T> implements OnInit {
    /**
     * This plugin configuration
     */

    private _pluginConfiguration: PluginConfigData<T>;

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

    public readonly mediaPlayerElement: MediaPlayerElement;
    protected pluginName: string;
    protected readonly logger: DefaultLogger;

    protected constructor(mediaPlayerElement: MediaPlayerElement, logger: DefaultLogger) {
        this.mediaPlayerElement = mediaPlayerElement;
        this.logger = logger;
    }

    ngOnInit(): void {
        // Init events
        this.mediaPlayerElement.eventEmitter.on(PlayerEventType.INIT, this.init);
    }

    @AutoBind
    init() {
        const defaultConfig = this.getDefaultConfig();
        try {
            const customConfig = this.mediaPlayerElement.getPluginConfiguration(this.pluginName);
            if (customConfig) {
                this.pluginConfiguration = {
                    ...defaultConfig,
                    ...customConfig
                };
            }
        } catch (e) {
            this.logger.debug(`${this.pluginName} : init default configuration`);
        }
        if (!this.pluginConfiguration) {
            this.pluginConfiguration = defaultConfig;
        } else {
            this.pluginConfiguration = {
                ...defaultConfig,
                ...this.pluginConfiguration
            };
        }
    }

    abstract getDefaultConfig(): PluginConfigData<T>;
}
