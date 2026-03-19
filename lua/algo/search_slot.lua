os.execute("chcp 65001 > nul")

local WILD = 0

local dirs = {
    { 1, 0 }, { -1, 0 }, { 0, 1 }, { 0, -1 }
}

local function bfs(board, visited, startX, startY, target)
    local queue = { { startX, startY } }
    local head = 1

    local cells = {}

    -- 本次 BFS 内百搭访问控制
    local wildVisited = {}

    while head <= #queue do
        local node = queue[head]
        head = head + 1

        local x, y = node[1], node[2]
        local v = board[x][y]

        -- 收集
        table.insert(cells, { x, y })

        for _, d in ipairs(dirs) do
            local nx, ny = x + d[1], y + d[2]

            if board[nx] and board[nx][ny] then
                local nv = board[nx][ny]

                if nv == target then
                    if not visited[nx][ny] then
                        visited[nx][ny] = true
                        table.insert(queue, { nx, ny })
                    end
                elseif nv == WILD then
                    wildVisited[nx] = wildVisited[nx] or {}
                    if not wildVisited[nx][ny] then
                        wildVisited[nx][ny] = true
                        table.insert(queue, { nx, ny })
                    end
                end
            end
        end
    end

    return cells
end

local function findMatches(board)
    local visited = {}
    local results = {}

    for i = 1, #board do
        visited[i] = {}
    end

    for i = 1, #board do
        for j = 1, #board[i] do
            local v = board[i][j]

            if v ~= WILD and not visited[i][j] then
                visited[i][j] = true

                local cells = bfs(board, visited, i, j, v)

                if #cells >= 5 then
                    table.insert(results, {
                        value = v,
                        cells = cells
                    })
                end
            end
        end
    end

    return results
end

function PrintTable(tbl, indent)
    if type(tbl) ~= "table" then
        print(tbl)
        return
    end
    indent = indent or 0
    local indentStr = string.rep("  ", indent) -- 缩进空格
    for k, v in pairs(tbl) do
        if type(v) == "table" then
            print(indentStr .. k .. ":")
            PrintTable(v, indent + 1) -- 递归打印嵌套表格
        else
            print(indentStr .. k .. ": " .. tostring(v))
        end
    end
end

local board = {
    { 1, 1, 0, 2, 2 },
    { 1, 0, 0, 2, 2 },
    { 1, 1, 0, 2, 2 },
    { 1, 1, 0, 2, 2 },
    { 1, 1, 0, 2, 2 },
}

local matches = findMatches(board)

for _, m in ipairs(matches) do
    print("元素:", m.value, "数量:", #m.cells)
    print("结果:")
    PrintTable(m.cells)
end
