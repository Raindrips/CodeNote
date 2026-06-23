export class Player {
    constructor() {
        this.x = 0;
        this.y = 0;
    }
    moveLeft(maze) {
        const cell = maze.getCell(this.x, this.y);
        if (cell.wallMask & 8) {
            return;
        }
        this.x--;
    }
    moveRight(maze) {
        const cell = maze.getCell(this.x, this.y);
        if (cell.wallMask & 2) {
            return;
        }
        this.x++;
    }
    moveUp(maze) {
        const cell = maze.getCell(this.x, this.y);
        if (cell.wallMask & 1) {
            return;
        }
        this.y--;
    }
    moveDown(maze) {
        const cell = maze.getCell(this.x, this.y);
        if (cell.wallMask & 4) {
            return;
        }
        this.y++;
    }
}
