import Hls from 'hls.js';
import type { LoaderCallbacks, FragLoadingData } from 'hls.js';
import IntervalTree, { Interval } from '@flatten-js/interval-tree';
import { createC2pa, type C2paSdk, type Manifest, type ManifestStore } from '@contentauth/c2pa-web';

// ============================================================================
// Interfaces
// ============================================================================

interface LocalFragment {
  sn: number;
  start: number;
  end: number;
  segmentValid: boolean;
  data: ArrayBuffer;
}

interface FragValidationType {
  initSegmentData: Blob;
  queuedForCheckFragments: LocalFragment[];
  timeCodeMappingTree: IntervalTree;
  validatorQueueRunning: boolean;
}

export interface C2PAConfig {
  enableTrustListVerification: boolean;
  wasmSrc?: string;
}

// ============================================================================
// C2paManifestHelper - Wrapper for C2PA manifest data
// ============================================================================

const GEN_AI_DST = new Set<string>([
  'http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia',
  'https://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia',
  'http://cv.iptc.org/newscodes/digitalsourcetype/compositeWithTrainedAlgorithmicMedia',
  'https://cv.iptc.org/newscodes/digitalsourcetype/compositeWithTrainedAlgorithmicMedia'
]);

function isRecord(x: unknown): x is Record<string, unknown> {
  return !!x && typeof x === 'object';
}

function containsGenerativeContent(manifest: Manifest): boolean {
  const assertions = manifest.assertions ?? [];
  for (const a of assertions) {
    // Legacy assertion
    if (a.label === 'com.adobe.generative-ai' && isRecord(a.data)) {
      return true;
    }

    // Actions v1 & v2
    if ((a.label === 'c2pa.actions' || a.label === 'c2pa.actions.v2') && isRecord(a.data)) {
      const actions = (a.data as any).actions;
      if (Array.isArray(actions)) {
        for (const act of actions) {
          const dst = typeof act.digitalSourceType === 'string' ? act.digitalSourceType : undefined;
          if (dst && GEN_AI_DST.has(dst)) return true;
        }
      }
    }
  }
  return false;
}

export class C2paManifestHelper {
  constructor(private readonly store: ManifestStore) {}

  containsSignature(): boolean {
    return (this.store?.active_manifest ?? null) != null;
  }

  isValid(): boolean {
    return this.containsSignature() && (this.store?.validation_status?.length ?? 0) === 0;
  }

  getValidationErrors(): any[] {
    if (!this.containsSignature()) {
      return [{ code: 'not-found', url: '', explanation: 'Missing signature' }];
    }
    return this.store?.validation_status ?? [];
  }

  getManifestMap(): Record<string, Manifest> {
    return this.store?.manifests ?? {};
  }

  getActiveManifest(): Manifest | null {
    const activeManifestId = this.store?.active_manifest ?? null;
    if (!activeManifestId) return null;
    return this.store?.manifests[activeManifestId] ?? null;
  }

  containsAIGeneratedContent(): boolean {
    const activeManifestId = this.store?.active_manifest ?? null;
    if (!activeManifestId) return false;

    for (const manifest of Object.values(this.store?.manifests ?? {})) {
      if (containsGenerativeContent(manifest)) return true;
    }
    return false;
  }

  getItem(item: 'ISSUER' | 'DATE' | 'VALIDATION_STATUS'): string {
    const activeManifest = this.getActiveManifest();
    if (!activeManifest) return 'unknown';

    switch (item) {
      case 'ISSUER':
        return activeManifest.signature_info?.issuer ?? 'unknown';
      case 'DATE': {
        const timeValue = activeManifest.signature_info?.time ?? null;
        const date = timeValue ? new Date(timeValue) : null;
        return date
          ? new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).format(date)
          : 'unknown';
      }
      case 'VALIDATION_STATUS':
        return this.containsSignature() ? (this.isValid() ? 'Passed' : 'Failed') : 'Unknown';
      default:
        return 'unknown';
    }
  }

  toString(): string {
    const cache = new Set();
    return JSON.stringify(
      this.store,
      (key, value) => {
        if (typeof value === 'object' && value !== null) {
          if (cache.has(value)) return;
          cache.add(value);
        }
        return value;
      },
      4
    );
  }
}

