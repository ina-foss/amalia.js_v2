import {MediaPlayerElement} from '../media-player-element';
import {PluginConfigData} from '../config/model/plugin-config-data';
import {DefaultLogger} from '../logger/default-logger';
import {OnInit} from '@angular/core';

/**
 * Base class for create plugin
 */
export abstract class PluginBase implements OnInit {
    protected pluginName: string;
    protected pluginConfiguration: PluginConfigData;
    protected readonly mediaPlayerElement: MediaPlayerElement;
    protected readonly logger: DefaultLogger;

    protected constructor(mediaPlayerElement: MediaPlayerElement, logger: DefaultLogger) {
        this.mediaPlayerElement = mediaPlayerElement;
        this.logger = logger;
    }

    ngOnInit(): void {
        try {
            this.pluginConfiguration = this.mediaPlayerElement.getPluginConfiguration(this.pluginName);
        } catch (e) {
            this.pluginConfiguration = null;
        }
    }

}
