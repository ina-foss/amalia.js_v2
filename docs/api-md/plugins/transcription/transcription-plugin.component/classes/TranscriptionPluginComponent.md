[**Amalia**](../../../../README.md)

***

[Amalia](../../../../modules.md) / [plugins/transcription/transcription-plugin.component](../README.md) / TranscriptionPluginComponent

# Class: TranscriptionPluginComponent

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:28

Base class for create plugin

## Extends

- [`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md)\<[`TranscriptionConfig`](../../../../core/config/model/transcription-config/interfaces/TranscriptionConfig.md)\>

## Implements

- `AfterViewInit`

## Constructors

### Constructor

> **new TranscriptionPluginComponent**(`playerService`): `TranscriptionPluginComponent`

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:74

#### Parameters

##### playerService

[`MediaPlayerService`](../../../../service/media-player-service/classes/MediaPlayerService.md)

#### Returns

`TranscriptionPluginComponent`

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

> **\_pluginConfiguration**: [`PluginConfigData`](../../../../core/config/model/plugin-config-data/interfaces/PluginConfigData.md)\<[`TranscriptionConfig`](../../../../core/config/model/transcription-config/interfaces/TranscriptionConfig.md)\>

Defined in: src/app/core/plugin/plugin-base.ts:97

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`_pluginConfiguration`](../../../../core/plugin/plugin-base/classes/PluginBase.md#_pluginconfiguration)

***

### active

> **active**: `boolean` = `false`

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:45

***

### automaticallyScrolled

> **automaticallyScrolled**: `boolean` = `false`

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:72

***

### autoScroll

> **autoScroll**: `boolean` = `false`

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:44

***

### currentTime

> **currentTime**: `number`

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:59

Return  current time

***

### dataLoading

> **dataLoading**: `boolean` = `false`

Defined in: src/app/core/plugin/plugin-base.ts:26

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`dataLoading`](../../../../core/plugin/plugin-base/classes/PluginBase.md#dataloading)

***

### displaySynchro

> **displaySynchro**: `boolean` = `false`

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:63

***

### fps

> **fps**: [`FPS`](../../../../core/constant/default/enumerations/DEFAULT.md#fps) = `DEFAULT.FPS`

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:43

#### Overrides

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`fps`](../../../../core/plugin/plugin-base/classes/PluginBase.md#fps)

***

### headerElement

> **headerElement**: `ElementRef`\<`HTMLElement`\>

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:50

***

### ignoreNextScroll

> **ignoreNextScroll**: `boolean` = `false`

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:46

***

### index

> **index**: `number` = `0`

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:55

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

### listOfSearchedNodes

> **listOfSearchedNodes**: `HTMLElement`[]

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:61

***

### logger

> **logger**: [`DefaultLogger`](../../../../core/logger/default-logger/classes/DefaultLogger.md)

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:67

#### Overrides

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`logger`](../../../../core/plugin/plugin-base/classes/PluginBase.md#logger)

***

### mediaPlayerElement

> **mediaPlayerElement**: [`MediaPlayerElement`](../../../../core/media-player-element/classes/MediaPlayerElement.md)

Defined in: src/app/core/plugin/plugin-base.ts:119

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`mediaPlayerElement`](../../../../core/plugin/plugin-base/classes/PluginBase.md#mediaplayerelement)

***

### messagesComponent

> **messagesComponent**: [`ToastComponent`](../../../../core/toast/toast.component/classes/ToastComponent.md)

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:69

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

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:71

***

### searching

> **searching**: `boolean` = `false`

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:53

***

### searchText

> **searchText**: `ElementRef`

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:52

***

### subscriptionToEventsEmitters

> **subscriptionToEventsEmitters**: `Subscription`[] = `[]`

Defined in: src/app/core/plugin/plugin-base.ts:30

#### Inherited from

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`subscriptionToEventsEmitters`](../../../../core/plugin/plugin-base/classes/PluginBase.md#subscriptiontoeventsemitters)

***

### tcDisplayFormat

> **tcDisplayFormat**: `"h"` \| `"m"` \| `"s"` \| `"minutes"` \| `"f"` \| `"ms"` \| `"mms"` \| `"hours"` \| `"seconds"` = `'s'`

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:42

***

### tcFormatPipe

> **tcFormatPipe**: [`TcFormatPipe`](TcFormatPipe.md)

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:66

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

### transcriptionElement

> **transcriptionElement**: `ElementRef`\<`HTMLElement`\>

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:48

***

### transcriptions

> **transcriptions**: [`TranscriptionLocalisation`](../../../../core/metadata/model/transcription-localisation/interfaces/TranscriptionLocalisation.md)[] = `null`

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:60

***

### typing

> **typing**: `boolean` = `false`

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:54

***

### BACKSPACE\_KEY

> `static` **BACKSPACE\_KEY**: `string` = `'Backspace'`

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:40

***

### KARAOKE\_TC\_DELTA

> `static` **KARAOKE\_TC\_DELTA**: `number` = `0.250`

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:31

***

### PLUGIN\_NAME

> `static` **PLUGIN\_NAME**: `string` = `'TRANSCRIPTION'`

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:30

***

### SEARCH\_FOUNDED

> `static` **SEARCH\_FOUNDED**: `string` = `'founded-text'`

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:36

***

### SEARCH\_SELECTOR

> `static` **SEARCH\_SELECTOR**: `string` = `'selected-text'`

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:35

***

### SELECTOR\_ACTIVATED

> `static` **SELECTOR\_ACTIVATED**: `string` = `'activated'`

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:38

***

### SELECTOR\_NAMED\_ENTITY

> `static` **SELECTOR\_NAMED\_ENTITY**: `string` = `'named-entity'`

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:41

***

### SELECTOR\_PROGRESS\_BAR

> `static` **SELECTOR\_PROGRESS\_BAR**: `string` = `'.progress-bar'`

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:39

***

### SELECTOR\_SEGMENT

> `static` **SELECTOR\_SEGMENT**: `string` = `'segment'`

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:32

***

### SELECTOR\_SELECTED

> `static` **SELECTOR\_SELECTED**: `string` = `'selected'`

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:37

***

### SELECTOR\_SUBSEGMENT

> `static` **SELECTOR\_SUBSEGMENT**: `string` = `'subsegment'`

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:33

***

### SELECTOR\_WORD

> `static` **SELECTOR\_WORD**: `string` = `'w'`

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:34

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

### \_handleMetadataLoadedForTesting()

> **\_handleMetadataLoadedForTesting**(): `void`

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:432

**`Internal`**

#### Returns

`void`

***

### \_handleOnTimeChangeForTesting()

> **\_handleOnTimeChangeForTesting**(): `void`

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:208

**`Internal`**

#### Returns

`void`

***

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

### callSeek()

> **callSeek**(`tc`): `void`

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:116

handle call

#### Parameters

##### tc

`any`

time code

#### Returns

`void`

***

### clearSearchList()

> **clearSearchList**(): `void`

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:561

clear seach list onclick

#### Returns

`void`

***

### copy()

> **copy**(`localisation`): `void`

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:120

#### Parameters

##### localisation

`any`

#### Returns

`void`

***

### copyAll()

> **copyAll**(): `void`

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:131

#### Returns

`void`

***

### getDefaultConfig()

> **getDefaultConfig**(): [`PluginConfigData`](../../../../core/config/model/plugin-config-data/interfaces/PluginConfigData.md)\<[`TranscriptionConfig`](../../../../core/config/model/transcription-config/interfaces/TranscriptionConfig.md)\>

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:148

Return default config

#### Returns

[`PluginConfigData`](../../../../core/config/model/plugin-config-data/interfaces/PluginConfigData.md)\<[`TranscriptionConfig`](../../../../core/config/model/transcription-config/interfaces/TranscriptionConfig.md)\>

#### Overrides

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`getDefaultConfig`](../../../../core/plugin/plugin-base/classes/PluginBase.md#getdefaultconfig)

***

### handleChangeInput()

> **handleChangeInput**(`value`): `void`

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:216

Handle change text on searching input

#### Parameters

##### value

`any`

#### Returns

`void`

***

### handleMetadataLoaded()

> `protected` **handleMetadataLoaded**(): `void`

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:425

Invoked on metadata loaded

#### Returns

`void`

#### Overrides

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`handleMetadataLoaded`](../../../../core/plugin/plugin-base/classes/PluginBase.md#handlemetadataloaded)

***

### handleScroll()

> **handleScroll**(`ignoreNextScroll?`): `void`

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:416

handle scroll event

#### Parameters

##### ignoreNextScroll?

`boolean`

#### Returns

`void`

***

### handleShortcut()

> **handleShortcut**(`event`): `void`

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:584

handleShortcut on search button

#### Parameters

##### event

`any`

#### Returns

`void`

***

### init()

> **init**(): `void`

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:93

#### Returns

`void`

#### Overrides

[`PluginBase`](../../../../core/plugin/plugin-base/classes/PluginBase.md).[`init`](../../../../core/plugin/plugin-base/classes/PluginBase.md#init)

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

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:722

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

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:79

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

### scrollToSearchedWord()

> **scrollToSearchedWord**(`direction`): `void`

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:511

Scroll to next or previous searched word

#### Parameters

##### direction

`string`

#### Returns

`void`

***

### scrollToSelectedSegment()

> **scrollToSelectedSegment**(): `void`

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:542

Invocked on click SYNCHRO button

#### Returns

`void`

***

### searchWord()

> **searchWord**(`searchText`): `void`

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:482

Search word and scroll to first result

#### Parameters

##### searchText

`string`

#### Returns

`void`

***

### seekToWord()

> **seekToWord**(`e`): `void`

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:171

handle to seek work with defined tc delta

#### Parameters

##### e

`MouseEvent`

mouse event

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

### updateSynchro()

> **updateSynchro**(): `void`

Defined in: src/app/plugins/transcription/transcription-plugin.component.ts:620

if scrolling and active segment is not visible add synchro button

#### Returns

`void`
