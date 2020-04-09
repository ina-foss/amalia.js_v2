[Amalia](../README.md) › [Globals](../globals.md) › ["app/player/amalia.component"](../modules/_app_player_amalia_component_.md) › [AmaliaComponent](_app_player_amalia_component_.amaliacomponent.md)

# Class: AmaliaComponent

## Hierarchy

* **AmaliaComponent**

## Implements

* OnInit

## Index

### Constructors

* [constructor](_app_player_amalia_component_.amaliacomponent.md#constructor)

### Properties

* [PlayerState](_app_player_amalia_component_.amaliacomponent.md#playerstate)
* [_config](_app_player_amalia_component_.amaliacomponent.md#private-_config)
* [amaliaEvent](_app_player_amalia_component_.amaliacomponent.md#amaliaevent)
* [aspectRatio](_app_player_amalia_component_.amaliacomponent.md#aspectratio)
* [configLoader](_app_player_amalia_component_.amaliacomponent.md#configloader)
* [contextMenu](_app_player_amalia_component_.amaliacomponent.md#contextmenu)
* [contextMenuState](_app_player_amalia_component_.amaliacomponent.md#contextmenustate)
* [enablePreviewThumbnail](_app_player_amalia_component_.amaliacomponent.md#enablepreviewthumbnail)
* [httpClient](_app_player_amalia_component_.amaliacomponent.md#private-httpclient)
* [inError](_app_player_amalia_component_.amaliacomponent.md#inerror)
* [inLoading](_app_player_amalia_component_.amaliacomponent.md#inloading)
* [logger](_app_player_amalia_component_.amaliacomponent.md#logger)
* [mediaPlayer](_app_player_amalia_component_.amaliacomponent.md#mediaplayer)
* [mediaPlayerElement](_app_player_amalia_component_.amaliacomponent.md#private-mediaplayerelement)
* [metadataConverter](_app_player_amalia_component_.amaliacomponent.md#metadataconverter)
* [metadataLoader](_app_player_amalia_component_.amaliacomponent.md#metadataloader)
* [playerConfig](_app_player_amalia_component_.amaliacomponent.md#playerconfig)
* [playerId](_app_player_amalia_component_.amaliacomponent.md#playerid)
* [playerService](_app_player_amalia_component_.amaliacomponent.md#playerservice)
* [previewThumbnailElement](_app_player_amalia_component_.amaliacomponent.md#previewthumbnailelement)
* [previewThumbnailUrl](_app_player_amalia_component_.amaliacomponent.md#previewthumbnailurl)
* [state](_app_player_amalia_component_.amaliacomponent.md#state)
* [version](_app_player_amalia_component_.amaliacomponent.md#version)

### Accessors

* [config](_app_player_amalia_component_.amaliacomponent.md#config)

### Methods

* [bindEvents](_app_player_amalia_component_.amaliacomponent.md#private-bindevents)
* [displayControlBar](_app_player_amalia_component_.amaliacomponent.md#displaycontrolbar)
* [handleAspectRatioChange](_app_player_amalia_component_.amaliacomponent.md#private-handleaspectratiochange)
* [handleError](_app_player_amalia_component_.amaliacomponent.md#private-handleerror)
* [handleSeeked](_app_player_amalia_component_.amaliacomponent.md#private-handleseeked)
* [handleSeeking](_app_player_amalia_component_.amaliacomponent.md#private-handleseeking)
* [initDefaultHandlers](_app_player_amalia_component_.amaliacomponent.md#private-initdefaulthandlers)
* [ngOnInit](_app_player_amalia_component_.amaliacomponent.md#ngoninit)
* [onContextMenu](_app_player_amalia_component_.amaliacomponent.md#oncontextmenu)
* [onErrorInitConfig](_app_player_amalia_component_.amaliacomponent.md#private-onerrorinitconfig)
* [onInitConfig](_app_player_amalia_component_.amaliacomponent.md#private-oninitconfig)
* [setPreviewThumbnail](_app_player_amalia_component_.amaliacomponent.md#private-setpreviewthumbnail)
* [updatePlayerSizeWithAspectRatio](_app_player_amalia_component_.amaliacomponent.md#private-updateplayersizewithaspectratio)

## Constructors

###  constructor

\+ **new AmaliaComponent**(`playerService`: [MediaPlayerService](_app_service_media_player_service_.mediaplayerservice.md), `httpClient`: HttpClient): *[AmaliaComponent](_app_player_amalia_component_.amaliacomponent.md)*

Defined in src/app/player/amalia.component.ts:160

**Parameters:**

Name | Type |
------ | ------ |
`playerService` | [MediaPlayerService](_app_service_media_player_service_.mediaplayerservice.md) |
`httpClient` | HttpClient |

**Returns:** *[AmaliaComponent](_app_player_amalia_component_.amaliacomponent.md)*

## Properties

###  PlayerState

• **PlayerState**: *[PlayerState](../enums/_app_core_constant_player_state_.playerstate.md)* = PlayerState

Defined in src/app/player/amalia.component.ts:53

player state 4by3

___

### `Private` _config

• **_config**: *any*

Defined in src/app/player/amalia.component.ts:80

___

###  amaliaEvent

• **amaliaEvent**: *EventEmitter‹any›* = new EventEmitter()

Defined in src/app/player/amalia.component.ts:120

Amalia events

___

###  aspectRatio

• **aspectRatio**: *any*

Defined in src/app/player/amalia.component.ts:43

Selected aspectRatio

___

###  configLoader

• **configLoader**: *[Loader](../interfaces/_app_core_loader_loader_.loader.md)‹[ConfigData](../interfaces/_app_core_config_model_config_data_.configdata.md)›*

Defined in src/app/player/amalia.component.ts:102

Config loader in charge to load config data

___

###  contextMenu

• **contextMenu**: *ElementRef‹HTMLElement›*

Defined in src/app/player/amalia.component.ts:132

Get context menu html element

___

###  contextMenuState

• **contextMenuState**: *boolean*

Defined in src/app/player/amalia.component.ts:48

True for shown context menu

___

###  enablePreviewThumbnail

• **enablePreviewThumbnail**: *boolean* = false

Defined in src/app/player/amalia.component.ts:63

In charge to show preview thumbnail

___

### `Private` httpClient

• **httpClient**: *HttpClient*

Defined in src/app/player/amalia.component.ts:156

In charge to load resource

___

###  inError

• **inError**: *boolean* = false

Defined in src/app/player/amalia.component.ts:142

true when player load content

___

###  inLoading

• **inLoading**: *boolean* = false

Defined in src/app/player/amalia.component.ts:137

true when player load content

___

###  logger

• **logger**: *[DefaultLogger](_app_core_logger_default_logger_.defaultlogger.md)‹›* = new DefaultLogger()

Defined in src/app/player/amalia.component.ts:147

Default loader

___

###  mediaPlayer

• **mediaPlayer**: *ElementRef‹HTMLVideoElement›*

Defined in src/app/player/amalia.component.ts:126

get video html element

___

### `Private` mediaPlayerElement

• **mediaPlayerElement**: *[MediaPlayerElement](_app_core_media_player_element_.mediaplayerelement.md)*

Defined in src/app/player/amalia.component.ts:160

Amalia player main manager

___

###  metadataConverter

• **metadataConverter**: *[Converter](../interfaces/_app_core_converter_converter_.converter.md)‹Metadata›*

Defined in src/app/player/amalia.component.ts:108

Metadata converter, converter metadata parameter

___

###  metadataLoader

• **metadataLoader**: *[Loader](../interfaces/_app_core_loader_loader_.loader.md)‹Array‹Metadata››*

Defined in src/app/player/amalia.component.ts:114

Metadata loader

___

###  playerConfig

• **playerConfig**: *[ConfigData](../interfaces/_app_core_config_model_config_data_.configdata.md)*

Defined in src/app/player/amalia.component.ts:58

Player configuration

___

###  playerId

• **playerId**: *string* = BaseUtils.getUniqueId()

Defined in src/app/player/amalia.component.ts:73

Generate player base id

___

###  playerService

• **playerService**: *[MediaPlayerService](_app_service_media_player_service_.mediaplayerservice.md)*

Defined in src/app/player/amalia.component.ts:152

In charge to get instance of player

___

###  previewThumbnailElement

• **previewThumbnailElement**: *ElementRef‹HTMLVideoElement›*

Defined in src/app/player/amalia.component.ts:78

Preview thumbnail container

___

###  previewThumbnailUrl

• **previewThumbnailUrl**: *string* = null

Defined in src/app/player/amalia.component.ts:67

preview thumbnail url

___

###  state

• **state**: *[PlayerState](../enums/_app_core_constant_player_state_.playerstate.md)*

Defined in src/app/player/amalia.component.ts:38

player state

___

###  version

• **version**: *string* = environment.VERSION

Defined in src/app/player/amalia.component.ts:33

version of player

## Accessors

###  config

• **get config**(): *any*

Defined in src/app/player/amalia.component.ts:82

**Returns:** *any*

• **set config**(`value`: any): *void*

Defined in src/app/player/amalia.component.ts:87

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *void*

## Methods

### `Private` bindEvents

▸ **bindEvents**(): *void*

Defined in src/app/player/amalia.component.ts:251

In charge to bin events

**Returns:** *void*

___

###  displayControlBar

▸ **displayControlBar**(`_displayControlBar`: boolean): *void*

Defined in src/app/player/amalia.component.ts:345

Invoked on mouseenter and mouseleave events

**Parameters:**

Name | Type |
------ | ------ |
`_displayControlBar` | boolean |

**Returns:** *void*

___

### `Private` handleAspectRatioChange

▸ **handleAspectRatioChange**(`event`: any): *void*

Defined in src/app/player/amalia.component.ts:285

Invoked on aspect ratio change

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`event` | any | aspect ratio  |

**Returns:** *void*

___

### `Private` handleError

▸ **handleError**(`event`: any): *void*

Defined in src/app/player/amalia.component.ts:275

Invoked when error event

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`event` | any | error type  |

**Returns:** *void*

___

### `Private` handleSeeked

▸ **handleSeeked**(): *void*

Defined in src/app/player/amalia.component.ts:265

**Returns:** *void*

___

### `Private` handleSeeking

▸ **handleSeeking**(`tc`: number): *void*

Defined in src/app/player/amalia.component.ts:259

**Parameters:**

Name | Type |
------ | ------ |
`tc` | number |

**Returns:** *void*

___

### `Private` initDefaultHandlers

▸ **initDefaultHandlers**(): *void*

Defined in src/app/player/amalia.component.ts:294

In charge to init default handlers when input not specified

**Returns:** *void*

___

###  ngOnInit

▸ **ngOnInit**(): *void*

Defined in src/app/player/amalia.component.ts:171

setMediaPlayer
Invoked immediately after the  first time the component has initialised

**Returns:** *void*

___

###  onContextMenu

▸ **onContextMenu**(`event`: MouseEvent): *boolean*

Defined in src/app/player/amalia.component.ts:197

Invoked on click context menu

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`event` | MouseEvent | mouse event |

**Returns:** *boolean*

return false for disable browser context menu

___

### `Private` onErrorInitConfig

▸ **onErrorInitConfig**(`state`: [PlayerState](../enums/_app_core_constant_player_state_.playerstate.md)): *void*

Defined in src/app/player/amalia.component.ts:336

Invoked on error to init config

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`state` | [PlayerState](../enums/_app_core_constant_player_state_.playerstate.md) | player init state  |

**Returns:** *void*

___

### `Private` onInitConfig

▸ **onInitConfig**(`state`: [PlayerState](../enums/_app_core_constant_player_state_.playerstate.md)): *void*

Defined in src/app/player/amalia.component.ts:327

Invoked on  init config

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`state` | [PlayerState](../enums/_app_core_constant_player_state_.playerstate.md) | player init state  |

**Returns:** *void*

___

### `Private` setPreviewThumbnail

▸ **setPreviewThumbnail**(`tc`: number): *void*

Defined in src/app/player/amalia.component.ts:317

In charge to update thumbnail

**Parameters:**

Name | Type |
------ | ------ |
`tc` | number |

**Returns:** *void*

___

### `Private` updatePlayerSizeWithAspectRatio

▸ **updatePlayerSizeWithAspectRatio**(): *void*

Defined in src/app/player/amalia.component.ts:210

In charge to update player size with aspect ratio

**Returns:** *void*
