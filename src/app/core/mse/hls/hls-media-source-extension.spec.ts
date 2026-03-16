import { HLSMediaSourceExtension } from './hls-media-source-extension';
import { EventEmitter } from 'events';
import { PlayerConfigData } from '../../config/model/player-config-data';
import { DefaultLogger } from '../../logger/default-logger';
import { C2PAConfig } from '../../utils/hls-c2pa-bridge';
import Hls from 'hls.js';

describe('Test HLS Source extension', () => {
    const mediaSrc = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
    const backwardSrc = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
    const eventEmitter = new EventEmitter();
    const component = document.createElement('video');
    const logger = new DefaultLogger('root-player');
    const config: PlayerConfigData = {
        autoplay: false, crossOrigin: null, data: null, defaultVolume: 0, duration: null, poster: '', src: mediaSrc
        , backwardsSrc: backwardSrc
    };
    const hlsPlayer = new HLSMediaSourceExtension(component, eventEmitter, config, logger);

    it('Media player element ', () => {
        const m3u8Url = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
        const m3u8List = 'I0VYVE0zVQojRVhULVgtVkVSU0lPTjozCiNFWFQtWC1QTEFZTElTVC1UWVBFOlZPRAojRVhULVgtVEFSR0' +
            'VURFVSQVRJT046MgojRVhULVgtTUVESUEtU0VRVUVOQ0U6MQojRVhUSU5GOjEwLjAsCmh0dHBzOi8vd3MtbWVkaWEtY3B1LmluYS5mci9tZWRpYXMvZWZw' +
            'L3NLWFV6cnJOaHJadHEvdEpuRVFVZ3drangzdDc1bGJteUNObWM3ZWJTK3cvelBkTk5SUWdqUmlYWWJrSmxHNCszb25pQXpVTjlMTGE2TWNhQ3kvNTJxMlF' +
            'nQ0ZSK1RYQkxWb2ZqV2FhVW85OS9xZVdwNEhRWmlZdDhGQmtvdTdQZFN5K1dvcEdiNzVGVVhRTVJhR2lRUHFSSlRudCt3K0hBMG1XSmJheS9DSFJmUHM3S09V' +
            'RmZVblZNU0ROUGNCcUcxTEZ0Ky9ZQ3dCWmdkWm1TK0pXTnFIVFF3Q0xDWUZXQkg3RE1PTDBFZUY0SEYvZE9INTd4MG1HcFMwUGU0RVpoOThtQWUwNExBcU5Yc' +
            'FpYNWxodm5kSzVYVlorbUkvRHpPRlNXMjNuZFROd2MwSEt5OWIzNUJnTWl3N2tlUDluRGFrRmhSSDlDdlBqQjFEd0FWRW16LzRuQk4wNDJtVndhZE5hQ3QvN3A' +
            '1MTAvR0Q2dE1wemRWUnVjbldUdUVURzkycURQZHVRM2l4Rzk1cC90N3NMVmpLM1hpU2xJaU41KzJscXh3UnVBK2pmNzRzOXhSdW5XYUhvZ3FwaHBwNUlRcHFMZF' +
            'JLWnJnVWNPZHRPMDQyL1REQ0lBdXNJN1BUdXBWRytTOFl6eUtLa1VGc0RDanhSOUNGOHFoekpBT3FlOGRaVkxDZzdhWXFUVXd1T1V4TCtaT1BaNXI0RHdSa05zT' +
            'EVlRTg1Ui9UUVByUWpQUkk3dkkzR09VTXVHRXV6RVlMeFkyaXNuU1dzZ0FIdGdzVnhmVkxKSklxcG5nVzVFaHZ3dnRWWU9LNnVJQ290S3pkdCs2dnBZL0ZFREZje' +
            'lc3U1BzakduYVM2MWVwSDlCcVFiSDZidVVCMmE0cklCdElEVFplbFZ3RXExRkYvYWVrMjdFNVJYWjRBelQvc2xfaXYvZXpwN3Z6dzFpZ1hDMzlLR3V2UzBvUT09L' +
            '3NsX2htL3NlZy0xLXYxLWExLnRzCiNFWFRJTkY6MTAuMCwKaHR0cHM6Ly93cy1tZWRpYS1jcHUuaW5hLmZyL21lZGlhcy9lZnAvc0tYVXpyck5oclp0cS90Sm5FU' +
            'VVnd2tqeDN0NzVsYm15Q05tYzdlYlMrdy96UGROTlJRZ2pSaVhZYmtKbEc0KzNvbmlBelVOOUxMYTZNY2FDeS81MnEyUWdDRlIrVFhCTFZvZmpXYWFVbzk5L3FlV' +
            '3A0SFFaaVl0OEZCa291N1BkU3krV29wR2I3NUZVWFFNUmFHaVFQcVJKVG50K3crSEEwbVdKYmF5L0NIUmZQczdLT1VGZlVuVk1TRE5QY0JxRzFMRnQrL1lDd0JaZ' +
            '2RabVMrSldOcUhUUXdDTENZRldCSDdETU9MMEVlRjRIRi9kT0g1N3gwbUdwUzBQZTRFWmg5OG1BZTA0TEFxTlhwWlg1bGh2bmRLNVhWWittSS9Eek9GU1cyM25kV' +
            'E53YzBIS3k5YjM1QmdNaXc3a2VQOW5EYWtGaFJIOUN2UGpCMUR3QVZFbXovNG5CTjA0Mm1Wd2FkTmFDdC83cDUxMC9HRDZ0TXB6ZFZSdWNuV1R1RVRHOTJxRFBkd' +
            'VEzaXhHOTVwL3Q3c0xWakszWGlTbElpTjUrMmxxeHdSdUEramY3NHM5eFJ1bldhSG9ncXBocHA1SVFwcUxkUktacmdVY09kdE8wNDIvVERDSUF1c0k3UFR1cFZHK' +
            '1M4WXp5S0trVUZzRENqeFI5Q0Y4cWh6SkFPcWU4ZFpWTENnN2FZcVRVd3VPVXhMK1pPUFo1cjREd1JrTnNMRWVFODVSL1RRUHJRalBSSTd2STNHT1VNdUdFdXpFW' +
            'Ux4WTJpc25TV3NnQUh0Z3NWeGZWTEpKSXFwbmdXNUVodnd2dFZZT0s2dUlDb3RLemR0KzZ2cFkvRkVERmN6VzdTUHNqR25hUzYxZXBIOUJxUWJINmJ1VUIyYTRyS' +
            'UJ0SURUWmVsVndFcTFGRi9hZWsyN0U1UlhaNEF6VC9zbF9pdi9lenA3dnp3MWlnWEMzOUtHdXZTMG9RPT0vc2xfaG0vc2VnLTItdjEtYTEudHMKI0VYVC1YLUVOR' +
            'ExJU1QK';
        expect(HLSMediaSourceExtension.isUrl(m3u8Url)).toEqual(true);

        expect(HLSMediaSourceExtension.isUrl(m3u8List))
            .toEqual(false);
    });
    it('test switch function ', () => {
        hlsPlayer.setSrc(config);
        expect(hlsPlayer.getSrc()).toEqual(mediaSrc);
        expect(hlsPlayer.getBackwardsSrc()).toEqual(backwardSrc);
        hlsPlayer.switchToMainSrc();
        expect(hlsPlayer.reverseMode).toEqual(false);
        hlsPlayer.switchToBackwardsSrc();
        expect(hlsPlayer.reverseMode).toEqual(true);
    });
    it('test handle error ', () => {
        hlsPlayer.setSrc(config);
        spyOn(eventEmitter, 'emit');
        hlsPlayer.handleError('ERROR');
        expect(eventEmitter.emit).toHaveBeenCalled();
        hlsPlayer.handleError('hlsError');
        expect(eventEmitter.emit).toHaveBeenCalled();
        hlsPlayer.switchToBackwardsSrc();
        eventEmitter.emit(Hls.Events.MANIFEST_LOADED);

    });
    it('test destroy function ', () => {
        hlsPlayer.destroy();
        expect(hlsPlayer).toBeTruthy();
    });

    describe('handleManifestParsed', () => {
        it('should set mediaType to AUDIO when no videoCodec in levels', () => {
            const testConfig: PlayerConfigData = {
                autoplay: false, crossOrigin: null, data: null, defaultVolume: 0,
                duration: null, poster: '', src: mediaSrc, backwardsSrc: backwardSrc
            };
            const testPlayer = new HLSMediaSourceExtension(component, eventEmitter, testConfig, logger);

            testPlayer.handleManifestParsed(null, { levels: [{ audioCodec: 'mp4a.40.2' }] });

            expect(testPlayer.mediaType).toBe('AUDIO');
            testPlayer.destroy();
        });

        it('should set mediaType to VIDEO when videoCodec exists in levels', () => {
            const testConfig: PlayerConfigData = {
                autoplay: false, crossOrigin: null, data: null, defaultVolume: 0,
                duration: null, poster: '', src: mediaSrc, backwardsSrc: backwardSrc
            };
            const testPlayer = new HLSMediaSourceExtension(component, eventEmitter, testConfig, logger);

            testPlayer.handleManifestParsed(null, { levels: [{ videoCodec: 'avc1.42E01E', audioCodec: 'mp4a.40.2' }] });

            expect(testPlayer.mediaType).toBe('VIDEO');
            testPlayer.destroy();
        });

        it('should set mediaType to VIDEO if any level has videoCodec', () => {
            const testConfig: PlayerConfigData = {
                autoplay: false, crossOrigin: null, data: null, defaultVolume: 0,
                duration: null, poster: '', src: mediaSrc, backwardsSrc: backwardSrc
            };
            const testPlayer = new HLSMediaSourceExtension(component, eventEmitter, testConfig, logger);

            testPlayer.handleManifestParsed(null, {
                levels: [
                    { audioCodec: 'mp4a.40.2' },
                    { videoCodec: 'avc1.42E01E' }
                ]
            });

            expect(testPlayer.mediaType).toBe('VIDEO');
            testPlayer.destroy();
        });
    });

    describe('getConfig', () => {
        it('should return the HLS player config', () => {
            const testConfig: PlayerConfigData = {
                autoplay: false, crossOrigin: null, data: null, defaultVolume: 0,
                duration: null, poster: '', src: mediaSrc, backwardsSrc: backwardSrc
            };
            const testPlayer = new HLSMediaSourceExtension(component, eventEmitter, testConfig, logger);

            const hlsConfig = testPlayer.getConfig();

            expect(hlsConfig).toBeDefined();
            expect(hlsConfig.enableWorker).toBe(false);
            testPlayer.destroy();
        });
    });

    describe('setMaxBufferLengthConfig', () => {
        it('should set maxBufferLength in HLS config', () => {
            const testConfig: PlayerConfigData = {
                autoplay: false, crossOrigin: null, data: null, defaultVolume: 0,
                duration: null, poster: '', src: mediaSrc, backwardsSrc: backwardSrc
            };
            const testPlayer = new HLSMediaSourceExtension(component, eventEmitter, testConfig, logger);

            testPlayer.setMaxBufferLengthConfig(60);

            expect(testPlayer.getConfig().maxBufferLength).toBe(60);
            testPlayer.destroy();
        });
    });

    describe('getHlsPlayer', () => {
        it('should return the underlying HLS.js instance', () => {
            const testConfig: PlayerConfigData = {
                autoplay: false, crossOrigin: null, data: null, defaultVolume: 0,
                duration: null, poster: '', src: mediaSrc, backwardsSrc: backwardSrc
            };
            const testPlayer = new HLSMediaSourceExtension(component, eventEmitter, testConfig, logger);

            const hls = testPlayer.getHlsPlayer();

            expect(hls).toBeDefined();
            expect(hls instanceof Hls).toBeTrue();
            testPlayer.destroy();
        });
    });

    describe('C2PA Integration', () => {
        let testPlayer: HLSMediaSourceExtension;

        beforeEach(() => {
            const testConfig: PlayerConfigData = {
                autoplay: false, crossOrigin: null, data: null, defaultVolume: 0,
                duration: null, poster: '', src: mediaSrc, backwardsSrc: backwardSrc
            };
            testPlayer = new HLSMediaSourceExtension(component, eventEmitter, testConfig, logger);
        });

        afterEach(() => {
            testPlayer.destroy();
        });

        describe('isC2PAEnabled', () => {
            it('should return false by default', () => {
                expect(testPlayer.isC2PAEnabled()).toBeFalse();
            });

            it('should return true after enableC2PA is called', () => {
                testPlayer.enableC2PA();
                expect(testPlayer.isC2PAEnabled()).toBeTrue();
            });

            it('should return false after disableC2PA is called', () => {
                testPlayer.enableC2PA();
                testPlayer.disableC2PA();
                expect(testPlayer.isC2PAEnabled()).toBeFalse();
            });
        });

        describe('enableC2PA', () => {
            it('should enable C2PA with default config when no config provided', () => {
                testPlayer.enableC2PA();

                expect(testPlayer.isC2PAEnabled()).toBeTrue();
                expect(testPlayer.getC2PABridge()).not.toBeNull();
            });

            it('should enable C2PA with custom config', () => {
                const customConfig: C2PAConfig = {
                    enableTrustListVerification: true,
                    wasmSrc: 'https://custom.wasm'
                };

                testPlayer.enableC2PA(customConfig);

                expect(testPlayer.isC2PAEnabled()).toBeTrue();
            });

            it('should not re-enable C2PA if already enabled', () => {
                testPlayer.enableC2PA();
                const bridge1 = testPlayer.getC2PABridge();

                testPlayer.enableC2PA();
                const bridge2 = testPlayer.getC2PABridge();

                expect(bridge1).toBe(bridge2);
            });
        });

        describe('disableC2PA', () => {
            it('should disable C2PA and clear bridge', () => {
                testPlayer.enableC2PA();
                testPlayer.disableC2PA();

                expect(testPlayer.isC2PAEnabled()).toBeFalse();
                expect(testPlayer.getC2PABridge()).toBeNull();
            });

            it('should handle disableC2PA when C2PA was never enabled', () => {
                expect(() => testPlayer.disableC2PA()).not.toThrow();
                expect(testPlayer.isC2PAEnabled()).toBeFalse();
            });
        });

        describe('isC2PAReady', () => {
            it('should return false when C2PA is not enabled', () => {
                expect(testPlayer.isC2PAReady()).toBeFalse();
            });

            it('should return false immediately after enabling (async init)', () => {
                testPlayer.enableC2PA();
                // C2PA init is async, so it won't be ready immediately
                expect(testPlayer.isC2PAReady()).toBeFalse();
            });
        });

        describe('getC2PAMetaByTimeCode', () => {
            it('should return null when C2PA is not enabled', () => {
                const result = testPlayer.getC2PAMetaByTimeCode(10);
                expect(result).toBeNull();
            });

            it('should return null when no metadata exists for timecode', () => {
                testPlayer.enableC2PA();
                const result = testPlayer.getC2PAMetaByTimeCode(10);
                expect(result).toBeNull();
            });
        });

        describe('getC2PABridge', () => {
            it('should return null when C2PA is not enabled', () => {
                expect(testPlayer.getC2PABridge()).toBeNull();
            });

            it('should return the bridge instance when C2PA is enabled', () => {
                testPlayer.enableC2PA();
                expect(testPlayer.getC2PABridge()).not.toBeNull();
            });
        });
    });

    describe('setSrc edge cases', () => {
        it('should handle non-URL src by adding base64 header', () => {
            const base64Content = 'I0VYVE0zVQ==';
            const testConfig: PlayerConfigData = {
                autoplay: false, crossOrigin: null, data: null, defaultVolume: 0,
                duration: null, poster: '', src: base64Content
            };
            const testPlayer = new HLSMediaSourceExtension(component, eventEmitter, testConfig, logger);

            testPlayer.setSrc(testConfig);

            expect(testPlayer.getSrc()).toContain('data:application/vnd.apple.mpegurl;base64,');
            testPlayer.destroy();
        });

        it('should handle config with autoplay true', () => {
            const testConfig: PlayerConfigData = {
                autoplay: true, crossOrigin: null, data: null, defaultVolume: 0,
                duration: null, poster: '', src: mediaSrc
            };
            const testPlayer = new HLSMediaSourceExtension(component, eventEmitter, testConfig, logger);
            spyOn(component, 'play').and.returnValue(Promise.resolve());

            testPlayer.setSrc(testConfig);

            expect(component.play).toHaveBeenCalled();
            testPlayer.destroy();
        });

        it('should handle invalid config with null src', () => {
            const testConfig: PlayerConfigData = {
                autoplay: false, crossOrigin: null, data: null, defaultVolume: 0,
                duration: null, poster: '', src: null as any
            };
            const testPlayer = new HLSMediaSourceExtension(component, eventEmitter, testConfig, logger);

            testPlayer.setSrc(testConfig);

            expect(testPlayer.getSrc()).toBeNull();
            testPlayer.destroy();
        });
    });

    describe('destroy with C2PA', () => {
        it('should cleanup C2PA bridge when destroy is called', () => {
            const testConfig: PlayerConfigData = {
                autoplay: false, crossOrigin: null, data: null, defaultVolume: 0,
                duration: null, poster: '', src: mediaSrc
            };
            const testPlayer = new HLSMediaSourceExtension(component, eventEmitter, testConfig, logger);

            testPlayer.enableC2PA();
            expect(testPlayer.getC2PABridge()).not.toBeNull();

            testPlayer.destroy();

            expect(testPlayer.getC2PABridge()).toBeNull();
            expect(testPlayer.isC2PAEnabled()).toBeFalse();
        });
    });

    describe('handleError edge cases', () => {
        it('should emit ERROR for fatal hlsError when not in reverse mode', () => {
            const testConfig: PlayerConfigData = {
                autoplay: false, crossOrigin: null, data: null, defaultVolume: 0,
                duration: null, poster: '', src: mediaSrc
            };
            const testPlayer = new HLSMediaSourceExtension(component, eventEmitter, testConfig, logger);
            testPlayer.setSrc(testConfig);
            spyOn(eventEmitter, 'emit');

            testPlayer.handleError({ fatal: true });

            expect(eventEmitter.emit).toHaveBeenCalled();
            testPlayer.destroy();
        });

        it('should not emit ERROR for non-fatal hlsError', () => {
            const testConfig: PlayerConfigData = {
                autoplay: false, crossOrigin: null, data: null, defaultVolume: 0,
                duration: null, poster: '', src: mediaSrc
            };
            const testPlayer = new HLSMediaSourceExtension(component, eventEmitter, testConfig, logger);
            testPlayer.setSrc(testConfig);
            const emitSpy = spyOn(eventEmitter, 'emit');

            testPlayer.handleError('hlsError');

            // hlsError without fatal=true should not emit
            expect(emitSpy).not.toHaveBeenCalled();
            testPlayer.destroy();
        });
    });
});


