[**Amalia**](../../../../README.md)

***

[Amalia](../../../../modules.md) / [plugins/timeline/timeline-plugin.component](../README.md) / TimelinePluginComponent

# Class: TimelinePluginComponent

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:36

Base class for create plugin

## Extends

- [`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md)\<[`TimelineConfig`](../../../../core/config/model/timeline-config/interfaces/TimelineConfig.md)\>

## Implements

- `OnInit`
- `AfterViewInit`

## Constructors

### Constructor

> **new TimelinePluginComponent**(`playerService`, `cdr`): `TimelinePluginComponent`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:122

#### Parameters

##### playerService

[`MediaPlayerService`](../../../../service/media-player-service/classes/MediaPlayerService.md)

##### cdr

`ChangeDetectorRef`

#### Returns

`TimelinePluginComponent`

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

> **\_pluginConfiguration**: [`PluginConfigData`](../../../../core/config/model/plugin-config-data/interfaces/PluginConfigData.md)\<[`TimelineConfig`](../../../../core/config/model/timeline-config/interfaces/TimelineConfig.md)\>

Defined in: src/app/core/plugin/plugin-base.ts:97

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`_pluginConfiguration`](../../../../core/plugin/plugin-base/classes/PluginBase.md#_pluginconfiguration)

***

### allNodesChecked

> **allNodesChecked**: `boolean` = `false`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:110

***

### colors

> **colors**: `string`[]

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:60

***

### configIsOpen

> **configIsOpen**: `boolean` = `false`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:43

***

### currentTime

> **currentTime**: `number` = `0`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:44

***

### dataLoading

> **dataLoading**: `boolean` = `false`

Defined in: src/app/core/plugin/plugin-base.ts:26

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`dataLoading`](../../../../core/plugin/plugin-base/classes/PluginBase.md#dataloading)

***

### duration

> **duration**: `number` = `0`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:45

***

### durationFromConfig

> **durationFromConfig**: `number` = `0`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:50

***

### enableZoom

> **enableZoom**: `boolean` = `false`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:112

***

### filterHidden

> **filterHidden**: `boolean` = `false`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:408

***

### focusContainer

> **focusContainer**: `ElementRef`\<`HTMLElement`\>

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:71

***

### focusTcIn

> **focusTcIn**: `number` = `0`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:47

***

### focusTcOut

> **focusTcOut**: `number` = `0`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:48

***

### fps

> **fps**: `any`

Defined in: src/app/core/plugin/plugin-base.ts:24

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`fps`](../../../../core/plugin/plugin-base/classes/PluginBase.md#fps)

***

### indeterminate

> **indeterminate**: `boolean` = `false`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:115

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

### isDrawingRectangle

> **isDrawingRectangle**: `boolean` = `false`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:58

***

### isSelectSegmentsFocused

> **isSelectSegmentsFocused**: `boolean` = `false`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:111

***

### listOfBlocks

> **listOfBlocks**: [`TimeLineBlock`](../../../../core/metadata/model/timeline-localisation/interfaces/TimeLineBlock.md)[]

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:41

***

### listOfBlocksAccordion

> **listOfBlocksAccordion**: `ElementRef`\<`HTMLElement`\>

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:79

***

### listOfBlocksContainer

> **listOfBlocksContainer**: `ElementRef`\<`HTMLElement`\>

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:77

***

### listOfBlocksIndexes

> **listOfBlocksIndexes**: `number`[] = `[]`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:42

***

### logger

> **logger**: [`DefaultLogger`](../../../../core/logger/default-logger/classes/DefaultLogger.md)

Defined in: src/app/core/plugin/plugin-base.ts:122

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`logger`](../../../../core/plugin/plugin-base/classes/PluginBase.md#logger)

***

### mainBlockColor

> **mainBlockColor**: `string`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:39

***

### mainBlockContainer

> **mainBlockContainer**: `ElementRef`\<`HTMLElement`\>

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:75

***

### mainLocalisations

> **mainLocalisations**: [`TimelineLocalisation`](../../../../core/metadata/model/timeline-localisation/interfaces/TimelineLocalisation.md)[]

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:40

***

### mainTimeline

> **mainTimeline**: `ElementRef`\<`HTMLDivElement`\>

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:73

***

### managedDataTypes

> **managedDataTypes**: [`DataType`](../../../../core/constant/data-type/enumerations/DataType.md)[]

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:97

***

### mapOfBlocksIndexes

> **mapOfBlocksIndexes**: `Map`\<[`TimeLineBlock`](../../../../core/metadata/model/timeline-localisation/interfaces/TimeLineBlock.md), `number`\>

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:116

***

### mediaPlayerElement

> **mediaPlayerElement**: [`MediaPlayerElement`](../../../../core/media-player-element/classes/MediaPlayerElement.md)

Defined in: src/app/core/plugin/plugin-base.ts:119

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`mediaPlayerElement`](../../../../core/plugin/plugin-base/classes/PluginBase.md#mediaplayerelement)

***

### menuContainer

> **menuContainer**: `ElementRef`\<`HTMLElement`\>

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:85

***

### messagesComponent

> **messagesComponent**: [`ToastComponent`](../../../../core/toast/toast.component/classes/ToastComponent.md)

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:118

***

### mouseX

> **mouseX**: `number`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:113

***

### mouseY

> **mouseY**: `number`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:114

***

### nodes

> **nodes**: `TreeNode`\<`any`\>[] = `[]`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:99

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

### resourceType

> **resourceType**: `"stock"` \| `"flux"`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:51

***

### selectedBlock

> **selectedBlock**: [`TimelineLocalisation`](../../../../core/metadata/model/timeline-localisation/interfaces/TimelineLocalisation.md) = `null`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:86

***

### selectedBlockElement

> **selectedBlockElement**: `any` = `null`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:81

***

### selectedNodes

> **selectedNodes**: `WritableSignal`\<`TreeNode`\<`any`\>[]\>

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:100

***

### selectedNodesBeforeChange

> **selectedNodesBeforeChange**: `TreeNode`\<`any`\>[] = `[]`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:109

***

### selectedNodesMap

> **selectedNodesMap**: `Signal`\<`Map`\<`string`, `TreeNode`\<`any`\>\>\>

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:101

***

### selectionContainer

> **selectionContainer**: `ElementRef`\<`HTMLElement`\>

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:83

***

### selectionPosition

> **selectionPosition**: `object`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:52

#### startX

> **startX**: `number` = `0`

#### startY

> **startY**: `number` = `0`

#### x

> **x**: `number` = `0`

#### y

> **y**: `number` = `0`

***

### sortableOptions

> **sortableOptions**: `Options`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:87

***

### startIndex

> **startIndex**: `number`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:886

***

### subscriptionToEventsEmitters

> **subscriptionToEventsEmitters**: `Subscription`[] = `[]`

Defined in: src/app/core/plugin/plugin-base.ts:30

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`subscriptionToEventsEmitters`](../../../../core/plugin/plugin-base/classes/PluginBase.md#subscriptiontoeventsemitters)

***

### tcIn

> **tcIn**: `number` = `0`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:49

***

### tcOffset

> **tcOffset**: `number` = `0`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:46

#### Overrides

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`tcOffset`](../../../../core/plugin/plugin-base/classes/PluginBase.md#tcoffset)

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

### title

> **title**: `string`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:38

***

### tvDaysEnabled

> **tvDaysEnabled**: `boolean` = `false`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:119

***

### PLUGIN\_NAME

> `static` **PLUGIN\_NAME**: `string` = `'TIMELINE'`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:37

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

### adjustForStock()

> **adjustForStock**(`listOfLocalisations`): `object`[]

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:339

#### Parameters

##### listOfLocalisations

`object`[]

#### Returns

`object`[]

***

### adjustTcsForFlux()

> **adjustTcsForFlux**(`listOfLocalisations`): `void`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:325

#### Parameters

##### listOfLocalisations

`object`[]

#### Returns

`void`

***

### callSeek()

> **callSeek**(`tc`): `void`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:414

Handle call

#### Parameters

##### tc

`number`

time code

#### Returns

`void`

***

### checkTcForStock()

> **checkTcForStock**(`l`, `tcOut`): `boolean`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:312

#### Parameters

##### l

###### tcIn

`number`

###### tcOut

`number`

##### tcOut

`number`

#### Returns

`boolean`

***

### closeMenu()

> **closeMenu**(`event`): `void`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:169

#### Parameters

##### event

`any`

#### Returns

`void`

***

### createMainMetadataIds()

> **createMainMetadataIds**(`handleMetadataIds`, `metadataManager`): [`TimelineLocalisation`](../../../../core/metadata/model/timeline-localisation/interfaces/TimelineLocalisation.md)[]

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:748

In charge to main timeline

#### Parameters

##### handleMetadataIds

`string`[]

##### metadataManager

[`MetadataManager`](../../../../core/metadata/metadata-manager/classes/MetadataManager.md)

#### Returns

[`TimelineLocalisation`](../../../../core/metadata/model/timeline-localisation/interfaces/TimelineLocalisation.md)[]

***

### displayDashInTimeCode()

> **displayDashInTimeCode**(`middleElement`, `startElementClientRect`, `timeCodeContainer`, `endElementClientRect`, `startElement`, `endElement`, `focusContainerClientRect`): `void`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:666

#### Parameters

##### middleElement

`HTMLSpanElement`

##### startElementClientRect

`DOMRect`

##### timeCodeContainer

`HTMLElement`

##### endElementClientRect

`DOMRect`

##### startElement

`HTMLSpanElement`

##### endElement

`HTMLSpanElement`

##### focusContainerClientRect

`DOMRect`

#### Returns

`void`

***

### dragElement()

> **dragElement**(`event`): `void`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:474

#### Parameters

##### event

`any`

#### Returns

`void`

***

### exportTvDays()

> **exportTvDays**(): `void`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:930

Export the tv days
Sends an event through the mediaPlayerElement eventListener asking for the tv days to be exported

#### Returns

`void`

***

### getAllNodes()

> **getAllNodes**(`nodes`): `any`[]

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:861

Gets all the nodes and their children from the given nodes

#### Parameters

##### nodes

`any`[]

nodes

#### Returns

`any`[]

all nodes

***

### getDefaultConfig()

> **getDefaultConfig**(): [`PluginConfigData`](../../../../core/config/model/plugin-config-data/interfaces/PluginConfigData.md)\<[`TimelineConfig`](../../../../core/config/model/timeline-config/interfaces/TimelineConfig.md)\>

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:422

Return default config

#### Returns

[`PluginConfigData`](../../../../core/config/model/plugin-config-data/interfaces/PluginConfigData.md)\<[`TimelineConfig`](../../../../core/config/model/timeline-config/interfaces/TimelineConfig.md)\>

#### Overrides

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`getDefaultConfig`](../../../../core/plugin/plugin-base/classes/PluginBase.md#getdefaultconfig)

***

### getNewChildNodeFromMetadataElement()

> **getNewChildNodeFromMetadataElement**(`metadata`, `color`): `object`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:398

#### Parameters

##### metadata

`any`

##### color

`string`

#### Returns

`object`

##### checked

> **checked**: `boolean` = `true`

##### data

> **data**: `object`

###### data.color

> **color**: `string`

##### expanded

> **expanded**: `boolean` = `true`

##### icon

> **icon**: `string`

##### key

> **key**: `any` = `metadata.id`

##### label

> **label**: `any`

***

### getNewNodeFromMetadataElement()

> **getNewNodeFromMetadataElement**(`metadata`): `TreeNode`\<`any`\>

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:177

#### Parameters

##### metadata

###### type

`string`

#### Returns

`TreeNode`\<`any`\>

***

### getNodeLabelAndIcon()

> **getNodeLabelAndIcon**(`metadata`): `object`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:197

#### Parameters

##### metadata

###### type

`string`

#### Returns

`object`

##### icon

> **icon**: `string`

##### level1Label

> **level1Label**: `string`

***

### handleDisplayBlocks()

> **handleDisplayBlocks**(`isValid`): `void`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:543

In charge of save or not display block states

#### Parameters

##### isValid

`boolean`

true for save display block

#### Returns

`void`

***

### handleMetadataLoaded()

> `protected` **handleMetadataLoaded**(): `void`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:741

Called when metadata loaded

#### Returns

`void`

#### Overrides

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`handleMetadataLoaded`](../../../../core/plugin/plugin-base/classes/PluginBase.md#handlemetadataloaded)

***

### handleMetadataProperties()

> **handleMetadataProperties**(`listOfMetadata`, `metadataManager`): `void`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:347

#### Parameters

##### listOfMetadata

`any`[] | `Map`\<`string`, \{ `algorithm`: `string`; `id`: `string`; `label`: `string`; `localisation`: `object`[]; `processed`: `number`; `processor`: `string`; `type`: `string`; `version`: `number`; \}\>

##### metadataManager

`any`

#### Returns

`void`

***

### handleMouseEnterOnTc()

> **handleMouseEnterOnTc**(`event`, `localisation`): `void`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:781

On mouse enter on tc bloc

#### Parameters

##### event

`MouseEvent`

event

##### localisation

[`TimelineLocalisation`](../../../../core/metadata/model/timeline-localisation/interfaces/TimelineLocalisation.md)

localisation

#### Returns

`void`

***

### handleMouseLeaveOnTc()

> **handleMouseLeaveOnTc**(`$event`): `void`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:821

On mouse enter on tc bloc

#### Parameters

##### $event

`any`

any

#### Returns

`void`

***

### handleMouseMoveToDrawRect()

> **handleMouseMoveToDrawRect**(`event`): `void`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:831

handle mouse to drawxit

#### Parameters

##### event

`any`

mouse event

#### Returns

`void`

***

### handleZoomRangeChange()

> **handleZoomRangeChange**(): `void`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:623

In charge to change focus container

#### Returns

`void`

***

### init()

> **init**(): `void`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:241

#### Returns

`void`

#### Overrides

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`init`](../../../../core/plugin/plugin-base/classes/PluginBase.md#init)

***

### initAfterMediaPlayerElementIsReady()

> **initAfterMediaPlayerElementIsReady**(): `void`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:158

#### Returns

`void`

***

### initFocusResizable()

> **initFocusResizable**(`element`): `void`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:440

Init focus

#### Parameters

##### element

`HTMLElement`

focus element

#### Returns

`void`

***

### logWaitForTcOffsetComplete()

> **logWaitForTcOffsetComplete**(): `void`

Defined in: src/app/core/plugin/plugin-base.ts:57

#### Returns

`void`

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`logWaitForTcOffsetComplete`](../../../../core/plugin/plugin-base/classes/PluginBase.md#logwaitfortcoffsetcomplete)

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

### moveElement()

> **moveElement**(`event`): `void`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:489

#### Parameters

##### event

`any`

#### Returns

`void`

***

### ngAfterViewInit()

> **ngAfterViewInit**(): `void`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:127

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

Defined in: src/app/core/plugin/plugin-base.ts:207

A callback method that performs custom clean-up, invoked immediately
before a directive, pipe, or service instance is destroyed.

#### Returns

`void`

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`ngOnDestroy`](../../../../core/plugin/plugin-base/classes/PluginBase.md#ngondestroy)

***

### ngOnInit()

> **ngOnInit**(): `void`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:138

A callback method that is invoked immediately after the
default change detector has checked the directive's
data-bound properties for the first time,
and before any of the view or content children have been checked.
It is invoked only once when the directive is instantiated.

#### Returns

`void`

#### Implementation of

`OnInit.ngOnInit`

#### Overrides

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`ngOnInit`](../../../../core/plugin/plugin-base/classes/PluginBase.md#ngoninit)

***

### onDragStart()

> **onDragStart**(`index`): `void`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:888

#### Parameters

##### index

`number`

#### Returns

`void`

***

### onDrop()

> **onDrop**(`dropIndex`): `void`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:892

#### Parameters

##### dropIndex

`number`

#### Returns

`void`

***

### parseTimelineMetadata()

> **parseTimelineMetadata**(): `void`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:264

In charge to parse metadata

#### Returns

`void`

***

### patchExtraitUtilisateur()

> **patchExtraitUtilisateur**(`metadata`): `void`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:304

#### Parameters

##### metadata

`object`[]

#### Returns

`void`

***

### refreshTimeCursor()

> **refreshTimeCursor**(`event?`): `void`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:697

In charge to refresh time cursor

#### Parameters

##### event?

`any`

#### Returns

`void`

***

### removeBlock()

> **removeBlock**(`block`): `void`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:573

Hides a block

#### Parameters

##### block

`any`

block to hide

#### Returns

`void`

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

### setTcOffset()

> **setTcOffset**(): `void`

Defined in: src/app/core/plugin/plugin-base.ts:91

#### Returns

`void`

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`setTcOffset`](../../../../core/plugin/plugin-base/classes/PluginBase.md#settcoffset)

***

### toggleAllBlocksState()

> **toggleAllBlocksState**(`mainElement`, `stateControl`): `void`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:522

In charge to change display state for all blocks

#### Parameters

##### mainElement

`HTMLElement`

parent element

##### stateControl

`HTMLDivElement`

old state

#### Returns

`void`

***

### toggleAllNodes()

> **toggleAllNodes**(): `void`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:846

#### Returns

`void`

***

### toggleConfig()

> **toggleConfig**(): `void`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:872

#### Returns

`void`

***

### toggleFilter()

> **toggleFilter**(): `void`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:882

#### Returns

`void`

***

### toggleState()

> **toggleState**(`mainElement`): `void`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:509

In charge to change display state

#### Parameters

##### mainElement

`HTMLElement`

parent element

#### Returns

`void`

***

### unZoom()

> **unZoom**(): `void`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:728

In charge to un-zoom

#### Returns

`void`

***

### updateMouseEvent()

> **updateMouseEvent**(`event`): `void`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:839

Update mouse position

#### Parameters

##### event

`any`

mouse event

#### Returns

`void`

***

### updateTimeCodePosition()

> **updateTimeCodePosition**(): `void`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:633

#### Returns

`void`

***

### updateTreeComponent()

> **updateTreeComponent**(): `void`

Defined in: src/app/plugins/timeline/timeline-plugin.component.ts:903

#### Returns

`void`
