/**
 * Public API Surface of @ina/amalia
 * This file exports all public types that can be imported by consuming projects
 */

// Core
export { MediaPlayerElement } from './app/core/media-player-element';
export { MediaElement } from './app/core/media/media-element';

// Media Source Extensions
export { HLSMediaSourceExtension } from './app/core/mse/hls/hls-media-source-extension';
export type { MediaSourceExtension } from './app/core/mse/media-source-extension';

// C2PA
export { C2paHlsBridge, C2paManifestHelper } from './app/core/utils/hls-c2pa-bridge';
export type { C2PAConfig } from './app/core/utils/hls-c2pa-bridge';

// Configuration
export type { ConfigData } from './app/core/config/model/config-data';
export type { PlayerConfigData } from './app/core/config/model/player-config-data';
export type { PluginConfigData } from './app/core/config/model/plugin-config-data';

// Constants
export { PlayerState } from './app/core/constant/player-state';
export { PlayerEventType } from './app/core/constant/event-type';

// Logger
export type { LoggerInterface } from './app/core/logger/logger-interface';
export { LoggerLevel } from './app/core/logger/logger-level';

// Metadata
export { MetadataManager } from './app/core/metadata/metadata-manager';

// Photo Player
export { default as AmaliaPhotoPlayer } from './app/player/photo/components/AmaliaPlayer';
export { default as AnnotationCanvas } from './app/player/photo/business/AnnotationCanvas';
export type { AnnotationSettings, TextAnnotation } from './app/player/photo/business/AnnotationCanvas';
