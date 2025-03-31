local Animal = require "Animal"
local Cat = require "Cat"

local anim=Animal.new(1,"name")
anim:print()

local cat=Cat.new(2,"Cat")

cat:meow()
cat:print()

