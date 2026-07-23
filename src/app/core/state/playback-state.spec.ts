import { computed } from '@angular/core';
import { PlaybackState } from './playback-state';
import { EventEmitter } from '../utils/event-emitter';
import { PlayerEventType } from '../constant/event-type';

/**
 * Spec unitaire pure (sans TestBed) : EventEmitter en entrée → valeurs de signaux en sortie.
 * PlaybackState est framework-free, il s'instancie et se teste avec `new`.
 */
describe('PlaybackState', () => {
    class MediaStub {
        public currentTime = 0;
        public duration = 0;
        public volumePercent = 100;
        public rate: number | null = 1;

        public getCurrentTime(): number {
            return this.currentTime;
        }

        public getDuration(): number {
            return this.duration;
        }

        public getVolume(): number {
            return this.volumePercent;
        }

        public getPlaybackRate(): number | null {
            return this.rate;
        }
    }

    let emitter: EventEmitter;
    let state: PlaybackState;
    let media: MediaStub | null;
    let displayState: string;

    beforeEach(() => {
        emitter = new EventEmitter();
        state = new PlaybackState();
        media = new MediaStub();
        displayState = 'l';
        state.connect(emitter, () => media, () => displayState);
    });

    it('should expose default values', () => {
        expect(state.currentTime()).toBe(0);
        expect(state.duration()).toBe(0);
        expect(state.playing()).toBeFalse();
        expect(state.volume()).toBe(1);
        expect(state.muted()).toBeFalse();
        expect(state.playbackRate()).toBe(1);
        expect(state.seekingTime()).toBeNull();
        expect(state.fullscreen()).toBeFalse();
        expect(state.displayState()).toBe('l');
        expect(state.displayTime()).toBe(0);
        expect(state.progressPercent()).toBe(0);
    });

    it('should read the current time from the media on TIME_CHANGE', () => {
        media.currentTime = 42.5;
        emitter.emit(PlayerEventType.TIME_CHANGE);
        expect(state.currentTime()).toBe(42.5);
        expect(state.displayTime()).toBe(42.5);
    });

    it('should ignore TIME_CHANGE when the media returns a non-finite time', () => {
        media.currentTime = 10;
        emitter.emit(PlayerEventType.TIME_CHANGE);
        media.currentTime = NaN;
        emitter.emit(PlayerEventType.TIME_CHANGE);
        expect(state.currentTime()).toBe(10);
    });

    it('should ignore TIME_CHANGE when no media is attached', () => {
        media = null;
        emitter.emit(PlayerEventType.TIME_CHANGE);
        expect(state.currentTime()).toBe(0);
    });

    it('should read the duration on DURATION_CHANGE and guard against NaN', () => {
        media.duration = 120;
        emitter.emit(PlayerEventType.DURATION_CHANGE);
        expect(state.duration()).toBe(120);
        media.duration = NaN;
        emitter.emit(PlayerEventType.DURATION_CHANGE);
        expect(state.duration()).toBe(120);
    });

    it('should compute progressPercent from displayTime and duration', () => {
        media.duration = 200;
        emitter.emit(PlayerEventType.DURATION_CHANGE);
        media.currentTime = 50;
        emitter.emit(PlayerEventType.TIME_CHANGE);
        expect(state.progressPercent()).toBe(25);
    });

    it('should keep progressPercent at 0 while the duration is unknown', () => {
        media.currentTime = 50;
        emitter.emit(PlayerEventType.TIME_CHANGE);
        expect(state.progressPercent()).toBe(0);
    });

    it('should toggle playing on PLAYING and PAUSED', () => {
        emitter.emit(PlayerEventType.PLAYING);
        expect(state.playing()).toBeTrue();
        emitter.emit(PlayerEventType.PAUSED);
        expect(state.playing()).toBeFalse();
    });

    it('should reset playing on ENDED', () => {
        emitter.emit(PlayerEventType.PLAYING);
        emitter.emit(PlayerEventType.ENDED);
        expect(state.playing()).toBeFalse();
    });

    it('should give the seeking target priority over the current time in displayTime', () => {
        media.duration = 100;
        emitter.emit(PlayerEventType.DURATION_CHANGE);
        media.currentTime = 5;
        emitter.emit(PlayerEventType.TIME_CHANGE);
        emitter.emit(PlayerEventType.SEEKING, 12);
        expect(state.seekingTime()).toBe(12);
        expect(state.displayTime()).toBe(12);
        expect(state.progressPercent()).toBe(12);
        emitter.emit(PlayerEventType.SEEKED);
        expect(state.seekingTime()).toBeNull();
        expect(state.displayTime()).toBe(5);
        expect(state.progressPercent()).toBe(5);
    });

    it('should ignore SEEKING without a finite target', () => {
        emitter.emit(PlayerEventType.SEEKING);
        expect(state.seekingTime()).toBeNull();
        emitter.emit(PlayerEventType.SEEKING, NaN);
        expect(state.seekingTime()).toBeNull();
    });

    it('should normalize the volume and derive muted on VOLUME_CHANGE', () => {
        media.volumePercent = 40;
        emitter.emit(PlayerEventType.VOLUME_CHANGE);
        expect(state.volume()).toBe(0.4);
        expect(state.muted()).toBeFalse();
        media.volumePercent = 0;
        emitter.emit(PlayerEventType.VOLUME_CHANGE);
        expect(state.volume()).toBe(0);
        expect(state.muted()).toBeTrue();
    });

    it('should clamp the volume to [0, 1] and ignore non-finite volumes', () => {
        media.volumePercent = 150;
        emitter.emit(PlayerEventType.VOLUME_CHANGE);
        expect(state.volume()).toBe(1);
        media.volumePercent = NaN;
        emitter.emit(PlayerEventType.VOLUME_CHANGE);
        expect(state.volume()).toBe(1);
    });

    it('should take the playback rate from the event payload, falling back to the media', () => {
        emitter.emit(PlayerEventType.PLAYBACK_RATE_CHANGE, 2);
        expect(state.playbackRate()).toBe(2);
        media.rate = 0.5;
        emitter.emit(PlayerEventType.PLAYBACK_RATE_CHANGE);
        expect(state.playbackRate()).toBe(0.5);
        media.rate = null;
        emitter.emit(PlayerEventType.PLAYBACK_RATE_CHANGE, NaN);
        expect(state.playbackRate()).toBe(0.5);
    });

    it('should reflect the fullscreen state from document.fullscreenElement', () => {
        const fakeFullscreenElement = document.createElement('div');
        Object.defineProperty(document, 'fullscreenElement', {
            configurable: true,
            get: () => fakeFullscreenElement,
        });
        try {
            emitter.emit(PlayerEventType.FULLSCREEN_STATE_CHANGE);
            expect(state.fullscreen()).toBeTrue();
        } finally {
            // Retire la propriété propre : le getter natif du prototype (→ null) reprend la main.
            delete (document as any).fullscreenElement;
        }
        emitter.emit(PlayerEventType.FULLSCREEN_STATE_CHANGE);
        expect(state.fullscreen()).toBeFalse();
    });

    it('should update displayState on PLAYER_RESIZED via the accessor', () => {
        displayState = 'sm';
        emitter.emit(PlayerEventType.PLAYER_RESIZED);
        expect(state.displayState()).toBe('sm');
        displayState = '';
        emitter.emit(PlayerEventType.PLAYER_RESIZED);
        expect(state.displayState()).toBe('sm');
    });

    it('should not notify consumers when the same value is written again (dédup Object.is)', () => {
        let evaluations = 0;
        const probe = computed(() => {
            evaluations++;
            return state.currentTime();
        });
        media.currentTime = 10;
        emitter.emit(PlayerEventType.TIME_CHANGE);
        expect(probe()).toBe(10);
        expect(evaluations).toBe(1);
        // Même valeur → écriture dédupliquée par Object.is, le computed reste "clean".
        emitter.emit(PlayerEventType.TIME_CHANGE);
        expect(probe()).toBe(10);
        expect(evaluations).toBe(1);
        media.currentTime = 11;
        emitter.emit(PlayerEventType.TIME_CHANGE);
        expect(probe()).toBe(11);
        expect(evaluations).toBe(2);
    });

    it('should subscribe only once even when connect is called again (recyclage detach/reattach)', () => {
        expect(emitter.listenerCount(PlayerEventType.TIME_CHANGE)).toBe(1);
        state.connect(emitter, () => media, () => displayState);
        expect(emitter.listenerCount(PlayerEventType.TIME_CHANGE)).toBe(1);
        expect(emitter.listenerCount(PlayerEventType.PLAYER_RESIZED)).toBe(1);
    });
});
