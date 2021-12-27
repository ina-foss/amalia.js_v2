import {async} from '@angular/core/testing';
import {HLSMediaSourceExtension} from './hls-media-source-extension';
import {EventEmitter} from 'events';
import {PlayerConfigData} from '../../config/model/player-config-data';
import {DefaultLogger} from '../../logger/default-logger';
import Hls from 'hls.js';
import {PlayerEventType} from '../../constant/event-type';

describe('Test HLS Source extension', () => {
    const mediaSrc = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
    const backwardSrc = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
    const eventEmitter = new EventEmitter();
    const component = document.createElement('video');
    const logger =  new DefaultLogger('root-player');
    const config: PlayerConfigData = {
        autoplay: false, crossOrigin: null, data: null, defaultVolume: 0, duration: null, poster: '', src: mediaSrc
        , backwardsSrc: backwardSrc
    };
    const hlsPlayer = new HLSMediaSourceExtension(component, eventEmitter, config, logger);

    beforeEach(async(() => {
    }));

    afterEach(() => {
    });

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
        spyOn(eventEmitter, 'emit');
        hlsPlayer.handleError('ERROR');
        expect(eventEmitter.emit).toHaveBeenCalled();
        hlsPlayer.handleError('hlsError');
        expect(eventEmitter.emit).toHaveBeenCalled();
        hlsPlayer.switchToBackwardsSrc();
        eventEmitter.emit(Hls.Events.MANIFEST_LOADED);
        expect(hlsPlayer.mediaElement.play()).toBeTruthy();

    });
    it('test destroy function ', () => {
        hlsPlayer.destroy();
        expect(hlsPlayer).toBeTruthy();
    });
});


