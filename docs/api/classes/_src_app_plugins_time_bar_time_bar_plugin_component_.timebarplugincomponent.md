[Amalia](../README.md) › [Globals](../globals.md) › ["src/app/plugins/time-bar/time-bar-plugin.component"](../modules/_src_app_plugins_time_bar_time_bar_plugin_component_.md) › [TimeBarPluginComponent](_src_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md)

# Class: TimeBarPluginComponent

## Hierarchy

* [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md)‹[TimeBarConfig](../interfaces/_src_app_core_config_model_time_bar_config_.timebarconfig.md)›

  ↳ **TimeBarPluginComponent**

## Implements

* OnInit
* OnInit

## Index

### Constructors

* [constructor](_src_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md#constructor)

### Properties

* [_player](_src_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md#_player)
* [_pluginConfiguration](_src_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md#_pluginconfiguration)
* [active](_src_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md#active)
* [displayFormat](_src_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md#displayformat)
* [displayState](_src_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md#displaystate)
* [durationTimeBar](_src_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md#durationtimebar)
* [fps](_src_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md#fps)
* [initialized](_src_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md#initialized)
* [labelTcIn](_src_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md#labeltcin)
* [labelTcOut](_src_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md#labeltcout)
* [logger](_src_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md#protected-logger)
* [mediaPlayerElement](_src_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md#mediaplayerelement)
* [playerId](_src_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md#playerid)
* [playerService](_src_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md#playerservice)
* [pluginInstance](_src_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md#plugininstance)
* [pluginName](_src_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md#protected-pluginname)
* [startTc](_src_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md#starttc)
* [tcOffset](_src_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md#tcoffset)
* [theme](_src_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md#theme)
* [timeFormat](_src_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md#timeformat)
* [timeTimeBar](_src_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md#timetimebar)
* [PLUGIN_NAME](_src_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md#static-plugin_name)

### Accessors

* [player](_src_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md#player)
* [pluginConfiguration](_src_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md#pluginconfiguration)

### Methods

* [getDefaultConfig](_src_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md#getdefaultconfig)
* [handleDisplayState](_src_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md#handledisplaystate)
* [handleOnDurationChange](_src_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md#handleondurationchange)
* [handleOnTimeChange](_src_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md#handleontimechange)
* [hideTimeBar](_src_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md#hidetimebar)
* [init](_src_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md#init)
* [ngOnInit](_src_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md#ngoninit)
* [showTimeBar](_src_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md#showtimebar)

## Constructors

###  constructor

\+ **new TimeBarPluginComponent**(`playerService`: [MediaPlayerService](_src_app_service_media_player_service_.mediaplayerservice.md)): *[TimeBarPluginComponent](_src_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md)*

*Overrides [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[constructor](_src_app_core_plugin_plugin_base_.pluginbase.md#protected-constructor)*

Defined in src/app/plugins/time-bar/time-bar-plugin.component.ts:62

**Parameters:**

Name | Type |
------ | ------ |
`playerService` | [MediaPlayerService](_src_app_service_media_player_service_.mediaplayerservice.md) |

**Returns:** *[TimeBarPluginComponent](_src_app_plugins_time_bar_time_bar_plugin_component_.timebarplugincomponent.md)*

## Properties

###  _player

• **_player**: *any*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[_player](_src_app_core_plugin_plugin_base_.pluginbase.md#_player)*

Defined in src/app/core/plugin/plugin-base.ts:23

This plugin configuration

___

###  _pluginConfiguration

• **_pluginConfiguration**: *[PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[TimeBarConfig](../interfaces/_src_app_core_config_model_time_bar_config_.timebarconfig.md)›*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[_pluginConfiguration](_src_app_core_plugin_plugin_base_.pluginbase.md#_pluginconfiguration)*

Defined in src/app/core/plugin/plugin-base.ts:34

___

###  active

• **active**: *boolean* = true

Defined in src/app/plugins/time-bar/time-bar-plugin.component.ts:49

Show timeBar

___

###  displayFormat

• **displayFormat**: *"h" | "m" | "s" | "minutes" | "f" | "ms" | "mms" | "hours" | "seconds"* = "f"

Defined in src/app/plugins/time-bar/time-bar-plugin.component.ts:36

Display format specifier h|m|s|f|ms|mms

___

###  displayState

• **displayState**: *any*

Defined in src/app/plugins/time-bar/time-bar-plugin.component.ts:45

Plugin display state

___

###  durationTimeBar

• **durationTimeBar**: *number*

Defined in src/app/plugins/time-bar/time-bar-plugin.component.ts:31

Media duration

___

###  fps

• **fps**: *[FPS](../enums/_src_app_core_constant_default_.default.md#fps)* = DEFAULT.FPS

*Overrides [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[fps](_src_app_core_plugin_plugin_base_.pluginbase.md#fps)*

Defined in src/app/plugins/time-bar/time-bar-plugin.component.ts:40

Media fps

___

###  initialized

• **initialized**: *any*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[initialized](_src_app_core_plugin_plugin_base_.pluginbase.md#initialized)*

Defined in src/app/core/plugin/plugin-base.ts:19

___

###  labelTcIn

• **labelTcIn**: *any*

Defined in src/app/plugins/time-bar/time-bar-plugin.component.ts:53

label tcin

___

###  labelTcOut

• **labelTcOut**: *any*

Defined in src/app/plugins/time-bar/time-bar-plugin.component.ts:57

label tcout

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

###  startTc

• **startTc**: *number*

Defined in src/app/plugins/time-bar/time-bar-plugin.component.ts:22

Return  current time

___

###  tcOffset

• **tcOffset**: *any*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[tcOffset](_src_app_core_plugin_plugin_base_.pluginbase.md#tcoffset)*

Defined in src/app/core/plugin/plugin-base.ts:17

___

###  theme

• **theme**: *"inside" | "outside"*

Defined in src/app/plugins/time-bar/time-bar-plugin.component.ts:62

theme

___

###  timeFormat

• **timeFormat**: *any*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[timeFormat](_src_app_core_plugin_plugin_base_.pluginbase.md#timeformat)*

Defined in src/app/core/plugin/plugin-base.ts:16

___

###  timeTimeBar

• **timeTimeBar**: *number*

Defined in src/app/plugins/time-bar/time-bar-plugin.component.ts:27

Return  current time

___

### `Static` PLUGIN_NAME

▪ **PLUGIN_NAME**: *string* = "TIME_BAR"

Defined in src/app/plugins/time-bar/time-bar-plugin.component.ts:18

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

• **get pluginConfiguration**(): *[PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[TimeBarConfig](../interfaces/_src_app_core_config_model_time_bar_config_.timebarconfig.md)›*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[pluginConfiguration](_src_app_core_plugin_plugin_base_.pluginbase.md#pluginconfiguration)*

Defined in src/app/core/plugin/plugin-base.ts:36

**Returns:** *[PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[TimeBarConfig](../interfaces/_src_app_core_config_model_time_bar_config_.timebarconfig.md)›*

• **set pluginConfiguration**(`value`: [PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[TimeBarConfig](../interfaces/_src_app_core_config_model_time_bar_config_.timebarconfig.md)›): *void*

*Inherited from [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[pluginConfiguration](_src_app_core_plugin_plugin_base_.pluginbase.md#pluginconfiguration)*

Defined in src/app/core/plugin/plugin-base.ts:41

**Parameters:**

Name | Type |
------ | ------ |
`value` | [PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[TimeBarConfig](../interfaces/_src_app_core_config_model_time_bar_config_.timebarconfig.md)› |

**Returns:** *void*

## Methods

###  getDefaultConfig

▸ **getDefaultConfig**(): *[PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[TimeBarConfig](../interfaces/_src_app_core_config_model_time_bar_config_.timebarconfig.md)›*

*Overrides [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[getDefaultConfig](_src_app_core_plugin_plugin_base_.pluginbase.md#abstract-getdefaultconfig)*

Defined in src/app/plugins/time-bar/time-bar-plugin.component.ts:115

Return default config

**Returns:** *[PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹[TimeBarConfig](../interfaces/_src_app_core_config_model_time_bar_config_.timebarconfig.md)›*

___

###  handleDisplayState

▸ **handleDisplayState**(): *void*

Defined in src/app/plugins/time-bar/time-bar-plugin.component.ts:97

switch container class based on width

**Returns:** *void*

___

###  handleOnDurationChange

▸ **handleOnDurationChange**(): *void*

Defined in src/app/plugins/time-bar/time-bar-plugin.component.ts:133

Invoked on duration change

**Returns:** *void*

___

###  handleOnTimeChange

▸ **handleOnTimeChange**(): *void*

Defined in src/app/plugins/time-bar/time-bar-plugin.component.ts:124

Invoked time change event for :
- update current time

**Returns:** *void*

___

###  hideTimeBar

▸ **hideTimeBar**(): *void*

Defined in src/app/plugins/time-bar/time-bar-plugin.component.ts:101

**Returns:** *void*

___

###  init

▸ **init**(): *void*

*Overrides [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[init](_src_app_core_plugin_plugin_base_.pluginbase.md#init)*

Defined in src/app/plugins/time-bar/time-bar-plugin.component.ts:72

**Returns:** *void*

___

###  ngOnInit

▸ **ngOnInit**(): *void*

*Overrides [PluginBase](_src_app_core_plugin_plugin_base_.pluginbase.md).[ngOnInit](_src_app_core_plugin_plugin_base_.pluginbase.md#ngoninit)*

Defined in src/app/plugins/time-bar/time-bar-plugin.component.ts:67

**Returns:** *void*

___

###  showTimeBar

▸ **showTimeBar**(): *void*

Defined in src/app/plugins/time-bar/time-bar-plugin.component.ts:105

**Returns:** *void*
