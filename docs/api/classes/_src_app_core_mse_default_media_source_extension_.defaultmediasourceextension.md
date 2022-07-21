[Amalia](../README.md) › [Globals](../globals.md) › ["src/app/core/mse/default-media-source-extension"](../modules/_src_app_core_mse_default_media_source_extension_.md) › [DefaultMediaSourceExtension](_src_app_core_mse_default_media_source_extension_.defaultmediasourceextension.md)

# Class: DefaultMediaSourceExtension

In  charge to handle default media sources (Supported by browsers)

## Hierarchy

* **DefaultMediaSourceExtension**

## Implements

* [MediaSourceExtension](../interfaces/_src_app_core_mse_media_source_extension_.mediasourceextension.md)

## Index

### Constructors

* [constructor](_src_app_core_mse_default_media_source_extension_.defaultmediasourceextension.md#constructor)

### Properties

* [backwardsMediaSrc](_src_app_core_mse_default_media_source_extension_.defaultmediasourceextension.md#private-backwardsmediasrc)
* [config](_src_app_core_mse_default_media_source_extension_.defaultmediasourceextension.md#private-config)
* [eventEmitter](_src_app_core_mse_default_media_source_extension_.defaultmediasourceextension.md#private-eventemitter)
* [logger](_src_app_core_mse_default_media_source_extension_.defaultmediasourceextension.md#private-logger)
* [mainSource](_src_app_core_mse_default_media_source_extension_.defaultmediasourceextension.md#mainsource)
* [mediaElement](_src_app_core_mse_default_media_source_extension_.defaultmediasourceextension.md#private-mediaelement)
* [mediaSrc](_src_app_core_mse_default_media_source_extension_.defaultmediasourceextension.md#private-mediasrc)

### Methods

* [destroy](_src_app_core_mse_default_media_source_extension_.defaultmediasourceextension.md#destroy)
* [getBackwardsSrc](_src_app_core_mse_default_media_source_extension_.defaultmediasourceextension.md#getbackwardssrc)
* [getConfig](_src_app_core_mse_default_media_source_extension_.defaultmediasourceextension.md#getconfig)
* [getSrc](_src_app_core_mse_default_media_source_extension_.defaultmediasourceextension.md#getsrc)
* [handleError](_src_app_core_mse_default_media_source_extension_.defaultmediasourceextension.md#handleerror)
* [setConfig](_src_app_core_mse_default_media_source_extension_.defaultmediasourceextension.md#setconfig)
* [setSrc](_src_app_core_mse_default_media_source_extension_.defaultmediasourceextension.md#setsrc)
* [switchToBackwardsSrc](_src_app_core_mse_default_media_source_extension_.defaultmediasourceextension.md#switchtobackwardssrc)
* [switchToMainSrc](_src_app_core_mse_default_media_source_extension_.defaultmediasourceextension.md#switchtomainsrc)

## Constructors

###  constructor

\+ **new DefaultMediaSourceExtension**(`mediaElement`: HTMLVideoElement, `eventEmitter`: EventEmitter, `config`: [PlayerConfigData](../interfaces/_src_app_core_config_model_player_config_data_.playerconfigdata.md), `logger`: [LoggerInterface](../interfaces/_src_app_core_logger_logger_interface_.loggerinterface.md)): *[DefaultMediaSourceExtension](_src_app_core_mse_default_media_source_extension_.defaultmediasourceextension.md)*

Defined in src/app/core/mse/default-media-source-extension.ts:18

**Parameters:**

Name | Type |
------ | ------ |
`mediaElement` | HTMLVideoElement |
`eventEmitter` | EventEmitter |
`config` | [PlayerConfigData](../interfaces/_src_app_core_config_model_player_config_data_.playerconfigdata.md) |
`logger` | [LoggerInterface](../interfaces/_src_app_core_logger_logger_interface_.loggerinterface.md) |

**Returns:** *[DefaultMediaSourceExtension](_src_app_core_mse_default_media_source_extension_.defaultmediasourceextension.md)*

## Properties

### `Private` backwardsMediaSrc

• **backwardsMediaSrc**: *string* = null

Defined in src/app/core/mse/default-media-source-extension.ts:13

___

### `Private` config

• **config**: *[PlayerConfigData](../interfaces/_src_app_core_config_model_player_config_data_.playerconfigdata.md)*

Defined in src/app/core/mse/default-media-source-extension.ts:15

___

### `Private` eventEmitter

• **eventEmitter**: *EventEmitter*

Defined in src/app/core/mse/default-media-source-extension.ts:17

___

### `Private` logger

• **logger**: *[LoggerInterface](../interfaces/_src_app_core_logger_logger_interface_.loggerinterface.md)*

Defined in src/app/core/mse/default-media-source-extension.ts:16

___

###  mainSource

• **mainSource**: *HTMLSourceElement*

Defined in src/app/core/mse/default-media-source-extension.ts:14

___

### `Private` mediaElement

• **mediaElement**: *HTMLVideoElement*

Defined in src/app/core/mse/default-media-source-extension.ts:18

___

### `Private` mediaSrc

• **mediaSrc**: *string* = null

Defined in src/app/core/mse/default-media-source-extension.ts:12

## Methods

###  destroy

▸ **destroy**(): *void*

*Implementation of [MediaSourceExtension](../interfaces/_src_app_core_mse_media_source_extension_.mediasourceextension.md)*

Defined in src/app/core/mse/default-media-source-extension.ts:69

**Returns:** *void*

___

###  getBackwardsSrc

▸ **getBackwardsSrc**(): *string | null*

*Implementation of [MediaSourceExtension](../interfaces/_src_app_core_mse_media_source_extension_.mediasourceextension.md)*

Defined in src/app/core/mse/default-media-source-extension.ts:31

**Returns:** *string | null*

___

###  getConfig

▸ **getConfig**(): *[PlayerConfigData](../interfaces/_src_app_core_config_model_player_config_data_.playerconfigdata.md)*

*Implementation of [MediaSourceExtension](../interfaces/_src_app_core_mse_media_source_extension_.mediasourceextension.md)*

Defined in src/app/core/mse/default-media-source-extension.ts:84

**Returns:** *[PlayerConfigData](../interfaces/_src_app_core_config_model_player_config_data_.playerconfigdata.md)*

___

###  getSrc

▸ **getSrc**(): *string*

*Implementation of [MediaSourceExtension](../interfaces/_src_app_core_mse_media_source_extension_.mediasourceextension.md)*

Defined in src/app/core/mse/default-media-source-extension.ts:27

**Returns:** *string*

___

###  handleError

▸ **handleError**(`event`: any): *void*

*Implementation of [MediaSourceExtension](../interfaces/_src_app_core_mse_media_source_extension_.mediasourceextension.md)*

Defined in src/app/core/mse/default-media-source-extension.ts:80

**Parameters:**

Name | Type |
------ | ------ |
`event` | any |

**Returns:** *void*

___

###  setConfig

▸ **setConfig**(): *any*

Defined in src/app/core/mse/default-media-source-extension.ts:87

**Returns:** *any*

___

###  setSrc

▸ **setSrc**(`config`: [PlayerConfigData](../interfaces/_src_app_core_config_model_player_config_data_.playerconfigdata.md)): *void*

*Implementation of [MediaSourceExtension](../interfaces/_src_app_core_mse_media_source_extension_.mediasourceextension.md)*

Defined in src/app/core/mse/default-media-source-extension.ts:35

**Parameters:**

Name | Type |
------ | ------ |
`config` | [PlayerConfigData](../interfaces/_src_app_core_config_model_player_config_data_.playerconfigdata.md) |

**Returns:** *void*

___

###  switchToBackwardsSrc

▸ **switchToBackwardsSrc**(): *Promise‹void›*

*Implementation of [MediaSourceExtension](../interfaces/_src_app_core_mse_media_source_extension_.mediasourceextension.md)*

Defined in src/app/core/mse/default-media-source-extension.ts:61

**Returns:** *Promise‹void›*

___

###  switchToMainSrc

▸ **switchToMainSrc**(): *Promise‹void›*

*Implementation of [MediaSourceExtension](../interfaces/_src_app_core_mse_media_source_extension_.mediasourceextension.md)*

Defined in src/app/core/mse/default-media-source-extension.ts:53

**Returns:** *Promise‹void›*
