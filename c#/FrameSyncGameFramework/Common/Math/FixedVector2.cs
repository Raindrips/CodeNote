using System;

namespace FrameSyncGameFramework.Common.Math
{
    /// <summary>
    /// 2D定点数向量，用于确定性物理计算
    /// </summary>
    public struct FixedVector2 : IEquatable<FixedVector2>
    {
        public FixedPoint X { get; set; }
        public FixedPoint Y { get; set; }

        public FixedVector2(FixedPoint x, FixedPoint y)
        {
            X = x;
            Y = y;
        }

        public FixedVector2(float x, float y)
        {
            X = FixedPoint.FromFloat(x);
            Y = FixedPoint.FromFloat(y);
        }

        public static FixedVector2 operator +(FixedVector2 a, FixedVector2 b)
        {
            return new FixedVector2(a.X + b.X, a.Y + b.Y);
        }

        public static FixedVector2 operator -(FixedVector2 a, FixedVector2 b)
        {
            return new FixedVector2(a.X - b.X, a.Y - b.Y);
        }

        public static FixedVector2 operator *(FixedVector2 vector, FixedPoint scalar)
        {
            return new FixedVector2(vector.X * scalar, vector.Y * scalar);
        }

        public static FixedVector2 operator *(FixedPoint scalar, FixedVector2 vector)
        {
            return vector * scalar;
        }

        public static FixedVector2 operator /(FixedVector2 vector, FixedPoint scalar)
        {
            return new FixedVector2(vector.X / scalar, vector.Y / scalar);
        }

        public static FixedVector2 operator -(FixedVector2 vector)
        {
            return new FixedVector2(-vector.X, -vector.Y);
        }

        public FixedPoint Magnitude()
        {
            var squared = X * X + Y * Y;
            return Sqrt(squared);
        }

        public FixedPoint SqrMagnitude()
        {
            return X * X + Y * Y;
        }

        public FixedVector2 Normalized()
        {
            var magnitude = Magnitude();
            if (magnitude == FixedPoint.Zero)
                return Zero;
            
            return this / magnitude;
        }

        public static FixedPoint Dot(FixedVector2 a, FixedVector2 b)
        {
            return a.X * b.X + a.Y * b.Y;
        }

        public static FixedPoint Cross(FixedVector2 a, FixedVector2 b)
        {
            return a.X * b.Y - a.Y * b.X;
        }

        public static FixedPoint Distance(FixedVector2 a, FixedVector2 b)
        {
            return (a - b).Magnitude();
        }

        public static FixedPoint Sqrt(FixedPoint value)
        {
            if (value <= FixedPoint.Zero)
                return FixedPoint.Zero;

            FixedPoint x = value;
            FixedPoint y = FixedPoint.One;
            
            // 牛顿法求平方根
            for (int i = 0; i < 10; i++)
            {
                y = (x + value / x) / FixedPoint.FromFloat(2f);
                if (x - y < FixedPoint.FromFloat(0.001f))
                    break;
                x = y;
            }
            
            return y;
        }

        public static FixedVector2 Lerp(FixedVector2 a, FixedVector2 b, FixedPoint t)
        {
            return a + (b - a) * t;
        }

        public override bool Equals(object? obj)
        {
            return obj is FixedVector2 vector && Equals(vector);
        }

        public bool Equals(FixedVector2 other)
        {
            return X.Equals(other.X) && Y.Equals(other.Y);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(X, Y);
        }

        public override string ToString()
        {
            return $"({X}, {Y})";
        }

        public static readonly FixedVector2 Zero = new FixedVector2(FixedPoint.Zero, FixedPoint.Zero);
        public static readonly FixedVector2 One = new FixedVector2(FixedPoint.One, FixedPoint.One);
        public static readonly FixedVector2 Up = new FixedVector2(FixedPoint.Zero, FixedPoint.One);
        public static readonly FixedVector2 Down = new FixedVector2(FixedPoint.Zero, -FixedPoint.One);
        public static readonly FixedVector2 Left = new FixedVector2(-FixedPoint.One, FixedPoint.Zero);
        public static readonly FixedVector2 Right = new FixedVector2(FixedPoint.One, FixedPoint.Zero);
    }
}