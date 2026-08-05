import { flattenDose, extractCrops, extractDoses, encodeComposition, decodeComposition, parseGazetteDate, GazetteEntry } from './gazette';

describe('parseGazetteDate', () => {
    it('parses the human-readable format the API actually returns', () => {
        const parsed = parseGazetteDate('25th March, 2026');
        expect(parsed).not.toBeNull();
        expect(parsed!.format('YYYY-MM-DD')).toBe('2026-03-25');
    });

    it('handles every ordinal suffix', () => {
        expect(parseGazetteDate('1st January, 2026')!.format('YYYY-MM-DD')).toBe('2026-01-01');
        expect(parseGazetteDate('2nd February, 2026')!.format('YYYY-MM-DD')).toBe('2026-02-02');
        expect(parseGazetteDate('3rd April, 2025')!.format('YYYY-MM-DD')).toBe('2025-04-03');
        expect(parseGazetteDate('11th December, 2024')!.format('YYYY-MM-DD')).toBe('2024-12-11');
    });

    it('parses abbreviated months and ISO dates', () => {
        expect(parseGazetteDate('25 Mar, 2026')!.format('YYYY-MM-DD')).toBe('2026-03-25');
        expect(parseGazetteDate('2026-03-25')!.format('YYYY-MM-DD')).toBe('2026-03-25');
    });

    it('returns null — never an invalid Dayjs — for unusable input', () => {
        // An invalid Dayjs is truthy and formats to "Invalid Date", which would
        // then be submitted to the API. Null is the only safe failure value.
        [null, undefined, '', '   ', 'not a date', 42, {}].forEach((input) => {
            expect(parseGazetteDate(input)).toBeNull();
        });
    });

    it('never produces the string "Invalid Date"', () => {
        const parsed = parseGazetteDate('25th March, 2026');
        expect(parsed!.format('YYYY-MM-DD')).not.toBe('Invalid Date');
    });
});

const entryWith = (application_details: any): GazetteEntry =>
    ({ id: 1, product_name: 'X', application_details } as GazetteEntry);

describe('extractCrops / extractDoses', () => {
    it('reads the string crop_name shape', () => {
        const entry = entryWith({ crop_name: 'Cucumber, Chilli', dose: 'One application at 1 litre/ha' });
        expect(extractCrops(entry)).toBe('Cucumber, Chilli');
        expect(extractDoses(entry)).toBe('One application at 1 litre/ha');
    });

    it('reads the array crop_name shape without throwing', () => {
        // The label module proves this shape occurs on the same dataset.
        // Calling .trim() on it used to throw a TypeError.
        const entry = entryWith({
            crop_name: [
                { name: 'Rice', dose: '2 litre/ha' },
                { name: 'Wheat', dose: '1.5 litre/ha' },
            ],
            dose: null,
        });

        expect(() => extractCrops(entry)).not.toThrow();
        expect(extractCrops(entry)).toBe('Rice, Wheat');
    });

    it('recovers per-crop doses that live inside the crop_name array', () => {
        const entry = entryWith({
            crop_name: [{ name: 'Rice', dose: '2 litre/ha' }],
            dose: null,
        });
        // Reading only the top-level `dose` would silently lose this.
        expect(extractDoses(entry)).toBe('Rice: 2 litre/ha');
    });

    it('returns empty strings for missing application_details', () => {
        expect(extractCrops(entryWith(null))).toBe('');
        expect(extractDoses(entryWith(null))).toBe('');
        expect(extractCrops(null)).toBe('');
        expect(extractDoses(undefined)).toBe('');
    });
});

describe('flattenDose', () => {
    it('passes a plain string through', () => {
        expect(flattenDose('One foliar application at 2.5 litre/ha'))
            .toBe('One foliar application at 2.5 litre/ha');
    });

    it('flattens a per-crop object naming every crop and dose', () => {
        const result = flattenDose({
            Chilli: 'Two foliar applications at 750 ml/ha',
            Cucumber: 'One foliar application at 1 litre/ha',
        });

        expect(result).toContain('Chilli: Two foliar applications at 750 ml/ha');
        expect(result).toContain('Cucumber: One foliar application at 1 litre/ha');
    });

    it('never emits [object Object]', () => {
        const shapes: unknown[] = [
            { Rice: 'x' },
            { a: { nested: 'y' } },
            [{ a: 1 }],
        ];
        shapes.forEach((shape) => {
            expect(flattenDose(shape)).not.toContain('[object Object]');
        });
    });

    it('returns empty string for null, undefined and empty object', () => {
        expect(flattenDose(null)).toBe('');
        expect(flattenDose(undefined)).toBe('');
        expect(flattenDose({})).toBe('');
    });
});

describe('decodeComposition', () => {
    const valid = JSON.stringify({
        __fmt: 'gazette-v1',
        composition: [{ ingredient: 'Seaweed extract', content: '21' }],
        specifications: [{ parameter: 'pH', value: '3.0 - 5.0' }],
    });

    it('decodes a valid envelope', () => {
        const result = decodeComposition(valid);
        expect(result.kind).toBe('structured');
        if (result.kind === 'structured') {
            expect(result.composition).toHaveLength(1);
            expect(result.specifications[0].parameter).toBe('pH');
        }
    });

    it('treats legacy prose as text', () => {
        const result = decodeComposition('Contains 21% seaweed extract, 3% organic acid.');
        expect(result).toEqual({ kind: 'text', value: 'Contains 21% seaweed extract, 3% organic acid.' });
    });

    it('treats prose that merely starts with { as text', () => {
        const raw = '{not actually json, just a stray brace';
        expect(decodeComposition(raw)).toEqual({ kind: 'text', value: raw });
    });

    it('treats valid JSON without the format tag as text', () => {
        const raw = JSON.stringify({ composition: [], specifications: [] });
        expect(decodeComposition(raw)).toEqual({ kind: 'text', value: raw });
    });

    it('treats a tagged envelope with non-array members as text', () => {
        const raw = JSON.stringify({ __fmt: 'gazette-v1', composition: 'nope', specifications: null });
        expect(decodeComposition(raw)).toEqual({ kind: 'text', value: raw });
    });

    it('handles empty, null and non-string input without throwing', () => {
        expect(decodeComposition('')).toEqual({ kind: 'text', value: '' });
        expect(decodeComposition(null)).toEqual({ kind: 'text', value: '' });
        expect(decodeComposition(undefined)).toEqual({ kind: 'text', value: '' });
        expect(decodeComposition(42)).toEqual({ kind: 'text', value: '' });
    });
});

describe('encode/decode round-trip', () => {
    it('preserves a populated record', () => {
        const input = {
            composition: [
                { ingredient: 'Seaweed (Kappaphycus alvarezii) extract', content: '21' },
                { ingredient: 'Water', content: '76' },
            ],
            specifications: [{ parameter: 'Total carbohydrate', value: '7.50' }],
        };

        const result = decodeComposition(encodeComposition(input));
        expect(result.kind).toBe('structured');
        if (result.kind === 'structured') {
            expect(result.composition).toEqual(input.composition);
            expect(result.specifications).toEqual(input.specifications);
        }
    });

    it('encodes empty arrays to an empty string rather than a hollow envelope', () => {
        expect(encodeComposition({ composition: [], specifications: [] })).toBe('');
        expect(decodeComposition('')).toEqual({ kind: 'text', value: '' });
    });
});
