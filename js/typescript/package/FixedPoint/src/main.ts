// FixedPoint.ts
export class FixedPoint {
    private value: bigint; // 用 bigint 存储，避免精度丢失
    private static readonly FRACTION_BITS = 16n;
    private static readonly SCALE = 1n << FixedPoint.FRACTION_BITS; // 2^16

    constructor(num: number) {
        this.value = BigInt(Math.round(num * Number(FixedPoint.SCALE)));
    }

    // 转回普通浮点数
    toNumber(): number {
        return Number(this.value) / Number(FixedPoint.SCALE);
    }

    // 加法
    add(other: FixedPoint): FixedPoint {
        const result = new FixedPoint(0);
        result.value = this.value + other.value;
        return result;
    }

    // 减法
    sub(other: FixedPoint): FixedPoint {
        const result = new FixedPoint(0);
        result.value = this.value - other.value;
        return result;
    }

    // 乘法
    mul(other: FixedPoint): FixedPoint {
        const result = new FixedPoint(0);
        result.value = (this.value * other.value) / FixedPoint.SCALE;
        return result;
    }

    // 除法
    div(other: FixedPoint): FixedPoint {
        const result = new FixedPoint(0);
        result.value = (this.value * FixedPoint.SCALE) / other.value;
        return result;
    }
}
