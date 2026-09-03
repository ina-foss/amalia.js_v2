[**Amalia**](../../../../README.md)

***

[Amalia](../../../../modules.md) / [plugins/histogram/histogram-plugin.component](../README.md) / HistogramPluginComponent

# Class: HistogramPluginComponent

Defined in: src/app/plugins/histogram/histogram-plugin.component.ts:29

Base class for create plugin

## Extends

- [`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md)\<[`HistogramConfig`](../../../../core/config/model/histogram-config/interfaces/HistogramConfig.md)\>

## Implements

- `OnInit`
- `AfterViewInit`

## Constructors

### Constructor

> **new HistogramPluginComponent**(`httpClient`, `playerService`, `cd`): `HistogramPluginComponent`

Defined in: src/app/plugins/histogram/histogram-plugin.component.ts:123

#### Parameters

##### httpClient

`HttpClient`

##### playerService

[`MediaPlayerService`](../../../../service/media-player-service/classes/MediaPlayerService.md)

##### cd

`ChangeDetectorRef`

#### Returns

`HistogramPluginComponent`

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

> **\_pluginConfiguration**: [`PluginConfigData`](../../../../core/config/model/plugin-config-data/interfaces/PluginConfigData.md)\<[`HistogramConfig`](../../../../core/config/model/histogram-config/interfaces/HistogramConfig.md)\>

Defined in: src/app/core/plugin/plugin-base.ts:97

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`_pluginConfiguration`](../../../../core/plugin/plugin-base/classes/PluginBase.md#_pluginconfiguration)

***

### active

> **active**: `boolean` = `false`

Defined in: src/app/plugins/histogram/histogram-plugin.component.ts:91

state of hover cursor

***

### currentTime

> **currentTime**: `number`

Defined in: src/app/plugins/histogram/histogram-plugin.component.ts:43

Return  current time

***

### cursorPosition

> **cursorPosition**: `number` = `0`

Defined in: src/app/plugins/histogram/histogram-plugin.component.ts:71

Cursor position

***

### cursorZoomPosition

> **cursorZoomPosition**: `number` = `0`

Defined in: src/app/plugins/histogram/histogram-plugin.component.ts:75

Cursor zoom position

***

### dataLoading

> **dataLoading**: `boolean` = `false`

Defined in: src/app/core/plugin/plugin-base.ts:26

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`dataLoading`](../../../../core/plugin/plugin-base/classes/PluginBase.md#dataloading)

***

### displayState

> **displayState**: `any`

Defined in: src/app/plugins/histogram/histogram-plugin.component.ts:113

Plugin display state

***

### duration

> **duration**: `number`

Defined in: src/app/plugins/histogram/histogram-plugin.component.ts:47

Media duration

***

### fps

> **fps**: `any`

Defined in: src/app/core/plugin/plugin-base.ts:24

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`fps`](../../../../core/plugin/plugin-base/classes/PluginBase.md#fps)

***

### histogramPosition

> **histogramPosition**: `number` = `0`

Defined in: src/app/plugins/histogram/histogram-plugin.component.ts:59

Zoomed histogram

***

### histograms

> **histograms**: `ElementRef`\<`HTMLElement`\>

Defined in: src/app/plugins/histogram/histogram-plugin.component.ts:97

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

### inResizing

> **inResizing**: `boolean` = `false`

Defined in: src/app/plugins/histogram/histogram-plugin.component.ts:39

True when user resize the focus container

***

### intervalStep

> **intervalStep**: `number` = `5`

Defined in: src/app/core/plugin/plugin-base.ts:28

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`intervalStep`](../../../../core/plugin/plugin-base/classes/PluginBase.md#intervalstep)

***

### listOfHistograms

> **listOfHistograms**: `object`[]

Defined in: src/app/plugins/histogram/histogram-plugin.component.ts:79

list of histograms

#### label

> **label**: `string`

#### nbBins

> **nbBins**: `number`

#### negMax

> **negMax**: `number`

#### paths

> **paths**: \[`string`, `string`\]

#### posMax

> **posMax**: `number`

#### viewBox

> **viewBox**: `string`

#### zoom

> **zoom**: `boolean`

***

### logger

> **logger**: [`DefaultLogger`](../../../../core/logger/default-logger/classes/DefaultLogger.md)

Defined in: src/app/plugins/histogram/histogram-plugin.component.ts:120

#### Overrides

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`logger`](../../../../core/plugin/plugin-base/classes/PluginBase.md#logger)

***

### mediaPlayerElement

> **mediaPlayerElement**: [`MediaPlayerElement`](../../../../core/media-player-element/classes/MediaPlayerElement.md)

Defined in: src/app/core/plugin/plugin-base.ts:119

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`mediaPlayerElement`](../../../../core/plugin/plugin-base/classes/PluginBase.md#mediaplayerelement)

***

### minZoomSize

> **minZoomSize**: `number` = `1`

Defined in: src/app/plugins/histogram/histogram-plugin.component.ts:67

Min zoom size 10% of container width

***

### noSpinner

> **noSpinner**: `boolean` = `true`

Defined in: src/app/core/plugin/plugin-base.ts:29

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`noSpinner`](../../../../core/plugin/plugin-base/classes/PluginBase.md#nospinner)

***

### pinned

> **pinned**: `boolean` = `false`

Defined in: src/app/plugins/histogram/histogram-plugin.component.ts:101

Pinned ControlBar state

***

### pinnedControlbar

> **pinnedControlbar**: `boolean` = `false`

Defined in: src/app/plugins/histogram/histogram-plugin.component.ts:105

Pinned Slider state

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

### position

> **position**: `number`

Defined in: src/app/plugins/histogram/histogram-plugin.component.ts:109

Mouse Positions

***

### sliderElement

> **sliderElement**: `ElementRef`\<`HTMLElement`\>

Defined in: src/app/plugins/histogram/histogram-plugin.component.ts:94

***

### sliderPosition

> **sliderPosition**: `number` = `0`

Defined in: src/app/plugins/histogram/histogram-plugin.component.ts:55

left slider position

***

### subscriptionToEventsEmitters

> **subscriptionToEventsEmitters**: `Subscription`[] = `[]`

Defined in: src/app/core/plugin/plugin-base.ts:30

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`subscriptionToEventsEmitters`](../../../../core/plugin/plugin-base/classes/PluginBase.md#subscriptiontoeventsemitters)

***

### tcOffset

> **tcOffset**: `any`

Defined in: src/app/core/plugin/plugin-base.ts:23

#### Inherited from

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

### withFocus

> **withFocus**: `boolean` = `false`

Defined in: src/app/plugins/histogram/histogram-plugin.component.ts:51

Enable focus conteneur

***

### zoomSize

> **zoomSize**: `number` = `10`

Defined in: src/app/plugins/histogram/histogram-plugin.component.ts:63

zoom size 10% of container width

***

### CURSOR\_ELM

> `static` **CURSOR\_ELM**: `string` = `'cursor'`

Defined in: src/app/plugins/histogram/histogram-plugin.component.ts:31

***

### HISTOGRAM\_ELM

> `static` **HISTOGRAM\_ELM**: `string` = `'histogram'`

Defined in: src/app/plugins/histogram/histogram-plugin.component.ts:32

***

### PLUGIN\_NAME

> `static` **PLUGIN\_NAME**: `string` = `'HISTOGRAM'`

Defined in: src/app/plugins/histogram/histogram-plugin.component.ts:30

***

### ZOOM\_HISTOGRAM\_ELM

> `static` **ZOOM\_HISTOGRAM\_ELM**: `string` = `'zoom-histogram'`

Defined in: src/app/plugins/histogram/histogram-plugin.component.ts:33

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

### drawHistogram()

> **drawHistogram**(`posBins`, `negBins`, `posMax`, `negMax`, `zoom`, `label`, `mirror`): `object`

Defined in: src/app/plugins/histogram/histogram-plugin.component.ts:202

Handle draw histogram return tuple with positive bins and negative bins
In charge to create svg paths

#### Parameters

##### posBins

`string`

positive bins

##### negBins

`string`

negative bins

##### posMax

`number`

max positive bin

##### negMax

`number`

max negative bin

##### zoom

`boolean`

true for enable zoom container

##### label

`string`

histogram label

##### mirror

`boolean` = `false`

true for enable mirror histogram

#### Returns

`object`

##### label

> **label**: `string`

##### nbBins

> **nbBins**: `number`

##### negMax

> **negMax**: `number`

##### paths

> **paths**: \[`string`, `string`\]

##### posMax

> **posMax**: `number`

##### viewBox

> **viewBox**: `string`

##### zoom

> **zoom**: `boolean`

***

### getDefaultConfig()

> **getDefaultConfig**(): [`PluginConfigData`](../../../../core/config/model/plugin-config-data/interfaces/PluginConfigData.md)\<[`HistogramConfig`](../../../../core/config/model/histogram-config/interfaces/HistogramConfig.md)\>

Defined in: src/app/plugins/histogram/histogram-plugin.component.ts:247

Return default config

#### Returns

[`PluginConfigData`](../../../../core/config/model/plugin-config-data/interfaces/PluginConfigData.md)\<[`HistogramConfig`](../../../../core/config/model/histogram-config/interfaces/HistogramConfig.md)\>

#### Overrides

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`getDefaultConfig`](../../../../core/plugin/plugin-base/classes/PluginBase.md#getdefaultconfig)

***

### getDuration()

> **getDuration**(): `number`

Defined in: src/app/plugins/histogram/histogram-plugin.component.ts:175

#### Returns

`number`

***

### handleDisplayState()

> **handleDisplayState**(): `void`

Defined in: src/app/plugins/histogram/histogram-plugin.component.ts:357

switch container class based on width

#### Returns

`void`

***

### handleHistogramClick()

> **handleHistogramClick**(`event`): `void`

Defined in: src/app/plugins/histogram/histogram-plugin.component.ts:538

Handle on click to histogram

#### Parameters

##### event

`any`

mouse event

#### Returns

`void`

***

### handleMetadataLoaded()

> **handleMetadataLoaded**(): `void`

Defined in: src/app/plugins/histogram/histogram-plugin.component.ts:325

Invoked on metadata loaded

#### Returns

`void`

#### Overrides

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`handleMetadataLoaded`](../../../../core/plugin/plugin-base/classes/PluginBase.md#handlemetadataloaded)

***

### handleMetaDataLoadedWrapperWithoutAutoBind()

> **handleMetaDataLoadedWrapperWithoutAutoBind**(): `void`

Defined in: src/app/plugins/histogram/histogram-plugin.component.ts:145

#### Returns

`void`

***

### handlePinnedControlbarChange()

> **handlePinnedControlbarChange**(`event`): `void`

Defined in: src/app/plugins/histogram/histogram-plugin.component.ts:180

#### Parameters

##### event

`any`

#### Returns

`void`

***

### handlePinnedSliderChange()

> **handlePinnedSliderChange**(`event`): `void`

Defined in: src/app/plugins/histogram/histogram-plugin.component.ts:186

#### Parameters

##### event

`any`

#### Returns

`void`

***

### handleWindowResize()

> **handleWindowResize**(): `void`

Defined in: src/app/plugins/histogram/histogram-plugin.component.ts:365

update all scales on window resize

#### Returns

`void`

***

### init()

> **init**(): `void`

Defined in: src/app/plugins/histogram/histogram-plugin.component.ts:157

#### Returns

`void`

#### Overrides

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`init`](../../../../core/plugin/plugin-base/classes/PluginBase.md#init)

***

### initSliderEvents()

> **initSliderEvents**(): `void`

Defined in: src/app/plugins/histogram/histogram-plugin.component.ts:373

slider events

#### Returns

`void`

***

### initWrapperWithoutAutoBind()

> **initWrapperWithoutAutoBind**(): `void`

Defined in: src/app/plugins/histogram/histogram-plugin.component.ts:171

For the tests purposes

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

### ngAfterViewInit()

> **ngAfterViewInit**(): `void`

Defined in: src/app/plugins/histogram/histogram-plugin.component.ts:149

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

Defined in: src/app/plugins/histogram/histogram-plugin.component.ts:132

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
