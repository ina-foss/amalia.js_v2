[Amalia](../README.md) › [Globals](../globals.md) › ["src/app/core/config/configuration-manager"](../modules/_src_app_core_config_configuration_manager_.md) › [ConfigurationManager](_src_app_core_config_configuration_manager_.configurationmanager.md)

# Class: ConfigurationManager

In charge to handle amalia configuration

## Hierarchy

* **ConfigurationManager**

## Index

### Constructors

* [constructor](_src_app_core_config_configuration_manager_.configurationmanager.md#constructor)

### Properties

* [configData](_src_app_core_config_configuration_manager_.configurationmanager.md#configdata)
* [loader](_src_app_core_config_configuration_manager_.configurationmanager.md#private-loader)
* [logger](_src_app_core_config_configuration_manager_.configurationmanager.md#private-logger)

### Methods

* [addPluginConfiguration](_src_app_core_config_configuration_manager_.configurationmanager.md#addpluginconfiguration)
* [getCoreConfig](_src_app_core_config_configuration_manager_.configurationmanager.md#getcoreconfig)
* [getPluginConfiguration](_src_app_core_config_configuration_manager_.configurationmanager.md#getpluginconfiguration)
* [load](_src_app_core_config_configuration_manager_.configurationmanager.md#load)

## Constructors

###  constructor

\+ **new ConfigurationManager**(`loader`: [Loader](../interfaces/_src_app_core_loader_loader_.loader.md)‹[ConfigData](../interfaces/_src_app_core_config_model_config_data_.configdata.md)›, `logger`: [LoggerInterface](../interfaces/_src_app_core_logger_logger_interface_.loggerinterface.md)): *[ConfigurationManager](_src_app_core_config_configuration_manager_.configurationmanager.md)*

Defined in src/app/core/config/configuration-manager.ts:17

**Parameters:**

Name | Type |
------ | ------ |
`loader` | [Loader](../interfaces/_src_app_core_loader_loader_.loader.md)‹[ConfigData](../interfaces/_src_app_core_config_model_config_data_.configdata.md)› |
`logger` | [LoggerInterface](../interfaces/_src_app_core_logger_logger_interface_.loggerinterface.md) |

**Returns:** *[ConfigurationManager](_src_app_core_config_configuration_manager_.configurationmanager.md)*

## Properties

###  configData

• **configData**: *[ConfigData](../interfaces/_src_app_core_config_model_config_data_.configdata.md)*

Defined in src/app/core/config/configuration-manager.ts:15

___

### `Private` loader

• **loader**: *[Loader](../interfaces/_src_app_core_loader_loader_.loader.md)‹[ConfigData](../interfaces/_src_app_core_config_model_config_data_.configdata.md)›*

Defined in src/app/core/config/configuration-manager.ts:16

___

### `Private` logger

• **logger**: *[LoggerInterface](../interfaces/_src_app_core_logger_logger_interface_.loggerinterface.md)*

Defined in src/app/core/config/configuration-manager.ts:17

## Methods

###  addPluginConfiguration

▸ **addPluginConfiguration**(`name`: string, `config`: [PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹any›): *void*

Defined in src/app/core/config/configuration-manager.ts:59

In charge to add plugin configuration

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`name` | string | plugin name |
`config` | [PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹any› | plugin configuration  |

**Returns:** *void*

___

###  getCoreConfig

▸ **getCoreConfig**(): *[ConfigData](../interfaces/_src_app_core_config_model_config_data_.configdata.md)*

Defined in src/app/core/config/configuration-manager.ts:50

**Returns:** *[ConfigData](../interfaces/_src_app_core_config_model_config_data_.configdata.md)*

return configuration parameter

___

###  getPluginConfiguration

▸ **getPluginConfiguration**(`name`: string): *[PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹any›*

Defined in src/app/core/config/configuration-manager.ts:68

In charge to return plugin configuration

**`throws`** AmaliaException if plugin don't contain config

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`name` | string | plugin name |

**Returns:** *[PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹any›*

___

###  load

▸ **load**(`params`: any): *Promise‹boolean›*

Defined in src/app/core/config/configuration-manager.ts:28

In charge to load configuration

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`params` | any | load configuration params  |

**Returns:** *Promise‹boolean›*
