--- 检查该类是否有该方法
---@param obj table
---@param action string
---@return boolean
function can(obj, action)
    return type(obj) == "table" and type(obj[action]) == "function"
end

--- 安全调用对象的方法
-- @param obj 目标对象
-- @param methodName 方法名字符串
-- @param ... 传递给该方法的参数
function safelyCall(obj, methodName, ...)
    if type(obj) == "table" and type(obj[methodName]) == "function" then
        return obj[methodName](obj, ...) -- 注意这里用冒号语法的等价写法
    end
    return nil, "Method not found"
end
