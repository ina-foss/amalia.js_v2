[**Amalia**](../../../../README.md)

***

[Amalia](../../../../modules.md) / [plugins/transcription/transcription-plugin.component](../README.md) / TcFormatPipe

# Class: TcFormatPipe

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:16

## Implements

- `PipeTransform`

## Constructors

### Constructor

> **new TcFormatPipe**(): `TcFormatPipe`

#### Returns

`TcFormatPipe`

## Methods

### transform()

> **transform**(`tc`, `format`, `defaultFps`): `string`

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:17

#### Parameters

##### tc

`number`

##### format

`"h"` | `"m"` | `"s"` | `"minutes"` | `"f"` | `"ms"` | `"mms"` | `"hours"` | `"seconds"`

##### defaultFps

`number` = `25`

#### Returns

`string`

#### Implementation of

`PipeTransform.transform`
