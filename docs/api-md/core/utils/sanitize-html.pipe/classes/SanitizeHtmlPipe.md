[**Amalia**](../../../../README.md)

***

[Amalia](../../../../modules.md) / [core/utils/sanitize-html.pipe](../README.md) / SanitizeHtmlPipe

# Class: SanitizeHtmlPipe

Defined in: src/app/core/utils/sanitize-html.pipe.ts:5

## Implements

- `PipeTransform`

## Constructors

### Constructor

> **new SanitizeHtmlPipe**(`sanitizer`): `SanitizeHtmlPipe`

Defined in: src/app/core/utils/sanitize-html.pipe.ts:8

#### Parameters

##### sanitizer

`DomSanitizer`

#### Returns

`SanitizeHtmlPipe`

## Properties

### sanitizer

> `protected` **sanitizer**: `DomSanitizer`

Defined in: src/app/core/utils/sanitize-html.pipe.ts:6

## Methods

### transform()

> **transform**(`value`, `type`): `SafeUrl` \| `SafeHtml` \| `SafeStyle` \| `SafeScript` \| `SafeResourceUrl`

Defined in: src/app/core/utils/sanitize-html.pipe.ts:12

#### Parameters

##### value

`any`

##### type

`string`

#### Returns

`SafeUrl` \| `SafeHtml` \| `SafeStyle` \| `SafeScript` \| `SafeResourceUrl`

#### Implementation of

`PipeTransform.transform`
