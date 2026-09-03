[**Amalia**](../../../../README.md)

***

[Amalia](../../../../modules.md) / [core/media/media-element](../README.md) / MediaElement

# Class: MediaElement

Defined in: src/app/core/media/media-element.ts:14

Media element

## Constructors

### Constructor

> **new MediaElement**(`mediaElement`, `eventEmitter`): `MediaElement`

Defined in: src/app/core/media/media-element.ts:71

Init media element for handle html video element

#### Parameters

##### mediaElement

`HTMLVideoElement`

html video element

##### eventEmitter

`EventEmitter`

event emitter

#### Returns

`MediaElement`

## Properties

### \_audioChannel

> **\_audioChannel**: `number` = `1`

Defined in: src/app/core/media/media-element.ts:25

Selected audio channel

***

### \_playbackRate

> **\_playbackRate**: `number` = `1`

Defined in: src/app/core/media/media-element.ts:26

***

### \_withMergeVolume

> **\_withMergeVolume**: `boolean` = `true`

Defined in: src/app/core/media/media-element.ts:38

To handle merge channel state

***

### audioContext

> **audioContext**: `AudioContext` = `null`

Defined in: src/app/core/media/media-element.ts:39

***

### audioContextSplitter

> **audioContextSplitter**: `any` = `null`

Defined in: src/app/core/media/media-element.ts:40

***

### mse

> **mse**: [`MediaSourceExtension`](../../../mse/media-source-extension/interfaces/MediaSourceExtension.md)

Defined in: src/app/core/media/media-element.ts:19

***

### panLeft

> **panLeft**: `GainNode` = `null`

Defined in: src/app/core/media/media-element.ts:41

***

### panRight

> **panRight**: `GainNode` = `null`

Defined in: src/app/core/media/media-element.ts:42

***

### reverseMode

> **reverseMode**: `boolean` = `false`

Defined in: src/app/core/media/media-element.ts:47

play a video backwards

***

### stereoNode

> **stereoNode**: `PannerNode` = `null`

Defined in: src/app/core/media/media-element.ts:43

***

### volumeLeft

> **volumeLeft**: `number` = `50`

Defined in: src/app/core/media/media-element.ts:20

***

### volumeRight

> **volumeRight**: `number` = `50`

Defined in: src/app/core/media/media-element.ts:21

***

### DEFAULT\_FRAMERATE

> `static` **DEFAULT\_FRAMERATE**: `number` = `25`

Defined in: src/app/core/media/media-element.ts:15

## Accessors

### audioChannel

#### Get Signature

> **get** **audioChannel**(): `number`

Defined in: src/app/core/media/media-element.ts:88

##### Returns

`number`

#### Set Signature

> **set** **audioChannel**(`value`): `void`

Defined in: src/app/core/media/media-element.ts:92

##### Parameters

###### value

`number`

##### Returns

`void`

***

### framerate

#### Get Signature

> **get** **framerate**(): `number`

Defined in: src/app/core/media/media-element.ts:111

##### Returns

`number`

#### Set Signature

> **set** **framerate**(`value`): `void`

Defined in: src/app/core/media/media-element.ts:115

##### Parameters

###### value

`number`

##### Returns

`void`

***

### playbackRate

#### Set Signature

> **set** **playbackRate**(`value`): `void`

Defined in: src/app/core/media/media-element.ts:97

##### Parameters

###### value

`number`

##### Returns

`void`

***

### poster

#### Get Signature

> **get** **poster**(): `string`

Defined in: src/app/core/media/media-element.ts:119

##### Returns

`string`

#### Set Signature

> **set** **poster**(`value`): `void`

Defined in: src/app/core/media/media-element.ts:123

##### Parameters

###### value

`string`

##### Returns

`void`

***

### withMergeVolume

#### Get Signature

> **get** **withMergeVolume**(): `boolean`

Defined in: src/app/core/media/media-element.ts:103

##### Returns

`boolean`

#### Set Signature

> **set** **withMergeVolume**(`value`): `void`

Defined in: src/app/core/media/media-element.ts:107

##### Parameters

###### value

`boolean`

##### Returns

`void`

## Methods

### addListener()

> **addListener**(`element`, `playerEventType`, `func`): `void`

Defined in: src/app/core/media/media-element.ts:656

#### Parameters

##### element

`any`

##### playerEventType

[`PlayerEventType`](../../../constant/event-type/enumerations/PlayerEventType.md)

##### func

`any`

#### Returns

`void`

***

### captureImage()

> **captureImage**(`scale`): `string`

Defined in: src/app/core/media/media-element.ts:425

In charge to capture image

#### Parameters

##### scale

`number`

#### Returns

`string`

image base 64

***

### getCurrentTime()

> **getCurrentTime**(): `number`

Defined in: src/app/core/media/media-element.ts:245

Return current position in seconds

#### Returns

`number`

***

### getDuration()

> **getDuration**(): `number`

Defined in: src/app/core/media/media-element.ts:380

Return media duration with tc offset

#### Returns

`number`

return duration

***

### getPlaybackRate()

> **getPlaybackRate**(): `number`

Defined in: src/app/core/media/media-element.ts:264

