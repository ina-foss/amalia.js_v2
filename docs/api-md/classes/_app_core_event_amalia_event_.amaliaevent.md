[Amalia](../README.md) › [Globals](../globals.md) › ["app/core/event/amalia-event"](../modules/_app_core_event_amalia_event_.md) › [AmaliaEvent](_app_core_event_amalia_event_.amaliaevent.md)

# Class: AmaliaEvent <**T**>

In charge to handle Amalia event base class

## Type parameters

▪ **T**

## Hierarchy

* [Event](_app_core_event_amalia_event_.amaliaevent.md#static-event)

  ↳ **AmaliaEvent**

## Index

### Constructors

* [constructor](_app_core_event_amalia_event_.amaliaevent.md#constructor)

### Properties

* [AT_TARGET](_app_core_event_amalia_event_.amaliaevent.md#at_target)
* [BUBBLING_PHASE](_app_core_event_amalia_event_.amaliaevent.md#bubbling_phase)
* [CAPTURING_PHASE](_app_core_event_amalia_event_.amaliaevent.md#capturing_phase)
* [NONE](_app_core_event_amalia_event_.amaliaevent.md#none)
* [bubbles](_app_core_event_amalia_event_.amaliaevent.md#bubbles)
* [cancelBubble](_app_core_event_amalia_event_.amaliaevent.md#cancelbubble)
* [cancelable](_app_core_event_amalia_event_.amaliaevent.md#cancelable)
* [composed](_app_core_event_amalia_event_.amaliaevent.md#composed)
* [currentTarget](_app_core_event_amalia_event_.amaliaevent.md#currenttarget)
* [data](_app_core_event_amalia_event_.amaliaevent.md#private-data)
* [defaultPrevented](_app_core_event_amalia_event_.amaliaevent.md#defaultprevented)
* [eventPhase](_app_core_event_amalia_event_.amaliaevent.md#eventphase)
* [isTrusted](_app_core_event_amalia_event_.amaliaevent.md#istrusted)
* [returnValue](_app_core_event_amalia_event_.amaliaevent.md#returnvalue)
* [srcElement](_app_core_event_amalia_event_.amaliaevent.md#srcelement)
* [target](_app_core_event_amalia_event_.amaliaevent.md#target)
* [timeStamp](_app_core_event_amalia_event_.amaliaevent.md#timestamp)
* [type](_app_core_event_amalia_event_.amaliaevent.md#type)
* [Event](_app_core_event_amalia_event_.amaliaevent.md#static-event)

### Methods

* [composedPath](_app_core_event_amalia_event_.amaliaevent.md#composedpath)
* [initEvent](_app_core_event_amalia_event_.amaliaevent.md#initevent)
* [preventDefault](_app_core_event_amalia_event_.amaliaevent.md#preventdefault)
* [stopImmediatePropagation](_app_core_event_amalia_event_.amaliaevent.md#stopimmediatepropagation)
* [stopPropagation](_app_core_event_amalia_event_.amaliaevent.md#stoppropagation)

## Constructors

###  constructor

\+ **new AmaliaEvent**(`type`: string, `eventInitDict`: EventInit, `data`: T): *[AmaliaEvent](_app_core_event_amalia_event_.amaliaevent.md)*

Defined in src/app/core/event/amalia-event.ts:5

**Parameters:**

Name | Type |
------ | ------ |
`type` | string |
`eventInitDict` | EventInit |
`data` | T |

**Returns:** *[AmaliaEvent](_app_core_event_amalia_event_.amaliaevent.md)*

## Properties

###  AT_TARGET

• **AT_TARGET**: *number*

*Inherited from [AmaliaEvent](_app_core_event_amalia_event_.amaliaevent.md).[AT_TARGET](_app_core_event_amalia_event_.amaliaevent.md#at_target)*

Defined in node_modules/typescript/lib/lib.dom.d.ts:5445

___

###  BUBBLING_PHASE

• **BUBBLING_PHASE**: *number*

*Inherited from [AmaliaEvent](_app_core_event_amalia_event_.amaliaevent.md).[BUBBLING_PHASE](_app_core_event_amalia_event_.amaliaevent.md#bubbling_phase)*

Defined in node_modules/typescript/lib/lib.dom.d.ts:5446

___

###  CAPTURING_PHASE

• **CAPTURING_PHASE**: *number*

*Inherited from [AmaliaEvent](_app_core_event_amalia_event_.amaliaevent.md).[CAPTURING_PHASE](_app_core_event_amalia_event_.amaliaevent.md#capturing_phase)*

Defined in node_modules/typescript/lib/lib.dom.d.ts:5447

___

###  NONE

• **NONE**: *number*

*Inherited from [AmaliaEvent](_app_core_event_amalia_event_.amaliaevent.md).[NONE](_app_core_event_amalia_event_.amaliaevent.md#none)*

Defined in node_modules/typescript/lib/lib.dom.d.ts:5448

___

###  bubbles

• **bubbles**: *boolean*

*Inherited from [AmaliaEvent](_app_core_event_amalia_event_.amaliaevent.md).[bubbles](_app_core_event_amalia_event_.amaliaevent.md#bubbles)*

Defined in node_modules/typescript/lib/lib.dom.d.ts:5387

Returns true or false depending on how event was initialized. True if event goes through its target's ancestors in reverse tree order, and false otherwise.

___

###  cancelBubble

• **cancelBubble**: *boolean*

*Inherited from [AmaliaEvent](_app_core_event_amalia_event_.amaliaevent.md).[cancelBubble](_app_core_event_amalia_event_.amaliaevent.md#cancelbubble)*

Defined in node_modules/typescript/lib/lib.dom.d.ts:5388

___

###  cancelable

• **cancelable**: *boolean*

*Inherited from [AmaliaEvent](_app_core_event_amalia_event_.amaliaevent.md).[cancelable](_app_core_event_amalia_event_.amaliaevent.md#cancelable)*

Defined in node_modules/typescript/lib/lib.dom.d.ts:5392

Returns true or false depending on how event was initialized. Its return value does not always carry meaning, but true can indicate that part of the operation during which event was dispatched, can be canceled by invoking the preventDefault() method.

___

###  composed

• **composed**: *boolean*

*Inherited from [AmaliaEvent](_app_core_event_amalia_event_.amaliaevent.md).[composed](_app_core_event_amalia_event_.amaliaevent.md#composed)*

Defined in node_modules/typescript/lib/lib.dom.d.ts:5396

Returns true or false depending on how event was initialized. True if event invokes listeners past a ShadowRoot node that is the root of its target, and false otherwise.

___

###  currentTarget

• **currentTarget**: *EventTarget | null*

*Inherited from [AmaliaEvent](_app_core_event_amalia_event_.amaliaevent.md).[currentTarget](_app_core_event_amalia_event_.amaliaevent.md#currenttarget)*

Defined in node_modules/typescript/lib/lib.dom.d.ts:5400

Returns the object whose event listener's callback is currently being invoked.

___

### `Private` data

• **data**: *T*

Defined in src/app/core/event/amalia-event.ts:5

___

###  defaultPrevented

• **defaultPrevented**: *boolean*

*Inherited from [AmaliaEvent](_app_core_event_amalia_event_.amaliaevent.md).[defaultPrevented](_app_core_event_amalia_event_.amaliaevent.md#defaultprevented)*

Defined in node_modules/typescript/lib/lib.dom.d.ts:5404

Returns true if preventDefault() was invoked successfully to indicate cancelation, and false otherwise.

___

###  eventPhase

• **eventPhase**: *number*

*Inherited from [AmaliaEvent](_app_core_event_amalia_event_.amaliaevent.md).[eventPhase](_app_core_event_amalia_event_.amaliaevent.md#eventphase)*

Defined in node_modules/typescript/lib/lib.dom.d.ts:5408

Returns the event's phase, which is one of NONE, CAPTURING_PHASE, AT_TARGET, and BUBBLING_PHASE.

___

###  isTrusted

• **isTrusted**: *boolean*

*Inherited from [AmaliaEvent](_app_core_event_amalia_event_.amaliaevent.md).[isTrusted](_app_core_event_amalia_event_.amaliaevent.md#istrusted)*

Defined in node_modules/typescript/lib/lib.dom.d.ts:5412

Returns true if event was dispatched by the user agent, and false otherwise.

___

###  returnValue

• **returnValue**: *boolean*

*Inherited from [AmaliaEvent](_app_core_event_amalia_event_.amaliaevent.md).[returnValue](_app_core_event_amalia_event_.amaliaevent.md#returnvalue)*

Defined in node_modules/typescript/lib/lib.dom.d.ts:5413

___

###  srcElement

• **srcElement**: *EventTarget | null*

*Inherited from [AmaliaEvent](_app_core_event_amalia_event_.amaliaevent.md).[srcElement](_app_core_event_amalia_event_.amaliaevent.md#srcelement)*

Defined in node_modules/typescript/lib/lib.dom.d.ts:5415

**`deprecated`** 

___

###  target

• **target**: *EventTarget | null*

*Inherited from [AmaliaEvent](_app_core_event_amalia_event_.amaliaevent.md).[target](_app_core_event_amalia_event_.amaliaevent.md#target)*

Defined in node_modules/typescript/lib/lib.dom.d.ts:5419

Returns the object to which event is dispatched (its target).

___

###  timeStamp

• **timeStamp**: *number*

*Inherited from [AmaliaEvent](_app_core_event_amalia_event_.amaliaevent.md).[timeStamp](_app_core_event_amalia_event_.amaliaevent.md#timestamp)*

Defined in node_modules/typescript/lib/lib.dom.d.ts:5423

Returns the event's timestamp as the number of milliseconds measured relative to the time origin.

___

###  type

• **type**: *string*

*Inherited from [AmaliaEvent](_app_core_event_amalia_event_.amaliaevent.md).[type](_app_core_event_amalia_event_.amaliaevent.md#type)*

Defined in node_modules/typescript/lib/lib.dom.d.ts:5427

Returns the type of event, e.g. "click", "hashchange", or "submit".

___

### `Static` Event

▪ **Event**: *object*

Defined in node_modules/typescript/lib/lib.dom.d.ts:5451

#### Type declaration:

* **new __type**(`type`: string, `eventInitDict?`: EventInit): *[Event](_app_core_event_amalia_event_.amaliaevent.md#static-event)*

* **AT_TARGET**: *number*

* **BUBBLING_PHASE**: *number*

* **CAPTURING_PHASE**: *number*

* **NONE**: *number*

* **prototype**: *[Event](_app_core_event_amalia_event_.amaliaevent.md#static-event)*

## Methods

###  composedPath

▸ **composedPath**(): *EventTarget[]*

*Inherited from [AmaliaEvent](_app_core_event_amalia_event_.amaliaevent.md).[composedPath](_app_core_event_amalia_event_.amaliaevent.md#composedpath)*

Defined in node_modules/typescript/lib/lib.dom.d.ts:5431

Returns the invocation target objects of event's path (objects on which listeners will be invoked), except for any nodes in shadow trees of which the shadow root's mode is "closed" that are not reachable from event's currentTarget.

**Returns:** *EventTarget[]*

___

###  initEvent

▸ **initEvent**(`type`: string, `bubbles?`: boolean, `cancelable?`: boolean): *void*

*Inherited from [AmaliaEvent](_app_core_event_amalia_event_.amaliaevent.md).[initEvent](_app_core_event_amalia_event_.amaliaevent.md#initevent)*

Defined in node_modules/typescript/lib/lib.dom.d.ts:5432

**Parameters:**

Name | Type |
------ | ------ |
`type` | string |
`bubbles?` | boolean |
`cancelable?` | boolean |

**Returns:** *void*

___

###  preventDefault

▸ **preventDefault**(): *void*

*Inherited from [AmaliaEvent](_app_core_event_amalia_event_.amaliaevent.md).[preventDefault](_app_core_event_amalia_event_.amaliaevent.md#preventdefault)*

Defined in node_modules/typescript/lib/lib.dom.d.ts:5436

If invoked when the cancelable attribute value is true, and while executing a listener for the event with passive set to false, signals to the operation that caused event to be dispatched that it needs to be canceled.

**Returns:** *void*

___

###  stopImmediatePropagation

▸ **stopImmediatePropagation**(): *void*

*Inherited from [AmaliaEvent](_app_core_event_amalia_event_.amaliaevent.md).[stopImmediatePropagation](_app_core_event_amalia_event_.amaliaevent.md#stopimmediatepropagation)*

Defined in node_modules/typescript/lib/lib.dom.d.ts:5440

Invoking this method prevents event from reaching any registered event listeners after the current one finishes running and, when dispatched in a tree, also prevents event from reaching any other objects.

**Returns:** *void*

___

###  stopPropagation

▸ **stopPropagation**(): *void*

*Inherited from [AmaliaEvent](_app_core_event_amalia_event_.amaliaevent.md).[stopPropagation](_app_core_event_amalia_event_.amaliaevent.md#stoppropagation)*

Defined in node_modules/typescript/lib/lib.dom.d.ts:5444

When dispatched in a tree, invoking this method prevents event from reaching any objects other than the current object.

**Returns:** *void*
