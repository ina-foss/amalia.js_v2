[**Amalia**](../../../../../README.md)

***

[Amalia](../../../../../modules.md) / [core/directive/inaSortablejs/sortablejs.directive](../README.md) / SortablejsDirective

# Class: SortablejsDirective

Defined in: src/app/core/directive/inaSortablejs/sortablejs.directive.ts:40

## Implements

- `OnInit`
- `OnChanges`
- `OnDestroy`

## Constructors

### Constructor

> **new SortablejsDirective**(`globalConfig`, `service`, `element`, `zone`, `renderer`): `SortablejsDirective`

Defined in: src/app/core/directive/inaSortablejs/sortablejs.directive.ts:58

#### Parameters

##### globalConfig

`Options`

##### service

[`SortablejsService`](../../sortablejs.service/classes/SortablejsService.md)

##### element

`ElementRef`

##### zone

`NgZone`

##### renderer

`Renderer2`

#### Returns

`SortablejsDirective`

## Properties

### sortablejs

> **sortablejs**: `any`

Defined in: src/app/core/directive/inaSortablejs/sortablejs.directive.ts:43

***

### sortablejsCloneFunction()

> **sortablejsCloneFunction**: (`item`) => `any`

Defined in: src/app/core/directive/inaSortablejs/sortablejs.directive.ts:52

#### Parameters

##### item

`any`

#### Returns

`any`

***

### sortablejsContainer

> **sortablejsContainer**: `string`

Defined in: src/app/core/directive/inaSortablejs/sortablejs.directive.ts:46

***

### sortablejsInit

> **sortablejsInit**: `EventEmitter`\<`any`\>

Defined in: src/app/core/directive/inaSortablejs/sortablejs.directive.ts:56

***

### sortablejsOptions

> **sortablejsOptions**: `Options`

Defined in: src/app/core/directive/inaSortablejs/sortablejs.directive.ts:49

## Methods

### ngOnChanges()

> **ngOnChanges**(`changes`): `void`

Defined in: src/app/core/directive/inaSortablejs/sortablejs.directive.ts:73

A callback method that is invoked immediately after the
default change detector has checked data-bound properties
if at least one has changed, and before the view and content
children are checked.

#### Parameters

##### changes

The changed properties.

###### ngOnChanges

`SimpleChange`

###### ngOnDestroy

`SimpleChange`

###### ngOnInit

`SimpleChange`

###### sortablejs

`SimpleChange`

###### sortablejsCloneFunction

`SimpleChange`

###### sortablejsContainer

`SimpleChange`

###### sortablejsInit

`SimpleChange` = `...`

###### sortablejsOptions

`SimpleChange`

#### Returns

`void`

#### Implementation of

`OnChanges.ngOnChanges`

***

### ngOnDestroy()

> **ngOnDestroy**(): `void`

Defined in: src/app/core/directive/inaSortablejs/sortablejs.directive.ts:89

A callback method that performs custom clean-up, invoked immediately
before a directive, pipe, or service instance is destroyed.

#### Returns

`void`

#### Implementation of

`OnDestroy.ngOnDestroy`

***

### ngOnInit()

> **ngOnInit**(): `void`

Defined in: src/app/core/directive/inaSortablejs/sortablejs.directive.ts:67

A callback method that is invoked immediately after the
default change detector has checked the directive's
data-bound properties for the first time,
and before any of the view or content children have been checked.
It is invoked only once when the directive is instantiated.

#### Returns

`void`

#### Implementation of

`OnInit.ngOnInit`
