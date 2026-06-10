-- ============================================================
-- Super Platformer — main.lua
-- 超级马里奥风格平台跳跃游戏
-- 操作: ← → 或 A/D 移动, Space/↑/W 跳跃
--       R 重新开始, Escape 退出
-- ============================================================

---------- 常量 ----------
local TILE = 32
local GRAV = 1500
local PSPD = 300
local PJMP = -650
local MAPW = 200
local MAPH = 19

---------- 全局状态 ----------
local map, player, cam
local enemies, coins, parts
local clouds, hills
local score, coinCount, state, stateTimer, clock
local font16, font36

---------- Love2D 回调 ----------

function love.load()
    love.window.setTitle("Super Platformer!")
    love.window.setMode(800, 600, { vsync = 1 })
    love.graphics.setBackgroundColor(92, 148, 252)
    font16 = love.graphics.newFont(16)
    font36 = love.graphics.newFont(36)
    initGame()
end

function love.update(dt)
    dt = math.min(dt, 0.05)
    clock = clock + dt

    if state == "playing" then
        updatePlayer(dt)
        updateEnemies(dt)
        checkCoins()
        if player.y > MAPH * TILE + 200 then die() end
        if player.x + player.w > 196 * TILE then winGame() end
        local tgt = math.max(0, math.min(player.x - 350, MAPW * TILE - 800))
        cam.x = cam.x + (tgt - cam.x) * math.min(1, dt * 10)
    elseif state == "dead" then
        player.vy = player.vy + GRAV * dt
        player.y = player.y + player.vy * dt
        stateTimer = stateTimer - dt
        if stateTimer <= 0 then initGame() end
    elseif state == "win" then
        stateTimer = stateTimer - dt
        if stateTimer <= 0 then initGame() end
    end

    updateParts(dt)
end

function love.draw()
    love.graphics.push()
    love.graphics.translate(-math.floor(cam.x), 0)
    drawBg()
    drawMap()
    drawCoins()
    drawFlag()
    drawEnemies()
    if state ~= "dead" or stateTimer > 1.5 then drawPlayer() end
    drawParts()
    love.graphics.pop()
    drawHUD()
end

function love.keypressed(key)
    if key == "escape" then love.event.quit() end
    if key == "r" then initGame() end
    if (key == "space" or key == "up" or key == "w") then
        if state == "playing" and player.onGround then
            player.vy = PJMP
            player.onGround = false
        end
    end
end

function love.keyreleased(key)
    if (key == "space" or key == "up" or key == "w") then
        if player.vy < -200 then player.vy = -200 end
    end
end

---------- 初始化 ----------

function initGame()
    score = 0; coinCount = 0; state = "playing"
    stateTimer = 0; clock = 0; parts = {}
    buildMap()

    player = {
        x = 3 * TILE,
        y = 16 * TILE,
        w = 22,
        h = 30,
        vx = 0,
        vy = 0,
        onGround = false,
        facing = 1,
        walk = 0,
    }
    cam = { x = 0 }

    -- 敌人
    enemies = {}
    for _, tx in ipairs({ 15, 32, 50, 68, 85, 102, 120, 140, 160, 180 }) do
        enemies[#enemies + 1] = {
            x = tx * TILE,
            y = 16 * TILE + 4,
            w = 24,
            h = 26,
            vx = -(50 + math.random(0, 30)),
            alive = true,
            squish = 0,
        }
    end

    -- 金币
    coins = {}
    for _, c in ipairs({
        { 8,  14 }, { 9, 14 }, { 10, 14 }, { 20, 12 }, { 21, 12 }, { 22, 12 },
        { 35, 12 }, { 36, 12 }, { 37, 12 }, { 38, 12 }, { 50, 14 }, { 51, 14 }, { 52, 14 },
        { 65,  12 }, { 66, 12 }, { 67, 12 }, { 68, 12 }, { 85, 14 }, { 86, 14 }, { 87, 14 },
        { 105, 12 }, { 106, 12 }, { 107, 12 }, { 115, 14 }, { 116, 14 }, { 117, 14 }, { 118, 14 },
        { 125, 12 }, { 126, 12 }, { 127, 12 }, { 140, 14 }, { 141, 14 }, { 142, 14 },
        { 160, 12 }, { 161, 12 }, { 162, 12 }, { 163, 12 }, { 180, 14 }, { 181, 14 }, { 182, 14 },
    }) do
        coins[#coins + 1] = {
            x = c[1] * TILE + 8,
            y = c[2] * TILE + 4,
            got = false,
            ph = math.random() * math.pi * 2,
        }
    end

    -- 装饰
    clouds = {}; hills = {}
    for i = 1, 25 do
        clouds[i] = { x = math.random(0, MAPW * TILE), y = math.random(30, 200), w = math.random(60, 130) }
    end
    for i = 1, 15 do
        hills[i] = { x = math.random(0, MAPW * TILE), r = math.random(60, 140) }
    end
