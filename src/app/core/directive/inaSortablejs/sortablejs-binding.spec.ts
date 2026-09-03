import { SortablejsBinding } from './sortablejs-binding';

describe('SortablejsBinding', () => {
    it('should insert/get/remove on plain arrays', () => {
        const target = [1, 2, 3];
        const binding = new SortablejsBinding(target as any);

        binding.insert(1, 9);
        expect(target).toEqual([1, 9, 2, 3]);
        expect(binding.get(2)).toBe(2);
        expect(binding.remove(1)).toBe(9);
        expect(target).toEqual([1, 2, 3]);
    });

    it('should insert/get/remove on form-array like targets', () => {
        const data = [10, 20, 30];
        const target = {
            at: (index: number) => data[index],
            insert: (index: number, item: any) => data.splice(index, 0, item),
            removeAt: (index: number) => data.splice(index, 1),
            reset: jasmine.createSpy('reset')
        };

        const binding = new SortablejsBinding(target as any);
        binding.insert(2, 99);
        expect(data).toEqual([10, 20, 99, 30]);
        expect(binding.get(2)).toBe(99);
        expect(binding.remove(1)).toBe(20);
        expect(data).toEqual([10, 99, 30]);
    });
});

