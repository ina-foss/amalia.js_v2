[Amalia](../README.md) › [Globals](../globals.md) › ["app/core/config/model/config-data"](../modules/_app_core_config_model_config_data_.md) › [ConfigData](_app_core_config_model_config_data_.configdata.md)

# Interface: ConfigData

## Hierarchy

* **ConfigData**

## Index

### Properties

* [data](_app_core_config_model_config_data_.configdata.md#optional-data)
* [dataSources](_app_core_config_model_config_data_.configdata.md#optional-datasources)
* [debug](_app_core_config_model_config_data_.configdata.md#optional-debug)
* [player](_app_core_config_model_config_data_.configdata.md#player)
* [pluginsConfiguration](_app_core_config_model_config_data_.configdata.md#optional-pluginsconfiguration)
* [tcOffset](_app_core_config_model_config_data_.configdata.md#optional-tcoffset)
* [thumbnail](_app_core_config_model_config_data_.configdata.md#optional-thumbnail)

## Properties

### `Optional` data

• **data**? : *any*

Defined in src/app/core/config/model/config-data.ts:18

___

### `Optional` dataSources

• **dataSources**? : *Array‹[ConfigDataSource](_app_core_config_model_config_data_source_.configdatasource.md)›*

Defined in src/app/core/config/model/config-data.ts:17

___

### `Optional` debug

• **debug**? : *boolean*

Defined in src/app/core/config/model/config-data.ts:25

___

###  player

• **player**: *[PlayerConfigData](_app_core_config_model_player_config_data_.playerconfigdata.md)*

Defined in src/app/core/config/model/config-data.ts:15

___

### `Optional` pluginsConfiguration

• **pluginsConfiguration**? : *Map‹string, [PluginConfigData](_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹any››*

Defined in src/app/core/config/model/config-data.ts:16

___

### `Optional` tcOffset

• **tcOffset**? : *number*

Defined in src/app/core/config/model/config-data.ts:14

Time code offset handle metadata time code

___

### `Optional` thumbnail

• **thumbnail**? : *object*

Defined in src/app/core/config/model/config-data.ts:19

#### Type declaration:

* **baseUrl**? : *string*

* **enableThumbnail**? : *boolean*

* **enableThumbnailPreview**? : *boolean*

* **tcParam**? : *string*
