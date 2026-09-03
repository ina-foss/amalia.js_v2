[**Amalia**](../../../README.md)

***

[Amalia](../../../modules.md) / [core/media-player-element](../README.md) / MediaPlayerElement

# Class: MediaPlayerElement

Defined in: src/app/core/media-player-element.ts:21

In charge to create player

## Constructors

### Constructor

> **new MediaPlayerElement**(): `MediaPlayerElement`

Defined in: src/app/core/media-player-element.ts:33

#### Returns

`MediaPlayerElement`

## Properties

### \_aspectRatio

> **\_aspectRatio**: `"16:9"` \| `"4:3"` = `'4:3'`

Defined in: src/app/core/media-player-element.ts:48

Selected aspectRatio

***

### \_metadataManager

> **\_metadataManager**: [`MetadataManager`](../../metadata/metadata-manager/classes/MetadataManager.md)

Defined in: src/app/core/media-player-element.ts:23

***

### configurationManager

> **configurationManager**: [`ConfigurationManager`](../../config/configuration-manager/classes/ConfigurationManager.md)

Defined in: src/app/core/media-player-element.ts:22

***

### defaultLoader

> **defaultLoader**: [`Loader`](../../loader/loader/interfaces/Loader.md)\<`Metadata`[]\>

Defined in: src/app/core/media-player-element.ts:24

***

### isMetadataLoaded

> **isMetadataLoaded**: `boolean` = `false`

Defined in: src/app/core/media-player-element.ts:30

***

### width

> **width**: `number`

Defined in: src/app/core/media-player-element.ts:31

## Accessors

### aspectRatio

#### Get Signature

> **get** **aspectRatio**(): `"16:9"` \| `"4:3"`

Defined in: src/app/core/media-player-element.ts:50

##### Returns

`"16:9"` \| `"4:3"`

#### Set Signature

> **set** **aspectRatio**(`value`): `void`

Defined in: src/app/core/media-player-element.ts:58

##### Parameters

###### value

`"16:9"` | `"4:3"`

##### Returns

`void`

***

### eventEmitter

#### Get Signature

> **get** **eventEmitter**(): `EventEmitter`

Defined in: src/app/core/media-player-element.ts:64

##### Returns

`EventEmitter`

***

### metadataManager

#### Get Signature

> **get** **metadataManager**(): [`MetadataManager`](../../metadata/metadata-manager/classes/MetadataManager.md)

Defined in: src/app/core/media-player-element.ts:75

##### Returns

[`MetadataManager`](../../metadata/metadata-manager/classes/MetadataManager.md)

#### Set Signature

> **set** **metadataManager**(`value`): `void`

Defined in: src/app/core/media-player-element.ts:79

##### Parameters

###### value

[`MetadataManager`](../../metadata/metadata-manager/classes/MetadataManager.md)

##### Returns

`void`

***

### preferenceStorageManager

#### Get Signature

> **get** **preferenceStorageManager**(): [`PreferenceStorageManager`](../../storage/preference-storage-manager/classes/PreferenceStorageManager.md)

Defined in: src/app/core/media-player-element.ts:41

##### Returns

[`PreferenceStorageManager`](../../storage/preference-storage-manager/classes/PreferenceStorageManager.md)

## Methods

### getConfiguration()

> **getConfiguration**(): [`ConfigData`](../../config/model/config-data/interfaces/ConfigData.md)

Defined in: src/app/core/media-player-element.ts:130

Return configuration

#### Returns

[`ConfigData`](../../config/model/config-data/interfaces/ConfigData.md)

***

### getDisplayState()

> **getDisplayState**(): `string`

Defined in: src/app/core/media-player-element.ts:237

Return displayState (s/m/l)

#### Returns

`string`

***

### getMediaPlayer()

> **getMediaPlayer**(): [`MediaElement`](../../media/media-element/classes/MediaElement.md)

Defined in: src/app/core/media-player-element.ts:153

Return media source

#### Returns

[`MediaElement`](../../media/media-element/classes/MediaElement.md)

***

### getPluginConfiguration()

> **getPluginConfiguration**(`pluginName`): [`PluginConfigData`](../../config/model/plugin-config-data/interfaces/PluginConfigData.md)\<`any`\>

Defined in: src/app/core/media-player-element.ts:137

Return configuration

#### Parameters

##### pluginName

`string`

#### Returns

[`PluginConfigData`](../../config/model/plugin-config-data/interfaces/PluginConfigData.md)\<`any`\>

***

### getState()

> **getState**(): [`PlayerState`](../../constant/player-state/enumerations/PlayerState.md)

Defined in: src/app/core/media-player-element.ts:71

Return media player state

#### Returns

[`PlayerState`](../../constant/player-state/enumerations/PlayerState.md)

***

### getThumbnailUrl()

> **getThumbnailUrl**(`tc`, `onHover?`): `string`

Defined in: src/app/core/media-player-element.ts:213

Return thumbnail base url

#### Parameters

##### tc

`number`

time code

##### onHover?

`boolean`

#### Returns

`string`

***

### handleMetadataLoaded()

> **handleMetadataLoaded**(): `void`

Defined in: src/app/core/media-player-element.ts:191

#### Returns

`void`

***

### init()

> **init**(`config`, `defaultLoader?`, `configLoader?`): `Promise`\<[`PlayerState`](../../constant/player-state/enumerations/PlayerState.md)\>

Defined in: src/app/core/media-player-element.ts:89

In  charge to init config

#### Parameters

##### config

`object`

param

##### defaultLoader?

[`Loader`](../../loader/loader/interfaces/Loader.md)\<`Metadata`[]\>

default loader

##### configLoader?

[`Loader`](../../loader/loader/interfaces/Loader.md)\<[`ConfigData`](../../config/model/config-data/interfaces/ConfigData.md)\>

configuration loader when empty we use default configuration loader

#### Returns

`Promise`\<[`PlayerState`](../../constant/player-state/enumerations/PlayerState.md)\>

***

### loadConfiguration()

> **loadConfiguration**(`config`): `Promise`\<`void`\>

Defined in: src/app/core/media-player-element.ts:178

In charge to load configuration

#### Parameters

##### config

configuration parameter

`string` | `object`

#### Returns

`Promise`\<`void`\>

***

### setMediaPlayer()

> **setMediaPlayer**(`mediaPlayer`): `void`

Defined in: src/app/core/media-player-element.ts:144

Set media element

#### Parameters

##### mediaPlayer

`HTMLVideoElement`

#### Returns

`void`

***

### setMediaPlayerWidth()

> **setMediaPlayerWidth**(`width`): `void`

Defined in: src/app/core/media-player-element.ts:229

Set mediaPlayer width for responsive grid

#### Parameters

##### width

`any`

#### Returns

`void`

***

### toggleFullscreen()

> **toggleFullscreen**(`element`): `void`

Defined in: src/app/core/media-player-element.ts:161

In charge to toggle fullscreen mode

#### Parameters

##### element

`HTMLElement`

to put in fullscreen

#### Returns

`void`

***

### unsubscribeListeners()

> **unsubscribeListeners**(): `void`

Defined in: src/app/core/media-player-element.ts:258

#### Returns

`void`
