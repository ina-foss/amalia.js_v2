import BaseHtmlElement from "../BaseHtmlElement";
import {AmaliaPlayerGalleryItem, AmaliaPlayerImageSource} from "../../business/AmaliaPlayerSettings";
import Utils from "../../business/Utils";

export default class Gallery extends BaseHtmlElement {

    public static readonly events: any = {
        select: 'ina.amalia.photo.event.gallery.select'
    };

    private readonly _moveKeys: string[] = ['ArrowUp', 'ArrowLeft', 'ArrowRight', 'ArrowDown'];
    private readonly _moveEventRef: any;

    private readonly _thumbs: AmaliaPlayerGalleryItem[] = [];
    private _currentItemIndex: number = 0;
    private _initialSelectedIndex: number = 0;

    constructor(images: AmaliaPlayerImageSource[], height: number) {
        super();

        this.dom = document.createElement('div');
        this.addClass('ajs-photo-gallery-content');
        this.dom.style.height = height.toString() + 'px';

        const contentGallery: HTMLDivElement = document.createElement('div');
        this.addClass('ajs-photo-thumbs', contentGallery);

        const selectedIdx: number = images.findIndex((img) => img.selectedImg === true);
        this._initialSelectedIndex = selectedIdx >= 0 ? selectedIdx : 0;
        this._currentItemIndex = this._initialSelectedIndex;

        images.forEach((imageSrc: AmaliaPlayerImageSource, i: number) => {
            const active: boolean = i === this._initialSelectedIndex;
            const classNameThumb: string = active ? 'ajs-photo-img-thumb ajs-photo-active' : 'ajs-photo-img-thumb';
            contentGallery.appendChild(this.createImage(imageSrc, classNameThumb, i));
        });

        this.addEventListener('scroll', this.loadAsyncThumbs.bind(this));
        this.dom.appendChild(contentGallery);
        setTimeout(() => {
            this.loadAsyncThumbs();
        }, 300);

        this._moveEventRef = this.moveHandler.bind(this);
    }

    public getInitialSelectedIndex(): number {
        return this._initialSelectedIndex;
    }

    public moveHandler(event: KeyboardEvent): void {
        if (!Utils.inArray(event.key, this._moveKeys)) {
            return;
        }
        event.preventDefault();

        const cols: number = Math.max(1, Math.floor(this.dom.clientWidth / 76));
        const activeImg: HTMLImageElement | null = this.dom.querySelector('.ajs-photo-img-thumb.ajs-photo-active img');
        if (!activeImg) {
            return;
        }
        const idx: number = parseInt(activeImg.getAttribute('i'), 10);
        let next: number = idx;
        const max: number = this._thumbs.length - 1;
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
        if (next === idx) {
            return;
        }
        const nextActiveImg: HTMLImageElement | null = this.dom.querySelector('.ajs-photo-img-thumb img[i="' + next.toString() + '"]');
        if (!nextActiveImg?.parentElement) {
            return;
        }
        const targetDiv: HTMLElement = nextActiveImg.parentElement;
        const containerTop: number = this.dom.scrollTop;
        const containerBottom: number = containerTop + this.dom.offsetHeight;
        const itemBottom: number = targetDiv.offsetTop + targetDiv.offsetHeight;
        if (itemBottom > containerBottom) {
            this.dom.scrollTo(0, this.dom.scrollTop + targetDiv.offsetHeight + 8);
        } else if (targetDiv.offsetTop < containerTop) {
            this.dom.scrollTo(0, this.dom.scrollTop - targetDiv.offsetHeight - 8);
        }
        targetDiv.click();
    }

    public getNextImages(count: number) {
        const ret: string[] = [];
        const thumbsLength: number = this._thumbs.length;
        let j: number = Math.min(thumbsLength - count, this._currentItemIndex);
        j = Math.max(0, j);

        for (let i: number = j; i < Math.min(thumbsLength, j + count); i++) {
            const img: HTMLImageElement = this._thumbs[i].img;
            ret.push(img.getAttribute('osrc'));
        }

        return ret.length > 1 ? ret : null;
    }

