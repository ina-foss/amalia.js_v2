import {LoggerInterface} from '../logger/logger-interface';
import {EventEmitter} from 'events';
import {PlayerEventType} from '../constant/event-type';
import {AutoBind} from '../decorator/auto-bind.decorator';
import {MediaSourceExtension} from '../mse/media-source-extension';
import {PlayerConfigData} from '../config/model/player-config-data';
import {DefaultMediaSourceExtension} from '../mse/default-media-source-extension';
import {HLSMediaSourceExtension} from '../mse/hsl-media-source-extension';

/**
 * Media element
 */
export class MediaElement {
    private readonly mediaElement: HTMLVideoElement;
    private readonly eventEmitter: EventEmitter;
    private readonly logger: LoggerInterface;
    private mse: MediaSourceExtension;
    private volumeLeft: number;
    private volumeRight: number;

    constructor(mediaElement: HTMLVideoElement, eventEmitter: EventEmitter, logger: LoggerInterface) {
        this.mediaElement = mediaElement;
        this.eventEmitter = eventEmitter;
        this.logger = logger;
    }

    private _playbackRate = 1;

    get playbackRate(): number {
        return this._playbackRate;
    }

    set playbackRate(value: number) {
        this._playbackRate = value;
    }

    private _withMergeVolume = true;

    get withMergeVolume(): boolean {
        return this._withMergeVolume;
    }

    set withMergeVolume(value: boolean) {
        this._withMergeVolume = value;
    }

    private _framerate = 25;

    get framerate(): number {
        return this._framerate;
    }

    set framerate(value: number) {
        this._framerate = value;
    }

    /**
     * Media poster
     */
    private _poster: string;

    get poster(): string {
        return this._poster;
    }

    set poster(value: string) {
        this._poster = value;
    }

    play(): Promise<void> {
        return this.mediaElement.play();
    }

    pause(): void {
        return this.mediaElement.pause();
    }

    stop(): void {
        this.mediaElement.pause();
        this.mediaElement.currentTime = 0;
    }

    /**
     * Invoked to set mute state
     */
    mute() {
        this.mediaElement.volume = 0;
    }

    /**
     * Invoked to set unmute state
     */
    unmute() {
        this.mediaElement.volume = 1;
    }

    /**
     * Invoked to set media source and autoplay
     * @param src media source
     * @param crossOrigin value example anonymous
     */
    setSrc(config: PlayerConfigData): void {

        // remove old mse config
        if (this.mse) {
            this.mse.destroy();
        }
        if (config.hls && config.hls.enable) {
            this.mse = new HLSMediaSourceExtension(this.mediaElement, config, this.logger);
        } else {
            this.mse = new DefaultMediaSourceExtension(this.mediaElement, config, this.logger);
        }
        this.mse.setSrc(config);
        // init handle events
        this.initPlayerEvents();
    }

    /**
     * Returns the player's current volume, an integer between 0 and 100. Note that getVolume()
     * will return the volume even if the player is muted.
     */
    getVolume(side?: 'r' | 'l'): number {
        if (side) {
            return (side === 'l') ? this.volumeLeft : this.volumeRight;
        } else {
            return this.mediaElement ? this.mediaElement.volume * 100 : 0;
        }
    }

    /**
     * Sets the volume. Accepts an integer between 0 and 100.
     */
    setVolume(volume: number, volumeSide?: string) {
        this.logger.debug(`setVolume change side :${volumeSide} volume: ${volume} with same volume ${this._withMergeVolume}`);
        if (this._withMergeVolume) {
            this.volumeLeft = volume;
            this.volumeRight = volume;
        } else {
            if (volumeSide === 'r') {
                this.volumeRight = volume;
            } else if (volumeSide === 'l') {
                this.volumeLeft = volume;
            } else {
                this.volumeRight = volume;
                this.volumeLeft = volume;
            }
        }
        this.mediaElement.volume = Math.min(volume / 100, 1);
    }

