[Amalia](../README.md) › [Globals](../globals.md) › ["src/app/core/media/media-element"](../modules/_src_app_core_media_media_element_.md) › [MediaElement](_src_app_core_media_media_element_.mediaelement.md)

# Class: MediaElement

Media element

## Hierarchy

* **MediaElement**

## Index

### Constructors

* [constructor](_src_app_core_media_media_element_.mediaelement.md#constructor)

### Events

* [isMute](_src_app_core_media_media_element_.mediaelement.md#ismute)

### Properties

* [_audioChannel](_src_app_core_media_media_element_.mediaelement.md#_audiochannel)
* [_framerate](_src_app_core_media_media_element_.mediaelement.md#private-_framerate)
* [_playbackRate](_src_app_core_media_media_element_.mediaelement.md#_playbackrate)
* [_poster](_src_app_core_media_media_element_.mediaelement.md#private-_poster)
* [_withMergeVolume](_src_app_core_media_media_element_.mediaelement.md#_withmergevolume)
* [audioContext](_src_app_core_media_media_element_.mediaelement.md#audiocontext)
* [audioContextSplitter](_src_app_core_media_media_element_.mediaelement.md#audiocontextsplitter)
* [eventEmitter](_src_app_core_media_media_element_.mediaelement.md#private-eventemitter)
* [intervalRewind](_src_app_core_media_media_element_.mediaelement.md#private-intervalrewind)
* [logger](_src_app_core_media_media_element_.mediaelement.md#private-logger)
* [mediaElement](_src_app_core_media_media_element_.mediaelement.md#private-mediaelement)
* [mse](_src_app_core_media_media_element_.mediaelement.md#mse)
* [panLeft](_src_app_core_media_media_element_.mediaelement.md#panleft)
* [panRight](_src_app_core_media_media_element_.mediaelement.md#panright)
* [reverseMode](_src_app_core_media_media_element_.mediaelement.md#reversemode)
* [volumeLeft](_src_app_core_media_media_element_.mediaelement.md#volumeleft)
* [volumeRight](_src_app_core_media_media_element_.mediaelement.md#volumeright)
* [DEFAULT_FRAMERATE](_src_app_core_media_media_element_.mediaelement.md#static-default_framerate)

### Accessors

* [audioChannel](_src_app_core_media_media_element_.mediaelement.md#audiochannel)
* [framerate](_src_app_core_media_media_element_.mediaelement.md#framerate)
* [playbackRate](_src_app_core_media_media_element_.mediaelement.md#playbackrate)
* [poster](_src_app_core_media_media_element_.mediaelement.md#poster)
* [withMergeVolume](_src_app_core_media_media_element_.mediaelement.md#withmergevolume)

### Methods

* [captureImage](_src_app_core_media_media_element_.mediaelement.md#captureimage)
* [getCurrentImage](_src_app_core_media_media_element_.mediaelement.md#private-getcurrentimage)
* [getCurrentTime](_src_app_core_media_media_element_.mediaelement.md#getcurrenttime)
* [getDuration](_src_app_core_media_media_element_.mediaelement.md#getduration)
* [getPlaybackRate](_src_app_core_media_media_element_.mediaelement.md#getplaybackrate)
* [getVolume](_src_app_core_media_media_element_.mediaelement.md#getvolume)
* [handleDurationchange](_src_app_core_media_media_element_.mediaelement.md#private-handledurationchange)
* [handleEnd](_src_app_core_media_media_element_.mediaelement.md#private-handleend)
* [handleFullscreenChange](_src_app_core_media_media_element_.mediaelement.md#private-handlefullscreenchange)
* [handleLoadstart](_src_app_core_media_media_element_.mediaelement.md#private-handleloadstart)
* [handlePause](_src_app_core_media_media_element_.mediaelement.md#private-handlepause)
* [handlePlay](_src_app_core_media_media_element_.mediaelement.md#private-handleplay)
* [handleResize](_src_app_core_media_media_element_.mediaelement.md#private-handleresize)
* [handleSeeked](_src_app_core_media_media_element_.mediaelement.md#private-handleseeked)
* [handleSeeking](_src_app_core_media_media_element_.mediaelement.md#private-handleseeking)
* [handleTimeupdate](_src_app_core_media_media_element_.mediaelement.md#private-handletimeupdate)
* [handleVolumeChange](_src_app_core_media_media_element_.mediaelement.md#private-handlevolumechange)
* [handleWaiting](_src_app_core_media_media_element_.mediaelement.md#private-handlewaiting)
* [initAudioChannelMerger](_src_app_core_media_media_element_.mediaelement.md#private-initaudiochannelmerger)
* [initLoggerState](_src_app_core_media_media_element_.mediaelement.md#initloggerstate)
* [initPlayerEvents](_src_app_core_media_media_element_.mediaelement.md#private-initplayerevents)
* [isPaused](_src_app_core_media_media_element_.mediaelement.md#ispaused)
* [moveNextFrame](_src_app_core_media_media_element_.mediaelement.md#movenextframe)
* [movePrevFrame](_src_app_core_media_media_element_.mediaelement.md#moveprevframe)
* [mute](_src_app_core_media_media_element_.mediaelement.md#mute)
* [muteUnmute](_src_app_core_media_media_element_.mediaelement.md#muteunmute)
* [pause](_src_app_core_media_media_element_.mediaelement.md#pause)
* [play](_src_app_core_media_media_element_.mediaelement.md#play)
* [playPause](_src_app_core_media_media_element_.mediaelement.md#playpause)
* [seekToBegin](_src_app_core_media_media_element_.mediaelement.md#seektobegin)
* [seekToEnd](_src_app_core_media_media_element_.mediaelement.md#seektoend)
* [setCurrentTime](_src_app_core_media_media_element_.mediaelement.md#setcurrenttime)
* [setPlaybackRate](_src_app_core_media_media_element_.mediaelement.md#private-setplaybackrate)
* [setSrc](_src_app_core_media_media_element_.mediaelement.md#setsrc)
* [setVolume](_src_app_core_media_media_element_.mediaelement.md#setvolume)
* [setupAudioNodes](_src_app_core_media_media_element_.mediaelement.md#setupaudionodes)
* [stop](_src_app_core_media_media_element_.mediaelement.md#stop)
* [unmute](_src_app_core_media_media_element_.mediaelement.md#unmute)

## Constructors

###  constructor

\+ **new MediaElement**(`mediaElement`: HTMLVideoElement, `eventEmitter`: EventEmitter): *[MediaElement](_src_app_core_media_media_element_.mediaelement.md)*

Defined in src/app/core/media/media-element.ts:46

Init media element for handle html video element

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`mediaElement` | HTMLVideoElement | html video element |
`eventEmitter` | EventEmitter | event emitter  |

**Returns:** *[MediaElement](_src_app_core_media_media_element_.mediaelement.md)*

## Events

###  isMute

• **isMute**(): *boolean*

Defined in src/app/core/media/media-element.ts:353

Return true if is mute

**`method`** isMute

**Returns:** *boolean*

## Properties

###  _audioChannel

• **_audioChannel**: *number* = 1

Defined in src/app/core/media/media-element.ts:24

Selected audio channel

___

### `Private` _framerate

• **_framerate**: *number* = 25

Defined in src/app/core/media/media-element.ts:29

Video framerate used for foreword and backward

___

###  _playbackRate

• **_playbackRate**: *number* = 1

Defined in src/app/core/media/media-element.ts:25

___

### `Private` _poster

• **_poster**: *string*

Defined in src/app/core/media/media-element.ts:33

Media poster

___

###  _withMergeVolume

• **_withMergeVolume**: *boolean* = true

Defined in src/app/core/media/media-element.ts:37

To handle merge channel state

___

###  audioContext

• **audioContext**: *AudioContext* = null

Defined in src/app/core/media/media-element.ts:38

___

###  audioContextSplitter

• **audioContextSplitter**: *any* = null

Defined in src/app/core/media/media-element.ts:39

___

### `Private` eventEmitter

• **eventEmitter**: *EventEmitter*

Defined in src/app/core/media/media-element.ts:16

___

### `Private` intervalRewind

• **intervalRewind**: *any* = null

Defined in src/app/core/media/media-element.ts:46

___

### `Private` logger

• **logger**: *[LoggerInterface](../interfaces/_src_app_core_logger_logger_interface_.loggerinterface.md)*

Defined in src/app/core/media/media-element.ts:17

___

### `Private` mediaElement

• **mediaElement**: *HTMLVideoElement*

Defined in src/app/core/media/media-element.ts:15

___

###  mse

• **mse**: *[MediaSourceExtension](../interfaces/_src_app_core_mse_media_source_extension_.mediasourceextension.md)*

Defined in src/app/core/media/media-element.ts:18

___

###  panLeft

• **panLeft**: *GainNode* = null

Defined in src/app/core/media/media-element.ts:40

___

###  panRight

• **panRight**: *GainNode* = null

Defined in src/app/core/media/media-element.ts:41

___

###  reverseMode

• **reverseMode**: *boolean* = false

Defined in src/app/core/media/media-element.ts:45

play a video backwards

___

###  volumeLeft

• **volumeLeft**: *number*

Defined in src/app/core/media/media-element.ts:19

___

###  volumeRight

• **volumeRight**: *number*

Defined in src/app/core/media/media-element.ts:20

___

### `Static` DEFAULT_FRAMERATE

▪ **DEFAULT_FRAMERATE**: *number* = 25

Defined in src/app/core/media/media-element.ts:14

## Accessors

###  audioChannel

• **get audioChannel**(): *number*

Defined in src/app/core/media/media-element.ts:70

**Returns:** *number*

• **set audioChannel**(`value`: number): *void*

Defined in src/app/core/media/media-element.ts:74

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*

___

###  framerate

• **get framerate**(): *number*

Defined in src/app/core/media/media-element.ts:93

**Returns:** *number*

• **set framerate**(`value`: number): *void*

Defined in src/app/core/media/media-element.ts:97

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*

___

###  playbackRate

• **set playbackRate**(`value`: number): *void*

Defined in src/app/core/media/media-element.ts:79

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*

___

###  poster

• **get poster**(): *string*

Defined in src/app/core/media/media-element.ts:101

**Returns:** *string*

• **set poster**(`value`: string): *void*

Defined in src/app/core/media/media-element.ts:105

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *void*

___

###  withMergeVolume

• **get withMergeVolume**(): *boolean*

Defined in src/app/core/media/media-element.ts:85

**Returns:** *boolean*

• **set withMergeVolume**(`value`: boolean): *void*

Defined in src/app/core/media/media-element.ts:89

**Parameters:**

Name | Type |
------ | ------ |
`value` | boolean |

**Returns:** *void*

## Methods

###  captureImage

▸ **captureImage**(`scale`: number): *string*

Defined in src/app/core/media/media-element.ts:372

In charge to capture image

**Parameters:**

Name | Type |
------ | ------ |
`scale` | number |

**Returns:** *string*

image base 64

___

### `Private` getCurrentImage

▸ **getCurrentImage**(`scale`: any): *string*

Defined in src/app/core/media/media-element.ts:526

Return current image

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`scale` | any | max 1=> 100%  |

**Returns:** *string*

___

###  getCurrentTime

▸ **getCurrentTime**(): *number*

Defined in src/app/core/media/media-element.ts:227

Return current position in seconds

**Returns:** *number*

___

###  getDuration

▸ **getDuration**(): *number*

Defined in src/app/core/media/media-element.ts:327

Return media duration with tc offset

**Returns:** *number*

return duration

___

###  getPlaybackRate

▸ **getPlaybackRate**(): *number | null*

Defined in src/app/core/media/media-element.ts:245

Return playback rate

**Returns:** *number | null*

the current playback speed of the audio/video.

___

###  getVolume

▸ **getVolume**(`side?`: "r" | "l"): *number*

Defined in src/app/core/media/media-element.ts:173

Returns the player's current volume, an integer between 0 and 100. Note that getVolume()
will return the volume even if the player is muted.

**Parameters:**

Name | Type |
------ | ------ |
`side?` | "r" &#124; "l" |

**Returns:** *number*

___

### `Private` handleDurationchange

▸ **handleDurationchange**(): *void*

Defined in src/app/core/media/media-element.ts:453

Invoked when the duration attribute has been updated.

**Returns:** *void*

___

### `Private` handleEnd

▸ **handleEnd**(): *void*

Defined in src/app/core/media/media-element.ts:444

Invoked when playback has stopped because the end of the media was reached.

**Returns:** *void*

___

### `Private` handleFullscreenChange

▸ **handleFullscreenChange**(): *void*

Defined in src/app/core/media/media-element.ts:499

Invoked when the fullscreen state changed.

**Returns:** *void*

___

### `Private` handleLoadstart

▸ **handleLoadstart**(): *void*

Defined in src/app/core/media/media-element.ts:415

Invoked when first frame of the media has finished loading.

**Returns:** *void*

___

### `Private` handlePause

▸ **handlePause**(): *void*

Defined in src/app/core/media/media-element.ts:434

Invoked when Playback has been paused.

**Returns:** *void*

___

### `Private` handlePlay

▸ **handlePlay**(): *void*

Defined in src/app/core/media/media-element.ts:426

Invoked when Playback has begun.

**Returns:** *void*

___

### `Private` handleResize

▸ **handleResize**(): *void*

Defined in src/app/core/media/media-element.ts:517

Invoked when player resized

**Returns:** *void*

___

### `Private` handleSeeked

▸ **handleSeeked**(): *void*

Defined in src/app/core/media/media-element.ts:471

Invoked when a seek operation completed.

**Returns:** *void*

___

### `Private` handleSeeking

▸ **handleSeeking**(): *void*

Defined in src/app/core/media/media-element.ts:480

Invoked when a seek operation began.

**Returns:** *void*

___

### `Private` handleTimeupdate

▸ **handleTimeupdate**(): *void*

Defined in src/app/core/media/media-element.ts:462

The time indicated by the currentTime attribute has been updated.

**Returns:** *void*

___

### `Private` handleVolumeChange

▸ **handleVolumeChange**(): *void*

Defined in src/app/core/media/media-element.ts:489

Invoked when the volume has changed.

**Returns:** *void*

___

### `Private` handleWaiting

▸ **handleWaiting**(): *void*

Defined in src/app/core/media/media-element.ts:509

Invoked when  The volume has changed.

**Returns:** *void*

___

### `Private` initAudioChannelMerger

▸ **initAudioChannelMerger**(): *void*

Defined in src/app/core/media/media-element.ts:544

In charge to init audio chanel merger

**Returns:** *void*

___

###  initLoggerState

▸ **initLoggerState**(`logEnable`: boolean, `logLevel`: string): *void*

Defined in src/app/core/media/media-element.ts:64

Init log level

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`logEnable` | boolean | true for enable log |
`logLevel` | string | log level  |

**Returns:** *void*

___

### `Private` initPlayerEvents

▸ **initPlayerEvents**(): *void*

Defined in src/app/core/media/media-element.ts:394

In charge to init player events

**Returns:** *void*

___

###  isPaused

▸ **isPaused**(): *boolean*

Defined in src/app/core/media/media-element.ts:301

Return true if media is paused

**Returns:** *boolean*

boolean true is paused

___

###  moveNextFrame

▸ **moveNextFrame**(`nbFrames`: number): *void*

Defined in src/app/core/media/media-element.ts:309

In charge to move next number of frame

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`nbFrames` | number | 1 | number of frame  |

**Returns:** *void*

___

###  movePrevFrame

▸ **movePrevFrame**(`nbFrames`: number): *void*

Defined in src/app/core/media/media-element.ts:318

In charge to move prev number of frame

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`nbFrames` | number | 1 | number of frame  |

**Returns:** *void*

___

###  mute

▸ **mute**(): *void*

Defined in src/app/core/media/media-element.ts:137

Invoked to set mute state

**Returns:** *void*

___

###  muteUnmute

▸ **muteUnmute**(): *void*

Defined in src/app/core/media/media-element.ts:360

Return player instance

**Returns:** *void*

___

###  pause

▸ **pause**(): *void*

Defined in src/app/core/media/media-element.ts:122

Invoked for paused player

**Returns:** *void*

___

###  play

▸ **play**(): *Promise‹void›*

Defined in src/app/core/media/media-element.ts:109

**Returns:** *Promise‹void›*

___

###  playPause

▸ **playPause**(): *void*

Defined in src/app/core/media/media-element.ts:383

Play if paused, if paused play

**Returns:** *void*

___

###  seekToBegin

▸ **seekToBegin**(): *void*

Defined in src/app/core/media/media-element.ts:336

Set current time to the beginning of the file

**`method`** seekToBegin

**Returns:** *void*

number current time

___

###  seekToEnd

▸ **seekToEnd**(): *void*

Defined in src/app/core/media/media-element.ts:344

Set current time to the end of the file

**Returns:** *void*

number current time

___

###  setCurrentTime

▸ **setCurrentTime**(`value`: number): *void*

Defined in src/app/core/media/media-element.ts:234

Set seek position in seconds

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*

___

### `Private` setPlaybackRate

▸ **setPlaybackRate**(`speed`: number): *void*

Defined in src/app/core/media/media-element.ts:254

Set playback rate

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`speed` | number | the current playback speed of the audio/video. |

**Returns:** *void*

the current playback speed of the audio/video.

___

###  setSrc

▸ **setSrc**(`config`: [PlayerConfigData](../interfaces/_src_app_core_config_model_player_config_data_.playerconfigdata.md)): *void*

Defined in src/app/core/media/media-element.ts:152

Invoked to set media source and autoplay, by default

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`config` | [PlayerConfigData](../interfaces/_src_app_core_config_model_player_config_data_.playerconfigdata.md) | PlayerConfigData  |

**Returns:** *void*

___

###  setVolume

▸ **setVolume**(`volumePercent`: number, `volumeSide?`: string): *void*

Defined in src/app/core/media/media-element.ts:184

Sets the volume. Accepts an integer between 0 and 100.

**Parameters:**

Name | Type |
------ | ------ |
`volumePercent` | number |
`volumeSide?` | string |

**Returns:** *void*

___

###  setupAudioNodes

▸ **setupAudioNodes**(`data`: any): *void*

Defined in src/app/core/media/media-element.ts:563

Set Audio Nodes

**Parameters:**

Name | Type |
------ | ------ |
`data` | any |

**Returns:** *void*

___

###  stop

▸ **stop**(): *void*

Defined in src/app/core/media/media-element.ts:129

**Returns:** *void*

___

###  unmute

▸ **unmute**(): *void*

Defined in src/app/core/media/media-element.ts:144

Invoked to set unmute state

**Returns:** *void*
