[Amalia](../README.md) › [Globals](../globals.md) › ["src/app/service/thumbnail-service"](../modules/_src_app_service_thumbnail_service_.md) › [ThumbnailService](_src_app_service_thumbnail_service_.thumbnailservice.md)

# Class: ThumbnailService

Service contain all instance of players

## Hierarchy

* **ThumbnailService**

## Index

### Constructors

* [constructor](_src_app_service_thumbnail_service_.thumbnailservice.md#constructor)

### Properties

* [httpClient](_src_app_service_thumbnail_service_.thumbnailservice.md#private-httpclient)
* [image](_src_app_service_thumbnail_service_.thumbnailservice.md#image)
* [listThumbnails](_src_app_service_thumbnail_service_.thumbnailservice.md#listthumbnails)
* [loader](_src_app_service_thumbnail_service_.thumbnailservice.md#private-loader)

### Methods

* [getImage](_src_app_service_thumbnail_service_.thumbnailservice.md#getimage)
* [getThumbnail](_src_app_service_thumbnail_service_.thumbnailservice.md#getthumbnail)
* [loadThumbnail](_src_app_service_thumbnail_service_.thumbnailservice.md#loadthumbnail)

## Constructors

###  constructor

\+ **new ThumbnailService**(`httpClient`: HttpClient): *[ThumbnailService](_src_app_service_thumbnail_service_.thumbnailservice.md)*

Defined in src/app/service/thumbnail-service.ts:12

**Parameters:**

Name | Type |
------ | ------ |
`httpClient` | HttpClient |

**Returns:** *[ThumbnailService](_src_app_service_thumbnail_service_.thumbnailservice.md)*

## Properties

### `Private` httpClient

• **httpClient**: *HttpClient*

Defined in src/app/service/thumbnail-service.ts:9

___

###  image

• **image**: *any*

Defined in src/app/service/thumbnail-service.ts:12

___

###  listThumbnails

• **listThumbnails**: *Array‹object›*

Defined in src/app/service/thumbnail-service.ts:11

___

### `Private` loader

• **loader**: *[ThumbnailLoader](_src_app_core_loader_thumbnail_loader_.thumbnailloader.md)*

Defined in src/app/service/thumbnail-service.ts:10

## Methods

###  getImage

▸ **getImage**(`url`: any, `tc`: any): *Promise‹void›*

Defined in src/app/service/thumbnail-service.ts:42

**Parameters:**

Name | Type |
------ | ------ |
`url` | any |
`tc` | any |

**Returns:** *Promise‹void›*

___

###  getThumbnail

▸ **getThumbnail**(`url`: any, `tc`: any): *any*

Defined in src/app/service/thumbnail-service.ts:19

**Parameters:**

Name | Type |
------ | ------ |
`url` | any |
`tc` | any |

**Returns:** *any*

___

###  loadThumbnail

▸ **loadThumbnail**(`url`: any, `tc`: any): *Promise‹unknown›*

Defined in src/app/service/thumbnail-service.ts:29

**Parameters:**

Name | Type |
------ | ------ |
`url` | any |
`tc` | any |

**Returns:** *Promise‹unknown›*