end

function buildMap()
    map = {}
    for x = 1, MAPW do
        map[x] = {}
        for y = 1, MAPH do map[x][y] = 0 end
    end
    -- 地面
    for x = 1, MAPW do
        map[x][18] = 1; map[x][19] = 1
    end
    -- 沟壑
    for _, g in ipairs({ { 24, 27 }, { 55, 58 }, { 90, 93 }, { 130, 133 }, { 170, 173 } }) do
        for x = g[1], g[2] do
            map[x][18] = 0; map[x][19] = 0
        end
    end
    -- 问号方块 (type 3)
    for _, p in ipairs({
        { 12, 14 }, { 14, 14 }, { 22, 10 }, { 36, 14 }, { 37, 14 }, { 38, 14 },
        { 60, 10 }, { 78, 14 }, { 79, 14 }, { 100, 10 }, { 110, 14 }, { 111, 14 },
        { 145, 14 }, { 165, 10 }, { 166, 10 }, { 185, 14 },
    }) do map[p[1]][p[2]] = 3 end
    -- 砖块 (type 2)
    for _, p in ipairs({
        { 11, 14 }, { 13, 14 }, { 15, 14 }, { 34, 14 }, { 35, 14 }, { 39, 14 }, { 40, 14 },
        { 59, 10 }, { 61, 10 }, { 76, 14 }, { 77, 14 }, { 80, 14 }, { 81, 14 },
        { 99,  10 }, { 101, 10 }, { 108, 14 }, { 109, 14 }, { 112, 14 }, { 113, 14 },
        { 143, 14 }, { 144, 14 }, { 146, 14 }, { 147, 14 }, { 164, 10 }, { 167, 10 },
        { 183, 14 }, { 184, 14 }, { 186, 14 }, { 187, 14 },
    }) do
        if map[p[1]][p[2]] == 0 then map[p[1]][p[2]] = 2 end
    end
    -- 水管 (type 5)
    for _, p in ipairs({ { 18, 15 }, { 42, 15 }, { 75, 14 }, { 105, 15 }, { 135, 15 }, { 155, 14 }, { 175, 15 } }) do
        for y = p[2], 17 do
            map[p[1]][y] = 5; map[p[1] + 1][y] = 5
        end
    end
    -- 终点阶梯
    for i = 0, 7 do for j = 0, i do map[189 + i][17 - j] = 1 end end
end

---------- 碰撞 ----------

function solid(tx, ty)
    if tx < 1 or tx > MAPW or ty < 1 then return false end
    if ty > MAPH then return true end
    return map[tx][ty] > 0
end

function resolveH()
    if player.vx == 0 then return end
    local t = math.floor((player.y + 2) / TILE) + 1
    local b = math.floor((player.y + player.h - 2) / TILE) + 1
    if player.vx > 0 then
        local tx = math.floor((player.x + player.w - 0.01) / TILE) + 1
        for ty = t, b do
            if solid(tx, ty) then
                player.x = (tx - 1) * TILE - player.w
                player.vx = 0; return
            end
        end
    else
        local tx = math.floor(player.x / TILE) + 1
        for ty = t, b do
            if solid(tx, ty) then
                player.x = tx * TILE
                player.vx = 0; return
            end
        end
    end
end

function resolveV()
    local l = math.floor((player.x + 2) / TILE) + 1
    local r = math.floor((player.x + player.w - 3) / TILE) + 1
    if player.vy > 0 then
        local ty = math.floor((player.y + player.h - 0.01) / TILE) + 1
        for tx = l, r do
            if solid(tx, ty) then
                player.y = (ty - 1) * TILE - player.h
                player.vy = 0; player.onGround = true
                for i = 1, 3 do
                    parts[#parts + 1] = {
                        x = player.x + player.w / 2 + (math.random() - 0.5) * 12,
                        y = player.y + player.h,
                        vx = (math.random() - 0.5) * 60,
                        vy = -math.random() * 40,
                        life = 0.2,
                        kind = "dust",
                    }
                end
                return
            end
        end
    elseif player.vy < 0 then
        local ty = math.floor(player.y / TILE) + 1
        for tx = l, r do
            if solid(tx, ty) then
                player.y = ty * TILE; player.vy = 0
                hitBlock(tx, ty); return
            end
        end
    end
