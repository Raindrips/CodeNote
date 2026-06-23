import { Maze } from "./Maze";

export class Player {

    x = 0;
    y = 0;

    moveLeft(maze: Maze) {

        const cell = maze.getCell(this.x, this.y);

        if (cell.wallMask & 8) {
            return;
        }

        this.x--;
    }

    moveRight(maze: Maze) {

        const cell = maze.getCell(this.x, this.y);

        if (cell.wallMask & 2) {
            return;
        }

        this.x++;
    }

    moveUp(maze: Maze) {

        const cell = maze.getCell(this.x, this.y);

        if (cell.wallMask & 1) {
            return;
        }

        this.y--;
    }

    moveDown(maze: Maze) {

        const cell = maze.getCell(this.x, this.y);

        if (cell.wallMask & 4) {
            return;
        }

        this.y++;
    }
}