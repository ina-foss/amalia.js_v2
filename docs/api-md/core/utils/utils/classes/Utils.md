[**Amalia**](../../../../README.md)

***

[Amalia](../../../../modules.md) / [core/utils/utils](../README.md) / Utils

# Class: Utils

Defined in: src/app/core/utils/utils.ts:15

## Constructors

### Constructor

> **new Utils**(): `Utils`

#### Returns

`Utils`

## Properties

### isArrayLike()

> `static` **isArrayLike**: \<`T`\>(`x`) => `x is ArrayLike<T>`

Defined in: src/app/core/utils/utils.ts:33

#### Type Parameters

##### T

`T`

#### Parameters

##### x

`any`

#### Returns

`x is ArrayLike<T>`

***

### mapOfRegisteredListenersPerTarget

> `static` **mapOfRegisteredListenersPerTarget**: `Map`\<`any`, `MapOfRegisteredListenersPerElement`\>

Defined in: src/app/core/utils/utils.ts:39

## Methods

### addListener()

> `static` **addListener**(`target`, `elementOnTarget`, `playerEventType`, `funcOnTarget`): `void`

Defined in: src/app/core/utils/utils.ts:69

#### Parameters

##### target

`any`

##### elementOnTarget

`any`

##### playerEventType

`string`

##### funcOnTarget

`any`

#### Returns

`void`

***

### cleanMapsOfListeners()

> `static` **cleanMapsOfListeners**(`listOfFunctions`, `fn`, `mapOfListeners`, `playerEventType`, `mapOfListenersPerElement`, `elementOnTarget`, `target`): `void`

Defined in: src/app/core/utils/utils.ts:184

#### Parameters

##### listOfFunctions

(...`args`) => `void`[]

##### fn

(...`args`) => `void`

##### mapOfListeners

`Map`\<`string`, (...`args`) => `void`[]\>

##### playerEventType

[`PlayerEventType`](../../../constant/event-type/enumerations/PlayerEventType.md)

##### mapOfListenersPerElement

`MapOfRegisteredListenersPerElement`

##### elementOnTarget

`any`

##### target

`any`

#### Returns

`void`

***

### copyToClipBoard()

> `static` **copyToClipBoard**(`text`, `tooltip?`, `x?`, `y?`): `Promise`\<`void`\>

Defined in: src/app/core/utils/utils.ts:16

#### Parameters

##### text

`any`

##### tooltip?

`any`

##### x?

`number`

##### y?

`number`

#### Returns

`Promise`\<`void`\>

***

### displaySnackBar()

> `static` **displaySnackBar**(`msgComponent`, `msgContent`, `severity`, `life?`): `void`

Defined in: src/app/core/utils/utils.ts:259

#### Parameters

##### msgComponent

`any`

##### msgContent

`string`

##### severity

`"error"` | `"success"` | `"warn"` | `"info"` | `"contrast"` | `"secondary"`

##### life?

`number`

#### Returns

`void`

***

### eventTargetNeedsToMuteShortcuts()

> `static` **eventTargetNeedsToMuteShortcuts**(`ev`): `boolean`

Defined in: src/app/core/utils/utils.ts:243

#### Parameters

##### ev

`any`

#### Returns

`boolean`

***

### getShadowRoot()

> `static` **getShadowRoot**(`elementRef`): `ShadowRoot`

Defined in: src/app/core/utils/utils.ts:201

#### Parameters

##### elementRef

`any`

#### Returns

`ShadowRoot`

***

### isInComposedPath()

> `static` **isInComposedPath**(`htmlElementId`, `event`): `boolean`

Defined in: src/app/core/utils/utils.ts:197

#### Parameters

##### htmlElementId

`string`

##### event

`any`

#### Returns

`boolean`

***

### needsToMutePlayerShortcuts()

> `static` **needsToMutePlayerShortcuts**(`el`): `boolean`

Defined in: src/app/core/utils/utils.ts:214

#### Parameters

##### el

`Element`

#### Returns

`boolean`

***

### unsubscribeTargetedElementEventListener()

> `static` **unsubscribeTargetedElementEventListener**(`target`, `elementOnTarget`, `playerEventType`, `func`): `void`

Defined in: src/app/core/utils/utils.ts:167

#### Parameters

##### target

`any`

##### elementOnTarget

`any`

##### playerEventType

[`PlayerEventType`](../../../constant/event-type/enumerations/PlayerEventType.md)

##### func

`any`

#### Returns

`void`

***

### unsubscribeTargetedElementEventListeners()

> `static` **unsubscribeTargetedElementEventListeners**(`target`, `elementOnTarget?`, `playerEventType?`): `void`

Defined in: src/app/core/utils/utils.ts:149

#### Parameters

##### target

`any`

##### elementOnTarget?

`any`

##### playerEventType?

[`PlayerEventType`](../../../constant/event-type/enumerations/PlayerEventType.md)

#### Returns

`void`

***

### waitFor()

> `static` **waitFor**(`conditionFn`, `nextActionFn?`, `completeActionFn?`, `intervalStep?`, `timeout?`, `setDataLoadingFn?`): `Subscription`

Defined in: src/app/core/utils/utils.ts:52

#### Parameters

##### conditionFn

`any`

##### nextActionFn?

`any`

##### completeActionFn?

`any`

##### intervalStep?

`number`

##### timeout?

`number`

##### setDataLoadingFn?

`any`

#### Returns

`Subscription`
