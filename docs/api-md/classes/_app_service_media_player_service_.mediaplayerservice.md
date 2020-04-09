[Amalia](../README.md) › [Globals](../globals.md) › ["app/service/media-player-service"](../modules/_app_service_media_player_service_.md) › [MediaPlayerService](_app_service_media_player_service_.mediaplayerservice.md)

# Class: MediaPlayerService

Service contain all instance of players

## Hierarchy

* **MediaPlayerService**

## Index

### Properties

* [players](_app_service_media_player_service_.mediaplayerservice.md#private-players)

### Methods

* [get](_app_service_media_player_service_.mediaplayerservice.md#get)

## Properties

### `Private` players

• **players**: *Map‹string, [MediaPlayerElement](_app_core_media_player_element_.mediaplayerelement.md)‹››* = new Map<string, MediaPlayerElement>()

Defined in src/app/service/media-player-service.ts:9

## Methods

###  get

▸ **get**(`key`: string): *[MediaPlayerElement](_app_core_media_player_element_.mediaplayerelement.md)*

Defined in src/app/service/media-player-service.ts:15

In charge to crate instance or return existing instance

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | string | instance id, this this case id is player id  |

**Returns:** *[MediaPlayerElement](_app_core_media_player_element_.mediaplayerelement.md)*
