[**Amalia**](../../../../../README.md)

***

[Amalia](../../../../../modules.md) / [core/config/loader/default-config-loader](../README.md) / DefaultConfigLoader

# Class: DefaultConfigLoader

Defined in: src/app/core/config/loader/default-config-loader.ts:9

Default config loader in charge use params to ConfigData

## Implements

- [`Loader`](../../../../loader/loader/interfaces/Loader.md)\<[`ConfigData`](../../../model/config-data/interfaces/ConfigData.md)\>

## Constructors

### Constructor

> **new DefaultConfigLoader**(`converter`, `logger`): `DefaultConfigLoader`

Defined in: src/app/core/config/loader/default-config-loader.ts:13

#### Parameters

##### converter

[`Converter`](../../../../converter/converter/interfaces/Converter.md)\<[`ConfigData`](../../../model/config-data/interfaces/ConfigData.md)\>

##### logger

[`LoggerInterface`](../../../../logger/logger-interface/interfaces/LoggerInterface.md)

#### Returns

`DefaultConfigLoader`

## Methods

### load()

> **load**(`params`): `Promise`\<[`ConfigData`](../../../model/config-data/interfaces/ConfigData.md)\>

Defined in: src/app/core/config/loader/default-config-loader.ts:22

In charge to load config

#### Parameters

##### params

`any`

ConfigData

#### Returns

`Promise`\<[`ConfigData`](../../../model/config-data/interfaces/ConfigData.md)\>

#### Implementation of

[`Loader`](../../../../loader/loader/interfaces/Loader.md).[`load`](../../../../loader/loader/interfaces/Loader.md#load)