    /**
     * Return current position in seconds
     */
    getCurrentTime(): number {
        return this.mediaElement ? this.mediaElement.currentTime : 0;
    }

    /**
     * Set seek position in seconds
     */
    public setCurrentTime(value: number): void {
        const currentTime = isNaN(value) ? 0 : value;
        if (this.mediaElement) {
            this.mediaElement.currentTime = currentTime;
        }
    }

    /**
     * Return playback rate
     * @returns the current playback speed of the audio/video.
     */
    getPlaybackRate(): number | null {
        return this.mediaElement ? this.mediaElement.playbackRate : null;
    }

    /**
     * Set playback rate
     * @param speed the current playback speed of the audio/video.
     * @returns the current playback speed of the audio/video.
     */
    setPlaybackRate(speed: number = 0) {
        if (speed <= 0) {
            // TODO
        } else {
            if (this.isPaused()) {
                this.play();
            }
            if (this.mediaElement) {
                this.mediaElement.playbackRate = speed;
            }
        }
    }

    /**
     * Return true if media is paused
     * @return boolean true is paused
     */
    isPaused(): boolean {
        return this.mediaElement ? this.mediaElement.paused : false;
    }

    /**
     * In charge to move next number of frame
     * @param nbFrames number of frame
     */
    moveNextFrame(nbFrames = 1) {
        this.pause();
        this.setCurrentTime(this.getCurrentTime() + ((1 / this.framerate) * nbFrames));
    }

    /**
     * In charge to move prev number of frame
     * @param nbFrames number of frame
     */
    movePrevFrame(nbFrames = 1) {
        this.pause();
        this.setCurrentTime(Math.max(0, this.getCurrentTime() + ((1 / this.framerate) * nbFrames)));
    }

    /**
     * Return media duration with tc offset
     * @return return duration
     */
    getDuration(): number {
        return this.mediaElement.duration;
    }

    /**
     * Set current time to the beginning of the file
     * @method seekToBegin
     * @return number current time
     */
    seekToBegin(): void {
        this.setCurrentTime(0);
    }

    /**
     * Set current time to the end of the file
     * @return number current time
     */
    seekToEnd(): void {
        this.setCurrentTime(this.getDuration());
    }

    /**
     * Return true if is mute
     * @method isMute
     * @event ina.player.PlayerEventType.UN_MUTE
     */
    isMute(): boolean {
        return this.getVolume() === 0;
    }

    /**
     * Return player instance
     */
    muteUnmute() {
        if (this.isMute()) {
            this.unmute();
        } else {
            this.mute();
        }
    }

    /**
     * In charge to capture image
     * @return image base 64
     */
    captureImage(scale: number): string {
        const image = this.getCurrentImage(scale);
        if (image) {
            this.eventEmitter.emit(PlayerEventType.IMAGE_CAPTURE, image);
        }
        return image;
    }

    /**
     * Play if paused, if paused play
     */
    playPause() {
        if (this.isPaused()) {
            this.play();
        } else {
            this.pause();
        }
    }

    /**
     * In charge to init player events
     */
    private initPlayerEvents() {
        this.mediaElement.addEventListener('loadstart', this.handleLoadstart);
        this.mediaElement.addEventListener('playing', this.handlePlay);
        this.mediaElement.addEventListener('pause', this.handlePause);
        this.mediaElement.addEventListener('ended', this.handleEnd);
        this.mediaElement.addEventListener('durationchange', this.handleDurationchange);
        this.mediaElement.addEventListener('timeupdate', this.handleTimeupdate);
        this.mediaElement.addEventListener('volumechange', this.handleVolumeChange);
        this.mediaElement.addEventListener('seeked', this.handleSeeked);
        this.mediaElement.addEventListener('seeking', this.handleSeeking);
        this.mediaElement.addEventListener('resize', this.handleResize);

        this.mediaElement.addEventListener('waiting', this.handleWaiting);
        this.mediaElement.addEventListener('suspend', this.handleWaiting);
        // Error handle
        this.mediaElement.querySelector('source').addEventListener('error', this.onSourceError);

        document.addEventListener('fullscreenchange ', this.handleFullscreenHandler);
    }

