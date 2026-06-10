local Grid = require("Grid")
local TableToJson = require('table-json')
-- 数据与配置
local balls = {}                          -- 所有球体 { x, y, r, color }
local cam = { x = 0, y = 0, speed = 400 } -- 摄像机（地图偏移）

local WORLD_W = 1000                      -- 全局世界宽
local WORLD_H = 1000                      -- 全局世界高
local GRID_SIZE = 100                     -- 网格单元大小

local drag = {
	active = false,
	index  = nil, -- 正在拖拽的球在 balls 中的索引
	offX   = 0, -- 鼠标按下时相对球心的偏移
	offY   = 0,
}

local canvas
local grid = Grid.new(WORLD_W, GRID_SIZE);

local function updateCollisions()
	local obj = grid:detectCollisions()
	for i = 1, #obj do
		local group = obj[i]
		-- print('a: ' .. group[1].x .. ' ' .. group[1].y, 'b: ' .. group[1].x .. ' ' .. group[2].y)
		group[1].color = { 1, 0, 0, 1 }
		group[2].color = { 1, 0, 0, 1 }
	end
	grid:resolveCollision()
	grid:rebuild()
end

--  随机生成一个球
local function randomBall(maxW, maxW_y, minR, maxR)
	maxW = maxW or WORLD_W
	maxW_y = maxW_y or WORLD_H
	minR = minR or 8
	maxR = maxR or 30
	local r = love.math.random(minR, maxR)
	return {
		x = love.math.random(r, maxW - r),
		y = love.math.random(r, maxW_y - r),
		r = r,
		color = {
			love.math.random(60, 255) / 255,
			love.math.random(60, 255) / 255,
			love.math.random(60, 255) / 255,
			1
		}
	}
end

-- 批量生成
local function spawnBalls(count)
	for i = 1, count do
		local ball = randomBall()
		table.insert(balls, ball)
		grid:addObject(ball)
	end
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
		love.graphics.setColor(b.color)
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


--  按键移动地图
function love.update(dt)
	if love.keyboard.isDown("left", "a") then cam.x = cam.x - cam.speed * dt end
	if love.keyboard.isDown("right", "d") then cam.x = cam.x + cam.speed * dt end
	if love.keyboard.isDown("up", "w") then cam.y = cam.y - cam.speed * dt end
	if love.keyboard.isDown("down", "s") then cam.y = cam.y + cam.speed * dt end

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
		local idx = findBallAt(wx, wy)
		if idx then
			-- 在球上：开始拖拽
			drag.active = true
			drag.index  = idx
			drag.offX   = wx - balls[idx].x
			drag.offY   = wy - balls[idx].y
		else
			-- 空地：生成新球
			local b = randomBall()
			b.x = wx
			b.y = wy
			table.insert(balls, b)
			grid:addObject(b)
		end
	elseif button == 2 then
		-- 右键删除（拖拽中不允许删除，避免误操作）
		if not drag.active then
			local idx = findBallAt(wx, wy)
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
	spawnBalls(100)
end

function love.draw()
	-- love.graphics.push()

	drawGrid()
	drawBalls()

	love.graphics.setColor(1, 1, 1, 0.8)
	love.graphics.print(
		string.format("ball: #%-4d  camera: (%d, %d)  [key/WASD move map]",
			#balls, cam.x, cam.y),
		10, 10)

	-- love.graphics.pop()
end
