[Amalia](../README.md) › [Globals](../globals.md) › ["src/app/core/logger/logger-interface"](../modules/_src_app_core_logger_logger_interface_.md) › [LoggerInterface](_src_app_core_logger_logger_interface_.loggerinterface.md)

# Interface: LoggerInterface

Logger interface

## Hierarchy

* **LoggerInterface**

## Implemented by

* [DefaultLogger](../classes/_src_app_core_logger_default_logger_.defaultlogger.md)

## Index

### Methods

* [debug](_src_app_core_logger_logger_interface_.loggerinterface.md#debug)
* [error](_src_app_core_logger_logger_interface_.loggerinterface.md#error)
* [fatal](_src_app_core_logger_logger_interface_.loggerinterface.md#fatal)
* [info](_src_app_core_logger_logger_interface_.loggerinterface.md#info)
* [logLevel](_src_app_core_logger_logger_interface_.loggerinterface.md#loglevel)
* [state](_src_app_core_logger_logger_interface_.loggerinterface.md#state)
* [trace](_src_app_core_logger_logger_interface_.loggerinterface.md#trace)
* [warn](_src_app_core_logger_logger_interface_.loggerinterface.md#warn)

## Methods

###  debug

▸ **debug**(`msg`: string, `data?`: any): *void*

Defined in src/app/core/logger/logger-interface.ts:28

In charge to call Log with log type

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`msg` | string | message |
`data?` | any | log data  |

**Returns:** *void*

___

###  error

▸ **error**(`msg`: string, `data?`: any): *void*

Defined in src/app/core/logger/logger-interface.ts:49

In charge to call Log with log type

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`msg` | string | message |
`data?` | any | log data  |

**Returns:** *void*

___

###  fatal

▸ **fatal**(`msg`: string, `data?`: any): *void*

Defined in src/app/core/logger/logger-interface.ts:56

In charge to call Log with log type

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`msg` | string | message |
`data?` | any | log data  |

**Returns:** *void*

___

###  info

▸ **info**(`msg`: string, `data?`: any): *void*

Defined in src/app/core/logger/logger-interface.ts:35

In charge to call Log with log type

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`msg` | string | message |
`data?` | any | log data  |

**Returns:** *void*

___

###  logLevel

▸ **logLevel**(`level`: string): *void*

Defined in src/app/core/logger/logger-interface.ts:9

Set log level

**Parameters:**

Name | Type |
------ | ------ |
`level` | string |

**Returns:** *void*

___

###  state

▸ **state**(`state`: boolean): *any*

Defined in src/app/core/logger/logger-interface.ts:14

Set log state

**Parameters:**

Name | Type |
------ | ------ |
`state` | boolean |

**Returns:** *any*

___

###  trace

▸ **trace**(`msg`: string, `data?`: any): *void*

Defined in src/app/core/logger/logger-interface.ts:21

In charge to call Log with log type

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`msg` | string | message |
`data?` | any | log data  |

**Returns:** *void*

___

###  warn

▸ **warn**(`msg`: string, `data?`: any): *void*

Defined in src/app/core/logger/logger-interface.ts:42

In charge to call Log with log type

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`msg` | string | message |
`data?` | any | log data  |

**Returns:** *void*
