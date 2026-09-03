[**Amalia**](../../../../README.md)

***

[Amalia](../../../../modules.md) / [core/config/configuration-manager](../README.md) / ConfigurationManager

# Class: ConfigurationManager

Defined in: src/app/core/config/configuration-manager.ts:14

In charge to handle amalia configuration

## Constructors

### Constructor

> **new ConfigurationManager**(`loader`, `logger`): `ConfigurationManager`

Defined in: src/app/core/config/configuration-manager.ts:19

#### Parameters

##### loader

[`Loader`](../../../loader/loader/interfaces/Loader.md)\<[`ConfigData`](../../model/config-data/interfaces/ConfigData.md)\>

##### logger

[`LoggerInterface`](../../../logger/logger-interface/interfaces/LoggerInterface.md)

#### Returns

`ConfigurationManager`

## Properties

### configData

> **configData**: [`ConfigData`](../../model/config-data/interfaces/ConfigData.md)

Defined in: src/app/core/config/configuration-manager.ts:15

## Methods

### addPluginConfiguration()

> **addPluginConfiguration**(`name`, `config`): `void`

Defined in: src/app/core/config/configuration-manager.ts:59

In charge to add plugin configuration

#### Parameters

##### name

`string`

plugin name

##### config

[`PluginConfigData`](../../model/plugin-config-data/interfaces/PluginConfigData.md)\<`any`\>

plugin configuration

#### Returns

`void`

***

### getCoreConfig()

> **getCoreConfig**(): [`ConfigData`](../../model/config-data/interfaces/ConfigData.md)

Defined in: src/app/core/config/configuration-manager.ts:50

#### Returns

[`ConfigData`](../../model/config-data/interfaces/ConfigData.md)

return configuration parameter

***

### getPluginConfiguration()

> **getPluginConfiguration**(`name`): [`PluginConfigData`](../../model/plugin-config-data/interfaces/PluginConfigData.md)\<`any`\>

Defined in: src/app/core/config/configuration-manager.ts:68

In charge to return plugin configuration

#### Parameters

##### name

`string`

plugin name

#### Returns

[`PluginConfigData`](../../model/plugin-config-data/interfaces/PluginConfigData.md)\<`any`\>

#### Throws

AmaliaException if plugin don't contain config

***

### load()

> **load**(`params`): `Promise`\<`boolean`\>

Defined in: src/app/core/config/configuration-manager.ts:28

In charge to load configuration

#### Parameters

##### params

`any`

load configuration params

#### Returns

`Promise`\<`boolean`\>
