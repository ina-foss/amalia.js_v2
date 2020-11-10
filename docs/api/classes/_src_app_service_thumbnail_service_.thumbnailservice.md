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
* [listThumbnails](_src_app_service_thumbnail_service_.thumbnailservice.md#listthumbnails)
* [loader](_src_app_service_thumbnail_service_.thumbnailservice.md#private-loader)
* [key](_src_app_service_thumbnail_service_.thumbnailservice.md#static-key)

### Methods

* [getThumbnail](_src_app_service_thumbnail_service_.thumbnailservice.md#getthumbnail)
* [loadThumbnail](_src_app_service_thumbnail_service_.thumbnailservice.md#loadthumbnail)

## Constructors

###  constructor

\+ **new ThumbnailService**(`httpClient`: HttpClient): *[ThumbnailService](_src_app_service_thumbnail_service_.thumbnailservice.md)*

Defined in src/app/service/thumbnail-service.ts:14

**Parameters:**

Name | Type |
------ | ------ |
`httpClient` | HttpClient |

**Returns:** *[ThumbnailService](_src_app_service_thumbnail_service_.thumbnailservice.md)*

## Properties

### `Private` httpClient

• **httpClient**: *HttpClient*

Defined in src/app/service/thumbnail-service.ts:12

___

###  listThumbnails

• **listThumbnails**: *Array‹object›* = []

Defined in src/app/service/thumbnail-service.ts:14

___

### `Private` loader

• **loader**: *[ThumbnailLoader](_src_app_core_loader_thumbnail_loader_.thumbnailloader.md)*

Defined in src/app/service/thumbnail-service.ts:13

___

### `Static` key

▪ **key**: *string* = "blob"

Defined in src/app/service/thumbnail-service.ts:11

## Methods

###  getThumbnail

▸ **getThumbnail**(`url`: any, `tc`: any): *Promise‹string›*

Defined in src/app/service/thumbnail-service.ts:23

If tc exist in listThumbnails return blob else call api to get blob

**Parameters:**

Name | Type |
------ | ------ |
`url` | any |
`tc` | any |

**Returns:** *Promise‹string›*

___

###  loadThumbnail

▸ **loadThumbnail**(`url`: any, `tc`: any): *Promise‹string›*

Defined in src/app/service/thumbnail-service.ts:35

Call loader to get blob

**Parameters:**

Name | Type |
------ | ------ |
`url` | any |
`tc` | any |

**Returns:** *Promise‹string›*
