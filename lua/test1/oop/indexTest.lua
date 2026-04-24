local MyClass = {}

function MyClass:new()
    local o = { a = 1, b = 2 }
    MyClass.__index = MyClass
    setmetatable(o, self)
    return o
end

function MyClass:print()
    print(self.a, MyClass.b)
end

local a = MyClass:new()
print(a.a, a.b);
a:print()
