[Amalia](../README.md) › [Globals](../globals.md) › ["src/app/core/mse/mpeg-dash-media-source-extension"](../modules/_src_app_core_mse_mpeg_dash_media_source_extension_.md) › [MPEGDashMediaSourceExtension](_src_app_core_mse_mpeg_dash_media_source_extension_.mpegdashmediasourceextension.md)

# Class: MPEGDashMediaSourceExtension

## Hierarchy

* **MPEGDashMediaSourceExtension**

## Implements

* [MediaSourceExtension](../interfaces/_src_app_core_mse_media_source_extension_.mediasourceextension.md)

## Index

### Methods

* [destroy](_src_app_core_mse_mpeg_dash_media_source_extension_.mpegdashmediasourceextension.md#destroy)
* [getBackwardsSrc](_src_app_core_mse_mpeg_dash_media_source_extension_.mpegdashmediasourceextension.md#getbackwardssrc)
* [getSrc](_src_app_core_mse_mpeg_dash_media_source_extension_.mpegdashmediasourceextension.md#getsrc)
* [handleError](_src_app_core_mse_mpeg_dash_media_source_extension_.mpegdashmediasourceextension.md#handleerror)
* [setSrc](_src_app_core_mse_mpeg_dash_media_source_extension_.mpegdashmediasourceextension.md#setsrc)
* [switchToBackwardsSrc](_src_app_core_mse_mpeg_dash_media_source_extension_.mpegdashmediasourceextension.md#switchtobackwardssrc)
* [switchToMainSrc](_src_app_core_mse_mpeg_dash_media_source_extension_.mpegdashmediasourceextension.md#switchtomainsrc)

## Methods

###  destroy

▸ **destroy**(): *void*

*Implementation of [MediaSourceExtension](../interfaces/_src_app_core_mse_media_source_extension_.mediasourceextension.md)*

Defined in src/app/core/mse/mpeg-dash-media-source-extension.ts:60

Not implemented

**`throws`** AmaliaException

**Returns:** *void*

___

###  getBackwardsSrc

▸ **getBackwardsSrc**(): *string | MediaStream | MediaSource | Blob | null*

*Implementation of [MediaSourceExtension](../interfaces/_src_app_core_mse_media_source_extension_.mediasourceextension.md)*

Defined in src/app/core/mse/mpeg-dash-media-source-extension.ts:32

Not implemented

**`throws`** AmaliaException

**Returns:** *string | MediaStream | MediaSource | Blob | null*

___

###  getSrc

▸ **getSrc**(): *any*

*Implementation of [MediaSourceExtension](../interfaces/_src_app_core_mse_media_source_extension_.mediasourceextension.md)*

Defined in src/app/core/mse/mpeg-dash-media-source-extension.ts:14

Not implemented

**`throws`** AmaliaException

**Returns:** *any*

___

###  handleError

▸ **handleError**(): *void*

Defined in src/app/core/mse/mpeg-dash-media-source-extension.ts:68

Not implemented

**`throws`** AmaliaException

**Returns:** *void*

___

###  setSrc

▸ **setSrc**(`src`: any): *void*

Defined in src/app/core/mse/mpeg-dash-media-source-extension.ts:23

Not implemented

**`throws`** AmaliaException

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`src` | any | media source |

**Returns:** *void*

___

###  switchToBackwardsSrc

▸ **switchToBackwardsSrc**(): *Promise‹void›*

*Implementation of [MediaSourceExtension](../interfaces/_src_app_core_mse_media_source_extension_.mediasourceextension.md)*

Defined in src/app/core/mse/mpeg-dash-media-source-extension.ts:48

Invoked to set backward source

**Returns:** *Promise‹void›*

___

###  switchToMainSrc

▸ **switchToMainSrc**(): *Promise‹void›*

*Implementation of [MediaSourceExtension](../interfaces/_src_app_core_mse_media_source_extension_.mediasourceextension.md)*

Defined in src/app/core/mse/mpeg-dash-media-source-extension.ts:39

Invoked to set main source

**Returns:** *Promise‹void›*
