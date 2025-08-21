require("table-json")
-- 三、字典 / table (21–30)

-- 写一个函数，统计一句话中每个单词出现的次数。
local function word_count(s)
    local t = {}
    for w in s:gmatch("%w+") do
        t[w] = (t[w] or 0) + 1
    end
    return t
end
print("1", TableToJson(word_count("hello world lua!")))

-- 写一个函数，将字典按 value 大小排序。
function sort_by_value(tbl)
    local arr = {}
    for key, value in pairs(tbl) do
        table.insert(arr, { key, value })
    end
    table.sort(arr, function(a, b)
        return a[2] - b[2]
    end)
    return arr
end

print("2", TableToJson(sort_by_value({ a = 3, b = 1, c = 2 })))

-- 写一个函数，合并两个字典（后者覆盖前者相同 key）。
local merge = function(tb_1, tb_2)
    local res = {}
    for key, value in pairs(tb_1) do
        res[key] = value
    end
    for key, value in pairs(tb_2) do
        res[key] = value
    end
    return res
end
print("3", TableToJson(merge({ a = 1, b = 2, c = 3 }, { b = 4, c = 5, d = 6 })))

-- 写一个函数，实现字典的浅拷贝。
local table_clone = function(tb_1)
    local res = {}
    for key, value in pairs(tb_1) do
        res[key] = value
    end
    return res;
end

-- 写一个函数，实现字典的深拷贝（递归）。
local function deep_copy(t)
    if type(t) ~= "table" then return t end
    local res = {}
    for k, v in pairs(t) do res[k] = deep_copy(v) end
    return res
end

-- 写一个函数，统计一段文本中每个字符的频率。
local function word_count(s)
    local count = {}
    for c in s:gmatch(".") do
        count[c] = (count[c] or 0) + 1
    end
    return count
end
print("6", TableToJson(word_count("aa,bcccdddd")))
-- 写一个函数，找出字典中 value 最大的 key。
local function max_value(tbl)
    local key = nil
    for k, v in pairs(tbl) do
        if key == nil or v > tbl[key] then
            key = k
        end
    end
    return key
end
print("7", max_value({ a = 3, b = 5, c = 9, d = 4 }))

-- 写一个函数，删除字典中所有 value 为 nil 的键值对。
local function clean(tbl)
    for k, v in pairs(tbl) do
        if v == nil then
            tbl[k] = nil --删除key
        end
    end
    return tbl
end
print("8", TableToJson(clean({ a = 1, nil, b = 2, c = 3 })))
-- 写一个函数，翻转字典（key 和 value 交换）。
local function invert(tbl)
    local res = {}
    for k, v in pairs(tbl) do res[v] = k end
    return res
end

-- 写一个函数，判断两个字典是否相等。
local function dict_equal(a, b)
    for k, v in pairs(a) do if b[k] ~= v then return false end end
    for k, v in pairs(b) do if a[k] ~= v then return false end end
    return true
end

print("10", dict_equal({ [1] = 2, [3] = 4, [2] = 3, }, { 2, 3, 4 }))