    private createImage(imageSrc: AmaliaPlayerImageSource, classe: string, index: number): HTMLElement {
        const div: HTMLDivElement = document.createElement('div');
        this.addClass(classe, div);

        const img: HTMLImageElement = document.createElement('img');
        img.setAttribute('osrc', imageSrc.thumbPath);
        img.setAttribute('isrc', imageSrc.path);
        img.setAttribute('i', index.toString());
        this.addClass('ajs-photo-thumb', img);

        div.appendChild(img);

        div.addEventListener('click', (e) => {
            const current: HTMLElement = e.currentTarget as HTMLElement;
            const active: HTMLElement = this.dom.querySelector('.ajs-photo-img-thumb.ajs-photo-active');
            if (active) {
                active.setAttribute('class', 'ajs-photo-img-thumb');
            }
            current.setAttribute('class', 'ajs-photo-img-thumb ajs-photo-active');
            this._currentItemIndex = index;
            this.dom.dispatchEvent(new CustomEvent(Gallery.events.select, {
                detail: {
                    orignalEvent: e,
                    index: index,
                    imageSrc: imageSrc.path,
                    thumbSrc: imageSrc.thumbPath,
                    imageName: imageSrc.name
                }
            }));
        });
        this._thumbs.push({div, img});
        return div;
    }

    private loadAsyncThumbs() {
        const nScroll: number = this.dom.offsetHeight + this.dom.offsetTop + this.dom.scrollTop;
        this._thumbs.forEach((item: AmaliaPlayerGalleryItem) => {
            const div: HTMLDivElement = item.div;
            const img: HTMLImageElement = item.img;
            if (!img.hasAttribute('src') || img.src === '') {
                if (nScroll > div.offsetTop) {
                    img.src = img.getAttribute('osrc');
                }
            }
        });
    }

    public scrollToActive() {
        const active: HTMLElement = this.dom.querySelector('.ajs-photo-img-thumb.ajs-photo-active');
        if (!active) {
            return;
        }
        const activeTop: number = active.offsetTop - this.dom.offsetTop;
        const thumbH: number = active.offsetHeight;
        const center: number = (this.dom.offsetHeight / 2) - (thumbH / 2);
        this.dom.scrollTo(0, Math.max(0, activeTop - center));
    }

    public updateImages(images: AmaliaPlayerImageSource[]) {
        const contentGallery = this.dom.querySelector<HTMLElement>('.ajs-photo-thumbs');
        if (!contentGallery) {
            return;
        }
        const existingPaths = new Set(this._thumbs.map(t => t.img.getAttribute('isrc')));
        let added = 0;
        images.forEach((imageSrc: AmaliaPlayerImageSource) => {
            if (existingPaths.has(imageSrc.path)) {
                return;
            }
            existingPaths.add(imageSrc.path);
            const absIndex = this._thumbs.length;
            const el = this.createImage(imageSrc, 'ajs-photo-img-thumb', absIndex);
            contentGallery.appendChild(el);
            added++;
        });
        if (added > 0) {
            setTimeout(() => {
                this.loadAsyncThumbs();
            }, 100);
        }
    }

    public setActiveByImageSrc(imageSrc: string): boolean {
        if (!imageSrc) {
            return false;
        }
        const img = this.dom.querySelector<HTMLImageElement>(`.ajs-photo-img-thumb img[isrc="${imageSrc}"]`);
        if (!img?.parentElement) {
            return false;
        }
        img.parentElement.click();
        return true;
    }

    public setDisplayState(displayState: string) {
        document.removeEventListener('keydown', this._moveEventRef);
        if (displayState !== 'xs') {
            document.addEventListener('keydown', this._moveEventRef);
        }
    }

    public removeFromDom() {
        document.removeEventListener('keydown', this._moveEventRef);
        super.removeFromDom();
    }
}
