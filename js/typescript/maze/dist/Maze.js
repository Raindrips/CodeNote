var WallMask;
(function (WallMask) {
    WallMask[WallMask["Top"] = 1] = "Top";
    WallMask[WallMask["Right"] = 2] = "Right";
    WallMask[WallMask["Bottom"] = 4] = "Bottom";
    WallMask[WallMask["Left"] = 8] = "Left";
})(WallMask || (WallMask = {}));
class MazeCell {
    constructor() {
        this.wallMask = WallMask.Top |
            WallMask.Right |
            WallMask.Bottom |
            WallMask.Left;
        this.visited = false;
    }
}
export class Maze {
    constructor(width, height) {
        this.cells = [];
        this.width = width;
        this.height = height;
        for (let y = 0; y < height; y++) {
            this.cells[y] = [];
            for (let x = 0; x < width; x++) {
                this.cells[y][x] = new MazeCell();
            }
        }
    }
    generate() {
        const stack = [];
        const startX = 0;
        const startY = 0;
        this.cells[startY][startX].visited = true;
        stack.push({
            x: startX,
            y: startY,
        });
        while (stack.length > 0) {
            const current = stack[stack.length - 1];
            const neighbors = this.getUnvisitedNeighbors(current.x, current.y);
            if (neighbors.length === 0) {
                stack.pop();
                continue;
            }
            const next = neighbors[Math.floor(Math.random() * neighbors.length)];
            this.removeWall(current.x, current.y, next.x, next.y);
            this.cells[next.y][next.x].visited = true;
            stack.push(next);
        }
    }
    getUnvisitedNeighbors(x, y) {
        const result = [];
        const dirs = [
            [0, -1],
            [1, 0],
            [0, 1],
            [-1, 0],
        ];
        for (const [dx, dy] of dirs) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx < 0 ||
                ny < 0 ||
                nx >= this.width ||
                ny >= this.height) {
                continue;
            }
            if (!this.cells[ny][nx].visited) {
                result.push({
                    x: nx,
                    y: ny,
                });
            }
        }
        return result;
    }
    removeWall(x1, y1, x2, y2) {
        const a = this.cells[y1][x1];
        const b = this.cells[y2][x2];
        if (x2 === x1 + 1) {
            a.wallMask &= ~WallMask.Right;
            b.wallMask &= ~WallMask.Left;
        }
        else if (x2 === x1 - 1) {
            a.wallMask &= ~WallMask.Left;
            b.wallMask &= ~WallMask.Right;
        }
        else if (y2 === y1 + 1) {
            a.wallMask &= ~WallMask.Bottom;
            b.wallMask &= ~WallMask.Top;
        }
        else if (y2 === y1 - 1) {
            a.wallMask &= ~WallMask.Top;
            b.wallMask &= ~WallMask.Bottom;
        }
    }
    getCell(x, y) {
        return this.cells[y][x];
    }
}
