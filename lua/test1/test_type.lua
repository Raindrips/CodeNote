print("Hello World")

local a = 1
local b = "abc"
local c = {}
local d = print
local e = nil
local f = false

local Class = { c = 10, d = 20 }
Class.__index = Class;
function Class:new()
    return setmetatable({ a = 10, b = 'str' }, self)
end

print(type(a))                                -- number
print(type(b))                                -- string
print(type(c))                                -- table
print(type(d))                                -- function
print(type(e))                                -- nil
print(type(f))                                -- boolean
print(type(coroutine.create(function() end))) --thread
