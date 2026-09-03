[**Amalia**](../../../../README.md)

***

[Amalia](../../../../modules.md) / [core/messages/ina-messages.component](../README.md) / InaMessagesComponent

# Class: InaMessagesComponent

Defined in: src/app/core/messages/ina-messages.component.ts:14

## Constructors

### Constructor

> **new InaMessagesComponent**(): `InaMessagesComponent`

#### Returns

`InaMessagesComponent`

## Properties

### closable

> **closable**: `boolean` = `true`

Defined in: src/app/core/messages/ina-messages.component.ts:16

***

### enableIcon

> **enableIcon**: `boolean` = `true`

Defined in: src/app/core/messages/ina-messages.component.ts:17

***

### escape

> **escape**: `boolean` = `true`

Defined in: src/app/core/messages/ina-messages.component.ts:18

***

### key

> **key**: `string` = `'ina-messages'`

Defined in: src/app/core/messages/ina-messages.component.ts:15

***

### life

> **life**: `number` = `6000`

Defined in: src/app/core/messages/ina-messages.component.ts:21

***

### messages

> `readonly` **messages**: `WritableSignal`\<`Message`[]\>

Defined in: src/app/core/messages/ina-messages.component.ts:23

***

### severityConfig

> `readonly` **severityConfig**: readonly \[\{ `containerClass`: `"p-message-success"`; `iconClass`: `"pi pi-check"`; `severity`: `"success"`; \}, \{ `containerClass`: `"p-message-error"`; `iconClass`: `"pi pi-times"`; `severity`: `"error"`; \}, \{ `containerClass`: `"p-message-info"`; `iconClass`: `"pi pi-info"`; `severity`: `"info"`; \}, \{ `containerClass`: `"p-message-warn"`; `iconClass`: `"pi pi-exclamation-triangle"`; `severity`: `"warn"`; \}\]

Defined in: src/app/core/messages/ina-messages.component.ts:25

***

### sticky

> **sticky**: `boolean` = `true`

Defined in: src/app/core/messages/ina-messages.component.ts:20

***

### styleClass

> **styleClass**: `string` = `''`

Defined in: src/app/core/messages/ina-messages.component.ts:19

## Methods

### addMessage()

> **addMessage**(`message`): `void`

Defined in: src/app/core/messages/ina-messages.component.ts:64

#### Parameters

##### message

[`InaMessage`](../../ina-messages.model/interfaces/InaMessage.md)

#### Returns

`void`

***

### clear()

> **clear**(): `void`

Defined in: src/app/core/messages/ina-messages.component.ts:98

#### Returns

`void`

***

### removeMessage()

> **removeMessage**(`index`): `void`

Defined in: src/app/core/messages/ina-messages.component.ts:102

#### Parameters

##### index

`number`

#### Returns

`void`

***

### setMessages()

> **setMessages**(`messages`): `void`

Defined in: src/app/core/messages/ina-messages.component.ts:80

#### Parameters

##### messages

[`InaMessage`](../../ina-messages.model/interfaces/InaMessage.md)[]

#### Returns

`void`

***

### showError()

> **showError**(`detail`, `summary?`): `void`

Defined in: src/app/core/messages/ina-messages.component.ts:52

#### Parameters

##### detail

`string`

##### summary?

`string`

#### Returns

`void`

***

### showInfo()

> **showInfo**(`detail`, `summary?`): `void`

Defined in: src/app/core/messages/ina-messages.component.ts:56

#### Parameters

##### detail

`string`

##### summary?

`string`

#### Returns

`void`

***

### showSuccess()

> **showSuccess**(`detail`, `summary?`): `void`

Defined in: src/app/core/messages/ina-messages.component.ts:48

#### Parameters

##### detail

`string`

##### summary?

`string`

#### Returns

`void`

***

### showWarn()

> **showWarn**(`detail`, `summary?`): `void`

Defined in: src/app/core/messages/ina-messages.component.ts:60

#### Parameters

##### detail

`string`

##### summary?

`string`

#### Returns

`void`

***

### trackByFn()

> **trackByFn**(`index`, `message`): `string`

Defined in: src/app/core/messages/ina-messages.component.ts:118

#### Parameters

##### index

`number`

##### message

`Message`

#### Returns

`string`
