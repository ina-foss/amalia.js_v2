[**Amalia**](../../../../../README.md)

***

[Amalia](../../../../../modules.md) / [plugins/annotation/segment/segment.component](../README.md) / SegmentComponent

# Class: SegmentComponent

Defined in: src/app/plugins/annotation/segment/segment.component.ts:32

## Implements

- `OnInit`
- `AfterViewInit`
- `OnDestroy`

## Constructors

### Constructor

> **new SegmentComponent**(`messageService`, `cdr`, `annotationsService`): `SegmentComponent`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:123

#### Parameters

##### messageService

`MessageService`

##### cdr

`ChangeDetectorRef`

##### annotationsService

[`AnnotationsService`](../../../../../service/annotations.service/classes/AnnotationsService.md)

#### Returns

`SegmentComponent`

## Properties

### actionEmitter

> **actionEmitter**: `EventEmitter`\<[`AnnotationAction`](../../../../../core/metadata/model/annotation-localisation/interfaces/AnnotationAction.md)\>

Defined in: src/app/plugins/annotation/segment/segment.component.ts:54

***

### availableCategories

> **availableCategories**: `string`[] = `[]`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:41

***

### availableKeywords

> **availableKeywords**: `string`[] = `[]`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:43

***

### categories

> **categories**: `WritableSignal`\<`string`[]\>

Defined in: src/app/plugins/annotation/segment/segment.component.ts:104

***

### descp

> **descp**: `ElementRef`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:62

***

### displayMode

> **displayMode**: `InputSignal`\<`"new"` \| `"edit"` \| `"readonly"`\>

Defined in: src/app/plugins/annotation/segment/segment.component.ts:50

***

### editableSegmentTcWrap

> **editableSegmentTcWrap**: `boolean` = `false`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:120

***

### filteredCategories

> **filteredCategories**: `string`[]

Defined in: src/app/plugins/annotation/segment/segment.component.ts:90

***

### filteredKeywords

> **filteredKeywords**: `string`[]

Defined in: src/app/plugins/annotation/segment/segment.component.ts:91

***

### fps

