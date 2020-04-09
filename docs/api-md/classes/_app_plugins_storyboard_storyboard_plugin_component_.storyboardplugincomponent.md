[Amalia](../README.md) › [Globals](../globals.md) › ["app/plugins/storyboard/storyboard-plugin.component"](../modules/_app_plugins_storyboard_storyboard_plugin_component_.md) › [StoryboardPluginComponent](_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md)

# Class: StoryboardPluginComponent

## Hierarchy

* [PluginBase](_app_core_plugin_plugin_base_.pluginbase.md)‹[StoryboardConfig](../interfaces/_app_core_config_model_storyboard_config_.storyboardconfig.md)›

  ↳ **StoryboardPluginComponent**

## Implements

* OnInit
* OnInit

## Index

### Constructors

* [constructor](_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#constructor)

### Properties

* [baseUrl](_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#baseurl)
* [displayFormat](_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#displayformat)
* [duration](_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#duration)
* [enableLabel](_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#enablelabel)
* [fps](_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#fps)
* [frameIntervals](_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#frameintervals)
* [listOfThumbnail](_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#listofthumbnail)
* [logger](_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#protected-logger)
* [mediaPlayerElement](_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#mediaplayerelement)
* [openIntervalList](_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#openintervallist)
* [playerId](_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#playerid)
* [playerService](_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#playerservice)
* [pluginName](_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#protected-pluginname)
* [selectedInterval](_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#selectedinterval)
* [size](_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#size)
* [tcIntervals](_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#tcintervals)
* [PLUGIN_NAME](_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#static-plugin_name)

### Accessors

* [player](_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#player)
* [pluginConfiguration](_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#pluginconfiguration)

### Methods

* [getDefaultConfig](_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#getdefaultconfig)
* [handleDurationChange](_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#private-handledurationchange)
* [init](_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#init)
* [ngOnInit](_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#ngoninit)
* [seekToTc](_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#seektotc)
* [selectedThumbnailSize](_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#selectedthumbnailsize)
* [updateThumbnailSize](_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md#private-updatethumbnailsize)

## Constructors

###  constructor

\+ **new StoryboardPluginComponent**(`playerService`: [MediaPlayerService](_app_service_media_player_service_.mediaplayerservice.md)): *[StoryboardPluginComponent](_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md)*

*Overrides [PluginBase](_app_core_plugin_plugin_base_.pluginbase.md).[constructor](_app_core_plugin_plugin_base_.pluginbase.md#protected-constructor)*

Defined in src/app/plugins/storyboard/storyboard-plugin.component.ts:58

**Parameters:**

Name | Type |
------ | ------ |
`playerService` | [MediaPlayerService](_app_service_media_player_service_.mediaplayerservice.md) |

**Returns:** *[StoryboardPluginComponent](_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md)*

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

Defined in src/app/plugins/storyboard/storyboard-plugin.component.ts:35

Media fps

___

###  frameIntervals

• **frameIntervals**: *number[]* = [6, 60, 360]

Defined in src/app/plugins/storyboard/storyboard-plugin.component.ts:48

frame intervals

___

###  listOfThumbnail

• **listOfThumbnail**: *Array‹number›*

Defined in src/app/plugins/storyboard/storyboard-plugin.component.ts:19

___

### `Protected` logger

• **logger**: *[DefaultLogger](_app_core_logger_default_logger_.defaultlogger.md)*

*Inherited from [PluginBase](_app_core_plugin_plugin_base_.pluginbase.md).[logger](_app_core_plugin_plugin_base_.pluginbase.md#protected-logger)*

Defined in src/app/core/plugin/plugin-base.ts:55

___

###  mediaPlayerElement

• **mediaPlayerElement**: *[MediaPlayerElement](_app_core_media_player_element_.mediaplayerelement.md)*

*Inherited from [PluginBase](_app_core_plugin_plugin_base_.pluginbase.md).[mediaPlayerElement](_app_core_plugin_plugin_base_.pluginbase.md#mediaplayerelement)*

Defined in src/app/core/plugin/plugin-base.ts:53

___

###  openIntervalList

• **openIntervalList**: *boolean*

Defined in src/app/plugins/storyboard/storyboard-plugin.component.ts:58

state list of interval

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

###  selectedInterval

• **selectedInterval**: *[string, number]*

Defined in src/app/plugins/storyboard/storyboard-plugin.component.ts:53

Selected interval

___

###  size

• **size**: *"small" | "medium" | "large"* = "small"

Defined in src/app/plugins/storyboard/storyboard-plugin.component.ts:27

thumbnail size

___

###  tcIntervals

• **tcIntervals**: *number[]* = [10, 30, 60]

Defined in src/app/plugins/storyboard/storyboard-plugin.component.ts:44

Time code interval

___

### `Static` PLUGIN_NAME

▪ **PLUGIN_NAME**: *string* = "STORYBOARD"

Defined in src/app/plugins/storyboard/storyboard-plugin.component.ts:17

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

• **get pluginConfiguration**(): *[PluginConfigData](../interfaces/_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[StoryboardConfig](../interfaces/_app_core_config_model_storyboard_config_.storyboardconfig.md)›*

*Inherited from [PluginBase](_app_core_plugin_plugin_base_.pluginbase.md).[pluginConfiguration](_app_core_plugin_plugin_base_.pluginbase.md#pluginconfiguration)*

Defined in src/app/core/plugin/plugin-base.ts:35

**Returns:** *[PluginConfigData](../interfaces/_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[StoryboardConfig](../interfaces/_app_core_config_model_storyboard_config_.storyboardconfig.md)›*

• **set pluginConfiguration**(`value`: [PluginConfigData](../interfaces/_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[StoryboardConfig](../interfaces/_app_core_config_model_storyboard_config_.storyboardconfig.md)›): *void*

*Inherited from [PluginBase](_app_core_plugin_plugin_base_.pluginbase.md).[pluginConfiguration](_app_core_plugin_plugin_base_.pluginbase.md#pluginconfiguration)*

Defined in src/app/core/plugin/plugin-base.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`value` | [PluginConfigData](../interfaces/_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[StoryboardConfig](../interfaces/_app_core_config_model_storyboard_config_.storyboardconfig.md)› |

**Returns:** *void*

## Methods

###  getDefaultConfig

▸ **getDefaultConfig**(): *[PluginConfigData](../interfaces/_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[StoryboardConfig](../interfaces/_app_core_config_model_storyboard_config_.storyboardconfig.md)›*

*Overrides [PluginBase](_app_core_plugin_plugin_base_.pluginbase.md).[getDefaultConfig](_app_core_plugin_plugin_base_.pluginbase.md#abstract-getdefaultconfig)*

Defined in src/app/plugins/storyboard/storyboard-plugin.component.ts:84

Return default config

**Returns:** *[PluginConfigData](../interfaces/_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[StoryboardConfig](../interfaces/_app_core_config_model_storyboard_config_.storyboardconfig.md)›*

___

### `Private` handleDurationChange

▸ **handleDurationChange**(): *void*

Defined in src/app/plugins/storyboard/storyboard-plugin.component.ts:119

Invoked on duration change

**Returns:** *void*

___

###  init

▸ **init**(): *void*

*Overrides [PluginBase](_app_core_plugin_plugin_base_.pluginbase.md).[init](_app_core_plugin_plugin_base_.pluginbase.md#init)*

Defined in src/app/plugins/storyboard/storyboard-plugin.component.ts:70

**Returns:** *void*

___

###  ngOnInit

▸ **ngOnInit**(): *void*

*Overrides [PluginBase](_app_core_plugin_plugin_base_.pluginbase.md).[ngOnInit](_app_core_plugin_plugin_base_.pluginbase.md#ngoninit)*

Defined in src/app/plugins/storyboard/storyboard-plugin.component.ts:64

**Returns:** *void*

___

###  seekToTc

▸ **seekToTc**(`tc`: number): *void*

Defined in src/app/plugins/storyboard/storyboard-plugin.component.ts:101

Handle to seek to time code

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`tc` | number | time code  |

**Returns:** *void*

___

###  selectedThumbnailSize

▸ **selectedThumbnailSize**(`type`: string, `tc`: number): *void*

Defined in src/app/plugins/storyboard/storyboard-plugin.component.ts:110

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

Defined in src/app/plugins/storyboard/storyboard-plugin.component.ts:134

Handle interval

**Returns:** *void*
