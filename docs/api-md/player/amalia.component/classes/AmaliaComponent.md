[**Amalia**](../../../README.md)

***

[Amalia](../../../modules.md) / [player/amalia.component](../README.md) / AmaliaComponent

# Class: AmaliaComponent

Defined in: src/app/player/amalia.component.ts:45

## Implements

- `OnInit`
- `OnDestroy`

## Constructors

### Constructor

> **new AmaliaComponent**(`playerService`, `httpClient`, `thumbnailService`, `sanitizer`): `AmaliaComponent`

Defined in: src/app/player/amalia.component.ts:258

#### Parameters

##### playerService

[`MediaPlayerService`](../../../service/media-player-service/classes/MediaPlayerService.md)

##### httpClient

`HttpClient`

##### thumbnailService

[`ThumbnailService`](../../../service/thumbnail-service/classes/ThumbnailService.md)

##### sanitizer

`DomSanitizer`

#### Returns

`AmaliaComponent`

## Properties

### aspectRatio

> **aspectRatio**: `any`

Defined in: src/app/player/amalia.component.ts:63

Selected aspectRatio

***

### autoplay

> **autoplay**: `boolean`

Defined in: src/app/player/amalia.component.ts:103

Set player autoplay state

***

### callback

> **callback**: `EventEmitter`\<`any`\>

Defined in: src/app/player/amalia.component.ts:165

Amalia events

***

### chrono

> **chrono**: `any`

Defined in: src/app/player/amalia.component.ts:51

***

### configLoader

> **configLoader**: [`Loader`](../../../core/loader/loader/interfaces/Loader.md)\<[`ConfigData`](../../../core/config/model/config-data/interfaces/ConfigData.md)\>

Defined in: src/app/player/amalia.component.ts:142

Config loader in charge to load config data

***

### contextMenu

> **contextMenu**: `ElementRef`\<`HTMLElement`\>

Defined in: src/app/player/amalia.component.ts:177

Get context menu html element

***

### contextMenuState

> **contextMenuState**: `boolean`

Defined in: src/app/player/amalia.component.ts:68

True for shown context menu

***

### enablePreviewThumbnail

> **enablePreviewThumbnail**: `boolean` = `false`

Defined in: src/app/player/amalia.component.ts:83

In charge to show preview thumbnail

***

### errorMessage

> **errorMessage**: `any`

Defined in: src/app/player/amalia.component.ts:245

Message d'erreur

***

### handleKeyUpEvent

> **handleKeyUpEvent**: `any`

Defined in: src/app/player/amalia.component.ts:117

***

### inError

> **inError**: `boolean` = `false`

Defined in: src/app/player/amalia.component.ts:190

true when error

***

### inLoading

> **inLoading**: `boolean` = `false`

Defined in: src/app/player/amalia.component.ts:185

true when player load content

***

### intervalImages

> **intervalImages**: `any`

Defined in: src/app/player/amalia.component.ts:59

Interval Images

***

### listKeys

> **listKeys**: `any`[] = `[]`

Defined in: src/app/player/amalia.component.ts:235

List of pressed keys

***

### logger

> **logger**: [`DefaultLogger`](../../../core/logger/default-logger/classes/DefaultLogger.md)

Defined in: src/app/player/amalia.component.ts:195

Default loader

***

### mainSource

> **mainSource**: `boolean` = `true`

Defined in: src/app/player/amalia.component.ts:116

***

### mediaContainer

> **mediaContainer**: `ElementRef`\<`HTMLElement`\>

Defined in: src/app/player/amalia.component.ts:220

mediaContainer element

***

### mediaPlayer

> **mediaPlayer**: `ElementRef`\<`HTMLVideoElement`\>

Defined in: src/app/player/amalia.component.ts:171

get video html element

***

### mediaPlayerElement

> **mediaPlayerElement**: [`MediaPlayerElement`](../../../core/media-player-element/classes/MediaPlayerElement.md)

Defined in: src/app/player/amalia.component.ts:230

Amalia player main manager

