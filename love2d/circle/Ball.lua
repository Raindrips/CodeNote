--- @class Ball
--- @field x number
--- @field y number
local Ball = {}

---@param x number
---@param y number
---@param r number
---@param vx number
---@param vy number
---@param color table
---@return table
local function newBall(x, y, r, vx, vy, color)
    return { x = x, y = y, r = r, vx = vx, vu = vy, color = color }
end

---随机生成一个球
---@param maxW number
---@param maxW_y number
---@param minR number
---@param maxR number
local function randomBall(maxW, maxW_y, minR, maxR)
    minR = minR or 8
    maxR = maxR or 30
    local r = love.math.random(minR, maxR)
    return {
        x = love.math.random(r, maxW - r),
        y = love.math.random(r, maxW_y - r),
        vx = love.math.random(-50, 50),
        vy = love.math.random(-50, 50),
        r = r,
        color = {
            love.math.random(60, 255) / 255,
            love.math.random(60, 255) / 255,
            love.math.random(60, 255) / 255,
            1
        },
        collision = false,
    }
end

local function ballCollision(a, b)
    a.collision = true
    b.collision = true

    -- 碰撞法线 (A → B)
    local dx = b.x - a.x
    local dy = b.y - a.y
    -- 距离
    local dist = math.sqrt(dx * dx + dy * dy)
    if dist == 0 then
        dx = 0.01
        dy = 0
        dist = 0.01
    end

    local nx = dx / dist
    local ny = dy / dist

    -- 相对速度沿法线分量
    local dvn = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny

    -- 仅当相互靠近时才处理
    if dvn > 0 then
        local ma = a.r * a.r
        local mb = b.r * b.r
        local totalMass = ma + mb

        a.vx = a.vx - 2 * dvn * (mb / totalMass) * nx
        a.vy = a.vy - 2 * dvn * (mb / totalMass) * ny
        b.vx = b.vx + 2 * dvn * (ma / totalMass) * nx
        b.vy = b.vy + 2 * dvn * (ma / totalMass) * ny
    end
end

return { new = newBall, random = randomBall, collision = ballCollision }
