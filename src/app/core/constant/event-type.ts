/**
 * Player event type
 */
export enum PlayerEventType {
    /**
     * Fired when the player has initialized.
     */
    INIT = 'ina.player.INIT',
    /**
     * Fired when the player has started with duration.
     */
    STARTED = 'ina.player.STARTED',
    /**
     * Fires when playing event.
     */
    CAST_PLAYING = 'ina.player.CAST_PLAYING',
    /**
     * Fires the paused/resumed
     */
    CAST_PAUSED = 'ina.player.CAST_PAUSED',
    /**
     * Fires when playing event.
     */
    PLAYING = 'ina.player.PLAYING',
    /**
     * Fires the paused/resumed
     */
    PAUSED = 'ina.player.PAUSED',
    /**
     * Ended event should fire when a video is completely.
     */
    ENDED = 'ina.player.ENDED',
    /**
     * This fires when the volume level is equal to 0.
     */
    MUTE = 'ina.player.MUTE',
    /**
     * This fires when the volume level is equal to 0.
     */
    UN_MUTE = 'ina.player.UN_MUTE',
    /**
     * This fires when the volume level is changed.
     */
    VOLUME_CHANGE = 'ina.player.VOLUME_CHANGE',
    /**
     * This fires when the time change with attributes : 'obj' : instance of
     * player 'currentTime' : player currentTime 'duration' : media duration
     * 'percent'
     */
    TIME_CHANGE = 'ina.player.TIME_CHANGE',
    /**
     * This fires when full-screen mode change
     */
    FULLSCREEN_CHANGE = 'ina.player.FULLSCREEN_CHANGES',
    /**
     * Fired when the user seeks.
     */
    SEEK = 'ina.player.SEEK',
    /**
     * Fired when a media error has occurred.
     */
    ERROR = 'ina.player.ERROR',

    /**
     * Fired when a plugin error has occurred.
     */
    PLUGIN_ERROR = 'ina.player.PLUGIN_ERROR',
    /**
     * Fired when data change
     */
    DATA_CHANGE = 'ina.player.DATA_CHANGE',
    /**
     * Fired at the beginning of data change
     */
    BEGIN_DATA_CHANGE = 'ina.player.BEGIN_DATA_CHANGE',
    /**
     * Fired end of data change
     */
    END_DATA_CHANGE = 'ina.player.END_DATA_CHANGE',
    /**
     * Fired when image capture
     */
    IMAGE_CAPTURE = 'ina.player.IMAGE_CAPTURE',
    /**
     * Fired when zoom range change
     */
    ZOOM_RANGE_CHANGE = 'ina.player.ZOOM_RANGE_CHANGE',
    /**
     * Fired when selected metadata has changed
     */
    SELECTED_METADATA_CHANGE = 'ina.player.SELECTED_METADATA_CHANGE',
    /**
     * Fired when selected item has changed
     */
    SELECTED_ITEMS_CHANGE = 'ina.player.SELECTED_ITEMS_CHANGE',
    /**
     * Fired when bind metadata
     */
    BIND_METADATA = 'ina.player.BIND_METADATA',
    /**
     * Fired when unbind metadata
     */
    UNBIND_METADATA = 'ina.player.UNBIND_METADATA',
    /**
     * Fired when unbind metadata
     */
    PLAYBACK_RATE_CHANGE = 'ina.player.PLAYBACK_RATE_CHANGE',
    /**
     * Fired when Stop Seeking
     */
    START_SEEKING = 'ina.player.START_SEEKING',
    /**
     * Fired when Stop Seeking
     */
    STOP_SEEKING = 'ina.player.STOP_SEEKING',
    /**
     * Fired when seeking
     */
    SEEKING = 'ina.player.SEEKING',
}
