[Amalia](../README.md) › [Globals](../globals.md) › ["src/app/core/constant/error-type"](../modules/_src_app_core_constant_error_type_.md) › [PlayerErrorCode](_src_app_core_constant_error_type_.playererrorcode.md)

# Class: PlayerErrorCode

## Hierarchy

* **PlayerErrorCode**

## Index

### Properties

* [ABORT](_src_app_core_constant_error_type_.playererrorcode.md#static-abort)
* [ACCESS_DENIED](_src_app_core_constant_error_type_.playererrorcode.md#static-access_denied)
* [CUSTOM_ERROR](_src_app_core_constant_error_type_.playererrorcode.md#static-custom_error)
* [ERROR](_src_app_core_constant_error_type_.playererrorcode.md#static-error)
* [ERROR_HTML5_SUPPORT](_src_app_core_constant_error_type_.playererrorcode.md#static-error_html5_support)
* [ERROR_LOAD_PLUGIN](_src_app_core_constant_error_type_.playererrorcode.md#static-error_load_plugin)
* [ERROR_MANIFEST_DASH](_src_app_core_constant_error_type_.playererrorcode.md#static-error_manifest_dash)
* [ERROR_TO_CONVERT_METADATA](_src_app_core_constant_error_type_.playererrorcode.md#static-error_to_convert_metadata)
* [EXCEPTION](_src_app_core_constant_error_type_.playererrorcode.md#static-exception)
* [HTTP_ERROR](_src_app_core_constant_error_type_.playererrorcode.md#static-http_error)
* [MEDIA_FILE_NOT_FOUND](_src_app_core_constant_error_type_.playererrorcode.md#static-media_file_not_found)
* [METADATA_HTTP_LOAD_ERROR](_src_app_core_constant_error_type_.playererrorcode.md#static-metadata_http_load_error)
* [TIMEOUT](_src_app_core_constant_error_type_.playererrorcode.md#static-timeout)

### Methods

* [getMessage](_src_app_core_constant_error_type_.playererrorcode.md#static-getmessage)

## Properties

### `Static` ABORT

▪ **ABORT**: *number* = 6001

Defined in src/app/core/constant/error-type.ts:12

___

### `Static` ACCESS_DENIED

▪ **ACCESS_DENIED**: *number* = 1001

Defined in src/app/core/constant/error-type.ts:5

___

### `Static` CUSTOM_ERROR

▪ **CUSTOM_ERROR**: *number* = 3001

Defined in src/app/core/constant/error-type.ts:7

___

### `Static` ERROR

▪ **ERROR**: *number* = 8008

Defined in src/app/core/constant/error-type.ts:14

___

### `Static` ERROR_HTML5_SUPPORT

▪ **ERROR_HTML5_SUPPORT**: *number* = 8000

Defined in src/app/core/constant/error-type.ts:15

___

### `Static` ERROR_LOAD_PLUGIN

▪ **ERROR_LOAD_PLUGIN**: *number* = 9001

Defined in src/app/core/constant/error-type.ts:16

___

### `Static` ERROR_MANIFEST_DASH

▪ **ERROR_MANIFEST_DASH**: *number* = 9002

Defined in src/app/core/constant/error-type.ts:17

___

### `Static` ERROR_TO_CONVERT_METADATA

▪ **ERROR_TO_CONVERT_METADATA**: *number* = 5003

Defined in src/app/core/constant/error-type.ts:11

___

### `Static` EXCEPTION

▪ **EXCEPTION**: *number* = 4001

Defined in src/app/core/constant/error-type.ts:8

___

### `Static` HTTP_ERROR

▪ **HTTP_ERROR**: *number* = 5001

Defined in src/app/core/constant/error-type.ts:9

___

### `Static` MEDIA_FILE_NOT_FOUND

▪ **MEDIA_FILE_NOT_FOUND**: *number* = 2001

Defined in src/app/core/constant/error-type.ts:6

___

### `Static` METADATA_HTTP_LOAD_ERROR

▪ **METADATA_HTTP_LOAD_ERROR**: *number* = 5002

Defined in src/app/core/constant/error-type.ts:10

___

### `Static` TIMEOUT

▪ **TIMEOUT**: *number* = 7008

Defined in src/app/core/constant/error-type.ts:13

## Methods

### `Static` getMessage

▸ **getMessage**(`errorCode`: any): *string*

Defined in src/app/core/constant/error-type.ts:25

Return message by code error

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`errorCode` | any | error code number  |

**Returns:** *string*