Return playback rate

#### Returns

`number`

the current playback speed of the audio/video.

***

### getVolume()

> **getVolume**(`side?`): `number`

Defined in: src/app/core/media/media-element.ts:195

Returns the player's current volume, an integer between 0 and 100. Note that getVolume()
will return the volume even if the player is muted.

#### Parameters

##### side?

`"r"` | `"l"`

#### Returns

`number`

***

### initAudioChannelMerger()

> **initAudioChannelMerger**(`data`): `void`

Defined in: src/app/core/media/media-element.ts:598

In charge to init audio chanel merger

#### Parameters

##### data

`any`

#### Returns

`void`

***

### initLoggerState()

> **initLoggerState**(`logEnable`, `logLevel`): `void`

Defined in: src/app/core/media/media-element.ts:82

Init log level

#### Parameters

##### logEnable

`boolean`

true for enable log

##### logLevel

`string`

log level

#### Returns

`void`

***

### isPaused()

> **isPaused**(): `boolean`

Defined in: src/app/core/media/media-element.ts:347

Return true if media is paused

#### Returns

`boolean`

boolean true is paused

***

### moveNextFrame()

> **moveNextFrame**(`nbFrames`): `void`

Defined in: src/app/core/media/media-element.ts:360

In charge to move next number of frame

#### Parameters

##### nbFrames

`number` = `1`

number of frame

#### Returns

`void`

***

### movePrevFrame()

> **movePrevFrame**(`nbFrames`): `void`

Defined in: src/app/core/media/media-element.ts:370

In charge to move prev number of frame

#### Parameters

##### nbFrames

`number` = `1`

number of frame

#### Returns

`void`

***

### mute()

> **mute**(): `void`

Defined in: src/app/core/media/media-element.ts:159

Invoked to set mute state

#### Returns

`void`

***

### muteUnmute()

> **muteUnmute**(): `void`

Defined in: src/app/core/media/media-element.ts:413

Return player instance

#### Returns

`void`

***

### pause()

> **pause**(`ignore?`): `void`

Defined in: src/app/core/media/media-element.ts:134

Invoked for paused player

#### Parameters

##### ignore?

`any`

#### Returns

`void`

***

### pauseOnly()

> **pauseOnly**(): `void`

Defined in: src/app/core/media/media-element.ts:147

Invoked to pause the player without setting back the frame rate

#### Returns

`void`

***

### play()

> **play**(): `Promise`\<`void`\>

Defined in: src/app/core/media/media-element.ts:127

#### Returns

`Promise`\<`void`\>

***

### playPause()

> **playPause**(): `void`

Defined in: src/app/core/media/media-element.ts:436

Play if paused, if paused play

#### Returns

`void`

***

### seekToBegin()

> **seekToBegin**(): `void`

Defined in: src/app/core/media/media-element.ts:389

Set current time to the beginning of the file

#### Returns

`void`

number current time

#### Method

seekToBegin

***

### seekToEnd()

> **seekToEnd**(): `void`

Defined in: src/app/core/media/media-element.ts:397

Set current time to the end of the file

#### Returns

`void`

number current time

***

### setCurrentTime()

> **setCurrentTime**(`value`): `void`

Defined in: src/app/core/media/media-element.ts:252

Set seek position in seconds

#### Parameters

##### value

`number`

#### Returns

`void`

***

### setReverseMode()

> **setReverseMode**(`value`): `void`

Defined in: src/app/core/media/media-element.ts:238

#### Parameters

##### value

`boolean`

#### Returns

`void`

***

### setSrc()

> **setSrc**(`config`): `void`

Defined in: src/app/core/media/media-element.ts:174

Invoked to set media source and autoplay, by default

#### Parameters

##### config

[`PlayerConfigData`](../../../config/model/player-config-data/interfaces/PlayerConfigData.md)

PlayerConfigData

#### Returns

`void`

***

### setVolume()

> **setVolume**(`volumePercent`, `volumeSide?`): `void`

Defined in: src/app/core/media/media-element.ts:206

Sets the volume. Accepts an integer between 0 and 100.

#### Parameters

##### volumePercent

`number`

##### volumeSide?

`string`

#### Returns

`void`

***

### setVolumeSideValues()

> **setVolumeSideValues**(`volumePercent`, `volumeSide?`): `void`

Defined in: src/app/core/media/media-element.ts:212

#### Parameters

##### volumePercent

`number`

##### volumeSide?

`string`

#### Returns

`void`

***

### stop()

> **stop**(): `void`

Defined in: src/app/core/media/media-element.ts:151

#### Returns

`void`

***

### unmute()

> **unmute**(): `void`

Defined in: src/app/core/media/media-element.ts:166

Invoked to set unmute state

#### Returns

`void`

***

### unsubscribeListeners()

> **unsubscribeListeners**(): `void`

Defined in: src/app/core/media/media-element.ts:660

#### Returns

`void`

## Events

### isMute()

> **isMute**(): `boolean`

Defined in: src/app/core/media/media-element.ts:406

Return true if is mute

#### Returns

`boolean`

#### Method

isMute
 ina.player.PlayerEventType.UN_MUTE
