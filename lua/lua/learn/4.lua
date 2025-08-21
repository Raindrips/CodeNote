require("table-json")
-- 四、字符串处理 (31–40)
-- 写一个函数，判断字符串是否只包含数字。
local function is_digit(s)
    return s:match("^%d+$") ~= nil
end

-- 写一个函数，提取字符串中的所有数字并返回数组。
local function extract_nums(s)
    local res = {}
    for c in s:gmatch("%d+") do
        table.insert(res, tonumber(c))
    end
    return res
end
print("2", TableToJson(extract_nums("123abc456")))

-- 写一个函数，去掉字符串开头和结尾的空格。
local function trim(s)
    return s:match("^%s*(.-)%s*$")
end

-- 写一个函数，将字符串中的单词首字母大写。
local function capitalize(s)
    return s:gsub("(%w)(%w*)", function(a, b) return a:upper() .. b:lower() end)
end

-- 写一个函数，统计字符串中子串出现的次数。
local function count_sub(s, sub)
    local n = 0
    for _ in s:gmatch(sub) do n = n + 1 end
    return n
end

-- 写一个函数，实现字符串分割函数（类似 Python 的 split）。

-- 写一个函数，将数组拼接成字符串（类似 Python 的 join）。

-- 写一个函数，替换字符串中所有指定子串。

-- 写一个函数，判断字符串是否以某个子串开头。

-- 写一个函数，判断字符串是否以某个子串结尾。
