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
    @Input()
    public pluginConfiguration: PluginConfigData<T>;
    public readonly mediaPlayerElement: MediaPlayerElement;
    protected pluginName: string;
    protected readonly logger: DefaultLogger;

    protected constructor(mediaPlayerElement: MediaPlayerElement, logger: DefaultLogger) {
        this.mediaPlayerElement = mediaPlayerElement;
        this.logger = logger;
    }

    ngOnInit(): void {
        try {
            this.pluginConfiguration = this.mediaPlayerElement.getPluginConfiguration(this.pluginName);
        } catch (e) {
            this.pluginConfiguration = this.getDefaultConfig();
        }
    }

    abstract getDefaultConfig(): PluginConfigData<T>;
}
