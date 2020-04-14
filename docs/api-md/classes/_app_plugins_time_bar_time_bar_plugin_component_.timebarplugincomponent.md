[Amalia](../README.md) › [Globals](../globals.md) › ["app/plugins/time-bar/time-bar-plugin.component"](../modules/_app_plugins_time_bar_time_bar_plugin_component_.md) › [TimeBarPluginComponent](_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md)

# Class: TimeBarPluginComponent

## Hierarchy

* [PluginBase](_app_core_plugin_plugin_base_.pluginbase.md)‹[TimeBarConfig](../interfaces/_app_core_config_model__time_bar_config_.timebarconfig.md)›

  ↳ **TimeBarPluginComponent**

## Implements

* OnInit
* OnInit

## Index

### Constructors

* [constructor](_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md#constructor)

### Properties

* [currentTime](_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md#currenttime)
* [displayFormat](_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md#displayformat)
* [displayState](_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md#displaystate)
* [duration](_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md#duration)
* [fps](_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md#fps)
* [logger](_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md#protected-logger)
* [mediaPlayerElement](_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md#mediaplayerelement)
* [playerId](_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md#playerid)
* [playerService](_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md#playerservice)
* [pluginName](_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md#protected-pluginname)
* [startTc](_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md#starttc)
* [PLUGIN_NAME](_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md#static-plugin_name)

### Accessors

* [player](_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md#player)
* [pluginConfiguration](_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md#pluginconfiguration)

### Methods

* [getDefaultConfig](_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md#getdefaultconfig)
* [handleOnDurationChange](_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md#private-handleondurationchange)
* [handleOnTimeChange](_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md#private-handleontimechange)
* [init](_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md#init)
* [ngOnInit](_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md#ngoninit)

## Constructors

###  constructor

\+ **new TimeBarPluginComponent**(`playerService`: [MediaPlayerService](_app_service_media_player_service_.mediaplayerservice.md)): *[TimeBarPluginComponent](_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md)*

*Overrides [PluginBase](_app_core_plugin_plugin_base_.pluginbase.md).[constructor](_app_core_plugin_plugin_base_.pluginbase.md#protected-constructor)*

Defined in src/app/plugins/time-bar/time-bar-plugin.component.ts:44

**Parameters:**

Name | Type |
------ | ------ |
`playerService` | [MediaPlayerService](_app_service_media_player_service_.mediaplayerservice.md) |

**Returns:** *[TimeBarPluginComponent](_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md)*

## Properties

###  currentTime

• **currentTime**: *number*

Defined in src/app/plugins/time-bar/time-bar-plugin.component.ts:26

Return  current time

___

###  displayFormat

• **displayFormat**: *"h" | "m" | "s" | "f" | "ms" | "mms"* = "f"

Defined in src/app/plugins/time-bar/time-bar-plugin.component.ts:35

Display format specifier h|m|s|f|ms|mms

___

###  displayState

• **displayState**: *"small" | "large"* = "large"

Defined in src/app/plugins/time-bar/time-bar-plugin.component.ts:44

Plugin display state

___

###  duration

• **duration**: *number*

Defined in src/app/plugins/time-bar/time-bar-plugin.component.ts:30

Media duration

___

###  fps

• **fps**: *[FPS](../enums/_app_core_constant_default_.default.md#fps)* = DEFAULT.FPS

Defined in src/app/plugins/time-bar/time-bar-plugin.component.ts:39

Media fps

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

###  startTc

• **startTc**: *number*

Defined in src/app/plugins/time-bar/time-bar-plugin.component.ts:21

Return  current time

___

### `Static` PLUGIN_NAME

▪ **PLUGIN_NAME**: *string* = "TIME_BAR"

Defined in src/app/plugins/time-bar/time-bar-plugin.component.ts:17

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

• **get pluginConfiguration**(): *[PluginConfigData](../interfaces/_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[TimeBarConfig](../interfaces/_app_core_config_model__time_bar_config_.timebarconfig.md)›*

*Inherited from [PluginBase](_app_core_plugin_plugin_base_.pluginbase.md).[pluginConfiguration](_app_core_plugin_plugin_base_.pluginbase.md#pluginconfiguration)*

Defined in src/app/core/plugin/plugin-base.ts:35

**Returns:** *[PluginConfigData](../interfaces/_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[TimeBarConfig](../interfaces/_app_core_config_model__time_bar_config_.timebarconfig.md)›*

• **set pluginConfiguration**(`value`: [PluginConfigData](../interfaces/_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[TimeBarConfig](../interfaces/_app_core_config_model__time_bar_config_.timebarconfig.md)›): *void*

*Inherited from [PluginBase](_app_core_plugin_plugin_base_.pluginbase.md).[pluginConfiguration](_app_core_plugin_plugin_base_.pluginbase.md#pluginconfiguration)*

Defined in src/app/core/plugin/plugin-base.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`value` | [PluginConfigData](../interfaces/_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[TimeBarConfig](../interfaces/_app_core_config_model__time_bar_config_.timebarconfig.md)› |

**Returns:** *void*

## Methods

###  getDefaultConfig

▸ **getDefaultConfig**(): *[PluginConfigData](../interfaces/_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[TimeBarConfig](../interfaces/_app_core_config_model__time_bar_config_.timebarconfig.md)›*

*Overrides [PluginBase](_app_core_plugin_plugin_base_.pluginbase.md).[getDefaultConfig](_app_core_plugin_plugin_base_.pluginbase.md#abstract-getdefaultconfig)*

Defined in src/app/plugins/time-bar/time-bar-plugin.component.ts:64

Return default config

**Returns:** *[PluginConfigData](../interfaces/_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[TimeBarConfig](../interfaces/_app_core_config_model__time_bar_config_.timebarconfig.md)›*

___

### `Private` handleOnDurationChange

▸ **handleOnDurationChange**(): *void*

Defined in src/app/plugins/time-bar/time-bar-plugin.component.ts:81

Invoked on duration change

**Returns:** *void*

___

### `Private` handleOnTimeChange

▸ **handleOnTimeChange**(): *void*

Defined in src/app/plugins/time-bar/time-bar-plugin.component.ts:73

Invoked time change event for :
- update current time

**Returns:** *void*

___

###  init

▸ **init**(): *void*

*Overrides [PluginBase](_app_core_plugin_plugin_base_.pluginbase.md).[init](_app_core_plugin_plugin_base_.pluginbase.md#init)*

Defined in src/app/plugins/time-bar/time-bar-plugin.component.ts:55

**Returns:** *void*

___

###  ngOnInit

▸ **ngOnInit**(): *void*

*Overrides [PluginBase](_app_core_plugin_plugin_base_.pluginbase.md).[ngOnInit](_app_core_plugin_plugin_base_.pluginbase.md#ngoninit)*

Defined in src/app/plugins/time-bar/time-bar-plugin.component.ts:50

**Returns:** *void*
