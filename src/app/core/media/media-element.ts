/**
 * Media element
 */
export class MediaElement {
    private readonly mediaElement: HTMLMediaElement;

    constructor(mediaElement: HTMLMediaElement) {
        this.mediaElement = mediaElement;
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
     */
    setSrc(src: string | MediaStream | MediaSource | Blob | null) {
        if (typeof src === 'string') {
            this.mediaElement.src = src;
        } else {
            // Todo HSL
            // this.mediaPlayer.srcObject = this.configurationManager.getCoreConfig().player.src.getSrc();
        }
    }

    /**
     * Returns the player's current volume, an integer between 0 and 100. Note that getVolume()
     * will return the volume even if the player is muted.
     */
    getVolume(): number {
        return this.mediaElement ? this.mediaElement.volume * 100 : 0;
    }

    /**
     * Sets the volume. Accepts an integer between 0 and 100.
     */
    setVolume(volume: number): void {
        if (this.mediaElement) {
            this.mediaElement.volume = volume / 100;
        }
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
     */
    captureImage() {

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
}
