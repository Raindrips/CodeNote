enum WallMask {
    Top = 1 << 0,
    Right = 1 << 1,
    Bottom = 1 << 2,
    Left = 1 << 3,
}

class MazeCell {
    wallMask =
        WallMask.Top |
        WallMask.Right |
        WallMask.Bottom |
        WallMask.Left;

    visited = false;
}

export class Maze {

    readonly width: number;
    readonly height: number;

    cells: MazeCell[][] = [];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;

        for (let y = 0; y < height; y++) {
            this.cells[y] = [];

            for (let x = 0; x < width; x++) {
                this.cells[y][x] = new MazeCell();
            }
        }
    }

    generate(): void {

        const stack: { x: number; y: number }[] = [];

        const startX = 0;
        const startY = 0;

        this.cells[startY][startX].visited = true;

        stack.push({
            x: startX,
            y: startY,
        });

        while (stack.length > 0) {

            const current = stack[stack.length - 1];

            const neighbors = this.getUnvisitedNeighbors(
                current.x,
                current.y,
            );

            if (neighbors.length === 0) {
                stack.pop();
                continue;
            }

            const next =
                neighbors[
                    Math.floor(Math.random() * neighbors.length)
                ];

            this.removeWall(
                current.x,
                current.y,
                next.x,
                next.y,
            );

            this.cells[next.y][next.x].visited = true;

            stack.push(next);
        }
    }

    private getUnvisitedNeighbors(
        x: number,
        y: number,
    ) {

        const result: {
            x: number;
            y: number;
        }[] = [];

        const dirs = [
            [0, -1],
            [1, 0],
            [0, 1],
            [-1, 0],
        ];

        for (const [dx, dy] of dirs) {

            const nx = x + dx;
            const ny = y + dy;

            if (
                nx < 0 ||
                ny < 0 ||
                nx >= this.width ||
                ny >= this.height
            ) {
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

    private removeWall(
        x1: number,
        y1: number,
        x2: number,
        y2: number,
    ) {

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

    getCell(x: number, y: number): MazeCell {
        return this.cells[y][x];
    }
}