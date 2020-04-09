[Amalia](../README.md) › [Globals](../globals.md) › ["app/core/plugin/plugin-base"](../modules/_app_core_plugin_plugin_base_.md) › [PluginBase](_app_core_plugin_plugin_base_.pluginbase.md)

# Class: PluginBase <**T**>

Base class for create plugin

## Type parameters

▪ **T**

## Hierarchy

* **PluginBase**

  ↳ [TimeBarPluginComponent](_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md)

  ↳ [ControlBarPluginComponent](_app_plugins_control_bar_control_bar_plugin_component_.controlbarplugincomponent.md)

  ↳ [TranscriptionPluginComponent](_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md)

  ↳ [SubtitlesPluginComponent](_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md)

  ↳ [StoryboardPluginComponent](_app_plugins_storyboard_storyboard_plugin_component_.storyboardplugincomponent.md)

  ↳ [HistogramPluginComponent](_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md)

## Implements

* OnInit

## Index

### Constructors

* [constructor](_app_core_plugin_plugin_base_.pluginbase.md#protected-constructor)

### Properties

* [_player](_app_core_plugin_plugin_base_.pluginbase.md#private-_player)
* [_pluginConfiguration](_app_core_plugin_plugin_base_.pluginbase.md#private-_pluginconfiguration)
* [logger](_app_core_plugin_plugin_base_.pluginbase.md#protected-logger)
* [mediaPlayerElement](_app_core_plugin_plugin_base_.pluginbase.md#mediaplayerelement)
* [playerId](_app_core_plugin_plugin_base_.pluginbase.md#playerid)
* [playerService](_app_core_plugin_plugin_base_.pluginbase.md#playerservice)
* [pluginName](_app_core_plugin_plugin_base_.pluginbase.md#protected-pluginname)

### Accessors

* [player](_app_core_plugin_plugin_base_.pluginbase.md#player)
* [pluginConfiguration](_app_core_plugin_plugin_base_.pluginbase.md#pluginconfiguration)

### Methods

* [getDefaultConfig](_app_core_plugin_plugin_base_.pluginbase.md#abstract-getdefaultconfig)
* [init](_app_core_plugin_plugin_base_.pluginbase.md#init)
* [ngOnInit](_app_core_plugin_plugin_base_.pluginbase.md#ngoninit)

## Constructors

### `Protected` constructor

\+ **new PluginBase**(`playerService`: [MediaPlayerService](_app_service_media_player_service_.mediaplayerservice.md), `pluginName`: any): *[PluginBase](_app_core_plugin_plugin_base_.pluginbase.md)*

Defined in src/app/core/plugin/plugin-base.ts:55

Plugin base constructor

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`playerService` | [MediaPlayerService](_app_service_media_player_service_.mediaplayerservice.md) | player service |
`pluginName` | any | plugin name, user for get configuration  |

**Returns:** *[PluginBase](_app_core_plugin_plugin_base_.pluginbase.md)*

## Properties

### `Private` _player

• **_player**: *any*

Defined in src/app/core/plugin/plugin-base.ts:21

This plugin configuration

___

### `Private` _pluginConfiguration

• **_pluginConfiguration**: *[PluginConfigData](../interfaces/_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹T›*

Defined in src/app/core/plugin/plugin-base.ts:33

___

### `Protected` logger

• **logger**: *[DefaultLogger](_app_core_logger_default_logger_.defaultlogger.md)*

Defined in src/app/core/plugin/plugin-base.ts:55

___

###  mediaPlayerElement

• **mediaPlayerElement**: *[MediaPlayerElement](_app_core_media_player_element_.mediaplayerelement.md)*

Defined in src/app/core/plugin/plugin-base.ts:53

___

###  playerId

• **playerId**: *any* = null

Defined in src/app/core/plugin/plugin-base.ts:16

___

###  playerService

• **playerService**: *[MediaPlayerService](_app_service_media_player_service_.mediaplayerservice.md)*

Defined in src/app/core/plugin/plugin-base.ts:52

___

### `Protected` pluginName

• **pluginName**: *string*

Defined in src/app/core/plugin/plugin-base.ts:54

## Accessors

###  player

• **get player**(): *any*

Defined in src/app/core/plugin/plugin-base.ts:23

**Returns:** *any*

• **set player**(`value`: any): *void*

Defined in src/app/core/plugin/plugin-base.ts:28

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *void*

___

###  pluginConfiguration

• **get pluginConfiguration**(): *[PluginConfigData](../interfaces/_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹T›*

Defined in src/app/core/plugin/plugin-base.ts:35

**Returns:** *[PluginConfigData](../interfaces/_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹T›*

• **set pluginConfiguration**(`value`: [PluginConfigData](../interfaces/_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹T›): *void*

Defined in src/app/core/plugin/plugin-base.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`value` | [PluginConfigData](../interfaces/_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹T› |

**Returns:** *void*

## Methods

### `Abstract` getDefaultConfig

▸ **getDefaultConfig**(): *[PluginConfigData](../interfaces/_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹T›*

Defined in src/app/core/plugin/plugin-base.ts:108

**Returns:** *[PluginConfigData](../interfaces/_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹T›*

___

###  init

▸ **init**(): *void*

Defined in src/app/core/plugin/plugin-base.ts:77

**Returns:** *void*

___

###  ngOnInit

▸ **ngOnInit**(): *void*

Defined in src/app/core/plugin/plugin-base.ts:68

**Returns:** *void*