***

### metadataConverter

> **metadataConverter**: [`Converter`](../../../core/converter/converter/interfaces/Converter.md)\<`Metadata`\>

Defined in: src/app/player/amalia.component.ts:153

Metadata converter, converter metadata parameter

***

### metadataLoader

> **metadataLoader**: [`Loader`](../../../core/loader/loader/interfaces/Loader.md)\<`Metadata`[]\>

Defined in: src/app/player/amalia.component.ts:159

Metadata loader

***

### muteShortcuts

> **muteShortcuts**: `boolean` = `false`

Defined in: src/app/player/amalia.component.ts:120

***

### pinned

> **pinned**: `boolean` = `false`

Defined in: src/app/player/amalia.component.ts:207

Pinned Slider state

***

### pinnedControlbar

> **pinnedControlbar**: `boolean` = `false`

Defined in: src/app/player/amalia.component.ts:211

Pinned ControlBar state

***

### playerConfig

> **playerConfig**: [`ConfigData`](../../../core/config/model/config-data/interfaces/ConfigData.md)

Defined in: src/app/player/amalia.component.ts:78

Player configuration

***

### playerHover

> **playerHover**: `boolean` = `false`

Defined in: src/app/player/amalia.component.ts:112

true when the mouse in over the player

***

### playerId

> **playerId**: `string`

Defined in: src/app/player/amalia.component.ts:93

Generate player base id

***

### playerService

> **playerService**: [`MediaPlayerService`](../../../service/media-player-service/classes/MediaPlayerService.md)

Defined in: src/app/player/amalia.component.ts:203

In charge to get instance of player

***

### PlayerState

> **PlayerState**: *typeof* [`PlayerState`](../../../core/constant/player-state/enumerations/PlayerState.md)

Defined in: src/app/player/amalia.component.ts:73

player state 4by3

***

### posterBackgound

> **posterBackgound**: `object`

Defined in: src/app/player/amalia.component.ts:252

####  amalia-secondary-color

> ** amalia-secondary-color**: `boolean` = `false`

#### amalia-player-bg-color1

> **amalia-player-bg-color1**: `boolean` = `false`

#### amalia-primary-color

> **amalia-primary-color**: `boolean` = `false`

***

### previewThumbnailElement

> **previewThumbnailElement**: `ElementRef`\<`HTMLVideoElement`\>

Defined in: src/app/player/amalia.component.ts:98

Preview thumbnail container

***

### previewThumbnailUrl

> **previewThumbnailUrl**: `string` = `''`

Defined in: src/app/player/amalia.component.ts:87

preview thumbnail url

***

### ratio

> **ratio**: `string` = `'16-9'`

Defined in: src/app/player/amalia.component.ts:199

default aspect ratio

***

### state

> **state**: [`PlayerState`](../../../core/constant/player-state/enumerations/PlayerState.md)

Defined in: src/app/player/amalia.component.ts:55

player state

***

### tc

> **tc**: `number` = `0`

Defined in: src/app/player/amalia.component.ts:181

tc

***

### throttleFunc

> **throttleFunc**: `any`

Defined in: src/app/player/amalia.component.ts:241

***

### thumbnailBlobVideo

> **thumbnailBlobVideo**: `any`

Defined in: src/app/player/amalia.component.ts:239

thumbnail blob preview on seeking

***

### version

> **version**: `string` = `environment.VERSION`

Defined in: src/app/player/amalia.component.ts:50

version of player

***

### videoPoster

> **videoPoster**: `string` = `''`

Defined in: src/app/player/amalia.component.ts:251

attribut qui definit une image a afficher lorsque la video est en cours de chargement,<br/>
ou jusqu'a ce que l'utilisateur ne joue la video.

***

### DEFAULT\_THROTTLE\_INVOCATION\_TIME

> `static` **DEFAULT\_THROTTLE\_INVOCATION\_TIME**: `number` = `150`

Defined in: src/app/player/amalia.component.ts:46

## Accessors

### config

#### Get Signature

