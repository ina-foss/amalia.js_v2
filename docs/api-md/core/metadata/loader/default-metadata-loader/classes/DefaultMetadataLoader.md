[**Amalia**](../../../../../README.md)

***

[Amalia](../../../../../modules.md) / [core/metadata/loader/default-metadata-loader](../README.md) / DefaultMetadataLoader

# Class: DefaultMetadataLoader

Defined in: src/app/core/metadata/loader/default-metadata-loader.ts:14

In charge to load http resource

## Implements

- [`Loader`](../../../../loader/loader/interfaces/Loader.md)\<`Metadata`[]\>

## Constructors

### Constructor

> **new DefaultMetadataLoader**(`httpClient`, `converter`, `logger`): `DefaultMetadataLoader`

Defined in: src/app/core/metadata/loader/default-metadata-loader.ts:19

#### Parameters

##### httpClient

`HttpClient`

##### converter

[`Converter`](../../../../converter/converter/interfaces/Converter.md)\<`Metadata`\>

##### logger

[`LoggerInterface`](../../../../logger/logger-interface/interfaces/LoggerInterface.md)

#### Returns

`DefaultMetadataLoader`

## Methods

### load()

> **load**(`url`, `headers`): `Promise`\<`Metadata`[]\>

Defined in: src/app/core/metadata/loader/default-metadata-loader.ts:32

In charge to load metadata

#### Parameters

##### url

`string`

for load metadata

##### headers

`string`[]

#### Returns

`Promise`\<`Metadata`[]\>

#### Implementation of

[`Loader`](../../../../loader/loader/interfaces/Loader.md).[`load`](../../../../loader/loader/interfaces/Loader.md#load)
