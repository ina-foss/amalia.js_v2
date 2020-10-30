import {TextUtils} from './text-utils';

describe('test text utils', () => {

    const transcriptionModel = require('tests/assets/metadata/sample-transcription.json');

    it('Test text utils:  ', () => {
        const fackText1 = 'il';
        const fackText2 = 'noir. ';
        const fackText3 = 'une';

        expect(TextUtils.hasSearchText(fackText1, 'il')).toEqual(true);
        expect(TextUtils.hasSearchText(fackText2, 'êtes')).toEqual(false);
        expect(TextUtils.hasSearchText(fackText3, 'une')).toEqual(true);
        expect(TextUtils.hasSearchText(fackText1, 'elle')).toEqual(false);
    });
});