end

function hitBlock(tx, ty)
    local t = map[tx][ty]
    if t == 3 then
        map[tx][ty] = 6; score = score + 100; coinCount = coinCount + 1
        parts[#parts + 1] = {
            x = tx * TILE + TILE / 2,
            y = (ty - 1) * TILE,
            vx = 0,
            vy = -400,
            life = 0.5,
            kind = "coin",
        }
    elseif t == 2 then
        map[tx][ty] = 0; score = score + 50
        for i = 1, 4 do
            parts[#parts + 1] = {
                x = (tx - 0.5) * TILE + (i % 2 * 2 - 1) * 6,
                y = (ty - 0.5) * TILE + (math.floor((i - 1) / 2) * 2 - 1) * 6,
                vx = (i % 2 * 2 - 1) * (80 + math.random() * 60),
                vy = -250 - math.random() * 200,
                life = 0.8,
                kind = "brick",
            }
        end
    end
end

---------- 更新 ----------

function updatePlayer(dt)
    player.vx = 0
    if love.keyboard.isDown("left", "a") then
        player.vx = -PSPD; player.facing = -1
    end
    if love.keyboard.isDown("right", "d") then
        player.vx = PSPD; player.facing = 1
    end
    if player.vx ~= 0 then player.walk = player.walk + dt * 12 else player.walk = 0 end
    player.vy = player.vy + GRAV * dt
    if player.vy > 800 then player.vy = 800 end
    player.x = player.x + player.vx * dt; resolveH()
    player.y = player.y + player.vy * dt; player.onGround = false; resolveV()
end

function updateEnemies(dt)
    for _, e in ipairs(enemies) do
        if e.alive then
            if e.squish > 0 then
                e.squish = e.squish - dt
                if e.squish <= 0 then e.alive = false end
            else
                e.x = e.x + e.vx * dt
                local ftx = math.floor((e.vx > 0 and e.x + e.w or e.x) / TILE) + 1
                local fty = math.floor((e.y + e.h / 2) / TILE) + 1
                if solid(ftx, fty) then
                    e.vx = -e.vx; e.x = e.x + e.vx * dt
                end
                local etx = math.floor((e.vx > 0 and e.x + e.w + 2 or e.x - 2) / TILE) + 1
                local ety = math.floor((e.y + e.h + 4) / TILE) + 1
                if not solid(etx, ety) then e.vx = -e.vx end
                if player.x < e.x + e.w and player.x + player.w > e.x and
                    player.y < e.y + e.h and player.y + player.h > e.y then
                    if player.vy > 0 and player.y + player.h - e.y < e.h * 0.5 then
                        e.squish = 0.3; player.vy = PJMP * 0.5; score = score + 200
                    else
                        die()
                    end
                end
            end
        end
    end
end

function checkCoins()
    for _, c in ipairs(coins) do
        if not c.got and player.x + player.w > c.x and player.x < c.x + 16 and
            player.y + player.h > c.y and player.y < c.y + 24 then
            c.got = true; coinCount = coinCount + 1; score = score + 50
        end
    end
end

function die()
    state = "dead"; stateTimer = 2.5; player.vy = PJMP
end

function winGame()
    state = "win"; stateTimer = 4; score = score + 1000
end

function updateParts(dt)
    for i = #parts, 1, -1 do
        local p = parts[i]
        p.x = p.x + p.vx * dt; p.y = p.y + p.vy * dt
        p.vy = p.vy + GRAV * dt
        p.life = p.life - dt
        if p.life <= 0 then table.remove(parts, i) end
    end
end

---------- 绘制 ----------

function drawBg()
    love.graphics.setColor(64, 64, 64, 255)
    for _, c in ipairs(clouds) do
        local cx = c.x - cam.x * 0.1
        love.graphics.ellipse("fill", cx, c.y, c.w, c.w * 0.3)
        love.graphics.ellipse("fill", cx - c.w * 0.25, c.y + 6, c.w * 0.5, c.w * 0.2)
        love.graphics.ellipse("fill", cx + c.w * 0.3, c.y + 4, c.w * 0.4, c.w * 0.18)
    end
    love.graphics.setColor(72, 160, 48)
    for _, h in ipairs(hills) do
        love.graphics.circle("fill", h.x - cam.x * 0.3, 17 * TILE + 2, h.r)
    end
end

