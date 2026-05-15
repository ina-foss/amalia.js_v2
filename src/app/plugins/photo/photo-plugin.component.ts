import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { PluginBase } from '../../core/plugin/plugin-base';
import { PluginConfigData } from '../../core/config/model/plugin-config-data';
import { MediaPlayerService } from '../../service/media-player-service';
import { amaliaPhoto } from './photo-entry';

interface PhotoConfig {
    mode?: 'simple' | 'reduced' | 'advanced' | 'standard';
    imagesSrc?: Array<{ name: string; path: string; thumbPath: string }>;
    toolbar?: any;
    zoomStep?: number;
    zoomSteps?: number[] | null;
    zoomMax?: number;
    zoomMin?: number;
    magnifyValue?: number;
    showGallery?: boolean;
}

@Component({
    selector: 'amalia-photo',
    templateUrl: './photo-plugin.component.html',
    styleUrls: ['./photo-plugin.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PhotoPluginComponent extends PluginBase<PhotoConfig> implements OnInit, OnDestroy {
    public static PLUGIN_NAME = 'PHOTO';
    private playerInstance: ReturnType<typeof amaliaPhoto> | null = null;
    private hostSelector = '';

    @ViewChild('photoHost', { static: true })
    public photoHost: ElementRef<HTMLDivElement>;

    constructor(playerService: MediaPlayerService) {
        super(playerService);
        this.pluginName = PhotoPluginComponent.PLUGIN_NAME;
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    init() {
        super.init();
        this.renderPhoto();
    }

    getDefaultConfig(): PluginConfigData<PhotoConfig> {
        return {
            name: PhotoPluginComponent.PLUGIN_NAME,
            data: {
                mode: 'simple',
                imagesSrc: [],
                toolbar: {},
                zoomStep: 25,
                zoomSteps: null,
                zoomMax: 300,
                zoomMin: 10,
                magnifyValue: 400,
                showGallery: false
            }
        };
    }

    ngOnDestroy(): void {
        this.destroyPhoto();
        super.ngOnDestroy();
    }

    private renderPhoto(): void {
        const host = this.photoHost?.nativeElement;
        if (!host) {
            return;
        }

        const config = this.pluginConfiguration?.data;
        if (!config?.imagesSrc || config.imagesSrc.length === 0) {
            this.logger.warn('PHOTO plugin not rendered: imagesSrc is empty.');
            return;
        }

        this.destroyPhoto();
        host.innerHTML = '';

        this.hostSelector = `photo-plugin-${this.playerId}-${this.pluginInstance || 'default'}`;
        host.id = this.hostSelector;
        this.playerInstance = this.createPhotoPlayer(`#${this.hostSelector}`, config);
    }

    private destroyPhoto(): void {
        if (this.playerInstance) {
            this.playerInstance.destroy();
            this.playerInstance = null;
        }
    }

    // Wrapper to simplify unit testing without mocking readonly module exports.
    protected createPhotoPlayer(target: string, settings: PhotoConfig): ReturnType<typeof amaliaPhoto> {
        return amaliaPhoto(target, settings);
    }
}
