/**
 * Player event type
 */
export enum PlayerEventType {
    /**
     * Invoked when the player has initialized.
     */
    INIT = 'ina.player.INIT',
    /**
     * Invoked when the player has started with duration.
     */
    STARTED = 'ina.player.STARTED',
    /**
     * Invoked when playing event.
     */
    CAST_PLAYING = 'ina.player.CAST_PLAYING',
    /**
     * Invoked the paused/resumed
     */
    CAST_PAUSED = 'ina.player.CAST_PAUSED',
    /**
     * Invoked when playing event.
     */
    PLAYING = 'ina.player.PLAYING',
    /**
     * Invoked the paused/resumed
     */
    PAUSED = 'ina.player.PAUSED',
    /**
     * Ended event should fire when a video is completely.
     */
    ENDED = 'ina.player.ENDED',
    /**
     * Invoked when the volume level is equal to 0.
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
     * Invoked on media duration changed
     */
    DURATION_CHANGE = 'ina.player.DURATION_CHANGE',
    /**
     * Invoked on full-screen state mode change
     */
    FULLSCREEN_STATE_CHANGE = 'ina.player.FULLSCREEN_STATE_CHANGE',
    /**
     * Invoked when the user seeks.
     */
    SEEKED = 'ina.player.SEEKED',
    /**
     * Invoked when A seek operation began.
     */
    SEEKING = 'ina.player.SEEKING',

    /**
     * Invoked when data change
     */
    DATA_CHANGE = 'ina.player.DATA_CHANGE',
    /**
     * Invoked at the beginning of data change
     */
    BEGIN_DATA_CHANGE = 'ina.player.BEGIN_DATA_CHANGE',
    /**
     * Invoked end of data change
     */
    END_DATA_CHANGE = 'ina.player.END_DATA_CHANGE',
    /**
     * Invoked when image capture
     */
    IMAGE_CAPTURE = 'ina.player.IMAGE_CAPTURE',
    /**
     * Invoked when zoom range change
     */
    ZOOM_RANGE_CHANGE = 'ina.player.ZOOM_RANGE_CHANGE',
    /**
     * Invoked when selected metadata has changed
     */
    SELECTED_METADATA_CHANGE = 'ina.player.SELECTED_METADATA_CHANGE',
    /**
     * Invoked when selected item has changed
     */
    SELECTED_ITEMS_CHANGE = 'ina.player.SELECTED_ITEMS_CHANGE',
    /**
     * Invoked when metadata loaded
     */
    METADATA_LOADED = 'ina.player.METADATA_LOADED',
    /**
     * Invoked when bind metadata
     */
    BIND_METADATA = 'ina.player.BIND_METADATA',
    /**
     * Invoked when unbind metadata
     */
    UNBIND_METADATA = 'ina.player.UNBIND_METADATA',
    /**
     * Invoked when unbind metadata
     */
    PLAYBACK_RATE_CHANGE = 'ina.player.PLAYBACK_RATE_CHANGE',
    /**
     * Invoked when Stop Seeking
     */
    START_SEEKING = 'ina.player.START_SEEKING',
    /**
     * Invoked when Stop Seeking
     */
    STOP_SEEKING = 'ina.player.STOP_SEEKING',

    /**
     * Invoked when a media error has occurred.
     */
    ERROR = 'ina.player.ERROR',

    /**
     * Invoked when a plugin error has occurred.
     */
    PLUGIN_ERROR = 'ina.player.PLUGIN_ERROR',

    /**
     * Invoked when audio channel changed
     */
    AUDIO_CHANNEL_CHANGE = 'ina.player.audioChannelChange',
    /**
     * Invoked when audio channel changed
     */
    ASPECT_RATIO_CHANGE = 'ina.player.aspectRatioChange',
    /**
     * Invoked when player is hovered
     */
    PLAYER_MOUSE_ENTER = 'ina.player.PLAYER_MOUSE_ENTER',
    /**
     * Invoked mouse leave player
     */
    PLAYER_MOUSE_LEAVE = 'ina.player.PLAYER_MOUSE_LEAVE',
}
