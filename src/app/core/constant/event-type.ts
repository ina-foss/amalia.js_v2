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
     * invoked to force storyboard
     *
     */
    STORYBOARD = 'ina.player.STORYBOARD',
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
     * Invoked when a previous Erroneous situation no longer exists
     */
    ERASE_ERROR = 'ina.player.ERASE_ERROR',

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
    /**
     * Invoked when user change position of subtitles
     */
    POSITION_SUBTITLE_CHANGE = 'ina.player.POSITION_SUBTITLE_CHANGE',
    /**
     * Invoked when window is resized
     */
    PLAYER_RESIZED = 'ina.player.PLAYER_RESIZED',
    /**
     * Invocked when click on pin controlbar
     */
    PINNED_CONTROLBAR_CHANGE = 'ina.player.PINNED_CONTROLBAR_CHANGE',
    /**
     * Invocked when click on pin controlbar and slider is active
     */
    PINNED_SLIDER_CHANGE = 'ina.player.PINNED_SLIDER_CHANGE',
    /**
     * Invocked when click on pin controlbar
     */
    CONTROL_BAR_TOGGLED = 'ina.player.CONTROL_BAR_TOGGLED',
    /**
     * Invocked on keydown when the mouse is over the player
     */
    KEYDOWN = 'ina.player.KEYDOWN',
    /**
     * Invocked on keydown when the mouse is over histogram
     */
    KEYDOWN_HISTOGRAM = 'ina.player.KEYDOWN_HISTOGRAM',
    /**
     * Invocked on keydup when the mouse is over histogram
     */
    KEYUP_HISTOGRAM = 'ina.player.KEYUP_HISTOGRAM',
    /**
     * Invocked on click outside the player
     */
    DOCUMENT_CLICK = 'ina.player.DOCUMENT_CLICK',
    /**
     * Invocked to scroll images when changing playbackrate
     */
    PLAYBACK_RATE_IMAGES_CHANGE = 'ina.player.PLAYBACK_RATE_IMAGES_CHANGE',
    /**
     * Invocked to clear interval
     */
    PLAYBACK_CLEAR_INTERVAL = 'ina.player.PLAYBACK_CLEAR_INTERVAL',
    /**
     * Loading begin
     */
    PLAYER_LOADING_BEGIN = 'ina.player.PLAYER_LOADING_BEGIN',
    /**
     * Loading END
     */
    PLAYER_LOADING_END = 'ina.player.PLAYER_LOADING_BEGIN_END',
    /**
     * Simulate slider controlbar timeline
     */
    PLAYER_SIMULATE_SLIDER = 'ina.player.SIMULATE_SLIDER',
    /**
     * Simulate Play
     */
    PLAYER_SIMULATE_PLAY = 'ina.player.SIMULATE_PLAY',
    /**
     * STOP Simulate Play
     */
    PLAYER_STOP_SIMULATE_PLAY = 'ina.player.STOP_SIMULATE_PLAY',
    /**
     * COPY text
     */
    PLAYER_COPY_BOARD = 'ina.player.COPY_BOARD',
    /**
     * Add Annotation
     */
    ANNOTATION_ADD = 'ina.annotation.ADD',
    /**
     * Update Annotation
     */
    ANNOTATION_UPDATE = 'ina.annotation.PATCH',
    /**
     * Remove Annotation
     */
    ANNOTATION_REMOVE = 'ina.annotation.REMOVE',
    /**
     * Annotation en cours d'édition
     */
    ANNOTATION_EDITING = 'ina.annotation.EDITING',
    /**
     * Annotation édition annulée
     */
    ANNOTATION_CANCEL_EDITING = 'ina.annotation.EDITING.CANCELED',
    /**
     * An html element event
     */
    ANNOTATION_PLAY = 'ina.annotation.PLAY',

    HTML_ELEMENT_MOUSE_DOWN = 'mousedown',
    HTML_ELEMENT_MOUSE_UP = 'mouseup',
    HTML_ELEMENT_MOUSE_MOVE = 'mousemove',
    HTML_ELEMENT_WHEEL = 'wheel',
    ELEMENT_CONTEXT_MENU = 'contextmenu',
    ELEMENT_CLICK = 'click',
    ELEMENT_LOADSTART = 'loadstart',
    ELEMENT_PLAYING = 'playing',
    ELEMENT_PAUSE = 'pause',
    ELEMENT_ENDED = 'ended',
    ELEMENT_DURATIONCHANGE = 'durationchange',
    ELEMENT_TIMEUPDATE = 'timeupdate',
    ELEMENT_VOLUMECHANGE = 'volumechange',
    ELEMENT_SEEKED = 'seeked',
    ELEMENT_RESIZE = 'resize',
    ELEMENT_RESIZEEND = 'resizeend',
    ELEMENT_WAITING = 'waiting',
    ELEMENT_SUSPEND = 'suspend',
    ELEMENT_FULLSCREENCHANGE = 'fullscreenchange',
    ELEMENT_KEYDOWN = 'keydown',
    ELEMENT_KEYUP = 'keyup',
    ELEMENT_FOCUSIN = "focusin",
    ELEMENT_FOCUSOUT = "focusout",
    SHORTCUT_KEYDOWN = "SHORTCUT_KEYDOWN",
    SHORTCUT_MUTE = "SHORTCUT_MUTE",
    SHORTCUT_UNMUTE = "SHORTCUT_UNMUTE",
    /**
     * get the current time
     */
    NS_EVENT_CONTRIBUTION_JURIDIQUE_GET_CURRENT_TIME = 'ina.CONTRIBUTION_JURIDIQUE_GET_CURRENT_TIME',
    NS_EVENT_CONTRIBUTION_JURIDIQUE_ASK_FOR_CURRENT_TIME = 'ina.CONTRIBUTION_JURIDIQUE_ASK_FOR_CURRENT_TIME',
    NS_EVENT_CONTRIBUTION_JURIDIQUE_ASK_FOR_DURATION = 'ina.CONTRIBUTION_JURIDIQUE_ASK_FOR_DURATION',
    NS_EVENT_CONTRIBUTION_JURIDIQUE_SET_CURRENT_TIME = 'ina.CONTRIBUTION_JURIDIQUE_SET_CURRENT_TIME',
    NS_EVENT_CONTRIBUTION_JURIDIQUE_GET_DURATION = 'ina.CONTRIBUTION_JURIDIQUE_GET_DURATION',

    /**
     * Export tv days
     */
    TIMELINE_EXPORT_TV_DAYS = 'ina.TIMELINE_EXPORT_TV_DAYS',
    /**
     * Annotations linked to a material with an idDocument
     */
    OPEN_NOTILUS_MATERIAL = "ina.OPEN_NOTILUS_MATERIAL",
}
