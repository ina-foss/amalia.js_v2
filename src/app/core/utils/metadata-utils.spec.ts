import {async} from '@angular/core/testing';
import {MetadataUtils} from './metadata-utils';

describe('test metadata utils', () => {

    const transcriptionModel = require('tests/assets/metadata/sample-transcription.json');

    it('Test Metadata: metadata manager ', () => {
        const tl1 = MetadataUtils.getTranscriptionLocalisations(transcriptionModel);
        expect(tl1.length).toEqual(224);
        expect(tl1[0].tcIn).toEqual(0.013);
        expect(tl1[0].tcOut).toEqual(14 * 60 + 59.009);
        expect(tl1[0].text.length).toEqual(13905);
        const tl2 = MetadataUtils.getTranscriptionLocalisations(transcriptionModel, 2);
        expect(tl2.length).toEqual(2571);
    });
});


