[Amalia](../README.md) › [Globals](../globals.md) › ["app/core/media/media-element"](../modules/_app_core_media_media_element_.md) › [MediaElement](_app_core_media_media_element_.mediaelement.md)

# Class: MediaElement

Media element

## Hierarchy

* **MediaElement**

## Index

### Constructors

* [constructor](_app_core_media_media_element_.mediaelement.md#constructor)

### Events

* [isMute](_app_core_media_media_element_.mediaelement.md#ismute)

### Properties

* [_audioChannel](_app_core_media_media_element_.mediaelement.md#private-_audiochannel)
* [_framerate](_app_core_media_media_element_.mediaelement.md#private-_framerate)
* [_playbackRate](_app_core_media_media_element_.mediaelement.md#private-_playbackrate)
* [_poster](_app_core_media_media_element_.mediaelement.md#private-_poster)
* [_withMergeVolume](_app_core_media_media_element_.mediaelement.md#private-_withmergevolume)
* [audioContext](_app_core_media_media_element_.mediaelement.md#audiocontext)
* [eventEmitter](_app_core_media_media_element_.mediaelement.md#private-eventemitter)
* [intervalRewind](_app_core_media_media_element_.mediaelement.md#private-intervalrewind)
* [logger](_app_core_media_media_element_.mediaelement.md#private-logger)
* [mediaElement](_app_core_media_media_element_.mediaelement.md#private-mediaelement)
* [mse](_app_core_media_media_element_.mediaelement.md#private-mse)
* [panLeft](_app_core_media_media_element_.mediaelement.md#panleft)
* [panRight](_app_core_media_media_element_.mediaelement.md#panright)
* [reverseMode](_app_core_media_media_element_.mediaelement.md#private-reversemode)
* [volumeLeft](_app_core_media_media_element_.mediaelement.md#private-volumeleft)
* [volumeRight](_app_core_media_media_element_.mediaelement.md#private-volumeright)
* [DEFAULT_FRAMERATE](_app_core_media_media_element_.mediaelement.md#static-default_framerate)

### Accessors

* [audioChannel](_app_core_media_media_element_.mediaelement.md#audiochannel)
* [framerate](_app_core_media_media_element_.mediaelement.md#framerate)
* [playbackRate](_app_core_media_media_element_.mediaelement.md#playbackrate)
* [poster](_app_core_media_media_element_.mediaelement.md#poster)
* [withMergeVolume](_app_core_media_media_element_.mediaelement.md#withmergevolume)

### Methods

* [captureImage](_app_core_media_media_element_.mediaelement.md#captureimage)
* [getCurrentImage](_app_core_media_media_element_.mediaelement.md#private-getcurrentimage)
* [getCurrentTime](_app_core_media_media_element_.mediaelement.md#getcurrenttime)
* [getDuration](_app_core_media_media_element_.mediaelement.md#getduration)
* [getPlaybackRate](_app_core_media_media_element_.mediaelement.md#getplaybackrate)
* [getVolume](_app_core_media_media_element_.mediaelement.md#getvolume)
* [handleDurationchange](_app_core_media_media_element_.mediaelement.md#private-handledurationchange)
* [handleEnd](_app_core_media_media_element_.mediaelement.md#private-handleend)
* [handleFullscreenHandler](_app_core_media_media_element_.mediaelement.md#private-handlefullscreenhandler)
* [handleLoadstart](_app_core_media_media_element_.mediaelement.md#private-handleloadstart)
* [handlePause](_app_core_media_media_element_.mediaelement.md#private-handlepause)
* [handlePlay](_app_core_media_media_element_.mediaelement.md#private-handleplay)
* [handleResize](_app_core_media_media_element_.mediaelement.md#private-handleresize)
* [handleSeeked](_app_core_media_media_element_.mediaelement.md#private-handleseeked)
* [handleSeeking](_app_core_media_media_element_.mediaelement.md#private-handleseeking)
* [handleTimeupdate](_app_core_media_media_element_.mediaelement.md#private-handletimeupdate)
* [handleVolumeChange](_app_core_media_media_element_.mediaelement.md#private-handlevolumechange)
* [handleWaiting](_app_core_media_media_element_.mediaelement.md#private-handlewaiting)
* [initPlayerEvents](_app_core_media_media_element_.mediaelement.md#private-initplayerevents)
* [isPaused](_app_core_media_media_element_.mediaelement.md#ispaused)
* [moveNextFrame](_app_core_media_media_element_.mediaelement.md#movenextframe)
* [movePrevFrame](_app_core_media_media_element_.mediaelement.md#moveprevframe)
* [mute](_app_core_media_media_element_.mediaelement.md#mute)
* [muteUnmute](_app_core_media_media_element_.mediaelement.md#muteunmute)
* [pause](_app_core_media_media_element_.mediaelement.md#pause)
* [play](_app_core_media_media_element_.mediaelement.md#play)
* [playPause](_app_core_media_media_element_.mediaelement.md#playpause)
* [seekToBegin](_app_core_media_media_element_.mediaelement.md#seektobegin)
* [seekToEnd](_app_core_media_media_element_.mediaelement.md#seektoend)
* [setCurrentTime](_app_core_media_media_element_.mediaelement.md#setcurrenttime)
* [setPlaybackRate](_app_core_media_media_element_.mediaelement.md#private-setplaybackrate)
* [setSrc](_app_core_media_media_element_.mediaelement.md#setsrc)
* [setVolume](_app_core_media_media_element_.mediaelement.md#setvolume)
* [setupAudioNodes](_app_core_media_media_element_.mediaelement.md#setupaudionodes)
* [stop](_app_core_media_media_element_.mediaelement.md#stop)
* [unmute](_app_core_media_media_element_.mediaelement.md#unmute)

## Constructors

###  constructor

\+ **new MediaElement**(`mediaElement`: HTMLVideoElement, `eventEmitter`: EventEmitter): *[MediaElement](_app_core_media_media_element_.mediaelement.md)*

Defined in src/app/core/media/media-element.ts:30

Init media element for handle html video element

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`mediaElement` | HTMLVideoElement | html video element |
`eventEmitter` | EventEmitter | event emitter |

**Returns:** *[MediaElement](_app_core_media_media_element_.mediaelement.md)*

## Events

###  isMute

• **isMute**(): *boolean*

Defined in src/app/core/media/media-element.ts:325

Return true if is mute

**`method`** isMute

**Returns:** *boolean*

## Properties

### `Private` _audioChannel

• **_audioChannel**: *number* = 1

Defined in src/app/core/media/media-element.ts:47

Selected audio channel

___

### `Private` _framerate

• **_framerate**: *number* = 25

Defined in src/app/core/media/media-element.ts:80

Video framerate used for foreword and backward

___

### `Private` _playbackRate

• **_playbackRate**: *number* = 1

Defined in src/app/core/media/media-element.ts:57

___

### `Private` _poster

• **_poster**: *string*

Defined in src/app/core/media/media-element.ts:93

Media poster

___

### `Private` _withMergeVolume

• **_withMergeVolume**: *boolean* = true

Defined in src/app/core/media/media-element.ts:67

To handle merge channel state

___

###  audioContext

• **audioContext**: *AudioContext*

Defined in src/app/core/media/media-element.ts:23

___

### `Private` eventEmitter

• **eventEmitter**: *EventEmitter*

Defined in src/app/core/media/media-element.ts:18

___

### `Private` intervalRewind

• **intervalRewind**: *any* = null

Defined in src/app/core/media/media-element.ts:30

___

### `Private` logger

• **logger**: *[LoggerInterface](../interfaces/_app_core_logger_logger_interface_.loggerinterface.md)*

Defined in src/app/core/media/media-element.ts:19

___

### `Private` mediaElement

• **mediaElement**: *HTMLVideoElement*

Defined in src/app/core/media/media-element.ts:17

___

### `Private` mse

• **mse**: *[MediaSourceExtension](../interfaces/_app_core_mse_media_source_extension_.mediasourceextension.md)*

Defined in src/app/core/media/media-element.ts:20

___

###  panLeft

• **panLeft**: *GainNode*

Defined in src/app/core/media/media-element.ts:24

___

###  panRight

• **panRight**: *GainNode*

Defined in src/app/core/media/media-element.ts:25

___

### `Private` reverseMode

• **reverseMode**: *boolean* = false

Defined in src/app/core/media/media-element.ts:29

play a video backwards

___

### `Private` volumeLeft

• **volumeLeft**: *number*

Defined in src/app/core/media/media-element.ts:21

___

### `Private` volumeRight

• **volumeRight**: *number*

Defined in src/app/core/media/media-element.ts:22

___

### `Static` DEFAULT_FRAMERATE

▪ **DEFAULT_FRAMERATE**: *number* = 25

Defined in src/app/core/media/media-element.ts:16

## Accessors

###  audioChannel

• **get audioChannel**(): *number*

Defined in src/app/core/media/media-element.ts:49

**Returns:** *number*

• **set audioChannel**(`value`: number): *void*

Defined in src/app/core/media/media-element.ts:53

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*

___

###  framerate

• **get framerate**(): *number*

Defined in src/app/core/media/media-element.ts:82

**Returns:** *number*

• **set framerate**(`value`: number): *void*

Defined in src/app/core/media/media-element.ts:86

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*

___

###  playbackRate

• **set playbackRate**(`value`: number): *void*

Defined in src/app/core/media/media-element.ts:59

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*

___

###  poster

• **get poster**(): *string*

Defined in src/app/core/media/media-element.ts:95

**Returns:** *string*

• **set poster**(`value`: string): *void*

Defined in src/app/core/media/media-element.ts:99

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *void*

___

###  withMergeVolume

• **get withMergeVolume**(): *boolean*

Defined in src/app/core/media/media-element.ts:69

**Returns:** *boolean*

• **set withMergeVolume**(`value`: boolean): *void*

Defined in src/app/core/media/media-element.ts:73

**Parameters:**

Name | Type |
------ | ------ |
`value` | boolean |

**Returns:** *void*

## Methods

###  captureImage

▸ **captureImage**(`scale`: number): *string*

Defined in src/app/core/media/media-element.ts:344

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

Defined in src/app/core/media/media-element.ts:496

Return current image

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`scale` | any | max 1=> 100%  |

**Returns:** *string*

___

###  getCurrentTime

▸ **getCurrentTime**(): *number*

Defined in src/app/core/media/media-element.ts:200

Return current position in seconds

**Returns:** *number*

___

###  getDuration

▸ **getDuration**(): *number*

Defined in src/app/core/media/media-element.ts:299

Return media duration with tc offset

**Returns:** *number*

return duration

___

###  getPlaybackRate

▸ **getPlaybackRate**(): *number | null*

Defined in src/app/core/media/media-element.ts:218

Return playback rate

**Returns:** *number | null*

the current playback speed of the audio/video.

___

###  getVolume

▸ **getVolume**(`side?`: "r" | "l"): *number*

Defined in src/app/core/media/media-element.ts:162

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

Defined in src/app/core/media/media-element.ts:424

Invoked when the duration attribute has been updated.

**Returns:** *void*

___

### `Private` handleEnd

▸ **handleEnd**(): *void*

Defined in src/app/core/media/media-element.ts:415

Invoked when playback has stopped because the end of the media was reached.

**Returns:** *void*

___

### `Private` handleFullscreenHandler

▸ **handleFullscreenHandler**(): *void*

Defined in src/app/core/media/media-element.ts:470

Invoked when the fullscreen state changed.

**Returns:** *void*

___

### `Private` handleLoadstart

▸ **handleLoadstart**(): *void*

Defined in src/app/core/media/media-element.ts:388

Invoked when first frame of the media has finished loading.

**Returns:** *void*

___

### `Private` handlePause

▸ **handlePause**(): *void*

Defined in src/app/core/media/media-element.ts:405

Invoked when Playback has been paused.

**Returns:** *void*

___

### `Private` handlePlay

▸ **handlePlay**(): *void*

Defined in src/app/core/media/media-element.ts:397

Invoked when Playback has begun.

**Returns:** *void*

___

### `Private` handleResize

▸ **handleResize**(): *void*

Defined in src/app/core/media/media-element.ts:488

Invoked when player resized

**Returns:** *void*

___

### `Private` handleSeeked

▸ **handleSeeked**(): *void*

Defined in src/app/core/media/media-element.ts:442

Invoked when a seek operation completed.

**Returns:** *void*

___

### `Private` handleSeeking

▸ **handleSeeking**(): *void*

Defined in src/app/core/media/media-element.ts:451

Invoked when a seek operation began.

**Returns:** *void*

___

### `Private` handleTimeupdate

▸ **handleTimeupdate**(): *void*

Defined in src/app/core/media/media-element.ts:433

The time indicated by the currentTime attribute has been updated.

**Returns:** *void*

___

### `Private` handleVolumeChange

▸ **handleVolumeChange**(): *void*

Defined in src/app/core/media/media-element.ts:460

Invoked when the volume has changed.

**Returns:** *void*

___

### `Private` handleWaiting

▸ **handleWaiting**(): *void*

Defined in src/app/core/media/media-element.ts:480

Invoked when  The volume has changed.

**Returns:** *void*

___

### `Private` initPlayerEvents

▸ **initPlayerEvents**(): *void*

Defined in src/app/core/media/media-element.ts:366

In charge to init player events

**Returns:** *void*

___

###  isPaused

▸ **isPaused**(): *boolean*

Defined in src/app/core/media/media-element.ts:273

Return true if media is paused

**Returns:** *boolean*

boolean true is paused

___

###  moveNextFrame

▸ **moveNextFrame**(`nbFrames`: number): *void*

Defined in src/app/core/media/media-element.ts:281

In charge to move next number of frame

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`nbFrames` | number | 1 | number of frame  |

**Returns:** *void*

___

###  movePrevFrame

▸ **movePrevFrame**(`nbFrames`: number): *void*

Defined in src/app/core/media/media-element.ts:290

In charge to move prev number of frame

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`nbFrames` | number | 1 | number of frame  |

**Returns:** *void*

___

###  mute

▸ **mute**(): *void*

Defined in src/app/core/media/media-element.ts:125

Invoked to set mute state

**Returns:** *void*

___

###  muteUnmute

▸ **muteUnmute**(): *void*

Defined in src/app/core/media/media-element.ts:332

Return player instance

**Returns:** *void*

___

###  pause

▸ **pause**(): *void*

Defined in src/app/core/media/media-element.ts:110

Invoked for paused player

**Returns:** *void*

___

###  play

▸ **play**(): *Promise‹void›*

Defined in src/app/core/media/media-element.ts:103

**Returns:** *Promise‹void›*

___

###  playPause

▸ **playPause**(): *void*

Defined in src/app/core/media/media-element.ts:355

Play if paused, if paused play

**Returns:** *void*

___

###  seekToBegin

▸ **seekToBegin**(): *void*

Defined in src/app/core/media/media-element.ts:308

Set current time to the beginning of the file

**`method`** seekToBegin

**Returns:** *void*

number current time

___

###  seekToEnd

▸ **seekToEnd**(): *void*

Defined in src/app/core/media/media-element.ts:316

Set current time to the end of the file

**Returns:** *void*

number current time

___

###  setCurrentTime

▸ **setCurrentTime**(`value`: number): *void*

Defined in src/app/core/media/media-element.ts:207

Set seek position in seconds

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*

___

### `Private` setPlaybackRate

▸ **setPlaybackRate**(`speed`: number): *void*

Defined in src/app/core/media/media-element.ts:227

Set playback rate

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`speed` | number | the current playback speed of the audio/video. |

**Returns:** *void*

the current playback speed of the audio/video.

___

###  setSrc

▸ **setSrc**(`config`: [PlayerConfigData](../interfaces/_app_core_config_model_player_config_data_.playerconfigdata.md)): *void*

Defined in src/app/core/media/media-element.ts:140

Invoked to set media source and autoplay, by default

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`config` | [PlayerConfigData](../interfaces/_app_core_config_model_player_config_data_.playerconfigdata.md) | PlayerConfigData  |

**Returns:** *void*

___

###  setVolume

▸ **setVolume**(`volume`: number, `volumeSide?`: string): *void*

Defined in src/app/core/media/media-element.ts:173

Sets the volume. Accepts an integer between 0 and 100.

**Parameters:**

Name | Type |
------ | ------ |
`volume` | number |
`volumeSide?` | string |

**Returns:** *void*

___

###  setupAudioNodes

▸ **setupAudioNodes**(`data`: any): *void*

Defined in src/app/core/media/media-element.ts:514

Set Audio Nodes

**Parameters:**

Name | Type |
------ | ------ |
`data` | any |

**Returns:** *void*

___

###  stop

▸ **stop**(): *void*

Defined in src/app/core/media/media-element.ts:117

**Returns:** *void*

___

###  unmute

▸ **unmute**(): *void*

Defined in src/app/core/media/media-element.ts:132

Invoked to set unmute state

**Returns:** *void*
