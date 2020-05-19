[Amalia](../README.md) › [Globals](../globals.md) › ["src/app/core/utils/base-utils"](../modules/_src_app_core_utils_base_utils_.md) › [BaseUtils](_src_app_core_utils_base_utils_.baseutils.md)

# Class: BaseUtils

## Hierarchy

* **BaseUtils**

## Index

### Methods

* [base64DecToArr](_src_app_core_utils_base_utils_.baseutils.md#static-base64dectoarr)
* [getUniqueId](_src_app_core_utils_base_utils_.baseutils.md#static-getuniqueid)

## Methods

### `Static` base64DecToArr

▸ **base64DecToArr**(`sBase64`: string): *Uint8Array*

Defined in src/app/core/utils/base-utils.ts:5

Handle decode base 64

**Parameters:**

Name | Type |
------ | ------ |
`sBase64` | string |

**Returns:** *Uint8Array*

___

### `Static` getUniqueId

▸ **getUniqueId**(`parts`: number): *string*

Defined in src/app/core/utils/base-utils.ts:20

generate groups of 4 random characters

**`example`** getUniqueId(1) : 607f

**`example`** getUniqueId(2) : 95ca-361a-f8a1-1e73

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`parts` | number | 1 |

**Returns:** *string*
