local Grid = require("Grid")
local TableToJson = require('table-json')
local Ball = require('Ball')
-- 数据与配置
local balls = {}                          -- 所有球体 { x, y, r, color }
local cam = { x = 0, y = 0, speed = 400 } -- 摄像机（地图偏移）

local WORLD_W = 6000                      -- 全局世界宽
local WORLD_H = 6000                      -- 全局世界高
local GRID_SIZE = 50                      -- 网格单元大小

local BALL_COUNT = 1600
local BALL_SIZE = 50

local drag = {
	active = false,
	index  = nil, -- 正在拖拽的球在 balls 中的索引
	offX   = 0, -- 鼠标按下时相对球心的偏移
	offY   = 0,
}

local canvas
local grid = Grid.new(WORLD_W, GRID_SIZE);

local function updateVelocity(dt)
	for i = 1, #balls do
		local b = balls[i]
		b.x = b.x + b.vx * dt;
		b.y = b.y + b.vy * dt;
		b.collision = false

		if b.x > WORLD_W - b.r then
			b.vx = -b.vx
		end
		if b.x < b.r then
			b.vx = -b.vx
		end

		if b.y > WORLD_H - b.r then
			b.vy = -b.vy
		end
		if b.y < b.r then
			b.vy = -b.vy
		end

		-- 限制在世界边界内
		b.x = math.max(b.r, math.min(b.x, WORLD_W - b.r))
		b.y = math.max(b.r, math.min(b.y, WORLD_H - b.r))
	end
end

local function updateCollisions()
	local obj = grid:detectCollisions()
	for i = 1, #obj do
		local a = obj[i][1]
		local b = obj[i][2]
		Ball.collision(a, b)
	end
	grid:resolveCollision()
	grid:rebuild()
end

-- 批量生成
local function spawnBalls(count)
	for i = 1, count do
		local ball = Ball.random(WORLD_W, WORLD_H, 8, BALL_SIZE)
		table.insert(balls, ball)
		grid:addObject(ball)
	end
end

local spawnUpdate = nil
local function spawnCoroutine(count)
	spawnUpdate = coroutine.wrap(function()
		for i = 1, count do
			local ball = Ball.random(WORLD_W, WORLD_H, 8, BALL_SIZE)
			table.insert(balls, ball)
			grid:addObject(ball)
			coroutine.yield()
		end
		spawnUpdate = nil
	end)
end

--  网格绘制
local function drawGrid()
	love.graphics.setColor(0.3, 0.3, 0.35, 0.4)
	love.graphics.setLineWidth(0.5)

	-- 计算可见范围（优化：只画屏幕内的线）
	local sw, sh = love.graphics.getDimensions()
	local ox = cam.x % GRID_SIZE
	local oy = cam.y % GRID_SIZE

	for x = -ox, sw, GRID_SIZE do
		love.graphics.line(x, 0, x, sh)
	end
	for y = -oy, sh, GRID_SIZE do
		love.graphics.line(0, y, sw, y)
	end

	-- 世界边界
	love.graphics.setColor(0.9, 0.3, 0.3, 0.6)
	love.graphics.setLineWidth(2)
	love.graphics.rectangle("line",
		-cam.x, -cam.y,
		WORLD_W, WORLD_H)
end

-- 渲染所有球体
local function drawBalls()
	for _, b in ipairs(balls) do
		if b.collision then
			love.graphics.setColor({ 1, 0.25, 0.25, 1 })
		else
			love.graphics.setColor(b.color)
		end
		love.graphics.circle("fill",
			b.x - cam.x,
			b.y - cam.y,
			b.r)

		-- -- 高光
		-- love.graphics.setColor(1, 1, 1, 0.15)
		-- love.graphics.circle("fill",
		-- 	b.x - cam.x - b.r * 0.25,
		-- 	b.y - cam.y - b.r * 0.25,
		-- 	b.r * 0.4)
	end
end

