using System;

namespace FrameSyncGameFramework.Common.Math
{
    /// <summary>
    /// 定点数实现，避免浮点数精度问题
    /// </summary>
    public struct FixedPoint : IEquatable<FixedPoint>, IComparable<FixedPoint>
    {
        private const int FRACTION_BITS = 16;
        private const int FRACTION_MASK = 0xFFFF;
        private const long ONE = 1L << FRACTION_BITS;
        
        private readonly long rawValue;

        public FixedPoint(long rawValue)
        {
            this.rawValue = rawValue;
        }

        public FixedPoint(int value)
        {
            this.rawValue = value << FRACTION_BITS;
        }

        public static FixedPoint FromFloat(float value)
        {
            return new FixedPoint((long)(value * ONE));
        }

        public static FixedPoint FromDouble(double value)
        {
            return new FixedPoint((long)(value * ONE));
        }

        public float ToFloat()
        {
            return (float)rawValue / ONE;
        }

        public double ToDouble()
        {
            return (double)rawValue / ONE;
        }

        public int ToInt()
        {
            return (int)(rawValue >> FRACTION_BITS);
        }

        public static FixedPoint operator +(FixedPoint a, FixedPoint b)
        {
            return new FixedPoint(a.rawValue + b.rawValue);
        }

        public static FixedPoint operator -(FixedPoint a, FixedPoint b)
        {
            return new FixedPoint(a.rawValue - b.rawValue);
        }

        public static FixedPoint operator *(FixedPoint a, FixedPoint b)
        {
            long temp = a.rawValue * b.rawValue;
            return new FixedPoint(temp >> FRACTION_BITS);
        }

        public static FixedPoint operator /(FixedPoint a, FixedPoint b)
        {
            if (b.rawValue == 0)
                throw new DivideByZeroException();
            
            long temp = (a.rawValue << FRACTION_BITS) / b.rawValue;
            return new FixedPoint(temp);
        }

        public static bool operator ==(FixedPoint a, FixedPoint b)
        {
            return a.rawValue == b.rawValue;
        }

        public static bool operator !=(FixedPoint a, FixedPoint b)
        {
            return a.rawValue != b.rawValue;
        }

        public static bool operator <(FixedPoint a, FixedPoint b)
        {
            return a.rawValue < b.rawValue;
        }

        public static bool operator >(FixedPoint a, FixedPoint b)
        {
            return a.rawValue > b.rawValue;
        }

        public static bool operator <=(FixedPoint a, FixedPoint b)
        {
            return a.rawValue <= b.rawValue;
        }

        public static bool operator >=(FixedPoint a, FixedPoint b)
        {
            return a.rawValue >= b.rawValue;
        }

        public static FixedPoint operator -(FixedPoint value)
        {
            return new FixedPoint(-value.rawValue);
        }

        public static FixedPoint operator +(FixedPoint value)
        {
            return value;
        }

        public override bool Equals(object? obj)
        {
            return obj is FixedPoint point && Equals(point);
        }

        public bool Equals(FixedPoint other)
        {
            return rawValue == other.rawValue;
        }

        public override int GetHashCode()
        {
            return rawValue.GetHashCode();
        }

        public int CompareTo(FixedPoint other)
        {
            return rawValue.CompareTo(other.rawValue);
        }

        public override string ToString()
        {
            return ToFloat().ToString("F3");
        }

        public static readonly FixedPoint Zero = new FixedPoint(0);
        public static readonly FixedPoint One = new FixedPoint(ONE);
        public static readonly FixedPoint Half = new FixedPoint(ONE >> 1);
    }
}