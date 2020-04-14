[Amalia](../README.md) › [Globals](../globals.md) › ["app/core/mse/hls/hls-custom-f-loader"](../modules/_app_core_mse_hls_hls_custom_f_loader_.md) › [HlsCustomFLoader](_app_core_mse_hls_hls_custom_f_loader_.hlscustomfloader.md)

# Class: HlsCustomFLoader

Specified custom loader when uses switch channel audio,  loader  retry to load audio channel segment
// TODO fix Audio channel

## Hierarchy

* Loader

  ↳ **HlsCustomFLoader**

## Index

### Constructors

* [constructor](_app_core_mse_hls_hls_custom_f_loader_.hlscustomfloader.md#constructor)

### Properties

* [_audioChannel](_app_core_mse_hls_hls_custom_f_loader_.hlscustomfloader.md#private-_audiochannel)

### Accessors

* [audioChannel](_app_core_mse_hls_hls_custom_f_loader_.hlscustomfloader.md#audiochannel)

### Methods

* [abort](_app_core_mse_hls_hls_custom_f_loader_.hlscustomfloader.md#abort)
* [destroy](_app_core_mse_hls_hls_custom_f_loader_.hlscustomfloader.md#destroy)
* [load](_app_core_mse_hls_hls_custom_f_loader_.hlscustomfloader.md#load)

## Constructors

###  constructor

\+ **new HlsCustomFLoader**(`config`: LoaderConfig): *[HlsCustomFLoader](_app_core_mse_hls_hls_custom_f_loader_.hlscustomfloader.md)*

*Overrides void*

Defined in src/app/core/mse/hls/hls-custom-f-loader.ts:7

**Parameters:**

Name | Type |
------ | ------ |
`config` | LoaderConfig |

**Returns:** *[HlsCustomFLoader](_app_core_mse_hls_hls_custom_f_loader_.hlscustomfloader.md)*

## Properties

### `Private` _audioChannel

• **_audioChannel**: *number* = 1

Defined in src/app/core/mse/hls/hls-custom-f-loader.ts:30

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

*Inherited from [HlsCustomFLoader](_app_core_mse_hls_hls_custom_f_loader_.hlscustomfloader.md).[abort](_app_core_mse_hls_hls_custom_f_loader_.hlscustomfloader.md#abort)*

Defined in node_modules/@types/hls.js/index.d.ts:116

Abort any loading in progress.

**Returns:** *void*

___

###  destroy

▸ **destroy**(): *void*

*Inherited from [HlsCustomFLoader](_app_core_mse_hls_hls_custom_f_loader_.hlscustomfloader.md).[destroy](_app_core_mse_hls_hls_custom_f_loader_.hlscustomfloader.md#destroy)*

Defined in node_modules/@types/hls.js/index.d.ts:120

Destroy loading context.

**Returns:** *void*

___

###  load

▸ **load**(`context`: LoaderContext, `config`: LoaderConfig, `callbacks`: LoaderCallbacks): *void*

*Inherited from [HlsCustomFLoader](_app_core_mse_hls_hls_custom_f_loader_.hlscustomfloader.md).[load](_app_core_mse_hls_hls_custom_f_loader_.hlscustomfloader.md#load)*

Defined in node_modules/@types/hls.js/index.d.ts:108

Start retrieving content located at given URL (HTTP GET).

**Parameters:**

Name | Type |
------ | ------ |
`context` | LoaderContext |
`config` | LoaderConfig |
`callbacks` | LoaderCallbacks |

**Returns:** *void*
