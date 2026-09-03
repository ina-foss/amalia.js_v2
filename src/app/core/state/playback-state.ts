import { computed, signal } from '@angular/core';
import { EventEmitter } from '../utils/event-emitter';
import { PlayerEventType } from '../constant/event-type';

/**
 * Sous-ensemble de l'API {@link import('../media/media-element').MediaElement} lu par le store.
 * Interface structurelle pour rester découplé (et facilement simulable en spec pure).
 */
export interface PlaybackMediaReader {
    /** Position courante en secondes. */
    getCurrentTime(): number;
    /** Durée du média en secondes. */
    getDuration(): number;
    /** Volume en pourcentage (0-100), cf. MediaElement.getVolume(). */
    getVolume(): number;
    /** Vitesse de lecture courante. */
    getPlaybackRate(): number | null;
}

/**
 * Store de signals de l'état de lecture — framework-free (seuls `signal`/`computed`
 * d'`@angular/core` sont utilisés), **1 instance par {@link import('../media-player-element').MediaPlayerElement}**,
 * ce n'est PAS un service DI.
 *
 * Alimenté depuis l'EventEmitter interne du player (source de vérité de l'API événementielle
 * publique, inchangée). Les émissions arrivent le plus souvent **hors zone Angular** : depuis
 * Angular 18 (stable en 21), le scheduler hybride fait qu'une écriture de signal hors zone
 * programme un `ApplicationRef.tick()` coalescé — en mode zone et zoneless. Les composants
 * peuvent donc consommer `playback.currentTime()` etc. sans `zone.run` ni `markForCheck`.
 *
 * Dédup incluse : les signals notifient via l'égalité par défaut `Object.is`, une écriture
 * de la même valeur (ex. TIME_CHANGE redondant) ne déclenche aucune notification.
 */
export class PlaybackState {
    private readonly _currentTime = signal(0);
    private readonly _duration = signal(0);
    private readonly _playing = signal(false);
    private readonly _volume = signal(1);
    private readonly _muted = signal(false);
    private readonly _playbackRate = signal(1);
    private readonly _seekingTime = signal<number | null>(null);
    private readonly _fullscreen = signal(false);
    private readonly _displayState = signal('l');

    /** Position courante en secondes (TIME_CHANGE). */
    public readonly currentTime = this._currentTime.asReadonly();
    /** Durée du média en secondes (DURATION_CHANGE). */
    public readonly duration = this._duration.asReadonly();
    /** Lecture en cours (PLAYING → true, PAUSED/ENDED → false). */
    public readonly playing = this._playing.asReadonly();
    /** Volume normalisé 0..1 (VOLUME_CHANGE ; MediaElement.getVolume() renvoie 0-100). */
    public readonly volume = this._volume.asReadonly();
    /** Vrai quand le volume est à 0 (même sémantique que MediaElement.isMute()). */
    public readonly muted = this._muted.asReadonly();
    /** Vitesse de lecture (PLAYBACK_RATE_CHANGE). */
    public readonly playbackRate = this._playbackRate.asReadonly();
    /** Cible du seek en cours en secondes, null hors seek (SEEKING/SEEKED). */
    public readonly seekingTime = this._seekingTime.asReadonly();
    /** État plein écran (FULLSCREEN_STATE_CHANGE → document.fullscreenElement). */
    public readonly fullscreen = this._fullscreen.asReadonly();
    /** État d'affichage responsive xs/s/sm/m/l (PLAYER_RESIZED → MediaPlayerElement.getDisplayState()). */
    public readonly displayState = this._displayState.asReadonly();

    /**
     * Temps à afficher : pendant un drag de la barre de progression, la cible du seek
     * prime sur la position réelle du média.
     */
    public readonly displayTime = computed(() => this._seekingTime() ?? this._currentTime());

    /** Progression 0-100 basée sur {@link displayTime} ; 0 tant que la durée est inconnue. */
    public readonly progressPercent = computed(() => {
        const duration = this._duration();
        return duration > 0 ? (this.displayTime() / duration) * 100 : 0;
    });

    private connected = false;

    /**
     * Abonne le store aux événements du player. **Idempotent** : les appels suivants sont
     * ignorés — un MediaPlayerElement recyclé (detach/reattach du même player-id) repasse
     * par `setMediaPlayer()` mais ne doit pas s'abonner deux fois. Aucune désinscription
     * n'est nécessaire : l'emitter et ce store ont exactement la même durée de vie que le
     * MediaPlayerElement qui les possède.
     *
     * @param emitter EventEmitter interne du player (src/app/core/utils/event-emitter.ts).
     * @param media Accesseur paresseux vers le MediaElement courant (peut être null tant
     *   qu'aucun média n'est attaché ; ré-évalué à chaque événement, donc insensible aux
     *   re-créations de MediaElement lors d'un re-init).
     * @param displayState Accesseur optionnel vers `MediaPlayerElement.getDisplayState()`.
     */
    public connect(
        emitter: EventEmitter,
        media: () => PlaybackMediaReader | null | undefined,
        displayState?: () => string,
    ): void {
        if (this.connected) {
            return;
        }
        this.connected = true;
        emitter.on(PlayerEventType.TIME_CHANGE, () => {
            const time = media()?.getCurrentTime();
            if (Number.isFinite(time)) {
                this._currentTime.set(time);
            }
        });
        emitter.on(PlayerEventType.DURATION_CHANGE, () => {
            const duration = media()?.getDuration();
            if (Number.isFinite(duration)) {
                this._duration.set(duration);
            }
        });
        emitter.on(PlayerEventType.PLAYING, () => this._playing.set(true));
        emitter.on(PlayerEventType.PAUSED, () => this._playing.set(false));
        emitter.on(PlayerEventType.ENDED, () => this._playing.set(false));
        // SEEKING est émis par la control-bar avec le temps cible en secondes ; SEEKED est émis
        // soit par MediaElement (sans argument), soit par la control-bar (avec un pourcentage) —
        // dans les deux cas il clôt le seek.
        emitter.on(PlayerEventType.SEEKING, (time?: number) => {
            if (Number.isFinite(time)) {
                this._seekingTime.set(time);
            }
        });
        emitter.on(PlayerEventType.SEEKED, () => this._seekingTime.set(null));
        // VOLUME_CHANGE est émis sans argument : on relit le volume (0-100) sur le média.
        emitter.on(PlayerEventType.VOLUME_CHANGE, () => {
            const volumePercent = media()?.getVolume();
            if (Number.isFinite(volumePercent)) {
                const volume = Math.min(1, Math.max(0, volumePercent / 100));
                this._volume.set(volume);
                this._muted.set(volume === 0);
            }
        });
        // PLAYBACK_RATE_CHANGE transporte la vitesse (MediaElement.setPlaybackRate) ; à défaut
        // on relit la vitesse courante sur le média.
        emitter.on(PlayerEventType.PLAYBACK_RATE_CHANGE, (speed?: number) => {
            const rate = Number.isFinite(speed) ? speed : media()?.getPlaybackRate();
            if (Number.isFinite(rate)) {
                this._playbackRate.set(rate);
            }
        });
        // FULLSCREEN_STATE_CHANGE est émis sans argument : l'état se lit sur le document.
        emitter.on(PlayerEventType.FULLSCREEN_STATE_CHANGE, () => {
            this._fullscreen.set(typeof document !== 'undefined' && document.fullscreenElement !== null);
        });
        emitter.on(PlayerEventType.PLAYER_RESIZED, () => {
            const state = displayState?.();
            if (typeof state === 'string' && state.length > 0) {
                this._displayState.set(state);
            }
        });
    }
}
