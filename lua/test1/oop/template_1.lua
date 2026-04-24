local Class = {}
Class.__index = Class

function Class:new(x)
    local obj = setmetatable({x = x}, self)
    return obj
end

function Class:__tostring()
    return "Class x=" .. self.x
end

setmetatable(Class, {
    __call = function(cls, ...)
        return cls:new(...)
    end
})

-- 子类
local Child = setmetatable({}, {__index = Class})
Child.__index = Child

function Child:new(x, y)
    local obj = Class.new(self, x)
    obj.y = y
    return obj
end

-- 测试
local c = Child(10, 20)
print(c)