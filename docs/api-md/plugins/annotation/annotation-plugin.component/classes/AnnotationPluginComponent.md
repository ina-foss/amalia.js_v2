[**Amalia**](../../../../README.md)

***

[Amalia](../../../../modules.md) / [plugins/annotation/annotation-plugin.component](../README.md) / AnnotationPluginComponent

# Class: AnnotationPluginComponent

Defined in: src/app/plugins/annotation/annotation-plugin.component.ts:42

Base class for create plugin

## Extends

- [`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md)\<[`AnnotationConfig`](../../../../core/config/model/annotation-config/interfaces/AnnotationConfig.md)\>

## Implements

- `OnDestroy`

## Constructors

### Constructor

> **new AnnotationPluginComponent**(`confirmationService`, `playerService`, `fileService`, `cdr`, `annotationsService`): `AnnotationPluginComponent`

Defined in: src/app/plugins/annotation/annotation-plugin.component.ts:223

#### Parameters

##### confirmationService

`ConfirmationService`

##### playerService

[`MediaPlayerService`](../../../../service/media-player-service/classes/MediaPlayerService.md)

##### fileService

[`FileService`](../../../../service/file.service/classes/FileService.md)

##### cdr

`ChangeDetectorRef`

##### annotationsService

[`AnnotationsService`](../../../../service/annotations.service/classes/AnnotationsService.md)

#### Returns

`AnnotationPluginComponent`

#### Overrides

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`constructor`](../../../../core/plugin/plugin-base/classes/PluginBase.md#constructor)

## Properties

### \_player

> **\_player**: `any`

Defined in: src/app/core/plugin/plugin-base.ts:42

This plugin configuration

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`_player`](../../../../core/plugin/plugin-base/classes/PluginBase.md#_player)

***

### \_pluginConfiguration

> **\_pluginConfiguration**: [`PluginConfigData`](../../../../core/config/model/plugin-config-data/interfaces/PluginConfigData.md)\<[`AnnotationConfig`](../../../../core/config/model/annotation-config/interfaces/AnnotationConfig.md)\>

Defined in: src/app/core/plugin/plugin-base.ts:97

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`_pluginConfiguration`](../../../../core/plugin/plugin-base/classes/PluginBase.md#_pluginconfiguration)

***

### annotationElement

> **annotationElement**: `ElementRef`\<`HTMLElement`\>

Defined in: src/app/plugins/annotation/annotation-plugin.component.ts:59

***

### assetId

> **assetId**: `string`

Defined in: src/app/plugins/annotation/annotation-plugin.component.ts:65

***

### autoScroll

> **autoScroll**: `boolean` = `true`

Defined in: src/app/plugins/annotation/annotation-plugin.component.ts:55

***

### availableCategories

> **availableCategories**: `string`[] = `[]`

Defined in: src/app/plugins/annotation/annotation-plugin.component.ts:63

***

### availableKeywords

> **availableKeywords**: `string`[] = `[]`

Defined in: src/app/plugins/annotation/annotation-plugin.component.ts:64

***

### currentTime

> **currentTime**: `number`

Defined in: src/app/plugins/annotation/annotation-plugin.component.ts:57

***

### dataLoading

> **dataLoading**: `boolean` = `false`

Defined in: src/app/core/plugin/plugin-base.ts:26

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`dataLoading`](../../../../core/plugin/plugin-base/classes/PluginBase.md#dataloading)

***

### enabledExportButtons

> **enabledExportButtons**: `boolean` = `false`

Defined in: src/app/plugins/annotation/annotation-plugin.component.ts:67

***

### fps

> **fps**: [`FPS`](../../../../core/constant/default/enumerations/DEFAULT.md#fps) = `DEFAULT.FPS`

Defined in: src/app/plugins/annotation/annotation-plugin.component.ts:54

#### Overrides

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`fps`](../../../../core/plugin/plugin-base/classes/PluginBase.md#fps)

***

### initAlreadyCalled

> **initAlreadyCalled**: `boolean` = `false`

Defined in: src/app/core/plugin/plugin-base.ts:38

When false, means that the init function was not called yet

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`initAlreadyCalled`](../../../../core/plugin/plugin-base/classes/PluginBase.md#initalreadycalled)

***

### initialized

> **initialized**: `any`

Defined in: src/app/core/plugin/plugin-base.ts:25

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`initialized`](../../../../core/plugin/plugin-base/classes/PluginBase.md#initialized)

***

### intervalStep

> **intervalStep**: `number` = `5`

Defined in: src/app/core/plugin/plugin-base.ts:28

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`intervalStep`](../../../../core/plugin/plugin-base/classes/PluginBase.md#intervalstep)

***

### link

> **link**: `string`

Defined in: src/app/plugins/annotation/annotation-plugin.component.ts:66

***

### logger

> **logger**: [`DefaultLogger`](../../../../core/logger/default-logger/classes/DefaultLogger.md)

Defined in: src/app/core/plugin/plugin-base.ts:122

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`logger`](../../../../core/plugin/plugin-base/classes/PluginBase.md#logger)

***

### mediaPlayerElement

> **mediaPlayerElement**: [`MediaPlayerElement`](../../../../core/media-player-element/classes/MediaPlayerElement.md)

Defined in: src/app/core/plugin/plugin-base.ts:119

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`mediaPlayerElement`](../../../../core/plugin/plugin-base/classes/PluginBase.md#mediaplayerelement)

***

### noSpinner

> **noSpinner**: `boolean` = `true`

Defined in: src/app/core/plugin/plugin-base.ts:29

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`noSpinner`](../../../../core/plugin/plugin-base/classes/PluginBase.md#nospinner)

***

### playerId

> **playerId**: `any` = `null`

Defined in: src/app/core/plugin/plugin-base.ts:21

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`playerId`](../../../../core/plugin/plugin-base/classes/PluginBase.md#playerid)

***

### playerService

> **playerService**: [`MediaPlayerService`](../../../../service/media-player-service/classes/MediaPlayerService.md)

Defined in: src/app/core/plugin/plugin-base.ts:116

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`playerService`](../../../../core/plugin/plugin-base/classes/PluginBase.md#playerservice)

***

### pluginConfSetThroughInit

> **pluginConfSetThroughInit**: `boolean` = `false`

Defined in: src/app/core/plugin/plugin-base.ts:34

When false, it means that the pluginConfiguration was set through the template's attribute

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`pluginConfSetThroughInit`](../../../../core/plugin/plugin-base/classes/PluginBase.md#pluginconfsetthroughinit)

***

### pluginInstance

> **pluginInstance**: `string` = `''`

Defined in: src/app/core/plugin/plugin-base.ts:118

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`pluginInstance`](../../../../core/plugin/plugin-base/classes/PluginBase.md#plugininstance)

***

### pluginName

> `protected` **pluginName**: `string`

Defined in: src/app/core/plugin/plugin-base.ts:121

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`pluginName`](../../../../core/plugin/plugin-base/classes/PluginBase.md#pluginname)

***

### segmentBeforeEdition

> **segmentBeforeEdition**: [`AnnotationLocalisation`](../../../../core/metadata/model/annotation-localisation/interfaces/AnnotationLocalisation.md)

Defined in: src/app/plugins/annotation/annotation-plugin.component.ts:56

***

### segmentsInfo

> **segmentsInfo**: [`AnnotationLocalisation`](../../../../core/metadata/model/annotation-localisation/interfaces/AnnotationLocalisation.md)

Defined in: src/app/plugins/annotation/annotation-plugin.component.ts:46

***

### subscriptionToEventsEmitters

> **subscriptionToEventsEmitters**: `Subscription`[] = `[]`

Defined in: src/app/core/plugin/plugin-base.ts:30

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`subscriptionToEventsEmitters`](../../../../core/plugin/plugin-base/classes/PluginBase.md#subscriptiontoeventsemitters)

***

### tcDisplayFormat

> **tcDisplayFormat**: `"h"` \| `"m"` \| `"s"` \| `"minutes"` \| `"f"` \| `"ms"` \| `"mms"` \| `"hours"` \| `"seconds"` = `'s'`

Defined in: src/app/plugins/annotation/annotation-plugin.component.ts:53

***

### tcOffset

> **tcOffset**: `any`

Defined in: src/app/core/plugin/plugin-base.ts:23

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`tcOffset`](../../../../core/plugin/plugin-base/classes/PluginBase.md#tcoffset)

***

### technical\_id

> **technical\_id**: `string`

Defined in: src/app/plugins/annotation/annotation-plugin.component.ts:68

***

### timeFormat

> **timeFormat**: `any`

Defined in: src/app/core/plugin/plugin-base.ts:22

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`timeFormat`](../../../../core/plugin/plugin-base/classes/PluginBase.md#timeformat)

***

### timeout

> **timeout**: `number` = `30000`

Defined in: src/app/core/plugin/plugin-base.ts:27

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`timeout`](../../../../core/plugin/plugin-base/classes/PluginBase.md#timeout)

***

### toast

> **toast**: [`ToastComponent`](../../../../core/toast/toast.component/classes/ToastComponent.md)

Defined in: src/app/plugins/annotation/annotation-plugin.component.ts:61

***

### KARAOKE\_TC\_DELTA

> `static` **KARAOKE\_TC\_DELTA**: `number` = `0.250`

Defined in: src/app/plugins/annotation/annotation-plugin.component.ts:44

***

### PLUGIN\_NAME

> `static` **PLUGIN\_NAME**: `string` = `'ANNOTATIONS'`

Defined in: src/app/plugins/annotation/annotation-plugin.component.ts:43

## Accessors

### player

#### Get Signature

> **get** **player**(): `any`

Defined in: src/app/core/plugin/plugin-base.ts:44

##### Returns

`any`

#### Set Signature

> **set** **player**(`value`): `void`

Defined in: src/app/core/plugin/plugin-base.ts:49

##### Parameters

###### value

`any`

##### Returns

`void`

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`player`](../../../../core/plugin/plugin-base/classes/PluginBase.md#player)

***

### pluginConfiguration

#### Get Signature

> **get** **pluginConfiguration**(): [`PluginConfigData`](../../../../core/config/model/plugin-config-data/interfaces/PluginConfigData.md)\<`T`\>

Defined in: src/app/core/plugin/plugin-base.ts:99

##### Returns

[`PluginConfigData`](../../../../core/config/model/plugin-config-data/interfaces/PluginConfigData.md)\<`T`\>

#### Set Signature

> **set** **pluginConfiguration**(`value`): `void`

Defined in: src/app/core/plugin/plugin-base.ts:104

##### Parameters

###### value

[`PluginConfigData`](../../../../core/config/model/plugin-config-data/interfaces/PluginConfigData.md)\<`T`\>

##### Returns

`void`

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`pluginConfiguration`](../../../../core/plugin/plugin-base/classes/PluginBase.md#pluginconfiguration)

## Methods

### addListener()

> **addListener**(`element`, `playerEventType`, `func`): `void`

Defined in: src/app/core/plugin/plugin-base.ts:145

#### Parameters

##### element

`any`

##### playerEventType

[`PlayerEventType`](../../../../core/constant/event-type/enumerations/PlayerEventType.md)

##### func

`any`

#### Returns

`void`

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`addListener`](../../../../core/plugin/plugin-base/classes/PluginBase.md#addlistener)

***

### applyShortcut()

> **applyShortcut**(`event`): `void`

Defined in: src/app/plugins/annotation/annotation-plugin.component.ts:98

#### Parameters

##### event

[`ShortcutEvent`](../../../../core/config/model/shortcuts-event/interfaces/ShortcutEvent.md)

#### Returns

`void`

***

### cancelNewSegmentEdition()

> **cancelNewSegmentEdition**(`segment`): `void`

Defined in: src/app/plugins/annotation/annotation-plugin.component.ts:390

#### Parameters

##### segment

`any`

#### Returns

`void`

***

### displayEventResponseStatus()

> **displayEventResponseStatus**(`event`): `void`

Defined in: src/app/plugins/annotation/annotation-plugin.component.ts:439

#### Parameters

##### event

`any`

#### Returns

`void`

***

### displaySnackBar()

> **displaySnackBar**(`msgContent`, `severity?`, `life?`): `void`

Defined in: src/app/plugins/annotation/annotation-plugin.component.ts:750

#### Parameters

##### msgContent

`any`

##### severity?

`"error"` | `"success"` | `"warn"` | `"info"` | `"contrast"` | `"secondary"`

##### life?

`number`

#### Returns

`void`

***

### downloadSegmentJsonFormat()

> **downloadSegmentJsonFormat**(): `void`

Defined in: src/app/plugins/annotation/annotation-plugin.component.ts:707

#### Returns

`void`

***

### downloadSegments()

> **downloadSegments**(): `void`

Defined in: src/app/plugins/annotation/annotation-plugin.component.ts:713

#### Returns

`void`

***

### editSegment()

> **editSegment**(`segment`): `void`

Defined in: src/app/plugins/annotation/annotation-plugin.component.ts:337

#### Parameters

##### segment

`any`

#### Returns

`void`

***

### getDefaultConfig()

> **getDefaultConfig**(): [`PluginConfigData`](../../../../core/config/model/plugin-config-data/interfaces/PluginConfigData.md)\<[`AnnotationConfig`](../../../../core/config/model/annotation-config/interfaces/AnnotationConfig.md)\>

Defined in: src/app/plugins/annotation/annotation-plugin.component.ts:203

#### Returns

[`PluginConfigData`](../../../../core/config/model/plugin-config-data/interfaces/PluginConfigData.md)\<[`AnnotationConfig`](../../../../core/config/model/annotation-config/interfaces/AnnotationConfig.md)\>

#### Overrides

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`getDefaultConfig`](../../../../core/plugin/plugin-base/classes/PluginBase.md#getdefaultconfig)

***

### getJsonDataFromAnnotations()

> **getJsonDataFromAnnotations**(): [`ExportColumnsHeader`](../interfaces/ExportColumnsHeader.md)[]

Defined in: src/app/plugins/annotation/annotation-plugin.component.ts:719

#### Returns

[`ExportColumnsHeader`](../interfaces/ExportColumnsHeader.md)[]

***

### handleMetadataLoaded()

> **handleMetadataLoaded**(): `void`

Defined in: src/app/plugins/annotation/annotation-plugin.component.ts:199

Invoked on metadata loaded

#### Returns

`void`

#### Overrides

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`handleMetadataLoaded`](../../../../core/plugin/plugin-base/classes/PluginBase.md#handlemetadataloaded)

***

### handleShortcuts()

> **handleShortcuts**(`event`): `void`

Defined in: src/app/plugins/annotation/annotation-plugin.component.ts:93

Apply shortcut if exists on keydown

#### Parameters

##### event

[`ShortcutEvent`](../../../../core/config/model/shortcuts-event/interfaces/ShortcutEvent.md)

#### Returns

`void`

***

### init()

> **init**(): `void`

Defined in: src/app/plugins/annotation/annotation-plugin.component.ts:125

#### Returns

`void`

#### Overrides

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`init`](../../../../core/plugin/plugin-base/classes/PluginBase.md#init)

***

### initializeNewSegment()

> **initializeNewSegment**(): `void`

Defined in: src/app/plugins/annotation/annotation-plugin.component.ts:232

#### Returns

`void`

***

### initSegmentData()

> **initSegmentData**(): `Promise`\<`void`\>

Defined in: src/app/plugins/annotation/annotation-plugin.component.ts:242

#### Returns

`Promise`\<`void`\>

***

### isMainAnnotationComponent()

> **isMainAnnotationComponent**(): `boolean`

Defined in: src/app/plugins/annotation/annotation-plugin.component.ts:807

#### Returns

`boolean`

***

### logWaitForTcOffsetComplete()

> **logWaitForTcOffsetComplete**(): `void`

Defined in: src/app/core/plugin/plugin-base.ts:57

#### Returns

`void`

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`logWaitForTcOffsetComplete`](../../../../core/plugin/plugin-base/classes/PluginBase.md#logwaitfortcoffsetcomplete)

***

### manageEventResponseStatus()

> **manageEventResponseStatus**(`event`): `void`

Defined in: src/app/plugins/annotation/annotation-plugin.component.ts:451

#### Parameters

##### event

`any`

#### Returns

`void`

***

### manageSegment()

> **manageSegment**(`event`): `void`

Defined in: src/app/plugins/annotation/annotation-plugin.component.ts:462

#### Parameters

##### event

`any`

#### Returns

`void`

***

### mediaPlayerElementReady()

> **mediaPlayerElementReady**(): `boolean`

Defined in: src/app/core/plugin/plugin-base.ts:87

Retourne vrai si le mediaPlayerElement est initialisé.

#### Returns

`boolean`

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`mediaPlayerElementReady`](../../../../core/plugin/plugin-base/classes/PluginBase.md#mediaplayerelementready)

***

### metaDataLoaded()

> **metaDataLoaded**(): `boolean`

Defined in: src/app/core/plugin/plugin-base.ts:65

#### Returns

`boolean`

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`metaDataLoaded`](../../../../core/plugin/plugin-base/classes/PluginBase.md#metadataloaded)

***

### ngOnDestroy()

> **ngOnDestroy**(): `void`

Defined in: src/app/plugins/annotation/annotation-plugin.component.ts:795

A callback method that performs custom clean-up, invoked immediately
before a directive, pipe, or service instance is destroyed.

#### Returns

`void`

#### Implementation of

`OnDestroy.ngOnDestroy`

#### Overrides

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`ngOnDestroy`](../../../../core/plugin/plugin-base/classes/PluginBase.md#ngondestroy)

***

### ngOnInit()

> **ngOnInit**(): `void`

Defined in: src/app/plugins/annotation/annotation-plugin.component.ts:77

A callback method that is invoked immediately after the
default change detector has checked the directive's
data-bound properties for the first time,
and before any of the view or content children have been checked.
It is invoked only once when the directive is instantiated.

#### Returns

`void`

#### Overrides

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`ngOnInit`](../../../../core/plugin/plugin-base/classes/PluginBase.md#ngoninit)

***

### removeListener()

> **removeListener**(`element`, `playerEventType`, `func`): `void`

Defined in: src/app/core/plugin/plugin-base.ts:148

#### Parameters

##### element

`any`

##### playerEventType

[`PlayerEventType`](../../../../core/constant/event-type/enumerations/PlayerEventType.md)

##### func

`any`

#### Returns

`void`

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`removeListener`](../../../../core/plugin/plugin-base/classes/PluginBase.md#removelistener)

***

### removeSegment()

> **removeSegment**(`segment`): `void`

Defined in: src/app/plugins/annotation/annotation-plugin.component.ts:402

#### Parameters

##### segment

`any`

#### Returns

`void`

***

### saveSegment()

> **saveSegment**(`event`): `void`

Defined in: src/app/plugins/annotation/annotation-plugin.component.ts:381

#### Parameters

##### event

`any`

#### Returns

`void`

***

### saveSegments()

> **saveSegments**(): `void`

Defined in: src/app/plugins/annotation/annotation-plugin.component.ts:744

#### Returns

`void`

***

### selectSegment()

> **selectSegment**(`event`): `void`

Defined in: src/app/plugins/annotation/annotation-plugin.component.ts:591

#### Parameters

##### event

[`AnnotationLocalisation`](../../../../core/metadata/model/annotation-localisation/interfaces/AnnotationLocalisation.md)

#### Returns

`void`

***

### setAnnotationsInfoFromConfig()

> **setAnnotationsInfoFromConfig**(): `void`

Defined in: src/app/plugins/annotation/annotation-plugin.component.ts:143

#### Returns

`void`

***

### setDataLoading()

> **setDataLoading**(`dataLoading`): `void`

Defined in: src/app/core/plugin/plugin-base.ts:53

#### Parameters

##### dataLoading

`boolean`

#### Returns

`void`

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`setDataLoading`](../../../../core/plugin/plugin-base/classes/PluginBase.md#setdataloading)

***

### setSegmentsTcOffsetAndTcMax()

> **setSegmentsTcOffsetAndTcMax**(): `void`

Defined in: src/app/plugins/annotation/annotation-plugin.component.ts:324

#### Returns

`void`

***

### setTcIn()

> **setTcIn**(): `void`

Defined in: src/app/plugins/annotation/annotation-plugin.component.ts:612

#### Returns

`void`

***

### setTcInFn()

> **setTcInFn**(`event`): `void`

Defined in: src/app/plugins/annotation/annotation-plugin.component.ts:601

#### Parameters

##### event

`any`

#### Returns

`void`

***

### setTcOffset()

> **setTcOffset**(): `void`

Defined in: src/app/core/plugin/plugin-base.ts:91

#### Returns

`void`

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`setTcOffset`](../../../../core/plugin/plugin-base/classes/PluginBase.md#settcoffset)

***

### setTcOut()

> **setTcOut**(): `void`

Defined in: src/app/plugins/annotation/annotation-plugin.component.ts:659

#### Returns

`void`

***

### setTcOutFn()

> **setTcOutFn**(`event`): `void`

Defined in: src/app/plugins/annotation/annotation-plugin.component.ts:650

#### Parameters

##### event

`any`

#### Returns

`void`

***

### sortAnnotations()

> **sortAnnotations**(): `void`

Defined in: src/app/plugins/annotation/annotation-plugin.component.ts:70

#### Returns

`void`

***

### syncOtherAnnotationsComponents()

> **syncOtherAnnotationsComponents**(): `void`

Defined in: src/app/plugins/annotation/annotation-plugin.component.ts:552

#### Returns

`void`

***

### toggleExportMenu()

> **toggleExportMenu**(): `void`

Defined in: src/app/plugins/annotation/annotation-plugin.component.ts:804

#### Returns

`void`

***

### unselectAllSegments()

> **unselectAllSegments**(): `void`

Defined in: src/app/plugins/annotation/annotation-plugin.component.ts:377

#### Returns

`void`

***

### updatethumbnail()

> **updatethumbnail**(`event`): `void`

Defined in: src/app/plugins/annotation/annotation-plugin.component.ts:763

#### Parameters

##### event

`any`

#### Returns

`void`
