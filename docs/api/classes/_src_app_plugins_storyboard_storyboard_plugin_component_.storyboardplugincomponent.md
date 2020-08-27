[Amalia](../README.md) › [Globals](../globals.md) › ["src/app/plugins/storyboard/storyboard-plugin.component"](../modules/_src_app_plugins_storyboard_storyboard_plugin_component_.md) › [StoryboardPluginComponent](_src_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md)

# Class: StoryboardPluginComponent

## Hierarchy

* [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md)‹[StoryboardConfig](../interfaces/_src_app_core_config_model_storyboard_config_.storyboardconfig.md)›

  ↳ **StoryboardPluginComponent**

## Implements

* OnInit
* OnInit

## Index

### Constructors

* [constructor](_src_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#constructor)

### Properties

* [baseUrl](_src_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#baseurl)
* [displayFormat](_src_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#displayformat)
* [duration](_src_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#duration)
* [enableLabel](_src_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#enablelabel)
* [fps](_src_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#fps)
* [frameIntervals](_src_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#frameintervals)
* [listOfThumbnail](_src_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#listofthumbnail)
* [logger](_src_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#protected-logger)
* [mediaPlayerElement](_src_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#mediaplayerelement)
* [openIntervalList](_src_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#openintervallist)
* [playerId](_src_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#playerid)
* [playerService](_src_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#playerservice)
* [pluginName](_src_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#protected-pluginname)
* [selectedInterval](_src_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#selectedinterval)
* [size](_src_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#size)
* [tcIntervals](_src_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#tcintervals)
* [tcOffset](_src_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#tcoffset)
* [theme](_src_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#theme)
* [timeFormat](_src_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#timeformat)
* [PLUGIN_NAME](_src_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#static-plugin_name)

### Accessors

* [player](_src_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#player)
* [pluginConfiguration](_src_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#pluginconfiguration)

### Methods

* [getDefaultConfig](_src_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#getdefaultconfig)
* [handleDurationChange](_src_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#private-handledurationchange)
* [init](_src_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#init)
* [initStoryboard](_src_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#initstoryboard)
* [ngOnInit](_src_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#ngoninit)
* [seekToTc](_src_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#seektotc)
* [selectedThumbnailSize](_src_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#selectedthumbnailsize)
* [updateThumbnailSize](_src_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#private-updatethumbnailsize)

## Constructors

###  constructor

\+ **new StoryboardPluginComponent**(`playerService`: [MediaPlayerService](_src_app_service_media_player_service_.mediaplayerservice.md)): *[StoryboardPluginComponent](_src_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md)*

*Overrides [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[constructor](_src_app_core_plugin_plugin_base_.pluginbase.md#protected-constructor)*

Defined in src/app/plugins/storyboard/storyboard-plugin.component.ts:62

**Parameters:**

Name | Type |
------ | ------ |
`playerService` | [MediaPlayerService](_src_app_service_media_player_service_.mediaplayerservice.md) |

**Returns:** *[StoryboardPluginComponent](_src_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md)*

## Properties

###  baseUrl

• **baseUrl**: *string*

Defined in src/app/plugins/storyboard/storyboard-plugin.component.ts:18

___

###  displayFormat

• **displayFormat**: *"h" | "m" | "s" | "f" | "ms" | "mms"* = "f"

Defined in src/app/plugins/storyboard/storyboard-plugin.component.ts:31

Display format specifier h|m|s|f|ms|mms

___

###  duration

• **duration**: *number*

Defined in src/app/plugins/storyboard/storyboard-plugin.component.ts:23

Media duration

___

###  enableLabel

• **enableLabel**: *boolean*

Defined in src/app/plugins/storyboard/storyboard-plugin.component.ts:39

show time code label

___

###  fps

• **fps**: *number*

*Overrides [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[fps](_src_app_core_plugin_plugin_base_.pluginbase.md#fps)*

Defined in src/app/plugins/storyboard/storyboard-plugin.component.ts:35

Media fps

___

###  frameIntervals

• **frameIntervals**: *number[]* = [6, 60, 360]

Defined in src/app/plugins/storyboard/storyboard-plugin.component.ts:52

frame intervals

___

###  listOfThumbnail

• **listOfThumbnail**: *Array‹number›*

Defined in src/app/plugins/storyboard/storyboard-plugin.component.ts:19

___

### `Protected` logger

• **logger**: *[DefaultLogger](_src_app_core_logger_default_logger_.defaultlogger.md)*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[logger](_src_app_core_plugin_plugin_base_.pluginbase.md#protected-logger)*

Defined in src/app/core/plugin/plugin-base.ts:55

___

###  mediaPlayerElement

• **mediaPlayerElement**: *[MediaPlayerElement](_src_app_core_media_player_element_.mediaplayerelement.md)*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[mediaPlayerElement](_src_app_core_plugin_plugin_base_.pluginbase.md#mediaplayerelement)*

Defined in src/app/core/plugin/plugin-base.ts:53

___

###  openIntervalList

• **openIntervalList**: *boolean*

Defined in src/app/plugins/storyboard/storyboard-plugin.component.ts:62

state list of interval

___

###  playerId

• **playerId**: *any* = null

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[playerId](_src_app_core_plugin_plugin_base_.pluginbase.md#playerid)*

Defined in src/app/core/plugin/plugin-base.ts:15

___

###  playerService

• **playerService**: *[MediaPlayerService](_src_app_service_media_player_service_.mediaplayerservice.md)*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[playerService](_src_app_core_plugin_plugin_base_.pluginbase.md#playerservice)*

Defined in src/app/core/plugin/plugin-base.ts:52

___

### `Protected` pluginName

• **pluginName**: *string*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[pluginName](_src_app_core_plugin_plugin_base_.pluginbase.md#protected-pluginname)*

Defined in src/app/core/plugin/plugin-base.ts:54

___

###  selectedInterval

• **selectedInterval**: *[string, number]*

Defined in src/app/plugins/storyboard/storyboard-plugin.component.ts:57

Selected interval

___

###  size

• **size**: *"small" | "medium" | "large"* = "small"

Defined in src/app/plugins/storyboard/storyboard-plugin.component.ts:27

thumbnail size

___

###  tcIntervals

• **tcIntervals**: *number[]* = [10, 30, 60]

Defined in src/app/plugins/storyboard/storyboard-plugin.component.ts:48

Time code interval

___

###  tcOffset

• **tcOffset**: *any*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[tcOffset](_src_app_core_plugin_plugin_base_.pluginbase.md#tcoffset)*

Defined in src/app/core/plugin/plugin-base.ts:17

___

###  theme

• **theme**: *"v" | "h"* = "v"

Defined in src/app/plugins/storyboard/storyboard-plugin.component.ts:43

orientation of the plugin (horizontal|vertical)

___

###  timeFormat

• **timeFormat**: *any*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[timeFormat](_src_app_core_plugin_plugin_base_.pluginbase.md#timeformat)*

Defined in src/app/core/plugin/plugin-base.ts:16

___

### `Static` PLUGIN_NAME

▪ **PLUGIN_NAME**: *string* = "STORYBOARD"

Defined in src/app/plugins/storyboard/storyboard-plugin.component.ts:17

## Accessors

###  player

• **get player**(): *any*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[player](_src_app_core_plugin_plugin_base_.pluginbase.md#player)*

Defined in src/app/core/plugin/plugin-base.ts:24

**Returns:** *any*

• **set player**(`value`: any): *void*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[player](_src_app_core_plugin_plugin_base_.pluginbase.md#player)*

Defined in src/app/core/plugin/plugin-base.ts:29

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *void*

___

###  pluginConfiguration

• **get pluginConfiguration**(): *[PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[StoryboardConfig](../interfaces/_src_app_core_config_model_storyboard_config_.storyboardconfig.md)›*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[pluginConfiguration](_src_app_core_plugin_plugin_base_.pluginbase.md#pluginconfiguration)*

Defined in src/app/core/plugin/plugin-base.ts:35

**Returns:** *[PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[StoryboardConfig](../interfaces/_src_app_core_config_model_storyboard_config_.storyboardconfig.md)›*

• **set pluginConfiguration**(`value`: [PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[StoryboardConfig](../interfaces/_src_app_core_config_model_storyboard_config_.storyboardconfig.md)›): *void*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[pluginConfiguration](_src_app_core_plugin_plugin_base_.pluginbase.md#pluginconfiguration)*

Defined in src/app/core/plugin/plugin-base.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`value` | [PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[StoryboardConfig](../interfaces/_src_app_core_config_model_storyboard_config_.storyboardconfig.md)› |

**Returns:** *void*

## Methods

###  getDefaultConfig

▸ **getDefaultConfig**(): *[PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[StoryboardConfig](../interfaces/_src_app_core_config_model_storyboard_config_.storyboardconfig.md)›*

*Overrides [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[getDefaultConfig](_src_app_core_plugin_plugin_base_.pluginbase.md#abstract-getdefaultconfig)*

Defined in src/app/plugins/storyboard/storyboard-plugin.component.ts:110

Return default config

**Returns:** *[PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[StoryboardConfig](../interfaces/_src_app_core_config_model_storyboard_config_.storyboardconfig.md)›*

___

### `Private` handleDurationChange

▸ **handleDurationChange**(): *void*

Defined in src/app/plugins/storyboard/storyboard-plugin.component.ts:146

Invoked on duration change

**Returns:** *void*

___

###  init

▸ **init**(): *void*

*Overrides [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[init](_src_app_core_plugin_plugin_base_.pluginbase.md#init)*

Defined in src/app/plugins/storyboard/storyboard-plugin.component.ts:74

**Returns:** *void*

___

###  initStoryboard

▸ **initStoryboard**(): *void*

Defined in src/app/plugins/storyboard/storyboard-plugin.component.ts:92

Init storyboard

**Returns:** *void*

___

###  ngOnInit

▸ **ngOnInit**(): *void*

*Overrides [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[ngOnInit](_src_app_core_plugin_plugin_base_.pluginbase.md#ngoninit)*

Defined in src/app/plugins/storyboard/storyboard-plugin.component.ts:68

**Returns:** *void*

___

###  seekToTc

▸ **seekToTc**(`tc`: number): *void*

Defined in src/app/plugins/storyboard/storyboard-plugin.component.ts:128

Handle to seek to time code

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`tc` | number | time code  |

**Returns:** *void*

___

###  selectedThumbnailSize

▸ **selectedThumbnailSize**(`type`: string, `tc`: number): *void*

Defined in src/app/plugins/storyboard/storyboard-plugin.component.ts:137

handle change thumbnail size

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`type` | string | type interval |
`tc` | number | time code  |

**Returns:** *void*

___

### `Private` updateThumbnailSize

▸ **updateThumbnailSize**(): *void*

Defined in src/app/plugins/storyboard/storyboard-plugin.component.ts:153

Handle interval

**Returns:** *void*