> **get** **config**(): `any`

Defined in: src/app/player/amalia.component.ts:122

##### Returns

`any`

#### Set Signature

> **set** **config**(`value`): `void`

Defined in: src/app/player/amalia.component.ts:127

##### Parameters

###### value

`any`

##### Returns

`void`

## Methods

### \_handleEraseErrorForTesting()

> **\_handleEraseErrorForTesting**(`event`): `void`

Defined in: src/app/player/amalia.component.ts:879

**`Internal`**

#### Parameters

##### event

`any`

#### Returns

`void`

***

### \_handleErrorForTesting()

> **\_handleErrorForTesting**(`event`): `void`

Defined in: src/app/player/amalia.component.ts:874

**`Internal`**

#### Parameters

##### event

`any`

#### Returns

`void`

***

### \_handlePlayForTesting()

> **\_handlePlayForTesting**(): `void`

Defined in: src/app/player/amalia.component.ts:884

**`Internal`**

#### Returns

`void`

***

### \_setEnableThumbnailForTesting()

> **\_setEnableThumbnailForTesting**(`value`): `void`

Defined in: src/app/player/amalia.component.ts:864

**`Internal`**

#### Parameters

##### value

`boolean`

#### Returns

`void`

***

### \_setPreviewThumbnailForTesting()

> **\_setPreviewThumbnailForTesting**(`value`): `void`

Defined in: src/app/player/amalia.component.ts:869

**`Internal`**

#### Parameters

##### value

`any`

#### Returns

`void`

***

### addListener()

> **addListener**(`element`, `playerEventType`, `func`): `void`

Defined in: src/app/player/amalia.component.ts:853

#### Parameters

##### element

`any`

##### playerEventType

[`PlayerEventType`](../../../core/constant/event-type/enumerations/PlayerEventType.md)

##### func

`any`

#### Returns

`void`

***

### clearInterval()

> **clearInterval**(): `void`

Defined in: src/app/player/amalia.component.ts:788

#### Returns

`void`

***

### controlClicked()

> **controlClicked**(`$event`): `void`

Defined in: src/app/player/amalia.component.ts:849

#### Parameters

##### $event

`any`

#### Returns

`void`

***

### displayControlBar()

> **displayControlBar**(`_displayControlBar`): `void`

Defined in: src/app/player/amalia.component.ts:653

Invoked on mouseenter and mouseleave events

#### Parameters

##### \_displayControlBar

`boolean`

#### Returns

`void`

***

### displayImages()

> **displayImages**(`framesPerSecond`, `ms`, `rewinding`): `void`

Defined in: src/app/player/amalia.component.ts:800

#### Parameters

##### framesPerSecond

`any`

##### ms

`any`

##### rewinding

`any`

#### Returns

`void`

***

### emitKeyDownEvent()

> **emitKeyDownEvent**(`$event`): `void`

Defined in: src/app/player/amalia.component.ts:712

invoked on keydown

#### Parameters

##### $event

`any`

#### Returns

`void`

***

### emitKeyUpEvent()

> **emitKeyUpEvent**(): `void`

Defined in: src/app/player/amalia.component.ts:739

#### Returns

`void`

***

### focus()

> **focus**(): `void`

Defined in: src/app/player/amalia.component.ts:644

focus mediaPlayer container

#### Returns

`void`

***

### handleFullScreenChange()

> **handleFullScreenChange**(): `void`

Defined in: src/app/player/amalia.component.ts:665

Invoked on fullscreen change

#### Returns

`void`

***

### handleKeyDownEvent()

> **handleKeyDownEvent**(`event`): `void`

Defined in: src/app/player/amalia.component.ts:703

#### Parameters

##### event

`any`

#### Returns

`void`

***

### handleLoading()

> **handleLoading**(): `void`

Defined in: src/app/player/amalia.component.ts:477

#### Returns

`void`

***

### handleLoadingEnd()

> **handleLoadingEnd**(): `void`

Defined in: src/app/player/amalia.component.ts:482

