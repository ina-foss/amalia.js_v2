[**Amalia**](../../../README.md)

***

[Amalia](../../../modules.md) / [service/media-player-service](../README.md) / MediaPlayerService

# Class: MediaPlayerService

Defined in: src/app/service/media-player-service.ts:8

Service contain all instance of players

## Constructors

### Constructor

> **new MediaPlayerService**(): `MediaPlayerService`

#### Returns

`MediaPlayerService`

## Properties

### amaliaComponentsCount

> **amaliaComponentsCount**: `Map`\<`string`, `number`\>

Defined in: src/app/service/media-player-service.ts:10

***

### players

> **players**: `Map`\<`string`, [`MediaPlayerElement`](../../../core/media-player-element/classes/MediaPlayerElement.md)\>

Defined in: src/app/service/media-player-service.ts:9

## Methods

### decrement()

> **decrement**(`key`): `void`

Defined in: src/app/service/media-player-service.ts:42

#### Parameters

##### key

`string`

#### Returns

`void`

***

### get()

> **get**(`key`): [`MediaPlayerElement`](../../../core/media-player-element/classes/MediaPlayerElement.md)

Defined in: src/app/service/media-player-service.ts:16

In charge of creating an instance or return existing instance

#### Parameters

##### key

`string`

instance id, this this case id is player id

#### Returns

[`MediaPlayerElement`](../../../core/media-player-element/classes/MediaPlayerElement.md)

***

### increment()

> **increment**(`key`): `void`

Defined in: src/app/service/media-player-service.ts:32

#### Parameters

##### key

`string`

#### Returns

`void`
