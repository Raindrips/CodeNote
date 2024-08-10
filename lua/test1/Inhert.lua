MyClass = require('MyClass')
Component = {name = ''}

function Component:new()
    local o = MyClass:new(0,'inherts')
    setmetatable(o, self)
    self.__index=self
    self.name='name'
    return o
end


function Component:inherts()
  
end


function test1()
  local com=Component:new();
  com:print()
  print(com.id,com.key,com.name)
end
test1()