[Amalia](../README.md) › [Globals](../globals.md) › ["app/core/media-player-element"](../modules/_app_core_media_player_element_.md) › [MediaPlayerElement](_app_core_media_player_element_.mediaplayerelement.md)

# Class: MediaPlayerElement

In charge to create player

## Hierarchy

* **MediaPlayerElement**

## Index

### Constructors

* [constructor](_app_core_media_player_element_.mediaplayerelement.md#constructor)

### Properties

* [_aspectRatio](_app_core_media_player_element_.mediaplayerelement.md#private-_aspectratio)
* [_eventEmitter](_app_core_media_player_element_.mediaplayerelement.md#private-_eventemitter)
* [_metadataManager](_app_core_media_player_element_.mediaplayerelement.md#private-_metadatamanager)
* [configurationManager](_app_core_media_player_element_.mediaplayerelement.md#private-configurationmanager)
* [defaultLoader](_app_core_media_player_element_.mediaplayerelement.md#private-defaultloader)
* [logger](_app_core_media_player_element_.mediaplayerelement.md#private-logger)
* [mediaPlayer](_app_core_media_player_element_.mediaplayerelement.md#private-mediaplayer)
* [preferenceStorageManager](_app_core_media_player_element_.mediaplayerelement.md#private-preferencestoragemanager)
* [state](_app_core_media_player_element_.mediaplayerelement.md#private-state)

### Accessors

* [aspectRatio](_app_core_media_player_element_.mediaplayerelement.md#aspectratio)
* [eventEmitter](_app_core_media_player_element_.mediaplayerelement.md#eventemitter)
* [metadataManager](_app_core_media_player_element_.mediaplayerelement.md#metadatamanager)

### Methods

* [closeFullscreen](_app_core_media_player_element_.mediaplayerelement.md#closefullscreen)
* [getConfiguration](_app_core_media_player_element_.mediaplayerelement.md#getconfiguration)
* [getMediaPlayer](_app_core_media_player_element_.mediaplayerelement.md#getmediaplayer)
* [getPluginConfiguration](_app_core_media_player_element_.mediaplayerelement.md#getpluginconfiguration)
* [getState](_app_core_media_player_element_.mediaplayerelement.md#getstate)
* [getThumbnailUrl](_app_core_media_player_element_.mediaplayerelement.md#getthumbnailurl)
* [handleMetadataLoaded](_app_core_media_player_element_.mediaplayerelement.md#private-handlemetadataloaded)
* [init](_app_core_media_player_element_.mediaplayerelement.md#init)
* [loadConfiguration](_app_core_media_player_element_.mediaplayerelement.md#private-loadconfiguration)
* [loadDataSources](_app_core_media_player_element_.mediaplayerelement.md#private-loaddatasources)
* [openFullscreen](_app_core_media_player_element_.mediaplayerelement.md#openfullscreen)
* [setMediaPlayer](_app_core_media_player_element_.mediaplayerelement.md#setmediaplayer)
* [setMediaSource](_app_core_media_player_element_.mediaplayerelement.md#private-setmediasource)

## Constructors

###  constructor

\+ **new MediaPlayerElement**(): *[MediaPlayerElement](_app_core_media_player_element_.mediaplayerelement.md)*

Defined in src/app/core/media-player-element.ts:29

**Returns:** *[MediaPlayerElement](_app_core_media_player_element_.mediaplayerelement.md)*

## Properties

### `Private` _aspectRatio

• **_aspectRatio**: *"16:9" | "4:3"* = "4:3"

Defined in src/app/core/media-player-element.ts:40

Selected aspectRatio

___

### `Private` _eventEmitter

• **_eventEmitter**: *EventEmitter*

Defined in src/app/core/media-player-element.ts:29

___

### `Private` _metadataManager

• **_metadataManager**: *[MetadataManager](_app_core_metadata_metadata_manager_.metadatamanager.md)*

Defined in src/app/core/media-player-element.ts:23

___

### `Private` configurationManager

• **configurationManager**: *[ConfigurationManager](_app_core_config_configuration_manager_.configurationmanager.md)*

Defined in src/app/core/media-player-element.ts:22

___

### `Private` defaultLoader

• **defaultLoader**: *[Loader](../interfaces/_app_core_loader_loader_.loader.md)‹Array‹Metadata››*

Defined in src/app/core/media-player-element.ts:24

___

### `Private` logger

• **logger**: *[LoggerInterface](../interfaces/_app_core_logger_logger_interface_.loggerinterface.md)*

Defined in src/app/core/media-player-element.ts:28

___

### `Private` mediaPlayer

• **mediaPlayer**: *[MediaElement](_app_core_media_media_element_.mediaelement.md)*

Defined in src/app/core/media-player-element.ts:26

___

### `Private` preferenceStorageManager

• **preferenceStorageManager**: *[PreferenceStorageManager](_app_core_storage_preference_storage_manager_.preferencestoragemanager.md)*

Defined in src/app/core/media-player-element.ts:27

___

### `Private` state

• **state**: *[PlayerState](../enums/_app_core_constant_player_state_.playerstate.md)* = PlayerState.CREATED

Defined in src/app/core/media-player-element.ts:25

## Accessors

###  aspectRatio

• **get aspectRatio**(): *"16:9" | "4:3"*

Defined in src/app/core/media-player-element.ts:42

**Returns:** *"16:9" | "4:3"*

• **set aspectRatio**(`value`: "16:9" | "4:3"): *void*

Defined in src/app/core/media-player-element.ts:46

**Parameters:**

Name | Type |
------ | ------ |
`value` | "16:9" &#124; "4:3" |

**Returns:** *void*

___

###  eventEmitter

• **get eventEmitter**(): *EventEmitter*

Defined in src/app/core/media-player-element.ts:51

**Returns:** *EventEmitter*

___

###  metadataManager

• **get metadataManager**(): *[MetadataManager](_app_core_metadata_metadata_manager_.metadatamanager.md)*

Defined in src/app/core/media-player-element.ts:62

**Returns:** *[MetadataManager](_app_core_metadata_metadata_manager_.metadatamanager.md)*

• **set metadataManager**(`value`: [MetadataManager](_app_core_metadata_metadata_manager_.metadatamanager.md)): *void*

Defined in src/app/core/media-player-element.ts:66

**Parameters:**

Name | Type |
------ | ------ |
`value` | [MetadataManager](_app_core_metadata_metadata_manager_.metadatamanager.md) |

**Returns:** *void*

## Methods

###  closeFullscreen

▸ **closeFullscreen**(): *void*

Defined in src/app/core/media-player-element.ts:143

In charge to exit fullscreen

**Returns:** *void*

___

###  getConfiguration

▸ **getConfiguration**(): *[ConfigData](../interfaces/_app_core_config_model_config_data_.configdata.md)*

Defined in src/app/core/media-player-element.ts:103

Return configuration

**Returns:** *[ConfigData](../interfaces/_app_core_config_model_config_data_.configdata.md)*

___

###  getMediaPlayer

▸ **getMediaPlayer**(): *[MediaElement](_app_core_media_media_element_.mediaelement.md)*

Defined in src/app/core/media-player-element.ts:125

Return media source

**Returns:** *[MediaElement](_app_core_media_media_element_.mediaelement.md)*

___

###  getPluginConfiguration

▸ **getPluginConfiguration**(`pluginName`: string): *[PluginConfigData](../interfaces/_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹any›*

Defined in src/app/core/media-player-element.ts:110

Return configuration

**Parameters:**

Name | Type |
------ | ------ |
`pluginName` | string |

**Returns:** *[PluginConfigData](../interfaces/_app_core_config_model_plugin_config_data_.pluginconfigdata.md)‹any›*

___

###  getState

▸ **getState**(): *[PlayerState](../enums/_app_core_constant_player_state_.playerstate.md)*

Defined in src/app/core/media-player-element.ts:58

Return media player state

**Returns:** *[PlayerState](../enums/_app_core_constant_player_state_.playerstate.md)*

___

###  getThumbnailUrl

▸ **getThumbnailUrl**(`tc`: number): *string*

Defined in src/app/core/media-player-element.ts:187

Return thumbnail base url

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`tc` | number | time code  |

**Returns:** *string*

___

### `Private` handleMetadataLoaded

▸ **handleMetadataLoaded**(): *void*

Defined in src/app/core/media-player-element.ts:167

**Returns:** *void*

___

###  init

▸ **init**(`config`: object, `defaultLoader?`: [Loader](../interfaces/_app_core_loader_loader_.loader.md)‹Array‹Metadata››, `configLoader?`: [Loader](../interfaces/_app_core_loader_loader_.loader.md)‹[ConfigData](../interfaces/_app_core_config_model_config_data_.configdata.md)›): *Promise‹[PlayerState](../enums/_app_core_constant_player_state_.playerstate.md)›*

Defined in src/app/core/media-player-element.ts:75

In  charge to init config

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`config` | object | param |
`defaultLoader?` | [Loader](../interfaces/_app_core_loader_loader_.loader.md)‹Array‹Metadata›› | - |
`configLoader?` | [Loader](../interfaces/_app_core_loader_loader_.loader.md)‹[ConfigData](../interfaces/_app_core_config_model_config_data_.configdata.md)› | configuration loader when empty we use default configuration loader  |

**Returns:** *Promise‹[PlayerState](../enums/_app_core_constant_player_state_.playerstate.md)›*

___

### `Private` loadConfiguration

▸ **loadConfiguration**(`config`: string | object): *Promise‹void›*

Defined in src/app/core/media-player-element.ts:154

In charge to load configuration

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`config` | string &#124; object | configuration parameter  |

**Returns:** *Promise‹void›*

___

### `Private` loadDataSources

▸ **loadDataSources**(): *Promise‹void›*

Defined in src/app/core/media-player-element.ts:163

In charge to load data sources

**Returns:** *Promise‹void›*

___

###  openFullscreen

▸ **openFullscreen**(`element`: HTMLElement): *void*

Defined in src/app/core/media-player-element.ts:133

In charge to put element on full screen

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`element` | HTMLElement | to put in fullscreen  |

**Returns:** *void*

___

###  setMediaPlayer

▸ **setMediaPlayer**(`mediaPlayer`: HTMLVideoElement): *void*

Defined in src/app/core/media-player-element.ts:117

Set media element

**Parameters:**

Name | Type |
------ | ------ |
`mediaPlayer` | HTMLVideoElement |

**Returns:** *void*

___

### `Private` setMediaSource

▸ **setMediaSource**(): *void*

Defined in src/app/core/media-player-element.ts:174

In charge to load data sources

**Returns:** *void*
