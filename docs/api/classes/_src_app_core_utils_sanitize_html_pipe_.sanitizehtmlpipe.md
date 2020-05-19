[Amalia](../README.md) › [Globals](../globals.md) › ["src/app/core/utils/sanitize-html.pipe"](../modules/_src_app_core_utils_sanitize_html_pipe_.md) › [SanitizeHtmlPipe](_src_app_core_utils_sanitize_html_pipe_.sanitizehtmlpipe.md)

# Class: SanitizeHtmlPipe

## Hierarchy

* **SanitizeHtmlPipe**

## Implements

* PipeTransform

## Index

### Constructors

* [constructor](_src_app_core_utils_sanitize_html_pipe_.sanitizehtmlpipe.md#constructor)

### Properties

* [sanitizer](_src_app_core_utils_sanitize_html_pipe_.sanitizehtmlpipe.md#protected-sanitizer)

### Methods

* [transform](_src_app_core_utils_sanitize_html_pipe_.sanitizehtmlpipe.md#transform)

## Constructors

###  constructor

\+ **new SanitizeHtmlPipe**(`sanitizer`: DomSanitizer): *[SanitizeHtmlPipe](_src_app_core_utils_sanitize_html_pipe_.sanitizehtmlpipe.md)*

Defined in src/app/core/utils/sanitize-html.pipe.ts:6

**Parameters:**

Name | Type |
------ | ------ |
`sanitizer` | DomSanitizer |

**Returns:** *[SanitizeHtmlPipe](_src_app_core_utils_sanitize_html_pipe_.sanitizehtmlpipe.md)*

## Properties

### `Protected` sanitizer

• **sanitizer**: *DomSanitizer*

Defined in src/app/core/utils/sanitize-html.pipe.ts:6

## Methods

###  transform

▸ **transform**(`value`: any, `type`: string): *SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl*

Defined in src/app/core/utils/sanitize-html.pipe.ts:12

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |
`type` | string |

**Returns:** *SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl*
