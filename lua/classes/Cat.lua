local classes = require "classes"

local Animal = require "Animal"

-- 继承Animal
local Cat = classes.class(Animal)

--
function Cat:init(name, breed)
    -- 实现父类构造
    self.super:init(2, name)

    self.breed = breed
end

function Cat:meow()
    print("meow " .. self.name .. " meow " .. self.id)
end

-- override
function Cat:print()
    print("meow" .. self.name)
end

return Cat