function drawMap()
    love.graphics.setFont(font16)
    local sx = math.max(1, math.floor(cam.x / TILE) + 1)
    local ex = math.min(MAPW, math.ceil((cam.x + 800) / TILE) + 1)
    for tx = sx, ex do
        for ty = 1, MAPH do
            local t = map[tx][ty]
            if t > 0 then drawTile((tx - 1) * TILE, (ty - 1) * TILE, t, tx, ty) end
        end
    end
end

function drawTile(x, y, t, tx, ty)
    if t == 1 then
        love.graphics.setColor(139, 90, 43)
        love.graphics.rectangle("fill", x, y, TILE, TILE)
        love.graphics.setColor(120, 75, 35)
        love.graphics.rectangle("line", x, y, TILE, TILE)
        if ty > 1 and map[tx][ty - 1] == 0 then
            love.graphics.setColor(76, 153, 0)
            love.graphics.rectangle("fill", x, y, TILE, 4)
        end
    elseif t == 2 then
        love.graphics.setColor(185, 100, 40)
        love.graphics.rectangle("fill", x, y, TILE, TILE)
        love.graphics.setColor(140, 70, 25)
        love.graphics.rectangle("line", x, y, TILE, TILE)
        love.graphics.line(x + TILE / 2, y, x + TILE / 2, y + TILE)
        love.graphics.line(x, y + TILE / 2, x + TILE, y + TILE / 2)
    elseif t == 3 then
        local pulse = 0.85 + 0.15 * math.sin(clock * 5)
        love.graphics.setColor(255 * pulse, 200 * pulse, 50)
        love.graphics.rectangle("fill", x, y, TILE, TILE)
        love.graphics.setColor(200, 150, 30)
        love.graphics.rectangle("line", x, y, TILE, TILE)
        love.graphics.setColor(120, 80, 10)
        love.graphics.printf("?", x, y + 6, TILE, "center")
    elseif t == 5 then
        love.graphics.setColor(40, 180, 40)
        love.graphics.rectangle("fill", x, y, TILE, TILE)
        love.graphics.setColor(25, 140, 25)
        love.graphics.rectangle("line", x, y, TILE, TILE)
        love.graphics.setColor(80, 220, 80)
        love.graphics.rectangle("fill", x + 2, y + 2, 5, TILE - 4)
        if ty > 1 and (map[tx][ty - 1] == nil or map[tx][ty - 1] ~= 5) then
            love.graphics.setColor(40, 180, 40)
            love.graphics.rectangle("fill", x - 2, y, TILE + 4, 6)
            love.graphics.setColor(25, 140, 25)
            love.graphics.rectangle("line", x - 2, y, TILE + 4, 6)
        end
    elseif t == 6 then
        love.graphics.setColor(120, 100, 80)
        love.graphics.rectangle("fill", x, y, TILE, TILE)
        love.graphics.setColor(90, 75, 60)
        love.graphics.rectangle("line", x, y, TILE, TILE)
    end
end

function drawPlayer()
    local p = player
    local x, y = math.floor(p.x), math.floor(p.y)
    -- 鞋子
    love.graphics.setColor(100, 60, 20)
    love.graphics.rectangle("fill", x + 1, y + p.h - 3, 9, 5)
    love.graphics.rectangle("fill", x + p.w - 10, y + p.h - 3, 9, 5)
    -- 腿
    local la = math.sin(p.walk * 2) * 3
    love.graphics.setColor(40, 60, 180)
    love.graphics.rectangle("fill", x + 2, y + 18 + la, 7, 9)
    love.graphics.rectangle("fill", x + p.w - 9, y + 18 - la, 7, 9)
    -- 身体
    love.graphics.setColor(220, 50, 50)
    love.graphics.rectangle("fill", x + 1, y + 8, p.w - 2, 12)
    -- 脸
    love.graphics.setColor(255, 210, 170)
    love.graphics.rectangle("fill", x + 2, y + 1, p.w - 4, 10)
    -- 帽子
    love.graphics.setColor(220, 50, 50)
    love.graphics.rectangle("fill", x - 1, y - 4, p.w + 2, 7)
    -- 眼睛
    love.graphics.setColor(0, 0, 0)
    local ex = p.facing > 0 and (x + p.w - 7) or (x + 4)
    love.graphics.rectangle("fill", ex, y + 4, 2, 3)
end

