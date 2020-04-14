[Amalia](../README.md) › [Globals](../globals.md) › ["app/plugins/transcription/transcription-plugin.component"](../modules/_app_plugins_transcription_transcription_plugin_component_.md) › [TranscriptionPluginComponent](_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md)

# Class: TranscriptionPluginComponent

## Hierarchy

* [PluginBase](_app_core_plugin_plugin_base_.pluginbase.md)‹[TranscriptionConfig](../interfaces/_app_core_config_model_transcription_config_.transcriptionconfig.md)›

  ↳ **TranscriptionPluginComponent**

## Implements

* OnInit
* OnInit

## Index

### Constructors

* [constructor](_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#constructor)

### Properties

* [autoScroll](_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#autoscroll)
* [currentTime](_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#currenttime)
* [displayProgressBar](_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#displayprogressbar)
* [fps](_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#fps)
* [ignoreNextScroll](_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#ignorenextscroll)
* [listOfSearchedNodes](_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#listofsearchednodes)
* [logger](_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#protected-logger)
* [mediaPlayerElement](_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#mediaplayerelement)
* [playerId](_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#playerid)
* [playerService](_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#playerservice)
* [pluginName](_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#protected-pluginname)
* [searchedWordIndex](_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#private-searchedwordindex)
* [tcDisplayFormat](_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#tcdisplayformat)
* [transcriptionElement](_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#transcriptionelement)
* [transcriptions](_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#transcriptions)
* [KARAOKE_TC_DELTA](_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#static-karaoke_tc_delta)
* [PLUGIN_NAME](_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#static-plugin_name)
* [SELECTOR_PROGRESS_BAR](_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#static-selector_progress_bar)
* [SELECTOR_SEGMENT](_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#static-selector_segment)
* [SELECTOR_SELECTED](_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#static-selector_selected)
* [SELECTOR_WORD](_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#static-selector_word)

### Accessors

* [player](_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#player)
* [pluginConfiguration](_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#pluginconfiguration)

### Methods

* [callSeek](_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#callseek)
* [disableRemoveAllSelectedNodes](_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#private-disableremoveallselectednodes)
* [getDefaultConfig](_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#getdefaultconfig)
* [handleMetadataLoaded](_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#private-handlemetadataloaded)
* [handleOnTimeChange](_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#private-handleontimechange)
* [handleScroll](_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#handlescroll)
* [init](_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#init)
* [ngOnInit](_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#ngoninit)
* [scroll](_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#private-scroll)
* [scrollToNode](_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#private-scrolltonode)
* [scrollToSearchedWord](_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#scrolltosearchedword)
* [searchWord](_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#searchword)
* [seekToWord](_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#seektoword)
* [selectSegment](_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#private-selectsegment)
* [selectWords](_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#private-selectwords)
* [toggleAutoScroll](_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#toggleautoscroll)

## Constructors

###  constructor

\+ **new TranscriptionPluginComponent**(`playerService`: [MediaPlayerService](_app_service_media_player_service_.mediaplayerservice.md)): *[TranscriptionPluginComponent](_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md)*

*Overrides [PluginBase](_app_core_plugin_plugin_base_.pluginbase.md).[constructor](_app_core_plugin_plugin_base_.pluginbase.md#protected-constructor)*

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:39

**Parameters:**

Name | Type |
------ | ------ |
`playerService` | [MediaPlayerService](_app_service_media_player_service_.mediaplayerservice.md) |

**Returns:** *[TranscriptionPluginComponent](_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md)*

## Properties

###  autoScroll

• **autoScroll**: *boolean* = false

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:28

___

###  currentTime

• **currentTime**: *number*

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:36

Return  current time

___

###  displayProgressBar

• **displayProgressBar**: *boolean* = false

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:32

___

###  fps

• **fps**: *[FPS](../enums/_app_core_constant_default_.default.md#fps)* = DEFAULT.FPS

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:27

___

###  ignoreNextScroll

• **ignoreNextScroll**: *boolean* = false

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:29

___

###  listOfSearchedNodes

• **listOfSearchedNodes**: *Array‹HTMLElement›*

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:38

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

### `Private` searchedWordIndex

• **searchedWordIndex**: *number* = 0

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:39

___

###  tcDisplayFormat

• **tcDisplayFormat**: *"h" | "m" | "s" | "f" | "ms" | "mms" | "seconds"* = "s"

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:26

___

###  transcriptionElement

• **transcriptionElement**: *ElementRef‹HTMLElement›*

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:31

___

###  transcriptions

• **transcriptions**: *Array‹[TranscriptionLocalisation](../interfaces/_app_core_metadata_model_transcription_localisation_.transcriptionlocalisation.md)›* = null

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:37

___

### `Static` KARAOKE_TC_DELTA

▪ **KARAOKE_TC_DELTA**: *number* = 0.25

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:21

___

### `Static` PLUGIN_NAME

▪ **PLUGIN_NAME**: *string* = "TRANSCRIPTION"

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:20

___

### `Static` SELECTOR_PROGRESS_BAR

▪ **SELECTOR_PROGRESS_BAR**: *string* = ".progress-bar"

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:25

___

### `Static` SELECTOR_SEGMENT

▪ **SELECTOR_SEGMENT**: *string* = "segment"

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:22

___

### `Static` SELECTOR_SELECTED

▪ **SELECTOR_SELECTED**: *string* = "selected"

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:24

___

### `Static` SELECTOR_WORD

▪ **SELECTOR_WORD**: *string* = "w"

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:23

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

• **get pluginConfiguration**(): *[PluginConfigData](../interfaces/_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[TranscriptionConfig](../interfaces/_app_core_config_model_transcription_config_.transcriptionconfig.md)›*

*Inherited from [PluginBase](_app_core_plugin_plugin_base_.pluginbase.md).[pluginConfiguration](_app_core_plugin_plugin_base_.pluginbase.md#pluginconfiguration)*

Defined in src/app/core/plugin/plugin-base.ts:35

**Returns:** *[PluginConfigData](../interfaces/_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[TranscriptionConfig](../interfaces/_app_core_config_model_transcription_config_.transcriptionconfig.md)›*

• **set pluginConfiguration**(`value`: [PluginConfigData](../interfaces/_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[TranscriptionConfig](../interfaces/_app_core_config_model_transcription_config_.transcriptionconfig.md)›): *void*

*Inherited from [PluginBase](_app_core_plugin_plugin_base_.pluginbase.md).[pluginConfiguration](_app_core_plugin_plugin_base_.pluginbase.md#pluginconfiguration)*

Defined in src/app/core/plugin/plugin-base.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`value` | [PluginConfigData](../interfaces/_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[TranscriptionConfig](../interfaces/_app_core_config_model_transcription_config_.transcriptionconfig.md)› |

**Returns:** *void*

## Methods

###  callSeek

▸ **callSeek**(`tc`: any): *void*

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:72

handle call

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`tc` | any | time code  |

**Returns:** *void*

___

### `Private` disableRemoveAllSelectedNodes

▸ **disableRemoveAllSelectedNodes**(): *void*

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:135

 In charge to remove selected elements and disable progress bar

**Returns:** *void*

___

###  getDefaultConfig

▸ **getDefaultConfig**(): *[PluginConfigData](../interfaces/_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[TranscriptionConfig](../interfaces/_app_core_config_model_transcription_config_.transcriptionconfig.md)›*

*Overrides [PluginBase](_app_core_plugin_plugin_base_.pluginbase.md).[getDefaultConfig](_app_core_plugin_plugin_base_.pluginbase.md#abstract-getdefaultconfig)*

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:79

Return default config

**Returns:** *[PluginConfigData](../interfaces/_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[TranscriptionConfig](../interfaces/_app_core_config_model_transcription_config_.transcriptionconfig.md)›*

___

### `Private` handleMetadataLoaded

▸ **handleMetadataLoaded**(): *void*

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:239

Invoked on metadata loaded

**Returns:** *void*

___

### `Private` handleOnTimeChange

▸ **handleOnTimeChange**(): *void*

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:120

Invoked time change event for :
- update current time

**Returns:** *void*

___

###  handleScroll

▸ **handleScroll**(`ignoreNextScroll?`: boolean): *void*

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:231

handle scroll event

**Parameters:**

Name | Type |
------ | ------ |
`ignoreNextScroll?` | boolean |

**Returns:** *void*

___

###  init

▸ **init**(): *void*

*Overrides [PluginBase](_app_core_plugin_plugin_base_.pluginbase.md).[init](_app_core_plugin_plugin_base_.pluginbase.md#init)*

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:50

**Returns:** *void*

___

###  ngOnInit

▸ **ngOnInit**(): *void*

*Overrides [PluginBase](_app_core_plugin_plugin_base_.pluginbase.md).[ngOnInit](_app_core_plugin_plugin_base_.pluginbase.md#ngoninit)*

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:45

**Returns:** *void*

___

### `Private` scroll

▸ **scroll**(): *void*

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:198

In charge transcription to scroll position is equal to segment position minus transcription block padding and segment height

**Returns:** *void*

___

### `Private` scrollToNode

▸ **scrollToNode**(`scrollNode`: HTMLElement): *void*

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:210

Invoked to scroll to node

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`scrollNode` | HTMLElement | scroll node element  |

**Returns:** *void*

___

###  scrollToSearchedWord

▸ **scrollToSearchedWord**(`direction`: string): *void*

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:274

**Parameters:**

Name | Type |
------ | ------ |
`direction` | string |

**Returns:** *void*

___

###  searchWord

▸ **searchWord**(`searchText`: string): *void*

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:258

**Parameters:**

Name | Type |
------ | ------ |
`searchText` | string |

**Returns:** *void*

___

###  seekToWord

▸ **seekToWord**(`e`: MouseEvent): *void*

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:98

handle to seek work with defined tc delta

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`e` | MouseEvent | mouse event  |

**Returns:** *void*

___

### `Private` selectSegment

▸ **selectSegment**(`karaokeTcDelta`: number): *void*

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:175

In charge to select segment

**Parameters:**

Name | Type |
------ | ------ |
`karaokeTcDelta` | number |

**Returns:** *void*

___

### `Private` selectWords

▸ **selectWords**(`karaokeTcDelta`: number): *void*

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:158

In charge to select word in time range

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`karaokeTcDelta` | number | time code delta  |

**Returns:** *void*

___

###  toggleAutoScroll

▸ **toggleAutoScroll**(): *void*

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:111

Invoked for change auto scroll state

**Returns:** *void*
