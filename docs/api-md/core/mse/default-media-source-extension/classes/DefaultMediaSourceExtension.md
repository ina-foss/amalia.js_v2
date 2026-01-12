[**Amalia**](../../../../README.md)

***

[Amalia](../../../../modules.md) / [core/mse/default-media-source-extension](../README.md) / DefaultMediaSourceExtension

# Class: DefaultMediaSourceExtension

Defined in: src/app/core/mse/default-media-source-extension.ts:11

In  charge to handle default media sources (Supported by browsers)

## Implements

- [`MediaSourceExtension`](../../media-source-extension/interfaces/MediaSourceExtension.md)

## Constructors

### Constructor

> **new DefaultMediaSourceExtension**(`mediaElement`, `eventEmitter`, `config`, `logger`): `DefaultMediaSourceExtension`

Defined in: src/app/core/mse/default-media-source-extension.ts:20

#### Parameters

##### mediaElement

`HTMLVideoElement`

##### eventEmitter

`EventEmitter`

##### config

[`PlayerConfigData`](../../../config/model/player-config-data/interfaces/PlayerConfigData.md)

##### logger

[`LoggerInterface`](../../../logger/logger-interface/interfaces/LoggerInterface.md)

#### Returns

`DefaultMediaSourceExtension`

## Properties

### mainSource

> **mainSource**: `HTMLSourceElement`

Defined in: src/app/core/mse/default-media-source-extension.ts:14

***

### mediaType

> **mediaType**: `"AUDIO"` \| `"VIDEO"`

Defined in: src/app/core/mse/default-media-source-extension.ts:26

#### Implementation of

[`MediaSourceExtension`](../../media-source-extension/interfaces/MediaSourceExtension.md).[`mediaType`](../../media-source-extension/interfaces/MediaSourceExtension.md#mediatype)

## Methods

### destroy()

> **destroy**(): `void`

Defined in: src/app/core/mse/default-media-source-extension.ts:72

Invoked for clean buffer

#### Returns

`void`

#### Implementation of

[`MediaSourceExtension`](../../media-source-extension/interfaces/MediaSourceExtension.md).[`destroy`](../../media-source-extension/interfaces/MediaSourceExtension.md#destroy)

***

### getBackwardsSrc()

> **getBackwardsSrc**(): `string`

Defined in: src/app/core/mse/default-media-source-extension.ts:32

Invoked on reverse mode

#### Returns

`string`

#### Implementation of

[`MediaSourceExtension`](../../media-source-extension/interfaces/MediaSourceExtension.md).[`getBackwardsSrc`](../../media-source-extension/interfaces/MediaSourceExtension.md#getbackwardssrc)

***

### getConfig()

> **getConfig**(): [`PlayerConfigData`](../../../config/model/player-config-data/interfaces/PlayerConfigData.md)

Defined in: src/app/core/mse/default-media-source-extension.ts:90

Get config

#### Returns

[`PlayerConfigData`](../../../config/model/player-config-data/interfaces/PlayerConfigData.md)

#### Implementation of

[`MediaSourceExtension`](../../media-source-extension/interfaces/MediaSourceExtension.md).[`getConfig`](../../media-source-extension/interfaces/MediaSourceExtension.md#getconfig)

***

### getSrc()

> **getSrc**(): `string`

Defined in: src/app/core/mse/default-media-source-extension.ts:28

Invoked to get source

#### Returns

`string`

#### Implementation of

[`MediaSourceExtension`](../../media-source-extension/interfaces/MediaSourceExtension.md).[`getSrc`](../../media-source-extension/interfaces/MediaSourceExtension.md#getsrc)

***

### handleError()

> **handleError**(`event`): `void`

Defined in: src/app/core/mse/default-media-source-extension.ts:85

Invoked when error to load source,
Emmit event Error

#### Parameters

##### event

`any`

#### Returns

`void`

#### Implementation of

[`MediaSourceExtension`](../../media-source-extension/interfaces/MediaSourceExtension.md).[`handleError`](../../media-source-extension/interfaces/MediaSourceExtension.md#handleerror)

***

### setMaxBufferLengthConfig()

> **setMaxBufferLengthConfig**(): `any`

Defined in: src/app/core/mse/default-media-source-extension.ts:94

Get config

#### Returns

`any`

#### Implementation of

[`MediaSourceExtension`](../../media-source-extension/interfaces/MediaSourceExtension.md).[`setMaxBufferLengthConfig`](../../media-source-extension/interfaces/MediaSourceExtension.md#setmaxbufferlengthconfig)

***

### setSrc()

> **setSrc**(`config`): `void`

Defined in: src/app/core/mse/default-media-source-extension.ts:36

Invoked to set source

#### Parameters

##### config

[`PlayerConfigData`](../../../config/model/player-config-data/interfaces/PlayerConfigData.md)

#### Returns

`void`

#### Implementation of

[`MediaSourceExtension`](../../media-source-extension/interfaces/MediaSourceExtension.md).[`setSrc`](../../media-source-extension/interfaces/MediaSourceExtension.md#setsrc)

***

### switchToBackwardsSrc()

> **switchToBackwardsSrc**(): `Promise`\<`void`\>

Defined in: src/app/core/mse/default-media-source-extension.ts:63

Invoked to set backward source

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`MediaSourceExtension`](../../media-source-extension/interfaces/MediaSourceExtension.md).[`switchToBackwardsSrc`](../../media-source-extension/interfaces/MediaSourceExtension.md#switchtobackwardssrc)

***

### switchToMainSrc()

> **switchToMainSrc**(): `Promise`\<`void`\>

Defined in: src/app/core/mse/default-media-source-extension.ts:54

Invoked to set main source

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`MediaSourceExtension`](../../media-source-extension/interfaces/MediaSourceExtension.md).[`switchToMainSrc`](../../media-source-extension/interfaces/MediaSourceExtension.md#switchtomainsrc)
