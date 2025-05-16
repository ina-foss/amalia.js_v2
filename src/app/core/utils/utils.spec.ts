import { Utils } from './utils';

describe('Utils', () => {


    it('Utils:  ', () => {
        const array1 = ['1', '2', '3'];
        expect(Utils.isArrayLike(array1)).toEqual(true);
    });




    it('devrait retourner true si l\'élément avec l\'ID est dans le composedPath', () => {
        const fakeEvent = {
            composedPath: () => [
                { id: 'autre-element' },
                { id: 'mon-element' },
                { id: '' }
            ]
        };

        const result = Utils.isInComposedPath('mon-element', fakeEvent);
        expect(result).toBeTrue();
    });

    it('devrait retourner false si aucun élément du composedPath n\'a l\'ID donné', () => {
        const fakeEvent = {
            composedPath: () => [
                { id: 'autre-element' },
                { id: 'encore-un' }
            ]
        };

        const result = Utils.isInComposedPath('mon-element', fakeEvent);
        expect(result).toBeFalse();
    });

    it('devrait gérer un composedPath vide', () => {
        const fakeEvent = {
            composedPath: () => []
        };

        const result = Utils.isInComposedPath('mon-element', fakeEvent);
        expect(result).toBeFalse();
    });

});


