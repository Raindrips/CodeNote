if not require('mod') then
  print('require  mod error')
end

local module=require('module')
local module2=require('module')


print (PlanA())
print(PlanB())
print(PlanB())

module.func1();
module.func1();

module2.func1();
module2.func1();


