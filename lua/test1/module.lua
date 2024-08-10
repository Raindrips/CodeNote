-- 文件名为 module.lua
module = {}

-- 定义一个公有属性
module.count = 0
-- 定义一个私有属性
local count=0

-- 定义一个函数
function module.func1()
    module.count = module.count + 1
    count=count+1
    print('module.count:'..module.count)
    print('count:'..count)
end

-- 定义一个私有函数
local function func2() print("这是一个私有函数！") end

-- 调用私有函数
function module.func3() func2() end

-- 返回模块
return module
