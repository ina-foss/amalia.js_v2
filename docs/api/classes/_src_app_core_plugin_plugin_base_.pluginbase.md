[Amalia](../README.md) › [Globals](../globals.md) › ["src/app/core/plugin/plugin-base"](../modules/_src_app_core_plugin_plugin_base_.md) › [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md)

# Class: PluginBase <**T**>

Base class for create plugin

## Type parameters

▪ **T**

## Hierarchy

* **PluginBase**

  ↳ [TimeBarPluginComponent](_src_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md)

  ↳ [ControlBarPluginComponent](_src_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md)

  ↳ [TranscriptionPluginComponent](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md)

  ↳ [SubtitlesPluginComponent](_src_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md)

  ↳ [StoryboardPluginComponent](_src_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md)

  ↳ [HistogramPluginComponent](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md)

  ↳ [TimelinePluginComponent](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md)

## Implements

* OnInit

## Index

### Constructors

* [constructor](_src_app_core_plugin_plugin_base_.pluginbase.md#protected-constructor)

### Properties

* [_player](_src_app_core_plugin_plugin_base_.pluginbase.md#_player)
* [_pluginConfiguration](_src_app_core_plugin_plugin_base_.pluginbase.md#_pluginconfiguration)
* [fps](_src_app_core_plugin_plugin_base_.pluginbase.md#fps)
* [logger](_src_app_core_plugin_plugin_base_.pluginbase.md#protected-logger)
* [mediaPlayerElement](_src_app_core_plugin_plugin_base_.pluginbase.md#mediaplayerelement)
* [playerId](_src_app_core_plugin_plugin_base_.pluginbase.md#playerid)
* [playerService](_src_app_core_plugin_plugin_base_.pluginbase.md#playerservice)
* [pluginInstance](_src_app_core_plugin_plugin_base_.pluginbase.md#plugininstance)
* [pluginName](_src_app_core_plugin_plugin_base_.pluginbase.md#protected-pluginname)
* [tcOffset](_src_app_core_plugin_plugin_base_.pluginbase.md#tcoffset)
* [timeFormat](_src_app_core_plugin_plugin_base_.pluginbase.md#timeformat)

### Accessors

* [player](_src_app_core_plugin_plugin_base_.pluginbase.md#player)
* [pluginConfiguration](_src_app_core_plugin_plugin_base_.pluginbase.md#pluginconfiguration)

### Methods

* [getDefaultConfig](_src_app_core_plugin_plugin_base_.pluginbase.md#abstract-getdefaultconfig)
* [init](_src_app_core_plugin_plugin_base_.pluginbase.md#init)
* [ngOnInit](_src_app_core_plugin_plugin_base_.pluginbase.md#ngoninit)

## Constructors

### `Protected` constructor

\+ **new PluginBase**(`playerService`: [MediaPlayerService](_src_app_service_media_player_service_.mediaplayerservice.md), `pluginName`: any): *[PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md)*

Defined in src/app/core/plugin/plugin-base.ts:57

Plugin base constructor

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`playerService` | [MediaPlayerService](_src_app_service_media_player_service_.mediaplayerservice.md) | player service |
`pluginName` | any | plugin name, user for get configuration  |

**Returns:** *[PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md)*

## Properties

###  _player

• **_player**: *any*

Defined in src/app/core/plugin/plugin-base.ts:22

This plugin configuration

___

###  _pluginConfiguration

• **_pluginConfiguration**: *[PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹T›*

Defined in src/app/core/plugin/plugin-base.ts:33

___

###  fps

• **fps**: *any*

Defined in src/app/core/plugin/plugin-base.ts:18

___

### `Protected` logger

• **logger**: *[DefaultLogger](_src_app_core_logger_default_logger_.defaultlogger.md)*

Defined in src/app/core/plugin/plugin-base.ts:57

___

###  mediaPlayerElement

• **mediaPlayerElement**: *[MediaPlayerElement](_src_app_core_media_player_element_.mediaplayerelement.md)*

Defined in src/app/core/plugin/plugin-base.ts:55

___

###  playerId

• **playerId**: *any* = null

Defined in src/app/core/plugin/plugin-base.ts:15

___

###  playerService

• **playerService**: *[MediaPlayerService](_src_app_service_media_player_service_.mediaplayerservice.md)*

Defined in src/app/core/plugin/plugin-base.ts:52

___

###  pluginInstance

• **pluginInstance**: *string* = ""

Defined in src/app/core/plugin/plugin-base.ts:54

___

### `Protected` pluginName

• **pluginName**: *string*

Defined in src/app/core/plugin/plugin-base.ts:56

___

###  tcOffset

• **tcOffset**: *any*

Defined in src/app/core/plugin/plugin-base.ts:17

___

###  timeFormat

• **timeFormat**: *any*

Defined in src/app/core/plugin/plugin-base.ts:16

## Accessors

###  player

• **get player**(): *any*

Defined in src/app/core/plugin/plugin-base.ts:24

**Returns:** *any*

• **set player**(`value`: any): *void*

Defined in src/app/core/plugin/plugin-base.ts:29

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *void*

___

###  pluginConfiguration

• **get pluginConfiguration**(): *[PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹T›*

Defined in src/app/core/plugin/plugin-base.ts:35

**Returns:** *[PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹T›*

• **set pluginConfiguration**(`value`: [PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹T›): *void*

Defined in src/app/core/plugin/plugin-base.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`value` | [PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹T› |

**Returns:** *void*

## Methods

### `Abstract` getDefaultConfig

▸ **getDefaultConfig**(): *[PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹T›*

Defined in src/app/core/plugin/plugin-base.ts:119

**Returns:** *[PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹T›*

___

###  init

▸ **init**(): *void*

Defined in src/app/core/plugin/plugin-base.ts:85

**Returns:** *void*

___

###  ngOnInit

▸ **ngOnInit**(): *void*

Defined in src/app/core/plugin/plugin-base.ts:70

**Returns:** *void*
