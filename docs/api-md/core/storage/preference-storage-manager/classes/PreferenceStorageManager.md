[**Amalia**](../../../../README.md)

***

[Amalia](../../../../modules.md) / [core/storage/preference-storage-manager](../README.md) / PreferenceStorageManager

# Class: PreferenceStorageManager

Defined in: src/app/core/storage/preference-storage-manager.ts:6

In charge to handle storage

## Constructors

### Constructor

> **new PreferenceStorageManager**(`storageNamespace`): `PreferenceStorageManager`

Defined in: src/app/core/storage/preference-storage-manager.ts:21

Init this class preference storage manager with namespace default namespace is `ina.amalia.player`

#### Parameters

##### storageNamespace

`string` = `'ina.amalia.player'`

#### Returns

`PreferenceStorageManager`

## Properties

### data

> **data**: `any` = `null`

Defined in: src/app/core/storage/preference-storage-manager.ts:12

Local storage data

***

### logger

> **logger**: [`DefaultLogger`](../../../logger/default-logger/classes/DefaultLogger.md) = `null`

Defined in: src/app/core/storage/preference-storage-manager.ts:8

## Methods

### clear()

> **clear**(): `void`

Defined in: src/app/core/storage/preference-storage-manager.ts:112

Clear all data

#### Returns

`void`

***

### getItem()

> **getItem**(`key`): `string`

Defined in: src/app/core/storage/preference-storage-manager.ts:72

Return key data

#### Parameters

##### key

`string`

get key

#### Returns

`string`

***

### hasItem()

> **hasItem**(`key`): `boolean`

Defined in: src/app/core/storage/preference-storage-manager.ts:64

Method check if has key

#### Parameters

##### key

`string`

control key

#### Returns

`boolean`

#### Method

hasItem

***

### initializeStorage()

> **initializeStorage**(): `void`

Defined in: src/app/core/storage/preference-storage-manager.ts:30

Initialize local storage data

#### Returns

`void`

#### Method

initialize

***

### removeItem()

> **removeItem**(`key`): `boolean`

Defined in: src/app/core/storage/preference-storage-manager.ts:100

Remove item with key

#### Parameters

##### key

`string`

remove key

#### Returns

`boolean`

***

### setItem()

> **setItem**(`key`, `value`): `boolean`

Defined in: src/app/core/storage/preference-storage-manager.ts:84

Set item with key and value

#### Parameters

##### key

`string`

set key

##### value

`string`

set value

#### Returns

`boolean`

***

### updateDataStorage()

> **updateDataStorage**(): `void`

Defined in: src/app/core/storage/preference-storage-manager.ts:49

Update local storage data

#### Returns

`void`

#### Method

initialize
