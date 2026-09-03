[**Amalia**](../../../../README.md)

***

[Amalia](../../../../modules.md) / [core/mse/media-source-extension](../README.md) / MediaSourceExtension

# Interface: MediaSourceExtension

Defined in: src/app/core/mse/media-source-extension.ts:6

In charge to handle MediaSourceExtension

## Properties

### mediaType

> **mediaType**: `"AUDIO"` \| `"VIDEO"`

Defined in: src/app/core/mse/media-source-extension.ts:7

## Methods

### destroy()

> **destroy**(): `void`

Defined in: src/app/core/mse/media-source-extension.ts:38

Invoked for clean buffer

#### Returns

`void`

***

### getBackwardsSrc()

> **getBackwardsSrc**(): `string` \| `MediaStream` \| `MediaSource` \| `Blob`

Defined in: src/app/core/mse/media-source-extension.ts:23

Invoked on reverse mode

#### Returns

`string` \| `MediaStream` \| `MediaSource` \| `Blob`

***

### getConfig()

> **getConfig**(): `void` \| `object`

Defined in: src/app/core/mse/media-source-extension.ts:49

Get config

#### Returns

`void` \| `object`

***

### getSrc()

> **getSrc**(): `string` \| `MediaStream` \| `MediaSource` \| `Blob`

Defined in: src/app/core/mse/media-source-extension.ts:18

Invoked to get source

#### Returns

`string` \| `MediaStream` \| `MediaSource` \| `Blob`

***

### handleError()

> **handleError**(`event`): `void`

Defined in: src/app/core/mse/media-source-extension.ts:44

Invoked when error to load source,
Emmit event Error

#### Parameters

##### event

`any`

#### Returns

`void`

***

### setMaxBufferLengthConfig()

> **setMaxBufferLengthConfig**(`value`): `void` \| `object`

Defined in: src/app/core/mse/media-source-extension.ts:53

Get config

#### Parameters

##### value

`any`

#### Returns

`void` \| `object`

***

### setSrc()

> **setSrc**(`config`): `any`

Defined in: src/app/core/mse/media-source-extension.ts:13

Invoked to set source

#### Parameters

##### config

[`PlayerConfigData`](../../../config/model/player-config-data/interfaces/PlayerConfigData.md)

#### Returns

`any`

***

### switchToBackwardsSrc()

> **switchToBackwardsSrc**(): `Promise`\<`void`\>

Defined in: src/app/core/mse/media-source-extension.ts:33

Invoked to set backward source

#### Returns

`Promise`\<`void`\>

***

### switchToMainSrc()

> **switchToMainSrc**(): `Promise`\<`void`\>

Defined in: src/app/core/mse/media-source-extension.ts:28

Invoked to set main source

#### Returns

`Promise`\<`void`\>
