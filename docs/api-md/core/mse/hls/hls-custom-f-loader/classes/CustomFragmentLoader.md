[**Amalia**](../../../../../README.md)

***

[Amalia](../../../../../modules.md) / [core/mse/hls/hls-custom-f-loader](../README.md) / CustomFragmentLoader

# Class: CustomFragmentLoader

Defined in: src/app/core/mse/hls/hls-custom-f-loader.ts:6

Specified custom loader when uses switch channel audio,  loader  retry to load audio channel segment

## Extends

- `Loader`\<`FragmentLoaderContext`, `this`\>

## Implements

- `Loader`\<`FragmentLoaderContext`\>

## Constructors

### Constructor

> **new CustomFragmentLoader**(`config`): `CustomFragmentLoader`

Defined in: src/app/core/mse/hls/hls-custom-f-loader.ts:6

#### Parameters

##### config

`any`

#### Returns

`CustomFragmentLoader`

#### Inherited from

`(Hls.DefaultConfig.loader as new (config: any) => Loader<FragmentLoaderContext>).constructor`

## Properties

### context

> **context**: `FragmentLoaderContext`

Defined in: node\_modules/hls.js/dist/hls.d.ts:2876

#### Implementation of

`Loader.context`

#### Inherited from

`(Hls.DefaultConfig.loader as new (config: any) => Loader<FragmentLoaderContext>).context`

***

### getCacheAge()?

> `optional` **getCacheAge**: () => `number`

Defined in: node\_modules/hls.js/dist/hls.d.ts:2874

`getCacheAge()` is called by hls.js to get the duration that a given object
has been sitting in a cache proxy when playing live.  If implemented,
this should return a value in seconds.

For HTTP based loaders, this should return the contents of the "age" header.

#### Returns

`number`

time object being lodaded

#### Implementation of

`Loader.getCacheAge`

#### Inherited from

`(Hls.DefaultConfig.loader as new (config: any) => Loader<FragmentLoaderContext>).getCacheAge`

***

### getResponseHeader()?

> `optional` **getResponseHeader**: (`name`) => `string`

Defined in: node\_modules/hls.js/dist/hls.d.ts:2875

#### Parameters

##### name

`string`

#### Returns

`string`

#### Implementation of

`Loader.getResponseHeader`

#### Inherited from

`(Hls.DefaultConfig.loader as new (config: any) => Loader<FragmentLoaderContext>).getResponseHeader`

***

### stats

> **stats**: `LoaderStats`

Defined in: node\_modules/hls.js/dist/hls.d.ts:2877

#### Implementation of

`Loader.stats`

#### Inherited from

`(Hls.DefaultConfig.loader as new (config: any) => Loader<FragmentLoaderContext>).stats`

## Methods

### abort()

> **abort**(): `void`

Defined in: node\_modules/hls.js/dist/hls.d.ts:2863

#### Returns

`void`

#### Implementation of

`Loader.abort`

#### Inherited from

`(Hls.DefaultConfig.loader as new (config: any) => Loader<FragmentLoaderContext>).abort`

***

### destroy()

> **destroy**(): `void`

Defined in: node\_modules/hls.js/dist/hls.d.ts:2862

#### Returns

`void`

#### Implementation of

`Loader.destroy`

#### Inherited from

`(Hls.DefaultConfig.loader as new (config: any) => Loader<FragmentLoaderContext>).destroy`

***

### load()

> **load**(`context`, `loaderConfig`, `callbacks`): `void`

Defined in: src/app/core/mse/hls/hls-custom-f-loader.ts:8

#### Parameters

##### context

`FragmentLoaderContext`

##### loaderConfig

`any`

##### callbacks

`any`

#### Returns

`void`

#### Implementation of

`Loader.load`

#### Overrides

`(Hls.DefaultConfig.loader as new (config: any) => Loader<FragmentLoaderContext>).load`
