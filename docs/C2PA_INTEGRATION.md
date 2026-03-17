# C2PA Integration in Amalia

This document describes the **C2PA (Coalition for Content Provenance and Authenticity)** integration in the Amalia player, which enables content authenticity verification for HLS media streams.

## Overview

C2PA is an open technical standard that provides a way to certify the source and history of media content. Amalia integrates C2PA validation for HLS streams through two main components:

- **`HLSMediaSourceExtension`** - The HLS player extension that exposes C2PA functionality
- **`C2paHlsBridge`** - The bridge that connects HLS.js fragment loading with C2PA validation

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    HLSMediaSourceExtension                       │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                     C2paHlsBridge                        │    │
│  │  ┌─────────────┐    ┌──────────────┐   ┌─────────────┐  │    │
│  │  │   HLS.js    │───▶│  Fragment    │──▶│   C2PA SDK  │  │    │
│  │  │  Instance   │    │  Interceptor │   │  Validator  │  │    │
│  │  └─────────────┘    └──────────────┘   └─────────────┘  │    │
│  │                            │                  │          │    │
│  │                            ▼                  ▼          │    │
│  │                    ┌──────────────────────────────┐     │    │
│  │                    │   IntervalTree (TimeCode →   │     │    │
│  │                    │   C2paManifestHelper)        │     │    │
│  │                    └──────────────────────────────┘     │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

## Components

### HLSMediaSourceExtension

Located in `src/app/core/mse/hls/hls-media-source-extension.ts`

The `HLSMediaSourceExtension` class implements the `MediaSourceExtension` interface and provides HLS playback capabilities. It exposes the following C2PA-related methods:

#### Methods

| Method | Description |
|--------|-------------|
| `enableC2PA(config?: C2PAConfig)` | Enables C2PA validation for the HLS stream |
| `disableC2PA()` | Disables C2PA validation and cleans up resources |
| `isC2PAEnabled()` | Returns `true` if C2PA validation is enabled |
| `isC2PAReady()` | Returns `true` if the C2PA runtime is initialized |
| `getC2PAMetaByTimeCode(timeCode: number)` | Gets C2PA metadata for a specific timecode |
| `getC2PABridge()` | Returns the underlying `C2paHlsBridge` instance |

#### Usage Example

```typescript
import { HLSMediaSourceExtension } from '@ina/amalia';

// Create HLS player instance
const hlsExtension = new HLSMediaSourceExtension(
    videoElement,
    eventEmitter,
    playerConfig,
    logger
);

// Set media source
hlsExtension.setSrc(config);

// Enable C2PA validation
hlsExtension.enableC2PA({
    enableTrustListVerification: false,
    wasmSrc: 'https://cdn.jsdelivr.net/npm/@contentauth/c2pa-web@0.4.1/dist/resources/c2pa_bg.wasm'
});

// Check if C2PA is ready (async initialization)
if (hlsExtension.isC2PAReady()) {
    // Get metadata for current timecode
    const metadata = hlsExtension.getC2PAMetaByTimeCode(videoElement.currentTime);
    
    if (metadata) {
        console.log('Signature valid:', metadata.isValid());
        console.log('Issuer:', metadata.getItem('ISSUER'));
        console.log('Date:', metadata.getItem('DATE'));
        console.log('Contains AI:', metadata.containsAIGeneratedContent());
    }
}

// Disable C2PA when done
hlsExtension.disableC2PA();
```

### C2paHlsBridge

Located in `src/app/core/utils/hls-c2pa-bridge.ts`

The `C2paHlsBridge` class is the core component that intercepts HLS fragment loading and performs C2PA validation on each segment.

#### How It Works

1. **Fragment Interception**: The bridge registers an event listener on `Hls.Events.FRAG_LOADING` to intercept fragment loading
2. **Init Segment Capture**: When an init segment is received, it's stored for later use in fragment validation
3. **Fragment Queuing**: Media fragments are queued for validation as they arrive
4. **Async Validation**: Fragments are validated asynchronously using the C2PA SDK
5. **TimeCode Mapping**: Validated manifests are stored in an `IntervalTree` indexed by timecode range

#### Configuration

```typescript
interface C2PAConfig {
    enableTrustListVerification: boolean;  // Enable trust list verification
    wasmSrc?: string;                       // Custom WASM binary URL
}
```

#### Default WASM Source

If no `wasmSrc` is provided, the bridge uses:
```
https://cdn.jsdelivr.net/npm/@contentauth/c2pa-web@0.4.1/dist/resources/c2pa_bg.wasm
```

### C2paManifestHelper

A wrapper class that provides convenient access to C2PA manifest data.

#### Methods

