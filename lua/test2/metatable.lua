local MyClass1={
  id=1,
  key='hello world'
}
MyClass1.__index=MyClass1;
function MyClass1:new()
    local o={}
    setmetatable(o,self)
    return o;
end

function MyClass1:print()
   for key, value in pairs(self) do
    print(key,value);
   end
end


local my_class=MyClass1:new()
local my_class2=MyClass1:new()
TABLE =getmetatable(my_class)

my_class.id=10;   --创建了一个新的属性,没有再使用元表内容了
my_class.key='world';
print(my_class.id,my_class.key);
TABLE.id=20  --元表变动
TABLE.key="hello" 
print(my_class2.id,my_class2.key); --访问元表的内容


print(TABLE.id,TABLE.key);
print (TABLE, MyClass1) --两者相等
