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

            it('should return true when c2pa.actions has trainedAlgorithmicMedia digitalSourceType', () => {
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
                                            { digitalSourceType: 'http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia' }
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
        });

        describe('getC2PAMetaByTimeCode', () => {
            it('should return null when no entry exists for current level', () => {
                const bridge = new C2paHlsBridge(config, mockHls);

                const result = bridge.getC2PAMetaByTimeCode(10);
                expect(result).toBeNull();
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
        });
    });
});
