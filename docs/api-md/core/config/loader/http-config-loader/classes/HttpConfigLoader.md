[**Amalia**](../../../../../README.md)

***

[Amalia](../../../../../modules.md) / [core/config/loader/http-config-loader](../README.md) / HttpConfigLoader

# Class: HttpConfigLoader

Defined in: src/app/core/config/loader/http-config-loader.ts:11

In charge to load amalia config from specified url

## Implements

- [`Loader`](../../../../loader/loader/interfaces/Loader.md)\<[`ConfigData`](../../../model/config-data/interfaces/ConfigData.md)\>

## Constructors

### Constructor

> **new HttpConfigLoader**(`converter`, `httpClient`, `logger`): `HttpConfigLoader`

Defined in: src/app/core/config/loader/http-config-loader.ts:16

#### Parameters

##### converter

[`Converter`](../../../../converter/converter/interfaces/Converter.md)\<[`ConfigData`](../../../model/config-data/interfaces/ConfigData.md)\>

##### httpClient

`HttpClient`

##### logger

[`LoggerInterface`](../../../../logger/logger-interface/interfaces/LoggerInterface.md)

#### Returns

`HttpConfigLoader`

## Methods

### load()

> **load**(`url`): `Promise`\<[`ConfigData`](../../../model/config-data/interfaces/ConfigData.md)\>

Defined in: src/app/core/config/loader/http-config-loader.ts:29

In charge to load configuration by url

#### Parameters

##### url

`any`

configuration url

#### Returns

`Promise`\<[`ConfigData`](../../../model/config-data/interfaces/ConfigData.md)\>

#### Implementation of

[`Loader`](../../../../loader/loader/interfaces/Loader.md).[`load`](../../../../loader/loader/interfaces/Loader.md#load)
