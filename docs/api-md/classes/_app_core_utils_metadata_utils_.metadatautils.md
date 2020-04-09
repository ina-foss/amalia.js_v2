[Amalia](../README.md) › [Globals](../globals.md) › ["app/core/utils/metadata-utils"](../modules/_app_core_utils_metadata_utils_.md) › [MetadataUtils](_app_core_utils_metadata_utils_.metadatautils.md)

# Class: MetadataUtils

## Hierarchy

* **MetadataUtils**

## Index

### Methods

* [getHistograms](_app_core_utils_metadata_utils_.metadatautils.md#static-gethistograms)
* [getTranscriptionLocalisations](_app_core_utils_metadata_utils_.metadatautils.md#static-gettranscriptionlocalisations)
* [parseTranscriptionLocalisations](_app_core_utils_metadata_utils_.metadatautils.md#static-parsetranscriptionlocalisations)

## Methods

### `Static` getHistograms

▸ **getHistograms**(`metadata`: Metadata): *Array‹[Histogram](../interfaces/_app_core_metadata_model_histogram_.histogram.md)›*

Defined in src/app/core/utils/metadata-utils.ts:62

Return list of histogram

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`metadata` | Metadata | metadata  |

**Returns:** *Array‹[Histogram](../interfaces/_app_core_metadata_model_histogram_.histogram.md)›*

___

### `Static` getTranscriptionLocalisations

▸ **getTranscriptionLocalisations**(`metadata`: Metadata, `parseLevel`: number, `withSubLocalisations`: boolean): *Array‹[TranscriptionLocalisation](../interfaces/_app_core_metadata_model_transcription_localisation_.transcriptionlocalisation.md)›*

Defined in src/app/core/utils/metadata-utils.ts:17

Return list of transcription

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`metadata` | Metadata | - | localisation |
`parseLevel` | number | 1 | parse level |
`withSubLocalisations` | boolean | false | true for parse sub localisation  |

**Returns:** *Array‹[TranscriptionLocalisation](../interfaces/_app_core_metadata_model_transcription_localisation_.transcriptionlocalisation.md)›*

___

### `Static` parseTranscriptionLocalisations

▸ **parseTranscriptionLocalisations**(`l`: any, `localisations`: Array‹[TranscriptionLocalisation](../interfaces/_app_core_metadata_model_transcription_localisation_.transcriptionlocalisation.md)›, `parseLevel`: number, `withSubLocalisations`: boolean): *void*

Defined in src/app/core/utils/metadata-utils.ts:34

In charge to parse transcription

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`l` | any | localisation |
`localisations` | Array‹[TranscriptionLocalisation](../interfaces/_app_core_metadata_model_transcription_localisation_.transcriptionlocalisation.md)› | transcription |
`parseLevel` | number | parse level |
`withSubLocalisations` | boolean | true for parse sub localisation  |

**Returns:** *void*
