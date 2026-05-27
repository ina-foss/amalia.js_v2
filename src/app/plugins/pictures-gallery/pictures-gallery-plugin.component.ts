import { PluginBase } from '../../core/plugin/plugin-base';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { PluginConfigData } from '../../core/config/model/plugin-config-data';
import { PicturesGalleryConfig, PicturesGalleryImageSource } from '../../core/config/model/pictures-gallery-config';
import { MediaPlayerService } from '../../service/media-player-service';
import { PlayerEventType } from '../../core/constant/event-type';

export interface GalleryItem {
    div: HTMLDivElement;
    img: HTMLImageElement;
}

@Component({
    selector: 'amalia-pictures-gallery',
    templateUrl: './pictures-gallery-plugin.component.html',
    styleUrls: ['./pictures-gallery-plugin.component.scss'],
    encapsulation: ViewEncapsulation.ShadowDom
})
export class PicturesGalleryPluginComponent extends PluginBase<PicturesGalleryConfig> implements OnInit, OnDestroy {
    public static readonly PLUGIN_NAME = 'PICTURES_GALLERY';
    public static readonly events = {
        select: 'ina.amalia.plugin.pictures-gallery.select'
    };

    private readonly _moveKeys: string[] = ['ArrowUp', 'ArrowLeft', 'ArrowRight', 'ArrowDown'];
    private readonly _moveEventRef: (event: KeyboardEvent) => void;

    public images: PicturesGalleryImageSource[] = [];
    private _thumbs: GalleryItem[] = [];
    public currentItemIndex: number = 0;

    @ViewChild('galleryContainer', { static: false })
    public galleryContainer: ElementRef<HTMLElement>;

    constructor(playerService: MediaPlayerService) {
        super(playerService);
        this.pluginName = PicturesGalleryPluginComponent.PLUGIN_NAME;
        this._moveEventRef = this.moveHandler.bind(this);
    }

    override ngOnInit(): void {
        super.ngOnInit();
        if (this.mediaPlayerElement?.getConfiguration()?.loadMetadataOnDemand) {
            this.init();
        }
    }

    override init() {
        super.init();
        this.loadImages();
        this.addListener(this.mediaPlayerElement.eventEmitter, PlayerEventType.DATA_CHANGE, this.onMetadataChange.bind(this));
    }

    private loadImages(): void {
        // Option 1: Images passées directement dans la config
        if (this.pluginConfiguration?.data?.images && Array.isArray(this.pluginConfiguration.data.images)) {
            this.processMetadata(this.pluginConfiguration.data.images);
        }

        // Option 2: Images chargées via metadataIds
        const metadataIds = this.pluginConfiguration?.metadataIds;
        if (metadataIds && metadataIds.length > 0) {
            const metadataManager = this.mediaPlayerElement.metadataManager;
            metadataIds.forEach((metadataId: string) => {
                try {
                    const metadata = metadataManager.getMetadata(metadataId);
                    if (metadata?.data) {
                        this.processMetadata(metadata.data);
                    }
                } catch (e) {
                    console.warn(`PicturesGallery: metadata ${metadataId} not found`);
                }
            });
        }
        this.buildGallery();
    }

    private processMetadata(data: any): void {
        if (Array.isArray(data)) {
            data.forEach((item: any) => {
                if (item.path || item.url) {
                    this.images.push({
                        name: item.name || item.label || '',
                        path: item.path || item.url,
                        thumbPath: item.thumbPath || item.thumbnail || item.path || item.url,
                        resourceRef: item.resourceRef
                    });
                }
            });
        }
    }

    private onMetadataChange(): void {
        this.images = [];
        this._thumbs = [];
        this.currentItemIndex = 0;
        this.loadImages();
    }

    private buildGallery(): void {
        setTimeout(() => {
            if (this.galleryContainer?.nativeElement) {
                this.loadAsyncThumbs();
                document.addEventListener('keydown', this._moveEventRef);
            }
        }, 300);
    }

