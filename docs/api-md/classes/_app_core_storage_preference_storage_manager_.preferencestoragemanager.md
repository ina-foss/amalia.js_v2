[Amalia](../README.md) › [Globals](../globals.md) › ["app/core/storage/preference-storage-manager"](../modules/_app_core_storage_preference_storage_manager_.md) › [PreferenceStorageManager](_app_core_storage_preference_storage_manager_.preferencestoragemanager.md)

# Class: PreferenceStorageManager

In charge to handle storage

## Hierarchy

* **PreferenceStorageManager**

## Index

### Constructors

* [constructor](_app_core_storage_preference_storage_manager_.preferencestoragemanager.md#constructor)

### Properties

* [data](_app_core_storage_preference_storage_manager_.preferencestoragemanager.md#data)
* [logger](_app_core_storage_preference_storage_manager_.preferencestoragemanager.md#logger)
* [storageNamespace](_app_core_storage_preference_storage_manager_.preferencestoragemanager.md#private-storagenamespace)

### Methods

* [clear](_app_core_storage_preference_storage_manager_.preferencestoragemanager.md#clear)
* [getItem](_app_core_storage_preference_storage_manager_.preferencestoragemanager.md#getitem)
* [hasItem](_app_core_storage_preference_storage_manager_.preferencestoragemanager.md#hasitem)
* [initializeStorage](_app_core_storage_preference_storage_manager_.preferencestoragemanager.md#initializestorage)
* [removeItem](_app_core_storage_preference_storage_manager_.preferencestoragemanager.md#removeitem)
* [setItem](_app_core_storage_preference_storage_manager_.preferencestoragemanager.md#setitem)
* [updateDataStorage](_app_core_storage_preference_storage_manager_.preferencestoragemanager.md#updatedatastorage)

## Constructors

###  constructor

\+ **new PreferenceStorageManager**(`storageNamespace`: string): *[PreferenceStorageManager](_app_core_storage_preference_storage_manager_.preferencestoragemanager.md)*

Defined in src/app/core/storage/preference-storage-manager.ts:16

Init this class preference storage manager with namespace default namespace is `ina.amalia.player`

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`storageNamespace` | string | "ina.amalia.player" |

**Returns:** *[PreferenceStorageManager](_app_core_storage_preference_storage_manager_.preferencestoragemanager.md)*

## Properties

###  data

• **data**: *any* = null

Defined in src/app/core/storage/preference-storage-manager.ts:12

Local storage data

___

###  logger

• **logger**: *[DefaultLogger](_app_core_logger_default_logger_.defaultlogger.md)* = null

Defined in src/app/core/storage/preference-storage-manager.ts:8

___

### `Private` storageNamespace

• **storageNamespace**: *string*

Defined in src/app/core/storage/preference-storage-manager.ts:16

Storage name

## Methods

###  clear

▸ **clear**(): *void*

Defined in src/app/core/storage/preference-storage-manager.ts:112

Clear all data

**Returns:** *void*

___

###  getItem

▸ **getItem**(`key`: string): *string*

Defined in src/app/core/storage/preference-storage-manager.ts:72

Return key data

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | string | get key  |

**Returns:** *string*

___

###  hasItem

▸ **hasItem**(`key`: string): *boolean*

Defined in src/app/core/storage/preference-storage-manager.ts:64

Method check if has key

**`method`** hasItem

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | string | control key  |

**Returns:** *boolean*

___

###  initializeStorage

▸ **initializeStorage**(): *void*

Defined in src/app/core/storage/preference-storage-manager.ts:30

Initialize local storage data

**`method`** initialize

**Returns:** *void*

___

###  removeItem

▸ **removeItem**(`key`: string): *boolean*

Defined in src/app/core/storage/preference-storage-manager.ts:100

Remove item with key

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | string | remove key  |

**Returns:** *boolean*

___

###  setItem

▸ **setItem**(`key`: string, `value`: string): *boolean*

Defined in src/app/core/storage/preference-storage-manager.ts:84

Set item with key and value

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | string | set key |
`value` | string | set value  |

**Returns:** *boolean*

___

###  updateDataStorage

▸ **updateDataStorage**(): *void*

Defined in src/app/core/storage/preference-storage-manager.ts:49

Update local storage data

**`method`** initialize

**Returns:** *void*
