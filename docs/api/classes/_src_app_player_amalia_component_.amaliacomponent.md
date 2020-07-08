[Amalia](../README.md) › [Globals](../globals.md) › ["src/app/player/amalia.component"](../modules/_src_app_player_amalia_component_.md) › [AmaliaComponent](_src_app_player_amalia_component_.amaliacomponent.md)

# Class: AmaliaComponent

## Hierarchy

* **AmaliaComponent**

## Implements

* OnInit

## Index

### Constructors

* [constructor](_src_app_player_amalia_component_.amaliacomponent.md#constructor)

### Properties

* [PlayerState](_src_app_player_amalia_component_.amaliacomponent.md#playerstate)
* [_config](_src_app_player_amalia_component_.amaliacomponent.md#private-_config)
* [aspectRatio](_src_app_player_amalia_component_.amaliacomponent.md#aspectratio)
* [autoplay](_src_app_player_amalia_component_.amaliacomponent.md#autoplay)
* [callback](_src_app_player_amalia_component_.amaliacomponent.md#callback)
* [configLoader](_src_app_player_amalia_component_.amaliacomponent.md#configloader)
* [contextMenu](_src_app_player_amalia_component_.amaliacomponent.md#contextmenu)
* [contextMenuState](_src_app_player_amalia_component_.amaliacomponent.md#contextmenustate)
* [enablePreviewThumbnail](_src_app_player_amalia_component_.amaliacomponent.md#enablepreviewthumbnail)
* [enableThumbnail](_src_app_player_amalia_component_.amaliacomponent.md#private-enablethumbnail)
* [httpClient](_src_app_player_amalia_component_.amaliacomponent.md#private-httpclient)
* [inError](_src_app_player_amalia_component_.amaliacomponent.md#inerror)
* [inLoading](_src_app_player_amalia_component_.amaliacomponent.md#inloading)
* [initApi](_src_app_player_amalia_component_.amaliacomponent.md#initapi)
* [logger](_src_app_player_amalia_component_.amaliacomponent.md#logger)
* [mediaContainer](_src_app_player_amalia_component_.amaliacomponent.md#mediacontainer)
* [mediaPlayer](_src_app_player_amalia_component_.amaliacomponent.md#mediaplayer)
* [mediaPlayerElement](_src_app_player_amalia_component_.amaliacomponent.md#private-mediaplayerelement)
* [metadataConverter](_src_app_player_amalia_component_.amaliacomponent.md#metadataconverter)
* [metadataLoader](_src_app_player_amalia_component_.amaliacomponent.md#metadataloader)
* [pinned](_src_app_player_amalia_component_.amaliacomponent.md#pinned)
* [playerConfig](_src_app_player_amalia_component_.amaliacomponent.md#playerconfig)
* [playerId](_src_app_player_amalia_component_.amaliacomponent.md#playerid)
* [playerService](_src_app_player_amalia_component_.amaliacomponent.md#playerservice)
* [previewThumbnailElement](_src_app_player_amalia_component_.amaliacomponent.md#previewthumbnailelement)
* [previewThumbnailUrl](_src_app_player_amalia_component_.amaliacomponent.md#previewthumbnailurl)
* [ratio](_src_app_player_amalia_component_.amaliacomponent.md#ratio)
* [state](_src_app_player_amalia_component_.amaliacomponent.md#state)
* [version](_src_app_player_amalia_component_.amaliacomponent.md#version)

### Accessors

* [config](_src_app_player_amalia_component_.amaliacomponent.md#config)

### Methods

* [bindEvents](_src_app_player_amalia_component_.amaliacomponent.md#private-bindevents)
* [displayControlBar](_src_app_player_amalia_component_.amaliacomponent.md#displaycontrolbar)
* [handleAspectRatioChange](_src_app_player_amalia_component_.amaliacomponent.md#private-handleaspectratiochange)
* [handleError](_src_app_player_amalia_component_.amaliacomponent.md#private-handleerror)
* [handleFullScreenChange](_src_app_player_amalia_component_.amaliacomponent.md#handlefullscreenchange)
* [handlePinnedControlbarChange](_src_app_player_amalia_component_.amaliacomponent.md#handlepinnedcontrolbarchange)
* [handleSeeked](_src_app_player_amalia_component_.amaliacomponent.md#private-handleseeked)
* [handleSeeking](_src_app_player_amalia_component_.amaliacomponent.md#private-handleseeking)
* [handleWindowResize](_src_app_player_amalia_component_.amaliacomponent.md#private-handlewindowresize)
* [initDefaultHandlers](_src_app_player_amalia_component_.amaliacomponent.md#private-initdefaulthandlers)
* [ngOnInit](_src_app_player_amalia_component_.amaliacomponent.md#ngoninit)
* [onContextMenu](_src_app_player_amalia_component_.amaliacomponent.md#oncontextmenu)
* [onErrorInitConfig](_src_app_player_amalia_component_.amaliacomponent.md#private-onerrorinitconfig)
* [onInitConfig](_src_app_player_amalia_component_.amaliacomponent.md#private-oninitconfig)
* [setPreviewThumbnail](_src_app_player_amalia_component_.amaliacomponent.md#private-setpreviewthumbnail)
* [updatePlayerSizeWithAspectRatio](_src_app_player_amalia_component_.amaliacomponent.md#private-updateplayersizewithaspectratio)

## Constructors

###  constructor

\+ **new AmaliaComponent**(`playerService`: [MediaPlayerService](_src_app_service_media_player_service_.mediaplayerservice.md), `httpClient`: HttpClient): *[AmaliaComponent](_src_app_player_amalia_component_.amaliacomponent.md)*

Defined in src/app/player/amalia.component.ts:187

**Parameters:**

Name | Type |
------ | ------ |
`playerService` | [MediaPlayerService](_src_app_service_media_player_service_.mediaplayerservice.md) |
`httpClient` | HttpClient |

**Returns:** *[AmaliaComponent](_src_app_player_amalia_component_.amaliacomponent.md)*

## Properties

###  PlayerState

• **PlayerState**: *[PlayerState](../enums/_src_app_core_constant_player_state_.playerstate.md)* = PlayerState

Defined in src/app/player/amalia.component.ts:52

player state 4by3

___

### `Private` _config

• **_config**: *any*

Defined in src/app/player/amalia.component.ts:89

___

###  aspectRatio

• **aspectRatio**: *any*

Defined in src/app/player/amalia.component.ts:42

Selected aspectRatio

___

###  autoplay

• **autoplay**: *boolean*

Defined in src/app/player/amalia.component.ts:82

Set player autoplay state

___

###  callback

• **callback**: *EventEmitter‹any›* = new EventEmitter<any>()

Defined in src/app/player/amalia.component.ts:129

Amalia events

___

###  configLoader

• **configLoader**: *[Loader](../interfaces/_src_app_core_loader_loader_.loader.md)‹[ConfigData](../interfaces/_src_app_core_config_model_config_data_.configdata.md)›*

Defined in src/app/player/amalia.component.ts:111

Config loader in charge to load config data

___

###  contextMenu

• **contextMenu**: *ElementRef‹HTMLElement›*

Defined in src/app/player/amalia.component.ts:141

Get context menu html element

___

###  contextMenuState

• **contextMenuState**: *boolean*

Defined in src/app/player/amalia.component.ts:47

True for shown context menu

___

###  enablePreviewThumbnail

• **enablePreviewThumbnail**: *boolean* = false

Defined in src/app/player/amalia.component.ts:62

In charge to show preview thumbnail

___

### `Private` enableThumbnail

• **enableThumbnail**: *boolean*

Defined in src/app/player/amalia.component.ts:87

Enable thumbnail

___

### `Private` httpClient

• **httpClient**: *HttpClient*

Defined in src/app/player/amalia.component.ts:172

In charge to load resource

___

###  inError

• **inError**: *boolean* = false

Defined in src/app/player/amalia.component.ts:151

true when player load content

___

###  inLoading

• **inLoading**: *boolean* = false

Defined in src/app/player/amalia.component.ts:146

true when player load content

___

###  initApi

• **initApi**: *EventEmitter‹[MediaPlayerElement](_src_app_core_media_player_element_.mediaplayerelement.md)›* = new EventEmitter<MediaPlayerElement>()

Defined in src/app/player/amalia.component.ts:182

Return player interface

___

###  logger

• **logger**: *[DefaultLogger](_src_app_core_logger_default_logger_.defaultlogger.md)‹›* = new DefaultLogger()

Defined in src/app/player/amalia.component.ts:156

Default loader

___

###  mediaContainer

• **mediaContainer**: *ElementRef‹HTMLElement›*

Defined in src/app/player/amalia.component.ts:177

mediaContainer element

___

###  mediaPlayer

• **mediaPlayer**: *ElementRef‹HTMLVideoElement›*

Defined in src/app/player/amalia.component.ts:135

get video html element

___

### `Private` mediaPlayerElement

• **mediaPlayerElement**: *[MediaPlayerElement](_src_app_core_media_player_element_.mediaplayerelement.md)*

Defined in src/app/player/amalia.component.ts:187

Amalia player main manager

___

###  metadataConverter

• **metadataConverter**: *[Converter](../interfaces/_src_app_core_converter_converter_.converter.md)‹Metadata›*

Defined in src/app/player/amalia.component.ts:117

Metadata converter, converter metadata parameter

___

###  metadataLoader

• **metadataLoader**: *[Loader](../interfaces/_src_app_core_loader_loader_.loader.md)‹Array‹Metadata››*

Defined in src/app/player/amalia.component.ts:123

Metadata loader

___

###  pinned

• **pinned**: *boolean* = false

Defined in src/app/player/amalia.component.ts:168

Pinned ControlBar state

___

###  playerConfig

• **playerConfig**: *[ConfigData](../interfaces/_src_app_core_config_model_config_data_.configdata.md)*

Defined in src/app/player/amalia.component.ts:57

Player configuration

___

###  playerId

• **playerId**: *string* = BaseUtils.getUniqueId()

Defined in src/app/player/amalia.component.ts:72

Generate player base id

___

###  playerService

• **playerService**: *[MediaPlayerService](_src_app_service_media_player_service_.mediaplayerservice.md)*

Defined in src/app/player/amalia.component.ts:164

In charge to get instance of player

___

###  previewThumbnailElement

• **previewThumbnailElement**: *ElementRef‹HTMLVideoElement›*

Defined in src/app/player/amalia.component.ts:77

Preview thumbnail container

___

###  previewThumbnailUrl

• **previewThumbnailUrl**: *string* = ""

Defined in src/app/player/amalia.component.ts:66

preview thumbnail url

___

###  ratio

• **ratio**: *string* = "16-9"

Defined in src/app/player/amalia.component.ts:160

default aspect ratio

___

###  state

• **state**: *[PlayerState](../enums/_src_app_core_constant_player_state_.playerstate.md)*

Defined in src/app/player/amalia.component.ts:37

player state

___

###  version

• **version**: *string* = environment.VERSION

Defined in src/app/player/amalia.component.ts:32

version of player

## Accessors

###  config

• **get config**(): *any*

Defined in src/app/player/amalia.component.ts:91

**Returns:** *any*

• **set config**(`value`: any): *void*

Defined in src/app/player/amalia.component.ts:96

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *void*

## Methods

### `Private` bindEvents

▸ **bindEvents**(): *void*

Defined in src/app/player/amalia.component.ts:289

In charge to bin events

**Returns:** *void*

___

###  displayControlBar

▸ **displayControlBar**(`_displayControlBar`: boolean): *void*

Defined in src/app/player/amalia.component.ts:398

Invoked on mouseenter and mouseleave events

**Parameters:**

Name | Type |
------ | ------ |
`_displayControlBar` | boolean |

**Returns:** *void*

___

### `Private` handleAspectRatioChange

▸ **handleAspectRatioChange**(`event`: any): *void*

Defined in src/app/player/amalia.component.ts:333

Invoked on aspect ratio change

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`event` | any | aspect ratio  |

**Returns:** *void*

___

### `Private` handleError

▸ **handleError**(`event`: any): *void*

Defined in src/app/player/amalia.component.ts:323

Invoked when error event

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`event` | any | error type  |

**Returns:** *void*

___

###  handleFullScreenChange

▸ **handleFullScreenChange**(): *void*

Defined in src/app/player/amalia.component.ts:410

Invoked on fullscreen change

**Returns:** *void*

___

###  handlePinnedControlbarChange

▸ **handlePinnedControlbarChange**(`event`: any): *void*

Defined in src/app/player/amalia.component.ts:299

**Parameters:**

Name | Type |
------ | ------ |
`event` | any |

**Returns:** *void*

___

### `Private` handleSeeked

▸ **handleSeeked**(): *void*

Defined in src/app/player/amalia.component.ts:311

**Returns:** *void*

___

### `Private` handleSeeking

▸ **handleSeeking**(`tc`: number): *void*

Defined in src/app/player/amalia.component.ts:303

**Parameters:**

Name | Type |
------ | ------ |
`tc` | number |

**Returns:** *void*

___

### `Private` handleWindowResize

▸ **handleWindowResize**(): *void*

Defined in src/app/player/amalia.component.ts:225

update mediaPlayerWidth on window resize

**Returns:** *void*

___

### `Private` initDefaultHandlers

▸ **initDefaultHandlers**(): *void*

Defined in src/app/player/amalia.component.ts:342

In charge to init default handlers when input not specified

**Returns:** *void*

___

###  ngOnInit

▸ **ngOnInit**(): *void*

Defined in src/app/player/amalia.component.ts:197

Invoked immediately after the  first time the component has initialised

**Returns:** *void*

___

###  onContextMenu

▸ **onContextMenu**(`event`: MouseEvent): *boolean*

Defined in src/app/player/amalia.component.ts:235

Invoked on click context menu

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`event` | MouseEvent | mouse event |

**Returns:** *boolean*

return false for disable browser context menu

___

### `Private` onErrorInitConfig

▸ **onErrorInitConfig**(`state`: [PlayerState](../enums/_src_app_core_constant_player_state_.playerstate.md)): *void*

Defined in src/app/player/amalia.component.ts:388

Invoked on error to init config

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`state` | [PlayerState](../enums/_src_app_core_constant_player_state_.playerstate.md) | player init state  |

**Returns:** *void*

___

### `Private` onInitConfig

▸ **onInitConfig**(`state`: [PlayerState](../enums/_src_app_core_constant_player_state_.playerstate.md)): *void*

Defined in src/app/player/amalia.component.ts:375

Invoked on  init config

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`state` | [PlayerState](../enums/_src_app_core_constant_player_state_.playerstate.md) | player init state  |

**Returns:** *void*

___

### `Private` setPreviewThumbnail

▸ **setPreviewThumbnail**(`tc`: number): *void*

Defined in src/app/player/amalia.component.ts:365

In charge to update thumbnail

**Parameters:**

Name | Type |
------ | ------ |
`tc` | number |

**Returns:** *void*

___

### `Private` updatePlayerSizeWithAspectRatio

▸ **updatePlayerSizeWithAspectRatio**(): *void*

Defined in src/app/player/amalia.component.ts:247

In charge to update player size with aspect ratio

**Returns:** *void*
