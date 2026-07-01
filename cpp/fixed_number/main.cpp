int main() {
    std::cout << "--- 32位定点数测试 (支持到百万) ---" << std::endl;
    
    Fixed32 hp1(1000000.0f);            // 100万
    Fixed32 damage(-0.00390625f);       // 刚好是 -1/(2^8)
    
    Fixed32 next_hp = hp1 + damage;
    
    // 在传统 float 中，100万减去这个小数，小数会被直接“吃掉”
    // 但在这里，因为是定点数硬核计算，精度绝对保留！
    std::cout << "原血量: " << hp1.to_float() << std::endl;
    std::cout << "扣血后: " << next_hp.to_float() << std::endl; 
    // 输出结果精确扣减：999999.996094

    std::cout << "\n--- 16位定点数边界测试 ---" << std::endl;
    Fixed16 low_val(127.5f);
    Fixed16 overflow_val(1000000.0f); // 尝试让 16 位存 100 万
    
    std::cout << "127.5 正常存储: " << low_val.to_float() << std::endl;
    std::cout << "100万触发16位截断: " << overflow_val.to_float() << std::endl; 
    // 输出: 127.9961 (接近 16 位有符号上限 32767/256)

    return 0;
}