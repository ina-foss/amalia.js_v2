[Amalia](../README.md) › [Globals](../globals.md) › ["app/core/utils/base-utils"](../modules/_app_core_utils_base_utils_.md) › [BaseUtils](_app_core_utils_base_utils_.baseutils.md)

# Class: BaseUtils

## Hierarchy

* **BaseUtils**

## Index

### Methods

* [b64ToUint6](_app_core_utils_base_utils_.baseutils.md#static-private-b64touint6)
* [base64DecToArr](_app_core_utils_base_utils_.baseutils.md#static-base64dectoarr)
* [base64DecToArrOld](_app_core_utils_base_utils_.baseutils.md#static-base64dectoarrold)
* [getUniqueId](_app_core_utils_base_utils_.baseutils.md#static-getuniqueid)
* [uint6ToB64](_app_core_utils_base_utils_.baseutils.md#static-private-uint6tob64)

## Methods

### `Static` `Private` b64ToUint6

▸ **b64ToUint6**(`nChr`: number): *number*

Defined in src/app/core/utils/base-utils.ts:42

Array of bytes to base64 string decoding

**Parameters:**

Name | Type |
------ | ------ |
`nChr` | number |

**Returns:** *number*

___

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

### `Static` base64DecToArrOld

▸ **base64DecToArrOld**(`sBase64`: string, `nBlocksSize`: number): *Uint8Array‹›*

Defined in src/app/core/utils/base-utils.ts:51

Decode base64 to array

**`deprecated`** 

**Parameters:**

Name | Type |
------ | ------ |
`sBase64` | string |
`nBlocksSize` | number |

**Returns:** *Uint8Array‹›*

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

___

### `Static` `Private` uint6ToB64

▸ **uint6ToB64**(`nUint6`: number): *number*

Defined in src/app/core/utils/base-utils.ts:34

Convert Base64 string to array encoding

**Parameters:**

Name | Type |
------ | ------ |
`nUint6` | number |

**Returns:** *number*
