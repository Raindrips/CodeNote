-- class.lua
local function Class(base)
    local cls = {}

    -- 继承
    if base then
        setmetatable(cls, { __index = base })
        cls.super = base
    end

    cls.__index = cls

    -- 构造函数（可 override）
    function cls:ctor() end

    -- new
    function cls:new(...)
        local obj = setmetatable({}, cls)
        obj:ctor(...)
        return obj
    end

    -- super 调用（核心）
    function cls:super_call(method, ...)
        local super = cls.super
        if not super then
            error("no super class")
        end

        local fn = super[method]
        if not fn then
            error("super method not found: " .. method)
        end

        return fn(self, ...)
    end

    -- mixin
    function cls:mixin(...)
        for _, mix in ipairs({...}) do
            for k, v in pairs(mix) do
                if k ~= "__index" then
                    self[k] = v
                end
            end
        end
    end

    -- tostring 默认实现（可 override）
    function cls:__tostring()
        return "<Class instance>"
    end

    -- 让 Class 可调用：Class(...)
    setmetatable(cls, {
        __call = function(_, ...)
            return cls:new(...)
        end
    })

    return cls
end

return Class
