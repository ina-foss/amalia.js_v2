import Utils from './Utils';

describe('Photo Utils', () => {
    it('inArray should compare deep values', () => {
        const haystack = [{ a: 1 }, { b: 2 }];
        expect(Utils.inArray({ a: 1 }, haystack)).toBeTrue();
        expect(Utils.inArray({ c: 3 }, haystack)).toBeFalse();
    });

    it('guid should return prefixed id', () => {
        const id = Utils.guid();
        expect(id.startsWith('amaliaPhotoPlayer')).toBeTrue();
    });

    it('truncate should keep short string and truncate long string', () => {
        const short = 'short';
        expect(Utils.truncate(short, 3, '...')).toBe('short');

        const long = 'x'.repeat(80);
        expect(Utils.truncate(long, 10, '..')).toBe('xxxxxxxxxx..');
    });

    it('isObject should detect plain objects only', () => {
        expect(Utils.isObject({})).toBeTrue();
        expect(Utils.isObject([])).toBeFalse();
        expect(Utils.isObject(null)).toBeNull();
    });

    it('mergeDeep should merge nested objects and override values', () => {
        const result = Utils.mergeDeep(
            { a: { b: 1 }, c: 1 },
            { a: { d: 2 }, c: 3 },
            { e: 4 }
        );
        expect(result).toEqual({ a: { b: 1, d: 2 }, c: 3, e: 4 });
    });

    it('roundToMultiple should floor to nearest multiple', () => {
        expect(Utils.roundToMultiple(113, 25)).toBe(100);
    });

    it('roundToSteps should resolve previous and next steps', () => {
        const steps = [10, 20, 40, 80];
        expect(Utils.roundToSteps(21, steps, 'prev')).toBe(20);
        expect(Utils.roundToSteps(21, steps, 'next')).toBe(40);
    });
});

