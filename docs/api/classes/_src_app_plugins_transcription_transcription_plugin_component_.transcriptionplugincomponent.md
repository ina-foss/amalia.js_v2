[Amalia](../README.md) › [Globals](../globals.md) › ["src/app/plugins/transcription/transcription-plugin.component"](../modules/_src_app_plugins_transcription_transcription_plugin_component_.md) › [TranscriptionPluginComponent](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md)

# Class: TranscriptionPluginComponent

## Hierarchy

* [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md)‹[TranscriptionConfig](../interfaces/_src_app_core_config_model_transcription_config_.transcriptionconfig.md)›

  ↳ **TranscriptionPluginComponent**

## Implements

* OnInit
* OnInit

## Index

### Constructors

* [constructor](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#constructor)

### Properties

* [_player](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#_player)
* [_pluginConfiguration](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#_pluginconfiguration)
* [active](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#active)
* [autoScroll](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#autoscroll)
* [currentTime](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#currenttime)
* [displayProgressBar](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#displayprogressbar)
* [displaySynchro](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#displaysynchro)
* [fps](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#fps)
* [headerElement](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#headerelement)
* [ignoreNextScroll](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#ignorenextscroll)
* [index](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#index)
* [initialized](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#initialized)
* [listOfSearchedNodes](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#listofsearchednodes)
* [logger](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#protected-logger)
* [mediaPlayerElement](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#mediaplayerelement)
* [playerId](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#playerid)
* [playerService](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#playerservice)
* [pluginInstance](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#plugininstance)
* [pluginName](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#protected-pluginname)
* [searchText](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#searchtext)
* [searchedWordIndex](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#private-searchedwordindex)
* [searching](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#searching)
* [tcDisplayFormat](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#tcdisplayformat)
* [tcOffset](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#tcoffset)
* [timeFormat](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#timeformat)
* [transcriptionElement](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#transcriptionelement)
* [transcriptions](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#transcriptions)
* [typing](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#typing)
* [KARAOKE_TC_DELTA](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#static-karaoke_tc_delta)
* [PLUGIN_NAME](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#static-plugin_name)
* [SEARCH_SELECTOR](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#static-search_selector)
* [SELECTOR_ACTIVATED](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#static-selector_activated)
* [SELECTOR_PROGRESS_BAR](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#static-selector_progress_bar)
* [SELECTOR_SEGMENT](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#static-selector_segment)
* [SELECTOR_SELECTED](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#static-selector_selected)
* [SELECTOR_WORD](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#static-selector_word)

### Accessors

* [player](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#player)
* [pluginConfiguration](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#pluginconfiguration)

### Methods

* [callSeek](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#callseek)
* [clearSearchList](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#clearsearchlist)
* [disableRemoveAllSelectedNodes](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#private-disableremoveallselectednodes)
* [disableRemoveSelectedSegment](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#private-disableremoveselectedsegment)
* [disableSelectedWords](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#private-disableselectedwords)
* [getDefaultConfig](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#getdefaultconfig)
* [handleChangeInput](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#handlechangeinput)
* [handleMetadataLoaded](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#private-handlemetadataloaded)
* [handleOnTimeChange](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#private-handleontimechange)
* [handleScroll](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#handlescroll)
* [handleShortcut](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#handleshortcut)
* [init](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#init)
* [ngOnInit](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#ngoninit)
* [parseTranscription](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#private-parsetranscription)
* [scroll](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#private-scroll)
* [scrollToNode](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#private-scrolltonode)
* [scrollToSearchedWord](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#scrolltosearchedword)
* [scrollToSelectedSegment](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#scrolltoselectedsegment)
* [searchWord](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#searchword)
* [seekToWord](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#seektoword)
* [selectSegment](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#private-selectsegment)
* [selectWords](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#private-selectwords)
* [updateSynchro](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md#updatesynchro)

## Constructors

###  constructor

\+ **new TranscriptionPluginComponent**(`playerService`: [MediaPlayerService](_src_app_service_media_player_service_.mediaplayerservice.md)): *[TranscriptionPluginComponent](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md)*

*Overrides [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[constructor](_src_app_core_plugin_plugin_base_.pluginbase.md#protected-constructor)*

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:51

**Parameters:**

Name | Type |
------ | ------ |
`playerService` | [MediaPlayerService](_src_app_service_media_player_service_.mediaplayerservice.md) |

**Returns:** *[TranscriptionPluginComponent](_src_app_plugins_transcription_transcription_plugin_component_.transcriptionplugincomponent.md)*

## Properties

###  _player

• **_player**: *any*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[_player](_src_app_core_plugin_plugin_base_.pluginbase.md#_player)*

Defined in src/app/core/plugin/plugin-base.ts:23

This plugin configuration

___

###  _pluginConfiguration

• **_pluginConfiguration**: *[PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[TranscriptionConfig](../interfaces/_src_app_core_config_model_transcription_config_.transcriptionconfig.md)›*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[_pluginConfiguration](_src_app_core_plugin_plugin_base_.pluginbase.md#_pluginconfiguration)*

Defined in src/app/core/plugin/plugin-base.ts:34

___

###  active

• **active**: *boolean* = false

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:32

___

###  autoScroll

• **autoScroll**: *boolean* = false

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:31

___

###  currentTime

• **currentTime**: *number*

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:47

Return  current time

___

###  displayProgressBar

• **displayProgressBar**: *boolean* = false

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:40

___

###  displaySynchro

• **displaySynchro**: *boolean* = false

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:51

___

###  fps

• **fps**: *[FPS](../enums/_src_app_core_constant_default_.default.md#fps)* = DEFAULT.FPS

*Overrides [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[fps](_src_app_core_plugin_plugin_base_.pluginbase.md#fps)*

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:30

___

###  headerElement

• **headerElement**: *ElementRef‹HTMLElement›*

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:37

___

###  ignoreNextScroll

• **ignoreNextScroll**: *boolean* = false

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:33

___

###  index

• **index**: *number* = 0

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:43

___

###  initialized

• **initialized**: *any*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[initialized](_src_app_core_plugin_plugin_base_.pluginbase.md#initialized)*

Defined in src/app/core/plugin/plugin-base.ts:19

___

###  listOfSearchedNodes

• **listOfSearchedNodes**: *Array‹HTMLElement›*

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:49

___

### `Protected` logger

• **logger**: *[DefaultLogger](_src_app_core_logger_default_logger_.defaultlogger.md)*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[logger](_src_app_core_plugin_plugin_base_.pluginbase.md#protected-logger)*

Defined in src/app/core/plugin/plugin-base.ts:58

___

###  mediaPlayerElement

• **mediaPlayerElement**: *[MediaPlayerElement](_src_app_core_media_player_element_.mediaplayerelement.md)*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[mediaPlayerElement](_src_app_core_plugin_plugin_base_.pluginbase.md#mediaplayerelement)*

Defined in src/app/core/plugin/plugin-base.ts:56

___

###  playerId

• **playerId**: *any* = null

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[playerId](_src_app_core_plugin_plugin_base_.pluginbase.md#playerid)*

Defined in src/app/core/plugin/plugin-base.ts:15

___

###  playerService

• **playerService**: *[MediaPlayerService](_src_app_service_media_player_service_.mediaplayerservice.md)*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[playerService](_src_app_core_plugin_plugin_base_.pluginbase.md#playerservice)*

Defined in src/app/core/plugin/plugin-base.ts:53

___

###  pluginInstance

• **pluginInstance**: *string* = ""

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[pluginInstance](_src_app_core_plugin_plugin_base_.pluginbase.md#plugininstance)*

Defined in src/app/core/plugin/plugin-base.ts:55

___

### `Protected` pluginName

• **pluginName**: *string*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[pluginName](_src_app_core_plugin_plugin_base_.pluginbase.md#protected-pluginname)*

Defined in src/app/core/plugin/plugin-base.ts:57

___

###  searchText

• **searchText**: *ElementRef*

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:39

___

### `Private` searchedWordIndex

• **searchedWordIndex**: *number* = 0

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:50

___

###  searching

• **searching**: *boolean* = false

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:41

___

###  tcDisplayFormat

• **tcDisplayFormat**: *"h" | "m" | "s" | "minutes" | "f" | "ms" | "mms" | "hours" | "seconds"* = "s"

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:29

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

###  transcriptionElement

• **transcriptionElement**: *ElementRef‹HTMLElement›*

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:35

___

###  transcriptions

• **transcriptions**: *Array‹[TranscriptionLocalisation](../interfaces/_src_app_core_metadata_model_transcription_localisation_.transcriptionlocalisation.md)›* = null

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:48

___

###  typing

• **typing**: *boolean* = false

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:42

___

### `Static` KARAOKE_TC_DELTA

▪ **KARAOKE_TC_DELTA**: *number* = 0.25

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:22

___

### `Static` PLUGIN_NAME

▪ **PLUGIN_NAME**: *string* = "TRANSCRIPTION"

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:21

___

### `Static` SEARCH_SELECTOR

▪ **SEARCH_SELECTOR**: *string* = "selected-text"

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:25

___

### `Static` SELECTOR_ACTIVATED

▪ **SELECTOR_ACTIVATED**: *string* = "activated"

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:27

___

### `Static` SELECTOR_PROGRESS_BAR

▪ **SELECTOR_PROGRESS_BAR**: *string* = ".progress-bar"

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:28

___

### `Static` SELECTOR_SEGMENT

▪ **SELECTOR_SEGMENT**: *string* = "segment"

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:23

___

### `Static` SELECTOR_SELECTED

▪ **SELECTOR_SELECTED**: *string* = "selected"

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:26

___

### `Static` SELECTOR_WORD

▪ **SELECTOR_WORD**: *string* = "w"

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:24

## Accessors

###  player

• **get player**(): *any*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[player](_src_app_core_plugin_plugin_base_.pluginbase.md#player)*

Defined in src/app/core/plugin/plugin-base.ts:25

**Returns:** *any*

• **set player**(`value`: any): *void*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[player](_src_app_core_plugin_plugin_base_.pluginbase.md#player)*

Defined in src/app/core/plugin/plugin-base.ts:30

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *void*

___

###  pluginConfiguration

• **get pluginConfiguration**(): *[PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[TranscriptionConfig](../interfaces/_src_app_core_config_model_transcription_config_.transcriptionconfig.md)›*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[pluginConfiguration](_src_app_core_plugin_plugin_base_.pluginbase.md#pluginconfiguration)*

Defined in src/app/core/plugin/plugin-base.ts:36

**Returns:** *[PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[TranscriptionConfig](../interfaces/_src_app_core_config_model_transcription_config_.transcriptionconfig.md)›*

• **set pluginConfiguration**(`value`: [PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[TranscriptionConfig](../interfaces/_src_app_core_config_model_transcription_config_.transcriptionconfig.md)›): *void*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[pluginConfiguration](_src_app_core_plugin_plugin_base_.pluginbase.md#pluginconfiguration)*

Defined in src/app/core/plugin/plugin-base.ts:41

**Parameters:**

Name | Type |
------ | ------ |
`value` | [PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[TranscriptionConfig](../interfaces/_src_app_core_config_model_transcription_config_.transcriptionconfig.md)› |

**Returns:** *void*

## Methods

###  callSeek

▸ **callSeek**(`tc`: any): *void*

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:88

handle call

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`tc` | any | time code  |

**Returns:** *void*

___

###  clearSearchList

▸ **clearSearchList**(): *void*

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:442

clear seach list onclick

**Returns:** *void*

___

### `Private` disableRemoveAllSelectedNodes

▸ **disableRemoveAllSelectedNodes**(): *void*

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:192

 In charge to remove selected elements and disable progress bar

**Returns:** *void*

___

### `Private` disableRemoveSelectedSegment

▸ **disableRemoveSelectedSegment**(): *void*

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:177

 In charge to remove selected parent

**Returns:** *void*

___

### `Private` disableSelectedWords

▸ **disableSelectedWords**(): *void*

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:168

 disabled selected words on rewinding

**Returns:** *void*

___

###  getDefaultConfig

▸ **getDefaultConfig**(): *[PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[TranscriptionConfig](../interfaces/_src_app_core_config_model_transcription_config_.transcriptionconfig.md)›*

*Overrides [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[getDefaultConfig](_src_app_core_plugin_plugin_base_.pluginbase.md#abstract-getdefaultconfig)*

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:95

Return default config

**Returns:** *[PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[TranscriptionConfig](../interfaces/_src_app_core_config_model_transcription_config_.transcriptionconfig.md)›*

___

###  handleChangeInput

▸ **handleChangeInput**(`value`: any): *void*

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:154

Handle change text on searching input

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *void*

___

### `Private` handleMetadataLoaded

▸ **handleMetadataLoaded**(): *void*

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:336

Invoked on metadata loaded

**Returns:** *void*

___

### `Private` handleOnTimeChange

▸ **handleOnTimeChange**(): *void*

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:133

Invoked time change event for :
- update current time

**Returns:** *void*

___

###  handleScroll

▸ **handleScroll**(`ignoreNextScroll?`: boolean): *void*

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:327

handle scroll event

**Parameters:**

Name | Type |
------ | ------ |
`ignoreNextScroll?` | boolean |

**Returns:** *void*

___

###  handleShortcut

▸ **handleShortcut**(`event`: any): *void*

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:456

handleShortcut on search button

**Parameters:**

Name | Type |
------ | ------ |
`event` | any |

**Returns:** *void*

___

###  init

▸ **init**(): *void*

*Overrides [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[init](_src_app_core_plugin_plugin_base_.pluginbase.md#init)*

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:62

**Returns:** *void*

___

###  ngOnInit

▸ **ngOnInit**(): *void*

*Overrides [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[ngOnInit](_src_app_core_plugin_plugin_base_.pluginbase.md#ngoninit)*

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:57

**Returns:** *void*

___

### `Private` parseTranscription

▸ **parseTranscription**(): *void*

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:343

In charge to load metadata

**Returns:** *void*

___

### `Private` scroll

▸ **scroll**(): *void*

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:273

In charge transcription to scroll position is equal to segment position minus transcription block padding and segment height

**Returns:** *void*

___

### `Private` scrollToNode

▸ **scrollToNode**(`scrollNode`: HTMLElement): *void*

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:285

Invoked to scroll to node

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`scrollNode` | HTMLElement | scroll node element  |

**Returns:** *void*

___

###  scrollToSearchedWord

▸ **scrollToSearchedWord**(`direction`: string): *void*

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:396

Scroll to next or previous searched word

**Parameters:**

Name | Type |
------ | ------ |
`direction` | string |

**Returns:** *void*

___

###  scrollToSelectedSegment

▸ **scrollToSelectedSegment**(): *void*

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:428

Invocked on click SYNCHRO button

**Returns:** *void*

___

###  searchWord

▸ **searchWord**(`searchText`: string): *void*

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:369

Search word ans scroll to first result

**Parameters:**

Name | Type |
------ | ------ |
`searchText` | string |

**Returns:** *void*

___

###  seekToWord

▸ **seekToWord**(`e`: MouseEvent): *void*

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:118

handle to seek work with defined tc delta

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`e` | MouseEvent | mouse event  |

**Returns:** *void*

___

### `Private` selectSegment

▸ **selectSegment**(`karaokeTcDelta`: number): *void*

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:250

In charge to select segment

**Parameters:**

Name | Type |
------ | ------ |
`karaokeTcDelta` | number |

**Returns:** *void*

___

### `Private` selectWords

▸ **selectWords**(`karaokeTcDelta`: number): *void*

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:217

In charge to select word in time range

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`karaokeTcDelta` | number | time code delta  |

**Returns:** *void*

___

###  updateSynchro

▸ **updateSynchro**(): *void*

Defined in src/app/plugins/transcription/transcription-plugin.component.ts:466

if scrolling and active segment is not visible add synchro button

**Returns:** *void*
