#include <iostream>
#include <cmath>
#include <cstdint>

// ==========================================
// 1. 32位定点数类：完美支持 -100万 到 +100万
// ==========================================
class Fixed32 {
private:
    int32_t raw_value; // 底层整数存储
    static const int SHIFT = 8; // 左移 8 位，相当于乘以 256
    static const int SCALE = 1 << SHIFT;

public:
    Fixed32() : raw_value(0) {}
    
    // 从浮点数构造
    Fixed32(float v) {
        raw_value = static_cast<int32_t>(roundf(v * SCALE));
    }

    // 转换为浮点数（用于显示或外部计算）
    float to_float() const {
        return static_cast<float>(raw_value) / SCALE;
    }

    // 运算符重载：加法
    Fixed32 operator+(const Fixed32& other) const {
        Fixed32 result;
        result.raw_value = this->raw_value + other.raw_value;
        return result;
    }

    // 运算符重载：减法
    Fixed32 operator-(const Fixed32& other) const {
        Fixed32 result;
        result.raw_value = this->raw_value - other.raw_value;
        return result;
    }

    // 比较运算符（由于底层是整数，比较绝对精准，不会有浮点数误差）
    bool operator==(const Fixed32& other) const { return this->raw_value == other.raw_value; }
    bool operator<(const Fixed32& other) const { return this->raw_value < other.raw_value; }
    bool operator>(const Fixed32& other) const { return this->raw_value > other.raw_value; }
};

// ==========================================
// 2. 16位定点数类：注意！最大只能支持到 127
// ==========================================
class Fixed16 {
private:
    int16_t raw_value; 
    static const int SHIFT = 4;
    static const int SCALE = 1 << SHIFT;

public:
    Fixed16() : raw_value(0) {}
    
    Fixed16(float v) {
        // 带有边界裁剪，防止 16 位整数溢出崩溃
        float scaled = roundf(v * SCALE);
        if (scaled > 32767.0f) scaled = 32767.0f;
        if (scaled < -32768.0f) scaled = -32768.0f;
        raw_value = static_cast<int16_t>(scaled);
    }

    float to_float() const {
        return static_cast<float>(raw_value) / SCALE;
    }

    Fixed16 operator+(const Fixed16& other) const {
        Fixed16 result;
        result.raw_value = this->raw_value + other.raw_value;
        return result;
    }

    bool operator==(const Fixed16& other) const { return this->raw_value == other.raw_value; }
};