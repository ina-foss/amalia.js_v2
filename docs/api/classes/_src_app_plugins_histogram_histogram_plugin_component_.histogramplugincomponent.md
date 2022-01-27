[Amalia](../README.md) › [Globals](../globals.md) › ["src/app/plugins/histogram/histogram-plugin.component"](../modules/_src_app_plugins_histogram_histogram_plugin_component_.md) › [HistogramPluginComponent](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md)

# Class: HistogramPluginComponent

## Hierarchy

* [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md)‹[HistogramConfig](../interfaces/_src_app_core_config_model_histogram_config_.histogramconfig.md)›

  ↳ **HistogramPluginComponent**

## Implements

* OnInit
* OnInit

## Index

### Constructors

* [constructor](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#constructor)

### Properties

* [_player](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#_player)
* [_pluginConfiguration](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#_pluginconfiguration)
* [active](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#active)
* [currentTime](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#currenttime)
* [cursorPosition](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#cursorposition)
* [cursorZoomPosition](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#cursorzoomposition)
* [displayState](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#displaystate)
* [duration](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#duration)
* [fps](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#fps)
* [histogramContainerElement](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#histogramcontainerelement)
* [histogramPosition](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#histogramposition)
* [histograms](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#histograms)
* [httpClient](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#private-httpclient)
* [initialized](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#initialized)
* [isplaying](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#isplaying)
* [label](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#label)
* [listOfHistograms](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#listofhistograms)
* [logger](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#protected-logger)
* [mediaPlayerElement](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#mediaplayerelement)
* [minZoomSize](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#minzoomsize)
* [moving](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#moving)
* [playerId](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#playerid)
* [playerService](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#playerservice)
* [pluginInstance](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#plugininstance)
* [pluginName](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#protected-pluginname)
* [position](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#position)
* [sliderElement](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#sliderelement)
* [sliderPosition](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#sliderposition)
* [style](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#style)
* [tcOffset](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#tcoffset)
* [timeFormat](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#timeformat)
* [withFocus](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#withfocus)
* [zoomSize](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#zoomsize)
* [zoomedHistograms](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#zoomedhistograms)
* [zoomedWidth](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#zoomedwidth)
* [PLUGIN_NAME](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#static-plugin_name)

### Accessors

* [player](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#player)
* [pluginConfiguration](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#pluginconfiguration)

### Methods

* [drawHistogram](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#drawhistogram)
* [drawHistograms](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#private-drawhistograms)
* [getDefaultConfig](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#getdefaultconfig)
* [getZoomedWidth](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#private-getzoomedwidth)
* [handleCursorMove](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#private-handlecursormove)
* [handleDisplayState](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#handledisplaystate)
* [handleHistogramsClick](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#handlehistogramsclick)
* [handleMetadataLoaded](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#private-handlemetadataloaded)
* [handleOnDurationChange](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#private-handleondurationchange)
* [handleOnTimeChange](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#private-handleontimechange)
* [handleWindowResize](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#handlewindowresize)
* [init](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#init)
* [initSliderEvents](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#initsliderevents)
* [initializeCursors](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#initializecursors)
* [ngOnInit](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#ngoninit)
* [onContextMenu](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#oncontextmenu)
* [updateCursors](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#updatecursors)
* [updateTimeCursors](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#updatetimecursors)
* [updateZoomedSvg](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#updatezoomedsvg)

## Constructors

###  constructor

\+ **new HistogramPluginComponent**(`httpClient`: HttpClient, `playerService`: [MediaPlayerService](_src_app_service_media_player_service_.mediaplayerservice.md)): *[HistogramPluginComponent](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md)*

*Overrides [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[constructor](_src_app_core_plugin_plugin_base_.pluginbase.md#protected-constructor)*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:24

**Parameters:**

Name | Type |
------ | ------ |
`httpClient` | HttpClient |
`playerService` | [MediaPlayerService](_src_app_service_media_player_service_.mediaplayerservice.md) |

**Returns:** *[HistogramPluginComponent](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md)*

## Properties

###  _player

• **_player**: *any*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[_player](_src_app_core_plugin_plugin_base_.pluginbase.md#_player)*

Defined in src/app/core/plugin/plugin-base.ts:23

This plugin configuration

___

###  _pluginConfiguration

• **_pluginConfiguration**: *[PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[HistogramConfig](../interfaces/_src_app_core_config_model_histogram_config_.histogramconfig.md)›*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[_pluginConfiguration](_src_app_core_plugin_plugin_base_.pluginbase.md#_pluginconfiguration)*

Defined in src/app/core/plugin/plugin-base.ts:34

___

###  active

• **active**: *boolean* = false

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:79

state of hover cursor

___

###  currentTime

• **currentTime**: *number*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:39

Return  current time

___

###  cursorPosition

• **cursorPosition**: *number* = 0

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:67

Cursor position

___

###  cursorZoomPosition

• **cursorZoomPosition**: *number* = 0

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:71

Cursor zoom position

___

###  displayState

• **displayState**: *any*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:105

Plugin display state

___

###  duration

• **duration**: *number*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:43

Media duration

___

###  fps

• **fps**: *any*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[fps](_src_app_core_plugin_plugin_base_.pluginbase.md#fps)*

Defined in src/app/core/plugin/plugin-base.ts:18

___

###  histogramContainerElement

• **histogramContainerElement**: *ElementRef‹HTMLElement›*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:88

html element histogramContainer

___

###  histogramPosition

• **histogramPosition**: *number* = 0

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:55

Zoomed histogram histogram

___

###  histograms

• **histograms**: *ElementRef‹HTMLElement›*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:92

___

### `Private` httpClient

• **httpClient**: *HttpClient*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:24

___

###  initialized

• **initialized**: *any*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[initialized](_src_app_core_plugin_plugin_base_.pluginbase.md#initialized)*

Defined in src/app/core/plugin/plugin-base.ts:19

___

###  isplaying

• **isplaying**: *boolean*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:35

state of video

___

###  label

• **label**: *any*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:101

___

###  listOfHistograms

• **listOfHistograms**: *Array‹object›*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:75

list of histograms

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

###  minZoomSize

• **minZoomSize**: *number* = 1

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:63

Min zoom size 10% of container width

___

###  moving

• **moving**: *boolean* = false

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:83

state of histograms

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

###  position

• **position**: *number*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:98

Mouse Positions

___

###  sliderElement

• **sliderElement**: *ElementRef‹HTMLElement›*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:90

___

###  sliderPosition

• **sliderPosition**: *number* = 0

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:51

left slider position

___

###  style

• **style**: *string* = 'translate('  + this.sliderPosition + 'px)'

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:100

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

###  withFocus

• **withFocus**: *boolean* = false

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:47

Enable focus container

___

###  zoomSize

• **zoomSize**: *number* = 10

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:59

zoom size 10% of container width

___

###  zoomedHistograms

• **zoomedHistograms**: *ElementRef‹HTMLElement›*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:94

___

###  zoomedWidth

• **zoomedWidth**: *any*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:99

___

### `Static` PLUGIN_NAME

▪ **PLUGIN_NAME**: *string* = "HISTOGRAM"

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:23

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

• **get pluginConfiguration**(): *[PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[HistogramConfig](../interfaces/_src_app_core_config_model_histogram_config_.histogramconfig.md)›*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[pluginConfiguration](_src_app_core_plugin_plugin_base_.pluginbase.md#pluginconfiguration)*

Defined in src/app/core/plugin/plugin-base.ts:36

**Returns:** *[PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[HistogramConfig](../interfaces/_src_app_core_config_model_histogram_config_.histogramconfig.md)›*

• **set pluginConfiguration**(`value`: [PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[HistogramConfig](../interfaces/_src_app_core_config_model_histogram_config_.histogramconfig.md)›): *void*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[pluginConfiguration](_src_app_core_plugin_plugin_base_.pluginbase.md#pluginconfiguration)*

Defined in src/app/core/plugin/plugin-base.ts:41

**Parameters:**

Name | Type |
------ | ------ |
`value` | [PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[HistogramConfig](../interfaces/_src_app_core_config_model_histogram_config_.histogramconfig.md)› |

**Returns:** *void*

## Methods

###  drawHistogram

▸ **drawHistogram**(`nbBins`: number, `posBins`: string, `negBins`: string, `posMax`: number, `negMax`: number, `mirror`: boolean, `zoomed`: any, `label?`: any): *object*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:115

Handle draw histogram return tuple with positive bins and negative bins
In charge to create svg paths

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`nbBins` | number | - | - |
`posBins` | string | - | positive bins |
`negBins` | string | - | negative bins |
`posMax` | number | - | max positive bin |
`negMax` | number | - | max negative bin |
`mirror` | boolean | false | true for enable mirror histogram  |
`zoomed` | any | - | - |
`label?` | any | - | - |

**Returns:** *object*

* **label**? : *string*

* **nbBins**: *number*

* **negMax**: *number*

* **paths**: *[string, string]*

* **posMax**: *number*

* **scale**: *[string, string]*

___

### `Private` drawHistograms

▸ **drawHistograms**(`histograms`: Array‹[Histogram](../interfaces/_src_app_core_metadata_model_histogram_.histogram.md)›): *void*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:185

Handle draw histogram

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`histograms` | Array‹[Histogram](../interfaces/_src_app_core_metadata_model_histogram_.histogram.md)› | list of histogram metadata  |

**Returns:** *void*

___

###  getDefaultConfig

▸ **getDefaultConfig**(): *[PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[HistogramConfig](../interfaces/_src_app_core_config_model_histogram_config_.histogramconfig.md)›*

*Overrides [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[getDefaultConfig](_src_app_core_plugin_plugin_base_.pluginbase.md#abstract-getdefaultconfig)*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:175

Return default config

**Returns:** *[PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[HistogramConfig](../interfaces/_src_app_core_config_model_histogram_config_.histogramconfig.md)›*

___

### `Private` getZoomedWidth

▸ **getZoomedWidth**(`width`: any, `zoom`: any): *number*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:322

return zoomed svg Width

**Parameters:**

Name | Type |
------ | ------ |
`width` | any |
`zoom` | any |

**Returns:** *number*

___

### `Private` handleCursorMove

▸ **handleCursorMove**(`currentTime`: any): *void*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:221

Invoked cursor move event

**Parameters:**

Name | Type |
------ | ------ |
`currentTime` | any |

**Returns:** *void*

___

###  handleDisplayState

▸ **handleDisplayState**(): *void*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:497

switch container class based on width

**Returns:** *void*

___

###  handleHistogramsClick

▸ **handleHistogramsClick**(`event`: any): *void*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:240

**Parameters:**

Name | Type |
------ | ------ |
`event` | any |

**Returns:** *void*

___

### `Private` handleMetadataLoaded

▸ **handleMetadataLoaded**(): *void*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:341

Invoked on metadata loaded

**Returns:** *void*

___

### `Private` handleOnDurationChange

▸ **handleOnDurationChange**(): *void*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:332

Invoked on duration change

**Returns:** *void*

___

### `Private` handleOnTimeChange

▸ **handleOnTimeChange**(): *void*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:213

Invoked time change event

**Returns:** *void*

___

###  handleWindowResize

▸ **handleWindowResize**(): *void*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:505

update all scales on window resize

**Returns:** *void*

___

###  init

▸ **init**(): *void*

*Overrides [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[init](_src_app_core_plugin_plugin_base_.pluginbase.md#init)*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:163

**Returns:** *void*

___

###  initSliderEvents

▸ **initSliderEvents**(): *void*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:356

slider events

**Returns:** *void*

___

###  initializeCursors

▸ **initializeCursors**(): *void*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:253

Initialize cursors

**Returns:** *void*

___

###  ngOnInit

▸ **ngOnInit**(): *void*

*Overrides [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[ngOnInit](_src_app_core_plugin_plugin_base_.pluginbase.md#ngoninit)*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:158

**Returns:** *void*

___

###  onContextMenu

▸ **onContextMenu**(`event`: MouseEvent): *void*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:516

Invoked on click context menu

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`event` | MouseEvent | mouse event |

**Returns:** *void*

return false for disable browser context menu

___

###  updateCursors

▸ **updateCursors**(`currentTime`: any): *void*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:285

update slider position

**Parameters:**

Name | Type |
------ | ------ |
`currentTime` | any |

**Returns:** *void*

___

###  updateTimeCursors

▸ **updateTimeCursors**(`currentTime`: any, `ratio`: any, `start`: any): *void*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:264

update time cursor

**Parameters:**

Name | Type |
------ | ------ |
`currentTime` | any |
`ratio` | any |
`start` | any |

**Returns:** *void*

___

###  updateZoomedSvg

▸ **updateZoomedSvg**(`onlyResized`: any): *void*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:448

update scale of zoomed svg on zoom resize

**Parameters:**

Name | Type |
------ | ------ |
`onlyResized` | any |

**Returns:** *void*
