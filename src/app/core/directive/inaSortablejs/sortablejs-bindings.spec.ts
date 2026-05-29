import { SortablejsBindings } from './sortablejs-bindings';

describe('SortablejsBindings', () => {
    it('should fan-out operations to every binding target', () => {
        const listA = [1, 2, 3];
        const listB = ['a', 'b', 'c'];
        const bindings = new SortablejsBindings([listA as any, listB as any]);

        bindings.injectIntoEvery(1, [9, 'x']);
        expect(listA).toEqual([1, 9, 2, 3]);
        expect(listB).toEqual(['a', 'x', 'b', 'c']);

        expect(bindings.getFromEvery(2)).toEqual([2, 'b']);
        expect(bindings.extractFromEvery(1)).toEqual([9, 'x']);
        expect(listA).toEqual([1, 2, 3]);
        expect(listB).toEqual(['a', 'b', 'c']);
        expect(bindings.provided).toBeTrue();
    });

    it('should report no bindings when empty', () => {
        const bindings = new SortablejsBindings([]);
        expect(bindings.provided).toBeFalse();
        expect(bindings.getFromEvery(0)).toEqual([]);
    });
});

