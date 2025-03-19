import {Injectable} from '@angular/core';
import {MediaPlayerElement} from '../core/media-player-element';

/**
 * Service contain all instance of players
 */
@Injectable()
export class MediaPlayerService {
    public players = new Map<string, MediaPlayerElement>();
    public amaliaComponentsCount = new Map<string, number>();

    /**
     * In charge to crate instance or return existing instance
     * @param key instance id, this this case id is player id
     */
    public get(key: string): MediaPlayerElement {

        if (!key && this.players.size > 0) {
            key = this.players.keys().next().value;
        }
        if (key && !this.players.has(key)) {
            this.players.set(key, new MediaPlayerElement());
        }
        return this.players.get(key);
    }

    public delete(key: string) {
        this.players.delete(key);
    }

    increment(key: string) {
        let count = this.amaliaComponentsCount.get(key);
        if (isNaN(count)) {
            count = 1;
        } else {
            count++;
        }
        this.amaliaComponentsCount.set(key, count);
    }

    decrement(key: string) {
        let count = this.amaliaComponentsCount.get(key);
        if (isNaN(count)) {
            count = 0;
        } else {
            count = count - 1;
        }
        this.amaliaComponentsCount.set(key, count < 0 ? 0 : count);
        if (count <= 0) {
            this.delete(key);
            this.amaliaComponentsCount.delete(key);
        }
    }
}