| Method | Return Type | Description |
|--------|-------------|-------------|
| `containsSignature()` | `boolean` | Returns `true` if the manifest contains a signature |
| `isValid()` | `boolean` | Returns `true` if the signature is valid and there are no validation errors |
| `getValidationErrors()` | `any[]` | Returns validation errors, or `[{code: 'not-found'}]` if no signature |
| `getManifestMap()` | `Record<string, Manifest>` | Returns all manifests in the store |
| `getActiveManifest()` | `Manifest \| null` | Returns the active manifest |
| `containsAIGeneratedContent()` | `boolean` | Returns `true` if AI-generated content markers are detected |
| `getItem(item)` | `string` | Gets specific items: `'ISSUER'`, `'DATE'`, `'VALIDATION_STATUS'` |
| `toString()` | `string` | Returns JSON representation of the manifest store |

#### AI Content Detection

The helper detects AI-generated content by checking for:

- Legacy assertion: `com.adobe.generative-ai`
- C2PA Actions v1/v2 with `digitalSourceType` matching:
  - `trainedAlgorithmicMedia`
  - `compositeWithTrainedAlgorithmicMedia`

## Integration with Player Expert

### Enabling C2PA in Player Expert

```typescript
// Get the HLS extension from MediaPlayerElement
const mediaElement = mediaPlayerService.getMediaPlayerElement(playerId);
const hlsExtension = mediaElement.getMediaSourceExtension() as HLSMediaSourceExtension;

// Enable C2PA
hlsExtension.enableC2PA();

// Listen for time updates to display C2PA info
videoElement.addEventListener('timeupdate', () => {
    const c2paMeta = hlsExtension.getC2PAMetaByTimeCode(videoElement.currentTime);
    if (c2paMeta) {
        updateC2PADisplay(c2paMeta);
    }
});
```

### Displaying C2PA Status

```typescript
function updateC2PADisplay(meta: C2paManifestHelper) {
    const status = {
        hasSignature: meta.containsSignature(),
        isValid: meta.isValid(),
        issuer: meta.getItem('ISSUER'),
        date: meta.getItem('DATE'),
        validationStatus: meta.getItem('VALIDATION_STATUS'),
        isAIGenerated: meta.containsAIGeneratedContent()
    };
    
    // Update UI based on status
    if (!status.hasSignature) {
        showWarning('No C2PA signature found');
    } else if (!status.isValid) {
        showError('C2PA validation failed', meta.getValidationErrors());
    } else {
        showSuccess(`Verified by ${status.issuer} on ${status.date}`);
    }
    
    if (status.isAIGenerated) {
        showAIBadge();
    }
}
```

### Detecting Tampered Segments

```typescript
// Get intervals where content failed validation
const tamperedIntervals = hlsExtension.getC2PABridge()?.getTamperedWithIntervals() ?? [];

tamperedIntervals.forEach(interval => {
    console.warn(`Tampered content detected: ${interval.low}s - ${interval.high}s`);
    // Highlight tampered regions in timeline
    timeline.markTamperedRegion(interval.low, interval.high);
});
```

## Dependencies

The C2PA integration requires the following packages:

```json
{
    "@contentauth/c2pa-web": "^0.4.1",
    "@flatten-js/interval-tree": "^1.1.3",
    "hls.js": "^1.6.13"
}
```

## Performance Considerations

- **Async Initialization**: The C2PA WASM runtime is loaded asynchronously. Use `isC2PAReady()` to check readiness.
- **Fragment Queue**: Fragments are validated sequentially to avoid overwhelming the C2PA runtime.
- **Memory Management**: Fragment data is cleared after validation to minimize memory usage.
- **IntervalTree**: Efficient O(log n) lookup for timecode-to-manifest mapping.

## Cleanup

Always call `disableC2PA()` or `destroy()` on the `HLSMediaSourceExtension` when the player is no longer needed to properly dispose of C2PA resources:

```typescript
// Option 1: Disable C2PA only
hlsExtension.disableC2PA();

// Option 2: Destroy the entire extension (also cleans up C2PA)
hlsExtension.destroy();
```

## Exported Types

The following types are exported from `@ina/amalia` for TypeScript consumers:

```typescript
import { 
    HLSMediaSourceExtension,
    C2paHlsBridge,
    C2paManifestHelper,
    C2PAConfig 
} from '@ina/amalia';
```

## See Also

- [C2PA Specification](https://c2pa.org/specifications/specifications/1.0/specs/C2PA_Specification.html)
- [@contentauth/c2pa-web](https://github.com/contentauth/c2pa-js)
- [HLS.js Documentation](https://github.com/video-dev/hls.js)
