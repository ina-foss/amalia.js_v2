import {MediaPlayerElement} from '../media-player-element';
import {PluginConfigData} from '../config/model/plugin-config-data';
import {DefaultLogger} from '../logger/default-logger';
import {Input, OnInit} from '@angular/core';

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
        try {
            if (!this.pluginConfiguration) {
                this.pluginConfiguration = this.mediaPlayerElement.getPluginConfiguration(this.pluginName);
            }
        } catch (e) {
            if (!this.pluginConfiguration) {
                this.pluginConfiguration = this.getDefaultConfig();
            }
        }
    }

    abstract getDefaultConfig(): PluginConfigData<T>;
}
