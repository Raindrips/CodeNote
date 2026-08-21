import { describe, it, expect } from 'vitest';

describe('math', () => {
    it('add', () => {
        expect(10 + 20).toBeCloseTo(30, 0);
    });

    it('div', () => {
        expect(1 / 3).toBeCloseTo(0.33333, 5);
    });
});
