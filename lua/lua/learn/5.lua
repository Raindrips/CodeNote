-- 五、Lua 特性（函数 / 元表 / 协程） (41–50)
-- 写一个函数，接受可变参数，并返回参数的总和。
local function sum_n(...)
    local s = 0
    for index, value in ipairs({ ... }) do
        s = s + value;
    end
    return s
end
print("1", sum_n(1))

-- 写一个函数，返回多个值，并在调用处正确接收。
local function max_min(a, b)
    if a < b then return a, b else return b, a end
end

local mn, mx = max_min(3, 5)
print(mn, mx)

-- 写一个函数，使用闭包实现一个计数器。
local function counter()
    local n = 0
    return function()
        n = n + 1; return n
    end
end
local c = counter()
print(c(), c(), c())

-- 写一个函数，模拟面向对象（用 table + metatable）。
MyClass = {}
MyClass.__index = MyClass

function MyClass:new(a, b)
    local o = { a = a, b = b }
    setmetatable(o, self)
    return o
end

function MyClass:to_string()
    local str = '' .. self.a .. ',' .. self.b;
    return str
end

local mc = MyClass:new(1, 2)
print(mc:to_string())

-- 写一个函数，定义一个 Vector2 类，支持加法 + 运算符重载。
Vector2 = {}
Vector2.__index = Vector2
function Vector2:new(x, y)
    return
        setmetatable({ x = x, y = y }, self)
end

function Vector2.__add(a, b)
    return Vector2:new(a.x + b.x, a.y + b.y)
end

local v1 = Vector2:new(1, 2)
local v2 = Vector2:new(3, 4)
local v3 = v1 + v2
print(v3.x, v3.y)

-- 写一个函数，使用元表实现只读表（修改时报错）。
local function readonly(t)
    return setmetatable({}, {
        __index = t,
        __newindex = function(_, k, v) error("readonly!") end
    })
end
local t = readonly({ a = 1 })
print(t.a)
-- t.a = 2 -- 报错

-- 写一个函数，实现深度比较两个 table（支持嵌套）。
local function deep_equal(a, b)
    if type(a) ~= type(b) then return false end
    if type(a) ~= "table" then return a == b end
    for k, v in pairs(a) do if not deep_equal(v, b[k]) then return false end end
    for k, v in pairs(b) do if not deep_equal(v, a[k]) then return false end end
    return true
end

-- 写一个函数，写一个简单的迭代器，遍历数组。
local function iter(arr)
    local i = 0
    local n = #arr
    return function()
        i = i + 1
        if i <= n then return arr[i] end
    end
end
for v in iter({ 10, 20, 30 }) do io.write(v .. ' ') end
print()

-- 写一个函数，使用协程生成斐波那契数列（可逐次调用 coroutine.resume 得到下一个数）。
local function fib_gen()
    return coroutine.create(function()
        local a, b = 0, 1
        while true do
            a, b = b, a + b
            coroutine.yield(a)
        end
    end)
end

local co = fib_gen()
for i = 1, 8 do
    local _, val = coroutine.resume(co)
    io.write(val .. ' ')
end
print()

-- 写一个函数，实现生产者-消费者模型，使用协程传递数据。
local function producer()
    return coroutine.create(function()
        for i = 1, 100 do
            coroutine.yield(i)
        end
    end)
end


local function consumer(p)
    while true do
        local ok, val = coroutine.resume(p)
        if not ok or val == nil then break end
        io.write(val, " ")
    end
    print()
end

consumer(producer())
