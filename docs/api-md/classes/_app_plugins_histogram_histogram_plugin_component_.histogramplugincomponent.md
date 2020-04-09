[Amalia](../README.md) › [Globals](../globals.md) › ["app/plugins/histogram/histogram-plugin.component"](../modules/_app_plugins_histogram_histogram_plugin_component_.md) › [HistogramPluginComponent](_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md)

# Class: HistogramPluginComponent

## Hierarchy

* [PluginBase](_app_core_plugin_plugin_base_.pluginbase.md)‹[HistogramConfig](../interfaces/_app_core_config_model_histogram_config_.histogramconfig.md)›

  ↳ **HistogramPluginComponent**

## Implements

* OnInit
* OnInit

## Index

### Constructors

* [constructor](_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#constructor)

### Properties

* [currentTime](_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#currenttime)
* [duration](_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#duration)
* [listOfHistograms](_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#listofhistograms)
* [logger](_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#protected-logger)
* [mediaPlayerElement](_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#mediaplayerelement)
* [playerId](_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#playerid)
* [playerService](_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#playerservice)
* [pluginName](_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#protected-pluginname)
* [withFocus](_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#withfocus)
* [PLUGIN_NAME](_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#static-plugin_name)

### Accessors

* [player](_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#player)
* [pluginConfiguration](_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#pluginconfiguration)

### Methods

* [drawHistograms](_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#private-drawhistograms)
* [getDefaultConfig](_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#getdefaultconfig)
* [handleMetadataLoaded](_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#private-handlemetadataloaded)
* [handleOnDurationChange](_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#private-handleondurationchange)
* [handleOnTimeChange](_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#private-handleontimechange)
* [init](_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#init)
* [ngOnInit](_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#ngoninit)
* [drawHistogram](_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md#static-drawhistogram)

## Constructors

###  constructor

\+ **new HistogramPluginComponent**(`playerService`: [MediaPlayerService](_app_service_media_player_service_.mediaplayerservice.md)): *[HistogramPluginComponent](_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md)*

*Overrides [PluginBase](_app_core_plugin_plugin_base_.pluginbase.md).[constructor](_app_core_plugin_plugin_base_.pluginbase.md#protected-constructor)*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:20

**Parameters:**

Name | Type |
------ | ------ |
`playerService` | [MediaPlayerService](_app_service_media_player_service_.mediaplayerservice.md) |

**Returns:** *[HistogramPluginComponent](_app_plugins_histogram_histogram_plugin_component_.histogramplugincomponent.md)*

## Properties

###  currentTime

• **currentTime**: *number*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:30

Return  current time

___

###  duration

• **duration**: *number*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:34

Media duration

___

###  listOfHistograms

• **listOfHistograms**: *Array‹object›*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:42

list of histograms

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

###  withFocus

• **withFocus**: *boolean* = false

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:38

Enable focus container

___

### `Static` PLUGIN_NAME

▪ **PLUGIN_NAME**: *string* = "HISTOGRAM"

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:26

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

• **get pluginConfiguration**(): *[PluginConfigData](../interfaces/_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[HistogramConfig](../interfaces/_app_core_config_model_histogram_config_.histogramconfig.md)›*

*Inherited from [PluginBase](_app_core_plugin_plugin_base_.pluginbase.md).[pluginConfiguration](_app_core_plugin_plugin_base_.pluginbase.md#pluginconfiguration)*

Defined in src/app/core/plugin/plugin-base.ts:35

**Returns:** *[PluginConfigData](../interfaces/_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[HistogramConfig](../interfaces/_app_core_config_model_histogram_config_.histogramconfig.md)›*

• **set pluginConfiguration**(`value`: [PluginConfigData](../interfaces/_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[HistogramConfig](../interfaces/_app_core_config_model_histogram_config_.histogramconfig.md)›): *void*

*Inherited from [PluginBase](_app_core_plugin_plugin_base_.pluginbase.md).[pluginConfiguration](_app_core_plugin_plugin_base_.pluginbase.md#pluginconfiguration)*

Defined in src/app/core/plugin/plugin-base.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`value` | [PluginConfigData](../interfaces/_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[HistogramConfig](../interfaces/_app_core_config_model_histogram_config_.histogramconfig.md)› |

**Returns:** *void*

## Methods

### `Private` drawHistograms

▸ **drawHistograms**(`histograms`: Array‹[Histogram](../interfaces/_app_core_metadata_model_histogram_.histogram.md)›): *void*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:104

Handle draw histogram

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`histograms` | Array‹[Histogram](../interfaces/_app_core_metadata_model_histogram_.histogram.md)› | list of histogram metadata  |

**Returns:** *void*

___

###  getDefaultConfig

▸ **getDefaultConfig**(): *[PluginConfigData](../interfaces/_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[HistogramConfig](../interfaces/_app_core_config_model_histogram_config_.histogramconfig.md)›*

*Overrides [PluginBase](_app_core_plugin_plugin_base_.pluginbase.md).[getDefaultConfig](_app_core_plugin_plugin_base_.pluginbase.md#abstract-getdefaultconfig)*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:93

Return default config

**Returns:** *[PluginConfigData](../interfaces/_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[HistogramConfig](../interfaces/_app_core_config_model_histogram_config_.histogramconfig.md)›*

___

### `Private` handleMetadataLoaded

▸ **handleMetadataLoaded**(): *void*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:138

Invoked on metadata loaded

**Returns:** *void*

___

### `Private` handleOnDurationChange

▸ **handleOnDurationChange**(): *void*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:129

Invoked on duration change

**Returns:** *void*

___

### `Private` handleOnTimeChange

▸ **handleOnTimeChange**(): *void*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:121

Invoked time change event

**Returns:** *void*

___

###  init

▸ **init**(): *void*

*Overrides [PluginBase](_app_core_plugin_plugin_base_.pluginbase.md).[init](_app_core_plugin_plugin_base_.pluginbase.md#init)*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:82

**Returns:** *void*

___

###  ngOnInit

▸ **ngOnInit**(): *void*

*Overrides [PluginBase](_app_core_plugin_plugin_base_.pluginbase.md).[ngOnInit](_app_core_plugin_plugin_base_.pluginbase.md#ngoninit)*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:77

**Returns:** *void*

___

### `Static` drawHistogram

▸ **drawHistogram**(`posBins`: string, `negBins`: string, `posMax`: number, `negMax`: number, `mirror`: boolean): *object*

Defined in src/app/plugins/histogram/histogram-plugin.component.ts:53

Handle draw histogram return tuple with positive bins and negative bins
In charge to create svg paths

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`posBins` | string | - | positive bins |
`negBins` | string | - | negative bins |
`posMax` | number | - | max positive bin |
`negMax` | number | - | max negative bin |
`mirror` | boolean | false | true for enable mirror histogram  |

**Returns:** *object*

* **maxHeight**: *number*

* **nbBins**: *number*

* **paths**: *[string, string]*
