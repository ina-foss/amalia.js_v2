[**Amalia**](../../../../README.md)

***

[Amalia](../../../../modules.md) / [core/utils/format-utils](../README.md) / FormatUtils

# Class: FormatUtils

Defined in: src/app/core/utils/format-utils.ts:6

## Constructors

### Constructor

> **new FormatUtils**(): `FormatUtils`

#### Returns

`FormatUtils`

## Methods

### convertFormattedTcToSeconds()

> `static` **convertFormattedTcToSeconds**(`tc`, `format`, `defaultFps`): `number`

Defined in: src/app/core/utils/format-utils.ts:79

#### Parameters

##### tc

`string`

##### format

`"s"` | `"f"`

##### defaultFps

`number` = `25`

#### Returns

`number`

***

### convertTcToSeconds()

> `static` **convertTcToSeconds**(`tc`): `number`

Defined in: src/app/core/utils/format-utils.ts:63

#### Parameters

##### tc

`string`

#### Returns

`number`

***

### formatString()

> `static` **formatString**(`str`, ...`val`): `string`

Defined in: src/app/core/utils/format-utils.ts:106

Formatting a string in java is using

#### Parameters

##### str

`string`

A format string

##### val

...`string`[]

Arguments referenced by the format specifiers in the format string

#### Returns

`string`

***

### formatTime()

> `static` **formatTime**(`seconds`, `format`, `defaultFps`): `string`

Defined in: src/app/core/utils/format-utils.ts:15

Method in charge to format time

#### Parameters

##### seconds

`number`

seconds

##### format

Format specifier h/m/s/f/ms/mms

`"h"` | `"m"` | `"s"` | `"minutes"` | `"f"` | `"ms"` | `"mms"` | `"hours"` | `"seconds"`

##### defaultFps

`number` = `25`

frames per second

#### Returns

`string`

return format time

#### Method

formatTime
