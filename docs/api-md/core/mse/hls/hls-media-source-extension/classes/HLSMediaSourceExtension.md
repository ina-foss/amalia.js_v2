[**Amalia**](../../../../../README.md)

***

[Amalia](../../../../../modules.md) / [core/mse/hls/hls-media-source-extension](../README.md) / HLSMediaSourceExtension

# Class: HLSMediaSourceExtension

Defined in: src/app/core/mse/hls/hls-media-source-extension.ts:19

In  charge to handle HSL Media extension

## Implements

- [`MediaSourceExtension`](../../../media-source-extension/interfaces/MediaSourceExtension.md)

## Constructors

### Constructor

> **new HLSMediaSourceExtension**(`mediaElement`, `eventEmitter`, `config`, `logger`): `HLSMediaSourceExtension`

Defined in: src/app/core/mse/hls/hls-media-source-extension.ts:32

#### Parameters

##### mediaElement

`HTMLVideoElement`

##### eventEmitter

`EventEmitter`

##### config

[`PlayerConfigData`](../../../../config/model/player-config-data/interfaces/PlayerConfigData.md)

##### logger

[`LoggerInterface`](../../../../logger/logger-interface/interfaces/LoggerInterface.md)

#### Returns

`HLSMediaSourceExtension`

## Properties

### config

> **config**: [`PlayerConfigData`](../../../../config/model/player-config-data/interfaces/PlayerConfigData.md)

Defined in: src/app/core/mse/hls/hls-media-source-extension.ts:26

***

### mediaElement

> `readonly` **mediaElement**: `HTMLVideoElement`

Defined in: src/app/core/mse/hls/hls-media-source-extension.ts:28

***

### mediaType

> **mediaType**: `"AUDIO"` \| `"VIDEO"` = `'AUDIO'`

Defined in: src/app/core/mse/hls/hls-media-source-extension.ts:54

#### Implementation of

[`MediaSourceExtension`](../../../media-source-extension/interfaces/MediaSourceExtension.md).[`mediaType`](../../../media-source-extension/interfaces/MediaSourceExtension.md#mediatype)

***

### reverseMode

> **reverseMode**: `boolean` = `false`

Defined in: src/app/core/mse/hls/hls-media-source-extension.ts:21

## Methods

### destroy()

> **destroy**(): `void`

Defined in: src/app/core/mse/hls/hls-media-source-extension.ts:148

Invoked for clean buffer

#### Returns

`void`

#### Implementation of

[`MediaSourceExtension`](../../../media-source-extension/interfaces/MediaSourceExtension.md).[`destroy`](../../../media-source-extension/interfaces/MediaSourceExtension.md#destroy)

***

### getBackwardsSrc()

> **getBackwardsSrc**(): `string` \| `MediaStream` \| `MediaSource` \| `Blob`

Defined in: src/app/core/mse/hls/hls-media-source-extension.ts:112

Invoked on reverse mode

#### Returns

`string` \| `MediaStream` \| `MediaSource` \| `Blob`

#### Implementation of

[`MediaSourceExtension`](../../../media-source-extension/interfaces/MediaSourceExtension.md).[`getBackwardsSrc`](../../../media-source-extension/interfaces/MediaSourceExtension.md#getbackwardssrc)

***

### getConfig()

> **getConfig**(): `HlsConfig`

Defined in: src/app/core/mse/hls/hls-media-source-extension.ts:180

Get config

#### Returns

`HlsConfig`

#### Implementation of

[`MediaSourceExtension`](../../../media-source-extension/interfaces/MediaSourceExtension.md).[`getConfig`](../../../media-source-extension/interfaces/MediaSourceExtension.md#getconfig)

***

### getSrc()

> **getSrc**(): `string` \| `MediaStream` \| `MediaSource` \| `Blob`

Defined in: src/app/core/mse/hls/hls-media-source-extension.ts:74

Return media source

#### Returns

`string` \| `MediaStream` \| `MediaSource` \| `Blob`

#### Implementation of

[`MediaSourceExtension`](../../../media-source-extension/interfaces/MediaSourceExtension.md).[`getSrc`](../../../media-source-extension/interfaces/MediaSourceExtension.md#getsrc)

***

### handleError()

> **handleError**(`event`): `void`

Defined in: src/app/core/mse/hls/hls-media-source-extension.ts:160

Invoked when error events

#### Parameters

##### event

`any`

#### Returns

`void`

#### Implementation of

[`MediaSourceExtension`](../../../media-source-extension/interfaces/MediaSourceExtension.md).[`handleError`](../../../media-source-extension/interfaces/MediaSourceExtension.md#handleerror)

***

### handleManifestParsed()

> **handleManifestParsed**(`_`, `data`): `void`

Defined in: src/app/core/mse/hls/hls-media-source-extension.ts:105

#### Parameters

##### \_

`any`

##### data

`any`

#### Returns

`void`

***

### setMaxBufferLengthConfig()

> **setMaxBufferLengthConfig**(`value`): `void`

Defined in: src/app/core/mse/hls/hls-media-source-extension.ts:184

Get config

#### Parameters

##### value

`any`

#### Returns

`void`

#### Implementation of

[`MediaSourceExtension`](../../../media-source-extension/interfaces/MediaSourceExtension.md).[`setMaxBufferLengthConfig`](../../../media-source-extension/interfaces/MediaSourceExtension.md#setmaxbufferlengthconfig)

***

### setSrc()

> **setSrc**(`config`): `void`

Defined in: src/app/core/mse/hls/hls-media-source-extension.ts:83

Invoked to set hls source
When you set not valid url, we add default base 64 header

#### Parameters

##### config

[`PlayerConfigData`](../../../../config/model/player-config-data/interfaces/PlayerConfigData.md)

media source configuration

#### Returns

`void`

#### Implementation of

[`MediaSourceExtension`](../../../media-source-extension/interfaces/MediaSourceExtension.md).[`setSrc`](../../../media-source-extension/interfaces/MediaSourceExtension.md#setsrc)

***

### switchToBackwardsSrc()

> **switchToBackwardsSrc**(): `Promise`\<`void`\>

Defined in: src/app/core/mse/hls/hls-media-source-extension.ts:120

Invoked to set backward source

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`MediaSourceExtension`](../../../media-source-extension/interfaces/MediaSourceExtension.md).[`switchToBackwardsSrc`](../../../media-source-extension/interfaces/MediaSourceExtension.md#switchtobackwardssrc)

***

### switchToMainSrc()

> **switchToMainSrc**(): `Promise`\<`void`\>

Defined in: src/app/core/mse/hls/hls-media-source-extension.ts:116

Invoked to set main source

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`MediaSourceExtension`](../../../media-source-extension/interfaces/MediaSourceExtension.md).[`switchToMainSrc`](../../../media-source-extension/interfaces/MediaSourceExtension.md#switchtomainsrc)

***

### isUrl()

> `static` **isUrl**(`value`): `boolean`

Defined in: src/app/core/mse/hls/hls-media-source-extension.ts:62

Is valid url

#### Parameters

##### value

`string`

url

#### Returns

`boolean`

true is url
