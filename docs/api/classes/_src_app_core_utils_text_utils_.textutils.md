[Amalia](../README.md) › [Globals](../globals.md) › ["src/app/core/utils/text-utils"](../modules/_src_app_core_utils_text_utils_.md) › [TextUtils](_src_app_core_utils_text_utils_.textutils.md)

# Class: TextUtils

In charge to handle search text

## Hierarchy

* **TextUtils**

## Index

### Methods

* [hasSearchText](_src_app_core_utils_text_utils_.textutils.md#static-hassearchtext)
* [removeDiacritics](_src_app_core_utils_text_utils_.textutils.md#static-removediacritics)

## Methods

### `Static` hasSearchText

▸ **hasSearchText**(`text`: string, `searchText`: string): *boolean*

Defined in src/app/core/utils/text-utils.ts:16

Utils in charge search text with normalize

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`text` | string | main text |
`searchText` | string | search text  |

**Returns:** *boolean*

___

### `Static` removeDiacritics

▸ **removeDiacritics**(`str`: string): *string*

Defined in src/app/core/utils/text-utils.ts:8

Removes all special characters from a string (ex: 'é' => 'e')

**Parameters:**

Name | Type |
------ | ------ |
`str` | string |

**Returns:** *string*
