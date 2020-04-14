[Amalia](../README.md) › [Globals](../globals.md) › ["app/core/mse/default-media-source-extension"](../modules/_app_core_mse_default_media_source_extension_.md) › [DefaultMediaSourceExtension](_app_core_mse_default_media_source_extension_.defaultmediasourceextension.md)

# Class: DefaultMediaSourceExtension

In  charge to handle default media sources (Supported by browsers)

## Hierarchy

* **DefaultMediaSourceExtension**

## Implements

* [MediaSourceExtension](../interfaces/_app_core_mse_media_source_extension_.mediasourceextension.md)

## Index

### Constructors

* [constructor](_app_core_mse_default_media_source_extension_.defaultmediasourceextension.md#constructor)

### Properties

* [backwardsMediaSrc](_app_core_mse_default_media_source_extension_.defaultmediasourceextension.md#private-backwardsmediasrc)
* [config](_app_core_mse_default_media_source_extension_.defaultmediasourceextension.md#private-config)
* [eventEmitter](_app_core_mse_default_media_source_extension_.defaultmediasourceextension.md#private-eventemitter)
* [logger](_app_core_mse_default_media_source_extension_.defaultmediasourceextension.md#private-logger)
* [mainSource](_app_core_mse_default_media_source_extension_.defaultmediasourceextension.md#private-mainsource)
* [mediaElement](_app_core_mse_default_media_source_extension_.defaultmediasourceextension.md#private-mediaelement)
* [mediaSrc](_app_core_mse_default_media_source_extension_.defaultmediasourceextension.md#private-mediasrc)

### Methods

* [destroy](_app_core_mse_default_media_source_extension_.defaultmediasourceextension.md#destroy)
* [getBackwardsSrc](_app_core_mse_default_media_source_extension_.defaultmediasourceextension.md#getbackwardssrc)
* [getSrc](_app_core_mse_default_media_source_extension_.defaultmediasourceextension.md#getsrc)
* [handleError](_app_core_mse_default_media_source_extension_.defaultmediasourceextension.md#handleerror)
* [setSrc](_app_core_mse_default_media_source_extension_.defaultmediasourceextension.md#setsrc)
* [switchToBackwardsSrc](_app_core_mse_default_media_source_extension_.defaultmediasourceextension.md#switchtobackwardssrc)
* [switchToMainSrc](_app_core_mse_default_media_source_extension_.defaultmediasourceextension.md#switchtomainsrc)

## Constructors

###  constructor

\+ **new DefaultMediaSourceExtension**(`mediaElement`: HTMLVideoElement, `eventEmitter`: EventEmitter, `config`: [PlayerConfigData](../interfaces/_app_core_config_model_player_config_data_.playerconfigdata.md), `logger`: [LoggerInterface](../interfaces/_app_core_logger_logger_interface_.loggerinterface.md)): *[DefaultMediaSourceExtension](_app_core_mse_default_media_source_extension_.defaultmediasourceextension.md)*

Defined in src/app/core/mse/default-media-source-extension.ts:19

**Parameters:**

Name | Type |
------ | ------ |
`mediaElement` | HTMLVideoElement |
`eventEmitter` | EventEmitter |
`config` | [PlayerConfigData](../interfaces/_app_core_config_model_player_config_data_.playerconfigdata.md) |
`logger` | [LoggerInterface](../interfaces/_app_core_logger_logger_interface_.loggerinterface.md) |

**Returns:** *[DefaultMediaSourceExtension](_app_core_mse_default_media_source_extension_.defaultmediasourceextension.md)*

## Properties

### `Private` backwardsMediaSrc

• **backwardsMediaSrc**: *string* = null

Defined in src/app/core/mse/default-media-source-extension.ts:14

___

### `Private` config

• **config**: *[PlayerConfigData](../interfaces/_app_core_config_model_player_config_data_.playerconfigdata.md)*

Defined in src/app/core/mse/default-media-source-extension.ts:16

___

### `Private` eventEmitter

• **eventEmitter**: *EventEmitter*

Defined in src/app/core/mse/default-media-source-extension.ts:18

___

### `Private` logger

• **logger**: *[LoggerInterface](../interfaces/_app_core_logger_logger_interface_.loggerinterface.md)*

Defined in src/app/core/mse/default-media-source-extension.ts:17

___

### `Private` mainSource

• **mainSource**: *HTMLSourceElement*

Defined in src/app/core/mse/default-media-source-extension.ts:15

___

### `Private` mediaElement

• **mediaElement**: *HTMLVideoElement*

Defined in src/app/core/mse/default-media-source-extension.ts:19

___

### `Private` mediaSrc

• **mediaSrc**: *string* = null

Defined in src/app/core/mse/default-media-source-extension.ts:13

## Methods

###  destroy

▸ **destroy**(): *void*

*Implementation of [MediaSourceExtension](../interfaces/_app_core_mse_media_source_extension_.mediasourceextension.md)*

Defined in src/app/core/mse/default-media-source-extension.ts:67

**Returns:** *void*

___

###  getBackwardsSrc

▸ **getBackwardsSrc**(): *string | null*

*Implementation of [MediaSourceExtension](../interfaces/_app_core_mse_media_source_extension_.mediasourceextension.md)*

Defined in src/app/core/mse/default-media-source-extension.ts:32

**Returns:** *string | null*

___

###  getSrc

▸ **getSrc**(): *string*

*Implementation of [MediaSourceExtension](../interfaces/_app_core_mse_media_source_extension_.mediasourceextension.md)*

Defined in src/app/core/mse/default-media-source-extension.ts:28

**Returns:** *string*

___

###  handleError

▸ **handleError**(`event`: any): *void*

*Implementation of [MediaSourceExtension](../interfaces/_app_core_mse_media_source_extension_.mediasourceextension.md)*

Defined in src/app/core/mse/default-media-source-extension.ts:78

**Parameters:**

Name | Type |
------ | ------ |
`event` | any |

**Returns:** *void*

___

###  setSrc

▸ **setSrc**(`config`: [PlayerConfigData](../interfaces/_app_core_config_model_player_config_data_.playerconfigdata.md)): *void*

*Implementation of [MediaSourceExtension](../interfaces/_app_core_mse_media_source_extension_.mediasourceextension.md)*

Defined in src/app/core/mse/default-media-source-extension.ts:36

**Parameters:**

Name | Type |
------ | ------ |
`config` | [PlayerConfigData](../interfaces/_app_core_config_model_player_config_data_.playerconfigdata.md) |

**Returns:** *void*

___

###  switchToBackwardsSrc

▸ **switchToBackwardsSrc**(): *Promise‹void›*

*Implementation of [MediaSourceExtension](../interfaces/_app_core_mse_media_source_extension_.mediasourceextension.md)*

Defined in src/app/core/mse/default-media-source-extension.ts:59

**Returns:** *Promise‹void›*

___

###  switchToMainSrc

▸ **switchToMainSrc**(): *Promise‹void›*

*Implementation of [MediaSourceExtension](../interfaces/_app_core_mse_media_source_extension_.mediasourceextension.md)*

Defined in src/app/core/mse/default-media-source-extension.ts:51

**Returns:** *Promise‹void›*
