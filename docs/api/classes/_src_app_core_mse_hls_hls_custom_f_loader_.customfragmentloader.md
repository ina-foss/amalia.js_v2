[Amalia](../README.md) › [Globals](../globals.md) › ["src/app/core/mse/hls/hls-custom-f-loader"](../modules/_src_app_core_mse_hls_hls_custom_f_loader_.md) › [CustomFragmentLoader](_src_app_core_mse_hls_hls_custom_f_loader_.customfragmentloader.md)

# Class: CustomFragmentLoader <**T**>

Specified custom loader when uses switch channel audio,  loader  retry to load audio channel segment

## Type parameters

▪ **T**: *LoaderContext*

## Hierarchy

* Loader

  ↳ **CustomFragmentLoader**

## Implements

* Loader‹FragmentLoaderContext›

## Index

### Constructors

* [constructor](_src_app_core_mse_hls_hls_custom_f_loader_.customfragmentloader.md#constructor)

### Properties

* [context](_src_app_core_mse_hls_hls_custom_f_loader_.customfragmentloader.md#context)
* [getCacheAge](_src_app_core_mse_hls_hls_custom_f_loader_.customfragmentloader.md#optional-getcacheage)
* [getResponseHeader](_src_app_core_mse_hls_hls_custom_f_loader_.customfragmentloader.md#optional-getresponseheader)
* [stats](_src_app_core_mse_hls_hls_custom_f_loader_.customfragmentloader.md#stats)

### Methods

* [abort](_src_app_core_mse_hls_hls_custom_f_loader_.customfragmentloader.md#abort)
* [destroy](_src_app_core_mse_hls_hls_custom_f_loader_.customfragmentloader.md#destroy)
* [load](_src_app_core_mse_hls_hls_custom_f_loader_.customfragmentloader.md#load)

## Constructors

###  constructor

\+ **new CustomFragmentLoader**(`config`: any): *[CustomFragmentLoader](_src_app_core_mse_hls_hls_custom_f_loader_.customfragmentloader.md)*

Defined in src/app/core/mse/hls/hls-custom-f-loader.ts:6

**Parameters:**

Name | Type |
------ | ------ |
`config` | any |

**Returns:** *[CustomFragmentLoader](_src_app_core_mse_hls_hls_custom_f_loader_.customfragmentloader.md)*

## Properties

###  context

• **context**: *T*

*Inherited from [CustomFragmentLoader](_src_app_core_mse_hls_hls_custom_f_loader_.customfragmentloader.md).[context](_src_app_core_mse_hls_hls_custom_f_loader_.customfragmentloader.md#context)*

Defined in node_modules/hls.js/dist/hls.js.d.ts:2279

___

### `Optional` getCacheAge

• **getCacheAge**? : *function*

*Inherited from [CustomFragmentLoader](_src_app_core_mse_hls_hls_custom_f_loader_.customfragmentloader.md).[getCacheAge](_src_app_core_mse_hls_hls_custom_f_loader_.customfragmentloader.md#optional-getcacheage)*

Defined in node_modules/hls.js/dist/hls.js.d.ts:2277

`getCacheAge()` is called by hls.js to get the duration that a given object
has been sitting in a cache proxy when playing live.  If implemented,
this should return a value in seconds.

For HTTP based loaders, this should return the contents of the "age" header.

**`returns`** time object being lodaded

#### Type declaration:

▸ (): *number | null*

___

### `Optional` getResponseHeader

• **getResponseHeader**? : *function*

*Inherited from [CustomFragmentLoader](_src_app_core_mse_hls_hls_custom_f_loader_.customfragmentloader.md).[getResponseHeader](_src_app_core_mse_hls_hls_custom_f_loader_.customfragmentloader.md#optional-getresponseheader)*

Defined in node_modules/hls.js/dist/hls.js.d.ts:2278

#### Type declaration:

▸ (`name`: string): *string | null*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |

___

###  stats

• **stats**: *LoaderStats*

*Inherited from [CustomFragmentLoader](_src_app_core_mse_hls_hls_custom_f_loader_.customfragmentloader.md).[stats](_src_app_core_mse_hls_hls_custom_f_loader_.customfragmentloader.md#stats)*

Defined in node_modules/hls.js/dist/hls.js.d.ts:2280

## Methods

###  abort

▸ **abort**(): *void*

*Inherited from [CustomFragmentLoader](_src_app_core_mse_hls_hls_custom_f_loader_.customfragmentloader.md).[abort](_src_app_core_mse_hls_hls_custom_f_loader_.customfragmentloader.md#abort)*

Defined in node_modules/hls.js/dist/hls.js.d.ts:2266

**Returns:** *void*

___

###  destroy

▸ **destroy**(): *void*

*Inherited from [CustomFragmentLoader](_src_app_core_mse_hls_hls_custom_f_loader_.customfragmentloader.md).[destroy](_src_app_core_mse_hls_hls_custom_f_loader_.customfragmentloader.md#destroy)*

Defined in node_modules/hls.js/dist/hls.js.d.ts:2265

**Returns:** *void*

___

###  load

▸ **load**(`context`: LoaderContext, `loaderConfig`: any, `callbacks`: any): *void*

*Overrides void*

Defined in src/app/core/mse/hls/hls-custom-f-loader.ts:12

**Parameters:**

Name | Type |
------ | ------ |
`context` | LoaderContext |
`loaderConfig` | any |
`callbacks` | any |

**Returns:** *void*
