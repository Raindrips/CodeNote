local classes = require "classes"

-- 创建类
local Animal = classes.class()

-- static数据
Animal.NOISE_1 = 0
-- 私有static数据
local idCount=0;

-- 初始化本地变量
function Animal:init(id,name)
  self.id=id
  self.name = name
  idCount= idCount+ 1
end

-- 操作数据
function Animal:print()
  print(self.id,self.name);
end


return Animal
