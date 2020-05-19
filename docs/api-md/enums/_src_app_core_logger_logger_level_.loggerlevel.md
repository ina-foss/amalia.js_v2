[Amalia](../README.md) › [Globals](../globals.md) › ["src/app/core/logger/logger-level"](../modules/_src_app_core_logger_logger_level_.md) › [LoggerLevel](_src_app_core_logger_logger_level_.loggerlevel.md)

# Enumeration: LoggerLevel

## Index

### Enumeration members

* [Debug](_src_app_core_logger_logger_level_.loggerlevel.md#debug)
* [Error](_src_app_core_logger_logger_level_.loggerlevel.md#error)
* [Fatal](_src_app_core_logger_logger_level_.loggerlevel.md#fatal)
* [Info](_src_app_core_logger_logger_level_.loggerlevel.md#info)
* [Trace](_src_app_core_logger_logger_level_.loggerlevel.md#trace)
* [Warn](_src_app_core_logger_logger_level_.loggerlevel.md#warn)

### Functions

* [fromString](_src_app_core_logger_logger_level_.loggerlevel.md#fromstring)
* [valToString](_src_app_core_logger_logger_level_.loggerlevel.md#valtostring)

## Enumeration members

###  Debug

• **Debug**:

Defined in src/app/core/logger/logger-level.ts:8

___

###  Error

• **Error**:

Defined in src/app/core/logger/logger-level.ts:11

___

###  Fatal

• **Fatal**:

Defined in src/app/core/logger/logger-level.ts:12

___

###  Info

• **Info**:

Defined in src/app/core/logger/logger-level.ts:9

___

###  Trace

• **Trace**:

Defined in src/app/core/logger/logger-level.ts:7

___

###  Warn

• **Warn**:

Defined in src/app/core/logger/logger-level.ts:10

## Functions

###  fromString

▸ **fromString**(`val`: string): *[LoggerLevel](_src_app_core_logger_logger_level_.loggerlevel.md)*

Defined in src/app/core/logger/logger-level.ts:23

Returns LogLevel based on string representation

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`val` | string | Value |

**Returns:** *[LoggerLevel](_src_app_core_logger_logger_level_.loggerlevel.md)*

Error is thrown if invalid.

___

###  valToString

▸ **valToString**(`val`: [LoggerLevel](_src_app_core_logger_logger_level_.loggerlevel.md)): *string*

Defined in src/app/core/logger/logger-level.ts:50

Returns LogLevel based on string representation

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`val` | [LoggerLevel](_src_app_core_logger_logger_level_.loggerlevel.md) | Value |

**Returns:** *string*

Error is thrown if invalid.
