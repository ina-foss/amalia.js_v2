[**Amalia**](../../../../README.md)

***

[Amalia](../../../../modules.md) / [plugins/storyboard/storyboard-plugin.component](../README.md) / StoryboardPluginComponent

# Class: StoryboardPluginComponent

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:15

Base class for create plugin

## Extends

- [`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md)\<[`StoryboardConfig`](../../../../core/config/model/storyboard-config/interfaces/StoryboardConfig.md)\>

## Implements

- `OnInit`

## Constructors

### Constructor

> **new StoryboardPluginComponent**(`playerService`): `StoryboardPluginComponent`

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:103

#### Parameters

##### playerService

[`MediaPlayerService`](../../../../service/media-player-service/classes/MediaPlayerService.md)

#### Returns

`StoryboardPluginComponent`

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

> **\_pluginConfiguration**: [`PluginConfigData`](../../../../core/config/model/plugin-config-data/interfaces/PluginConfigData.md)\<[`StoryboardConfig`](../../../../core/config/model/storyboard-config/interfaces/StoryboardConfig.md)\>

Defined in: src/app/core/plugin/plugin-base.ts:97

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`_pluginConfiguration`](../../../../core/plugin/plugin-base/classes/PluginBase.md#_pluginconfiguration)

***

### activeThumbnail

> **activeThumbnail**: `any`

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:96

***

### baseUrl

> **baseUrl**: `string`

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:21

***

### currentTime

> **currentTime**: `number` = `0`

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:31

***

### dataLoading

> **dataLoading**: `boolean` = `false`

Defined in: src/app/core/plugin/plugin-base.ts:26

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`dataLoading`](../../../../core/plugin/plugin-base/classes/PluginBase.md#dataloading)

***

### displayFormat

> **displayFormat**: `"h"` \| `"m"` \| `"s"` \| `"minutes"` \| `"f"` \| `"ms"` \| `"mms"` \| `"hours"` \| `"seconds"` = `'f'`

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:44

Display format specifier h|m|s|f|ms|mms

***

### displaySynchro

> **displaySynchro**: `boolean` = `false`

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:95

default state of button synchro

***

### duration

> **duration**: `number`

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:36

Media duration

***

### enableLabel

> **enableLabel**: `boolean`

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:52

show time code label

***

### fps

> **fps**: `number`

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:48

Media fps

#### Overrides

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`fps`](../../../../core/plugin/plugin-base/classes/PluginBase.md#fps)

***

### frameIntervals

> **frameIntervals**: `number`[]

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:65

frame intervals

***

### headerElement

> **headerElement**: `ElementRef`\<`HTMLElement`\>

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:30

***

### heightThumbnail

> **heightThumbnail**: `number`

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:91

Height Thumbnail

***

### images

> **images**: `string` = `'images'`

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:20

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

### itemPerLine

> **itemPerLine**: `number`

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:87

thumbnails per line

***

### listOfThumbnail

> **listOfThumbnail**: `number`[]

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:24

***

### listOfThumbnailFilter

> **listOfThumbnailFilter**: `number`[]

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:25

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

### minute

> **minute**: `string` = `'minute'`

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:19

***

### msgLarge

> **msgLarge**: `string` = `'Affichage grandes miniatures'`

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:23

***

### msgMedium

> **msgMedium**: `string` = `'Affichage moyennes miniatures'`

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:22

***

### noSpinner

> **noSpinner**: `boolean` = `true`

Defined in: src/app/core/plugin/plugin-base.ts:29

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`noSpinner`](../../../../core/plugin/plugin-base/classes/PluginBase.md#nospinner)

***

### openIntervalList

> **openIntervalList**: `boolean`

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:74

state list of interval

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

### scrollElement

> **scrollElement**: `ElementRef`\<`HTMLElement`\>

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:28

***

### second

> **second**: `string` = `'seconde'`

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:18

***

### selectedInterval

> **selectedInterval**: \[`string`, `number`\]

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:70

Selected interval

***

### selectedIntervalitem

> **selectedIntervalitem**: `number` = `0`

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:98

***

### selectedTc

> **selectedTc**: `number` = `0`

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:97

***

### size

> **size**: `"medium"` \| `"large"` = `'large'`

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:40

thumbnail size

***

### sizeThumbnail

> **sizeThumbnail**: `string` = `'m'`

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:79

Default size of thumbnails

***

### stopScroll

> **stopScroll**: `boolean` = `false`

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:100

***

### storyboardElement

> **storyboardElement**: `ElementRef`\<`HTMLElement`\>

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:26

***

### subscriptionToEventsEmitters

> **subscriptionToEventsEmitters**: `Subscription`[] = `[]`

Defined in: src/app/core/plugin/plugin-base.ts:30

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`subscriptionToEventsEmitters`](../../../../core/plugin/plugin-base/classes/PluginBase.md#subscriptiontoeventsemitters)

***

### tcInterval

> **tcInterval**: `number` = `3`

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:83

Personalized selected Interval

***

### tcIntervals

> **tcIntervals**: `number`[]

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:61

Time code interval

***

### tcOffset

> **tcOffset**: `any`

Defined in: src/app/core/plugin/plugin-base.ts:23

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`tcOffset`](../../../../core/plugin/plugin-base/classes/PluginBase.md#tcoffset)

***

### theme

> **theme**: `"h"` \| `"v"` = `'v'`

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:56

orientation of the plugin (horizontal|vertical)

***

### throttleTimeChange

> **throttleTimeChange**: `any`

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:32

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

### usedSelectedtc

> **usedSelectedtc**: `number` = `0`

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:99

***

### DEFAULT\_THROTTLE\_INVOCATION\_TIME

> `static` **DEFAULT\_THROTTLE\_INVOCATION\_TIME**: `number` = `500`

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:16

***

### PLUGIN\_NAME

> `static` **PLUGIN\_NAME**: `string` = `'STORYBOARD'`

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:17

## Accessors

### ele2

#### Set Signature

> **set** **ele2**(`v`): `void`

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:153

##### Parameters

###### v

`ElementRef`

##### Returns

`void`

***

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

### getDefaultConfig()

> **getDefaultConfig**(): [`PluginConfigData`](../../../../core/config/model/plugin-config-data/interfaces/PluginConfigData.md)\<[`StoryboardConfig`](../../../../core/config/model/storyboard-config/interfaces/StoryboardConfig.md)\>

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:302

Return default config

#### Returns

[`PluginConfigData`](../../../../core/config/model/plugin-config-data/interfaces/PluginConfigData.md)\<[`StoryboardConfig`](../../../../core/config/model/storyboard-config/interfaces/StoryboardConfig.md)\>

#### Overrides

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`getDefaultConfig`](../../../../core/plugin/plugin-base/classes/PluginBase.md#getdefaultconfig)

***

### getNearSeekTc()

> **getNearSeekTc**(`tc`): `number`

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:239

Return start index

#### Parameters

##### tc

`number`

#### Returns

`number`

***

### handleMetadataLoaded()

> `protected` **handleMetadataLoaded**(): `void`

Defined in: src/app/core/plugin/plugin-base.ts:152

#### Returns

`void`

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`handleMetadataLoaded`](../../../../core/plugin/plugin-base/classes/PluginBase.md#handlemetadataloaded)

***

### handleScroll()

> **handleScroll**(): `void`

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:321

Handle Scroll

#### Returns

`void`

***

### handleSeeked()

> **handleSeeked**(): `void`

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:205

Handle seek

#### Returns

`void`

***

### handleThumbnailSizeChange()

> **handleThumbnailSizeChange**(`size`): `void`

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:470

#### Parameters

##### size

`"medium"` | `"large"`

#### Returns

`void`

***

### init()

> **init**(): `void`

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:112

#### Returns

`void`

#### Overrides

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`init`](../../../../core/plugin/plugin-base/classes/PluginBase.md#init)

***

### initObserverForLoadImages()

> **initObserverForLoadImages**(): `void`

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:134

In charge to load image

#### Returns

`void`

***

### initStoryboard()

> **initStoryboard**(): `void`

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:284

Init storyboard

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

#### Inherited from

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

### scrollToActiveThumbnail()

> **scrollToActiveThumbnail**(`tc`, `withSeek`): `void`

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:480

Invoked on click button synchro

#### Parameters

##### tc

`number`

##### withSeek

`boolean` = `false`

#### Returns

`void`

***

### seekToTc()

> **seekToTc**(`tc`): `void`

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:377

Handle to seek to time code

#### Parameters

##### tc

`number`

time code

#### Returns

`void`

***

### selectedThumbnailSize()

> **selectedThumbnailSize**(`type`, `tc`): `void`

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:390

handle change thumbnail size

#### Parameters

##### type

`string`

type interval

##### tc

`number`

time code

#### Returns

`void`

***

### selectThumbnail()

> **selectThumbnail**(): `void`

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:415

Select Thumbnail

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

### setTcOffset()

> **setTcOffset**(): `void`

Defined in: src/app/core/plugin/plugin-base.ts:91

#### Returns

`void`

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`setTcOffset`](../../../../core/plugin/plugin-base/classes/PluginBase.md#settcoffset)

***

### toggleList()

> **toggleList**(): `void`

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:496

Toggle openList

#### Returns

`void`

***

### updateScrollForTimeCode()

> **updateScrollForTimeCode**(`timeCode`, `isForward`): `void`

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:261

Update scroll based on timecode

#### Parameters

##### timeCode

`number`

timeCode

##### isForward

`boolean`

true forward

#### Returns

`void`

***

### updateSynchro()

> **updateSynchro**(): `void`

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:354

if scrolling and active thumbnail is not visible add synchro button

#### Returns

`void`

***

### updateThumbnailSize()

> **updateThumbnailSize**(): `void`

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:398

Handle interval

#### Returns

`void`

***

### waitAndReload()

> **waitAndReload**(`event`): `void`

Defined in: src/app/plugins/storyboard/storyboard-plugin.component.ts:500

#### Parameters

##### event

`any`

#### Returns

`void`
