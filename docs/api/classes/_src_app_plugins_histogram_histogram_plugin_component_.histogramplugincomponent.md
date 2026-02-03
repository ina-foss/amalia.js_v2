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
* [histogramPosition](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#histogramposition)
* [histograms](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#histograms)
* [histogramsList](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#private-histogramslist)
* [httpClient](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#private-httpclient)
* [inResizing](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#inresizing)
* [initialized](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#initialized)
* [listOfHistograms](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#listofhistograms)
* [logger](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#protected-logger)
* [mediaPlayerElement](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#mediaplayerelement)
* [minZoomSize](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#minzoomsize)
* [pinned](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#pinned)
* [pinnedControlbar](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#pinnedcontrolbar)
* [playerId](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#playerid)
* [playerService](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#playerservice)
* [pluginInstance](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#plugininstance)
* [pluginName](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#protected-pluginname)
* [position](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#position)
* [sliderElement](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#sliderelement)
* [sliderPosition](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#sliderposition)
* [tcOffset](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#tcoffset)
* [timeFormat](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#timeformat)
* [withFocus](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#withfocus)
* [zoomSize](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#zoomsize)
* [CURSOR_ELM](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#static-cursor_elm)
* [HISTOGRAM_ELM](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#static-histogram_elm)
* [PLUGIN_NAME](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#static-plugin_name)
* [ZOOM_HISTOGRAM_ELM](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#static-zoom_histogram_elm)

### Accessors

* [player](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#player)
* [pluginConfiguration](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#pluginconfiguration)

### Methods

* [drawHistogram](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#drawhistogram)
* [drawHistograms](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#private-drawhistograms)
* [getDefaultConfig](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#getdefaultconfig)
* [handleDisplayState](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#handledisplaystate)
* [handleHistogramClick](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#handlehistogramclick)
* [handleMetadataLoaded](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#private-handlemetadataloaded)
* [handleOnDurationChange](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#private-handleondurationchange)
* [handleOnTimeChange](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#private-handleontimechange)
* [handlePinnedControlbarChange](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#handlepinnedcontrolbarchange)
* [handlePinnedSliderChange](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#handlepinnedsliderchange)
* [handleWindowResize](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#handlewindowresize)
* [init](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#init)
* [initSliderEvents](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#initsliderevents)
* [ngOnInit](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#ngoninit)
* [slideFocus](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#private-slidefocus)
* [slideFocusWithMid](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#private-slidefocuswithmid)
* [updateCursors](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#private-updatecursors)
* [updateTc](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#private-updatetc)
* [updateZoomContainer](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#private-updatezoomcontainer)

## Constructors

###  constructor

\+ **new HistogramPluginComponent**(`httpClient`: HttpClient, `playerService`: [MediaPlayerService](_src_app_service_media_player_service_.mediaplayerservice.md)): *[HistogramPluginComponent](_src_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md)*

*Overrides [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[constructor](_src_app_core_plugin_plugin_base_.pluginbase.md#protected-constructor)*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:102

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

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:75

state of hover cursor

___

###  currentTime

• **currentTime**: *number*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:35

Return  current time

___

###  cursorPosition

• **cursorPosition**: *number* = 0

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:63

Cursor position

___

###  cursorZoomPosition

• **cursorZoomPosition**: *number* = 0

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:67

Cursor zoom position

___

###  displayState

• **displayState**: *any*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:97

Plugin display state

___

###  duration

• **duration**: *number*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:39

Media duration

___

###  fps

• **fps**: *any*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[fps](_src_app_core_plugin_plugin_base_.pluginbase.md#fps)*

Defined in src/app/core/plugin/plugin-base.ts:18

___

###  histogramPosition

• **histogramPosition**: *number* = 0

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:51

Zoomed histogram

___

###  histograms

• **histograms**: *ElementRef‹HTMLElement›*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:81

___

### `Private` histogramsList

• **histogramsList**: *any[]* = []

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:102

List of histogram drawn

___

### `Private` httpClient

• **httpClient**: *HttpClient*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:26

___

###  inResizing

• **inResizing**: *boolean* = false

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:31

True when user resize the focus container

___

###  initialized

• **initialized**: *any*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[initialized](_src_app_core_plugin_plugin_base_.pluginbase.md#initialized)*

Defined in src/app/core/plugin/plugin-base.ts:19

___

###  listOfHistograms

• **listOfHistograms**: *object[]*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:71

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

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:59

Min zoom size 10% of container width

___

###  pinned

• **pinned**: *boolean* = false

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:85

Pinned ControlBar state

___

###  pinnedControlbar

• **pinnedControlbar**: *boolean* = false

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:89

Pinned Slider state

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

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:93

Mouse Positions

___

###  sliderElement

• **sliderElement**: *ElementRef‹HTMLElement›*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:78

___

###  sliderPosition

• **sliderPosition**: *number* = 0

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:47

left slider position

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

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:43

Enable focus conteneur

___

###  zoomSize

• **zoomSize**: *number* = 10

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:55

zoom size 10% of container width

___

### `Static` CURSOR_ELM

▪ **CURSOR_ELM**: *string* = "cursor"

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:23

___

### `Static` HISTOGRAM_ELM

▪ **HISTOGRAM_ELM**: *string* = "histogram"

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:24

___

### `Static` PLUGIN_NAME

▪ **PLUGIN_NAME**: *string* = "HISTOGRAM"

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:22

___

### `Static` ZOOM_HISTOGRAM_ELM

▪ **ZOOM_HISTOGRAM_ELM**: *string* = "zoom-histogram"

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:25

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

▸ **drawHistogram**(`posBins`: string, `negBins`: string, `posMax`: number, `negMax`: number, `mirror`: boolean, `zoom`: boolean, `label`: string): *object*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:150

Handle draw histogram return tuple with positive bins and negative bins
In charge to create svg paths

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`posBins` | string | - | positive bins |
`negBins` | string | - | negative bins |
`posMax` | number | - | max positive bin |
`negMax` | number | - | max negative bin |
`mirror` | boolean | false | true for enable mirror histogram |
`zoom` | boolean | - | true for enable zoom container |
`label` | string | - | histogram label  |

**Returns:** *object*

* **label**: *string*

* **nbBins**: *number*

* **negMax**: *number*

* **paths**: *[string, string]*

* **posMax**: *number*

* **viewBox**: *string*

* **zoom**: *boolean*

___

### `Private` drawHistograms

▸ **drawHistograms**(`histograms`: Array‹[Histogram](../interfaces/_src_app_core_metadata_model_histogram_.histogram.md)›, `labels`: Array‹string›, `zoomMetadataIdx`: Array‹number›): *void*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:192

Handle draw histogram

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`histograms` | Array‹[Histogram](../interfaces/_src_app_core_metadata_model_histogram_.histogram.md)› | list of histogram metadata |
`labels` | Array‹string› | histogram labels |
`zoomMetadataIdx` | Array‹number› | list of index  |

**Returns:** *void*

___

###  getDefaultConfig

▸ **getDefaultConfig**(): *[PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[HistogramConfig](../interfaces/_src_app_core_config_model_histogram_config_.histogramconfig.md)›*

*Overrides [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[getDefaultConfig](_src_app_core_plugin_plugin_base_.pluginbase.md#abstract-getdefaultconfig)*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:179

Return default config

**Returns:** *[PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[HistogramConfig](../interfaces/_src_app_core_config_model_histogram_config_.histogramconfig.md)›*

___

###  handleDisplayState

▸ **handleDisplayState**(): *void*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:268

switch container class based on width

**Returns:** *void*

___

###  handleHistogramClick

▸ **handleHistogramClick**(`event`: any): *void*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:450

Handle on click to histogram

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`event` | any | mouse event  |

**Returns:** *void*

___

### `Private` handleMetadataLoaded

▸ **handleMetadataLoaded**(): *void*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:238

Invoked on metadata loaded

**Returns:** *void*

___

### `Private` handleOnDurationChange

▸ **handleOnDurationChange**(): *void*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:227

Invoked on duration change

**Returns:** *void*

___

### `Private` handleOnTimeChange

▸ **handleOnTimeChange**(): *void*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:213

Invoked time change event

**Returns:** *void*

___

###  handlePinnedControlbarChange

▸ **handlePinnedControlbarChange**(`event`: any): *void*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:130

**Parameters:**

Name | Type |
------ | ------ |
`event` | any |

**Returns:** *void*

___

###  handlePinnedSliderChange

▸ **handlePinnedSliderChange**(`event`: any): *void*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:135

**Parameters:**

Name | Type |
------ | ------ |
`event` | any |

**Returns:** *void*

___

###  handleWindowResize

▸ **handleWindowResize**(): *void*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:276

update all scales on window resize

**Returns:** *void*

___

###  init

▸ **init**(): *void*

*Overrides [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[init](_src_app_core_plugin_plugin_base_.pluginbase.md#init)*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:119

**Returns:** *void*

___

###  initSliderEvents

▸ **initSliderEvents**(): *void*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:284

slider events

**Returns:** *void*

___

###  ngOnInit

▸ **ngOnInit**(): *void*

*Overrides [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[ngOnInit](_src_app_core_plugin_plugin_base_.pluginbase.md#ngoninit)*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:113

**Returns:** *void*

___

### `Private` slideFocus

▸ **slideFocus**(`tc`: any): *void*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:430

Slide focus container

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`tc` | any | timecode  |

**Returns:** *void*

___

### `Private` slideFocusWithMid

▸ **slideFocusWithMid**(`tc`: any): *void*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:416

Slide with cursor in middle

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`tc` | any | timecode  |

**Returns:** *void*

___

### `Private` updateCursors

▸ **updateCursors**(`tc`: number): *void*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:393

Update cursor

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`tc` | number | time code  |

**Returns:** *void*

___

### `Private` updateTc

▸ **updateTc**(): *void*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:350

In charge to calculate TC with slider

**Returns:** *void*

___

### `Private` updateZoomContainer

▸ **updateZoomContainer**(`zTcIn`: number, `zTcOut`: number): *void*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:368

In charge to update zoom container size

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`zTcIn` | number | start time code |
`zTcOut` | number | end time code  |

**Returns:** *void*
