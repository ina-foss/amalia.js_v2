[Amalia](../README.md) › [Globals](../globals.md) › ["app/core/logger/default-logger"](../modules/_app_core_logger_default_logger_.md) › [DefaultLogger](_app_core_logger_default_logger_.defaultlogger.md)

# Class: DefaultLogger

In charge to outputs a message to the web console

## Hierarchy

* **DefaultLogger**

## Implements

* [LoggerInterface](../interfaces/_app_core_logger_logger_interface_.loggerinterface.md)

## Index

### Constructors

* [constructor](_app_core_logger_default_logger_.defaultlogger.md#constructor)

### Properties

* [namespaces](_app_core_logger_default_logger_.defaultlogger.md#namespaces)

### Methods

* [debug](_app_core_logger_default_logger_.defaultlogger.md#debug)
* [error](_app_core_logger_default_logger_.defaultlogger.md#error)
* [fatal](_app_core_logger_default_logger_.defaultlogger.md#fatal)
* [info](_app_core_logger_default_logger_.defaultlogger.md#info)
* [log](_app_core_logger_default_logger_.defaultlogger.md#private-log)
* [trace](_app_core_logger_default_logger_.defaultlogger.md#trace)
* [warn](_app_core_logger_default_logger_.defaultlogger.md#warn)

## Constructors

###  constructor

\+ **new DefaultLogger**(`namespaces`: string): *[DefaultLogger](_app_core_logger_default_logger_.defaultlogger.md)*

Defined in src/app/core/logger/default-logger.ts:9

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`namespaces` | string | "root" |

**Returns:** *[DefaultLogger](_app_core_logger_default_logger_.defaultlogger.md)*

## Properties

###  namespaces

• **namespaces**: *string* = "root"

Defined in src/app/core/logger/default-logger.ts:9

## Methods

###  debug

▸ **debug**(`msg`: string, `data?`: any): *void*

*Implementation of [LoggerInterface](../interfaces/_app_core_logger_logger_interface_.loggerinterface.md)*

Defined in src/app/core/logger/default-logger.ts:61

**Parameters:**

Name | Type |
------ | ------ |
`msg` | string |
`data?` | any |

**Returns:** *void*

___

###  error

▸ **error**(`msg`: string, `data?`: any): *void*

*Implementation of [LoggerInterface](../interfaces/_app_core_logger_logger_interface_.loggerinterface.md)*

Defined in src/app/core/logger/default-logger.ts:65

**Parameters:**

Name | Type |
------ | ------ |
`msg` | string |
`data?` | any |

**Returns:** *void*

___

###  fatal

▸ **fatal**(`msg`: string, `data?`: any): *void*

*Implementation of [LoggerInterface](../interfaces/_app_core_logger_logger_interface_.loggerinterface.md)*

Defined in src/app/core/logger/default-logger.ts:69

**Parameters:**

Name | Type |
------ | ------ |
`msg` | string |
`data?` | any |

**Returns:** *void*

___

###  info

▸ **info**(`msg`: string, `data?`: any): *void*

*Implementation of [LoggerInterface](../interfaces/_app_core_logger_logger_interface_.loggerinterface.md)*

Defined in src/app/core/logger/default-logger.ts:73

**Parameters:**

Name | Type |
------ | ------ |
`msg` | string |
`data?` | any |

**Returns:** *void*

___

### `Private` log

▸ **log**(`level`: [LoggerLevel](../enums/_app_core_logger_logger_level_.loggerlevel.md), `log`: [LoggerData](../interfaces/_app_core_logger_logger_data_.loggerdata.md)): *void*

Defined in src/app/core/logger/default-logger.ts:20

Outputs the message to the web console

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`level` | [LoggerLevel](../enums/_app_core_logger_logger_level_.loggerlevel.md) | log level |
`log` | [LoggerData](../interfaces/_app_core_logger_logger_data_.loggerdata.md) | log message  |

**Returns:** *void*

___

###  trace

▸ **trace**(`msg`: string, `data?`: any): *void*

*Implementation of [LoggerInterface](../interfaces/_app_core_logger_logger_interface_.loggerinterface.md)*

Defined in src/app/core/logger/default-logger.ts:78

**Parameters:**

Name | Type |
------ | ------ |
`msg` | string |
`data?` | any |

**Returns:** *void*

___

###  warn

▸ **warn**(`msg`: string, `data?`: any): *void*

*Implementation of [LoggerInterface](../interfaces/_app_core_logger_logger_interface_.loggerinterface.md)*

Defined in src/app/core/logger/default-logger.ts:82

**Parameters:**

Name | Type |
------ | ------ |
`msg` | string |
`data?` | any |

**Returns:** *void*
