[**Amalia**](../../../../README.md)

***

[Amalia](../../../../modules.md) / [core/metadata/metadata-manager](../README.md) / MetadataManager

# Class: MetadataManager

Defined in: src/app/core/metadata/metadata-manager.ts:18

In charge to handle metadata

## Constructors

### Constructor

> **new MetadataManager**(`configurationManager`, `defaultLoader`, `logger`): `MetadataManager`

Defined in: src/app/core/metadata/metadata-manager.ts:26

#### Parameters

##### configurationManager

[`ConfigurationManager`](../../../config/configuration-manager/classes/ConfigurationManager.md)

##### defaultLoader

[`Loader`](../../../loader/loader/interfaces/Loader.md)\<`Metadata`[]\>

##### logger

[`LoggerInterface`](../../../logger/logger-interface/interfaces/LoggerInterface.md)

#### Returns

`MetadataManager`

## Properties

### AUTHORIZATION\_HEADER

> `static` **AUTHORIZATION\_HEADER**: `string` = `'Authorization: Bearer'`

Defined in: src/app/core/metadata/metadata-manager.ts:24

## Methods

### addMetadata()

> **addMetadata**(`metadata`): `void`

Defined in: src/app/core/metadata/metadata-manager.ts:139

Add Metadata block

#### Parameters

##### metadata

`Metadata`

metadata

#### Returns

`void`

#### Throws

AmaliaException

***

### getAnnotationLocalisations()

> **getAnnotationLocalisations**(`metadataId`): [`AnnotationLocalisation`](../../model/annotation-localisation/interfaces/AnnotationLocalisation.md)[]

Defined in: src/app/core/metadata/metadata-manager.ts:183

Return annotation metadata

#### Parameters

##### metadataId

`string`

metadata

#### Returns

[`AnnotationLocalisation`](../../model/annotation-localisation/interfaces/AnnotationLocalisation.md)[]

***

### getHistograms()

> **getHistograms**(`metadataIds`): [`Histogram`](../../model/histogram/interfaces/Histogram.md)[]

Defined in: src/app/core/metadata/metadata-manager.ts:208

Return all parsed histogram

#### Parameters

##### metadataIds

`string`[]

ids

#### Returns

[`Histogram`](../../model/histogram/interfaces/Histogram.md)[]

***

### getMetadata()

> **getMetadata**(`metadataId`): `Metadata`

Defined in: src/app/core/metadata/metadata-manager.ts:109

Get Metadata block

#### Parameters

##### metadataId

`string`

metadata id

#### Returns

`Metadata`

#### Throws

AmaliaException

***

### getMetadataByType()

> **getMetadataByType**(`metadataType`): `Metadata`[]

Defined in: src/app/core/metadata/metadata-manager.ts:130

Return list of metadata By Id

#### Parameters

##### metadataType

`string`

type of metadata

#### Returns

`Metadata`[]

listOfMetadataById

***

### getTimelineLocalisations()

> **getTimelineLocalisations**(`metadata`): [`TimelineLocalisation`](../../model/timeline-localisation/interfaces/TimelineLocalisation.md)[]

Defined in: src/app/core/metadata/metadata-manager.ts:200

Get timeline metadata block

#### Parameters

##### metadata

`Metadata`

#### Returns

[`TimelineLocalisation`](../../model/timeline-localisation/interfaces/TimelineLocalisation.md)[]

#### Throws

AmaliaException

***

### getTranscriptionLocalisations()

> **getTranscriptionLocalisations**(`metadataId`, `parseLevel`, `withSubLocalisations`): [`TranscriptionLocalisation`](../../model/transcription-localisation/interfaces/TranscriptionLocalisation.md)[]

Defined in: src/app/core/metadata/metadata-manager.ts:167

Return transcription metadata

#### Parameters

##### metadataId

`string`

metadata

##### parseLevel

`number` = `1`

parse level default 1

##### withSubLocalisations

`boolean` = `false`

sub localisation default false

#### Returns

[`TranscriptionLocalisation`](../../model/transcription-localisation/interfaces/TranscriptionLocalisation.md)[]

***

### hasMetadataKey()

> **hasMetadataKey**(`metadataId`): `boolean`

Defined in: src/app/core/metadata/metadata-manager.ts:121

hasMetadataKey

#### Parameters

##### metadataId

`string`

metadata id

#### Returns

`boolean`

***

### init()

> **init**(): `Promise`\<`void`\>

Defined in: src/app/core/metadata/metadata-manager.ts:35

In charge to load data source

#### Returns

`Promise`\<`void`\>

***

### loadDataSourceForPlugin()

> **loadDataSourceForPlugin**(`plugin`): `Promise`\<`any`\>

Defined in: src/app/core/metadata/metadata-manager.ts:75

Cette fonction charge les métadonnées pour un plugin en particulier.</br>
Elle est utilisée quand le mode loadMetadataOnDemand est activé cad lors du chargement des métadonnées à la demande.

#### Parameters

##### plugin

`string`

ce paramètre correspond au nom du plugin

#### Returns

`Promise`\<`any`\>

***

### refreshDataSourceHeaders()

> **refreshDataSourceHeaders**(`token`): `void`

Defined in: src/app/core/metadata/metadata-manager.ts:56

Pour les plugins qui ont besoin de recharger (re-fetcher) leurs métadonnées,
il est nécessaire de renouveller le token d'authorization.

#### Parameters

##### token

`any`

Authorization Bearer

#### Returns

`void`

***

### removeMetadata()

> **removeMetadata**(`metadata`): `void`

Defined in: src/app/core/metadata/metadata-manager.ts:152

Remove Metadata block by metadata id

#### Parameters

##### metadata

`Metadata`

metadata

#### Returns

`void`

#### Throws

AmaliaException
