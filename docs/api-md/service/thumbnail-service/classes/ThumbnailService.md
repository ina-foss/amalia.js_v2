[**Amalia**](../../../README.md)

***

[Amalia](../../../modules.md) / [service/thumbnail-service](../README.md) / ThumbnailService

# Class: ThumbnailService

Defined in: src/app/service/thumbnail-service.ts:10

Service contain all instance of players

## Constructors

### Constructor

> **new ThumbnailService**(`httpClient`): `ThumbnailService`

Defined in: src/app/service/thumbnail-service.ts:20

#### Parameters

##### httpClient

`HttpClient`

#### Returns

`ThumbnailService`

## Properties

### listThumbnails

> **listThumbnails**: `object`[] = `[]`

Defined in: src/app/service/thumbnail-service.ts:14

#### blob

> **blob**: `string`

#### url

> **url**: `string`

***

### logger

> **logger**: [`DefaultLogger`](../../../core/logger/default-logger/classes/DefaultLogger.md)

Defined in: src/app/service/thumbnail-service.ts:18

Default loader

***

### key

> `static` **key**: `string` = `'blob'`

Defined in: src/app/service/thumbnail-service.ts:11

## Methods

### getThumbnail()

> **getThumbnail**(`url`, `tc`): `Promise`\<`string`\>

Defined in: src/app/service/thumbnail-service.ts:28

If tc exist in listThumbnails return blob else call api to get blob

#### Parameters

##### url

`any`

##### tc

`any`

#### Returns

`Promise`\<`string`\>

***

### loadThumbnail()

> **loadThumbnail**(`url`, `tc`): `Promise`\<`string`\>

Defined in: src/app/service/thumbnail-service.ts:38

Call loader to get blob

#### Parameters

##### url

`any`

##### tc

`any`

#### Returns

`Promise`\<`string`\>