    /**
     * Invoked when first frame of the media has finished loading.
     */
    @AutoBind
    private handleLoadstart() {
        this.logger.debug('onLoadstart');
        this.eventEmitter.emit(PlayerEventType.INIT);
    }

    /**
     * Invoked when Playback has begun.
     */
    @AutoBind
    private handlePlay() {
        this.eventEmitter.emit(PlayerEventType.PLAYING);
    }

    /**
     * Invoked when Playback has been paused.
     */
    @AutoBind
    private handlePause() {
        this.logger.debug('handlePause');
        this.eventEmitter.emit(PlayerEventType.PAUSED);
    }

    /**
     * Invoked when playback has stopped because the end of the media was reached.
     */
    @AutoBind
    private handleEnd() {
        this.logger.debug('handleEnd');
        this.eventEmitter.emit(PlayerEventType.ENDED);
    }

    /**
     * Invoked when the duration attribute has been updated.
     */
    @AutoBind
    private handleDurationchange() {
        this.logger.debug('handleDurationchange');
        this.eventEmitter.emit(PlayerEventType.DURATION_CHANGE);
    }

    /**
     * The time indicated by the currentTime attribute has been updated.
     */
    @AutoBind
    private handleTimeupdate() {
        this.logger.debug('handleTimeupdate');
        this.eventEmitter.emit(PlayerEventType.TIME_CHANGE);
    }

    /**
     * Invoked when a seek operation completed.
     */
    @AutoBind
    private handleSeeked() {
        this.logger.debug('handleSeeked');
        this.eventEmitter.emit(PlayerEventType.SEEKED);
    }

    /**
     * Invoked when a seek operation began.
     */
    @AutoBind
    private handleSeeking() {
        this.logger.debug('handleSeeking');
        this.eventEmitter.emit(PlayerEventType.SEEKING);
    }

    /**
     * Invoked when the volume has changed.
     */
    @AutoBind
    private handleVolumeChange() {
        this.logger.debug('handleVolumeChange');
        this.eventEmitter.emit(PlayerEventType.VOLUME_CHANGE);
    }


    /**
     * Invoked when the fullscreen state changed.
     */
    @AutoBind
    private handleFullscreenHandler() {
        this.logger.debug('handleFullscreenHandler');
        this.eventEmitter.emit(PlayerEventType.FULLSCREEN_STATE_CHANGE);
    }

    /**
     * Invoked when  The volume has changed.
     */
    @AutoBind
    private onSourceError() {
        this.logger.debug('onSourceError');
        this.eventEmitter.emit(PlayerEventType.ERROR);
    }

    /**
     * Invoked when  The volume has changed.
     */
    @AutoBind
    private handleWaiting() {
        this.logger.debug('handleWaiting');
    }

    /**
     * Invoked when player resized
     */
    @AutoBind
    private handleResize() {
        this.logger.debug('Player resized !');
    }

    /**
     * Return current image
     * @param scale max 1=> 100%
     */
    private getCurrentImage(scale) {
        try {
            const videoContent = this.mediaElement;
            const canvas: HTMLCanvasElement = document.createElement('canvas');
            scale = (scale) ? Math.min(1, parseFloat(scale)) : 1;
            canvas.width = videoContent.videoWidth * scale;
            canvas.height = videoContent.videoHeight * scale;
            canvas.getContext('2d').drawImage(videoContent, 0, 0, canvas.width, canvas.height);
            return canvas.toDataURL('image/png');
        } catch (error) {
            this.logger.warn('Error to create image capture', error.stack);
        }
        return null;
    }


}
