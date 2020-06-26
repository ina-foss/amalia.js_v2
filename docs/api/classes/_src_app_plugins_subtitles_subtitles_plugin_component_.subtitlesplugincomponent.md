[Amalia](../README.md) › [Globals](../globals.md) › ["src/app/plugins/subtitles/subtitles-plugin.component"](../modules/_src_app_plugins_subtitles_subtitles_plugin_component_.md) › [SubtitlesPluginComponent](_src_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md)

# Class: SubtitlesPluginComponent

## Hierarchy

* [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md)‹[SubtitleConfig](../interfaces/_src_app_core_config_model_subtitle_config_.subtitleconfig.md)›

  ↳ **SubtitlesPluginComponent**

## Implements

* OnInit
* OnInit

## Index

### Constructors

* [constructor](_src_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md#constructor)

### Properties

* [currentTime](_src_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md#currenttime)
* [displayState](_src_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md#displaystate)
* [fps](_src_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md#fps)
* [logger](_src_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md#protected-logger)
* [mediaPlayerElement](_src_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md#mediaplayerelement)
* [playerId](_src_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md#playerid)
* [playerService](_src_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md#playerservice)
* [pluginName](_src_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md#protected-pluginname)
* [posSubtitle](_src_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md#possubtitle)
* [subTitle](_src_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md#subtitle)
* [tcOffset](_src_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md#tcoffset)
* [timeFormat](_src_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md#timeformat)
* [transcriptions](_src_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md#transcriptions)
* [PLUGIN_NAME](_src_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md#static-plugin_name)
* [TC_DELTA](_src_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md#static-tc_delta)

### Accessors

* [player](_src_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md#player)
* [pluginConfiguration](_src_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md#pluginconfiguration)

### Methods

* [changeSubtitlePosition](_src_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md#private-changesubtitleposition)
* [getDefaultConfig](_src_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md#getdefaultconfig)
* [handleDisplayState](_src_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md#handledisplaystate)
* [handleMetadataLoaded](_src_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md#private-handlemetadataloaded)
* [handleOnTimeChange](_src_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md#private-handleontimechange)
* [init](_src_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md#init)
* [ngOnInit](_src_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md#ngoninit)
* [refreshMetadata](_src_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md#private-refreshmetadata)
* [updateSubtitleContent](_src_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md#private-updatesubtitlecontent)

## Constructors

###  constructor

\+ **new SubtitlesPluginComponent**(`playerService`: [MediaPlayerService](_src_app_service_media_player_service_.mediaplayerservice.md)): *[SubtitlesPluginComponent](_src_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md)*

*Overrides [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[constructor](_src_app_core_plugin_plugin_base_.pluginbase.md#protected-constructor)*

Defined in src/app/plugins/subtitles/subtitles-plugin.component.ts:31

**Parameters:**

Name | Type |
------ | ------ |
`playerService` | [MediaPlayerService](_src_app_service_media_player_service_.mediaplayerservice.md) |

**Returns:** *[SubtitlesPluginComponent](_src_app_plugins_subtitles_subtitles_plugin_component_.subtitlesplugincomponent.md)*

## Properties

###  currentTime

• **currentTime**: *number*

Defined in src/app/plugins/subtitles/subtitles-plugin.component.ts:24

Return  current time

___

###  displayState

• **displayState**: *any*

Defined in src/app/plugins/subtitles/subtitles-plugin.component.ts:31

Plugin display state

___

###  fps

• **fps**: *any*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[fps](_src_app_core_plugin_plugin_base_.pluginbase.md#fps)*

Defined in src/app/core/plugin/plugin-base.ts:18

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

###  posSubtitle

• **posSubtitle**: *["none", "up", "down"]*

Defined in src/app/plugins/subtitles/subtitles-plugin.component.ts:27

___

###  subTitle

• **subTitle**: *string*

Defined in src/app/plugins/subtitles/subtitles-plugin.component.ts:25

___

###  tcOffset

• **tcOffset**: *any*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[tcOffset](_src_app_core_plugin_plugin_base_.pluginbase.md#tcoffset)*

Defined in src/app/core/plugin/plugin-base.ts:17

___

###  timeFormat

• **timeFormat**: *any*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[timeFormat](_src_app_core_plugin_plugin_base_.pluginbase.md#timeformat)*

Defined in src/app/core/plugin/plugin-base.ts:16

___

###  transcriptions

• **transcriptions**: *Array‹[TranscriptionLocalisation](../interfaces/_src_app_core_metadata_model_transcription_localisation_.transcriptionlocalisation.md)›* = null

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

• **get pluginConfiguration**(): *[PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[SubtitleConfig](../interfaces/_src_app_core_config_model_subtitle_config_.subtitleconfig.md)›*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[pluginConfiguration](_src_app_core_plugin_plugin_base_.pluginbase.md#pluginconfiguration)*

Defined in src/app/core/plugin/plugin-base.ts:35

**Returns:** *[PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[SubtitleConfig](../interfaces/_src_app_core_config_model_subtitle_config_.subtitleconfig.md)›*

• **set pluginConfiguration**(`value`: [PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[SubtitleConfig](../interfaces/_src_app_core_config_model_subtitle_config_.subtitleconfig.md)›): *void*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[pluginConfiguration](_src_app_core_plugin_plugin_base_.pluginbase.md#pluginconfiguration)*

Defined in src/app/core/plugin/plugin-base.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`value` | [PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[SubtitleConfig](../interfaces/_src_app_core_config_model_subtitle_config_.subtitleconfig.md)› |

**Returns:** *void*

## Methods

### `Private` changeSubtitlePosition

▸ **changeSubtitlePosition**(`event`: any): *void*

Defined in src/app/plugins/subtitles/subtitles-plugin.component.ts:131

Invoked when user change subtitle position

**Parameters:**

Name | Type |
------ | ------ |
`event` | any |

**Returns:** *void*

___

###  getDefaultConfig

▸ **getDefaultConfig**(): *[PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[SubtitleConfig](../interfaces/_src_app_core_config_model_subtitle_config_.subtitleconfig.md)›*

*Overrides [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[getDefaultConfig](_src_app_core_plugin_plugin_base_.pluginbase.md#abstract-getdefaultconfig)*

Defined in src/app/plugins/subtitles/subtitles-plugin.component.ts:59

Return default config

**Returns:** *[PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[SubtitleConfig](../interfaces/_src_app_core_config_model_subtitle_config_.subtitleconfig.md)›*

___

###  handleDisplayState

▸ **handleDisplayState**(): *void*

Defined in src/app/plugins/subtitles/subtitles-plugin.component.ts:52

switch container class based on width

**Returns:** *void*

___

### `Private` handleMetadataLoaded

▸ **handleMetadataLoaded**(): *void*

Defined in src/app/plugins/subtitles/subtitles-plugin.component.ts:80

Invoked on metadata loaded

**Returns:** *void*

___

### `Private` handleOnTimeChange

▸ **handleOnTimeChange**(): *void*

Defined in src/app/plugins/subtitles/subtitles-plugin.component.ts:71

Invoked time change event for :
- update current time

**Returns:** *void*

___

###  init

▸ **init**(): *void*

*Overrides [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[init](_src_app_core_plugin_plugin_base_.pluginbase.md#init)*

Defined in src/app/plugins/subtitles/subtitles-plugin.component.ts:41

**Returns:** *void*

___

###  ngOnInit

▸ **ngOnInit**(): *void*

*Overrides [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[ngOnInit](_src_app_core_plugin_plugin_base_.pluginbase.md#ngoninit)*

Defined in src/app/plugins/subtitles/subtitles-plugin.component.ts:36

**Returns:** *void*

___

### `Private` refreshMetadata

▸ **refreshMetadata**(): *void*

Defined in src/app/plugins/subtitles/subtitles-plugin.component.ts:87

Invoked for reload and parse metadata

**Returns:** *void*

___

### `Private` updateSubtitleContent

▸ **updateSubtitleContent**(): *void*

Defined in src/app/plugins/subtitles/subtitles-plugin.component.ts:108

Invoked for change subtitle with current time

**Returns:** *void*
