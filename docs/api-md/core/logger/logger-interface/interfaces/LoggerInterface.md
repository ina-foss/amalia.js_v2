[**Amalia**](../../../../README.md)

***

[Amalia](../../../../modules.md) / [core/logger/logger-interface](../README.md) / LoggerInterface

# Interface: LoggerInterface

Defined in: src/app/core/logger/logger-interface.ts:4

Logger interface

## Methods

### debug()

> **debug**(`msg`, `data?`): `void`

Defined in: src/app/core/logger/logger-interface.ts:29

In charge to call Log with log type

#### Parameters

##### msg

`string`

message

##### data?

`any`

log data

#### Returns

`void`

***

### error()

> **error**(`msg`, `data?`): `void`

Defined in: src/app/core/logger/logger-interface.ts:50

In charge to call Log with log type

#### Parameters

##### msg

`string`

message

##### data?

`any`

log data

#### Returns

`void`

***

### fatal()

> **fatal**(`msg`, `data?`): `void`

Defined in: src/app/core/logger/logger-interface.ts:57

In charge to call Log with log type

#### Parameters

##### msg

`string`

message

##### data?

`any`

log data

#### Returns

`void`

***

### info()

> **info**(`msg`, `data?`): `void`

Defined in: src/app/core/logger/logger-interface.ts:36

In charge to call Log with log type

#### Parameters

##### msg

`string`

message

##### data?

`any`

log data

#### Returns

`void`

***

### logLevel()

> **logLevel**(`level`): `void`

Defined in: src/app/core/logger/logger-interface.ts:10

Set log level

#### Parameters

##### level

`string`

#### Returns

`void`

***

### state()

> **state**(`state`): `any`

Defined in: src/app/core/logger/logger-interface.ts:15

Set log state

#### Parameters

##### state

`boolean`

#### Returns

`any`

***

### status()

> **status**(): `boolean`

Defined in: src/app/core/logger/logger-interface.ts:5

#### Returns

`boolean`

***

### trace()

> **trace**(`msg`, `data?`): `void`

Defined in: src/app/core/logger/logger-interface.ts:22

In charge to call Log with log type

#### Parameters

##### msg

`string`

message

##### data?

`any`

log data

#### Returns

`void`

***

### warn()

> **warn**(`msg`, `data?`): `void`

Defined in: src/app/core/logger/logger-interface.ts:43

In charge to call Log with log type

#### Parameters

##### msg

`string`

message

##### data?

`any`

log data

#### Returns

`void`
