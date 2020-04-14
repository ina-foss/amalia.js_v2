[Amalia](../README.md) › [Globals](../globals.md) › ["app/core/utils/format-utils"](../modules/_app_core_utils_format_utils_.md) › [FormatUtils](_app_core_utils_format_utils_.formatutils.md)

# Class: FormatUtils

## Hierarchy

* **FormatUtils**

## Index

### Methods

* [convertTcToSeconds](_app_core_utils_format_utils_.formatutils.md#static-converttctoseconds)
* [formatString](_app_core_utils_format_utils_.formatutils.md#static-formatstring)
* [formatTime](_app_core_utils_format_utils_.formatutils.md#static-formattime)

## Methods

### `Static` convertTcToSeconds

▸ **convertTcToSeconds**(`tc`: string): *number*

Defined in src/app/core/utils/format-utils.ts:56

**Parameters:**

Name | Type |
------ | ------ |
`tc` | string |

**Returns:** *number*

___

### `Static` formatString

▸ **formatString**(`str`: string, ...`val`: string[]): *string*

Defined in src/app/core/utils/format-utils.ts:77

 Formatting a string in java is using

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`str` | string | A format string |
`...val` | string[] | Arguments referenced by the format specifiers in the format string  |

**Returns:** *string*

___

### `Static` formatTime

▸ **formatTime**(`seconds`: number, `format`: "h" | "m" | "s" | "f" | "ms" | "mms" | "seconds", `defaultFps`: number): *string*

Defined in src/app/core/utils/format-utils.ts:15

Method in charge to format time

**`method`** formatTime

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`seconds` | number | - | seconds |
`format` | "h" &#124; "m" &#124; "s" &#124; "f" &#124; "ms" &#124; "mms" &#124; "seconds" | "s" | Format specifier h/m/s/f/ms/mms |
`defaultFps` | number | 25 | frames per second |

**Returns:** *string*

return format time