-- 辅助：查找鼠标下最近的球
local function findBallAt(worldX, worldY)
	for i = #balls, 1, -1 do -- 从顶层往回找
		local b = balls[i]
		local dx = worldX - b.x
		local dy = worldY - b.y
		if dx * dx + dy * dy <= b.r * b.r then
			return i
		end
	end
	return nil
end

local function findBallAtGrid(worldX, worldY)
	local candidates = grid:getObjectsAt(worldX, worldY)
	for i = #candidates, 1, -1 do
		local b = candidates[i]
		local dx = worldX - b.x
		local dy = worldY - b.y
		if dx * dx + dy * dy <= b.r * b.r then
			for j = #balls, 1, -1 do
				if balls[j] == b then return j end
			end
		end
	end
	return nil
end



--  按键移动地图
function love.update(dt)
	if spawnUpdate then
		spawnUpdate()
	end
	if love.keyboard.isDown("left", "a") then cam.x = cam.x - cam.speed * dt end
	if love.keyboard.isDown("right", "d") then cam.x = cam.x + cam.speed * dt end
	if love.keyboard.isDown("up", "w") then cam.y = cam.y - cam.speed * dt end
	if love.keyboard.isDown("down", "s") then cam.y = cam.y + cam.speed * dt end

	updateVelocity(dt)
	updateCollisions()

	-- 限制摄像机范围（可选）
	cam.x = math.max(-200, math.min(cam.x, WORLD_W - love.graphics.getWidth() + 200))
	cam.y = math.max(-200, math.min(cam.y, WORLD_H - love.graphics.getHeight() + 200))
end

function love.mousepressed(mx, my, button)
	local wx = mx + cam.x
	local wy = my + cam.y
	print('mouse', wx, wy)
	if button == 1 then
		local idx = findBallAtGrid(wx, wy)
		if idx then
			-- 在球上：开始拖拽
			drag.active = true
			drag.index  = idx
			drag.offX   = wx - balls[idx].x
			drag.offY   = wy - balls[idx].y
		else
			-- 空地：生成新球
			local b = Ball.random(WORLD_W, WORLD_H, 8, 30)
			b.x = wx
			b.y = wy
			table.insert(balls, b)
			grid:addObject(b)
		end
	elseif button == 2 then
		-- 右键删除（拖拽中不允许删除，避免误操作）
		if not drag.active then
			local idx = findBallAtGrid(wx, wy)
			if idx then
				table.remove(balls, idx)
			end
		end
	end
end

-- 鼠标移动 → 更新拖拽位置
function love.mousemoved(mx, my, dx, dy)
	if not drag.active then return end

	local b = balls[drag.index]
	if not b then
		drag.active = false
		return
	end

	local wx = mx + cam.x
	local wy = my + cam.y

	b.x = wx - drag.offX
	b.y = wy - drag.offY

	-- 限制在世界边界内
	b.x = math.max(b.r, math.min(b.x, WORLD_W - b.r))
	b.y = math.max(b.r, math.min(b.y, WORLD_H - b.r))
end

-- 鼠标松开 → 结束拖拽
function love.mousereleased(mx, my, button)
	if button == 1 then
		drag.active = false
		drag.index  = nil
	end
end

-- ESC 退出
function love.keypressed(key)
	if key == "escape" then love.event.quit() end

	if key == 'space' then
		grid:resolveCollision()
	end
end

function love.load()
	print(TableToJson(grid))
	love.window.setTitle("Ball Grid Tool")
	love.graphics.setBackgroundColor(0.08, 0.08, 0.10)
	love.math.setRandomSeed(os.time())

	-- 预生成一些球
	spawnBalls(BALL_COUNT)
	-- spawnCoroutine(BALL_COUNT)
end

function love.draw()
	love.graphics.push()

	drawGrid()
	drawBalls()

	love.graphics.setColor(1, 1, 1, 0.8)
	love.graphics.print(
		string.format("ball: #%-4d  camera: (%d, %d)  [key/WASD move map]",
			#balls, cam.x, cam.y),
		10, 10)
	love.graphics.print("FPS: " .. love.timer.getFPS())
	love.graphics.pop()
end
