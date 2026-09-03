[**Amalia**](../../../../README.md)

***

[Amalia](../../../../modules.md) / [core/plugin/plugin-base](../README.md) / PluginBase

# Class: `abstract` PluginBase\<T\>

Defined in: src/app/core/plugin/plugin-base.ts:18

Base class for create plugin

## Extended by

- [`AnnotationPluginComponent`](../../../../plugins/annotation/annotation-plugin.component/classes/AnnotationPluginComponent.md)
- [`ControlBarPluginComponent`](../../../../plugins/control-bar/control-bar-plugin.component/classes/ControlBarPluginComponent.md)
- [`HistogramPluginComponent`](../../../../plugins/histogram/histogram-plugin.component/classes/HistogramPluginComponent.md)
- [`StoryboardPluginComponent`](../../../../plugins/storyboard/storyboard-plugin.component/classes/StoryboardPluginComponent.md)
- [`SubtitlesPluginComponent`](../../../../plugins/subtitles/subtitles-plugin.component/classes/SubtitlesPluginComponent.md)
- [`TimeBarPluginComponent`](../../../../plugins/time-bar/time-bar-plugin.component/classes/TimeBarPluginComponent.md)
- [`TimelinePluginComponent`](../../../../plugins/timeline/timeline-plugin.component/classes/TimelinePluginComponent.md)
- [`TranscriptionPluginComponent`](../../../../plugins/transcription/transcription-plugin.component/classes/TranscriptionPluginComponent.md)

## Type Parameters

### T

`T`

## Implements

- `OnInit`
- `OnDestroy`

## Constructors

### Constructor

> `protected` **new PluginBase**\<`T`\>(`playerService`): `PluginBase`\<`T`\>

Defined in: src/app/core/plugin/plugin-base.ts:128

Plugin base constructor

#### Parameters

##### playerService

[`MediaPlayerService`](../../../../service/media-player-service/classes/MediaPlayerService.md)

player service

#### Returns

`PluginBase`\<`T`\>

## Properties

### \_player

> **\_player**: `any`

Defined in: src/app/core/plugin/plugin-base.ts:42

This plugin configuration

***

### \_pluginConfiguration

> **\_pluginConfiguration**: [`PluginConfigData`](../../../config/model/plugin-config-data/interfaces/PluginConfigData.md)\<`T`\>

Defined in: src/app/core/plugin/plugin-base.ts:97

***

### dataLoading

> **dataLoading**: `boolean` = `false`

Defined in: src/app/core/plugin/plugin-base.ts:26

***

### fps

> **fps**: `any`

Defined in: src/app/core/plugin/plugin-base.ts:24

***

### initAlreadyCalled

> **initAlreadyCalled**: `boolean` = `false`

Defined in: src/app/core/plugin/plugin-base.ts:38

When false, means that the init function was not called yet

***

### initialized

> **initialized**: `any`

Defined in: src/app/core/plugin/plugin-base.ts:25

***

### intervalStep

> **intervalStep**: `number` = `5`

Defined in: src/app/core/plugin/plugin-base.ts:28

***

### logger

> **logger**: [`DefaultLogger`](../../../logger/default-logger/classes/DefaultLogger.md)

Defined in: src/app/core/plugin/plugin-base.ts:122

***

### mediaPlayerElement

> **mediaPlayerElement**: [`MediaPlayerElement`](../../../media-player-element/classes/MediaPlayerElement.md)

Defined in: src/app/core/plugin/plugin-base.ts:119

***

### noSpinner

> **noSpinner**: `boolean` = `true`

Defined in: src/app/core/plugin/plugin-base.ts:29

***

### playerId

> **playerId**: `any` = `null`

Defined in: src/app/core/plugin/plugin-base.ts:21

***

### playerService

> **playerService**: [`MediaPlayerService`](../../../../service/media-player-service/classes/MediaPlayerService.md)

Defined in: src/app/core/plugin/plugin-base.ts:116

***

### pluginConfSetThroughInit

> **pluginConfSetThroughInit**: `boolean` = `false`

Defined in: src/app/core/plugin/plugin-base.ts:34

When false, it means that the pluginConfiguration was set through the template's attribute

***

### pluginInstance

