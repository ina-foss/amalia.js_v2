[Amalia](../README.md) › [Globals](../globals.md) › ["src/app/core/metadata/loader/default-metadata-loader"](../modules/_src_app_core_metadata_loader_default_metadata_loader_.md) › [DefaultMetadataLoader](_src_app_core_metadata_loader_default_metadata_loader_.defaultmetadataloader.md)

# Class: DefaultMetadataLoader

In charge to load http resource

## Hierarchy

* **DefaultMetadataLoader**

## Implements

* [Loader](../interfaces/_src_app_core_loader_loader_.loader.md)‹Array‹Metadata››

## Index

### Constructors

* [constructor](_src_app_core_metadata_loader_default_metadata_loader_.defaultmetadataloader.md#constructor)

### Properties

* [converter](_src_app_core_metadata_loader_default_metadata_loader_.defaultmetadataloader.md#private-converter)
* [httpClient](_src_app_core_metadata_loader_default_metadata_loader_.defaultmetadataloader.md#private-httpclient)
* [logger](_src_app_core_metadata_loader_default_metadata_loader_.defaultmetadataloader.md#private-logger)

### Methods

* [load](_src_app_core_metadata_loader_default_metadata_loader_.defaultmetadataloader.md#load)
* [mapResponse](_src_app_core_metadata_loader_default_metadata_loader_.defaultmetadataloader.md#private-mapresponse)

## Constructors

###  constructor

\+ **new DefaultMetadataLoader**(`httpClient`: HttpClient, `converter`: [Converter](../interfaces/_src_app_core_converter_converter_.converter.md)‹Metadata›, `logger`: [LoggerInterface](../interfaces/_src_app_core_logger_logger_interface_.loggerinterface.md)): *[DefaultMetadataLoader](_src_app_core_metadata_loader_default_metadata_loader_.defaultmetadataloader.md)*

Defined in src/app/core/metadata/loader/default-metadata-loader.ts:17

**Parameters:**

Name | Type |
------ | ------ |
`httpClient` | HttpClient |
`converter` | [Converter](../interfaces/_src_app_core_converter_converter_.converter.md)‹Metadata› |
`logger` | [LoggerInterface](../interfaces/_src_app_core_logger_logger_interface_.loggerinterface.md) |

**Returns:** *[DefaultMetadataLoader](_src_app_core_metadata_loader_default_metadata_loader_.defaultmetadataloader.md)*

## Properties

### `Private` converter

• **converter**: *[Converter](../interfaces/_src_app_core_converter_converter_.converter.md)‹Metadata›*

Defined in src/app/core/metadata/loader/default-metadata-loader.ts:17

___

### `Private` httpClient

• **httpClient**: *HttpClient*

Defined in src/app/core/metadata/loader/default-metadata-loader.ts:15

___

### `Private` logger

• **logger**: *[LoggerInterface](../interfaces/_src_app_core_logger_logger_interface_.loggerinterface.md)*

Defined in src/app/core/metadata/loader/default-metadata-loader.ts:16

## Methods

###  load

▸ **load**(`url`: string): *Promise‹Array‹Metadata››*

Defined in src/app/core/metadata/loader/default-metadata-loader.ts:32

In charge to load metadata

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`url` | string | for load metadata  |

**Returns:** *Promise‹Array‹Metadata››*

___

### `Private` mapResponse

▸ **mapResponse**(`data`: any): *Array‹Metadata›*

Defined in src/app/core/metadata/loader/default-metadata-loader.ts:56

In charge to convert metadata

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`data` | any | convert metadata  |

**Returns:** *Array‹Metadata›*
