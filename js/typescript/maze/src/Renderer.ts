import { Maze } from "./Maze";
import { Player } from "./Player";

export class Renderer {

    constructor(
        private ctx: CanvasRenderingContext2D,
        private cellSize: number,
    ) {}

    draw(
        maze: Maze,
        player: Player,
    ) {

        const ctx = this.ctx;

        ctx.clearRect(
            0,
            0,
            ctx.canvas.width,
            ctx.canvas.height,
        );

        ctx.lineWidth = 2;

        for (let y = 0; y < maze.height; y++) {

            for (let x = 0; x < maze.width; x++) {

                const cell = maze.getCell(x, y);

                const px = x * this.cellSize;
                const py = y * this.cellSize;

                ctx.beginPath();

                if (cell.wallMask & 1) {
                    ctx.moveTo(px, py);
                    ctx.lineTo(
                        px + this.cellSize,
                        py,
                    );
                }

                if (cell.wallMask & 2) {
                    ctx.moveTo(
                        px + this.cellSize,
                        py,
                    );
                    ctx.lineTo(
                        px + this.cellSize,
                        py + this.cellSize,
                    );
                }

                if (cell.wallMask & 4) {
                    ctx.moveTo(
                        px,
                        py + this.cellSize,
                    );
                    ctx.lineTo(
                        px + this.cellSize,
                        py + this.cellSize,
                    );
                }

                if (cell.wallMask & 8) {
                    ctx.moveTo(px, py);
                    ctx.lineTo(
                        px,
                        py + this.cellSize,
                    );
                }

                ctx.stroke();
            }
        }

        const cx =
            player.x * this.cellSize +
            this.cellSize * 0.5;

        const cy =
            player.y * this.cellSize +
            this.cellSize * 0.5;

        ctx.beginPath();
        ctx.arc(
            cx,
            cy,
            this.cellSize * 0.25,
            0,
            Math.PI * 2,
        );

        ctx.fill();
    }
}