> **pluginInstance**: `string` = `''`

Defined in: src/app/core/plugin/plugin-base.ts:118

***

### pluginName

> `protected` **pluginName**: `string`

Defined in: src/app/core/plugin/plugin-base.ts:121

***

### subscriptionToEventsEmitters

> **subscriptionToEventsEmitters**: `Subscription`[] = `[]`

Defined in: src/app/core/plugin/plugin-base.ts:30

***

### tcOffset

> **tcOffset**: `any`

Defined in: src/app/core/plugin/plugin-base.ts:23

***

### timeFormat

> **timeFormat**: `any`

Defined in: src/app/core/plugin/plugin-base.ts:22

***

### timeout

> **timeout**: `number` = `30000`

Defined in: src/app/core/plugin/plugin-base.ts:27

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

***

### pluginConfiguration

#### Get Signature

> **get** **pluginConfiguration**(): [`PluginConfigData`](../../../config/model/plugin-config-data/interfaces/PluginConfigData.md)\<`T`\>

Defined in: src/app/core/plugin/plugin-base.ts:99

##### Returns

[`PluginConfigData`](../../../config/model/plugin-config-data/interfaces/PluginConfigData.md)\<`T`\>

#### Set Signature

> **set** **pluginConfiguration**(`value`): `void`

Defined in: src/app/core/plugin/plugin-base.ts:104

##### Parameters

###### value

[`PluginConfigData`](../../../config/model/plugin-config-data/interfaces/PluginConfigData.md)\<`T`\>

##### Returns

`void`

## Methods

### addListener()

> **addListener**(`element`, `playerEventType`, `func`): `void`

Defined in: src/app/core/plugin/plugin-base.ts:145

#### Parameters

##### element

`any`

##### playerEventType

[`PlayerEventType`](../../../constant/event-type/enumerations/PlayerEventType.md)

##### func

`any`

#### Returns

`void`

***

### getDefaultConfig()

> `abstract` **getDefaultConfig**(): [`PluginConfigData`](../../../config/model/plugin-config-data/interfaces/PluginConfigData.md)\<`T`\>

Defined in: src/app/core/plugin/plugin-base.ts:205

#### Returns

[`PluginConfigData`](../../../config/model/plugin-config-data/interfaces/PluginConfigData.md)\<`T`\>

***

### handleMetadataLoaded()

> `protected` **handleMetadataLoaded**(): `void`

Defined in: src/app/core/plugin/plugin-base.ts:152

#### Returns

`void`

***

### init()

> **init**(): `void`

Defined in: src/app/core/plugin/plugin-base.ts:159

#### Returns

`void`

***

### logWaitForTcOffsetComplete()

> **logWaitForTcOffsetComplete**(): `void`

Defined in: src/app/core/plugin/plugin-base.ts:57

#### Returns

`void`

***

### mediaPlayerElementReady()

> **mediaPlayerElementReady**(): `boolean`

Defined in: src/app/core/plugin/plugin-base.ts:87

Retourne vrai si le mediaPlayerElement est initialisé.

#### Returns

`boolean`

***

### metaDataLoaded()

> **metaDataLoaded**(): `boolean`

Defined in: src/app/core/plugin/plugin-base.ts:65

#### Returns

`boolean`

***

### ngOnDestroy()

> **ngOnDestroy**(): `void`

Defined in: src/app/core/plugin/plugin-base.ts:207

A callback method that performs custom clean-up, invoked immediately
before a directive, pipe, or service instance is destroyed.

#### Returns

`void`

#### Implementation of

`OnDestroy.ngOnDestroy`

***

### ngOnInit()

> **ngOnInit**(): `void`

Defined in: src/app/core/plugin/plugin-base.ts:132

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

### removeListener()

> **removeListener**(`element`, `playerEventType`, `func`): `void`

Defined in: src/app/core/plugin/plugin-base.ts:148

#### Parameters

##### element

`any`

##### playerEventType

[`PlayerEventType`](../../../constant/event-type/enumerations/PlayerEventType.md)

##### func

`any`

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

***

### setTcOffset()

> **setTcOffset**(): `void`

Defined in: src/app/core/plugin/plugin-base.ts:91

#### Returns

`void`
