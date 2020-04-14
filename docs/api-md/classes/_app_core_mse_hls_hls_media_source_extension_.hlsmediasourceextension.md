[Amalia](../README.md) › [Globals](../globals.md) › ["app/core/mse/hls/hls-media-source-extension"](../modules/_app_core_mse_hls_hls_media_source_extension_.md) › [HLSMediaSourceExtension](_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md)

# Class: HLSMediaSourceExtension

In  charge to handle HSL Media extension

## Hierarchy

* **HLSMediaSourceExtension**

## Implements

* [MediaSourceExtension](../interfaces/_app_core_mse_media_source_extension_.mediasourceextension.md)

## Index

### Constructors

* [constructor](_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md#constructor)

### Properties

* [backwardsMediaSrc](_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md#private-backwardsmediasrc)
* [config](_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md#private-config)
* [currentTime](_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md#private-currenttime)
* [duration](_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md#private-duration)
* [eventEmitter](_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md#private-eventemitter)
* [hlsPlayer](_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md#private-hlsplayer)
* [logger](_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md#private-logger)
* [mainMediaSrc](_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md#private-mainmediasrc)
* [mediaElement](_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md#private-mediaelement)
* [reverseMode](_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md#private-reversemode)
* [DEFAULT_HEADER_BASE64](_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md#static-private-default_header_base64)

### Methods

* [destroy](_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md#destroy)
* [getBackwardsSrc](_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md#getbackwardssrc)
* [getSrc](_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md#getsrc)
* [handleAudioChannelChange](_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md#private-handleaudiochannelchange)
* [handleError](_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md#handleerror)
* [handleOnManifestLoaded](_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md#private-handleonmanifestloaded)
* [setSrc](_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md#setsrc)
* [switchSrc](_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md#private-switchsrc)
* [switchToBackwardsSrc](_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md#switchtobackwardssrc)
* [switchToMainSrc](_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md#switchtomainsrc)
* [isUrl](_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md#static-isurl)

## Constructors

###  constructor

\+ **new HLSMediaSourceExtension**(`mediaElement`: HTMLVideoElement, `eventEmitter`: EventEmitter, `config`: [PlayerConfigData](../interfaces/_app_core_config_model_player_config_data_.playerconfigdata.md), `logger`: [LoggerInterface](../interfaces/_app_core_logger_logger_interface_.loggerinterface.md)): *[HLSMediaSourceExtension](_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md)*

Defined in src/app/core/mse/hls/hls-media-source-extension.ts:26

**Parameters:**

Name | Type |
------ | ------ |
`mediaElement` | HTMLVideoElement |
`eventEmitter` | EventEmitter |
`config` | [PlayerConfigData](../interfaces/_app_core_config_model_player_config_data_.playerconfigdata.md) |
`logger` | [LoggerInterface](../interfaces/_app_core_logger_logger_interface_.loggerinterface.md) |

**Returns:** *[HLSMediaSourceExtension](_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md)*

## Properties

### `Private` backwardsMediaSrc

• **backwardsMediaSrc**: *string*

Defined in src/app/core/mse/hls/hls-media-source-extension.ts:21

___

### `Private` config

• **config**: *[PlayerConfigData](../interfaces/_app_core_config_model_player_config_data_.playerconfigdata.md)*

Defined in src/app/core/mse/hls/hls-media-source-extension.ts:22

___

### `Private` currentTime

• **currentTime**: *number*

Defined in src/app/core/mse/hls/hls-media-source-extension.ts:18

___

### `Private` duration

• **duration**: *number*

Defined in src/app/core/mse/hls/hls-media-source-extension.ts:19

___

### `Private` eventEmitter

• **eventEmitter**: *EventEmitter*

Defined in src/app/core/mse/hls/hls-media-source-extension.ts:25

___

### `Private` hlsPlayer

• **hlsPlayer**: *Hls*

Defined in src/app/core/mse/hls/hls-media-source-extension.ts:26

___

### `Private` logger

• **logger**: *[LoggerInterface](../interfaces/_app_core_logger_logger_interface_.loggerinterface.md)*

Defined in src/app/core/mse/hls/hls-media-source-extension.ts:23

___

### `Private` mainMediaSrc

• **mainMediaSrc**: *string*

Defined in src/app/core/mse/hls/hls-media-source-extension.ts:20

___

### `Private` mediaElement

• **mediaElement**: *HTMLVideoElement*

Defined in src/app/core/mse/hls/hls-media-source-extension.ts:24

___

### `Private` reverseMode

• **reverseMode**: *boolean* = false

Defined in src/app/core/mse/hls/hls-media-source-extension.ts:17

___

### `Static` `Private` DEFAULT_HEADER_BASE64

▪ **DEFAULT_HEADER_BASE64**: *string* = "data:application/vnd.apple.mpegurl;base64,"

Defined in src/app/core/mse/hls/hls-media-source-extension.ts:16

## Methods

###  destroy

▸ **destroy**(): *void*

*Implementation of [MediaSourceExtension](../interfaces/_app_core_mse_media_source_extension_.mediasourceextension.md)*

Defined in src/app/core/mse/hls/hls-media-source-extension.ts:125

**Returns:** *void*

___

###  getBackwardsSrc

▸ **getBackwardsSrc**(): *string | MediaStream | MediaSource | Blob | null*

*Implementation of [MediaSourceExtension](../interfaces/_app_core_mse_media_source_extension_.mediasourceextension.md)*

Defined in src/app/core/mse/hls/hls-media-source-extension.ts:96

**Returns:** *string | MediaStream | MediaSource | Blob | null*

___

###  getSrc

▸ **getSrc**(): *string | MediaStream | MediaSource | Blob | null*

*Implementation of [MediaSourceExtension](../interfaces/_app_core_mse_media_source_extension_.mediasourceextension.md)*

Defined in src/app/core/mse/hls/hls-media-source-extension.ts:68

Return media source

**Returns:** *string | MediaStream | MediaSource | Blob | null*

___

### `Private` handleAudioChannelChange

▸ **handleAudioChannelChange**(`event`: any): *void*

Defined in src/app/core/mse/hls/hls-media-source-extension.ts:162

Invoked on channel change

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`event` | any | channel  |

**Returns:** *void*

___

###  handleError

▸ **handleError**(`event`: any): *void*

*Implementation of [MediaSourceExtension](../interfaces/_app_core_mse_media_source_extension_.mediasourceextension.md)*

Defined in src/app/core/mse/hls/hls-media-source-extension.ts:135

Invoked when error events

**Parameters:**

Name | Type |
------ | ------ |
`event` | any |

**Returns:** *void*

___

### `Private` handleOnManifestLoaded

▸ **handleOnManifestLoaded**(): *void*

Defined in src/app/core/mse/hls/hls-media-source-extension.ts:149

Invoked when manifest loaded

**Returns:** *void*

___

###  setSrc

▸ **setSrc**(`config`: [PlayerConfigData](../interfaces/_app_core_config_model_player_config_data_.playerconfigdata.md)): *void*

*Implementation of [MediaSourceExtension](../interfaces/_app_core_mse_media_source_extension_.mediasourceextension.md)*

Defined in src/app/core/mse/hls/hls-media-source-extension.ts:77

Invoked to set hls source
When you set not valid url, we add default base 64 header

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`config` | [PlayerConfigData](../interfaces/_app_core_config_model_player_config_data_.playerconfigdata.md) | media source configuration  |

**Returns:** *void*

___

### `Private` switchSrc

▸ **switchSrc**(`src`: string, `reverseMode`: boolean): *Promise‹void›*

Defined in src/app/core/mse/hls/hls-media-source-extension.ts:112

Media source

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`src` | string | media source  |
`reverseMode` | boolean | - |

**Returns:** *Promise‹void›*

___

###  switchToBackwardsSrc

▸ **switchToBackwardsSrc**(): *Promise‹void›*

*Implementation of [MediaSourceExtension](../interfaces/_app_core_mse_media_source_extension_.mediasourceextension.md)*

Defined in src/app/core/mse/hls/hls-media-source-extension.ts:104

**Returns:** *Promise‹void›*

___

###  switchToMainSrc

▸ **switchToMainSrc**(): *Promise‹void›*

*Implementation of [MediaSourceExtension](../interfaces/_app_core_mse_media_source_extension_.mediasourceextension.md)*

Defined in src/app/core/mse/hls/hls-media-source-extension.ts:100

**Returns:** *Promise‹void›*

___

### `Static` isUrl

▸ **isUrl**(`value`: string): *boolean*

Defined in src/app/core/mse/hls/hls-media-source-extension.ts:56

Is valid url

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | string | url |

**Returns:** *boolean*

true is url
