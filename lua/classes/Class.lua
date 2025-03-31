function Class(name, base, methods)
    local c = {}
    if type(base) == "table" and not methods then
        -- 如果只提供了 name 和 methods
        methods = base
        base = nil
    end
    if base then
        setmetatable(c, { __index = base })
    end
    if methods then
        for k, v in pairs(methods) do
            c[k] = v
        end
    end

    -- 使 c 可调用以创建实例
    c.__call = function(self, ...)
        local instance = {}
        setmetatable(instance, { __index = self })
        if c.init then
            c.init(instance, ...)
        end
        return instance
    end
    setmetatable(c, { __call = c.__call })

    -- 添加 is_a 方法以检查实例是否属于某个类
    c.is_a = function(self, cls)
        local mt = getmetatable(self)
        while mt do
            if mt == cls then return true end
            mt = getmetatable(mt)
        end
        return false
    end

    c.name = name
    return c
end