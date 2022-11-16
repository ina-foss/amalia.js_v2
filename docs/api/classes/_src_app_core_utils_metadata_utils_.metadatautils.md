[Amalia](../README.md) › [Globals](../globals.md) › ["src/app/core/utils/metadata-utils"](../modules/_src_app_core_utils_metadata_utils_.md) › [MetadataUtils](_src_app_core_utils_metadata_utils_.metadatautils.md)

# Class: MetadataUtils

## Hierarchy

* **MetadataUtils**

## Index

### Methods

* [getHistograms](_src_app_core_utils_metadata_utils_.metadatautils.md#static-gethistograms)
* [getTimelineLocalisations](_src_app_core_utils_metadata_utils_.metadatautils.md#static-gettimelinelocalisations)
* [getTranscriptionLocalisations](_src_app_core_utils_metadata_utils_.metadatautils.md#static-gettranscriptionlocalisations)
* [parseTimelineLocalisation](_src_app_core_utils_metadata_utils_.metadatautils.md#static-private-parsetimelinelocalisation)
* [parseTranscriptionLocalisations](_src_app_core_utils_metadata_utils_.metadatautils.md#static-parsetranscriptionlocalisations)
* [pushTimelineLocalisation](_src_app_core_utils_metadata_utils_.metadatautils.md#static-private-pushtimelinelocalisation)
* [pushTranscriptionLocalisations](_src_app_core_utils_metadata_utils_.metadatautils.md#static-private-pushtranscriptionlocalisations)

## Methods

### `Static` getHistograms

▸ **getHistograms**(`metadata`: Metadata): *Array‹[Histogram](../interfaces/_src_app_core_metadata_model_histogram_.histogram.md)›*

Defined in src/app/core/utils/metadata-utils.ts:67

Return list of histogram

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`metadata` | Metadata | metadata  |

**Returns:** *Array‹[Histogram](../interfaces/_src_app_core_metadata_model_histogram_.histogram.md)›*

___

### `Static` getTimelineLocalisations

▸ **getTimelineLocalisations**(`metadata`: Metadata): *Array‹[TimelineLocalisation](../interfaces/_src_app_core_metadata_model_timeline_localisation_.timelinelocalisation.md)›*

Defined in src/app/core/utils/metadata-utils.ts:86

Parse timeline localisation

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`metadata` | Metadata | amalia model  |

**Returns:** *Array‹[TimelineLocalisation](../interfaces/_src_app_core_metadata_model_timeline_localisation_.timelinelocalisation.md)›*

___

### `Static` getTranscriptionLocalisations

▸ **getTranscriptionLocalisations**(`metadata`: Metadata, `parseLevel`: number, `withSubLocalisations`: boolean): *Array‹[TranscriptionLocalisation](../interfaces/_src_app_core_metadata_model_transcription_localisation_.transcriptionlocalisation.md)›*

Defined in src/app/core/utils/metadata-utils.ts:18

Return list of transcription

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`metadata` | Metadata | - | localisation |
`parseLevel` | number | 1 | parse level |
`withSubLocalisations` | boolean | false | true for parse sub localisation  |

**Returns:** *Array‹[TranscriptionLocalisation](../interfaces/_src_app_core_metadata_model_transcription_localisation_.transcriptionlocalisation.md)›*

___

### `Static` `Private` parseTimelineLocalisation

▸ **parseTimelineLocalisation**(`localisation`: any, `timelineLocalisations`: Array‹[TimelineLocalisation](../interfaces/_src_app_core_metadata_model_timeline_localisation_.timelinelocalisation.md)›): *void*

Defined in src/app/core/utils/metadata-utils.ts:99

Convert metadata localisation to timeline localisation

**Parameters:**

Name | Type |
------ | ------ |
`localisation` | any |
`timelineLocalisations` | Array‹[TimelineLocalisation](../interfaces/_src_app_core_metadata_model_timeline_localisation_.timelinelocalisation.md)› |

**Returns:** *void*

___

### `Static` parseTranscriptionLocalisations

▸ **parseTranscriptionLocalisations**(`l`: any, `localisations`: Array‹[TranscriptionLocalisation](../interfaces/_src_app_core_metadata_model_transcription_localisation_.transcriptionlocalisation.md)›, `parseLevel`: number, `withSubLocalisations`: boolean): *void*

Defined in src/app/core/utils/metadata-utils.ts:35

In charge to parse transcription

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`l` | any | localisation |
`localisations` | Array‹[TranscriptionLocalisation](../interfaces/_src_app_core_metadata_model_transcription_localisation_.transcriptionlocalisation.md)› | transcription |
`parseLevel` | number | parse level |
`withSubLocalisations` | boolean | true for parse sub localisation  |

**Returns:** *void*

___

### `Static` `Private` pushTimelineLocalisation

▸ **pushTimelineLocalisation**(`localisation`: any, `timelineLocalisations`: any): *void*

Defined in src/app/core/utils/metadata-utils.ts:113

**Parameters:**

Name | Type |
------ | ------ |
`localisation` | any |
`timelineLocalisations` | any |

**Returns:** *void*

___

### `Static` `Private` pushTranscriptionLocalisations

▸ **pushTranscriptionLocalisations**(`l`: any, `localisations`: any, `subLocalisations`: any): *void*

Defined in src/app/core/utils/metadata-utils.ts:52

**Parameters:**

Name | Type |
------ | ------ |
`l` | any |
`localisations` | any |
`subLocalisations` | any |

**Returns:** *void*
