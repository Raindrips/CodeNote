
Object={
  pub=10,
  _count=0  
}

-- 静态函数
Object.size=function ()
  Object._count=Object._count+1
  return Object._count
end

-- 创建新对象
function Object:new(o)
  o=o or {}
  setmetatable(o,self)
  self.__index=self
  self.pub=0
  self._count=0
  return o;
end

function Object:print ()
  print(self.pub,self._count)
end

function test1()
  Object._count=10
  print( Object.size())
  print( Object.size())
  print( Object.size())

  obj=Object:new(nil)
  obj2=Object:new(nil)
  obj.pub=10
  obj._count=5
  print(obj.pub,obj._count)
  print(obj2.pub,obj2._count)

  obj:print()
  obj2:print()
end

-- test1()
