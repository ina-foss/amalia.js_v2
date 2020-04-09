[Amalia](../README.md) › [Globals](../globals.md) › ["app/core/shortcut/shortcut-manager"](../modules/_app_core_shortcut_shortcut_manager_.md) › [ShortcutManager](_app_core_shortcut_shortcut_manager_.shortcutmanager.md)

# Class: ShortcutManager

In charge to handle amalia shortcut

## Hierarchy

* **ShortcutManager**

## Index

### Constructors

* [constructor](_app_core_shortcut_shortcut_manager_.shortcutmanager.md#constructor)

### Properties

* [configurationManager](_app_core_shortcut_shortcut_manager_.shortcutmanager.md#private-configurationmanager)
* [listOfShortcut](_app_core_shortcut_shortcut_manager_.shortcutmanager.md#private-listofshortcut)
* [logger](_app_core_shortcut_shortcut_manager_.shortcutmanager.md#private-logger)

### Methods

* [addShortcut](_app_core_shortcut_shortcut_manager_.shortcutmanager.md#addshortcut)
* [getListOfShortcutKeys](_app_core_shortcut_shortcut_manager_.shortcutmanager.md#getlistofshortcutkeys)
* [removeShortcut](_app_core_shortcut_shortcut_manager_.shortcutmanager.md#removeshortcut)

## Constructors

###  constructor

\+ **new ShortcutManager**(`configurationManager`: [ConfigurationManager](_app_core_config_configuration_manager_.configurationmanager.md), `logger`: [LoggerInterface](../interfaces/_app_core_logger_logger_interface_.loggerinterface.md)): *[ShortcutManager](_app_core_shortcut_shortcut_manager_.shortcutmanager.md)*

Defined in src/app/core/shortcut/shortcut-manager.ts:11

**Parameters:**

Name | Type |
------ | ------ |
`configurationManager` | [ConfigurationManager](_app_core_config_configuration_manager_.configurationmanager.md) |
`logger` | [LoggerInterface](../interfaces/_app_core_logger_logger_interface_.loggerinterface.md) |

**Returns:** *[ShortcutManager](_app_core_shortcut_shortcut_manager_.shortcutmanager.md)*

## Properties

### `Private` configurationManager

• **configurationManager**: *[ConfigurationManager](_app_core_config_configuration_manager_.configurationmanager.md)*

Defined in src/app/core/shortcut/shortcut-manager.ts:9

___

### `Private` listOfShortcut

• **listOfShortcut**: *Map‹string, Promise‹any›[]›* = new Map<string, Array<Promise<any>>>()

Defined in src/app/core/shortcut/shortcut-manager.ts:11

___

### `Private` logger

• **logger**: *[LoggerInterface](../interfaces/_app_core_logger_logger_interface_.loggerinterface.md)*

Defined in src/app/core/shortcut/shortcut-manager.ts:10

## Methods

###  addShortcut

▸ **addShortcut**(`key`: string, `promise`: Promise‹void›): *void*

Defined in src/app/core/shortcut/shortcut-manager.ts:31

In charge to add shortcut

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | string | shortcut key |
`promise` | Promise‹void› | called when shortcut called  |

**Returns:** *void*

___

###  getListOfShortcutKeys

▸ **getListOfShortcutKeys**(): *IterableIterator‹string›*

Defined in src/app/core/shortcut/shortcut-manager.ts:21

Return all shortcut with promise

**Returns:** *IterableIterator‹string›*

___

###  removeShortcut

▸ **removeShortcut**(`key`: string, `promise`: Promise‹void›): *void*

Defined in src/app/core/shortcut/shortcut-manager.ts:44

In charge to add shortcut

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | string | shortcut key |
`promise` | Promise‹void› | called when shortcut called  |

**Returns:** *void*