> **fps**: [`FPS`](../../../../../core/constant/default/enumerations/DEFAULT.md#fps) = `DEFAULT.FPS`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:39

***

### hiddenCategoriesCount

> **hiddenCategoriesCount**: `number` = `0`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:92

***

### hiddenCategoriesSummaryChipId

> **hiddenCategoriesSummaryChipId**: `string` = `'hiddenCategoriesSummaryChip'`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:96

***

### hiddenKeywordsCount

> **hiddenKeywordsCount**: `number` = `0`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:93

***

### hiddenKeywordsSummaryChipId

> **hiddenKeywordsSummaryChipId**: `string` = `'hiddenKeywordsSummaryChip'`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:97

***

### isDescriptionCollapsed

> **isDescriptionCollapsed**: `boolean` = `true`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:78

***

### isDescriptionTruncated

> **isDescriptionTruncated**: `boolean` = `false`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:79

***

### isEllipsed

> **isEllipsed**: `boolean` = `false`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:77

***

### keywords

> **keywords**: `WritableSignal`\<`string`[]\>

Defined in: src/app/plugins/annotation/segment/segment.component.ts:105

***

### mediaPlayerElement

> **mediaPlayerElement**: [`MediaPlayerElement`](../../../../../core/media-player-element/classes/MediaPlayerElement.md)

Defined in: src/app/plugins/annotation/segment/segment.component.ts:45

***

### property

> **property**: `Signal`\<`object`[]\>

Defined in: src/app/plugins/annotation/segment/segment.component.ts:106

***

### propertyBeforeEdition

> **propertyBeforeEdition**: `object`[] = `[]`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:87

#### key

> **key**: `string`

#### value

> **value**: `string`

***

### readonlyCategoriesClassName

> **readonlyCategoriesClassName**: `string` = `'readonly-segment-categories'`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:94

***

### readOnlyCategoriesDiv

> **readOnlyCategoriesDiv**: `ElementRef`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:64

***

### readOnlyKeywordsClassName

> **readOnlyKeywordsClassName**: `string` = `'readonly-segment-keywords'`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:95

***

### readOnlyKeywordsDiv

> **readOnlyKeywordsDiv**: `ElementRef`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:66

***

### segment

> **segment**: [`AnnotationLocalisation`](../../../../../core/metadata/model/annotation-localisation/interfaces/AnnotationLocalisation.md)

Defined in: src/app/plugins/annotation/segment/segment.component.ts:35

***

### SEGMENT\_SANS\_TITRE

> `readonly` **SEGMENT\_SANS\_TITRE**: `string` = `SegmentComponent.SEGMENT_SANS_TITRE`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:101

***

### segmentForm

> **segmentForm**: `NgForm`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:58

***

### segmentTcRef

> **segmentTcRef**: `ElementRef`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:76

***

### setTcInvoked

> **setTcInvoked**: `boolean` = `false`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:86

***

### tcDisplayFormat

> **tcDisplayFormat**: `"s"` \| `"f"` = `'f'`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:37

***

### tcFormatted

> **tcFormatted**: `string`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:85

***

### tcIn

> **tcIn**: `InputSignal`\<`number`\>

Defined in: src/app/plugins/annotation/segment/segment.component.ts:48

***

### tcInFormatted

> **tcInFormatted**: `string`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:83

***

### tcInInputRef

> **tcInInputRef**: `ElementRef`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:70

***

### tcInputRef

> **tcInputRef**: `ElementRef`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:74

***

### tcOut

> **tcOut**: `InputSignal`\<`number`\>

Defined in: src/app/plugins/annotation/segment/segment.component.ts:49

***

### tcOutFormatted

> **tcOutFormatted**: `string`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:84

***

### tcOutInputRef

> **tcOutInputRef**: `ElementRef`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:72

***

### timeFormatPattern

> **timeFormatPattern**: `RegExp`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:81

***

### titlediv

> **titlediv**: `ElementRef`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:60

***

### toast

> **toast**: [`ToastComponent`](../../../../../core/toast/toast.component/classes/ToastComponent.md)

Defined in: src/app/plugins/annotation/segment/segment.component.ts:68

***

### SEGMENT\_SANS\_TITRE

> `static` **SEGMENT\_SANS\_TITRE**: `string` = `'Segment sans titre'`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:100

## Methods

### addToAvailableCategories()

> **addToAvailableCategories**(`$event`): `void`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:634

#### Parameters

##### $event

`any`[]

#### Returns

`void`

***

### addToAvailableKeywords()

> **addToAvailableKeywords**(`$event`): `void`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:642

#### Parameters

##### $event

`any`[]

#### Returns

`void`

***

### afterTcInValidation()

> **afterTcInValidation**(`value`): `void`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:308

#### Parameters

##### value

`any`

#### Returns

`void`

***

### afterTcOutValidation()

> **afterTcOutValidation**(`value`): `void`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:320

#### Parameters

##### value

`any`

#### Returns

`void`

***

### afterTcValidation()

> **afterTcValidation**(`value`): `void`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:334

#### Parameters

##### value

`any`

#### Returns

`void`

***

### applyShortcut()

> **applyShortcut**(`event`): `void`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:769

#### Parameters

##### event

[`ShortcutEvent`](../../../../../core/config/model/shortcuts-event/interfaces/ShortcutEvent.md)

#### Returns

`void`

***

### calculateTextWidth()

> **calculateTextWidth**(`text`, `font`): `number`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:735

#### Parameters

##### text

`string`

##### font

`string`

#### Returns

`number`

***

### cancelNewSegmentCreation()

> **cancelNewSegmentCreation**(): `void`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:503

#### Returns

`void`

***

### cloneSegment()

> **cloneSegment**(): `void`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:509

#### Returns

`void`

***

### displayRemaining()

> **displayRemaining**(`items`, `minus`): `string`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:650

#### Parameters

##### items

`string`[]

##### minus

`number`

#### Returns

`string`

***

### displaySnackBar()

> **displaySnackBar**(`msgContent`): `void`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:172

#### Parameters

##### msgContent

`any`

#### Returns

`void`

***

### doCheckTc()

> **doCheckTc**(): `void`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:252

#### Returns

`void`

***

### doCheckTcIn()

> **doCheckTcIn**(): `void`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:236

#### Returns

`void`

***

### doCheckTcOut()

> **doCheckTcOut**(): `void`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:244

#### Returns

`void`

***

### editSegment()

> **editSegment**(): `void`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:495

#### Returns

`void`

***

### handleShortcuts()

> **handleShortcuts**(`event`): `void`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:764

Apply shortcut if exists on keydown

#### Parameters

##### event

[`ShortcutEvent`](../../../../../core/config/model/shortcuts-event/interfaces/ShortcutEvent.md)

#### Returns

`void`

***

### muteShortCuts()

> **muteShortCuts**(): `void`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:758

#### Returns

`void`

***

### ngAfterViewInit()

> **ngAfterViewInit**(): `void`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:536

A callback method that is invoked immediately after
Angular has completed initialization of a component's view.
It is invoked only once when the view is instantiated.

#### Returns

`void`

#### Implementation of

`AfterViewInit.ngAfterViewInit`

***

### ngOnDestroy()

> **ngOnDestroy**(): `void`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:794

A callback method that performs custom clean-up, invoked immediately
before a directive, pipe, or service instance is destroyed.

#### Returns

`void`

#### Implementation of

`OnDestroy.ngOnDestroy`

***

### ngOnInit()

> **ngOnInit**(): `void`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:529

A callback method that is invoked immediately after the
default change detector has checked the directive's
data-bound properties for the first time,
and before any of the view or content children have been checked.
It is invoked only once when the directive is instantiated.

#### Returns

`void`

#### Implementation of

`OnInit.ngOnInit`

***

### openNotilusMaterial()

> **openNotilusMaterial**(): `void`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:791

#### Returns

`void`

***

### playMedia()

> **playMedia**(): `void`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:751

#### Returns

`void`

***

### readOnlyDescriptionReady()

> **readOnlyDescriptionReady**(): `boolean`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:549

#### Returns

`boolean`

***

### readOnlyTitleReady()

> **readOnlyTitleReady**(): `boolean`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:545

#### Returns

`boolean`

***

### removeSegment()

> **removeSegment**(): `void`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:513

#### Returns

`void`

***

### resetTcInFormControlErrors()

> **resetTcInFormControlErrors**(): `void`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:298

#### Returns

`void`

***

### resetTcOutFormControlErrors()

> **resetTcOutFormControlErrors**(): `void`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:287

#### Returns

`void`

***

### searchCategories()

> **searchCategories**(`$event`): `void`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:600

#### Parameters

##### $event

`AutoCompleteCompleteEvent`

#### Returns

`void`

***

### searchKeywords()

> **searchKeywords**(`$event`): `void`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:617

#### Parameters

##### $event

`AutoCompleteCompleteEvent`

#### Returns

`void`

***

### setCategoriesFromProperty()

> **setCategoriesFromProperty**(`props`): `void`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:521

#### Parameters

##### props

`any`

#### Returns

`void`

***

### setIsDescriptionTruncated()

> **setIsDescriptionTruncated**(): `void`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:567

#### Returns

`void`

***

### setIsEllipsed()

> **setIsEllipsed**(): `void`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:553

#### Returns

`void`

***

### setKeywordsFromProperty()

> **setKeywordsFromProperty**(`props`): `void`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:525

#### Parameters

##### props

`any`

#### Returns

`void`

***

### setTc()

> **setTc**(): `void`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:157

#### Returns

`void`

***

### tcValidators()

> **tcValidators**(`forTC`, `value`, `displaySnackBar?`): `any`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:260

#### Parameters

##### forTC

`"tc"` | `"tcIn"` | `"tcOut"`

##### value

`string`

##### displaySnackBar?

`boolean`

#### Returns

`any`

***

### textLatoWidthHigherThan()

> **textLatoWidthHigherThan**(`text`, `width`): `boolean`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:747

#### Parameters

##### text

`string`

##### width

`number`

#### Returns

`boolean`

***

### toggleDescription()

> **toggleDescription**(`event`): `void`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:585

#### Parameters

##### event

`Event`

#### Returns

`void`

***

### unmuteShortCuts()

> **unmuteShortCuts**(): `void`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:755

#### Returns

`void`

***

### updateCategoriesAndKeywordsDisplay()

> **updateCategoriesAndKeywordsDisplay**(): `void`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:659

#### Returns

`void`

***

### updateTcsDisplay()

> **updateTcsDisplay**(): `void`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:666

#### Returns

`void`

***

### updateThumbnail()

> **updateThumbnail**(): `void`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:517

#### Returns

`void`

***

### validateNewSegment()

> **validateNewSegment**(): `void`

Defined in: src/app/plugins/annotation/segment/segment.component.ts:146

#### Returns

`void`
