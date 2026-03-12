/**
 * Public API Surface of @ina/amalia
 * This file exports all public types that can be imported by consuming projects
 */

// Core
export { MediaPlayerElement } from './app/core/media-player-element';
export { MediaElement } from './app/core/media/media-element';

// Media Source Extensions
export { HLSMediaSourceExtension } from './app/core/mse/hls/hls-media-source-extension';
export { MediaSourceExtension } from './app/core/mse/media-source-extension';

// C2PA
export { C2paHlsBridge, C2paManifestHelper, C2PAConfig } from './app/core/utils/hls-c2pa-bridge';

// Configuration
export { ConfigData } from './app/core/config/model/config-data';
export { PlayerConfigData } from './app/core/config/model/player-config-data';
export { PluginConfigData } from './app/core/config/model/plugin-config-data';

// Constants
export { PlayerState } from './app/core/constant/player-state';
export { PlayerEventType } from './app/core/constant/event-type';

// Logger
export { LoggerInterface } from './app/core/logger/logger-interface';
export { LoggerLevel } from './app/core/logger/logger-level';

// Metadata
export { MetadataManager } from './app/core/metadata/metadata-manager';
