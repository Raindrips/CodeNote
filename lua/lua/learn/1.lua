--[==[


]==]

-- 一、基础语法与控制流 (1–10)
-- 写一个函数，判断一个数是否为质数。
local is_prime = function(n)
    if n < 2 then
        return false
    end
    for i = 2, math.floor(math.sqrt(n)) do
        if n % i == 0 then
            return false
        end
    end
    return true
end

print('1', is_prime(17))

-- 写一个函数，计算斐波那契数列的第 n 项。
local fib = function(n)
    if n <= 1 then
        return n;
    end
    local step = { 1, 1 }

    for i = 3, n do
        step[i] = step[i - 1] + step[i - 2]
    end
    return step[n];
end
print('2', fib(5))


-- Lua 中没有 ++ 运算符，写一个函数模拟自增操作。
local inc = function(n)
    return n + 1;
end
print('3', inc(2));
-- 写一个函数，统计一个字符串中大写字母、小写字母、数字和其他字符的数量。
local count_char = function(s)
    local upper, lower, digit, other = 0, 0, 0, 0
    for c in s:gmatch(".") do
        if c:match("%u") then
            upper = upper + 1
        elseif c:match("%l") then
            lower = lower + 1
        elseif c:match("%d") then
            digit = digit + 1
        else
            other = other + 1
        end
    end
    return upper, lower, digit, other
end
print('4', count_char("Hello World 123"))

-- 写一个函数，反转一个字符串。
local str_reverser = function(s)
    return s:reverse()
end
print('5', str_reverser("123456"))

-- 写一个函数，判断一个字符串是否为回文。
local function is_palindrome(s)
    return s == s:reverse()
end

print('6', is_palindrome("level"))

-- 写一个函数，统计 1 到 n 的和（要求使用递归实现）。
local function sum_n(n)
    if n == 1 then return 1 end
    return n + sum_n(n - 1)
end

print(sum_n(10)) -- 55

-- 写一个函数，打印九九乘法表。
local write9x9 = function()
    for i = 1, 9, 1 do
        for j = 1, i do
            io.write(j .. "x" .. i .. "=" .. i * j .. "\t")
        end
        io.write('\n')
    end
end
write9x9();

-- 写一个函数，判断一个数是否为“水仙花数”。
local get_armstrong = function()
    for i = 100, 999 do
        local s, tmp = 0, tostring(i)
        local len = #tmp
        for c in tmp:gmatch("%d") do
            s = s + tonumber(c) ^ len
        end
        if s == i then
            return i
        end
    end
    return -1
end
print('9', get_armstrong())


-- 写一个函数，打印 Pascal 三角形（杨辉三角）。
local pascal = function(n)
    local t = { { 1 } }
    for i = 2, n do
        t[i] = { 1 }
        for j = 2, i - 1 do
            t[i][j] = t[i - 1][j - 1] + t[i - 1][j]
        end
        t[i][i] = 1
    end
    return t
end
local tri = pascal(5)
for i = 1, #tri do
    for j = 1, #tri[i] do io.write(tri[i][j] .. " ") end
    print()
end
pascal(4)

-- tostring(n) 数字转字符串
-- tonumber(c) 字符串转数字
