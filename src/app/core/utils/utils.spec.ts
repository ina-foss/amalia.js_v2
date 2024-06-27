import {Utils} from './utils';

describe('Utils', () => {


    it('Utils:  ', () => {
        const array1 = ['1', '2', '3'];
        expect(Utils.isArrayLike(array1)).toEqual(true);
    });
});


