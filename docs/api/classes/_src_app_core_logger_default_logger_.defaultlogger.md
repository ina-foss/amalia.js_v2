[Amalia](../README.md) › [Globals](../globals.md) › ["src/app/core/logger/default-logger"](../modules/_src_app_core_logger_default_logger_.md) › [DefaultLogger](_src_app_core_logger_default_logger_.defaultlogger.md)

# Class: DefaultLogger

In charge to outputs a message to the web console

## Hierarchy

* **DefaultLogger**

## Implements

* [LoggerInterface](../interfaces/_src_app_core_logger_logger_interface_.loggerinterface.md)

## Index

### Constructors

* [constructor](_src_app_core_logger_default_logger_.defaultlogger.md#constructor)

### Properties

* [_enabled](_src_app_core_logger_default_logger_.defaultlogger.md#private-_enabled)
* [_logLevel](_src_app_core_logger_default_logger_.defaultlogger.md#private-_loglevel)
* [namespaces](_src_app_core_logger_default_logger_.defaultlogger.md#namespaces)

### Methods

* [debug](_src_app_core_logger_default_logger_.defaultlogger.md#debug)
* [error](_src_app_core_logger_default_logger_.defaultlogger.md#error)
* [fatal](_src_app_core_logger_default_logger_.defaultlogger.md#fatal)
* [info](_src_app_core_logger_default_logger_.defaultlogger.md#info)
* [log](_src_app_core_logger_default_logger_.defaultlogger.md#private-log)
* [logLevel](_src_app_core_logger_default_logger_.defaultlogger.md#loglevel)
* [state](_src_app_core_logger_default_logger_.defaultlogger.md#state)
* [status](_src_app_core_logger_default_logger_.defaultlogger.md#status)
* [trace](_src_app_core_logger_default_logger_.defaultlogger.md#trace)
* [warn](_src_app_core_logger_default_logger_.defaultlogger.md#warn)

## Constructors

###  constructor

\+ **new DefaultLogger**(`namespaces`: string, `enabled`: boolean, `level`: [LoggerLevel](../enums/_src_app_core_logger_logger_level_.loggerlevel.md)): *[DefaultLogger](_src_app_core_logger_default_logger_.defaultlogger.md)*

Defined in src/app/core/logger/default-logger.ts:11

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`namespaces` | string | "root" |
`enabled` | boolean | false |
`level` | [LoggerLevel](../enums/_src_app_core_logger_logger_level_.loggerlevel.md) | LoggerLevel.Error |

**Returns:** *[DefaultLogger](_src_app_core_logger_default_logger_.defaultlogger.md)*

## Properties

### `Private` _enabled

• **_enabled**: *boolean* = true

Defined in src/app/core/logger/default-logger.ts:11

___

### `Private` _logLevel

• **_logLevel**: *[LoggerLevel](../enums/_src_app_core_logger_logger_level_.loggerlevel.md)*

Defined in src/app/core/logger/default-logger.ts:10

___

###  namespaces

• **namespaces**: *string* = "root"

Defined in src/app/core/logger/default-logger.ts:9

## Methods

###  debug

▸ **debug**(`msg`: string, `data?`: any): *void*

*Implementation of [LoggerInterface](../interfaces/_src_app_core_logger_logger_interface_.loggerinterface.md)*

Defined in src/app/core/logger/default-logger.ts:85

**Parameters:**

Name | Type |
------ | ------ |
`msg` | string |
`data?` | any |

**Returns:** *void*

___

###  error

▸ **error**(`msg`: string, `data?`: any): *void*

*Implementation of [LoggerInterface](../interfaces/_src_app_core_logger_logger_interface_.loggerinterface.md)*

Defined in src/app/core/logger/default-logger.ts:89

**Parameters:**

Name | Type |
------ | ------ |
`msg` | string |
`data?` | any |

**Returns:** *void*

___

###  fatal

▸ **fatal**(`msg`: string, `data?`: any): *void*

*Implementation of [LoggerInterface](../interfaces/_src_app_core_logger_logger_interface_.loggerinterface.md)*

Defined in src/app/core/logger/default-logger.ts:93

**Parameters:**

Name | Type |
------ | ------ |
`msg` | string |
`data?` | any |

**Returns:** *void*

___

###  info

▸ **info**(`msg`: string, `data?`: any): *void*

*Implementation of [LoggerInterface](../interfaces/_src_app_core_logger_logger_interface_.loggerinterface.md)*

Defined in src/app/core/logger/default-logger.ts:97

**Parameters:**

Name | Type |
------ | ------ |
`msg` | string |
`data?` | any |

**Returns:** *void*

___

### `Private` log

▸ **log**(`level`: [LoggerLevel](../enums/_src_app_core_logger_logger_level_.loggerlevel.md), `log`: [LoggerData](../interfaces/_src_app_core_logger_logger_data_.loggerdata.md)): *void*

Defined in src/app/core/logger/default-logger.ts:44

Outputs the message to the web console

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`level` | [LoggerLevel](../enums/_src_app_core_logger_logger_level_.loggerlevel.md) | log level |
`log` | [LoggerData](../interfaces/_src_app_core_logger_logger_data_.loggerdata.md) | log message  |

**Returns:** *void*

___

###  logLevel

▸ **logLevel**(`level`: string): *void*

*Implementation of [LoggerInterface](../interfaces/_src_app_core_logger_logger_interface_.loggerinterface.md)*

Defined in src/app/core/logger/default-logger.ts:23

**Parameters:**

Name | Type |
------ | ------ |
`level` | string |

**Returns:** *void*

___

###  state

▸ **state**(`state`: boolean): *void*

*Implementation of [LoggerInterface](../interfaces/_src_app_core_logger_logger_interface_.loggerinterface.md)*

Defined in src/app/core/logger/default-logger.ts:32

**Parameters:**

Name | Type |
------ | ------ |
`state` | boolean |

**Returns:** *void*

___

###  status

▸ **status**(): *boolean*

*Implementation of [LoggerInterface](../interfaces/_src_app_core_logger_logger_interface_.loggerinterface.md)*

Defined in src/app/core/logger/default-logger.ts:19

**Returns:** *boolean*

___

###  trace

▸ **trace**(`msg`: string, `data?`: any): *void*

*Implementation of [LoggerInterface](../interfaces/_src_app_core_logger_logger_interface_.loggerinterface.md)*

Defined in src/app/core/logger/default-logger.ts:102

**Parameters:**

Name | Type |
------ | ------ |
`msg` | string |
`data?` | any |

**Returns:** *void*

___

###  warn

▸ **warn**(`msg`: string, `data?`: any): *void*

*Implementation of [LoggerInterface](../interfaces/_src_app_core_logger_logger_interface_.loggerinterface.md)*

Defined in src/app/core/logger/default-logger.ts:106

**Parameters:**

Name | Type |
------ | ------ |
`msg` | string |
`data?` | any |

**Returns:** *void*
