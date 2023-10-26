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

* [_player](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#_player)
* [_pluginConfiguration](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#_pluginconfiguration)
* [blocksDisplayStates](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#private-blocksdisplaystates)
* [blocksIsOpen](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#private-blocksisopen)
* [colors](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#colors)
* [configIsOpen](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#configisopen)
* [currentTime](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#currenttime)
* [duration](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#duration)
* [enableDragDrop](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#enabledragdrop)
* [enableZoom](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#enablezoom)
* [focusContainer](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#focuscontainer)
* [focusTcIn](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#focustcin)
* [focusTcOut](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#focustcout)
* [fps](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#fps)
* [initialized](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#initialized)
* [isDrawingRectangle](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#isdrawingrectangle)
* [lastSelectedColorIdx](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#private-lastselectedcoloridx)
* [listOfBlocks](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#listofblocks)
* [listOfBlocksContainer](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#listofblockscontainer)
* [logger](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#protected-logger)
* [mainBlockColor](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#mainblockcolor)
* [mainBlockContainer](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#mainblockcontainer)
* [mainLocalisations](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#mainlocalisations)
* [managedDataTypes](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#private-manageddatatypes)
* [mediaPlayerElement](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#mediaplayerelement)
* [playerId](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#playerid)
* [playerService](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#playerservice)
* [pluginInstance](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#plugininstance)
* [pluginName](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#protected-pluginname)
* [selectedBlock](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#selectedblock)
* [selectedBlockElement](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#selectedblockelement)
* [selectionContainer](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#selectioncontainer)
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
* [handleClickToDrawRect](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#handleclicktodrawrect)
* [handleDisplayBlocks](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#handledisplayblocks)
* [handleEnableZoom](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#handleenablezoom)
* [handleMetadataLoaded](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#handlemetadataloaded)
* [handleMetadataProperties](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#private-handlemetadataproperties)
* [handleMouseEnterOnTc](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#handlemouseenterontc)
* [handleMouseLeaveOnTc](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#handlemouseleaveontc)
* [handleMouseMoveToDrawRect](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#handlemousemovetodrawrect)
* [handleOnDurationChange](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#private-handleondurationchange)
* [handleOnTimeChange](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#private-handleontimechange)
* [handleZoomRangeChange](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#handlezoomrangechange)
* [init](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#init)
* [initFocusResizable](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#initfocusresizable)
* [ngOnInit](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#ngoninit)
* [parseTimelineMetadata](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#private-parsetimelinemetadata)
* [refreshTimeCursor](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#refreshtimecursor)
* [toggleAllBlocksState](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#toggleallblocksstate)
* [toggleState](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#togglestate)
* [unZoom](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#unzoom)
* [updateFocusContainerOnSelection](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#updatefocuscontaineronselection)
* [updateMouseEvent](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#updatemouseevent)

### Object literals

* [selectionPosition](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#selectionposition)
* [sortableOptions](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md#sortableoptions)

## Constructors

###  constructor

\+ **new TimelinePluginComponent**(`playerService`: [MediaPlayerService](_src_app_service_media_player_service_.mediaplayerservice.md)): *[TimelinePluginComponent](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md)*

*Overrides [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[constructor](_src_app_core_plugin_plugin_base_.pluginbase.md#protected-constructor)*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:77

**Parameters:**

Name | Type |
------ | ------ |
`playerService` | [MediaPlayerService](_src_app_service_media_player_service_.mediaplayerservice.md) |

**Returns:** *[TimelinePluginComponent](_src_app_plugins_timeline_timeline_plugin_component_.timelineplugincomponent.md)*

## Properties

###  _player

• **_player**: *any*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[_player](_src_app_core_plugin_plugin_base_.pluginbase.md#_player)*

Defined in src/app/core/plugin/plugin-base.ts:23

This plugin configuration

___

###  _pluginConfiguration

• **_pluginConfiguration**: *[PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[TimelineConfig](../interfaces/_src_app_core_config_model_timeline_config_.timelineconfig.md)›*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[_pluginConfiguration](_src_app_core_plugin_plugin_base_.pluginbase.md#_pluginconfiguration)*

Defined in src/app/core/plugin/plugin-base.ts:34

___

### `Private` blocksDisplayStates

• **blocksDisplayStates**: *Map‹string, boolean›* = new Map<string, boolean>()

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:76

___

### `Private` blocksIsOpen

• **blocksIsOpen**: *boolean* = false

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:74

true for open all block

___

###  colors

• **colors**: *Array‹string›* = [
        '#1ABC9C', '#f1c40e', '#95A5A6', '#2ECC71',
        '#E67E21', '#34495E', '#3498DB', '#D8D8D8',
        '#E74C3C', '#F35CF2', '#8E44AD'
    ]

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:50

___

###  configIsOpen

• **configIsOpen**: *boolean* = false

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:36

___

###  currentTime

• **currentTime**: *number* = 0

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:37

___

###  duration

• **duration**: *number* = 0

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:38

___

###  enableDragDrop

• **enableDragDrop**: *boolean* = false

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:35

___

###  enableZoom

• **enableZoom**: *boolean* = false

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:70

___

###  focusContainer

• **focusContainer**: *ElementRef‹HTMLElement›*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:56

___

###  focusTcIn

• **focusTcIn**: *number* = 0

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:40

___

###  focusTcOut

• **focusTcOut**: *number* = 0

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:41

___

###  fps

• **fps**: *any*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[fps](_src_app_core_plugin_plugin_base_.pluginbase.md#fps)*

Defined in src/app/core/plugin/plugin-base.ts:18

___

###  initialized

• **initialized**: *any*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[initialized](_src_app_core_plugin_plugin_base_.pluginbase.md#initialized)*

Defined in src/app/core/plugin/plugin-base.ts:19

___

###  isDrawingRectangle

• **isDrawingRectangle**: *boolean* = false

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:48

___

### `Private` lastSelectedColorIdx

• **lastSelectedColorIdx**: *number* = -1

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:75

___

###  listOfBlocks

• **listOfBlocks**: *Array‹object›*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:27

___

###  listOfBlocksContainer

• **listOfBlocksContainer**: *ElementRef‹HTMLElement›*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:60

___

### `Protected` logger

• **logger**: *[DefaultLogger](_src_app_core_logger_default_logger_.defaultlogger.md)*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[logger](_src_app_core_plugin_plugin_base_.pluginbase.md#protected-logger)*

Defined in src/app/core/plugin/plugin-base.ts:58

___

###  mainBlockColor

• **mainBlockColor**: *string*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:25

___

###  mainBlockContainer

• **mainBlockContainer**: *ElementRef‹HTMLElement›*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:58

___

###  mainLocalisations

• **mainLocalisations**: *Array‹[TimelineLocalisation](../interfaces/_src_app_core_metadata_model_timeline_localisation_.timelinelocalisation.md)›*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:26

___

### `Private` managedDataTypes

• **managedDataTypes**: *[DataType](../enums/_src_app_core_constant_data_type_.datatype.md)[]* = [DataType.SEGMENTATION, DataType.AUDIO_SEGMENTATION, DataType.FACES_RECOGNITION]

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:77

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

###  selectedBlock

• **selectedBlock**: *[TimelineLocalisation](../interfaces/_src_app_core_metadata_model_timeline_localisation_.timelinelocalisation.md)* = null

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:65

___

###  selectedBlockElement

• **selectedBlockElement**: *any* = null

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:62

___

###  selectionContainer

• **selectionContainer**: *ElementRef‹HTMLElement›*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:64

___

###  tcOffset

• **tcOffset**: *number* = 0

*Overrides [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[tcOffset](_src_app_core_plugin_plugin_base_.pluginbase.md#tcoffset)*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:39

___

###  timeFormat

• **timeFormat**: *any*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[timeFormat](_src_app_core_plugin_plugin_base_.pluginbase.md#timeformat)*

Defined in src/app/core/plugin/plugin-base.ts:16

___

###  title

• **title**: *string*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:24

___

### `Static` PLUGIN_NAME

▪ **PLUGIN_NAME**: *string* = "TIMELINE"

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:23

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

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:188

Handle call

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`tc` | number | time code  |

**Returns:** *void*

___

###  changeDisplayState

▸ **changeDisplayState**(`event`: MouseEvent, `block`: object): *void*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:313

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

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:409

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

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:90

Return color color

**Returns:** *string*

___

###  getDefaultConfig

▸ **getDefaultConfig**(): *[PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[TimelineConfig](../interfaces/_src_app_core_config_model_timeline_config_.timelineconfig.md)›*

*Overrides [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[getDefaultConfig](_src_app_core_plugin_plugin_base_.pluginbase.md#abstract-getdefaultconfig)*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:196

Return default config

**Returns:** *[PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[TimelineConfig](../interfaces/_src_app_core_config_model_timeline_config_.timelineconfig.md)›*

___

###  handleClickToDrawRect

▸ **handleClickToDrawRect**(`event`: any): *void*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:459

**Parameters:**

Name | Type |
------ | ------ |
`event` | any |

**Returns:** *void*

___

###  handleDisplayBlocks

▸ **handleDisplayBlocks**(`isValid`: any): *void*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:325

In charge of save or not display block states

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`isValid` | any | true for save display block  |

**Returns:** *void*

___

###  handleEnableZoom

▸ **handleEnableZoom**(): *void*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:492

Enable zoom

**Returns:** *void*

___

###  handleMetadataLoaded

▸ **handleMetadataLoaded**(): *void*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:402

Called when metadata loaded

**Returns:** *void*

___

### `Private` handleMetadataProperties

▸ **handleMetadataProperties**(`listOfMetadata`: any, `metadataManager`: any): *void*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:157

**Parameters:**

Name | Type |
------ | ------ |
`listOfMetadata` | any |
`metadataManager` | any |

**Returns:** *void*

___

###  handleMouseEnterOnTc

▸ **handleMouseEnterOnTc**(`event`: MouseEvent, `localisation`: [TimelineLocalisation](../interfaces/_src_app_core_metadata_model_timeline_localisation_.timelinelocalisation.md)): *void*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:439

On mouse enter on tc bloc

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`event` | MouseEvent | event |
`localisation` | [TimelineLocalisation](../interfaces/_src_app_core_metadata_model_timeline_localisation_.timelinelocalisation.md) | localisation  |

**Returns:** *void*

___

###  handleMouseLeaveOnTc

▸ **handleMouseLeaveOnTc**(`$event`: any): *void*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:453

On mouse enter on tc bloc

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`$event` | any | event  |

**Returns:** *void*

___

###  handleMouseMoveToDrawRect

▸ **handleMouseMoveToDrawRect**(`event`: MouseEvent): *void*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:521

handle mouse to draw

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`event` | MouseEvent | mouse event  |

**Returns:** *void*

___

### `Private` handleOnDurationChange

▸ **handleOnDurationChange**(): *void*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:351

Invoked on duration change

**Returns:** *void*

___

### `Private` handleOnTimeChange

▸ **handleOnTimeChange**(): *void*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:342

Invoked time change event for :
- update progress bar

**Returns:** *void*

___

###  handleZoomRangeChange

▸ **handleZoomRangeChange**(): *void*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:363

In charge to change focus container

**Returns:** *void*

___

###  init

▸ **init**(): *void*

*Overrides [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[init](_src_app_core_plugin_plugin_base_.pluginbase.md#init)*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:96

**Returns:** *void*

___

###  initFocusResizable

▸ **initFocusResizable**(`element`: HTMLElement): *void*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:214

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

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:83

**Returns:** *void*

___

### `Private` parseTimelineMetadata

▸ **parseTimelineMetadata**(): *void*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:121

In charge to parse metadata

**Returns:** *void*

___

###  refreshTimeCursor

▸ **refreshTimeCursor**(): *void*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:375

In charge to refresh time cursor

**Returns:** *void*

___

###  toggleAllBlocksState

▸ **toggleAllBlocksState**(`mainElement`: HTMLElement, `stateControl`: any): *void*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:293

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

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:280

In charge to change display state

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`mainElement` | HTMLElement | parent element  |

**Returns:** *void*

___

###  unZoom

▸ **unZoom**(): *void*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:389

In charge to un-zoom

**Returns:** *void*

___

###  updateFocusContainerOnSelection

▸ **updateFocusContainerOnSelection**(`focusWidth`: any, `leftPos`: any): *void*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:502

In charge to change focus container

**Parameters:**

Name | Type |
------ | ------ |
`focusWidth` | any |
`leftPos` | any |

**Returns:** *void*

___

###  updateMouseEvent

▸ **updateMouseEvent**(`event`: any): *void*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:533

Update mouse position

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`event` | any | mouse event  |

**Returns:** *void*

## Object literals

###  selectionPosition

### ▪ **selectionPosition**: *object*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:42

###  startX

• **startX**: *number* = 0

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:45

###  startY

• **startY**: *number* = 0

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:46

###  x

• **x**: *number* = 0

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:43

###  y

• **y**: *number* = 0

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:44

___

###  sortableOptions

### ▪ **sortableOptions**: *object*

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:66

###  filter

• **filter**: *string* = ".filtered"

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:68

###  handle

• **handle**: *string* = ".drag"

Defined in src/app/plugins/timeline/timeline-plugin.component.ts:67
