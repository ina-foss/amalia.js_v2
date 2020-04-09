[Amalia](../README.md) › [Globals](../globals.md) › ["app/plugins/control-bar/control-bar-plugin.component"](../modules/_app_plugins_control_bar_control_bar_plugin_component_.md) › [ControlBarPluginComponent](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md)

# Class: ControlBarPluginComponent

## Hierarchy

* [PluginBase](_app_core_plugin_plugin_base_.pluginbase.md)‹Array‹[ControlBarConfig](../interfaces/_app_core_config_model_control_bar_config_.controlbarconfig.md)››

  ↳ **ControlBarPluginComponent**

## Implements

* OnInit

## Index

### Constructors

* [constructor](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#constructor)

### Properties

* [activated](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#activated)
* [aspectRatio](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#aspectratio)
* [backwardPlaybackRateStep](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#backwardplaybackratestep)
* [currentPlaybackRate](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#currentplaybackrate)
* [currentTime](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#currenttime)
* [duration](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#duration)
* [elements](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#elements)
* [enableListPositionsSubtitle](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#enablelistpositionssubtitle)
* [enableThumbnail](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#enablethumbnail)
* [enableVolumeSlider](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#enablevolumeslider)
* [forwardPlaybackRateStep](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#forwardplaybackratestep)
* [inSliding](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#insliding)
* [logger](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#protected-logger)
* [maxPlaybackRateSlider](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#maxplaybackrateslider)
* [mediaPlayerElement](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#mediaplayerelement)
* [minPlaybackRateSlider](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#minplaybackrateslider)
* [playerId](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#playerid)
* [playerService](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#playerservice)
* [pluginName](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#protected-pluginname)
* [position](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#position)
* [progressBarValue](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#progressbarvalue)
* [sliderListOfPlaybackRateCustomSteps](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#sliderlistofplaybackratecustomsteps)
* [sliderListOfPlaybackRateStep](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#sliderlistofplaybackratestep)
* [sliderListOfPlaybackRateStepWidth](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#sliderlistofplaybackratestepwidth)
* [stepPlaybackRateSlider](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#stepplaybackrateslider)
* [thumbnailHidden](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#thumbnailhidden)
* [thumbnailPosition](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#thumbnailposition)
* [thumbnailUrl](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#thumbnailurl)
* [volumeLeft](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#volumeleft)
* [volumeRight](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#volumeright)
* [PLUGIN_NAME](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#static-plugin_name)

### Accessors

* [player](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#player)
* [pluginConfiguration](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#pluginconfiguration)

### Methods

* [buildSliderSteps](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#private-buildslidersteps)
* [changeAspectRatio](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#changeaspectratio)
* [changePlaybackRate](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#private-changeplaybackrate)
* [changeSameVolumeState](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#changesamevolumestate)
* [changeVolume](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#changevolume)
* [controlClicked](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#controlclicked)
* [getControlsByZone](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#getcontrolsbyzone)
* [getDefaultConfig](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#getdefaultconfig)
* [getPlaybackStepValue](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#private-getplaybackstepvalue)
* [handleAspectRatioChange](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#private-handleaspectratiochange)
* [handleOnDurationChange](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#private-handleondurationchange)
* [handleOnTimeChange](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#private-handleontimechange)
* [handleOnVolumeChange](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#private-handleonvolumechange)
* [handlePlaybackRateChange](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#private-handleplaybackratechange)
* [handlePlayerMouseenter](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#private-handleplayermouseenter)
* [handlePlayerMouseleave](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#private-handleplayermouseleave)
* [handleProgressBarMouseDown](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#handleprogressbarmousedown)
* [handleProgressBarMouseMove](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#handleprogressbarmousemove)
* [handleProgressBarMouseUp](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#handleprogressbarmouseup)
* [hasComponentWithoutZone](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#hascomponentwithoutzone)
* [init](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#init)
* [moveSliderCursor](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#moveslidercursor)
* [nextPlaybackRate](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#private-nextplaybackrate)
* [ngOnInit](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#ngoninit)
* [onChangePlaybackRate](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#onchangeplaybackrate)
* [prevPlaybackRate](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#private-prevplaybackrate)
* [progressBarMouseEnter](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#progressbarmouseenter)
* [progressBarMouseLeave](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#progressbarmouseleave)
* [progressBarMouseMove](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#progressbarmousemove)
* [setupAudioNodes](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#setupaudionodes)
* [updateSubtitlePosition](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#updatesubtitleposition)
* [updateThumbnail](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md#private-updatethumbnail)

## Constructors

###  constructor

\+ **new ControlBarPluginComponent**(`playerService`: [MediaPlayerService](_app_service_media_player_service_.mediaplayerservice.md)): *[ControlBarPluginComponent](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md)*

*Overrides [PluginBase](_app_core_plugin_plugin_base_.pluginbase.md).[constructor](_app_core_plugin_plugin_base_.pluginbase.md#protected-constructor)*

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:125

**Parameters:**

Name | Type |
------ | ------ |
`playerService` | [MediaPlayerService](_app_service_media_player_service_.mediaplayerservice.md) |

**Returns:** *[ControlBarPluginComponent](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md)*

## Properties

###  activated

• **activated**: *boolean* = true

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:117

State of controlBar

___

###  aspectRatio

• **aspectRatio**: *"16:9" | "4:3"* = "4:3"

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:72

Selected aspectRatio

___

###  backwardPlaybackRateStep

• **backwardPlaybackRateStep**: *Array‹number›* = [-1, -2, -6, -10]

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:53

list of backward playback step

___

###  currentPlaybackRate

• **currentPlaybackRate**: *number* = 1

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:96

Player playback rate

___

###  currentTime

• **currentTime**: *number* = 0

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:77

return  current time

___

###  duration

• **duration**: *number* = 0

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:86

Media duration

___

###  elements

• **elements**: *any*

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:113

List of control for Zone 1

___

###  enableListPositionsSubtitle

• **enableListPositionsSubtitle**: *boolean* = false

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:109

List positions subtitle state

___

###  enableThumbnail

• **enableThumbnail**: *boolean* = false

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:121

Handle thumbnail

___

###  enableVolumeSlider

• **enableVolumeSlider**: *boolean* = false

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:101

Volume slider state

___

###  forwardPlaybackRateStep

• **forwardPlaybackRateStep**: *Array‹number›* = [2, 6, 10]

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:58

list of forward playback step

___

###  inSliding

• **inSliding**: *boolean* = false

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:91

In sliding

___

### `Protected` logger

• **logger**: *[DefaultLogger](_app_core_logger_default_logger_.defaultlogger.md)*

*Inherited from [PluginBase](_app_core_plugin_plugin_base_.pluginbase.md).[logger](_app_core_plugin_plugin_base_.pluginbase.md#protected-logger)*

Defined in src/app/core/plugin/plugin-base.ts:55

___

###  maxPlaybackRateSlider

• **maxPlaybackRateSlider**: *number* = 10

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:29

Max playback rate

___

###  mediaPlayerElement

• **mediaPlayerElement**: *[MediaPlayerElement](_app_core_media_player_element_.mediaplayerelement.md)*

*Inherited from [PluginBase](_app_core_plugin_plugin_base_.pluginbase.md).[mediaPlayerElement](_app_core_plugin_plugin_base_.pluginbase.md#mediaplayerelement)*

Defined in src/app/core/plugin/plugin-base.ts:53

___

###  minPlaybackRateSlider

• **minPlaybackRateSlider**: *number* = -10

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:23

Min playback rate

___

###  playerId

• **playerId**: *any* = null

*Inherited from [PluginBase](_app_core_plugin_plugin_base_.pluginbase.md).[playerId](_app_core_plugin_plugin_base_.pluginbase.md#playerid)*

Defined in src/app/core/plugin/plugin-base.ts:16

___

###  playerService

• **playerService**: *[MediaPlayerService](_app_service_media_player_service_.mediaplayerservice.md)*

*Inherited from [PluginBase](_app_core_plugin_plugin_base_.pluginbase.md).[playerService](_app_core_plugin_plugin_base_.pluginbase.md#playerservice)*

Defined in src/app/core/plugin/plugin-base.ts:52

___

### `Protected` pluginName

• **pluginName**: *string*

*Inherited from [PluginBase](_app_core_plugin_plugin_base_.pluginbase.md).[pluginName](_app_core_plugin_plugin_base_.pluginbase.md#protected-pluginname)*

Defined in src/app/core/plugin/plugin-base.ts:54

___

###  position

• **position**: *string* = "none"

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:105

position of subtitles

___

###  progressBarValue

• **progressBarValue**: *number* = 0

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:82

Progress bar value

___

###  sliderListOfPlaybackRateCustomSteps

• **sliderListOfPlaybackRateCustomSteps**: *Array‹number›* = [-10, -8, -6, -4, -2, -1, -0.5, -0.25, 0, 0.25, 0.5, 1, 1.5, 2, 4, 6, 8, 10]

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:47

List of playback rate

___

###  sliderListOfPlaybackRateStep

• **sliderListOfPlaybackRateStep**: *Array‹number›* = [-10, -8, -6, -4, -2, -1, 0, 1, 2, 4, 6, 8, 10]

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:41

list playback rate step (2/6/8)

___

###  sliderListOfPlaybackRateStepWidth

• **sliderListOfPlaybackRateStepWidth**: *Array‹number›* = []

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:125

___

###  stepPlaybackRateSlider

• **stepPlaybackRateSlider**: *number* = 0.05

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:35

Playback rate step

___

###  thumbnailHidden

• **thumbnailHidden**: *boolean* = true

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:122

___

###  thumbnailPosition

• **thumbnailPosition**: *number* = 0

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:124

___

###  thumbnailUrl

• **thumbnailUrl**: *string*

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:123

___

###  volumeLeft

• **volumeLeft**: *number* = 100

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:62

Volume left side

___

###  volumeRight

• **volumeRight**: *number* = 100

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:67

Volume right side

___

### `Static` PLUGIN_NAME

▪ **PLUGIN_NAME**: *string* = "CONTROL_BAR"

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:18

## Accessors

###  player

• **get player**(): *any*

*Inherited from [PluginBase](_app_core_plugin_plugin_base_.pluginbase.md).[player](_app_core_plugin_plugin_base_.pluginbase.md#player)*

Defined in src/app/core/plugin/plugin-base.ts:23

**Returns:** *any*

• **set player**(`value`: any): *void*

*Inherited from [PluginBase](_app_core_plugin_plugin_base_.pluginbase.md).[player](_app_core_plugin_plugin_base_.pluginbase.md#player)*

Defined in src/app/core/plugin/plugin-base.ts:28

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *void*

___

###  pluginConfiguration

• **get pluginConfiguration**(): *[PluginConfigData](../interfaces/_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹Array‹[ControlBarConfig](../interfaces/_app_core_config_model_control_bar_config_.controlbarconfig.md)››*

*Inherited from [PluginBase](_app_core_plugin_plugin_base_.pluginbase.md).[pluginConfiguration](_app_core_plugin_plugin_base_.pluginbase.md#pluginconfiguration)*

Defined in src/app/core/plugin/plugin-base.ts:35

**Returns:** *[PluginConfigData](../interfaces/_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹Array‹[ControlBarConfig](../interfaces/_app_core_config_model_control_bar_config_.controlbarconfig.md)››*

• **set pluginConfiguration**(`value`: [PluginConfigData](../interfaces/_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹Array‹[ControlBarConfig](../interfaces/_app_core_config_model_control_bar_config_.controlbarconfig.md)››): *void*

*Inherited from [PluginBase](_app_core_plugin_plugin_base_.pluginbase.md).[pluginConfiguration](_app_core_plugin_plugin_base_.pluginbase.md#pluginconfiguration)*

Defined in src/app/core/plugin/plugin-base.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`value` | [PluginConfigData](../interfaces/_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹Array‹[ControlBarConfig](../interfaces/_app_core_config_model_control_bar_config_.controlbarconfig.md)›› |

**Returns:** *void*

## Methods

### `Private` buildSliderSteps

▸ **buildSliderSteps**(): *void*

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:366

In charge to build step width size

**Returns:** *void*

___

###  changeAspectRatio

▸ **changeAspectRatio**(): *void*

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:255

Invoked for change aspect ratio

**Returns:** *void*

___

### `Private` changePlaybackRate

▸ **changePlaybackRate**(`value`: number): *void*

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:417

Invoked for change playback rate

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*

___

###  changeSameVolumeState

▸ **changeSameVolumeState**(): *void*

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:271

Change volume state

**Returns:** *void*

___

###  changeVolume

▸ **changeVolume**(`value`: string | number, `volumeSide?`: string): *void*

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:228

Change volume

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | string &#124; number | volume percentage |
`volumeSide?` | string | volume side (l or r)  |

**Returns:** *void*

___

###  controlClicked

▸ **controlClicked**(`control`: string): *void*

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:169

Invoked player with specified control function name

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`control` | string | control name  |

**Returns:** *void*

___

###  getControlsByZone

▸ **getControlsByZone**(`zone`: number): *Array‹[ControlBarConfig](../interfaces/_app_core_config_model_control_bar_config_.controlbarconfig.md)›*

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:282

Return list controls by zone id

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`zone` | number | zone id  |

**Returns:** *Array‹[ControlBarConfig](../interfaces/_app_core_config_model_control_bar_config_.controlbarconfig.md)›*

___

###  getDefaultConfig

▸ **getDefaultConfig**(): *[PluginConfigData](../interfaces/_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹Array‹[ControlBarConfig](../interfaces/_app_core_config_model_control_bar_config_.controlbarconfig.md)››*

*Overrides [PluginBase](_app_core_plugin_plugin_base_.pluginbase.md).[getDefaultConfig](_app_core_plugin_plugin_base_.pluginbase.md#abstract-getdefaultconfig)*

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:153

Return plugin configuration

**Returns:** *[PluginConfigData](../interfaces/_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹Array‹[ControlBarConfig](../interfaces/_app_core_config_model_control_bar_config_.controlbarconfig.md)››*

___

### `Private` getPlaybackStepValue

▸ **getPlaybackStepValue**(`playbackRateStep`: Array‹number›): *number*

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:404

Return playback step value

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`playbackRateStep` | Array‹number› | list of steps |

**Returns:** *number*

return playback step

___

### `Private` handleAspectRatioChange

▸ **handleAspectRatioChange**(`event`: any): *void*

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:468

Invoked on aspect ratio change

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`event` | any | aspect ratio  |

**Returns:** *void*

___

### `Private` handleOnDurationChange

▸ **handleOnDurationChange**(): *void*

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:448

Invoked on duration change

**Returns:** *void*

___

### `Private` handleOnTimeChange

▸ **handleOnTimeChange**(): *void*

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:427

Invoked time change event for :
- update progress bar

**Returns:** *void*

___

### `Private` handleOnVolumeChange

▸ **handleOnVolumeChange**(): *void*

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:439

Invoked on volume change :
- change left volume

**Returns:** *void*

___

### `Private` handlePlaybackRateChange

▸ **handlePlaybackRateChange**(`playbackRate`: number): *void*

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:458

Invoked on playback change

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`playbackRate` | number | playback rate  |

**Returns:** *void*

___

### `Private` handlePlayerMouseenter

▸ **handlePlayerMouseenter**(): *void*

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:483

Invoked player mouse enter event for :
- animate controlBar

**Returns:** *void*

___

### `Private` handlePlayerMouseleave

▸ **handlePlayerMouseleave**(): *void*

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:491

Invoked player mouse leave event for :
- animate controlBar

**Returns:** *void*

___

###  handleProgressBarMouseDown

▸ **handleProgressBarMouseDown**(`value`: any): *void*

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:326

Progress bar on mouse down

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | any | mouse event  |

**Returns:** *void*

___

###  handleProgressBarMouseMove

▸ **handleProgressBarMouseMove**(`value`: any): *void*

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:345

Progress bar on mouse move

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | any | mouse event  |

**Returns:** *void*

___

###  handleProgressBarMouseUp

▸ **handleProgressBarMouseUp**(`value`: any): *void*

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:335

Progress bar on mouse up

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | any | mouse event  |

**Returns:** *void*

___

###  hasComponentWithoutZone

▸ **hasComponentWithoutZone**(`componentName`: string): *boolean*

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:236

Return true if the component is in ths configuration without zone

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`componentName` | string | compoent name  |

**Returns:** *boolean*

___

###  init

▸ **init**(): *void*

*Overrides [PluginBase](_app_core_plugin_plugin_base_.pluginbase.md).[init](_app_core_plugin_plugin_base_.pluginbase.md#init)*

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:133

**Returns:** *void*

___

###  moveSliderCursor

▸ **moveSliderCursor**(`value`: any): *void*

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:245

Invoked on mouse move

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | any | change value  |

**Returns:** *void*

___

### `Private` nextPlaybackRate

▸ **nextPlaybackRate**(): *void*

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:395

Invoked for change playback rate

**Returns:** *void*

___

###  ngOnInit

▸ **ngOnInit**(): *void*

*Inherited from [PluginBase](_app_core_plugin_plugin_base_.pluginbase.md).[ngOnInit](_app_core_plugin_plugin_base_.pluginbase.md#ngoninit)*

Defined in src/app/core/plugin/plugin-base.ts:68

**Returns:** *void*

___

###  onChangePlaybackRate

▸ **onChangePlaybackRate**(`value`: any): *void*

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:262

Invoked on change playback rate

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *void*

___

### `Private` prevPlaybackRate

▸ **prevPlaybackRate**(): *void*

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:388

Invoked for change playback rate

**Returns:** *void*

___

###  progressBarMouseEnter

▸ **progressBarMouseEnter**(`event`: MouseEvent): *void*

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:293

Handle mouse enter on progress bar

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`event` | MouseEvent | mouse enter  |

**Returns:** *void*

___

###  progressBarMouseLeave

▸ **progressBarMouseLeave**(`event`: MouseEvent): *void*

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:304

Handle mouse leave on progress bar

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`event` | MouseEvent | mouse leave  |

**Returns:** *void*

___

###  progressBarMouseMove

▸ **progressBarMouseMove**(`event`: MouseEvent): *void*

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:315

Handle mouse move on progress bar

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`event` | MouseEvent | mouse move  |

**Returns:** *void*

___

###  setupAudioNodes

▸ **setupAudioNodes**(`data`: any): *void*

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:475

Invoked on volume button hover

**Parameters:**

Name | Type |
------ | ------ |
`data` | any |

**Returns:** *void*

___

###  updateSubtitlePosition

▸ **updateSubtitlePosition**(`position`: string): *void*

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:499

update position subtitle onclick

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`position` | string |   |

**Returns:** *void*

___

### `Private` updateThumbnail

▸ **updateThumbnail**(`event`: MouseEvent): *void*

Defined in src/app/plugins/control-bar/control-bar-plugin.component.ts:355

Handle thumbnail pos

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`event` | MouseEvent | mouse event  |

**Returns:** *void*