    public moveHandler(event: KeyboardEvent): void {
        if (!this._moveKeys.includes(event.key)) {
            return;
        }
        event.preventDefault();

        const container = this.galleryContainer?.nativeElement;
        if (!container) return;

        const thumbWidth = this.pluginConfiguration?.data?.thumbSize || 70;
        const cols = Math.floor(container.clientWidth / (thumbWidth + 8));
        const idx = this.currentItemIndex;
        let next = idx;
        const max = this.images.length - 1;

        switch (event.key) {
            case 'ArrowUp':
                next = Math.max(idx - cols, 0);
                break;
            case 'ArrowDown':
                next = Math.min(idx + cols, max);
                break;
            case 'ArrowLeft':
                next = Math.max(idx - 1, 0);
                break;
            case 'ArrowRight':
                next = Math.min(idx + 1, max);
                break;
        }

        if (next !== idx) {
            this.selectImage(next);
            this.scrollToIndex(next);
        }
    }

    public selectImage(index: number): void {
        this.currentItemIndex = index;
        const image = this.images[index];
        if (image) {
            this.mediaPlayerElement.selectPictureImage?.(image.path, image.name);
            this.mediaPlayerElement.eventEmitter.emit(
                PicturesGalleryPluginComponent.events.select,
                {
                    index: index,
                    imageSrc: image.path,
                    thumbSrc: image.thumbPath,
                    imageName: image.name,
                    resourceRef: image.resourceRef,
                    images: this.images
                }
            );
        }
    }

    private scrollToIndex(index: number): void {
        const container = this.galleryContainer?.nativeElement;
        if (!container) return;

        const thumbs = container.querySelectorAll('.gallery-thumb');
        if (thumbs[index]) {
            const thumb = thumbs[index] as HTMLElement;
            const thumbTop = thumb.offsetTop;
            const thumbHeight = thumb.offsetHeight;
            const containerScrollTop = container.scrollTop;
            const containerHeight = container.clientHeight;

            if (thumbTop + thumbHeight > containerScrollTop + containerHeight) {
                container.scrollTo(0, containerScrollTop + thumbHeight + 8);
            } else if (thumbTop < containerScrollTop) {
                container.scrollTo(0, containerScrollTop - thumbHeight - 8);
            }
        }
    }

    public onScroll(): void {
        this.loadAsyncThumbs();
    }

    private loadAsyncThumbs(): void {
        const container = this.galleryContainer?.nativeElement;
        if (!container) return;

        const scrollBottom = container.offsetHeight + container.scrollTop + (this.pluginConfiguration?.data?.lazyLoadOffset || 100);
        const imgs = container.querySelectorAll('.gallery-thumb img[data-src]');

        imgs.forEach((img: HTMLImageElement) => {
            const parent = img.parentElement;
            if (parent && parent.offsetTop < scrollBottom) {
                const src = img.getAttribute('data-src');
                if (src && !img.src) {
                    img.src = src;
                    img.removeAttribute('data-src');
                }
            }
        });
    }

    public onImageClick(index: number): void {
        this.selectImage(index);
    }

    public scrollToActive(): void {
        this.scrollToIndex(this.currentItemIndex);
    }

    public getNextImages(count: number): string[] | null {
        const ret: string[] = [];
        const length = this.images.length;
        let j = Math.min(length - count, this.currentItemIndex);
        j = Math.max(0, j);

        for (let i = j; i < Math.min(length, j + count); i++) {
            ret.push(this.images[i].path);
        }

        return ret.length > 1 ? ret : null;
    }

    getDefaultConfig(): PluginConfigData<PicturesGalleryConfig> {
        return {
            name: PicturesGalleryPluginComponent.PLUGIN_NAME,
            data: {
                height: 300,
                thumbSize: 70,
                enableKeyboardNavigation: true,
                lazyLoadOffset: 100,
                images: []
            }
        };
    }

    override ngOnDestroy(): void {
        document.removeEventListener('keydown', this._moveEventRef);
        super.ngOnDestroy();
    }
}
