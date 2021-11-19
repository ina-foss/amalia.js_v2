[Amalia](../README.md) › [Globals](../globals.md) › ["src/app/core/media-player-element"](../modules/_src_app_core_media_player_element_.md) › [MediaPlayerElement](_src_app_core_media_player_element_.mediaplayerelement.md)

# Class: MediaPlayerElement

In charge to create player

## Hierarchy

* **MediaPlayerElement**

## Index

### Constructors

* [constructor](_src_app_core_media_player_element_.mediaplayerelement.md#constructor)

### Properties

* [_aspectRatio](_src_app_core_media_player_element_.mediaplayerelement.md#_aspectratio)
* [_eventEmitter](_src_app_core_media_player_element_.mediaplayerelement.md#private-_eventemitter)
* [_metadataManager](_src_app_core_media_player_element_.mediaplayerelement.md#_metadatamanager)
* [configurationManager](_src_app_core_media_player_element_.mediaplayerelement.md#configurationmanager)
* [defaultLoader](_src_app_core_media_player_element_.mediaplayerelement.md#defaultloader)
* [isMetadataLoaded](_src_app_core_media_player_element_.mediaplayerelement.md#ismetadataloaded)
* [logger](_src_app_core_media_player_element_.mediaplayerelement.md#private-logger)
* [mediaPlayer](_src_app_core_media_player_element_.mediaplayerelement.md#private-mediaplayer)
* [preferenceStorageManager](_src_app_core_media_player_element_.mediaplayerelement.md#private-preferencestoragemanager)
* [state](_src_app_core_media_player_element_.mediaplayerelement.md#private-state)
* [width](_src_app_core_media_player_element_.mediaplayerelement.md#width)

### Accessors

* [aspectRatio](_src_app_core_media_player_element_.mediaplayerelement.md#aspectratio)
* [eventEmitter](_src_app_core_media_player_element_.mediaplayerelement.md#eventemitter)
* [metadataManager](_src_app_core_media_player_element_.mediaplayerelement.md#metadatamanager)

### Methods

* [getConfiguration](_src_app_core_media_player_element_.mediaplayerelement.md#getconfiguration)
* [getDisplayState](_src_app_core_media_player_element_.mediaplayerelement.md#getdisplaystate)
* [getMediaPlayer](_src_app_core_media_player_element_.mediaplayerelement.md#getmediaplayer)
* [getPluginConfiguration](_src_app_core_media_player_element_.mediaplayerelement.md#getpluginconfiguration)
* [getState](_src_app_core_media_player_element_.mediaplayerelement.md#getstate)
* [getThumbnailUrl](_src_app_core_media_player_element_.mediaplayerelement.md#getthumbnailurl)
* [handleMetadataLoaded](_src_app_core_media_player_element_.mediaplayerelement.md#handlemetadataloaded)
* [init](_src_app_core_media_player_element_.mediaplayerelement.md#init)
* [loadConfiguration](_src_app_core_media_player_element_.mediaplayerelement.md#private-loadconfiguration)
* [loadDataSources](_src_app_core_media_player_element_.mediaplayerelement.md#private-loaddatasources)
* [setMediaPlayer](_src_app_core_media_player_element_.mediaplayerelement.md#setmediaplayer)
* [setMediaPlayerWidth](_src_app_core_media_player_element_.mediaplayerelement.md#setmediaplayerwidth)
* [setMediaSource](_src_app_core_media_player_element_.mediaplayerelement.md#private-setmediasource)
* [toggleFullscreen](_src_app_core_media_player_element_.mediaplayerelement.md#togglefullscreen)

## Constructors

###  constructor

\+ **new MediaPlayerElement**(): *[MediaPlayerElement](_src_app_core_media_player_element_.mediaplayerelement.md)*

Defined in src/app/core/media-player-element.ts:30

**Returns:** *[MediaPlayerElement](_src_app_core_media_player_element_.mediaplayerelement.md)*

## Properties

###  _aspectRatio

• **_aspectRatio**: *"16:9" | "4:3"* = "4:3"

Defined in src/app/core/media-player-element.ts:41

Selected aspectRatio

___

### `Private` _eventEmitter

• **_eventEmitter**: *EventEmitter*

Defined in src/app/core/media-player-element.ts:28

___

###  _metadataManager

• **_metadataManager**: *[MetadataManager](_src_app_core_metadata_metadata_manager_.metadatamanager.md)*

Defined in src/app/core/media-player-element.ts:22

___

###  configurationManager

• **configurationManager**: *[ConfigurationManager](_src_app_core_config_configuration_manager_.configurationmanager.md)*

Defined in src/app/core/media-player-element.ts:21

___

###  defaultLoader

• **defaultLoader**: *[Loader](../interfaces/_src_app_core_loader_loader_.loader.md)‹Array‹Metadata››*

Defined in src/app/core/media-player-element.ts:23

___

###  isMetadataLoaded

• **isMetadataLoaded**: *boolean* = false

Defined in src/app/core/media-player-element.ts:29

___

### `Private` logger

• **logger**: *[LoggerInterface](../interfaces/_src_app_core_logger_logger_interface_.loggerinterface.md)*

Defined in src/app/core/media-player-element.ts:27

___

### `Private` mediaPlayer

• **mediaPlayer**: *[MediaElement](_src_app_core_media_media_element_.mediaelement.md)*

Defined in src/app/core/media-player-element.ts:25

___

### `Private` preferenceStorageManager

• **preferenceStorageManager**: *[PreferenceStorageManager](_src_app_core_storage_preference_storage_manager_.preferencestoragemanager.md)*

Defined in src/app/core/media-player-element.ts:26

___

### `Private` state

• **state**: *[PlayerState](../enums/_src_app_core_constant_player_state_.playerstate.md)* = PlayerState.CREATED

Defined in src/app/core/media-player-element.ts:24

___

###  width

• **width**: *number*

Defined in src/app/core/media-player-element.ts:30

## Accessors

###  aspectRatio

• **get aspectRatio**(): *"16:9" | "4:3"*

Defined in src/app/core/media-player-element.ts:43

**Returns:** *"16:9" | "4:3"*

• **set aspectRatio**(`value`: "16:9" | "4:3"): *void*

Defined in src/app/core/media-player-element.ts:48

**Parameters:**

Name | Type |
------ | ------ |
`value` | "16:9" &#124; "4:3" |

**Returns:** *void*

___

###  eventEmitter

• **get eventEmitter**(): *EventEmitter*

Defined in src/app/core/media-player-element.ts:54

**Returns:** *EventEmitter*

___

###  metadataManager

• **get metadataManager**(): *[MetadataManager](_src_app_core_metadata_metadata_manager_.metadatamanager.md)*

Defined in src/app/core/media-player-element.ts:65

**Returns:** *[MetadataManager](_src_app_core_metadata_metadata_manager_.metadatamanager.md)*

• **set metadataManager**(`value`: [MetadataManager](_src_app_core_metadata_metadata_manager_.metadatamanager.md)): *void*

Defined in src/app/core/media-player-element.ts:69

**Parameters:**

Name | Type |
------ | ------ |
`value` | [MetadataManager](_src_app_core_metadata_metadata_manager_.metadatamanager.md) |

**Returns:** *void*

## Methods

###  getConfiguration

▸ **getConfiguration**(): *[ConfigData](../interfaces/_src_app_core_config_model_config_data_.configdata.md)*

Defined in src/app/core/media-player-element.ts:113

Return configuration

**Returns:** *[ConfigData](../interfaces/_src_app_core_config_model_config_data_.configdata.md)*

___

###  getDisplayState

▸ **getDisplayState**(): *string*

Defined in src/app/core/media-player-element.ts:217

Return displayState (s/m/l)

**Returns:** *string*

___

###  getMediaPlayer

▸ **getMediaPlayer**(): *[MediaElement](_src_app_core_media_media_element_.mediaelement.md)*

Defined in src/app/core/media-player-element.ts:135

Return media source

**Returns:** *[MediaElement](_src_app_core_media_media_element_.mediaelement.md)*

___

###  getPluginConfiguration

▸ **getPluginConfiguration**(`pluginName`: string): *[PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹any›*

Defined in src/app/core/media-player-element.ts:120

Return configuration

**Parameters:**

Name | Type |
------ | ------ |
`pluginName` | string |

**Returns:** *[PluginConfigData](../interfaces/_src_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹any›*

___

###  getState

▸ **getState**(): *[PlayerState](../enums/_src_app_core_constant_player_state_.playerstate.md)*

Defined in src/app/core/media-player-element.ts:61

Return media player state

**Returns:** *[PlayerState](../enums/_src_app_core_constant_player_state_.playerstate.md)*

___

###  getThumbnailUrl

▸ **getThumbnailUrl**(`tc`: number, `onhover?`: boolean): *string*

Defined in src/app/core/media-player-element.ts:195

Return thumbnail base url

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`tc` | number | time code  |
`onhover?` | boolean | - |

**Returns:** *string*

___

###  handleMetadataLoaded

▸ **handleMetadataLoaded**(): *void*

Defined in src/app/core/media-player-element.ts:173

**Returns:** *void*

___

###  init

▸ **init**(`config`: object, `defaultLoader?`: [Loader](../interfaces/_src_app_core_loader_loader_.loader.md)‹Array‹Metadata››, `configLoader?`: [Loader](../interfaces/_src_app_core_loader_loader_.loader.md)‹[ConfigData](../interfaces/_src_app_core_config_model_config_data_.configdata.md)›): *Promise‹[PlayerState](../enums/_src_app_core_constant_player_state_.playerstate.md)›*

Defined in src/app/core/media-player-element.ts:79

In  charge to init config

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`config` | object | param |
`defaultLoader?` | [Loader](../interfaces/_src_app_core_loader_loader_.loader.md)‹Array‹Metadata›› | default loader |
`configLoader?` | [Loader](../interfaces/_src_app_core_loader_loader_.loader.md)‹[ConfigData](../interfaces/_src_app_core_config_model_config_data_.configdata.md)› | configuration loader when empty we use default configuration loader  |

**Returns:** *Promise‹[PlayerState](../enums/_src_app_core_constant_player_state_.playerstate.md)›*

___

### `Private` loadConfiguration

▸ **loadConfiguration**(`config`: string | object): *Promise‹void›*

Defined in src/app/core/media-player-element.ts:160

In charge to load configuration

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`config` | string &#124; object | configuration parameter  |

**Returns:** *Promise‹void›*

___

### `Private` loadDataSources

▸ **loadDataSources**(): *Promise‹void›*

Defined in src/app/core/media-player-element.ts:169

In charge to load data sources

**Returns:** *Promise‹void›*

___

###  setMediaPlayer

▸ **setMediaPlayer**(`mediaPlayer`: HTMLVideoElement): *void*

Defined in src/app/core/media-player-element.ts:127

Set media element

**Parameters:**

Name | Type |
------ | ------ |
`mediaPlayer` | HTMLVideoElement |

**Returns:** *void*

___

###  setMediaPlayerWidth

▸ **setMediaPlayerWidth**(`width`: any): *void*

Defined in src/app/core/media-player-element.ts:209

Set mediaPlayer width for responsive grid

**Parameters:**

Name | Type |
------ | ------ |
`width` | any |

**Returns:** *void*

___

### `Private` setMediaSource

▸ **setMediaSource**(): *void*

Defined in src/app/core/media-player-element.ts:182

In charge to load data sources

**Returns:** *void*

___

###  toggleFullscreen

▸ **toggleFullscreen**(`element`: HTMLElement): *void*

Defined in src/app/core/media-player-element.ts:143

In charge to toggle fullscreen mode

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`element` | HTMLElement | to put in fullscreen  |

**Returns:** *void*
