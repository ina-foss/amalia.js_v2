import {TextUtils} from './text-utils';

describe('test text utils', () => {

    it('Test text utils:  ', () => {
        const fackText1 = 'il';
        const fackText2 = 'noir. ';
        const fackText3 = 'une';
        const searchText = 'anticyclone';

        expect(TextUtils.hasSearchText(fackText1, 'il')).toEqual(true);
        expect(TextUtils.hasSearchText(fackText2, 'êtes')).toEqual(false);
        expect(TextUtils.hasSearchText(fackText3, 'une')).toEqual(true);
        expect(TextUtils.hasSearchText(fackText1, 'elle')).toEqual(false);
        expect(TextUtils.hasSearchText('l\'anticyclone', searchText)).toEqual(true);
        expect(TextUtils.hasSearchText('l\' anticyclone', searchText)).toEqual(true);
        expect(TextUtils.hasSearchText('l \'anticyclone', searchText)).toEqual(true);
        expect(TextUtils.hasSearchText('l\'anticyclones', searchText)).toEqual(true);
        expect(TextUtils.hasSearchText('l\' anticyclones', searchText)).toEqual(true);
        expect(TextUtils.hasSearchText('l \'anticyclones', searchText)).toEqual(true);
        expect(TextUtils.hasSearchText('l \'anticiclone', searchText)).toEqual(false);
    });

    it('Test formatCopiedText: removes double spaces and spaces around apostrophes/hyphens', () => {
        const input = 'Le  premier  invité  d \'un  oeil  sur  le  monde  est  à  la  fois  député,  président  du  groupe  d \'amitié  France -Ukraine.';
        const expected = "Le premier invité d'un oeil sur le monde est à la fois député, président du groupe d'amitié France-Ukraine.";
        expect(TextUtils.formatCopiedText(input)).toEqual(expected);
        expect(TextUtils.formatCopiedText("d' assaut")).toEqual("d'assaut");
        expect(TextUtils.formatCopiedText('  hello  world  ')).toEqual('hello world');
        expect(TextUtils.formatCopiedText('')).toEqual('');
        expect(TextUtils.formatCopiedText(null)).toBeNull();
    });
});


