local class = require 'middleclass'

print(class)

local Animal = class('Animal')
-- 初始化后续可以通过new来进行分配
function Animal:initialize(id, name)
    self.id = id
    self.name = name
    Animal.create_count()
end

function Animal:speak()
    print(self.id, self.name)
end

-- 静态变量
function Animal.create_count()
    if Animal.count == nil then
        Animal.count = 0;
    end
    Animal.count = Animal.count + 1
end

-- 继承
local Dog = class('Dog', Animal)

function Dog:initialize(id, name, type)
    Animal.initialize(self, id, name) --调用父类方法
    self.type = type;
end

function Dog:speak()
    print(self.id, self.name, self.type)
end

-- 多态
function trySpeak(obj)
    if type(obj) == 'table' and type(obj.speak) == "function" then
        obj:speak()
    end
end

local ani = Animal:new(1, "hello")
ani:speak()
local ani2 = Animal:new(2, "world")
ani2:speak()

local dog = Dog:new(2, "qwe", "hsq")
dog:speak()

trySpeak(dog)
trySpeak({ 1, 2, 3 })

print(Animal.count)
