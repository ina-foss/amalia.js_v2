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

* [_audioChannel](_src_app_core_media_media_element_.mediaelement.md#private-_audiochannel)
* [_framerate](_src_app_core_media_media_element_.mediaelement.md#private-_framerate)
* [_playbackRate](_src_app_core_media_media_element_.mediaelement.md#private-_playbackrate)
* [_poster](_src_app_core_media_media_element_.mediaelement.md#private-_poster)
* [_withMergeVolume](_src_app_core_media_media_element_.mediaelement.md#private-_withmergevolume)
* [audioContext](_src_app_core_media_media_element_.mediaelement.md#audiocontext)
* [audioContextSplitter](_src_app_core_media_media_element_.mediaelement.md#audiocontextsplitter)
* [eventEmitter](_src_app_core_media_media_element_.mediaelement.md#private-eventemitter)
* [intervalRewind](_src_app_core_media_media_element_.mediaelement.md#private-intervalrewind)
* [logger](_src_app_core_media_media_element_.mediaelement.md#private-logger)
* [mediaElement](_src_app_core_media_media_element_.mediaelement.md#private-mediaelement)
* [mse](_src_app_core_media_media_element_.mediaelement.md#private-mse)
* [panLeft](_src_app_core_media_media_element_.mediaelement.md#panleft)
* [panRight](_src_app_core_media_media_element_.mediaelement.md#panright)
* [reverseMode](_src_app_core_media_media_element_.mediaelement.md#private-reversemode)
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

Defined in src/app/core/media/media-element.ts:48

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

Defined in src/app/core/media/media-element.ts:349

Return true if is mute

**`method`** isMute

**Returns:** *boolean*

## Properties

### `Private` _audioChannel

• **_audioChannel**: *number* = 1

Defined in src/app/core/media/media-element.ts:26

Selected audio channel

___

### `Private` _framerate

• **_framerate**: *number* = 25

Defined in src/app/core/media/media-element.ts:31

Video framerate used for foreword and backward

___

### `Private` _playbackRate

• **_playbackRate**: *number* = 1

Defined in src/app/core/media/media-element.ts:27

___

### `Private` _poster

• **_poster**: *string*

Defined in src/app/core/media/media-element.ts:35

Media poster

___

### `Private` _withMergeVolume

• **_withMergeVolume**: *boolean* = true

Defined in src/app/core/media/media-element.ts:39

To handle merge channel state

___

###  audioContext

• **audioContext**: *AudioContext* = null

Defined in src/app/core/media/media-element.ts:40

___

###  audioContextSplitter

• **audioContextSplitter**: *any* = null

Defined in src/app/core/media/media-element.ts:41

___

### `Private` eventEmitter

• **eventEmitter**: *EventEmitter*

Defined in src/app/core/media/media-element.ts:18

___

### `Private` intervalRewind

• **intervalRewind**: *any* = null

Defined in src/app/core/media/media-element.ts:48

___

### `Private` logger

• **logger**: *[LoggerInterface](../interfaces/_src_app_core_logger_logger_interface_.loggerinterface.md)*

Defined in src/app/core/media/media-element.ts:19

___

### `Private` mediaElement

• **mediaElement**: *HTMLVideoElement*

Defined in src/app/core/media/media-element.ts:17

___

### `Private` mse

• **mse**: *[MediaSourceExtension](../interfaces/_src_app_core_mse_media_source_extension_.mediasourceextension.md)*

Defined in src/app/core/media/media-element.ts:20

___

###  panLeft

• **panLeft**: *GainNode* = null

Defined in src/app/core/media/media-element.ts:42

___

###  panRight

• **panRight**: *GainNode* = null

Defined in src/app/core/media/media-element.ts:43

___

### `Private` reverseMode

• **reverseMode**: *boolean* = false

Defined in src/app/core/media/media-element.ts:47

play a video backwards

___

###  volumeLeft

• **volumeLeft**: *number*

Defined in src/app/core/media/media-element.ts:21

___

###  volumeRight

• **volumeRight**: *number*

Defined in src/app/core/media/media-element.ts:22

___

### `Static` DEFAULT_FRAMERATE

▪ **DEFAULT_FRAMERATE**: *number* = 25

Defined in src/app/core/media/media-element.ts:16

## Accessors

###  audioChannel

• **get audioChannel**(): *number*

Defined in src/app/core/media/media-element.ts:72

**Returns:** *number*

• **set audioChannel**(`value`: number): *void*

Defined in src/app/core/media/media-element.ts:76

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*

___

###  framerate

• **get framerate**(): *number*

Defined in src/app/core/media/media-element.ts:95

**Returns:** *number*

• **set framerate**(`value`: number): *void*

Defined in src/app/core/media/media-element.ts:99

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*

___

###  playbackRate

• **set playbackRate**(`value`: number): *void*

Defined in src/app/core/media/media-element.ts:81

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*

___

###  poster

• **get poster**(): *string*

Defined in src/app/core/media/media-element.ts:103

**Returns:** *string*

• **set poster**(`value`: string): *void*

Defined in src/app/core/media/media-element.ts:107

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *void*

___

###  withMergeVolume

• **get withMergeVolume**(): *boolean*

Defined in src/app/core/media/media-element.ts:87

**Returns:** *boolean*

• **set withMergeVolume**(`value`: boolean): *void*

Defined in src/app/core/media/media-element.ts:91

**Parameters:**

Name | Type |
------ | ------ |
`value` | boolean |

**Returns:** *void*

## Methods

###  captureImage

▸ **captureImage**(`scale`: number): *string*

Defined in src/app/core/media/media-element.ts:368

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

Defined in src/app/core/media/media-element.ts:520

Return current image

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`scale` | any | max 1=> 100%  |

**Returns:** *string*

___

###  getCurrentTime

▸ **getCurrentTime**(): *number*

Defined in src/app/core/media/media-element.ts:224

Return current position in seconds

**Returns:** *number*

___

###  getDuration

▸ **getDuration**(): *number*

Defined in src/app/core/media/media-element.ts:323

Return media duration with tc offset

**Returns:** *number*

return duration

___

###  getPlaybackRate

▸ **getPlaybackRate**(): *number | null*

Defined in src/app/core/media/media-element.ts:242

Return playback rate

**Returns:** *number | null*

the current playback speed of the audio/video.

___

###  getVolume

▸ **getVolume**(`side?`: "r" | "l"): *number*

Defined in src/app/core/media/media-element.ts:176

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

Defined in src/app/core/media/media-element.ts:447

Invoked when the duration attribute has been updated.

**Returns:** *void*

___

### `Private` handleEnd

▸ **handleEnd**(): *void*

Defined in src/app/core/media/media-element.ts:438

Invoked when playback has stopped because the end of the media was reached.

**Returns:** *void*

___

### `Private` handleFullscreenChange

▸ **handleFullscreenChange**(): *void*

Defined in src/app/core/media/media-element.ts:493

Invoked when the fullscreen state changed.

**Returns:** *void*

___

### `Private` handleLoadstart

▸ **handleLoadstart**(): *void*

Defined in src/app/core/media/media-element.ts:410

Invoked when first frame of the media has finished loading.

**Returns:** *void*

___

### `Private` handlePause

▸ **handlePause**(): *void*

Defined in src/app/core/media/media-element.ts:428

Invoked when Playback has been paused.

**Returns:** *void*

___

### `Private` handlePlay

▸ **handlePlay**(): *void*

Defined in src/app/core/media/media-element.ts:420

Invoked when Playback has begun.

**Returns:** *void*

___

### `Private` handleResize

▸ **handleResize**(): *void*

Defined in src/app/core/media/media-element.ts:511

Invoked when player resized

**Returns:** *void*

___

### `Private` handleSeeked

▸ **handleSeeked**(): *void*

Defined in src/app/core/media/media-element.ts:465

Invoked when a seek operation completed.

**Returns:** *void*

___

### `Private` handleSeeking

▸ **handleSeeking**(): *void*

Defined in src/app/core/media/media-element.ts:474

Invoked when a seek operation began.

**Returns:** *void*

___

### `Private` handleTimeupdate

▸ **handleTimeupdate**(): *void*

Defined in src/app/core/media/media-element.ts:456

The time indicated by the currentTime attribute has been updated.

**Returns:** *void*

___

### `Private` handleVolumeChange

▸ **handleVolumeChange**(): *void*

Defined in src/app/core/media/media-element.ts:483

Invoked when the volume has changed.

**Returns:** *void*

___

### `Private` handleWaiting

▸ **handleWaiting**(): *void*

Defined in src/app/core/media/media-element.ts:503

Invoked when  The volume has changed.

**Returns:** *void*

___

### `Private` initAudioChannelMerger

▸ **initAudioChannelMerger**(): *void*

Defined in src/app/core/media/media-element.ts:538

In charge to init audio chanel merger

**Returns:** *void*

___

###  initLoggerState

▸ **initLoggerState**(`logEnable`: boolean, `logLevel`: string): *void*

Defined in src/app/core/media/media-element.ts:66

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

Defined in src/app/core/media/media-element.ts:390

In charge to init player events

**Returns:** *void*

___

###  isPaused

▸ **isPaused**(): *boolean*

Defined in src/app/core/media/media-element.ts:297

Return true if media is paused

**Returns:** *boolean*

boolean true is paused

___

###  moveNextFrame

▸ **moveNextFrame**(`nbFrames`: number): *void*

Defined in src/app/core/media/media-element.ts:305

In charge to move next number of frame

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`nbFrames` | number | 1 | number of frame  |

**Returns:** *void*

___

###  movePrevFrame

▸ **movePrevFrame**(`nbFrames`: number): *void*

Defined in src/app/core/media/media-element.ts:314

In charge to move prev number of frame

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`nbFrames` | number | 1 | number of frame  |

**Returns:** *void*

___

###  mute

▸ **mute**(): *void*

Defined in src/app/core/media/media-element.ts:139

Invoked to set mute state

**Returns:** *void*

___

###  muteUnmute

▸ **muteUnmute**(): *void*

Defined in src/app/core/media/media-element.ts:356

Return player instance

**Returns:** *void*

___

###  pause

▸ **pause**(): *void*

Defined in src/app/core/media/media-element.ts:124

Invoked for paused player

**Returns:** *void*

___

###  play

▸ **play**(): *Promise‹void›*

Defined in src/app/core/media/media-element.ts:111

**Returns:** *Promise‹void›*

___

###  playPause

▸ **playPause**(): *void*

Defined in src/app/core/media/media-element.ts:379

Play if paused, if paused play

**Returns:** *void*

___

###  seekToBegin

▸ **seekToBegin**(): *void*

Defined in src/app/core/media/media-element.ts:332

Set current time to the beginning of the file

**`method`** seekToBegin

**Returns:** *void*

number current time

___

###  seekToEnd

▸ **seekToEnd**(): *void*

Defined in src/app/core/media/media-element.ts:340

Set current time to the end of the file

**Returns:** *void*

number current time

___

###  setCurrentTime

▸ **setCurrentTime**(`value`: number): *void*

Defined in src/app/core/media/media-element.ts:231

Set seek position in seconds

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*

___

### `Private` setPlaybackRate

▸ **setPlaybackRate**(`speed`: number): *void*

Defined in src/app/core/media/media-element.ts:251

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

Defined in src/app/core/media/media-element.ts:154

Invoked to set media source and autoplay, by default

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`config` | [PlayerConfigData](../interfaces/_src_app_core_config_model_player_config_data_.playerconfigdata.md) | PlayerConfigData  |

**Returns:** *void*

___

###  setVolume

▸ **setVolume**(`volumePercent`: number, `volumeSide?`: string): *void*

Defined in src/app/core/media/media-element.ts:187

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

Defined in src/app/core/media/media-element.ts:559

Set Audio Nodes

**Parameters:**

Name | Type |
------ | ------ |
`data` | any |

**Returns:** *void*

___

###  stop

▸ **stop**(): *void*

Defined in src/app/core/media/media-element.ts:131

**Returns:** *void*

___

###  unmute

▸ **unmute**(): *void*

Defined in src/app/core/media/media-element.ts:146

Invoked to set unmute state

**Returns:** *void*
