[Amalia](../README.md) › [Globals](../globals.md) › ["app/core/config/loader/default-config-loader"](../modules/_app_core_config_loader_default_config_loader_.md) › [DefaultConfigLoader](_app_core_config_loader_default_config_loader_.defaultconfigloader.md)

# Class: DefaultConfigLoader

Default config loader in charge use params to ConfigData

## Hierarchy

* **DefaultConfigLoader**

## Implements

* [Loader](../interfaces/_app_core_loader_loader_.loader.md)‹[ConfigData](../interfaces/_app_core_config_model_config_data_.configdata.md)›

## Index

### Constructors

* [constructor](_app_core_config_loader_default_config_loader_.defaultconfigloader.md#constructor)

### Properties

* [converter](_app_core_config_loader_default_config_loader_.defaultconfigloader.md#private-converter)
* [logger](_app_core_config_loader_default_config_loader_.defaultconfigloader.md#private-logger)

### Methods

* [load](_app_core_config_loader_default_config_loader_.defaultconfigloader.md#load)

## Constructors

###  constructor

\+ **new DefaultConfigLoader**(`converter`: [Converter](../interfaces/_app_core_converter_converter_.converter.md)‹[ConfigData](../interfaces/_app_core_config_model_config_data_.configdata.md)›, `logger`: [LoggerInterface](../interfaces/_app_core_logger_logger_interface_.loggerinterface.md)): *[DefaultConfigLoader](_app_core_config_loader_default_config_loader_.defaultconfigloader.md)*

Defined in src/app/core/config/loader/default-config-loader.ts:11

**Parameters:**

Name | Type |
------ | ------ |
`converter` | [Converter](../interfaces/_app_core_converter_converter_.converter.md)‹[ConfigData](../interfaces/_app_core_config_model_config_data_.configdata.md)› |
`logger` | [LoggerInterface](../interfaces/_app_core_logger_logger_interface_.loggerinterface.md) |

**Returns:** *[DefaultConfigLoader](_app_core_config_loader_default_config_loader_.defaultconfigloader.md)*

## Properties

### `Private` converter

• **converter**: *[Converter](../interfaces/_app_core_converter_converter_.converter.md)‹[ConfigData](../interfaces/_app_core_config_model_config_data_.configdata.md)›*

Defined in src/app/core/config/loader/default-config-loader.ts:10

___

### `Private` logger

• **logger**: *[LoggerInterface](../interfaces/_app_core_logger_logger_interface_.loggerinterface.md)*

Defined in src/app/core/config/loader/default-config-loader.ts:11

## Methods

###  load

▸ **load**(`params`: any): *Promise‹[ConfigData](../interfaces/_app_core_config_model_config_data_.configdata.md)›*

*Implementation of [Loader](../interfaces/_app_core_loader_loader_.loader.md)*

Defined in src/app/core/config/loader/default-config-loader.ts:22

In charge to load config

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`params` | any | ConfigData  |

**Returns:** *Promise‹[ConfigData](../interfaces/_app_core_config_model_config_data_.configdata.md)›*
