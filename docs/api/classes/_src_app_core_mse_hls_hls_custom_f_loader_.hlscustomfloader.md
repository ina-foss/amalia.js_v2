[Amalia](../README.md) › [Globals](../globals.md) › ["src/app/core/mse/hls/hls-custom-f-loader"](../modules/_src_app_core_mse_hls_hls_custom_f_loader_.md) › [HlsCustomFLoader](_src_app_core_mse_hls_hls_custom_f_loader_.hlscustomfloader.md)

# Class: HlsCustomFLoader <**T**>

Specified custom loader when uses switch channel audio,  loader  retry to load audio channel segment
// TODO fix Audio channel

## Type parameters

▪ **T**: *LoaderContext*

## Hierarchy

* Loader

  ↳ **HlsCustomFLoader**

## Index

### Constructors

* [constructor](_src_app_core_mse_hls_hls_custom_f_loader_.hlscustomfloader.md#constructor)

### Properties

* [_audioChannel](_src_app_core_mse_hls_hls_custom_f_loader_.hlscustomfloader.md#_audiochannel)
* [context](_src_app_core_mse_hls_hls_custom_f_loader_.hlscustomfloader.md#context)
* [getCacheAge](_src_app_core_mse_hls_hls_custom_f_loader_.hlscustomfloader.md#optional-getcacheage)
* [getResponseHeader](_src_app_core_mse_hls_hls_custom_f_loader_.hlscustomfloader.md#optional-getresponseheader)
* [stats](_src_app_core_mse_hls_hls_custom_f_loader_.hlscustomfloader.md#stats)

### Accessors

* [audioChannel](_src_app_core_mse_hls_hls_custom_f_loader_.hlscustomfloader.md#audiochannel)

### Methods

* [abort](_src_app_core_mse_hls_hls_custom_f_loader_.hlscustomfloader.md#abort)
* [destroy](_src_app_core_mse_hls_hls_custom_f_loader_.hlscustomfloader.md#destroy)
* [load](_src_app_core_mse_hls_hls_custom_f_loader_.hlscustomfloader.md#load)

## Constructors

###  constructor

\+ **new HlsCustomFLoader**(`config`: any): *[HlsCustomFLoader](_src_app_core_mse_hls_hls_custom_f_loader_.hlscustomfloader.md)*

Defined in src/app/core/mse/hls/hls-custom-f-loader.ts:7

**Parameters:**

Name | Type |
------ | ------ |
`config` | any |

**Returns:** *[HlsCustomFLoader](_src_app_core_mse_hls_hls_custom_f_loader_.hlscustomfloader.md)*

## Properties

###  _audioChannel

• **_audioChannel**: *number* = 1

Defined in src/app/core/mse/hls/hls-custom-f-loader.ts:30

___

###  context

• **context**: *T*

*Inherited from [HlsCustomFLoader](_src_app_core_mse_hls_hls_custom_f_loader_.hlscustomfloader.md).[context](_src_app_core_mse_hls_hls_custom_f_loader_.hlscustomfloader.md#context)*

Defined in node_modules/hls.js/dist/hls.js.d.ts:2277

___

### `Optional` getCacheAge

• **getCacheAge**? : *function*

*Inherited from [HlsCustomFLoader](_src_app_core_mse_hls_hls_custom_f_loader_.hlscustomfloader.md).[getCacheAge](_src_app_core_mse_hls_hls_custom_f_loader_.hlscustomfloader.md#optional-getcacheage)*

Defined in node_modules/hls.js/dist/hls.js.d.ts:2275

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

*Inherited from [HlsCustomFLoader](_src_app_core_mse_hls_hls_custom_f_loader_.hlscustomfloader.md).[getResponseHeader](_src_app_core_mse_hls_hls_custom_f_loader_.hlscustomfloader.md#optional-getresponseheader)*

Defined in node_modules/hls.js/dist/hls.js.d.ts:2276

#### Type declaration:

▸ (`name`: string): *string | null*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |

___

###  stats

• **stats**: *LoaderStats*

*Inherited from [HlsCustomFLoader](_src_app_core_mse_hls_hls_custom_f_loader_.hlscustomfloader.md).[stats](_src_app_core_mse_hls_hls_custom_f_loader_.hlscustomfloader.md#stats)*

Defined in node_modules/hls.js/dist/hls.js.d.ts:2278

## Accessors

###  audioChannel

• **get audioChannel**(): *number*

Defined in src/app/core/mse/hls/hls-custom-f-loader.ts:32

**Returns:** *number*

• **set audioChannel**(`value`: number): *void*

Defined in src/app/core/mse/hls/hls-custom-f-loader.ts:36

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*

## Methods

###  abort

▸ **abort**(): *void*

*Inherited from [HlsCustomFLoader](_src_app_core_mse_hls_hls_custom_f_loader_.hlscustomfloader.md).[abort](_src_app_core_mse_hls_hls_custom_f_loader_.hlscustomfloader.md#abort)*

Defined in node_modules/hls.js/dist/hls.js.d.ts:2264

**Returns:** *void*

___

###  destroy

▸ **destroy**(): *void*

*Inherited from [HlsCustomFLoader](_src_app_core_mse_hls_hls_custom_f_loader_.hlscustomfloader.md).[destroy](_src_app_core_mse_hls_hls_custom_f_loader_.hlscustomfloader.md#destroy)*

Defined in node_modules/hls.js/dist/hls.js.d.ts:2263

**Returns:** *void*

___

###  load

▸ **load**(`context`: LoaderContext, `config`: LoaderConfiguration, `callbacks`: LoaderCallbacks‹T›): *void*

*Inherited from [HlsCustomFLoader](_src_app_core_mse_hls_hls_custom_f_loader_.hlscustomfloader.md).[load](_src_app_core_mse_hls_hls_custom_f_loader_.hlscustomfloader.md#load)*

Defined in node_modules/hls.js/dist/hls.js.d.ts:2265

**Parameters:**

Name | Type |
------ | ------ |
`context` | LoaderContext |
`config` | LoaderConfiguration |
`callbacks` | LoaderCallbacks‹T› |

**Returns:** *void*
