import {MetadataUtils} from './metadata-utils';

describe('test metadata utils', () => {

    const transcriptionModel = require('tests/assets/metadata/sample-transcription.json');
    const amaliaWaveForm = require('tests/assets/metadata/amalia-wave-form.json');

    it('Test Metadata: metadata manager transcription', () => {
        const tl1 = MetadataUtils.getTranscriptionLocalisations(transcriptionModel);
        expect(tl1.length).toEqual(224);
        expect(tl1[0].tcIn).toEqual(0.013);
        expect(tl1[0].tcOut).toEqual(14 * 60 + 59.009);
        expect(tl1[0].text.length).toEqual(13905);
        const tl2 = MetadataUtils.getTranscriptionLocalisations(transcriptionModel, 2, true);
        expect(tl2.length).toEqual(223);
    });

    it('Test Metadata: metadata manager Wave form', () => {
        const h = MetadataUtils.getHistograms(amaliaWaveForm);
        expect(h.length).toEqual(1);
        expect(h[0].posmax).toEqual(81);
        expect(h[0].negmax).toEqual(72);
        expect(h[0].nbbins).toEqual(2047);
    });
});


