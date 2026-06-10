local SetOfGroups = {}
SetOfGroups.__index = SetOfGroups

-- 创建一个新的集合
function SetOfGroups.new()
    return setmetatable({groups = {}}, SetOfGroups)
end

-- 检查两个对象组是否相同（引用相同）
local function groupsEqual(group1, group2)
    if #group1 ~= #group2 then
        return false
    end
    for i = 1, #group1 do
        if group1[i] ~= group2[i] then
            return false
        end
    end
    return true
end

-- 插入一个对象组，如果已经存在则返回 false，否则插入并返回 true
function SetOfGroups:insert(group)
    for _, existingGroup in ipairs(self.groups) do
        if groupsEqual(existingGroup, group) then
            return false
        end
    end
    table.insert(self.groups, group)
    return true
end

-- 返回所有对象组
function SetOfGroups:getAll()
    return self.groups
end

return SetOfGroups