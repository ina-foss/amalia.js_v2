[**Amalia**](../../../../README.md)

***

[Amalia](../../../../modules.md) / [plugins/control-bar/control-bar-plugin.component](../README.md) / ControlBarPluginComponent

# Class: ControlBarPluginComponent

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:27

Base class for create plugin

## Extends

- [`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md)\<[`ControlBarConfig`](../../../../core/config/model/control-bar-config/interfaces/ControlBarConfig.md)[]\>

## Constructors

### Constructor

> **new ControlBarPluginComponent**(`playerService`, `thumbnailService`, `renderer`): `ControlBarPluginComponent`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:277

#### Parameters

##### playerService

[`MediaPlayerService`](../../../../service/media-player-service/classes/MediaPlayerService.md)

##### thumbnailService

[`ThumbnailService`](../../../../service/thumbnail-service/classes/ThumbnailService.md)

##### renderer

`Renderer2`

#### Returns

`ControlBarPluginComponent`

#### Overrides

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`constructor`](../../../../core/plugin/plugin-base/classes/PluginBase.md#constructor)

## Properties

### \_player

> **\_player**: `any`

Defined in: src/app/core/plugin/plugin-base.ts:42

This plugin configuration

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`_player`](../../../../core/plugin/plugin-base/classes/PluginBase.md#_player)

***

### \_pluginConfiguration

> **\_pluginConfiguration**: [`PluginConfigData`](../../../../core/config/model/plugin-config-data/interfaces/PluginConfigData.md)\<[`ControlBarConfig`](../../../../core/config/model/control-bar-config/interfaces/ControlBarConfig.md)[]\>

Defined in: src/app/core/plugin/plugin-base.ts:97

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`_pluginConfiguration`](../../../../core/plugin/plugin-base/classes/PluginBase.md#_pluginconfiguration)

***

### activated

> **activated**: `boolean` = `false`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:203

State of controlBar

***

### aspectRatio

> **aspectRatio**: `"16:9"` \| `"4:3"` = `'4:3'`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:136

Selected aspectRatio

***

### aspectRatioMouseEnterTimeOut

> **aspectRatioMouseEnterTimeOut**: `any`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:273

***

### backwardPlaybackRateStep

> **backwardPlaybackRateStep**: `number`[]

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:66

***

### backwardSlowPlaybackRateStep

> **backwardSlowPlaybackRateStep**: `number`[]

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:64

list of backward playback step

***

### callback

> **callback**: `EventEmitter`\<`any`\>

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:121

In charge to notify download event

***

### clickedVolume

> **clickedVolume**: `boolean` = `false`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:223

clicked button volume

***

### controlBarContainer

> **controlBarContainer**: `ElementRef`\<`HTMLElement`\>

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:249

***

### controls

> **controls**: `any`[] = `[]`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:165

List of Controls

***

### controlsMenu

> **controlsMenu**: `ElementRef`\<`HTMLElement`\>

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:258

***

### currentPlaybackRate

> **currentPlaybackRate**: `number` = `1`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:92

Player playback rate

***

### currentPlaybackRateSlider

> **currentPlaybackRateSlider**: `number` = `1`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:96

Player playbackrate slider 1

***

### currentTime

> **currentTime**: `number` = `0`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:144

return  current time

***

### dataLoading

> **dataLoading**: `boolean` = `false`

Defined in: src/app/core/plugin/plugin-base.ts:26

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`dataLoading`](../../../../core/plugin/plugin-base/classes/PluginBase.md#dataloading)

***

### defaultRatio

> **defaultRatio**: `any`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:140

Default aspect ratio

***

### displaySliderElement

> **displaySliderElement**: `ElementRef`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:270

***

### displayState

> **displayState**: `string`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:207

display state (s/m/l)

***

### dragElement

> **dragElement**: `ElementRef`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:86

***

### duration

> **duration**: `number` = `0`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:161

Media duration

***

### elements

> **elements**: `any`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:199

List of control for Zone 1

***

### enableListPositionsSubtitle

> **enableListPositionsSubtitle**: `boolean` = `false`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:195

List positions subtitle state

***

### enableListRatio

> **enableListRatio**: `boolean` = `false`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:182

Menu list ratio state

***

### enableMenu

> **enableMenu**: `boolean` = `false`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:116

Enable Menu

***

### enableMenuSlider

> **enableMenuSlider**: `boolean` = `false`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:219

show menu slider

***

### enablePinnedSlider

> **enablePinnedSlider**: `boolean` = `false`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:108

Pinned slider state

***

### enablePlaybackSlider

> **enablePlaybackSlider**: `boolean` = `false`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:100

Playbackrate slider state

***

### enableThumbnail

> **enableThumbnail**: `boolean` = `false`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:241

***

### enableVolumeSlider

> **enableVolumeSlider**: `boolean` = `false`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:178

Volume slider state

***

### extractTcIn?

> `optional` **extractTcIn**: `number` = `null`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:81

***

### extractTcOut?

> `optional` **extractTcOut**: `number` = `null`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:82

***

### forwardPlaybackRateStep

> **forwardPlaybackRateStep**: `number`[]

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:73

***

### forwardSlowPlaybackRateStep

> **forwardSlowPlaybackRateStep**: `number`[]

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:75

***

### fps

> **fps**: `any`

Defined in: src/app/core/plugin/plugin-base.ts:24

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`fps`](../../../../core/plugin/plugin-base/classes/PluginBase.md#fps)

***

### fullScreenMode

> **fullScreenMode**: `boolean` = `false`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:211

FullScreenMode state

***

### indexPlaybackRate

> **indexPlaybackRate**: `number` = `3`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:166

***

### initAlreadyCalled

> **initAlreadyCalled**: `boolean` = `false`

Defined in: src/app/core/plugin/plugin-base.ts:38

When false, means that the init function was not called yet

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`initAlreadyCalled`](../../../../core/plugin/plugin-base/classes/PluginBase.md#initalreadycalled)

***

### initialized

> **initialized**: `any`

Defined in: src/app/core/plugin/plugin-base.ts:25

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`initialized`](../../../../core/plugin/plugin-base/classes/PluginBase.md#initialized)

***

### inSliding

> **inSliding**: `boolean` = `false`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:170

In sliding

***

### intervalStep

> **intervalStep**: `number` = `5`

Defined in: src/app/core/plugin/plugin-base.ts:28

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`intervalStep`](../../../../core/plugin/plugin-base/classes/PluginBase.md#intervalstep)

***

### inverse

> **inverse**: `boolean` = `false`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:152

inverse display currentime

***

### keypressed

> **keypressed**: `string` = `''`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:174

keypressed

***

### leftVolumeSlider

> **leftVolumeSlider**: `ElementRef`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:262

***

### listBufferSize

> **listBufferSize**: `number`[]

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:70

list of forward playback step

***

### listOfShortcuts

> **listOfShortcuts**: [`ShortcutControl`](../../../../core/config/model/shortcuts-event/interfaces/ShortcutControl.md)[] = `[]`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:255

list of shortcuts

***

### listOfSubtitles

> **listOfSubtitles**: `object`[]

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:227

list position subtitles

#### key

> **key**: `string` = `'down'`

#### label

> **label**: `string` = `'Bas'`

***

### listOfTracks

> **listOfTracks**: `object`[] = `[]`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:266

#### label

> **label**: `string`

#### track

> **track**: `string`

***

### logger

> **logger**: [`DefaultLogger`](../../../../core/logger/default-logger/classes/DefaultLogger.md)

Defined in: src/app/core/plugin/plugin-base.ts:122

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`logger`](../../../../core/plugin/plugin-base/classes/PluginBase.md#logger)

***

### maxCursor

> **maxCursor**: `number`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:79

***

### maxPlaybackRateSlider

> **maxPlaybackRateSlider**: `number` = `10`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:41

Max playback rate

***

### mediaPlayerElement

> **mediaPlayerElement**: [`MediaPlayerElement`](../../../../core/media-player-element/classes/MediaPlayerElement.md)

Defined in: src/app/core/plugin/plugin-base.ts:119

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`mediaPlayerElement`](../../../../core/plugin/plugin-base/classes/PluginBase.md#mediaplayerelement)

***

### minCursor

> **minCursor**: `number`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:80

***

### minPlaybackRateSlider

> **minPlaybackRateSlider**: `number` = `-10`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:35

Min playback rate

***

### moving

> **moving**: `boolean` = `false`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:88

***

### negPlaybackrates

> **negPlaybackrates**: `number`[] = `[]`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:78

***

### noSpinner

> **noSpinner**: `boolean` = `true`

Defined in: src/app/core/plugin/plugin-base.ts:29

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`noSpinner`](../../../../core/plugin/plugin-base/classes/PluginBase.md#nospinner)

***

### onProgressBar

> **onProgressBar**: `boolean` = `false`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:83

***

### openPisteAudio

> **openPisteAudio**: `boolean` = `false`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:183

***

### pinControlsElement

> **pinControlsElement**: `ElementRef`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:272

***

### pinned

> **pinned**: `boolean` = `false`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:112

Pinned slider and ControlBar

***

### pinnedSlider

> **pinnedSlider**: `boolean` = `false`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:104

Pinned Controls state

***

### playbackrateByImages

> **playbackrateByImages**: `boolean` = `false`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:265

***

### playerId

> **playerId**: `any` = `null`

Defined in: src/app/core/plugin/plugin-base.ts:21

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`playerId`](../../../../core/plugin/plugin-base/classes/PluginBase.md#playerid)

***

### playerService

> **playerService**: [`MediaPlayerService`](../../../../service/media-player-service/classes/MediaPlayerService.md)

Defined in: src/app/core/plugin/plugin-base.ts:116

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`playerService`](../../../../core/plugin/plugin-base/classes/PluginBase.md#playerservice)

***

### pluginConfSetThroughInit

> **pluginConfSetThroughInit**: `boolean` = `false`

Defined in: src/app/core/plugin/plugin-base.ts:34

When false, it means that the pluginConfiguration was set through the template's attribute

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`pluginConfSetThroughInit`](../../../../core/plugin/plugin-base/classes/PluginBase.md#pluginconfsetthroughinit)

***

### pluginInstance

> **pluginInstance**: `string` = `''`

Defined in: src/app/core/plugin/plugin-base.ts:118

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`pluginInstance`](../../../../core/plugin/plugin-base/classes/PluginBase.md#plugininstance)

***

### pluginName

> `protected` **pluginName**: `string`

Defined in: src/app/core/plugin/plugin-base.ts:121

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`pluginName`](../../../../core/plugin/plugin-base/classes/PluginBase.md#pluginname)

***

### posPlaybackrates

> **posPlaybackrates**: `number`[] = `[]`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:77

***

### progressBarElement

> **progressBarElement**: `ElementRef`\<`HTMLElement`\>

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:235

progressBar element

***

### progressBarValue

> **progressBarValue**: `number` = `0`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:157

Progress bar value

***

### rightVolumeSlider

> **rightVolumeSlider**: `ElementRef`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:264

***

### selectedLabel

> **selectedLabel**: `string` = `'Aucun (original)'`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:191

default label subtitle

***

### selectedSlider

> **selectedSlider**: `string` = `'slider1'`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:215

slider displayed

***

### selectedTrack

> **selectedTrack**: `any` = `null`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:267

***

### selectedTrackLabel

> **selectedTrackLabel**: `string` = `''`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:268

***

### sliderListOfPlaybackRateCustomSteps

> **sliderListOfPlaybackRateCustomSteps**: `number`[]

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:59

List of playback rate

***

### sliderListOfPlaybackRateStep

> **sliderListOfPlaybackRateStep**: `number`[]

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:53

list playback rate step (2/6/8)

***

### sliderListOfPlaybackRateStepWidth

> **sliderListOfPlaybackRateStepWidth**: `number`[] = `[]`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:76

***

### sliderPosition

> **sliderPosition**: `number` = `0`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:87

***

### stepPlaybackRateSlider

> **stepPlaybackRateSlider**: `number` = `0.05`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:47

Playback rate step

***

### subscriptionToEventsEmitters

> **subscriptionToEventsEmitters**: `Subscription`[] = `[]`

Defined in: src/app/core/plugin/plugin-base.ts:30

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`subscriptionToEventsEmitters`](../../../../core/plugin/plugin-base/classes/PluginBase.md#subscriptiontoeventsemitters)

***

### subtitlePosition

> **subtitlePosition**: `string` = `'none'`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:187

position of subtitles

***

### tcOffset

> **tcOffset**: `any`

Defined in: src/app/core/plugin/plugin-base.ts:23

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`tcOffset`](../../../../core/plugin/plugin-base/classes/PluginBase.md#tcoffset)

***

### tcThumbnail

> **tcThumbnail**: `number` = `0`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:240

***

### throttleFunc

> **throttleFunc**: `any`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:259

***

### thumbnailContainer

> **thumbnailContainer**: `ElementRef`\<`HTMLElement`\>

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:247

***

### thumbnailElement

> **thumbnailElement**: `ElementRef`\<`HTMLElement`\>

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:245

***

### thumbnailHidden

> **thumbnailHidden**: `boolean` = `true`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:242

***

### thumbnailPosition

> **thumbnailPosition**: `number` = `0`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:243

***

### time

> **time**: `number` = `0`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:148

currentime

***

### timeFormat

> **timeFormat**: `any`

Defined in: src/app/core/plugin/plugin-base.ts:22

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`timeFormat`](../../../../core/plugin/plugin-base/classes/PluginBase.md#timeformat)

***

### timeout

> **timeout**: `number` = `30000`

Defined in: src/app/core/plugin/plugin-base.ts:27

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`timeout`](../../../../core/plugin/plugin-base/classes/PluginBase.md#timeout)

***

### volumeButton

> **volumeButton**: `ElementRef`\<`HTMLElement`\>

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:251

***

### volumeLeft

> **volumeLeft**: `number` = `50`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:126

Volume left side

***

### volumeMouseEnterTimeOut

> **volumeMouseEnterTimeOut**: `any`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:274

***

### volumeRight

> **volumeRight**: `number` = `50`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:131

Volume right side

***

### DEFAULT\_THROTTLE\_INVOCATION\_TIME

> `static` **DEFAULT\_THROTTLE\_INVOCATION\_TIME**: `number` = `150`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:30

***

### PLUGIN\_NAME

> `static` **PLUGIN\_NAME**: `string` = `'CONTROL_BAR'`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:29

## Accessors

### player

#### Get Signature

> **get** **player**(): `any`

Defined in: src/app/core/plugin/plugin-base.ts:44

##### Returns

`any`

#### Set Signature

> **set** **player**(`value`): `void`

Defined in: src/app/core/plugin/plugin-base.ts:49

##### Parameters

###### value

`any`

##### Returns

`void`

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`player`](../../../../core/plugin/plugin-base/classes/PluginBase.md#player)

***

### pluginConfiguration

#### Get Signature

> **get** **pluginConfiguration**(): [`PluginConfigData`](../../../../core/config/model/plugin-config-data/interfaces/PluginConfigData.md)\<`T`\>

Defined in: src/app/core/plugin/plugin-base.ts:99

##### Returns

[`PluginConfigData`](../../../../core/config/model/plugin-config-data/interfaces/PluginConfigData.md)\<`T`\>

#### Set Signature

> **set** **pluginConfiguration**(`value`): `void`

Defined in: src/app/core/plugin/plugin-base.ts:104

##### Parameters

###### value

[`PluginConfigData`](../../../../core/config/model/plugin-config-data/interfaces/PluginConfigData.md)\<`T`\>

##### Returns

`void`

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`pluginConfiguration`](../../../../core/plugin/plugin-base/classes/PluginBase.md#pluginconfiguration)

## Methods

### addListener()

> **addListener**(`element`, `playerEventType`, `func`): `void`

Defined in: src/app/core/plugin/plugin-base.ts:145

#### Parameters

##### element

`any`

##### playerEventType

[`PlayerEventType`](../../../../core/constant/event-type/enumerations/PlayerEventType.md)

##### func

`any`

#### Returns

`void`

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`addListener`](../../../../core/plugin/plugin-base/classes/PluginBase.md#addlistener)

***

### applyShortcut()

> **applyShortcut**(`shortcutToBeApplied`): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:574

If key is declared in config apply control

#### Parameters

##### shortcutToBeApplied

[`ShortcutEvent`](../../../../core/config/model/shortcuts-event/interfaces/ShortcutEvent.md)

#### Returns

`void`

***

### aspectRatioMouseEnter()

> **aspectRatioMouseEnter**(): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:1303

#### Returns

`void`

***

### buildUrlWithTc()

> **buildUrlWithTc**(`element`, `control`): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:1226

Handle to download url

#### Parameters

##### element

`HTMLElement`

html element

##### control

[`ControlBarConfig`](../../../../core/config/model/control-bar-config/interfaces/ControlBarConfig.md)

control bar config

#### Returns

`void`

***

### changeAspectRatio()

> **changeAspectRatio**(): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:893

Invoked for change aspect ratio

#### Returns

`void`

***

### changeAudioTrack()

> **changeAudioTrack**(`trackId`): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:1604

handle change track

#### Parameters

##### trackId

`any`

track id

#### Returns

`void`

***

### changePlaybackrate()

> **changePlaybackrate**(`pr`, `click?`): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:1513

#### Parameters

##### pr

`any`

##### click?

`any`

#### Returns

`void`

***

### changeSameVolumeState()

> **changeSameVolumeState**(): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:925

Change volume state

#### Returns

`void`

***

### changeSlider()

> **changeSlider**(): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:1264

change slider displayed

#### Returns

`void`

***

### changeTooltipEmplacement()

> **changeTooltipEmplacement**(): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:832

Tooltip tag is append after footer (ng2-directive-tooltip)
in fullscreen only the player is target , this function move the tooltip target from body to containerControlbar

#### Returns

`void`

***

### changeVolume()

> **changeVolume**(`value`, `volumeSide?`): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:787

Change volume

#### Parameters

##### value

volume percentage

`string` | `number`

##### volumeSide?

`string`

volume side (l or r)

#### Returns

`void`

***

### controlClicked()

> **controlClicked**(`control`): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:633

Invoked player with specified control function name

#### Parameters

##### control

`string`

control name

#### Returns

`void`

***

### downloadUrl()

> **downloadUrl**(`control`): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:1238

Download URL on shortcut

#### Parameters

##### control

`any`

#### Returns

`void`

***

### getControlsByPriority()

> **getControlsByPriority**(`priority`, `zone`): [`ControlBarConfig`](../../../../core/config/model/control-bar-config/interfaces/ControlBarConfig.md)[]

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:774

#### Parameters

##### priority

`number`

##### zone

`number`

#### Returns

[`ControlBarConfig`](../../../../core/config/model/control-bar-config/interfaces/ControlBarConfig.md)[]

***

### getControlsByZone()

> **getControlsByZone**(`zone`): [`ControlBarConfig`](../../../../core/config/model/control-bar-config/interfaces/ControlBarConfig.md)[]

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:767

Return list controls by zone id

#### Parameters

##### zone

`number`

zone id

#### Returns

[`ControlBarConfig`](../../../../core/config/model/control-bar-config/interfaces/ControlBarConfig.md)[]

***

### getDefaultAspectRatio()

> **getDefaultAspectRatio**(): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:901

get default aspect ratio

#### Returns

`void`

***

### getDefaultConfig()

> **getDefaultConfig**(): [`PluginConfigData`](../../../../core/config/model/plugin-config-data/interfaces/PluginConfigData.md)\<[`ControlBarConfig`](../../../../core/config/model/control-bar-config/interfaces/ControlBarConfig.md)[]\>

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:519

Return plugin configuration

#### Returns

[`PluginConfigData`](../../../../core/config/model/plugin-config-data/interfaces/PluginConfigData.md)\<[`ControlBarConfig`](../../../../core/config/model/control-bar-config/interfaces/ControlBarConfig.md)[]\>

#### Overrides

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`getDefaultConfig`](../../../../core/plugin/plugin-base/classes/PluginBase.md#getdefaultconfig)

***

### getMouseValue()

> **getMouseValue**(`event`): `number`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:984

get value

#### Parameters

##### event

`any`

click event

#### Returns

`number`

***

### handleCallback()

> **handleCallback**(`control`): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:504

Handle callback

#### Parameters

##### control

[`ControlBarConfig`](../../../../core/config/model/control-bar-config/interfaces/ControlBarConfig.md)

#### Returns

`void`

***

### handleDisplayState()

> **handleDisplayState**(): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:848

switch container class based on width

#### Returns

`void`

***

### handleMetadataLoaded()

> `protected` **handleMetadataLoaded**(): `void`

Defined in: src/app/core/plugin/plugin-base.ts:152

#### Returns

`void`

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`handleMetadataLoaded`](../../../../core/plugin/plugin-base/classes/PluginBase.md#handlemetadataloaded)

***

### handleMoveDragThumb()

> **handleMoveDragThumb**(`event`, `position`, `step`, `maxWidth`): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:1474

handle move drag thumb

#### Parameters

##### event

`any`

##### position

`any`

##### step

`any`

##### maxWidth

`any`

#### Returns

`void`

***

### handleMuteUnmuteVolume()

> **handleMuteUnmuteVolume**(`side`): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:1579

In charge to handle click volume

#### Parameters

##### side

`string` = `''`

#### Returns

`void`

***

### handlePlaybackRateChangeByImages()

> **handlePlaybackRateChangeByImages**(): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:404

SIMULATE SEEKING

#### Returns

`void`

***

### handlePlaybackRateChangeByImagesStop()

> **handlePlaybackRateChangeByImagesStop**(): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:411

stop simulate seeking

#### Returns

`void`

***

### handlePlayerMouseHover()

> **handlePlayerMouseHover**(): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:1135

#### Returns

`void`

***

### handleProgressBarMouseDown()

> **handleProgressBarMouseDown**(): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:975

Progress bar on mouse down

#### Returns

`void`

***

### handleProgressBarMouseMove()

> **handleProgressBarMouseMove**(`event`): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:487

Progress bar on mouse move

#### Parameters

##### event

`any`

mouse event

#### Returns

`void`

***

### handleProgressBarMouseUp()

> **handleProgressBarMouseUp**(`event`): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:993

Progress bar on mouse up

#### Parameters

##### event

`any`

click event

#### Returns

`void`

***

### handleShortcuts()

> **handleShortcuts**(`event`): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:477

Apply shortcut if exists on keydown

#### Parameters

##### event

[`ShortcutEvent`](../../../../core/config/model/shortcuts-event/interfaces/ShortcutEvent.md)

#### Returns

`void`

***

### handleStopMoveDragThumb()

> **handleStopMoveDragThumb**(`values`, `position`): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:1459

Handle stop move drag thumb

#### Parameters

##### values

`any`

##### position

`any`

#### Returns

`void`

***

### handleWindowResize()

> **handleWindowResize**(): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:467

Update displayState on windowResize

#### Returns

`void`

***

### hasComponentWithoutZone()

> **hasComponentWithoutZone**(`componentName`): `boolean`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:758

Return true if the component is in ths configuration without zone

#### Parameters

##### componentName

`string`

compoent name

#### Returns

`boolean`

***

### hideAll()

> **hideAll**(`control?`): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:1288

#### Parameters

##### control?

`any`

#### Returns

`void`

***

### hideControlsMenuOnClickDocument()

> **hideControlsMenuOnClickDocument**(): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:509

#### Returns

`void`

***

### init()

> **init**(): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:319

#### Returns

`void`

#### Overrides

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`init`](../../../../core/plugin/plugin-base/classes/PluginBase.md#init)

***

### initDragThumb()

> **initDragThumb**(): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:1372

#### Returns

`void`

***

### initPlaybackrates()

> **initPlaybackrates**(): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:1352

#### Returns

`void`

***

### initShortcuts()

> **initShortcuts**(`data`): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:539

init array of shortcuts

#### Parameters

##### data

[`ControlBarConfig`](../../../../core/config/model/control-bar-config/interfaces/ControlBarConfig.md)[]

#### Returns

`void`

***

### initTracks()

> **initTracks**(): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:1559

#### Returns

`void`

***

### listenToDisplaySliderDisplayChanges()

> **listenToDisplaySliderDisplayChanges**(): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:284

#### Returns

`void`

***

### listenToPinControlsDisplayChanges()

> **listenToPinControlsDisplayChanges**(): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:295

#### Returns

`void`

***

### logWaitForTcOffsetComplete()

> **logWaitForTcOffsetComplete**(): `void`

Defined in: src/app/core/plugin/plugin-base.ts:57

#### Returns

`void`

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`logWaitForTcOffsetComplete`](../../../../core/plugin/plugin-base/classes/PluginBase.md#logwaitfortcoffsetcomplete)

***

### mediaPlayerElementReady()

> **mediaPlayerElementReady**(): `boolean`

Defined in: src/app/core/plugin/plugin-base.ts:87

Retourne vrai si le mediaPlayerElement est initialisé.

#### Returns

`boolean`

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`mediaPlayerElementReady`](../../../../core/plugin/plugin-base/classes/PluginBase.md#mediaplayerelementready)

***

### metaDataLoaded()

> **metaDataLoaded**(): `boolean`

Defined in: src/app/core/plugin/plugin-base.ts:65

#### Returns

`boolean`

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`metaDataLoaded`](../../../../core/plugin/plugin-base/classes/PluginBase.md#metadataloaded)

***

### moveSliderCursor()

> **moveSliderCursor**(`value`): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:805

Invoked on mouse move

#### Parameters

##### value

`any`

change value

#### Returns

`void`

***

### mute()

> **mute**(): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:1331

Mute sound

#### Returns

`void`

***

### nextPlaybackRateImages()

> **nextPlaybackRateImages**(`speed`): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:1055

Invoked for change playback rate
When playbackrate >= 6 display images

#### Parameters

##### speed

`any`

#### Returns

`void`

***

### ngOnDestroy()

> **ngOnDestroy**(): `void`

Defined in: src/app/core/plugin/plugin-base.ts:207

A callback method that performs custom clean-up, invoked immediately
before a directive, pipe, or service instance is destroyed.

#### Returns

`void`

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`ngOnDestroy`](../../../../core/plugin/plugin-base/classes/PluginBase.md#ngondestroy)

***

### ngOnInit()

> **ngOnInit**(): `void`

Defined in: src/app/core/plugin/plugin-base.ts:132

A callback method that is invoked immediately after the
default change detector has checked the directive's
data-bound properties for the first time,
and before any of the view or content children have been checked.
It is invoked only once when the directive is instantiated.

#### Returns

`void`

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`ngOnInit`](../../../../core/plugin/plugin-base/classes/PluginBase.md#ngoninit)

***

### onChangePlaybackRate()

> **onChangePlaybackRate**(`value`): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:909

Invoked on change playback rate

#### Parameters

##### value

`number`

#### Returns

`void`

***

### openVolume()

> **openVolume**(`data`): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:1572

In charge to open Volume

#### Parameters

##### data

`any`

volume paramèter

#### Returns

`void`

***

### previousPlaybackRateImages()

> **previousPlaybackRateImages**(`speed`): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:1071

Invoked for change playback rate
When playbackrate >= speed configuration display images

#### Parameters

##### speed

`any`

#### Returns

`void`

***

### progressBarMouseEnter()

> **progressBarMouseEnter**(`event`): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:939

Handle mouse enter on progress bar

#### Parameters

##### event

`MouseEvent`

mouse enter

#### Returns

`void`

***

### progressBarMouseLeave()

> **progressBarMouseLeave**(): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:948

Handle mouse leave on progress bar

#### Returns

`void`

***

### progressBarMouseMove()

> **progressBarMouseMove**(`event`): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:958

Handle mouse move on progress bar

#### Parameters

##### event

`MouseEvent`

mouse move

#### Returns

`void`

***

### removeListener()

> **removeListener**(`element`, `playerEventType`, `func`): `void`

Defined in: src/app/core/plugin/plugin-base.ts:148

#### Parameters

##### element

`any`

##### playerEventType

[`PlayerEventType`](../../../../core/constant/event-type/enumerations/PlayerEventType.md)

##### func

`any`

#### Returns

`void`

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`removeListener`](../../../../core/plugin/plugin-base/classes/PluginBase.md#removelistener)

***

### seekTo()

> **seekTo**(`time`): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:623

Invoked seek time

#### Parameters

##### time

`number`

number

#### Returns

`void`

***

### selectActivePlaybackrate()

> **selectActivePlaybackrate**(): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:1533

AutoBind Select Playbackrate

#### Returns

`void`

***

### setDataLoading()

> **setDataLoading**(`dataLoading`): `void`

Defined in: src/app/core/plugin/plugin-base.ts:53

#### Parameters

##### dataLoading

`boolean`

#### Returns

`void`

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`setDataLoading`](../../../../core/plugin/plugin-base/classes/PluginBase.md#setdataloading)

***

### setTcOffset()

> **setTcOffset**(): `void`

Defined in: src/app/core/plugin/plugin-base.ts:91

#### Returns

`void`

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`setTcOffset`](../../../../core/plugin/plugin-base/classes/PluginBase.md#settcoffset)

***

### setThumbnail()

> **setThumbnail**(`url`, `currentTime`): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:1016

#### Parameters

##### url

`any`

##### currentTime

`any`

#### Returns

`void`

***

### setVideoAspectRatio()

> **setVideoAspectRatio**(`ratio`): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:1210

Set aspect Ratio

#### Parameters

##### ratio

`any`

#### Returns

`void`

***

### switchDisplayCurrentTime()

> **switchDisplayCurrentTime**(): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:1277

switch timeCode display onclick

#### Returns

`void`

***

### togglePlaybackrate()

> **togglePlaybackrate**(`value`): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:1497

#### Parameters

##### value

`any`

#### Returns

`void`

***

### unmute()

> **unmute**(): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:1340

unmute sound

#### Returns

`void`

***

### updatePinAndSpeedSliderPositions()

> **updatePinAndSpeedSliderPositions**(): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:306

#### Returns

`void`

***

### updateSubtitleInfos()

> **updateSubtitleInfos**(): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:1160

#### Returns

`void`

***

### updateSubtitlePosition()

> **updateSubtitlePosition**(`subtitlePosition?`): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:1144

update position subtitle onclick

#### Parameters

##### subtitlePosition?

`string`

subtitle position

#### Returns

`void`

***

### updateThumbnail()

> **updateThumbnail**(`event`): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:1005

Handle thumbnail pos

#### Parameters

##### event

`MouseEvent`

mouse event

#### Returns

`void`

***

### volumeMouseEnter()

> **volumeMouseEnter**(`data`): `void`

Defined in: src/app/plugins/control-bar/control-bar-plugin.component.ts:1314

#### Parameters

##### data

`any`

#### Returns

`void`
