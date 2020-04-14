[Amalia](../README.md) › [Globals](../globals.md) › ["app/core/config/loader/http-config-loader"](../modules/_app_core_config_loader_http_config_loader_.md) › [HttpConfigLoader](_app_core_config_loader_http_config_loader_.httpconfigloader.md)

# Class: HttpConfigLoader

In charge to load amalia config from specified url

## Hierarchy

* **HttpConfigLoader**

## Implements

* [Loader](../interfaces/_app_core_loader_loader_.loader.md)‹[ConfigData](../interfaces/_app_core_config_model_config_data_.configdata.md)›

## Index

### Constructors

* [constructor](_app_core_config_loader_http_config_loader_.httpconfigloader.md#constructor)

### Properties

* [converter](_app_core_config_loader_http_config_loader_.httpconfigloader.md#private-converter)
* [httpClient](_app_core_config_loader_http_config_loader_.httpconfigloader.md#private-httpclient)
* [logger](_app_core_config_loader_http_config_loader_.httpconfigloader.md#private-logger)

### Methods

* [load](_app_core_config_loader_http_config_loader_.httpconfigloader.md#load)

## Constructors

###  constructor

\+ **new HttpConfigLoader**(`converter`: [Converter](../interfaces/_app_core_converter_converter_.converter.md)‹[ConfigData](../interfaces/_app_core_config_model_config_data_.configdata.md)›, `httpClient`: HttpClient, `logger`: [LoggerInterface](../interfaces/_app_core_logger_logger_interface_.loggerinterface.md)): *[HttpConfigLoader](_app_core_config_loader_http_config_loader_.httpconfigloader.md)*

Defined in src/app/core/config/loader/http-config-loader.ts:14

**Parameters:**

Name | Type |
------ | ------ |
`converter` | [Converter](../interfaces/_app_core_converter_converter_.converter.md)‹[ConfigData](../interfaces/_app_core_config_model_config_data_.configdata.md)› |
`httpClient` | HttpClient |
`logger` | [LoggerInterface](../interfaces/_app_core_logger_logger_interface_.loggerinterface.md) |

**Returns:** *[HttpConfigLoader](_app_core_config_loader_http_config_loader_.httpconfigloader.md)*

## Properties

### `Private` converter

• **converter**: *[Converter](../interfaces/_app_core_converter_converter_.converter.md)‹[ConfigData](../interfaces/_app_core_config_model_config_data_.configdata.md)›*

Defined in src/app/core/config/loader/http-config-loader.ts:12

___

### `Private` httpClient

• **httpClient**: *HttpClient*

Defined in src/app/core/config/loader/http-config-loader.ts:13

___

### `Private` logger

• **logger**: *[LoggerInterface](../interfaces/_app_core_logger_logger_interface_.loggerinterface.md)*

Defined in src/app/core/config/loader/http-config-loader.ts:14

## Methods

###  load

▸ **load**(`url`: any): *Promise‹[ConfigData](../interfaces/_app_core_config_model_config_data_.configdata.md)›*

*Implementation of [Loader](../interfaces/_app_core_loader_loader_.loader.md)*

Defined in src/app/core/config/loader/http-config-loader.ts:29

In charge to load configuration by url

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`url` | any | configuration url  |

**Returns:** *Promise‹[ConfigData](../interfaces/_app_core_config_model_config_data_.configdata.md)›*
