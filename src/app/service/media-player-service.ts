import {Injectable} from '@angular/core';
import {MediaPlayerElement} from '../core/media-player-element';

/**
 * Service contain all instance of players
 */
@Injectable()
export class MediaPlayerService {
    public players = new Map<string, MediaPlayerElement>();

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
}
