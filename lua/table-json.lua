function TableToJson(tbl)
    local result = {}
    local function serialize(t, res)
        if type(t) == "table" then
            local is_array = #t > 0
            table.insert(res, is_array and "[" or "{")
            local first = true
            if is_array then
                for i, v in ipairs(t) do
                    if not first then table.insert(res, ",") end
                    serialize(v, res)
                    first = false
                end
            else
                for k, v in pairs(t) do
                    if not first then table.insert(res, ",") end
                    table.insert(res, string.format("\"%s\":", tostring(k)))
                    serialize(v, res)
                    first = false
                end
            end
            table.insert(res, is_array and "]" or "}")
        elseif type(t) == "string" then
            table.insert(res, string.format("\"%s\"", t))
        elseif type(t) == "number" or type(t) == "boolean" then
            table.insert(res, tostring(t))
        elseif t == nil then
            table.insert(res, "null")
        else
            error("Unsupported type: " .. type(t))
        end
    end
    serialize(tbl, result)
    return table.concat(result)
end

function PrintTable(tbl, indent)
    if type(tbl) ~= "table" then
        print(tbl)
        return
    end
    indent = indent or 0
    local indentStr = string.rep("  ", indent) -- 缩进空格
    for k, v in pairs(tbl) do
        if type(v) == "table" then
            print(indentStr .. k .. ":")
            PrintTable(v, indent + 1) -- 递归打印嵌套表格
        else
            print(indentStr .. k .. ": " .. tostring(v))
        end
    end
end

local function ternary(cond, yes, no)
    if cond then return yes else return no end
end
function Convert_str(arr)
    local str = "{"
    local n = #arr;
    for i, value in ipairs(arr) do
        local c = ternary(i == n, '', ',')
        str = str .. value .. c
    end
    str = str .. '}'
    return str
end

-- 测试
local tbl = {
    name = "Charlie",
    age = 30,
    hobbies = { "coding", "music" },
    active = true,
    address = { city = "London" },
    other = {
        a = {
            a1 = 0,
            a2 = 2
        },
        b = {
            b1 = 0,
            b2 = 2
        }
    }
}

-- print(TableToJson(tbl))
-- PrintTable(tbl)
-- PrintTable(100)
