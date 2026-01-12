[**Amalia**](../../../README.md)

***

[Amalia](../../../modules.md) / [service/annotations.service](../README.md) / AnnotationsService

# Class: AnnotationsService

Defined in: src/app/service/annotations.service.ts:9

## Constructors

### Constructor

> **new AnnotationsService**(): `AnnotationsService`

#### Returns

`AnnotationsService`

## Properties

### actionEmitter

> **actionEmitter**: `EventEmitter`\<[`AnnotationAction`](../../../core/metadata/model/annotation-localisation/interfaces/AnnotationAction.md)\>

Defined in: src/app/service/annotations.service.ts:12

## Methods

### getAnnotations()

> **getAnnotations**(): `Set`\<[`AnnotationPluginComponent`](../../../plugins/annotation/annotation-plugin.component/classes/AnnotationPluginComponent.md)\>

Defined in: src/app/service/annotations.service.ts:17

#### Returns

`Set`\<[`AnnotationPluginComponent`](../../../plugins/annotation/annotation-plugin.component/classes/AnnotationPluginComponent.md)\>

***

### getFocusedAnnotation()

> **getFocusedAnnotation**(): [`AnnotationPluginComponent`](../../../plugins/annotation/annotation-plugin.component/classes/AnnotationPluginComponent.md)

Defined in: src/app/service/annotations.service.ts:47

#### Returns

[`AnnotationPluginComponent`](../../../plugins/annotation/annotation-plugin.component/classes/AnnotationPluginComponent.md)

***

### registerAnnotation()

> **registerAnnotation**(`annotation`): `void`

Defined in: src/app/service/annotations.service.ts:14

#### Parameters

##### annotation

[`AnnotationPluginComponent`](../../../plugins/annotation/annotation-plugin.component/classes/AnnotationPluginComponent.md)

#### Returns

`void`

***

### removeAnnotation()

> **removeAnnotation**(`annotation`): `void`

Defined in: src/app/service/annotations.service.ts:21

#### Parameters

##### annotation

[`AnnotationPluginComponent`](../../../plugins/annotation/annotation-plugin.component/classes/AnnotationPluginComponent.md)

#### Returns

`void`

***

### setFocusedAnnotation()

> **setFocusedAnnotation**(`annotation`): `void`

Defined in: src/app/service/annotations.service.ts:31

#### Parameters

##### annotation

[`AnnotationPluginComponent`](../../../plugins/annotation/annotation-plugin.component/classes/AnnotationPluginComponent.md)

#### Returns

`void`

***

### setFocusToNextAvailableAnnotation()

> **setFocusToNextAvailableAnnotation**(): `void`

Defined in: src/app/service/annotations.service.ts:51

#### Returns

`void`
