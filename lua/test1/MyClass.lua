MyClass={
  id=0,
  key=''
}

-- 创建构造函数
function MyClass:new(id,key)
  --创建一个新的表,并指向自己
  local o={id=id,key=key}
  setmetatable(o,{__index=self})
  return o
end

--定义函数
function MyClass:print()
  -- for key, value in pairs(self) do
  --   print(key,value)
  -- end
  print('id='..self.id..' key='..self.key)
end

return MyClass