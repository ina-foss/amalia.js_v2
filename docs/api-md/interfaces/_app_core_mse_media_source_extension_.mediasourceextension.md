[Amalia](../README.md) › [Globals](../globals.md) › ["app/core/mse/media-source-extension"](../modules/_app_core_mse_media_source_extension_.md) › [MediaSourceExtension](_app_core_mse_media_source_extension_.mediasourceextension.md)

# Interface: MediaSourceExtension

In charge to handle MediaSourceExtension

## Hierarchy

* **MediaSourceExtension**

## Implemented by

* [DefaultMediaSourceExtension](../classes/_app_core_mse_default_media_source_extension_.defaultmediasourceextension.md)
* [HLSMediaSourceExtension](../classes/_app_core_mse_hls_hls_media_source_extension_.hlsmediasourceextension.md)
* [MPEGDashMediaSourceExtension](../classes/_app_core_mse_mpeg_dash_media_source_extension_.mpegdashmediasourceextension.md)

## Index

### Methods

* [destroy](_app_core_mse_media_source_extension_.mediasourceextension.md#destroy)
* [getBackwardsSrc](_app_core_mse_media_source_extension_.mediasourceextension.md#getbackwardssrc)
* [getSrc](_app_core_mse_media_source_extension_.mediasourceextension.md#getsrc)
* [handleError](_app_core_mse_media_source_extension_.mediasourceextension.md#handleerror)
* [setSrc](_app_core_mse_media_source_extension_.mediasourceextension.md#setsrc)
* [switchToBackwardsSrc](_app_core_mse_media_source_extension_.mediasourceextension.md#switchtobackwardssrc)
* [switchToMainSrc](_app_core_mse_media_source_extension_.mediasourceextension.md#switchtomainsrc)

## Methods

###  destroy

▸ **destroy**(): *void*

Defined in src/app/core/mse/media-source-extension.ts:38

Invoked for clean buffer

**Returns:** *void*

___

###  getBackwardsSrc

▸ **getBackwardsSrc**(): *string | MediaStream | MediaSource | Blob | null*

Defined in src/app/core/mse/media-source-extension.ts:23

Invoked on reverse mode

**Returns:** *string | MediaStream | MediaSource | Blob | null*

___

###  getSrc

▸ **getSrc**(): *string | MediaStream | MediaSource | Blob | null*

Defined in src/app/core/mse/media-source-extension.ts:18

Invoked to get source

**Returns:** *string | MediaStream | MediaSource | Blob | null*

___

###  handleError

▸ **handleError**(`event`: any): *void*

Defined in src/app/core/mse/media-source-extension.ts:44

Invoked when error to load source,
Emmit event Error

**Parameters:**

Name | Type |
------ | ------ |
`event` | any |

**Returns:** *void*

___

###  setSrc

▸ **setSrc**(`config`: [PlayerConfigData](_app_core_config_model_player_config_data_.playerconfigdata.md)): *any*

Defined in src/app/core/mse/media-source-extension.ts:13

Invoked to set source

**Parameters:**

Name | Type |
------ | ------ |
`config` | [PlayerConfigData](_app_core_config_model_player_config_data_.playerconfigdata.md) |

**Returns:** *any*

___

###  switchToBackwardsSrc

▸ **switchToBackwardsSrc**(): *Promise‹void›*

Defined in src/app/core/mse/media-source-extension.ts:33

Invoked to set backward source

**Returns:** *Promise‹void›*

___

###  switchToMainSrc

▸ **switchToMainSrc**(): *Promise‹void›*

Defined in src/app/core/mse/media-source-extension.ts:28

Invoked to set main source

**Returns:** *Promise‹void›*
