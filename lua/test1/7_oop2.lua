MyClass=require('MyClass')

function test1()

  local mc=MyClass:new(1,'MyClass')
  local mc1=MyClass:new(2,'hello')
  local mc2=MyClass:new(3,'world')

  mc:print()
  mc1:print()
  mc2:print()
  print(mc.id,mc.key)
  print(mc1.id,mc1.key)
  print(mc2.id,mc2.key)
end


test1()
