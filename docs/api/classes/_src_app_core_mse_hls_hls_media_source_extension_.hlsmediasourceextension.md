[Amalia](../README.md) › [Globals](../globals.md) › ["src/app/core/mse/hls/hls-media-source-extension"](../modules/_src_app_core_mse_hls_hls_media_source_extension_.md) › [HLSMediaSourceExtension](_src_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md)

# Class: HLSMediaSourceExtension

In  charge to handle HSL Media extension

## Hierarchy

* **HLSMediaSourceExtension**

## Implements

* [MediaSourceExtension](../interfaces/_src_app_core_mse_media_source_extension_.mediasourceextension.md)

## Index

### Constructors

* [constructor](_src_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md#constructor)

### Properties

* [backwardsMediaSrc](_src_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md#private-backwardsmediasrc)
* [config](_src_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md#config)
* [currentTime](_src_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md#private-currenttime)
* [duration](_src_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md#private-duration)
* [eventEmitter](_src_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md#private-eventemitter)
* [hlsPlayer](_src_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md#private-hlsplayer)
* [logger](_src_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md#private-logger)
* [mainMediaSrc](_src_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md#private-mainmediasrc)
* [mediaElement](_src_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md#mediaelement)
* [reverseMode](_src_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md#reversemode)
* [DEFAULT_HEADER_BASE64](_src_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md#static-private-default_header_base64)

### Methods

* [destroy](_src_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md#destroy)
* [getBackwardsSrc](_src_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md#getbackwardssrc)
* [getConfig](_src_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md#getconfig)
* [getSrc](_src_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md#getsrc)
* [handleAudioChannelChange](_src_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md#private-handleaudiochannelchange)
* [handleError](_src_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md#handleerror)
* [setMaxBufferLengthConfig](_src_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md#setmaxbufferlengthconfig)
* [setSrc](_src_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md#setsrc)
* [switchSrc](_src_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md#private-switchsrc)
* [switchToBackwardsSrc](_src_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md#switchtobackwardssrc)
* [switchToMainSrc](_src_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md#switchtomainsrc)
* [isUrl](_src_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md#static-isurl)

## Constructors

###  constructor

\+ **new HLSMediaSourceExtension**(`mediaElement`: HTMLVideoElement, `eventEmitter`: EventEmitter, `config`: [PlayerConfigData](../interfaces/_src_app_core_config_model_player_config_data_.playerconfigdata.md), `logger`: [LoggerInterface](../interfaces/_src_app_core_logger_logger_interface_.loggerinterface.md)): *[HLSMediaSourceExtension](_src_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md)*

Defined in src/app/core/mse/hls/hls-media-source-extension.ts:30

**Parameters:**

Name | Type |
------ | ------ |
`mediaElement` | HTMLVideoElement |
`eventEmitter` | EventEmitter |
`config` | [PlayerConfigData](../interfaces/_src_app_core_config_model_player_config_data_.playerconfigdata.md) |
`logger` | [LoggerInterface](../interfaces/_src_app_core_logger_logger_interface_.loggerinterface.md) |

**Returns:** *[HLSMediaSourceExtension](_src_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md)*

## Properties

### `Private` backwardsMediaSrc

• **backwardsMediaSrc**: *string*

Defined in src/app/core/mse/hls/hls-media-source-extension.ts:25

___

###  config

• **config**: *[PlayerConfigData](../interfaces/_src_app_core_config_model_player_config_data_.playerconfigdata.md)*

Defined in src/app/core/mse/hls/hls-media-source-extension.ts:26

___

### `Private` currentTime

• **currentTime**: *number*

Defined in src/app/core/mse/hls/hls-media-source-extension.ts:22

___

### `Private` duration

• **duration**: *number*

Defined in src/app/core/mse/hls/hls-media-source-extension.ts:23

___

### `Private` eventEmitter

• **eventEmitter**: *EventEmitter*

Defined in src/app/core/mse/hls/hls-media-source-extension.ts:29

___

### `Private` hlsPlayer

• **hlsPlayer**: *Hls*

Defined in src/app/core/mse/hls/hls-media-source-extension.ts:30

___

### `Private` logger

• **logger**: *[LoggerInterface](../interfaces/_src_app_core_logger_logger_interface_.loggerinterface.md)*

Defined in src/app/core/mse/hls/hls-media-source-extension.ts:27

___

### `Private` mainMediaSrc

• **mainMediaSrc**: *string*

Defined in src/app/core/mse/hls/hls-media-source-extension.ts:24

___

###  mediaElement

• **mediaElement**: *HTMLVideoElement*

Defined in src/app/core/mse/hls/hls-media-source-extension.ts:28

___

###  reverseMode

• **reverseMode**: *boolean* = false

Defined in src/app/core/mse/hls/hls-media-source-extension.ts:21

___

### `Static` `Private` DEFAULT_HEADER_BASE64

▪ **DEFAULT_HEADER_BASE64**: *string* = "data:application/vnd.apple.mpegurl;base64,"

Defined in src/app/core/mse/hls/hls-media-source-extension.ts:20

## Methods

###  destroy

▸ **destroy**(): *void*

*Implementation of [MediaSourceExtension](../interfaces/_src_app_core_mse_media_source_extension_.mediasourceextension.md)*

Defined in src/app/core/mse/hls/hls-media-source-extension.ts:140

**Returns:** *void*

___

###  getBackwardsSrc

▸ **getBackwardsSrc**(): *string | MediaStream | MediaSource | Blob | null*

*Implementation of [MediaSourceExtension](../interfaces/_src_app_core_mse_media_source_extension_.mediasourceextension.md)*

Defined in src/app/core/mse/hls/hls-media-source-extension.ts:104

**Returns:** *string | MediaStream | MediaSource | Blob | null*

___

###  getConfig

▸ **getConfig**(): *object & object & object & object & object & object & object & object & object & object & object & object & object & object & object & object*

*Implementation of [MediaSourceExtension](../interfaces/_src_app_core_mse_media_source_extension_.mediasourceextension.md)*

Defined in src/app/core/mse/hls/hls-media-source-extension.ts:170

**Returns:** *object & object & object & object & object & object & object & object & object & object & object & object & object & object & object & object*

___

###  getSrc

▸ **getSrc**(): *string | MediaStream | MediaSource | Blob | null*

*Implementation of [MediaSourceExtension](../interfaces/_src_app_core_mse_media_source_extension_.mediasourceextension.md)*

Defined in src/app/core/mse/hls/hls-media-source-extension.ts:74

Return media source

**Returns:** *string | MediaStream | MediaSource | Blob | null*

___

### `Private` handleAudioChannelChange

▸ **handleAudioChannelChange**(`event`: any): *void*

Defined in src/app/core/mse/hls/hls-media-source-extension.ts:165

Invoked on channel change

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`event` | any | channel  |

**Returns:** *void*

___

###  handleError

▸ **handleError**(`event`: any): *void*

*Implementation of [MediaSourceExtension](../interfaces/_src_app_core_mse_media_source_extension_.mediasourceextension.md)*

Defined in src/app/core/mse/hls/hls-media-source-extension.ts:150

Invoked when error events

**Parameters:**

Name | Type |
------ | ------ |
`event` | any |

**Returns:** *void*

___

###  setMaxBufferLengthConfig

▸ **setMaxBufferLengthConfig**(`value`: any): *void*

*Implementation of [MediaSourceExtension](../interfaces/_src_app_core_mse_media_source_extension_.mediasourceextension.md)*

Defined in src/app/core/mse/hls/hls-media-source-extension.ts:174

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *void*

___

###  setSrc

▸ **setSrc**(`config`: [PlayerConfigData](../interfaces/_src_app_core_config_model_player_config_data_.playerconfigdata.md)): *void*

*Implementation of [MediaSourceExtension](../interfaces/_src_app_core_mse_media_source_extension_.mediasourceextension.md)*

Defined in src/app/core/mse/hls/hls-media-source-extension.ts:83

Invoked to set hls source
When you set not valid url, we add default base 64 header

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`config` | [PlayerConfigData](../interfaces/_src_app_core_config_model_player_config_data_.playerconfigdata.md) | media source configuration  |

**Returns:** *void*

___

### `Private` switchSrc

▸ **switchSrc**(`src`: string, `reverseMode`: boolean): *Promise‹void›*

Defined in src/app/core/mse/hls/hls-media-source-extension.ts:120

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

*Implementation of [MediaSourceExtension](../interfaces/_src_app_core_mse_media_source_extension_.mediasourceextension.md)*

Defined in src/app/core/mse/hls/hls-media-source-extension.ts:112

**Returns:** *Promise‹void›*

___

###  switchToMainSrc

▸ **switchToMainSrc**(): *Promise‹void›*

*Implementation of [MediaSourceExtension](../interfaces/_src_app_core_mse_media_source_extension_.mediasourceextension.md)*

Defined in src/app/core/mse/hls/hls-media-source-extension.ts:108

**Returns:** *Promise‹void›*

___

### `Static` isUrl

▸ **isUrl**(`value`: string): *boolean*

Defined in src/app/core/mse/hls/hls-media-source-extension.ts:62

Is valid url

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | string | url |

**Returns:** *boolean*

true is url
