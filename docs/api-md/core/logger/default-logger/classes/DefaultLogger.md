[**Amalia**](../../../../README.md)

***

[Amalia](../../../../modules.md) / [core/logger/default-logger](../README.md) / DefaultLogger

# Class: DefaultLogger

Defined in: src/app/core/logger/default-logger.ts:8

In charge to outputs a message to the web console

## Implements

- [`LoggerInterface`](../../logger-interface/interfaces/LoggerInterface.md)

## Constructors

### Constructor

> **new DefaultLogger**(`namespaces`, `enabled`, `level`): `DefaultLogger`

Defined in: src/app/core/logger/default-logger.ts:13

#### Parameters

##### namespaces

`string` = `'root'`

##### enabled

`boolean` = `false`

##### level

[`LoggerLevel`](../../logger-level/enumerations/LoggerLevel.md) = `LoggerLevel.Error`

#### Returns

`DefaultLogger`

## Properties

### namespaces

> **namespaces**: `string` = `'root'`

Defined in: src/app/core/logger/default-logger.ts:9

## Methods

### debug()

> **debug**(`msg`, `data?`): `void`

Defined in: src/app/core/logger/default-logger.ts:85

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

#### Implementation of

[`LoggerInterface`](../../logger-interface/interfaces/LoggerInterface.md).[`debug`](../../logger-interface/interfaces/LoggerInterface.md#debug)

***

### error()

> **error**(`msg`, `data?`): `void`

Defined in: src/app/core/logger/default-logger.ts:89

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

#### Implementation of

[`LoggerInterface`](../../logger-interface/interfaces/LoggerInterface.md).[`error`](../../logger-interface/interfaces/LoggerInterface.md#error)

***

### fatal()

> **fatal**(`msg`, `data?`): `void`

Defined in: src/app/core/logger/default-logger.ts:93

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

#### Implementation of

[`LoggerInterface`](../../logger-interface/interfaces/LoggerInterface.md).[`fatal`](../../logger-interface/interfaces/LoggerInterface.md#fatal)

***

### info()

> **info**(`msg`, `data?`): `void`

Defined in: src/app/core/logger/default-logger.ts:97

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

#### Implementation of

[`LoggerInterface`](../../logger-interface/interfaces/LoggerInterface.md).[`info`](../../logger-interface/interfaces/LoggerInterface.md#info)

***

### logLevel()

> **logLevel**(`level`): `void`

Defined in: src/app/core/logger/default-logger.ts:23

Set log level

#### Parameters

##### level

`string`

#### Returns

`void`

#### Implementation of

[`LoggerInterface`](../../logger-interface/interfaces/LoggerInterface.md).[`logLevel`](../../logger-interface/interfaces/LoggerInterface.md#loglevel)

***

### state()

> **state**(`state`): `void`

Defined in: src/app/core/logger/default-logger.ts:32

Set log state

#### Parameters

##### state

`boolean`

#### Returns

`void`

#### Implementation of

[`LoggerInterface`](../../logger-interface/interfaces/LoggerInterface.md).[`state`](../../logger-interface/interfaces/LoggerInterface.md#state)

***

### status()

> **status**(): `boolean`

Defined in: src/app/core/logger/default-logger.ts:19

#### Returns

`boolean`

#### Implementation of

[`LoggerInterface`](../../logger-interface/interfaces/LoggerInterface.md).[`status`](../../logger-interface/interfaces/LoggerInterface.md#status)

***

### trace()

> **trace**(`msg`, `data?`): `void`

Defined in: src/app/core/logger/default-logger.ts:102

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

#### Implementation of

[`LoggerInterface`](../../logger-interface/interfaces/LoggerInterface.md).[`trace`](../../logger-interface/interfaces/LoggerInterface.md#trace)

***

### warn()

> **warn**(`msg`, `data?`): `void`

Defined in: src/app/core/logger/default-logger.ts:106

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

#### Implementation of

[`LoggerInterface`](../../logger-interface/interfaces/LoggerInterface.md).[`warn`](../../logger-interface/interfaces/LoggerInterface.md#warn)
