[**Amalia**](../../../../README.md)

***

[Amalia](../../../../modules.md) / [core/utils/metadata-utils](../README.md) / MetadataUtils

# Class: MetadataUtils

Defined in: src/app/core/utils/metadata-utils.ts:12

## Constructors

### Constructor

> **new MetadataUtils**(): `MetadataUtils`

#### Returns

`MetadataUtils`

## Methods

### getAnnotationLocalisations()

> `static` **getAnnotationLocalisations**(`metadata`): [`AnnotationLocalisation`](../../../metadata/model/annotation-localisation/interfaces/AnnotationLocalisation.md)[]

Defined in: src/app/core/utils/metadata-utils.ts:33

Return list of transcription

#### Parameters

##### metadata

`Metadata`

localisation

#### Returns

[`AnnotationLocalisation`](../../../metadata/model/annotation-localisation/interfaces/AnnotationLocalisation.md)[]

***

### getHistograms()

> `static` **getHistograms**(`metadata`): [`Histogram`](../../../metadata/model/histogram/interfaces/Histogram.md)[]

Defined in: src/app/core/utils/metadata-utils.ts:109

Return list of histogram

#### Parameters

##### metadata

`Metadata`

metadata

#### Returns

[`Histogram`](../../../metadata/model/histogram/interfaces/Histogram.md)[]

***

### getTimelineLocalisations()

> `static` **getTimelineLocalisations**(`metadata`): [`TimelineLocalisation`](../../../metadata/model/timeline-localisation/interfaces/TimelineLocalisation.md)[]

Defined in: src/app/core/utils/metadata-utils.ts:128

Parse timeline localisation

#### Parameters

##### metadata

`Metadata`

amalia model

#### Returns

[`TimelineLocalisation`](../../../metadata/model/timeline-localisation/interfaces/TimelineLocalisation.md)[]

***

### getTranscriptionLocalisations()

> `static` **getTranscriptionLocalisations**(`metadata`, `parseLevel`, `withSubLocalisations`): [`TranscriptionLocalisation`](../../../metadata/model/transcription-localisation/interfaces/TranscriptionLocalisation.md)[]

Defined in: src/app/core/utils/metadata-utils.ts:19

Return list of transcription

#### Parameters

##### metadata

`Metadata`

localisation

##### parseLevel

`number` = `1`

parse level

##### withSubLocalisations

`boolean` = `false`

true for parse sub localisation

#### Returns

[`TranscriptionLocalisation`](../../../metadata/model/transcription-localisation/interfaces/TranscriptionLocalisation.md)[]

***

### parseTranscriptionLocalisations()

> `static` **parseTranscriptionLocalisations**(`l`, `localisations`, `parseLevel`, `withSubLocalisations`, `annotationsLoc`): `void`

Defined in: src/app/core/utils/metadata-utils.ts:67

In charge to parse transcription

#### Parameters

##### l

`any`

localisation

##### localisations

[`TranscriptionLocalisation`](../../../metadata/model/transcription-localisation/interfaces/TranscriptionLocalisation.md)[]

transcription

##### parseLevel

`number`

parse level

##### withSubLocalisations

`boolean`

true for parse sub localisation

##### annotationsLoc

[`TranscriptionAnnotation`](../../../metadata/model/transcription-localisation/interfaces/TranscriptionAnnotation.md)[]

#### Returns

`void`
