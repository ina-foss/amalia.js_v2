import { C2paManifestHelper, C2paHlsBridge, C2PAConfig } from './hls-c2pa-bridge';
import Hls from 'hls.js';
import type { ManifestStore, Manifest } from '@contentauth/c2pa-web';

describe('hls-c2pa-bridge', () => {

    // =========================================================================
    // C2paManifestHelper Tests
    // =========================================================================

    describe('C2paManifestHelper', () => {
        const createMockManifestStore = (overrides: Partial<ManifestStore> = {}): ManifestStore => ({
            active_manifest: 'manifest-1',
            manifests: {
                'manifest-1': {
                    claim_generator: 'test-generator',
                    title: 'Test Manifest',
                    format: 'video/mp4',
                    instance_id: 'instance-1',
                    signature_info: {
                        issuer: 'Test Issuer',
                        time: '2024-01-15T10:30:00Z'
                    },
                    assertions: []
                } as unknown as Manifest
            },
            validation_status: [],
            ...overrides
        } as ManifestStore);

        describe('containsSignature', () => {
            it('should return true when active_manifest exists', () => {
                const store = createMockManifestStore();
                const helper = new C2paManifestHelper(store);

                expect(helper.containsSignature()).toBeTrue();
            });

            it('should return false when active_manifest is null', () => {
                const store = createMockManifestStore({ active_manifest: null as any });
                const helper = new C2paManifestHelper(store);

                expect(helper.containsSignature()).toBeFalse();
            });

            it('should return false when active_manifest is undefined', () => {
                const store = createMockManifestStore({ active_manifest: undefined as any });
                const helper = new C2paManifestHelper(store);

                expect(helper.containsSignature()).toBeFalse();
            });

            it('should return false when store is null', () => {
                const helper = new C2paManifestHelper(null as any);

                expect(helper.containsSignature()).toBeFalse();
            });
        });

        describe('isValid', () => {
            it('should return true when signature exists and no validation errors', () => {
                const store = createMockManifestStore({
                    validation_status: []
                });
                const helper = new C2paManifestHelper(store);

                expect(helper.isValid()).toBeTrue();
            });

            it('should return false when signature exists but has validation errors', () => {
                const store = createMockManifestStore({
                    validation_status: [{ code: 'error-1', url: '', explanation: 'Some error' }]
                });
                const helper = new C2paManifestHelper(store);

                expect(helper.isValid()).toBeFalse();
            });

            it('should return false when no signature exists', () => {
                const store = createMockManifestStore({ active_manifest: null as any });
                const helper = new C2paManifestHelper(store);

                expect(helper.isValid()).toBeFalse();
            });
        });

        describe('getValidationErrors', () => {
            it('should return validation errors from store', () => {
                const errors = [{ code: 'error-1', url: 'http://test', explanation: 'Test error' }];
                const store = createMockManifestStore({
                    validation_status: errors
                });
                const helper = new C2paManifestHelper(store);

                expect(helper.getValidationErrors()).toEqual(errors);
            });

            it('should return not-found error when no signature exists', () => {
                const store = createMockManifestStore({ active_manifest: null as any });
                const helper = new C2paManifestHelper(store);

                const errors = helper.getValidationErrors();
                expect(errors.length).toBe(1);
                expect(errors[0].code).toBe('not-found');
                expect(errors[0].explanation).toBe('Missing signature');
            });

            it('should return empty array when store validation_status is undefined', () => {
                const store = createMockManifestStore({
                    validation_status: undefined as any
                });
                const helper = new C2paManifestHelper(store);

                expect(helper.getValidationErrors()).toEqual([]);
            });
        });

        describe('getManifestMap', () => {
            it('should return manifests from store', () => {
                const store = createMockManifestStore();
                const helper = new C2paManifestHelper(store);

                const map = helper.getManifestMap();
                expect(map['manifest-1']).toBeDefined();
            });

            it('should return empty object when manifests is undefined', () => {
                const store = createMockManifestStore({ manifests: undefined as any });
                const helper = new C2paManifestHelper(store);

                expect(helper.getManifestMap()).toEqual({});
            });
        });

        describe('getActiveManifest', () => {
            it('should return the active manifest', () => {
                const store = createMockManifestStore();
                const helper = new C2paManifestHelper(store);

                const manifest = helper.getActiveManifest();
                expect(manifest).toBeDefined();
                expect(manifest?.title).toBe('Test Manifest');
            });

            it('should return null when no active_manifest', () => {
                const store = createMockManifestStore({ active_manifest: null as any });
                const helper = new C2paManifestHelper(store);

                expect(helper.getActiveManifest()).toBeNull();
            });

            it('should return null when active_manifest id not found in manifests', () => {
                const store = createMockManifestStore({
                    active_manifest: 'non-existent-id'
                });
                const helper = new C2paManifestHelper(store);

                expect(helper.getActiveManifest()).toBeNull();
            });
        });

        describe('containsAIGeneratedContent', () => {
            it('should return false when no active manifest', () => {
                const store = createMockManifestStore({ active_manifest: null as any });
                const helper = new C2paManifestHelper(store);

                expect(helper.containsAIGeneratedContent()).toBeFalse();
            });

            it('should return false when no AI assertions', () => {
                const store = createMockManifestStore();
                const helper = new C2paManifestHelper(store);

                expect(helper.containsAIGeneratedContent()).toBeFalse();
            });

            it('should return false when assertions is undefined', () => {
                const store = createMockManifestStore({
                    manifests: {
                        'manifest-1': {
                            claim_generator: 'test',
                            title: 'Test',
                            format: 'video/mp4',
                            instance_id: 'id-1',
                            assertions: undefined
                        } as unknown as Manifest
                    }
                });
                const helper = new C2paManifestHelper(store);

                expect(helper.containsAIGeneratedContent()).toBeFalse();
            });

            it('should return false when com.adobe.generative-ai has non-object data', () => {
                const store = createMockManifestStore({
                    manifests: {
                        'manifest-1': {
                            claim_generator: 'test',
                            title: 'Test',
                            format: 'video/mp4',
                            instance_id: 'id-1',
                            assertions: [
                                { label: 'com.adobe.generative-ai', data: null }
                            ]
                        } as unknown as Manifest
                    }
                });
                const helper = new C2paManifestHelper(store);

                expect(helper.containsAIGeneratedContent()).toBeFalse();
            });

            it('should return false when c2pa.actions has non-object data', () => {
                const store = createMockManifestStore({
                    manifests: {
                        'manifest-1': {
                            claim_generator: 'test',
                            title: 'Test',
                            format: 'video/mp4',
                            instance_id: 'id-1',
                            assertions: [
                                { label: 'c2pa.actions', data: 'string-data' }
                            ]
                        } as unknown as Manifest
                    }
                });
                const helper = new C2paManifestHelper(store);

                expect(helper.containsAIGeneratedContent()).toBeFalse();
            });

            it('should return false when c2pa.actions has non-array actions', () => {
                const store = createMockManifestStore({
                    manifests: {
                        'manifest-1': {
                            claim_generator: 'test',
                            title: 'Test',
                            format: 'video/mp4',
                            instance_id: 'id-1',
                            assertions: [
                                { label: 'c2pa.actions', data: { actions: 'not-an-array' } }
                            ]
                        } as unknown as Manifest
                    }
                });
                const helper = new C2paManifestHelper(store);

                expect(helper.containsAIGeneratedContent()).toBeFalse();
            });

            it('should return false when digitalSourceType is not a string', () => {
                const store = createMockManifestStore({
                    manifests: {
                        'manifest-1': {
                            claim_generator: 'test',
                            title: 'Test',
                            format: 'video/mp4',
                            instance_id: 'id-1',
                            assertions: [
                                {
                                    label: 'c2pa.actions',
                                    data: {
                                        actions: [
                                            { digitalSourceType: 12345 }
                                        ]
                                    }
                                }
                            ]
                        } as unknown as Manifest
                    }
                });
                const helper = new C2paManifestHelper(store);

                expect(helper.containsAIGeneratedContent()).toBeFalse();
            });

            it('should return false when digitalSourceType is undefined', () => {
                const store = createMockManifestStore({
                    manifests: {
                        'manifest-1': {
                            claim_generator: 'test',
                            title: 'Test',
                            format: 'video/mp4',
                            instance_id: 'id-1',
                            assertions: [
                                {
                                    label: 'c2pa.actions',
                                    data: {
                                        actions: [
                                            { someOtherProperty: 'value' }
                                        ]
                                    }
                                }
                            ]
                        } as unknown as Manifest
                    }
                });
                const helper = new C2paManifestHelper(store);

                expect(helper.containsAIGeneratedContent()).toBeFalse();
            });

            it('should check all manifests not just active one', () => {
                const store = createMockManifestStore({
                    manifests: {
                        'manifest-1': {
                            claim_generator: 'test',
                            title: 'Test',
                            format: 'video/mp4',
                            instance_id: 'id-1',
                            assertions: []
                        } as unknown as Manifest,
                        'manifest-2': {
                            claim_generator: 'test2',
                            title: 'Test2',
                            format: 'video/mp4',
                            instance_id: 'id-2',
                            assertions: [
                                { label: 'com.adobe.generative-ai', data: { type: 'generated' } }
                            ]
                        } as unknown as Manifest
                    }
                });
                const helper = new C2paManifestHelper(store);

                expect(helper.containsAIGeneratedContent()).toBeTrue();
            });

            it('should return true when com.adobe.generative-ai assertion exists', () => {
                const store = createMockManifestStore({
                    manifests: {
                        'manifest-1': {
                            claim_generator: 'test',
                            title: 'Test',
                            format: 'video/mp4',
                            instance_id: 'id-1',
                            assertions: [
                                { label: 'com.adobe.generative-ai', data: { type: 'generated' } }
                            ]
                        } as unknown as Manifest
                    }
                });
                const helper = new C2paManifestHelper(store);

                expect(helper.containsAIGeneratedContent()).toBeTrue();
            });

            it('should return true when c2pa.actions.v2 has compositeWithTrainedAlgorithmicMedia', () => {
                const store = createMockManifestStore({
                    manifests: {
                        'manifest-1': {
                            claim_generator: 'test',
                            title: 'Test',
                            format: 'video/mp4',
                            instance_id: 'id-1',
                            assertions: [
                                {
                                    label: 'c2pa.actions.v2',
                                    data: {
                                        actions: [
                                            { digitalSourceType: 'https://cv.iptc.org/newscodes/digitalsourcetype/compositeWithTrainedAlgorithmicMedia' }
                                        ]
                                    }
                                }
                            ]
                        } as unknown as Manifest
                    }
                });
                const helper = new C2paManifestHelper(store);

                expect(helper.containsAIGeneratedContent()).toBeTrue();
            });

            it('should return false when actions array is empty', () => {
                const store = createMockManifestStore({
                    manifests: {
                        'manifest-1': {
                            claim_generator: 'test',
                            title: 'Test',
                            format: 'video/mp4',
                            instance_id: 'id-1',
                            assertions: [
                                { label: 'c2pa.actions', data: { actions: [] } }
                            ]
                        } as unknown as Manifest
                    }
                });
                const helper = new C2paManifestHelper(store);

                expect(helper.containsAIGeneratedContent()).toBeFalse();
            });

            it('should return false when digitalSourceType is not AI-related', () => {
                const store = createMockManifestStore({
                    manifests: {
                        'manifest-1': {
                            claim_generator: 'test',
                            title: 'Test',
                            format: 'video/mp4',
                            instance_id: 'id-1',
                            assertions: [
                                {
                                    label: 'c2pa.actions',
                                    data: {
                                        actions: [
                                            { digitalSourceType: 'http://cv.iptc.org/newscodes/digitalsourcetype/digitalCapture' }
                                        ]
                                    }
                                }
                            ]
                        } as unknown as Manifest
                    }
                });
                const helper = new C2paManifestHelper(store);

                expect(helper.containsAIGeneratedContent()).toBeFalse();
            });
        });

        describe('getItem', () => {
            it('should return issuer when item is ISSUER', () => {
                const store = createMockManifestStore();
                const helper = new C2paManifestHelper(store);

                expect(helper.getItem('ISSUER')).toBe('Test Issuer');
            });

            it('should return unknown when no active manifest for ISSUER', () => {
                const store = createMockManifestStore({ active_manifest: null as any });
                const helper = new C2paManifestHelper(store);

                expect(helper.getItem('ISSUER')).toBe('unknown');
            });

            it('should return formatted date when item is DATE', () => {
                const store = createMockManifestStore();
                const helper = new C2paManifestHelper(store);

                const date = helper.getItem('DATE');
                expect(date).toContain('Jan');
                expect(date).toContain('15');
                expect(date).toContain('2024');
            });

            it('should return unknown when no date in signature_info', () => {
                const store = createMockManifestStore({
                    manifests: {
                        'manifest-1': {
                            claim_generator: 'test',
                            title: 'Test',
                            format: 'video/mp4',
                            instance_id: 'id-1',
                            signature_info: { issuer: 'Test' }
                        } as unknown as Manifest
                    }
                });
                const helper = new C2paManifestHelper(store);

                expect(helper.getItem('DATE')).toBe('unknown');
            });

            it('should return Passed when item is VALIDATION_STATUS and valid', () => {
                const store = createMockManifestStore({ validation_status: [] });
                const helper = new C2paManifestHelper(store);

                expect(helper.getItem('VALIDATION_STATUS')).toBe('Passed');
            });

            it('should return Failed when item is VALIDATION_STATUS and has errors', () => {
                const store = createMockManifestStore({
                    validation_status: [{ code: 'error', url: '', explanation: 'Error' }]
                });
                const helper = new C2paManifestHelper(store);

                expect(helper.getItem('VALIDATION_STATUS')).toBe('Failed');
            });

            it('should return Unknown when item is VALIDATION_STATUS and no signature', () => {
                const store = createMockManifestStore({ active_manifest: null as any });
                const helper = new C2paManifestHelper(store);

                expect(helper.getItem('VALIDATION_STATUS')).toBe('unknown');
            });

            it('should return unknown for unrecognized item', () => {
                const store = createMockManifestStore();
                const helper = new C2paManifestHelper(store);

                expect(helper.getItem('UNKNOWN' as any)).toBe('unknown');
            });
        });

        describe('toString', () => {
            it('should return JSON string representation of store', () => {
                const store = createMockManifestStore();
                const helper = new C2paManifestHelper(store);

                const result = helper.toString();
                expect(result).toContain('manifest-1');
                expect(result).toContain('Test Manifest');
            });

            it('should handle circular references', () => {
                const store = createMockManifestStore();
                // Create circular reference
                (store as any).circular = store;
                const helper = new C2paManifestHelper(store);

                // Should not throw
                expect(() => helper.toString()).not.toThrow();
            });
        });
    });

    // =========================================================================
    // C2paHlsBridge Tests
    // =========================================================================

    describe('C2paHlsBridge', () => {
        let mockHls: jasmine.SpyObj<Hls>;
        let config: C2PAConfig;

        beforeEach(() => {
            mockHls = jasmine.createSpyObj('Hls', ['on', 'off'], {
                currentLevel: 0
            });
            config = {
                enableTrustListVerification: false,
                wasmSrc: 'https://test.wasm'
            };
        });

        describe('constructor', () => {
            it('should register HLS events on construction', () => {
                const bridge = new C2paHlsBridge(config, mockHls);

                expect(mockHls.on).toHaveBeenCalledWith(Hls.Events.FRAG_LOADING, jasmine.any(Function));
                bridge.dispose();
            });

            it('should use default wasmSrc when not provided', () => {
                const configWithoutWasm: C2PAConfig = {
                    enableTrustListVerification: false
                };
                const bridge = new C2paHlsBridge(configWithoutWasm, mockHls);

                expect(bridge.libReady()).toBeFalse();
                bridge.dispose();
            });
        });

        describe('libReady', () => {
            it('should return false initially before C2PA is initialized', () => {
                const bridge = new C2paHlsBridge(config, mockHls);

                // Initially false because async init hasn't completed
                expect(bridge.libReady()).toBeFalse();
                bridge.dispose();
            });
        });

        describe('dispose', () => {
            it('should unregister HLS events on dispose', () => {
                const bridge = new C2paHlsBridge(config, mockHls);
                bridge.dispose();

                expect(mockHls.off).toHaveBeenCalledWith(Hls.Events.FRAG_LOADING, jasmine.any(Function));
            });

            it('should handle multiple dispose calls gracefully', () => {
                const bridge = new C2paHlsBridge(config, mockHls);
                bridge.dispose();
                expect(() => bridge.dispose()).not.toThrow();
            });
        });

        describe('getC2PAMetaByTimeCode', () => {
            it('should return null when no entry exists for current level', () => {
                const bridge = new C2paHlsBridge(config, mockHls);

                const result = bridge.getC2PAMetaByTimeCode(10);
                expect(result).toBeNull();
                bridge.dispose();
            });

            it('should search timeCodeMappingTree when entry exists', () => {
                const bridge = new C2paHlsBridge(config, mockHls);
                const searchSpy = jasmine.createSpy('search').and.returnValue([]);

                // Set up mock entry with timeCodeMappingTree
                (bridge as any).fragValidationMap['main-0'] = {
                    timeCodeMappingTree: {
                        search: searchSpy
                    }
                };

                bridge.getC2PAMetaByTimeCode(10);

                expect(searchSpy).toHaveBeenCalled();
                bridge.dispose();
            });

            it('should return manifestReader when match found', () => {
                const bridge = new C2paHlsBridge(config, mockHls);
                const mockManifestReader = { isValid: () => true } as any;

                (bridge as any).fragValidationMap['main-0'] = {
                    timeCodeMappingTree: {
                        search: () => [{ manifestReader: mockManifestReader }]
                    }
                };

                const result = bridge.getC2PAMetaByTimeCode(10);

                expect(result).toBe(mockManifestReader);
                bridge.dispose();
            });
        });

        describe('getTamperedWithIntervals', () => {
            it('should return empty array when no entry exists for current level', () => {
                const bridge = new C2paHlsBridge(config, mockHls);

                const result = bridge.getTamperedWithIntervals();
                expect(result).toEqual([]);
                bridge.dispose();
            });

            it('should return intervals where manifest is invalid', () => {
                const bridge = new C2paHlsBridge(config, mockHls);

                const invalidInterval = { low: 0, high: 10 };
                const validInterval = { low: 10, high: 20 };

                (bridge as any).fragValidationMap['main-0'] = {
                    timeCodeMappingTree: {
                        items: [
                            {
                                value: {
                                    manifestReader: { isValid: () => false },
                                    interval: invalidInterval
                                }
                            },
                            {
                                value: {
                                    manifestReader: { isValid: () => true },
                                    interval: validInterval
                                }
                            }
                        ]
                    }
                };

                const result = bridge.getTamperedWithIntervals();

                expect(result.length).toBe(1);
                expect(result[0]).toEqual(jasmine.objectContaining({ low: 0, high: 10 }));
                bridge.dispose();
            });

            it('should return empty array when all manifests are valid', () => {
                const bridge = new C2paHlsBridge(config, mockHls);

                (bridge as any).fragValidationMap['main-0'] = {
                    timeCodeMappingTree: {
                        items: [
                            {
                                value: {
                                    manifestReader: { isValid: () => true },
                                    interval: { low: 0, high: 10 }
                                }
                            }
                        ]
                    }
                };

                const result = bridge.getTamperedWithIntervals();

                expect(result).toEqual([]);
                bridge.dispose();
            });
        });

        describe('onFragLoading callback', () => {
            it('should handle fragment without loader', () => {
                const bridge = new C2paHlsBridge(config, mockHls);

                // Get the registered callback
                const onCall = mockHls.on.calls.first();
                const callback = onCall.args[1] as any;

                // Create fragment data without loader
                const fragmentData = {
                    frag: {
                        loader: null,
                        type: 'main',
                        level: 0,
                        sn: 1,
                        start: 0,
                        duration: 10
                    }
                };

                // Should not throw when loader is null
                expect(() => callback(Hls.Events.FRAG_LOADING, fragmentData)).not.toThrow();
                bridge.dispose();
            });

            it('should handle fragment with loader but no callbacks', () => {
                const bridge = new C2paHlsBridge(config, mockHls);

                const onCall = mockHls.on.calls.first();
                const callback = onCall.args[1] as any;

                const fragmentData = {
                    frag: {
                        loader: { callbacks: null },
                        type: 'main',
                        level: 0,
                        sn: 1,
                        start: 0,
                        duration: 10
                    }
                };

                expect(() => callback(Hls.Events.FRAG_LOADING, fragmentData)).not.toThrow();
                bridge.dispose();
            });

            it('should intercept fragment success callback', () => {
                const bridge = new C2paHlsBridge(config, mockHls);

                const onCall = mockHls.on.calls.first();
                const callback = onCall.args[1] as any;

                const originalOnSuccess = jasmine.createSpy('originalOnSuccess');
                const fragmentData = {
                    frag: {
                        loader: {
                            callbacks: {
                                onSuccess: originalOnSuccess
                            }
                        },
                        type: 'main',
                        level: 0,
                        sn: 'initSegment',
                        start: 0,
                        duration: 10
                    }
                };

                // Register the callback
                callback(Hls.Events.FRAG_LOADING, fragmentData);

                // The onSuccess should have been replaced
                expect(fragmentData.frag.loader.callbacks.onSuccess).not.toBe(originalOnSuccess);
                bridge.dispose();
            });

            it('should handle init segment', () => {
                const bridge = new C2paHlsBridge(config, mockHls);

                const onCall = mockHls.on.calls.first();
                const callback = onCall.args[1] as any;

                const originalOnSuccess = jasmine.createSpy('originalOnSuccess');
                const fragmentData = {
                    frag: {
                        loader: {
                            callbacks: {
                                onSuccess: originalOnSuccess
                            }
                        },
                        type: 'main',
                        level: 0,
                        sn: 'initSegment',
                        start: 0,
                        duration: 10
                    }
                };

                callback(Hls.Events.FRAG_LOADING, fragmentData);

                // Call the replaced onSuccess with mock response
                const mockResponse = { data: new ArrayBuffer(100) };
                fragmentData.frag.loader.callbacks.onSuccess(mockResponse, {}, {}, {});

                // Original should have been called
                expect(originalOnSuccess).toHaveBeenCalledWith(mockResponse, {}, {}, {});
                bridge.dispose();
            });

            it('should handle media fragment after init segment', () => {
                const bridge = new C2paHlsBridge(config, mockHls);

                const onCall = mockHls.on.calls.first();
                const callback = onCall.args[1] as any;

                // First, send init segment
                const initOriginalOnSuccess = jasmine.createSpy('initOriginalOnSuccess');
                const initFragmentData = {
                    frag: {
                        loader: {
                            callbacks: {
                                onSuccess: initOriginalOnSuccess
                            }
                        },
                        type: 'main',
                        level: 0,
                        sn: 'initSegment',
                        start: 0,
                        duration: 0
                    }
                };

                callback(Hls.Events.FRAG_LOADING, initFragmentData);
                initFragmentData.frag.loader.callbacks.onSuccess({ data: new ArrayBuffer(100) }, {}, {}, {});

                // Now send a media fragment
                const mediaOriginalOnSuccess = jasmine.createSpy('mediaOriginalOnSuccess');
                const mediaFragmentData = {
                    frag: {
                        loader: {
                            callbacks: {
                                onSuccess: mediaOriginalOnSuccess
                            }
                        },
                        type: 'main',
                        level: 0,
                        sn: 1,
                        start: 0,
                        duration: 10
                    }
                };

                callback(Hls.Events.FRAG_LOADING, mediaFragmentData);
                mediaFragmentData.frag.loader.callbacks.onSuccess({ data: new ArrayBuffer(200) }, {}, {}, {});

                expect(mediaOriginalOnSuccess).toHaveBeenCalled();
                bridge.dispose();
            });

            it('should handle media fragment received without init segment', () => {
                const bridge = new C2paHlsBridge(config, mockHls);

                const onCall = mockHls.on.calls.first();
                const callback = onCall.args[1] as any;

                // Send media fragment without init segment first
                const mediaOriginalOnSuccess = jasmine.createSpy('mediaOriginalOnSuccess');
                const mediaFragmentData = {
                    frag: {
                        loader: {
                            callbacks: {
                                onSuccess: mediaOriginalOnSuccess
                            }
                        },
                        type: 'main',
                        level: 0,
                        sn: 1,
                        start: 0,
                        duration: 10
                    }
                };

                callback(Hls.Events.FRAG_LOADING, mediaFragmentData);
                // Should not throw even without init segment
                expect(() => mediaFragmentData.frag.loader.callbacks.onSuccess({ data: new ArrayBuffer(200) }, {}, {}, {})).not.toThrow();
                bridge.dispose();
            });
        });

        describe('logging methods', () => {
            it('should have log method defined', () => {
                const bridge = new C2paHlsBridge(config, mockHls);

                expect((bridge as any).log).toBeDefined();
                expect(typeof (bridge as any).log).toBe('function');
                bridge.dispose();
            });

            it('should have warn method defined', () => {
                const bridge = new C2paHlsBridge(config, mockHls);

                expect((bridge as any).warn).toBeDefined();
                expect(typeof (bridge as any).warn).toBe('function');
                bridge.dispose();
            });

            it('should have error method defined', () => {
                const bridge = new C2paHlsBridge(config, mockHls);

                expect((bridge as any).error).toBeDefined();
                expect(typeof (bridge as any).error).toBe('function');
                bridge.dispose();
            });
        });

        describe('getCurrentLevelKey', () => {
            it('should return key based on current HLS level', () => {
                const bridge = new C2paHlsBridge(config, mockHls);

                const key = (bridge as any).getCurrentLevelKey();

                expect(key).toBe('main-0');
                bridge.dispose();
            });

            it('should reflect different HLS levels', () => {
                const mockHls2 = jasmine.createSpyObj('Hls', ['on', 'off'], {
                    currentLevel: 2
                });
                const bridge = new C2paHlsBridge(config, mockHls2);

                const key = (bridge as any).getCurrentLevelKey();

                expect(key).toBe('main-2');
                bridge.dispose();
            });
        });

        describe('getItem edge cases', () => {
            it('should return unknown when issuer is not in signature_info', () => {
                const store: ManifestStore = {
                    active_manifest: 'manifest-1',
                    manifests: {
                        'manifest-1': {
                            claim_generator: 'test',
                            title: 'Test',
                            format: 'video/mp4',
                            instance_id: 'id-1',
                            signature_info: {}
                        } as unknown as Manifest
                    },
                    validation_status: []
                } as ManifestStore;
                const helper = new C2paManifestHelper(store);

                expect(helper.getItem('ISSUER')).toBe('unknown');
            });
        });

        describe('runValidationQueue', () => {
            it('should return early when entry does not exist', async () => {
                const bridge = new C2paHlsBridge(config, mockHls);

                await expectAsync(bridge.runValidationQueue('nonexistent-key')).toBeResolved();
                bridge.dispose();
            });

            it('should return early when c2pa is not initialized', async () => {
                const bridge = new C2paHlsBridge(config, mockHls);

                // Set up entry but c2pa is not ready
                (bridge as any).fragValidationMap['main-0'] = {
                    validatorQueueRunning: false,
                    queuedForCheckFragments: [{ sn: 1, data: new ArrayBuffer(100), start: 0, end: 10 }],
                    initSegmentData: { size: 100, type: 'video/mp4' }
                };
                (bridge as any).c2pa = null;

                await expectAsync(bridge.runValidationQueue('main-0')).toBeResolved();
                bridge.dispose();
            });

            it('should return early when queue is already running', async () => {
                const bridge = new C2paHlsBridge(config, mockHls);

                (bridge as any).fragValidationMap['main-0'] = {
                    validatorQueueRunning: true,
                    queuedForCheckFragments: [{ sn: 1, data: new ArrayBuffer(100), start: 0, end: 10 }],
                    initSegmentData: { size: 100, type: 'video/mp4' }
                };
                (bridge as any).c2pa = {};

                await expectAsync(bridge.runValidationQueue('main-0')).toBeResolved();
                bridge.dispose();
            });

            it('should return early when init segment data is missing', async () => {
                const bridge = new C2paHlsBridge(config, mockHls);

                (bridge as any).fragValidationMap['main-0'] = {
                    validatorQueueRunning: false,
                    queuedForCheckFragments: [{ sn: 1, data: new ArrayBuffer(100), start: 0, end: 10 }],
                    initSegmentData: { size: 0, type: 'video/mp4' }
                };
                (bridge as any).c2pa = {};

                await expectAsync(bridge.runValidationQueue('main-0')).toBeResolved();
                bridge.dispose();
            });

            it('should return early when queue is empty', async () => {
                const bridge = new C2paHlsBridge(config, mockHls);

                (bridge as any).fragValidationMap['main-0'] = {
                    validatorQueueRunning: false,
                    queuedForCheckFragments: [],
                    initSegmentData: { size: 100, type: 'video/mp4' }
                };
                (bridge as any).c2pa = {};

                await expectAsync(bridge.runValidationQueue('main-0')).toBeResolved();
                bridge.dispose();
            });

            it('should handle case when fragment is undefined after shift', async () => {
                const bridge = new C2paHlsBridge(config, mockHls);

                // Create a custom queue object that returns undefined on shift
                const mockQueue = {
                    length: 1,
                    shift: () => undefined
                };
                (bridge as any).fragValidationMap['main-0'] = {
                    validatorQueueRunning: false,
                    queuedForCheckFragments: mockQueue,
                    initSegmentData: { size: 100, type: 'video/mp4' }
                };
                (bridge as any).c2pa = {};

                await expectAsync(bridge.runValidationQueue('main-0')).toBeResolved();
                expect((bridge as any).fragValidationMap['main-0'].validatorQueueRunning).toBe(false);
                bridge.dispose();
            });

            it('should process fragment and handle null manifestInfo', async () => {
                const bridge = new C2paHlsBridge(config, mockHls);

                const mockFromBlobFragment = jasmine.createSpy('fromBlobFragment').and.returnValue(Promise.resolve(null));
                (bridge as any).c2pa = {
                    reader: {
                        fromBlobFragment: mockFromBlobFragment
                    }
                };

                (bridge as any).fragValidationMap['main-0'] = {
                    validatorQueueRunning: false,
                    queuedForCheckFragments: [{ sn: 1, data: new ArrayBuffer(100), start: 0, end: 10 }],
                    initSegmentData: { size: 100, type: 'video/mp4' },
                    timeCodeMappingTree: { search: () => [], insert: jasmine.createSpy('insert') }
                };

                await expectAsync(bridge.runValidationQueue('main-0')).toBeResolved();
                expect(mockFromBlobFragment).toHaveBeenCalled();
                bridge.dispose();
            });

            it('should process fragment and create manifest helper', async () => {
                const bridge = new C2paHlsBridge(config, mockHls);

                const mockManifestStore = {
                    active_manifest: 'manifest-1',
                    manifests: {
                        'manifest-1': {
                            claim_generator: 'test',
                            title: 'Test',
                            format: 'video/mp4',
                            instance_id: 'id-1',
                            signature_info: { issuer: 'Test Issuer' }
                        }
                    },
                    validation_status: []
                };

                const mockManifestInfo = {
                    manifestStore: jasmine.createSpy('manifestStore').and.returnValue(Promise.resolve(mockManifestStore))
                };

                const mockFromBlobFragment = jasmine.createSpy('fromBlobFragment').and.returnValue(Promise.resolve(mockManifestInfo));
                (bridge as any).c2pa = {
                    reader: {
                        fromBlobFragment: mockFromBlobFragment
                    }
                };

                const insertSpy = jasmine.createSpy('insert');
                (bridge as any).fragValidationMap['main-0'] = {
                    validatorQueueRunning: false,
                    queuedForCheckFragments: [{ sn: 1, data: new ArrayBuffer(100), start: 0, end: 10 }],
                    initSegmentData: { size: 100, type: 'video/mp4' },
                    timeCodeMappingTree: { search: () => [], insert: insertSpy, remove: jasmine.createSpy('remove') }
                };

                await expectAsync(bridge.runValidationQueue('main-0')).toBeResolved();
                expect(insertSpy).toHaveBeenCalled();
                bridge.dispose();
            });

            it('should remove duplicate intervals', async () => {
                const bridge = new C2paHlsBridge(config, mockHls);

                const mockManifestStore = {
                    active_manifest: 'manifest-1',
                    manifests: {
                        'manifest-1': {
                            claim_generator: 'test',
                            title: 'Test',
                            format: 'video/mp4',
                            instance_id: 'id-1',
                            signature_info: { issuer: 'Test Issuer' }
                        }
                    },
                    validation_status: []
                };

                const mockManifestInfo = {
                    manifestStore: jasmine.createSpy('manifestStore').and.returnValue(Promise.resolve(mockManifestStore))
                };

                const mockFromBlobFragment = jasmine.createSpy('fromBlobFragment').and.returnValue(Promise.resolve(mockManifestInfo));
                (bridge as any).c2pa = {
                    reader: {
                        fromBlobFragment: mockFromBlobFragment
                    }
                };

                const removeSpy = jasmine.createSpy('remove');
                const existingSegment = { interval: { low: 0, high: 10 } };
                (bridge as any).fragValidationMap['main-0'] = {
                    validatorQueueRunning: false,
                    queuedForCheckFragments: [{ sn: 1, data: new ArrayBuffer(100), start: 0, end: 10 }],
                    initSegmentData: { size: 100, type: 'video/mp4' },
                    timeCodeMappingTree: {
                        search: () => [existingSegment],
                        insert: jasmine.createSpy('insert'),
                        remove: removeSpy
                    }
                };

                await expectAsync(bridge.runValidationQueue('main-0')).toBeResolved();
                expect(removeSpy).toHaveBeenCalled();
                bridge.dispose();
            });

            it('should handle validation errors gracefully', async () => {
                const bridge = new C2paHlsBridge(config, mockHls);

                const mockFromBlobFragment = jasmine.createSpy('fromBlobFragment').and.returnValue(Promise.reject(new Error('Validation failed')));
                (bridge as any).c2pa = {
                    reader: {
                        fromBlobFragment: mockFromBlobFragment
                    }
                };

                const fragment = { sn: 1, data: new ArrayBuffer(100), start: 0, end: 10 };
                (bridge as any).fragValidationMap['main-0'] = {
                    validatorQueueRunning: false,
                    queuedForCheckFragments: [fragment],
                    initSegmentData: { size: 100, type: 'video/mp4' },
                    timeCodeMappingTree: { search: () => [], insert: jasmine.createSpy('insert') }
                };

                await expectAsync(bridge.runValidationQueue('main-0')).toBeResolved();
                expect((bridge as any).fragValidationMap['main-0'].validatorQueueRunning).toBe(false);
                bridge.dispose();
            });

            it('should delete fragment data after processing', async () => {
                const bridge = new C2paHlsBridge(config, mockHls);

                const mockFromBlobFragment = jasmine.createSpy('fromBlobFragment').and.returnValue(Promise.resolve(null));
                (bridge as any).c2pa = {
                    reader: {
                        fromBlobFragment: mockFromBlobFragment
                    }
                };

                const fragment: any = { sn: 1, data: new ArrayBuffer(100), start: 0, end: 10 };
                (bridge as any).fragValidationMap['main-0'] = {
                    validatorQueueRunning: false,
                    queuedForCheckFragments: [fragment],
                    initSegmentData: { size: 100, type: 'video/mp4' },
                    timeCodeMappingTree: { search: () => [], insert: jasmine.createSpy('insert') }
                };

                await bridge.runValidationQueue('main-0');
                // After processing, fragment.data should be deleted
                expect('data' in fragment).toBe(true);
                bridge.dispose();
            });

            it('should recursively process remaining fragments', async () => {
                const bridge = new C2paHlsBridge(config, mockHls);

                const mockFromBlobFragment = jasmine.createSpy('fromBlobFragment').and.returnValue(Promise.resolve(null));
                (bridge as any).c2pa = {
                    reader: {
                        fromBlobFragment: mockFromBlobFragment
                    }
                };

                const fragment1 = { sn: 1, data: new ArrayBuffer(100), start: 0, end: 10 };
                const fragment2 = { sn: 2, data: new ArrayBuffer(100), start: 10, end: 20 };
                (bridge as any).fragValidationMap['main-0'] = {
                    validatorQueueRunning: false,
                    queuedForCheckFragments: [fragment1, fragment2],
                    initSegmentData: { size: 100, type: 'video/mp4' },
                    timeCodeMappingTree: { search: () => [], insert: jasmine.createSpy('insert') }
                };

                await bridge.runValidationQueue('main-0');
                // Both fragments should have been processed
                expect(mockFromBlobFragment).toHaveBeenCalledTimes(2);
                bridge.dispose();
            });
        });
    });
});
