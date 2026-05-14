-- 三目运算
local function ternary(cond, yes, no)
    if cond then return yes else return no end
end

-- 输出字符串
local function convert_str(arr)
    local str = "{"
    local n = #arr;
    for i, value in ipairs(arr) do
        local c = ternary(i == n, '', ',')
        str = str .. value .. c
    end
    str = str .. '}'
    return str
end




-- 给定一个数组，去重并返回新的数组。
local unique = function(arr)
    local seen, res = {}, {}
    for index, value in ipairs(arr) do
        if not seen[value] then
            seen[value] = true
            table.insert(res, value)
        end
    end
    return res
end
print("1", convert_str(unique({ 1, 2, 3, 4, 4, 5, 1, 2, 3 })))


-- 写一个函数，实现数组排序（自己写冒泡/快速排序，不调用 table.sort）。
local function bubble_sort(arr)
    local n = #arr
    for i = 1, n do
        for j = 1, n - i do
            if arr[j] > arr[j + 1] then
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
            end
        end
    end
    return arr
end

print("2", convert_str(bubble_sort({ 1, 7, 3, 4, 2, 2, 7, 3, 12 })))

-- 给定两个数组，返回它们的交集。
local function intersect(a, b)
    local set, res = {}, {}
    for _, v in ipairs(a) do
        set[v] = true
    end
    for _, v in ipairs(b) do
        if set[v] then
            table.insert(res, v)
        end
    end
    return res
end
print("3", convert_str(intersect({ 1, 2, 3, 4 }, { 3, 4, 5, 6 })))

-- 给定两个数组，返回它们的并集。
local function union(a, b)
    local set, res = {}, {}
    for _, v in ipairs(a) do
        if not set[v] then
            set[v] = true
            table.insert(res, _)
        end
    end
    for _, v in ipairs(b) do
        if not set[v] then
            set[v] = true
            table.insert(res, v)
        end
    end
    return res
end

print("4", convert_str(union({ 1, 2, 3 }, { 3, 4, 5 })))

-- 写一个函数，找出数组中的最大值和最小值。
local function min_max(arr)
    local min, max = arr[1], arr[1]
    for i = 1, #arr do
        if min < arr[i] then
            min = arr[i]
        end
        if max > arr[i] then
            max = arr[i]
        end
    end
    return min, max
end
print("6", min_max({ 1, 2, 3, 4, 5 }))

-- 写一个函数，计算数组中所有元素的平均值。
local function avg(arr)
    local s = 0
    for _, v in ipairs(arr) do s = s + v end
    return s / #arr
end

-- 写一个函数，将一个数组反转。
local function reverse(arr)
    local n = #arr
    for i = 1, math.floor(n / 2) do
        arr[i], arr[n - i + 1] = arr[n - i + 1], arr[i]
    end
end

-- 写一个函数，移除数组中所有的 nil 元素。
local function remove_nil(arr)
    local res = {}
    for _, v in ipairs(arr) do
        if v ~= nil then table.insert(res, v) end
    end
    return res
end

-- 写一个函数，找出数组中第 k 大的元素。
local function kth_largest(arr, k)
    table.sort(arr, function(a, b) return a > b end)
    return arr[k]
end

-- 写一个函数，判断两个数组是否相等（内容完全相同）。
local function equal(a, b)
    if #a ~= #b then return false end
    for i = 1, #a do if a[i] ~= b[i] then return false end end
    return true
end
