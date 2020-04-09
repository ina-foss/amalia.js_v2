[Amalia](../README.md) › [Globals](../globals.md) › ["app/core/error/error-handler"](../modules/_app_core_error_error_handler_.md) › [ErrorHandler](_app_core_error_error_handler_.errorhandler.md)

# Class: ErrorHandler

## Hierarchy

* **ErrorHandler**

## Index

### Constructors

* [constructor](_app_core_error_error_handler_.errorhandler.md#constructor)

### Properties

* [loggingStrategy](_app_core_error_error_handler_.errorhandler.md#private-loggingstrategy)
* [AMALIA_ERROR](_app_core_error_error_handler_.errorhandler.md#static-amalia_error)

### Methods

* [handle](_app_core_error_error_handler_.errorhandler.md#handle)

## Constructors

###  constructor

\+ **new ErrorHandler**(`loggingStrategy`: [ErrorLoggingStrategy](../interfaces/_app_core_error_error_logging_strategy_.errorloggingstrategy.md)): *[ErrorHandler](_app_core_error_error_handler_.errorhandler.md)*

Defined in src/app/core/error/error-handler.ts:5

**Parameters:**

Name | Type |
------ | ------ |
`loggingStrategy` | [ErrorLoggingStrategy](../interfaces/_app_core_error_error_logging_strategy_.errorloggingstrategy.md) |

**Returns:** *[ErrorHandler](_app_core_error_error_handler_.errorhandler.md)*

## Properties

### `Private` loggingStrategy

• **loggingStrategy**: *[ErrorLoggingStrategy](../interfaces/_app_core_error_error_logging_strategy_.errorloggingstrategy.md)*

Defined in src/app/core/error/error-handler.ts:5

___

### `Static` AMALIA_ERROR

▪ **AMALIA_ERROR**: *string* = "AMALIA_ERROR"

Defined in src/app/core/error/error-handler.ts:4

## Methods

###  handle

▸ **handle**(`description`: string, `err`: [Error](_app_core_exception_amalia_exception_.amaliaexception.md#static-error)): *Promise‹any›*

Defined in src/app/core/error/error-handler.ts:11

**Parameters:**

Name | Type |
------ | ------ |
`description` | string |
`err` | [Error](_app_core_exception_amalia_exception_.amaliaexception.md#static-error) |

**Returns:** *Promise‹any›*
