local MyClass = require('MyClass')

local mc = MyClass:new(1, "a")

local mc2 = MyClass:new(10, "ddd")

print(mc.id, mc.key)
mc2:print()

local mc3=mc+mc2
-- local mc3 = mc:__add(mc2)

mc3:print()
mc.id=11
print(mc3==mc)

val=mc3()
print(val[1],val[2])
