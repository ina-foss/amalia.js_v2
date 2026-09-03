[Amalia](../README.md) › [Globals](../globals.md) › ["src/app/core/metadata/metadata-manager"](../modules/_src_app_core_metadata_metadata_manager_.md) › [MetadataManager](_src_app_core_metadata_metadata_manager_.metadatamanager.md)

# Class: MetadataManager

In charge to handle metadata

## Hierarchy

* **MetadataManager**

## Index

### Constructors

* [constructor](_src_app_core_metadata_metadata_manager_.metadatamanager.md#constructor)

### Properties

* [configurationManager](_src_app_core_metadata_metadata_manager_.metadatamanager.md#private-configurationmanager)
* [defaultLoader](_src_app_core_metadata_metadata_manager_.metadatamanager.md#private-defaultloader)
* [listOfMetadata](_src_app_core_metadata_metadata_manager_.metadatamanager.md#private-listofmetadata)
* [logger](_src_app_core_metadata_metadata_manager_.metadatamanager.md#private-logger)
* [toLoadData](_src_app_core_metadata_metadata_manager_.metadatamanager.md#private-toloaddata)

### Methods

* [addMetadata](_src_app_core_metadata_metadata_manager_.metadatamanager.md#addmetadata)
* [errorToLoadMetadata](_src_app_core_metadata_metadata_manager_.metadatamanager.md#private-errortoloadmetadata)
* [getHistograms](_src_app_core_metadata_metadata_manager_.metadatamanager.md#gethistograms)
* [getMetadata](_src_app_core_metadata_metadata_manager_.metadatamanager.md#getmetadata)
* [getTimelineLocalisations](_src_app_core_metadata_metadata_manager_.metadatamanager.md#gettimelinelocalisations)
* [getTranscriptionLocalisations](_src_app_core_metadata_metadata_manager_.metadatamanager.md#gettranscriptionlocalisations)
* [init](_src_app_core_metadata_metadata_manager_.metadatamanager.md#init)
* [loadDataSource](_src_app_core_metadata_metadata_manager_.metadatamanager.md#private-loaddatasource)
* [onMetadataLoaded](_src_app_core_metadata_metadata_manager_.metadatamanager.md#private-onmetadataloaded)
* [removeMetadata](_src_app_core_metadata_metadata_manager_.metadatamanager.md#removemetadata)

## Constructors

###  constructor

\+ **new MetadataManager**(`configurationManager`: [ConfigurationManager](_src_app_core_config_configuration_manager_.configurationmanager.md), `defaultLoader`: [Loader](../interfaces/_src_app_core_loader_loader_.loader.md)‹Array‹Metadata››, `logger`: [LoggerInterface](../interfaces/_src_app_core_logger_logger_interface_.loggerinterface.md)): *[MetadataManager](_src_app_core_metadata_metadata_manager_.metadatamanager.md)*

Defined in src/app/core/metadata/metadata-manager.ts:21

**Parameters:**

Name | Type |
------ | ------ |
`configurationManager` | [ConfigurationManager](_src_app_core_config_configuration_manager_.configurationmanager.md) |
`defaultLoader` | [Loader](../interfaces/_src_app_core_loader_loader_.loader.md)‹Array‹Metadata›› |
`logger` | [LoggerInterface](../interfaces/_src_app_core_logger_logger_interface_.loggerinterface.md) |

**Returns:** *[MetadataManager](_src_app_core_metadata_metadata_manager_.metadatamanager.md)*

## Properties

### `Private` configurationManager

• **configurationManager**: *[ConfigurationManager](_src_app_core_config_configuration_manager_.configurationmanager.md)*

Defined in src/app/core/metadata/metadata-manager.ts:18

___

### `Private` defaultLoader

• **defaultLoader**: *[Loader](../interfaces/_src_app_core_loader_loader_.loader.md)‹Array‹Metadata››*

Defined in src/app/core/metadata/metadata-manager.ts:21

___

### `Private` listOfMetadata

• **listOfMetadata**: *Map‹string, Metadata›* = new Map<string, Metadata>()

Defined in src/app/core/metadata/metadata-manager.ts:19

___

### `Private` logger

• **logger**: *[LoggerInterface](../interfaces/_src_app_core_logger_logger_interface_.loggerinterface.md)*

Defined in src/app/core/metadata/metadata-manager.ts:17

___

### `Private` toLoadData

• **toLoadData**: *number* = 0

Defined in src/app/core/metadata/metadata-manager.ts:20

## Methods

###  addMetadata

▸ **addMetadata**(`metadata`: Metadata): *void*

Defined in src/app/core/metadata/metadata-manager.ts:66

Add Metadata block

**`throws`** AmaliaException

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`metadata` | Metadata | metadata |

**Returns:** *void*

___

### `Private` errorToLoadMetadata

▸ **errorToLoadMetadata**(`url`: any, `completed`: any): *void*

Defined in src/app/core/metadata/metadata-manager.ts:180

Error to load data

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`url` | any | error to local url |
`completed` | any | promise resolve function  |

**Returns:** *void*

___

###  getHistograms

▸ **getHistograms**(`metadataIds`: Array‹string›): *[Histogram](../interfaces/_src_app_core_metadata_model_histogram_.histogram.md)[]*

Defined in src/app/core/metadata/metadata-manager.ts:119

Return all parsed histogram

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`metadataIds` | Array‹string› | ids  |

**Returns:** *[Histogram](../interfaces/_src_app_core_metadata_model_histogram_.histogram.md)[]*

___

###  getMetadata

▸ **getMetadata**(`metadataId`: string): *Metadata*

Defined in src/app/core/metadata/metadata-manager.ts:53

Get Metadata block

**`throws`** AmaliaException

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`metadataId` | string | metadata id |

**Returns:** *Metadata*

___

###  getTimelineLocalisations

▸ **getTimelineLocalisations**(`metadata`: Metadata): *Array‹[TimelineLocalisation](../interfaces/_src_app_core_metadata_model_timeline_localisation_.timelinelocalisation.md)›*

Defined in src/app/core/metadata/metadata-manager.ts:111

Get timeline metadata block

**`throws`** AmaliaException

**Parameters:**

Name | Type |
------ | ------ |
`metadata` | Metadata |

**Returns:** *Array‹[TimelineLocalisation](../interfaces/_src_app_core_metadata_model_timeline_localisation_.timelinelocalisation.md)›*

___

###  getTranscriptionLocalisations

▸ **getTranscriptionLocalisations**(`metadataId`: string, `parseLevel`: number, `withSubLocalisations`: boolean): *Array‹[TranscriptionLocalisation](../interfaces/_src_app_core_metadata_model_transcription_localisation_.transcriptionlocalisation.md)› | null*

Defined in src/app/core/metadata/metadata-manager.ts:94

Return transcription metadata

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`metadataId` | string | - | metadata |
`parseLevel` | number | 1 | parse level default 1 |
`withSubLocalisations` | boolean | false | sub localisation default false  |

**Returns:** *Array‹[TranscriptionLocalisation](../interfaces/_src_app_core_metadata_model_transcription_localisation_.transcriptionlocalisation.md)› | null*

___

###  init

▸ **init**(): *Promise‹void›*

Defined in src/app/core/metadata/metadata-manager.ts:32

In charge to load data source

**Returns:** *Promise‹void›*

___

### `Private` loadDataSource

▸ **loadDataSource**(`loadData`: [ConfigDataSource](../interfaces/_src_app_core_config_model_config_data_source_.configdatasource.md), `completed`: any): *Promise‹void›*

Defined in src/app/core/metadata/metadata-manager.ts:141

In charge to load data

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`loadData` | [ConfigDataSource](../interfaces/_src_app_core_config_model_config_data_source_.configdatasource.md) | ConfigDataSource  |
`completed` | any | - |

**Returns:** *Promise‹void›*

___

### `Private` onMetadataLoaded

▸ **onMetadataLoaded**(`listOfMetadata`: Array‹Metadata›, `completed`: any): *void*

Defined in src/app/core/metadata/metadata-manager.ts:157

Called on metadata loaded

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`listOfMetadata` | Array‹Metadata› | list of metadata  |
`completed` | any | - |

**Returns:** *void*

___

###  removeMetadata

▸ **removeMetadata**(`metadata`: Metadata): *void*

Defined in src/app/core/metadata/metadata-manager.ts:79

Remove Metadata block by metadata id

**`throws`** AmaliaException

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`metadata` | Metadata | metadata |

**Returns:** *void*
