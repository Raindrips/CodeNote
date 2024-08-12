mytable = {} -- 普通表

mymetatable = {} -- 元表
-- 把 mymetatable 设为 mytable 的元表 
mytable2=setmetatable(mytable, mymetatable)

-- __index     表示索引重载,如果没有找到关键字则在__index内进行表的查找
local mytable2 = setmetatable({a = 10}, {__index = {a = 11, b = 22}})

-- __newindex 方法表示在key赋值时调用元方法,而不进行赋值,已存在的值则不会调用
local newtable = setmetatable({}, {
    __newindex = function(table, key, value)
      -- 可以使用rawset进行表的更新
      rawset(table, key, '"'..value..'"')
      print('new key--', table, key, value)
    end
})

-- __call 

function test1()
    mata = getmetatable(mytable2)
    for key, value in pairs(mata) do print(key, value) end
    for key, value in pairs(mytable2) do print(key, value) end
end

function test2()
    newtable.a = 10;
    newtable.b = 20;
    for key, value in pairs(newtable) do print(key, value) end

end

function test3()
    tb={a=1}
    mata={__index={a='hello',b='world'}}
    setmetatable(tb,mata)
    print(tb.a,tb.b)
    
end

local tableClass={}
local tableClass2={}
function tableClass:FN()
    self.a=0
end

-- test2()

test3()