[Amalia](../README.md) › [Globals](../globals.md) › ["app/plugins/subtitles/subtitles-plugin.component"](../modules/_app_plugins_subtitles_subtitles_plugin_component_.md) › [SubtitlesPluginComponent](_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md)

# Class: SubtitlesPluginComponent

## Hierarchy

* [PluginBase](_app_core_plugin_plugin_base_.pluginbase.md)‹[SubtitleConfig](../interfaces/_app_core_config_model_subtitle_config_.subtitleconfig.md)›

  ↳ **SubtitlesPluginComponent**

## Implements

* OnInit
* OnInit

## Index

### Constructors

* [constructor](_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md#constructor)

### Properties

* [currentTime](_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md#currenttime)
* [logger](_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md#protected-logger)
* [mediaPlayerElement](_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md#mediaplayerelement)
* [playerId](_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md#playerid)
* [playerService](_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md#playerservice)
* [pluginName](_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md#protected-pluginname)
* [posSubtitle](_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md#possubtitle)
* [subTitle](_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md#subtitle)
* [transcriptions](_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md#transcriptions)
* [PLUGIN_NAME](_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md#static-plugin_name)
* [TC_DELTA](_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md#static-tc_delta)

### Accessors

* [player](_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md#player)
* [pluginConfiguration](_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md#pluginconfiguration)

### Methods

* [changeSubtitlePosition](_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md#private-changesubtitleposition)
* [getDefaultConfig](_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md#getdefaultconfig)
* [handleMetadataLoaded](_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md#private-handlemetadataloaded)
* [handleOnTimeChange](_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md#private-handleontimechange)
* [init](_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md#init)
* [ngOnInit](_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md#ngoninit)
* [refreshMetadata](_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md#private-refreshmetadata)
* [updateSubtitleContent](_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md#private-updatesubtitlecontent)

## Constructors

###  constructor

\+ **new SubtitlesPluginComponent**(`playerService`: [MediaPlayerService](_app_service_media_player_service_.mediaplayerservice.md)): *[SubtitlesPluginComponent](_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md)*

*Overrides [PluginBase](_app_core_plugin_plugin_base_.pluginbase.md).[constructor](_app_core_plugin_plugin_base_.pluginbase.md#protected-constructor)*

Defined in src/app/plugins/subtitles/subtitles-plugin.component.ts:27

**Parameters:**

Name | Type |
------ | ------ |
`playerService` | [MediaPlayerService](_app_service_media_player_service_.mediaplayerservice.md) |

**Returns:** *[SubtitlesPluginComponent](_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md)*

## Properties

###  currentTime

• **currentTime**: *number*

Defined in src/app/plugins/subtitles/subtitles-plugin.component.ts:24

Return  current time

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

###  posSubtitle

• **posSubtitle**: *["none", "up", "down"]*

Defined in src/app/plugins/subtitles/subtitles-plugin.component.ts:27

___

###  subTitle

• **subTitle**: *string*

Defined in src/app/plugins/subtitles/subtitles-plugin.component.ts:25

___

###  transcriptions

• **transcriptions**: *Array‹[TranscriptionLocalisation](../interfaces/_app_core_metadata_model_transcription_localisation_.transcriptionlocalisation.md)›* = null

Defined in src/app/plugins/subtitles/subtitles-plugin.component.ts:26

___

### `Static` PLUGIN_NAME

▪ **PLUGIN_NAME**: *string* = "SUBTITLE"

Defined in src/app/plugins/subtitles/subtitles-plugin.component.ts:19

___

### `Static` TC_DELTA

▪ **TC_DELTA**: *number* = 0.5

Defined in src/app/plugins/subtitles/subtitles-plugin.component.ts:20

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

• **get pluginConfiguration**(): *[PluginConfigData](../interfaces/_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[SubtitleConfig](../interfaces/_app_core_config_model_subtitle_config_.subtitleconfig.md)›*

*Inherited from [PluginBase](_app_core_plugin_plugin_base_.pluginbase.md).[pluginConfiguration](_app_core_plugin_plugin_base_.pluginbase.md#pluginconfiguration)*

Defined in src/app/core/plugin/plugin-base.ts:35

**Returns:** *[PluginConfigData](../interfaces/_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[SubtitleConfig](../interfaces/_app_core_config_model_subtitle_config_.subtitleconfig.md)›*

• **set pluginConfiguration**(`value`: [PluginConfigData](../interfaces/_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[SubtitleConfig](../interfaces/_app_core_config_model_subtitle_config_.subtitleconfig.md)›): *void*

*Inherited from [PluginBase](_app_core_plugin_plugin_base_.pluginbase.md).[pluginConfiguration](_app_core_plugin_plugin_base_.pluginbase.md#pluginconfiguration)*

Defined in src/app/core/plugin/plugin-base.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`value` | [PluginConfigData](../interfaces/_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[SubtitleConfig](../interfaces/_app_core_config_model_subtitle_config_.subtitleconfig.md)› |

**Returns:** *void*

## Methods

### `Private` changeSubtitlePosition

▸ **changeSubtitlePosition**(`event`: any): *void*

Defined in src/app/plugins/subtitles/subtitles-plugin.component.ts:121

Invoked when user change subtitle position

**Parameters:**

Name | Type |
------ | ------ |
`event` | any |

**Returns:** *void*

___

###  getDefaultConfig

▸ **getDefaultConfig**(): *[PluginConfigData](../interfaces/_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[SubtitleConfig](../interfaces/_app_core_config_model_subtitle_config_.subtitleconfig.md)›*

*Overrides [PluginBase](_app_core_plugin_plugin_base_.pluginbase.md).[getDefaultConfig](_app_core_plugin_plugin_base_.pluginbase.md#abstract-getdefaultconfig)*

Defined in src/app/plugins/subtitles/subtitles-plugin.component.ts:49

Return default config

**Returns:** *[PluginConfigData](../interfaces/_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[SubtitleConfig](../interfaces/_app_core_config_model_subtitle_config_.subtitleconfig.md)›*

___

### `Private` handleMetadataLoaded

▸ **handleMetadataLoaded**(): *void*

Defined in src/app/plugins/subtitles/subtitles-plugin.component.ts:70

Invoked on metadata loaded

**Returns:** *void*

___

### `Private` handleOnTimeChange

▸ **handleOnTimeChange**(): *void*

Defined in src/app/plugins/subtitles/subtitles-plugin.component.ts:61

Invoked time change event for :
- update current time

**Returns:** *void*

___

###  init

▸ **init**(): *void*

*Overrides [PluginBase](_app_core_plugin_plugin_base_.pluginbase.md).[init](_app_core_plugin_plugin_base_.pluginbase.md#init)*

Defined in src/app/plugins/subtitles/subtitles-plugin.component.ts:38

**Returns:** *void*

___

###  ngOnInit

▸ **ngOnInit**(): *void*

*Overrides [PluginBase](_app_core_plugin_plugin_base_.pluginbase.md).[ngOnInit](_app_core_plugin_plugin_base_.pluginbase.md#ngoninit)*

Defined in src/app/plugins/subtitles/subtitles-plugin.component.ts:33

**Returns:** *void*

___

### `Private` refreshMetadata

▸ **refreshMetadata**(): *void*

Defined in src/app/plugins/subtitles/subtitles-plugin.component.ts:77

Invoked for reload and parse metadata

**Returns:** *void*

___

### `Private` updateSubtitleContent

▸ **updateSubtitleContent**(): *void*

Defined in src/app/plugins/subtitles/subtitles-plugin.component.ts:98

Invoked for change subtitle with current time

**Returns:** *void*
