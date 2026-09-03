import {MetadataUtils} from './metadata-utils';

describe('Test metadata utils', () => {

    const amaliaEventSample = require('tests/assets/metadata/amalia01-events.json');
    const amaliaBallSample = require('tests/assets/metadata/amalia01-ball.json');
    const transcriptionModel = require('tests/assets/metadata/sample-transcription.json');
    const amaliaWaveForm = require('tests/assets/metadata/amalia-wave-form.json');

    it('Test Metadata: metadata manager transcription', () => {
        const tl1 = MetadataUtils.getTranscriptionLocalisations(transcriptionModel);
        expect(tl1.length).toEqual(1);
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

    it('Test Metadata: metadata timeline', () => {
        const ballSampleLocalisations = MetadataUtils.getTimelineLocalisations(amaliaBallSample);
        const eventsSampleLocalisations = MetadataUtils.getTimelineLocalisations(amaliaEventSample);
        expect(ballSampleLocalisations.length).toEqual(3);
        expect(ballSampleLocalisations[0].tcIn).toEqual(1.68);
        expect(ballSampleLocalisations[0].tcOut).toEqual(3.36);
        expect(eventsSampleLocalisations.length).toEqual(7);
        expect(eventsSampleLocalisations[0].label).toContain('Start');
        expect(eventsSampleLocalisations[0].tc).toEqual(1.68);
        expect(eventsSampleLocalisations[1].label).toContain('Ping');
        expect(eventsSampleLocalisations[1].tc).toEqual(3.36);
    });
});