#### Returns

`void`

***

### handleMuteShortcuts()

> **handleMuteShortcuts**(`$event`): `void`

Defined in: src/app/player/amalia.component.ts:427

#### Parameters

##### $event

`any`

#### Returns

`void`

***

### handlePinnedControlbarChange()

> **handlePinnedControlbarChange**(`event`): `void`

Defined in: src/app/player/amalia.component.ts:487

#### Parameters

##### event

`any`

#### Returns

`void`

***

### handlePinnedSliderChange()

> **handlePinnedSliderChange**(`event`): `void`

Defined in: src/app/player/amalia.component.ts:498

#### Parameters

##### event

`any`

#### Returns

`void`

***

### handleShortCutsKeyDownEvent()

> **handleShortCutsKeyDownEvent**(`$event`): `void`

Defined in: src/app/player/amalia.component.ts:443

#### Parameters

##### $event

`any`

#### Returns

`void`

***

### handleUnmuteShortcuts()

> **handleUnmuteShortcuts**(`$event`): `void`

Defined in: src/app/player/amalia.component.ts:435

#### Parameters

##### $event

`any`

#### Returns

`void`

***

### handleWindowResize()

> **handleWindowResize**(): `void`

Defined in: src/app/player/amalia.component.ts:301

update mediaPlayerWidth on window resize

#### Returns

`void`

***

### hideControls()

> **hideControls**(): `void`

Defined in: src/app/player/amalia.component.ts:763

#### Returns

`void`

***

### hideControlsMenuOnClickDocument()

> **hideControlsMenuOnClickDocument**(`$event`): `void`

Defined in: src/app/player/amalia.component.ts:745

#### Parameters

##### $event

`any`

#### Returns

`void`

***

### loopImages()

> **loopImages**(`tc`): `void`

Defined in: src/app/player/amalia.component.ts:821

#### Parameters

##### tc

`any`

#### Returns

`void`

***

### ngOnDestroy()

> **ngOnDestroy**(): `void`

Defined in: src/app/player/amalia.component.ts:857

A callback method that performs custom clean-up, invoked immediately
before a directive, pipe, or service instance is destroyed.

#### Returns

`void`

#### Implementation of

`OnDestroy.ngOnDestroy`

***

### ngOnInit()

> **ngOnInit**(): `void`

Defined in: src/app/player/amalia.component.ts:269

Invoked immediately after the  first time the component has initialised

#### Returns

`void`

#### Implementation of

`OnInit.ngOnInit`

***

### onContextMenu()

> **onContextMenu**(`event`): `boolean`

Defined in: src/app/player/amalia.component.ts:317

Invoked on click context menu

#### Parameters

##### event

`MouseEvent`

mouse event

#### Returns

`boolean`

return false for disable browser context menu

***

### resetTimer()

> **resetTimer**(): `void`

Defined in: src/app/player/amalia.component.ts:755

#### Returns

`void`

***

### scrollPlaybackRateImages()

> **scrollPlaybackRateImages**(`$event`): `void`

Defined in: src/app/player/amalia.component.ts:768

#### Parameters

##### $event

`any`

#### Returns

`void`

***

### sendCurrentTime()

> **sendCurrentTime**(): `void`

Defined in: src/app/player/amalia.component.ts:467

#### Returns

`void`

***

### sendDuration()

> **sendDuration**(): `void`

Defined in: src/app/player/amalia.component.ts:473

#### Returns

`void`

***

### setCurrentTime()

> **setCurrentTime**(`event`): `void`

Defined in: src/app/player/amalia.component.ts:470

#### Parameters

##### event

`any`

#### Returns

`void`

***

### showImage()

> **showImage**(`tc`): `Promise`\<`unknown`\>

Defined in: src/app/player/amalia.component.ts:830

#### Parameters

##### tc

`any`

#### Returns

`Promise`\<`unknown`\>

***

### startTimer()

> **startTimer**(): `void`

Defined in: src/app/player/amalia.component.ts:750

#### Returns

`void`
