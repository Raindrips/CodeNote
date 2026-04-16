MyClass = {}

-- 创建构造函数
function MyClass:new(id, key)
  MyClass.__index = MyClass
  --创建一个新的表,并指向自己
  local o = { id = id, key = key }
  setmetatable(o, self)
  return o
end

--定义函数
function MyClass:print()
  -- for key, value in pairs(self) do
  --   print(key,value)
  -- end
  print('id=' .. self.id .. ' key=' .. self.key)
end

-- 运算符重载
function MyClass:__add(other)
  return MyClass:new(self.id + other.id, self.key .. other.key)
end

function MyClass:__eq(other)
  return self.id == other.id
end

return MyClass
