[Amalia](../README.md) › [Globals](../globals.md) › ["src/app/core/config/model/config-data"](../modules/_src_app_core_config_model_config_data_.md) › [ConfigData](_src_app_core_config_model_config_data_.configdata.md)

# Interface: ConfigData

## Hierarchy

* **ConfigData**

## Index

### Properties

* [data](_src_app_core_config_model_config_data_.configdata.md#optional-data)
* [dataSources](_src_app_core_config_model_config_data_.configdata.md#optional-datasources)
* [debug](_src_app_core_config_model_config_data_.configdata.md#optional-debug)
* [logLevel](_src_app_core_config_model_config_data_.configdata.md#optional-loglevel)
* [player](_src_app_core_config_model_config_data_.configdata.md#player)
* [pluginsConfiguration](_src_app_core_config_model_config_data_.configdata.md#optional-pluginsconfiguration)
* [tcOffset](_src_app_core_config_model_config_data_.configdata.md#optional-tcoffset)
* [thumbnail](_src_app_core_config_model_config_data_.configdata.md#optional-thumbnail)
* [timeFormat](_src_app_core_config_model_config_data_.configdata.md#timeformat)

## Properties

### `Optional` data

• **data**? : *any*

Defined in src/app/core/config/model/config-data.ts:19

___

### `Optional` dataSources

• **dataSources**? : *Array‹[ConfigDataSource](_src_app_core_config_model_config_data_source_.configdatasource.md)›*

Defined in src/app/core/config/model/config-data.ts:18

___

### `Optional` debug

• **debug**? : *boolean*

Defined in src/app/core/config/model/config-data.ts:28

___

### `Optional` logLevel

• **logLevel**? : *string*

Defined in src/app/core/config/model/config-data.ts:29

___

###  player

• **player**: *[PlayerConfigData](_src_app_core_config_model_player_config_data_.playerconfigdata.md)*

Defined in src/app/core/config/model/config-data.ts:16

___

### `Optional` pluginsConfiguration

• **pluginsConfiguration**? : *Map‹string, [PluginConfigData](_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹any››*

Defined in src/app/core/config/model/config-data.ts:17

___

### `Optional` tcOffset

• **tcOffset**? : *number*

Defined in src/app/core/config/model/config-data.ts:14

Time code offset handle metadata time code

___

### `Optional` thumbnail

• **thumbnail**? : *object*

Defined in src/app/core/config/model/config-data.ts:20

#### Type declaration:

* **baseUrl**? : *string*

* **debounceTime**? : *number*

* **enableThumbnail**? : *boolean*

* **enableThumbnailPreview**? : *boolean*

* **tcParam**? : *string*

* **width**? : *number*

___

###  timeFormat

• **timeFormat**: *"h" | "m" | "s" | "minutes" | "f" | "ms" | "mms" | "hours" | "seconds"*

Defined in src/app/core/config/model/config-data.ts:15
