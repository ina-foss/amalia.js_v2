[**Amalia**](../../../../README.md)

***

[Amalia](../../../../modules.md) / [core/utils/base-utils](../README.md) / BaseUtils

# Class: BaseUtils

Defined in: src/app/core/utils/base-utils.ts:1

## Constructors

### Constructor

> **new BaseUtils**(): `BaseUtils`

#### Returns

`BaseUtils`

## Methods

### base64DecToArr()

> `static` **base64DecToArr**(`sBase64`): `Uint8Array`

Defined in: src/app/core/utils/base-utils.ts:5

Handle decode base 64

#### Parameters

##### sBase64

`string`

#### Returns

`Uint8Array`

***

### getEncodedImage()

> `static` **getEncodedImage**(`base64EncodedThumb`): `string`

Defined in: src/app/core/utils/base-utils.ts:19

Turns an image that was previously endoded in base 64 to its URL

#### Parameters

##### base64EncodedThumb

`string`

#### Returns

`string`

***

### getUniqueId()

> `static` **getUniqueId**(`parts`): `string`

Defined in: src/app/core/utils/base-utils.ts:34

generate groups of 4 random characters

#### Parameters

##### parts

`number` = `1`

#### Returns

`string`

#### Examples

```ts
getUniqueId(1) : 607f
```

```ts
getUniqueId(2) : 95ca-361a-f8a1-1e73
```
