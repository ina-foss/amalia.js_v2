[Amalia](../README.md) › [Globals](../globals.md) › ["src/app/core/utils/format-utils"](../modules/_src_app_core_utils_format_utils_.md) › [FormatUtils](_src_app_core_utils_format_utils_.formatutils.md)

# Class: FormatUtils

## Hierarchy

* **FormatUtils**

## Index

### Methods

* [convertTcToSeconds](_src_app_core_utils_format_utils_.formatutils.md#static-converttctoseconds)
* [formatString](_src_app_core_utils_format_utils_.formatutils.md#static-formatstring)
* [formatTime](_src_app_core_utils_format_utils_.formatutils.md#static-formattime)

## Methods

### `Static` convertTcToSeconds

▸ **convertTcToSeconds**(`tc`: string): *number*

Defined in src/app/core/utils/format-utils.ts:64

**Parameters:**

Name | Type |
------ | ------ |
`tc` | string |

**Returns:** *number*

___

### `Static` formatString

▸ **formatString**(`str`: string, ...`val`: string[]): *string*

Defined in src/app/core/utils/format-utils.ts:85

 Formatting a string in java is using

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`str` | string | A format string |
`...val` | string[] | Arguments referenced by the format specifiers in the format string  |

**Returns:** *string*

___

### `Static` formatTime

▸ **formatTime**(`seconds`: number, `format`: "h" | "m" | "s" | "minutes" | "f" | "ms" | "mms" | "hours" | "seconds", `defaultFps`: number): *string*

Defined in src/app/core/utils/format-utils.ts:15

Method in charge to format time

**`method`** formatTime

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`seconds` | number | - | seconds |
`format` | "h" &#124; "m" &#124; "s" &#124; "minutes" &#124; "f" &#124; "ms" &#124; "mms" &#124; "hours" &#124; "seconds" | "s" | Format specifier h/m/s/f/ms/mms |
`defaultFps` | number | 25 | frames per second |

**Returns:** *string*

return format time
