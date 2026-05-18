local EventManager = {}
EventManager.__index = EventManager
local WeakTable={ __mode = "k" }
function EventManager.new()
    local self = setmetatable({}, EventManager)
    -- 使用弱表，防止对象被事件系统引用导致无法GC
    self.listeners = setmetatable({}, WeakTable)
    return self
end

--- 注册事件
---@param eventName string
---@param callback function
---@param target table
---@param priority number
function EventManager:on(eventName, callback, target, priority)
    priority = priority or 0

    if not self.listeners[eventName] then
        self.listeners[eventName] = {}
    end

    local list = self.listeners[eventName]

    table.insert(list, {
        callback = callback,
        target = target,
        priority = priority,
        once = false
    })

    -- 按优先级排序（高优先级先执行）
    table.sort(list, function(a, b)
        return a.priority > b.priority
    end)
end

-- 注册一次性事件
function EventManager:once(eventName, callback, target, priority)
    priority = priority or 0

    if not self.listeners[eventName] then
        self.listeners[eventName] = {}
    end

    local list = self.listeners[eventName]

    table.insert(list, {
        callback = callback,
        target = target,
        priority = priority,
        once = true
    })

    table.sort(list, function(a, b)
        return a.priority > b.priority
    end)
end

-- 移除事件
function EventManager:off(eventName, callback, target)
    local list = self.listeners[eventName]
    if not list then return end

    for i = #list, 1, -1 do
        local v = list[i]
        if v.callback == callback and v.target == target then
            table.remove(list, i)
        end
    end
end

-- 触发事件
function EventManager:emit(eventName, ...)
    local list = self.listeners[eventName]
    if not list then return end

    -- 复制一份，避免遍历时修改
    local temp = {}
    for i = 1, #list do
        temp[i] = list[i]
    end

    for _, v in ipairs(temp) do
        if v.target then
            v.callback(v.target, ...)
        else
            v.callback(...)
        end

        -- once 处理
        if v.once then
            self:off(eventName, v.callback, v.target)
        end
    end
end

-- 清空某个事件
function EventManager:clear(eventName)
    self.listeners[eventName] = nil
end

return EventManager