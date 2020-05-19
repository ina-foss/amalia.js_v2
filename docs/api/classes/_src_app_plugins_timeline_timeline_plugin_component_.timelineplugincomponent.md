[Amalia](../README.md) › [Globals](../globals.md) › ["src/app/plugins/timeline/timeline-plugin.component"](../modules/_src_app_plugins_timeline_timeline_plugin_component_.md) › [TimelinePluginComponent](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md)

# Class: TimelinePluginComponent

## Hierarchy

* [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md)‹[TimelineConfig](../interfaces/_src_app_core_config_model_timeline_config_.timelineconfig.md)›

  ↳ **TimelinePluginComponent**

## Implements

* OnInit
* OnInit

## Index

### Constructors

* [constructor](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#constructor)

### Properties

* [blocksDisplayStates](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#private-blocksdisplaystates)
* [blocksIsOpen](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#private-blocksisopen)
* [colors](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#colors)
* [configIsOpen](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#configisopen)
* [currentTime](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#currenttime)
* [duration](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#duration)
* [enableDragDrop](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#enabledragdrop)
* [focusContainer](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#focuscontainer)
* [focusTcIn](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#focustcin)
* [focusTcOut](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#focustcout)
* [fps](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#fps)
* [lastSelectedColorIdx](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#private-lastselectedcoloridx)
* [listOfBlocks](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#listofblocks)
* [listOfBlocksContainer](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#listofblockscontainer)
* [logger](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#protected-logger)
* [mainBlockColor](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#mainblockcolor)
* [mainBlockContainer](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#mainblockcontainer)
* [mainLocalisations](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#mainlocalisations)
* [mediaPlayerElement](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#mediaplayerelement)
* [playerId](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#playerid)
* [playerService](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#playerservice)
* [pluginName](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#protected-pluginname)
* [tcOffset](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#tcoffset)
* [timeFormat](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#timeformat)
* [title](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#title)
* [PLUGIN_NAME](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#static-plugin_name)

### Accessors

* [player](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#player)
* [pluginConfiguration](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#pluginconfiguration)

### Methods

* [callSeek](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#callseek)
* [changeDisplayState](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#changedisplaystate)
* [createMainMetadataIds](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#createmainmetadataids)
* [getAvailableColor](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#private-getavailablecolor)
* [getDefaultConfig](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#getdefaultconfig)
* [handleDisplayBlocks](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#handledisplayblocks)
* [handleMetadataLoaded](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#handlemetadataloaded)
* [handleOnDurationChange](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#private-handleondurationchange)
* [handleOnTimeChange](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#private-handleontimechange)
* [handleZoomRangeChange](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#handlezoomrangechange)
* [init](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#init)
* [initFocusResizable](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#initfocusresizable)
* [ngOnInit](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#ngoninit)
* [refreshTimeCursor](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#refreshtimecursor)
* [toggleAllBlocksState](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#toggleallblocksstate)
* [toggleState](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#togglestate)
* [unZoom](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#unzoom)

### Object literals

* [sortableOptions](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#sortableoptions)

## Constructors

###  constructor

\+ **new TimelinePluginComponent**(`playerService`: [MediaPlayerService](_src_app_service_media_player_service_.mediaplayerservice.md)): *[TimelinePluginComponent](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md)*

*Overrides [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[constructor](_src_app_core_plugin_plugin_base_.pluginbase.md#protected-constructor)*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:53

**Parameters:**

Name | Type |
------ | ------ |
`playerService` | [MediaPlayerService](_src_app_service_media_player_service_.mediaplayerservice.md) |

**Returns:** *[TimelinePluginComponent](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md)*

## Properties

### `Private` blocksDisplayStates

• **blocksDisplayStates**: *Map‹string, boolean›* = new Map<string, boolean>()

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:53

___

### `Private` blocksIsOpen

• **blocksIsOpen**: *boolean* = false

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:51

true for open all block

___

###  colors

• **colors**: *Array‹string›* = [
        '#1ABC9C', '#f1c40e', '#95A5A6', '#2ECC71',
        '#E67E21', '#34495E', '#3498DB', '#D8D8D8',
        '#E74C3C', '#F35CF2', '#8E44AD'
    ]

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:33

___

###  configIsOpen

• **configIsOpen**: *boolean* = false

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:26

___

###  currentTime

• **currentTime**: *number* = 0

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:27

___

###  duration

• **duration**: *number* = 0

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:28

___

###  enableDragDrop

• **enableDragDrop**: *boolean* = false

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:25

___

###  focusContainer

• **focusContainer**: *ElementRef‹HTMLElement›*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:39

___

###  focusTcIn

• **focusTcIn**: *number* = 0

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:30

___

###  focusTcOut

• **focusTcOut**: *number* = 0

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:31

___

###  fps

• **fps**: *any*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[fps](_src_app_core_plugin_plugin_base_.pluginbase.md#fps)*

Defined in src/app/core/plugin/plugin-base.ts:18

___

### `Private` lastSelectedColorIdx

• **lastSelectedColorIdx**: *number* = -1

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:52

___

###  listOfBlocks

• **listOfBlocks**: *Array‹object›*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:24

___

###  listOfBlocksContainer

• **listOfBlocksContainer**: *ElementRef‹HTMLElement›*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:43

___

### `Protected` logger

• **logger**: *[DefaultLogger](_src_app_core_logger_default_logger_.defaultlogger.md)*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[logger](_src_app_core_plugin_plugin_base_.pluginbase.md#protected-logger)*

Defined in src/app/core/plugin/plugin-base.ts:56

___

###  mainBlockColor

• **mainBlockColor**: *string*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:22

___

###  mainBlockContainer

• **mainBlockContainer**: *ElementRef‹HTMLElement›*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:41

___

###  mainLocalisations

• **mainLocalisations**: *Array‹[TimelineLocalisation](../interfaces/_src_app_core_metadata_model_timeline_localisation_.timelinelocalisation.md)›*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:23

___

###  mediaPlayerElement

• **mediaPlayerElement**: *[MediaPlayerElement](_src_app_core_media_player_element_.mediaplayerelement.md)*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[mediaPlayerElement](_src_app_core_plugin_plugin_base_.pluginbase.md#mediaplayerelement)*

Defined in src/app/core/plugin/plugin-base.ts:54

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

### `Protected` pluginName

• **pluginName**: *string*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[pluginName](_src_app_core_plugin_plugin_base_.pluginbase.md#protected-pluginname)*

Defined in src/app/core/plugin/plugin-base.ts:55

___

###  tcOffset

• **tcOffset**: *number* = 0

*Overrides [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[tcOffset](_src_app_core_plugin_plugin_base_.pluginbase.md#tcoffset)*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:29

___

###  timeFormat

• **timeFormat**: *any*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[timeFormat](_src_app_core_plugin_plugin_base_.pluginbase.md#timeformat)*

Defined in src/app/core/plugin/plugin-base.ts:16

___

###  title

• **title**: *string*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:21

___

### `Static` PLUGIN_NAME

▪ **PLUGIN_NAME**: *string* = "TIMELINE"

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:20

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

• **get pluginConfiguration**(): *[PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[TimelineConfig](../interfaces/_src_app_core_config_model_timeline_config_.timelineconfig.md)›*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[pluginConfiguration](_src_app_core_plugin_plugin_base_.pluginbase.md#pluginconfiguration)*

Defined in src/app/core/plugin/plugin-base.ts:36

**Returns:** *[PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[TimelineConfig](../interfaces/_src_app_core_config_model_timeline_config_.timelineconfig.md)›*

• **set pluginConfiguration**(`value`: [PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[TimelineConfig](../interfaces/_src_app_core_config_model_timeline_config_.timelineconfig.md)›): *void*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[pluginConfiguration](_src_app_core_plugin_plugin_base_.pluginbase.md#pluginconfiguration)*

Defined in src/app/core/plugin/plugin-base.ts:41

**Parameters:**

Name | Type |
------ | ------ |
`value` | [PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[TimelineConfig](../interfaces/_src_app_core_config_model_timeline_config_.timelineconfig.md)› |

**Returns:** *void*

## Methods

###  callSeek

▸ **callSeek**(`tc`: number): *void*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:89

Handle call

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`tc` | number | time code  |

**Returns:** *void*

___

###  changeDisplayState

▸ **changeDisplayState**(`event`: MouseEvent, `block`: object): *void*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:214

In charge to store display state change change display state

**Parameters:**

▪ **event**: *MouseEvent*

▪ **block**: *object*

Name | Type |
------ | ------ |
`data` | Array‹[TimelineLocalisation](../interfaces/_src_app_core_metadata_model_timeline_localisation_.timelinelocalisation.md)› |
`defaultColor?` | string |
`displayState` | boolean |
`expendable` | boolean |
`id?` | string |
`label?` | string |

**Returns:** *void*

___

###  createMainMetadataIds

▸ **createMainMetadataIds**(`handleMetadataIds`: any, `metadataManager`: any): *[TimelineLocalisation](../interfaces/_src_app_core_metadata_model_timeline_localisation_.timelinelocalisation.md)[]*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:328

In charge to main timeline

**Parameters:**

Name | Type |
------ | ------ |
`handleMetadataIds` | any |
`metadataManager` | any |

**Returns:** *[TimelineLocalisation](../interfaces/_src_app_core_metadata_model_timeline_localisation_.timelinelocalisation.md)[]*

___

### `Private` getAvailableColor

▸ **getAvailableColor**(): *string*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:66

Return color color

**Returns:** *string*

___

###  getDefaultConfig

▸ **getDefaultConfig**(): *[PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[TimelineConfig](../interfaces/_src_app_core_config_model_timeline_config_.timelineconfig.md)›*

*Overrides [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[getDefaultConfig](_src_app_core_plugin_plugin_base_.pluginbase.md#abstract-getdefaultconfig)*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:96

Return default config

**Returns:** *[PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[TimelineConfig](../interfaces/_src_app_core_config_model_timeline_config_.timelineconfig.md)›*

___

###  handleDisplayBlocks

▸ **handleDisplayBlocks**(`isValid`: any): *void*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:226

In charge of save or not display block states

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`isValid` | any | true for save display block  |

**Returns:** *void*

___

###  handleMetadataLoaded

▸ **handleMetadataLoaded**(): *void*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:297

Called when metadata loaded

**Returns:** *void*

___

### `Private` handleOnDurationChange

▸ **handleOnDurationChange**(): *void*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:252

Invoked on duration change

**Returns:** *void*

___

### `Private` handleOnTimeChange

▸ **handleOnTimeChange**(): *void*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:243

Invoked time change event for :
- update progress bar

**Returns:** *void*

___

###  handleZoomRangeChange

▸ **handleZoomRangeChange**(): *void*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:260

**Returns:** *void*

___

###  init

▸ **init**(): *void*

*Overrides [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[init](_src_app_core_plugin_plugin_base_.pluginbase.md#init)*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:72

**Returns:** *void*

___

###  initFocusResizable

▸ **initFocusResizable**(`element`: HTMLElement): *void*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:114

Init focus

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`element` | HTMLElement | focus element  |

**Returns:** *void*

___

###  ngOnInit

▸ **ngOnInit**(): *void*

*Overrides [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[ngOnInit](_src_app_core_plugin_plugin_base_.pluginbase.md#ngoninit)*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:59

**Returns:** *void*

___

###  refreshTimeCursor

▸ **refreshTimeCursor**(): *void*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:272

In charge to refresh time cursor

**Returns:** *void*

___

###  toggleAllBlocksState

▸ **toggleAllBlocksState**(`mainElement`: HTMLElement, `stateControl`: any): *void*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:194

In charge to change display state for all blocks

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`mainElement` | HTMLElement | parent element |
`stateControl` | any | old state  |

**Returns:** *void*

___

###  toggleState

▸ **toggleState**(`mainElement`: HTMLElement): *void*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:180

In charge to change display state

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`mainElement` | HTMLElement | parent element  |

**Returns:** *void*

___

###  unZoom

▸ **unZoom**(): *void*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:284

In charge to un-zoom

**Returns:** *void*

## Object literals

###  sortableOptions

### ▪ **sortableOptions**: *object*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:44

###  filter

• **filter**: *string* = ".filtered"

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:46

###  handle

• **handle**: *string* = ".drag"

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:45