function drawEnemies()
    for _, e in ipairs(enemies) do
        if e.alive then
            local x, y = math.floor(e.x), math.floor(e.y)
            if e.squish > 0 then
                love.graphics.setColor(160, 82, 45)
                love.graphics.rectangle("fill", x - 2, y + e.h - 8, e.w + 4, 8)
            else
                love.graphics.setColor(160, 82, 45)
                love.graphics.rectangle("fill", x, y, e.w, e.h)
                love.graphics.setColor(255, 255, 255)
                love.graphics.rectangle("fill", x + 3, y + 6, 7, 7)
                love.graphics.rectangle("fill", x + e.w - 10, y + 6, 7, 7)
                love.graphics.setColor(0, 0, 0)
                local d = e.vx < 0 and 0 or 3
                love.graphics.rectangle("fill", x + 5 + d, y + 8, 3, 3)
                love.graphics.rectangle("fill", x + e.w - 8 + d, y + 8, 3, 3)
                love.graphics.setColor(100, 50, 20)
                love.graphics.line(x + 2, y + 5, x + 11, y + 3)
                love.graphics.line(x + e.w - 11, y + 3, x + e.w - 2, y + 5)
                local fa = math.sin(clock * 8 + e.x) * 2
                love.graphics.setColor(60, 30, 10)
                love.graphics.rectangle("fill", x + 1, y + e.h, 8, 4 + fa)
                love.graphics.rectangle("fill", x + e.w - 9, y + e.h, 8, 4 - fa)
            end
        end
    end
end

function drawCoins()
    for _, c in ipairs(coins) do
        if not c.got then
            local bob = math.sin(clock * 3 + c.ph) * 3
            local sw = math.abs(math.cos(clock * 2.5 + c.ph))
            love.graphics.setColor(255, 215, 0)
            love.graphics.ellipse("fill", c.x + 8, c.y + 12 + bob, 6 * sw + 2, 10)
            love.graphics.setColor(200, 160, 0)
            love.graphics.ellipse("line", c.x + 8, c.y + 12 + bob, 6 * sw + 2, 10)
        end
    end
end

function drawFlag()
    local fx = 196 * TILE
    love.graphics.setColor(140, 140, 140)
    love.graphics.rectangle("fill", fx - 2, 4 * TILE, 4, 13 * TILE)
    love.graphics.setColor(255, 215, 0)
    love.graphics.circle("fill", fx, 4 * TILE, 6)
    love.graphics.setColor(40, 180, 40)
    love.graphics.polygon("fill", fx + 3, 4 * TILE + 8, fx + 45, 4 * TILE + 24, fx + 3, 4 * TILE + 40)
end

function drawParts()
    for _, p in ipairs(parts) do
        if p.kind == "coin" then
            love.graphics.setColor(255, 215, 0, 255 * math.min(1, p.life * 4))
            love.graphics.circle("fill", p.x, p.y, 8)
        elseif p.kind == "brick" then
            love.graphics.setColor(185, 100, 40)
            love.graphics.rectangle("fill", p.x - 5, p.y - 5, 10, 10)
        elseif p.kind == "dust" then
            local a = p.life / 0.2
            love.graphics.setColor(200, 180, 150, 200 * a)
            love.graphics.circle("fill", p.x, p.y, 3 * a)
        end
    end
end

function drawHUD()
    love.graphics.setFont(font16)
    love.graphics.setColor(200, 200, 200)
    love.graphics.print("SCORE", 20, 12)
    love.graphics.print(string.format("%06d", score), 85, 12)
    love.graphics.setColor(255, 215, 0)
    love.graphics.print("COINS x" .. coinCount, 220, 12)

    if state == "dead" then
        love.graphics.setColor(0, 0, 0, 160)
        love.graphics.rectangle("fill", 250, 240, 300, 120, 8, 8)
        love.graphics.setColor(255, 80, 80)
        love.graphics.setFont(font36)
        love.graphics.printf("GAME OVER", 250, 252, 300, "center")
        love.graphics.setColor(200, 200, 200)
        love.graphics.setFont(font16)
        love.graphics.printf("Press R to restart", 250, 305, 300, "center")
    elseif state == "win" then
        love.graphics.setColor(0, 0, 0, 160)
        love.graphics.rectangle("fill", 200, 220, 400, 160, 8, 8)
        love.graphics.setColor(255, 215, 0)
        love.graphics.setFont(font36)
        love.graphics.printf("COURSE CLEAR!", 200, 232, 400, "center")
        love.graphics.setColor(255, 255, 255)
        love.graphics.setFont(font16)
        love.graphics.printf("Score: " .. score, 200, 290, 400, "center")
        love.graphics.setColor(200, 200, 200)
        love.graphics.printf("Press R to play again", 200, 320, 400, "center")
    end
end
