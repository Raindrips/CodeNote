// FixedPoint.test.ts
import { describe, it, expect } from 'vitest';
import { FixedPoint } from '../dist/FixedPoint/bin';

describe('FixedPoint', () => {
    it('转换为浮点数', () => {
        const fp = new FixedPoint(3.14159);
        expect(fp.toNumber()).toBeCloseTo(3.14159, 5);
    });

    it('加法运算', () => {
        const a = new FixedPoint(1.5);
        const b = new FixedPoint(2.25);
        const result = a.add(b);
        expect(result.toNumber()).toBeCloseTo(3.75, 5);
    });

    it('乘法运算', () => {
        const a = new FixedPoint(2.0);
        const b = new FixedPoint(3.5);
        const result = a.mul(b);
        expect(result.toNumber()).toBeCloseTo(7.0, 5);
    });

    it('除法运算', () => {
        const a = new FixedPoint(7.0);
        const b = new FixedPoint(2.0);
        const result = a.div(b);
        expect(result.toNumber()).toBeCloseTo(3.5, 5);
    });
});
