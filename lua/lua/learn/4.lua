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
-- sep 为 nil 或 "" 时按空白切分（连续空白视为分隔）；否则按字面分隔串分隔（plain）。
local function split(s, sep)
    if sep == nil or sep == "" then
        local res = {}
        for token in s:gmatch("%S+") do
            table.insert(res, token)
        end
        return res
    end
    local res = {}
    local start = 1
    local i, j = s:find(sep, start, true)
    while i do
        table.insert(res, s:sub(start, i - 1))
        start = j + 1
        i, j = s:find(sep, start, true)
    end
    table.insert(res, s:sub(start))
    return res
end

-- 写一个函数，将数组拼接成字符串（类似 Python 的 join）。
local function join(arr, sep)
    return table.concat(arr, sep or "")
end

-- 写一个函数，替换字符串中所有指定子串。
local function replace_all(s, old, new)
    local pat = old:gsub("([%^%$%(%)%%%.%[%]%*%+%-%?])", "%%%1")
    local rep = new:gsub("%%", "%%%%")
    return (s:gsub(pat, rep))
end

-- 写一个函数，判断字符串是否以某个子串开头。
local function starts_with(s, prefix)
    if prefix == "" then
        return true
    end
    return s:sub(1, #prefix) == prefix
end

-- 写一个函数，判断字符串是否以某个子串结尾。
local function ends_with(s, suffix)
    if suffix == "" then
        return true
    end
    local n = #suffix
    return #s >= n and s:sub(-n) == suffix
end


print("1", is_digit("1234abc"))
print("2", TableToJson(extract_nums("123abc456")))
print("3", TableToJson(split("  a  b\tc  ")))
print("4", TableToJson(split("a,,b", ",")))
print("5", join({ "a", "b", "c" }, "-"))
print("6", replace_all("foo_bar_foo", "foo", "baz"))
print("7", starts_with("hello", "hel"), starts_with("hello", "x"))
print("8", ends_with("hello", "llo"), ends_with("hello", "x"))