// ============================================================================
// C2paHlsBridge - Main bridge connecting HLS.js with C2PA validation
// ============================================================================

export class C2paHlsBridge {
  private readonly config: C2PAConfig;
  private c2pa: C2paSdk | null = null;
  private readonly hlsInstance: Hls;
  private fragValidationMap: Record<string, FragValidationType> = {};

  constructor(config: C2PAConfig, hls: Hls) {
    this.config = config;
    this.hlsInstance = hls;
    this.registerHLSEvents();
    this.initC2PA();
  }

  // -------------------------------------------------------------------------
  // Public API
  // -------------------------------------------------------------------------

  getC2PAMetaByTimeCode(timeCode: number): C2paManifestHelper | null {
    const key = this.getCurrentLevelKey();
    const entry = this.fragValidationMap[key];
    if (!entry) return null;

    const result = entry.timeCodeMappingTree.search(new Interval(timeCode, timeCode));
    this.log(`[${key}] Searching for timecode ${timeCode}:`, result?.length ?? 0, 'matches');
    return result?.[0]?.manifestReader ?? null;
  }

  getTamperedWithIntervals(): Interval[] {
    const key = this.getCurrentLevelKey();
    const entry = this.fragValidationMap[key];
    if (!entry) return [];

    return entry.timeCodeMappingTree.items
      .filter((item: any) => !item.value.manifestReader.isValid())
      .map((item: any) => item.value.interval);
  }

  libReady(): boolean {
    return this.c2pa !== null;
  }

  dispose(): void {
    this.hlsInstance.off(Hls.Events.FRAG_LOADING, this.onFragLoading);
    this.c2pa?.dispose?.();
  }

  // -------------------------------------------------------------------------
  // C2PA Initialization
  // -------------------------------------------------------------------------

  private initC2PA(): void {
    setTimeout(async () => {
      try {
        const wasmUrl =
          this.config.wasmSrc ||
          'https://cdn.jsdelivr.net/npm/@contentauth/c2pa-web@0.4.1/dist/resources/c2pa_bg.wasm';

        this.c2pa = await createC2pa({ wasmSrc: wasmUrl });
        this.log('C2PA runtime initialized');
      } catch (err) {
        this.error('Failed to initialize c2pa:', err);
        this.dispose();
      }
    }, 1);
  }

  // -------------------------------------------------------------------------
  // HLS.js Event Handling
  // -------------------------------------------------------------------------

  private registerHLSEvents(): void {
    this.hlsInstance.on(Hls.Events.FRAG_LOADING, this.onFragLoading.bind(this));
  }

  private onFragLoading = (_eventName: any, fragment: FragLoadingData): void => {
    const loader = fragment.frag.loader;
    if (!loader) return;

    // @ts-expect-error: Callbacks may not be typed
    const callbacks: LoaderCallbacks<any> = loader.callbacks;
    if (!callbacks) return;

    const originalOnSuccess = callbacks.onSuccess;

    callbacks.onSuccess = (response: any, stats: any, context: any, networkDetails: any) => {
      this.handleFragmentSuccess(fragment, response);
      originalOnSuccess(response, stats, context, networkDetails);

      const fragIndexKey = `${fragment.frag.type}-${fragment.frag.level}`;
      const entry = this.fragValidationMap[fragIndexKey];

      if (entry && !entry.validatorQueueRunning) {
        void this.runValidationQueue(fragIndexKey);
      }
    };
  };

