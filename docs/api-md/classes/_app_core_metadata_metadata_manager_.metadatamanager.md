[Amalia](../README.md) › [Globals](../globals.md) › ["app/core/metadata/metadata-manager"](../modules/_app_core_metadata_metadata_manager_.md) › [MetadataManager](_app_core_metadata_metadata_manager_.metadatamanager.md)

# Class: MetadataManager

In charge to handle metadata

## Hierarchy

* **MetadataManager**

## Index

### Constructors

* [constructor](_app_core_metadata_metadata_manager_.metadatamanager.md#constructor)

### Properties

* [configurationManager](_app_core_metadata_metadata_manager_.metadatamanager.md#private-configurationmanager)
* [defaultLoader](_app_core_metadata_metadata_manager_.metadatamanager.md#private-defaultloader)
* [listOfMetadata](_app_core_metadata_metadata_manager_.metadatamanager.md#private-listofmetadata)
* [logger](_app_core_metadata_metadata_manager_.metadatamanager.md#private-logger)
* [toLoadData](_app_core_metadata_metadata_manager_.metadatamanager.md#private-toloaddata)

### Methods

* [addMetadata](_app_core_metadata_metadata_manager_.metadatamanager.md#addmetadata)
* [errorToLoadMetadata](_app_core_metadata_metadata_manager_.metadatamanager.md#private-errortoloadmetadata)
* [getHistograms](_app_core_metadata_metadata_manager_.metadatamanager.md#gethistograms)
* [getMetadata](_app_core_metadata_metadata_manager_.metadatamanager.md#getmetadata)
* [getTranscriptionLocalisations](_app_core_metadata_metadata_manager_.metadatamanager.md#gettranscriptionlocalisations)
* [init](_app_core_metadata_metadata_manager_.metadatamanager.md#init)
* [loadDataSource](_app_core_metadata_metadata_manager_.metadatamanager.md#private-loaddatasource)
* [onMetadataLoaded](_app_core_metadata_metadata_manager_.metadatamanager.md#private-onmetadataloaded)
* [removeMetadata](_app_core_metadata_metadata_manager_.metadatamanager.md#removemetadata)

## Constructors

###  constructor

\+ **new MetadataManager**(`configurationManager`: [ConfigurationManager](_app_core_config_configuration_manager_.configurationmanager.md), `defaultLoader`: [Loader](../interfaces/_app_core_loader_loader_.loader.md)‹Array‹Metadata››, `logger`: [LoggerInterface](../interfaces/_app_core_logger_logger_interface_.loggerinterface.md)): *[MetadataManager](_app_core_metadata_metadata_manager_.metadatamanager.md)*

Defined in src/app/core/metadata/metadata-manager.ts:20

**Parameters:**

Name | Type |
------ | ------ |
`configurationManager` | [ConfigurationManager](_app_core_config_configuration_manager_.configurationmanager.md) |
`defaultLoader` | [Loader](../interfaces/_app_core_loader_loader_.loader.md)‹Array‹Metadata›› |
`logger` | [LoggerInterface](../interfaces/_app_core_logger_logger_interface_.loggerinterface.md) |

**Returns:** *[MetadataManager](_app_core_metadata_metadata_manager_.metadatamanager.md)*

## Properties

### `Private` configurationManager

• **configurationManager**: *[ConfigurationManager](_app_core_config_configuration_manager_.configurationmanager.md)*

Defined in src/app/core/metadata/metadata-manager.ts:17

___

### `Private` defaultLoader

• **defaultLoader**: *[Loader](../interfaces/_app_core_loader_loader_.loader.md)‹Array‹Metadata››*

Defined in src/app/core/metadata/metadata-manager.ts:20

___

### `Private` listOfMetadata

• **listOfMetadata**: *Map‹string, Metadata›* = new Map<string, Metadata>()

Defined in src/app/core/metadata/metadata-manager.ts:18

___

### `Private` logger

• **logger**: *[LoggerInterface](../interfaces/_app_core_logger_logger_interface_.loggerinterface.md)*

Defined in src/app/core/metadata/metadata-manager.ts:16

___

### `Private` toLoadData

• **toLoadData**: *number* = 0

Defined in src/app/core/metadata/metadata-manager.ts:19

## Methods

###  addMetadata

▸ **addMetadata**(`metadata`: Metadata): *void*

Defined in src/app/core/metadata/metadata-manager.ts:65

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

Defined in src/app/core/metadata/metadata-manager.ts:170

Error to load data

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`url` | any | error to local url |
`completed` | any | promise resolve function  |

**Returns:** *void*

___

###  getHistograms

▸ **getHistograms**(`metadataIds`: Array‹string›): *[Histogram](../interfaces/_app_core_metadata_model_histogram_.histogram.md)[]*

Defined in src/app/core/metadata/metadata-manager.ts:109

Return all parsed histogram

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`metadataIds` | Array‹string› | ids  |

**Returns:** *[Histogram](../interfaces/_app_core_metadata_model_histogram_.histogram.md)[]*

___

###  getMetadata

▸ **getMetadata**(`metadataId`: string): *Metadata*

Defined in src/app/core/metadata/metadata-manager.ts:52

Get Metadata block

**`throws`** AmaliaException

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`metadataId` | string | metadata id |

**Returns:** *Metadata*

___

###  getTranscriptionLocalisations

▸ **getTranscriptionLocalisations**(`metadataId`: string, `parseLevel`: number, `withSubLocalisations`: boolean): *Array‹[TranscriptionLocalisation](../interfaces/_app_core_metadata_model_transcription_localisation_.transcriptionlocalisation.md)› | null*

Defined in src/app/core/metadata/metadata-manager.ts:93

Return transcription metadata

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`metadataId` | string | - | metadata |
`parseLevel` | number | 1 | parse level default 1 |
`withSubLocalisations` | boolean | false | sub localisation default false  |

**Returns:** *Array‹[TranscriptionLocalisation](../interfaces/_app_core_metadata_model_transcription_localisation_.transcriptionlocalisation.md)› | null*

___

###  init

▸ **init**(): *Promise‹void›*

Defined in src/app/core/metadata/metadata-manager.ts:31

In charge to load data source

**Returns:** *Promise‹void›*

___

### `Private` loadDataSource

▸ **loadDataSource**(`loadData`: [ConfigDataSource](../interfaces/_app_core_config_model_config_data_source_.configdatasource.md), `completed`: any): *Promise‹void›*

Defined in src/app/core/metadata/metadata-manager.ts:131

In charge to load data

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`loadData` | [ConfigDataSource](../interfaces/_app_core_config_model_config_data_source_.configdatasource.md) | ConfigDataSource  |
`completed` | any | - |

**Returns:** *Promise‹void›*

___

### `Private` onMetadataLoaded

▸ **onMetadataLoaded**(`listOfMetadata`: Array‹Metadata›, `completed`: any): *void*

Defined in src/app/core/metadata/metadata-manager.ts:147

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

Defined in src/app/core/metadata/metadata-manager.ts:78

Remove Metadata block by metadata id

**`throws`** AmaliaException

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`metadata` | Metadata | metadata |

**Returns:** *void*
