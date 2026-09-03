[Amalia](../README.md) › [Globals](../globals.md) › ["src/app/core/shortcut/shortcut-manager"](../modules/_src_app_core_shortcut_shortcut_manager_.md) › [ShortcutManager](_src_app_core_shortcut_shortcut_manager_.shortcutmanager.md)

# Class: ShortcutManager

In charge to handle amalia shortcut

## Hierarchy

* **ShortcutManager**

## Index

### Constructors

* [constructor](_src_app_core_shortcut_shortcut_manager_.shortcutmanager.md#constructor)

### Properties

* [codes](_src_app_core_shortcut_shortcut_manager_.shortcutmanager.md#codes)
* [configurationManager](_src_app_core_shortcut_shortcut_manager_.shortcutmanager.md#private-configurationmanager)
* [isAppleBrowser](_src_app_core_shortcut_shortcut_manager_.shortcutmanager.md#isapplebrowser)
* [listOfShortcut](_src_app_core_shortcut_shortcut_manager_.shortcutmanager.md#private-listofshortcut)
* [logger](_src_app_core_shortcut_shortcut_manager_.shortcutmanager.md#private-logger)

### Methods

* [addShortcut](_src_app_core_shortcut_shortcut_manager_.shortcutmanager.md#addshortcut)
* [disableListener](_src_app_core_shortcut_shortcut_manager_.shortcutmanager.md#disablelistener)
* [enableListener](_src_app_core_shortcut_shortcut_manager_.shortcutmanager.md#enablelistener)
* [getListOfShortcutKeys](_src_app_core_shortcut_shortcut_manager_.shortcutmanager.md#getlistofshortcutkeys)
* [handleEvent](_src_app_core_shortcut_shortcut_manager_.shortcutmanager.md#handleevent)
* [isEventMatches](_src_app_core_shortcut_shortcut_manager_.shortcutmanager.md#iseventmatches)
* [isValidKeyName](_src_app_core_shortcut_shortcut_manager_.shortcutmanager.md#isvalidkeyname)
* [nameToCode](_src_app_core_shortcut_shortcut_manager_.shortcutmanager.md#private-nametocode)
* [normaliseKeyName](_src_app_core_shortcut_shortcut_manager_.shortcutmanager.md#private-normalisekeyname)
* [parseShortcut](_src_app_core_shortcut_shortcut_manager_.shortcutmanager.md#private-parseshortcut)
* [removeShortcut](_src_app_core_shortcut_shortcut_manager_.shortcutmanager.md#removeshortcut)

### Object literals

* [aliases](_src_app_core_shortcut_shortcut_manager_.shortcutmanager.md#aliases)

## Constructors

###  constructor

\+ **new ShortcutManager**(`configurationManager`: [ConfigurationManager](_src_app_core_config_configuration_manager_.configurationmanager.md), `logger`: [LoggerInterface](../interfaces/_src_app_core_logger_logger_interface_.loggerinterface.md)): *[ShortcutManager](_src_app_core_shortcut_shortcut_manager_.shortcutmanager.md)*

Defined in src/app/core/shortcut/shortcut-manager.ts:46

**Parameters:**

Name | Type |
------ | ------ |
`configurationManager` | [ConfigurationManager](_src_app_core_config_configuration_manager_.configurationmanager.md) |
`logger` | [LoggerInterface](../interfaces/_src_app_core_logger_logger_interface_.loggerinterface.md) |

**Returns:** *[ShortcutManager](_src_app_core_shortcut_shortcut_manager_.shortcutmanager.md)*

## Properties

###  codes

• **codes**: *[number, string][]* = [
        [8, 'backspace'],
        [9, 'tab'],
        [13, 'enter'],
        [16, 'shift'],
        [17, 'ctrl'],
        [18, 'alt'],
        [20, 'capslock'],
        [27, 'esc'],
        [32, 'space'],
        [33, 'pageup'],
        [34, 'pagedown'],
        [35, 'end'],
        [36, 'home'],
        [37, 'left'],
        [38, 'up'],
        [39, 'right'],
        [40, 'down'],
        [45, 'ins'],
        [46, 'del'],
        [91, 'meta'],
        [93, 'meta'],
        [224, 'meta']
    ]

Defined in src/app/core/shortcut/shortcut-manager.ts:23

___

### `Private` configurationManager

• **configurationManager**: *[ConfigurationManager](_src_app_core_config_configuration_manager_.configurationmanager.md)*

Defined in src/app/core/shortcut/shortcut-manager.ts:10

___

###  isAppleBrowser

• **isAppleBrowser**: *boolean* = /Mac|iPod|iPhone|iPad/.test(navigator.platform)

Defined in src/app/core/shortcut/shortcut-manager.ts:13

___

### `Private` listOfShortcut

• **listOfShortcut**: *Map‹string, Promise‹any›[]›* = new Map<string, Array<Promise<any>>>()

Defined in src/app/core/shortcut/shortcut-manager.ts:12

___

### `Private` logger

• **logger**: *[LoggerInterface](../interfaces/_src_app_core_logger_logger_interface_.loggerinterface.md)*

Defined in src/app/core/shortcut/shortcut-manager.ts:11

## Methods

###  addShortcut

▸ **addShortcut**(`key`: string, `promise`: Promise‹void›): *void*

Defined in src/app/core/shortcut/shortcut-manager.ts:176

In charge to add shortcut

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | string | shortcut key |
`promise` | Promise‹void› | called when shortcut called  |

**Returns:** *void*

___

###  disableListener

▸ **disableListener**(): *void*

Defined in src/app/core/shortcut/shortcut-manager.ts:67

Disable listener

**Returns:** *void*

___

###  enableListener

▸ **enableListener**(): *void*

Defined in src/app/core/shortcut/shortcut-manager.ts:60

Enable listener

**Returns:** *void*

___

###  getListOfShortcutKeys

▸ **getListOfShortcutKeys**(): *IterableIterator‹string›*

Defined in src/app/core/shortcut/shortcut-manager.ts:166

Return all shortcut with promise

**Returns:** *IterableIterator‹string›*

___

###  handleEvent

▸ **handleEvent**(`event`: KeyboardEvent): *void*

Defined in src/app/core/shortcut/shortcut-manager.ts:75

Handle keyboard event

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`event` | KeyboardEvent | event  |

**Returns:** *void*

___

###  isEventMatches

▸ **isEventMatches**(`shortcut`: string, `event`: KeyboardEvent): *boolean*

Defined in src/app/core/shortcut/shortcut-manager.ts:84

**Parameters:**

Name | Type |
------ | ------ |
`shortcut` | string |
`event` | KeyboardEvent |

**Returns:** *boolean*

___

###  isValidKeyName

▸ **isValidKeyName**(`name`: string): *boolean*

Defined in src/app/core/shortcut/shortcut-manager.ts:138

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |

**Returns:** *boolean*

___

### `Private` nameToCode

▸ **nameToCode**(`name`: string): *number*

Defined in src/app/core/shortcut/shortcut-manager.ts:148

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |

**Returns:** *number*

___

### `Private` normaliseKeyName

▸ **normaliseKeyName**(`name`: string): *string*

Defined in src/app/core/shortcut/shortcut-manager.ts:159

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |

**Returns:** *string*

___

### `Private` parseShortcut

▸ **parseShortcut**(`keys`: string): *[Shortcut](../interfaces/_src_app_core_shortcut_shortcut_.shortcut.md)*

Defined in src/app/core/shortcut/shortcut-manager.ts:101

**Parameters:**

Name | Type |
------ | ------ |
`keys` | string |

**Returns:** *[Shortcut](../interfaces/_src_app_core_shortcut_shortcut_.shortcut.md)*

___

###  removeShortcut

▸ **removeShortcut**(`key`: string, `promise`: Promise‹void›): *void*

Defined in src/app/core/shortcut/shortcut-manager.ts:189

In charge to add shortcut

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | string | shortcut key |
`promise` | Promise‹void› | called when shortcut called  |

**Returns:** *void*

## Object literals

###  aliases

### ▪ **aliases**: *object*

Defined in src/app/core/shortcut/shortcut-manager.ts:14

###  command

• **command**: *string* = "meta"

Defined in src/app/core/shortcut/shortcut-manager.ts:16

###  escape

• **escape**: *string* = "esc"

Defined in src/app/core/shortcut/shortcut-manager.ts:18

###  mod

• **mod**: *string* = this.isAppleBrowser ? 'meta' : 'ctrl'

Defined in src/app/core/shortcut/shortcut-manager.ts:20

###  option

• **option**: *string* = "alt"

Defined in src/app/core/shortcut/shortcut-manager.ts:15

###  plus

• **plus**: *string* = "+"

Defined in src/app/core/shortcut/shortcut-manager.ts:19

###  return

• **return**: *string* = "enter"

Defined in src/app/core/shortcut/shortcut-manager.ts:17