  private handleFragmentSuccess(fragment: FragLoadingData, response: any): void {
    const responseData = response.data as ArrayBuffer;
    const fragIndexKey = `${fragment.frag.type}-${fragment.frag.level}`;

    const data = new ArrayBuffer(responseData.byteLength);
    new Uint8Array(data).set(new Uint8Array(responseData));

    if (fragment.frag.sn === 'initSegment') {
      if (!this.fragValidationMap[fragIndexKey]) {
        this.fragValidationMap[fragIndexKey] = {
          initSegmentData: new Blob([data], { type: 'video/mp4' }),
          timeCodeMappingTree: new IntervalTree(),
          queuedForCheckFragments: [],
          validatorQueueRunning: false
        };
      }
    } else {
      const entry = this.fragValidationMap[fragIndexKey];
      if (!entry) {
        this.error(`[${fragIndexKey}] Critical: Missing initSegment for fragment.`);
        return;
      }

      this.log(
        `[${fragIndexKey}] Fragment ${fragment.frag.sn} received. Start: ${fragment.frag.start}, End: ${fragment.frag.start + fragment.frag.duration}`
      );
      entry.queuedForCheckFragments.push({
        sn: fragment.frag.sn as number,
        start: fragment.frag.start,
        end: fragment.frag.start + fragment.frag.duration,
        segmentValid: false,
        data
      });
    }
  }

  // -------------------------------------------------------------------------
  // Validation Queue
  // -------------------------------------------------------------------------

  async runValidationQueue(levelKey: string): Promise<void> {
    const entry = this.fragValidationMap[levelKey];
    if (!entry || entry.validatorQueueRunning || !this.c2pa) {
      this.warn(`[${levelKey}] C2PA not ready or queue already running.`);
      return;
    }

    if (entry.initSegmentData.size === 0) {
      this.warn(`[${levelKey}] Missing init segment data.`);
      return;
    }

    if (entry.queuedForCheckFragments.length === 0) {
      return;
    }

    entry.validatorQueueRunning = true;
    const fragment = entry.queuedForCheckFragments.shift();
    if (!fragment) {
      entry.validatorQueueRunning = false;
      return;
    }

    this.log(`[${levelKey}] Validating segment ${fragment.sn}`);

    try {
      const fragmentBlob = new Blob([fragment.data], { type: 'video/mp4' });
      const manifestInfo = await this.c2pa.reader.fromBlobFragment(
        entry.initSegmentData.type,
        entry.initSegmentData,
        fragmentBlob
      );

      if (!manifestInfo) {
        this.warn(`[${levelKey}] No manifest data found for segment ${fragment.sn}.`);
        entry.validatorQueueRunning = false;
        if (entry.queuedForCheckFragments.length > 0) {
          await this.runValidationQueue(levelKey);
        }
        return;
      }

      const store = await manifestInfo.manifestStore();
      const manifestReader = new C2paManifestHelper(store);

      const interval = new Interval(fragment.start, fragment.end);

      // Prevent duplicates
      entry.timeCodeMappingTree.search(interval).forEach((seg: any) => {
        if (seg.interval.low === interval.low && seg.interval.high === interval.high) {
          this.warn(`[${levelKey}] Duplicate interval found – replacing`);
          entry.timeCodeMappingTree.remove(interval, seg);
        }
      });

      this.log(`[${levelKey}] Mapping interval ${interval.low}-${interval.high}`);
      entry.timeCodeMappingTree.insert(interval, { manifestReader, interval });

      if (!manifestReader.containsSignature()) {
        this.warn(`Segment ${levelKey}.${fragment.sn} has no signature.`);
      } else if (!manifestReader.isValid()) {
        this.warn(`Segment ${levelKey}.${fragment.sn} failed validation.`, manifestReader.getValidationErrors());
      }

      this.log(`[${levelKey}] Validation complete for segment ${fragment.sn}`);
    } catch (err) {
      this.error(`[${levelKey}] Validation error for segment ${fragment.sn}:`, err);
    }

    // Clear data reference
    delete fragment.data;

    entry.validatorQueueRunning = false;

    if (entry.queuedForCheckFragments.length > 0) {
      await this.runValidationQueue(levelKey);
    }
  }

  // -------------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------------

  private getCurrentLevelKey(): string {
    return 'main-' + this.hlsInstance.currentLevel;
  }

  private log(...args: any[]): void {
    console.log('[C2paHlsBridge]', ...args);
  }

  private warn(...args: any[]): void {
    console.warn('[C2paHlsBridge]', ...args);
  }

  private error(...args: any[]): void {
    console.error('[C2paHlsBridge]', ...args);
  }
}
