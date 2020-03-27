import {PluginBase} from '../../core/plugin/plugin-base';
import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MediaPlayerElement} from '../../core/media-player-element';
import {DefaultLogger} from '../../core/logger/default-logger';
import {PlayerEventType} from '../../core/constant/event-type';
import {AutoBind} from '../../core/decorator/auto-bind.decorator';
import {PluginConfigData} from '../../core/config/model/plugin-config-data';
import {StoryboardConfig} from '../../core/config/model/storyboard-config';

@Component({
    selector: 'amalia-storyboard',
    templateUrl: './storyboard-plugin.component.html',
    styleUrls: ['./storyboard-plugin.component.scss'],
    encapsulation: ViewEncapsulation.ShadowDom
})
export class StoryboardPluginComponent extends PluginBase<StoryboardConfig> implements OnInit {
    public static PLUGIN_NAME = 'THUMBNAIL';
    /**
     * Enable thumbnail on hover to scroll bar
     */
    public enableThumbnail: boolean;
    /**
     * Enable thumbnail preview
     */
    public enableThumbnailPreview: boolean;

    constructor(mediaPlayerElement: MediaPlayerElement, logger: DefaultLogger) {
        super(mediaPlayerElement, logger);
        this.pluginName = StoryboardPluginComponent.PLUGIN_NAME;
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    @AutoBind
    init() {
        super.init();
        // disable thumbnail when base url is empty
        if (this.pluginConfiguration.data.baseUrl === '') {
            this.enableThumbnail = false;
            this.enableThumbnailPreview = false;
        } else {
            this.mediaPlayerElement.eventEmitter.on(PlayerEventType.PAUSED, this.handlePaused);
            this.mediaPlayerElement.eventEmitter.on(PlayerEventType.DURATION_CHANGE, this.handleMoveFrame);
        }
    }

    /**
     * Return default config
     */
    getDefaultConfig(): PluginConfigData<ThumbnailConfig> {
        return {name: StoryboardPluginComponent.PLUGIN_NAME, data: {baseUrl: '', enableThumbnail: true, enableThumbnailPreview: false}};
    }

    /**
     * Invoked on paused
     */
    @AutoBind
    private handlePaused() {
    }

    /**
     * Invoked on mode frame
     */
    @AutoBind
    private handleMoveFrame() {
    }

}
