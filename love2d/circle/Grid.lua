local SetOfGroups = require('SetOfGroup')
local Grid = {
}
Grid.__index = Grid;

local TIMES = 3

local function distance(circle1, circle2)
    local dx = circle1.x - circle2.x
    local dy = circle1.y - circle2.y
    local distance = dx * dx + dy * dy
    local range = math.pow(circle1.r + circle2.r, 2)
    return distance < range
end

local function getPos(self, x, y)
    local xx = math.floor(x / self.cellSize)
    local yy = math.floor(y / self.cellSize)
    return xx, yy
end

local function getCell(self, x, y, r)
    local left, right, up, down =
        x - r, x + r, y + r, y - r
    local minX = math.floor(left / self.cellSize)
    local maxX = math.floor(right / self.cellSize)
    local minY = math.floor(down / self.cellSize)
    local maxY = math.floor(up / self.cellSize)

    local arr = {}
    local idx = 1;
    for cx = minX, maxX do
        for cy = minY, maxY do
            arr[idx] = { x = cx, y = cy }
            idx = idx + 1
        end
    end
    return arr;
end

local function setIndex(self, x, y, o)
    if self.cells[y] == nil then
        self.cells[y] = {}
    end
    if self.cells[y][x] == nil then
        self.cells[y][x] = {}
    end
    table.insert(self.cells[y][x], o)
end

local function getIndex(self, x, y)
    if self.cells[y] == nil then
        return nil
    end
    return self.cells[y][x];
end

---@param gridSize number
---@param cellSize number
---@return table
function Grid.new(gridSize, cellSize)
    local o = { gridSize = gridSize, cellSize = cellSize, cells = {}, keys = {}, objects = {} }
    setmetatable(o, Grid)
    return o;
end

function Grid.clear(self)
    self.cells = {}
    self.keys = {}
    self.objects = {}
end

function Grid.addObject(self, o)
    table.insert(self.objects, o)
end

function Grid.removeObject(self, o)
    for i = #self.objects, 1, -1 do
        if self.objects[i] == o then
            table.remove(self.objects, i)
            break
        end
    end
end

function Grid.rebuild(self)
    self.cells = {}
    self.keys = {}
    for i = 1, #self.objects do
        self:setKeys(self.objects[i])
    end
end

function Grid.setKeys(self, o)
    local cellArr = getCell(self, o.x, o.y, o.r)
    self.keys[o] = cellArr;

    for i = 1, #cellArr do
        local pos = cellArr[i];
        setIndex(self, pos.x, pos.y, o);
    end
end

function Grid.getKeys(self, o)
    if o == nil then
        print('Grid.getKeys args is null')
    end
    return self.keys[o]
end

function Grid.getNeighbors(self, circle)
    local set = {}
    if circle == nil then
        print('Grid.getNeighbors obj is nil')
        return set
    end
    local x, y = getPos(self, circle.x, circle.y)
    for iy = y - 1, y + 1, 1 do
        for ix = x - 1, x + 1, 1 do
            local o = getIndex(self, ix, iy)
            if (o ~= nil and set[o] == nil) then
                set[o] = true
            end
        end
    end
    return set
end

function Grid.detectCollisions(self)
    local set_group = SetOfGroups.new()
    -- 获取所有碰撞体
    for circleA, posList in pairs(self.keys) do
        for i = 1, #posList, 1 do
            -- 通过网格粗筛
            local px = posList[i].x
            local py = posList[i].y
            for xx = px, px + 1 do
                for yy = py, py + 1 do
                    local obj_list = getIndex(self, xx, yy)
                    -- 碰撞体检测
                    if obj_list ~= nil then
                        for i = 1, #obj_list do
                            local circleB = obj_list[i]
                            --判断距离且不能是自己,
                            if circleA ~= circleB and
                                distance(circleA, circleB) then
                                set_group:insert({ circleA, circleB })
                            end
                        end
                    end
                end
            end
        end
    end

    return set_group:getAll()
end

--- 物体推挤, r半径可以作为质量参考
function Grid.resolveCollision(self)
    for _ = 1, TIMES do
        local collisions = self:detectCollisions()
        for i = 1, #collisions do
            local a = collisions[i][1]
            local b = collisions[i][2]
            local dx = b.x - a.x
            local dy = b.y - a.y
            local dist = math.sqrt(dx * dx + dy * dy)
            if dist == 0 then
                dx = 0.01
                dist = 0.01
            end
            local overlap = (a.r + b.r) - dist
            if overlap > 0 then
                local nx = dx / dist
                local ny = dy / dist
                local totalR = a.r + b.r
                a.x = a.x - nx * overlap * (b.r / totalR)
                a.y = a.y - ny * overlap * (b.r / totalR)
                b.x = b.x + nx * overlap * (a.r / totalR)
                b.y = b.y + ny * overlap * (a.r / totalR)
            end
        end
    end
end

---@param x number
---@param y number
---@param r number
function Grid.newCircle(x, y, r)
    return { x, y, r }
end

return Grid
