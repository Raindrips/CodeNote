import { Maze } from './Maze.js';
import { Player } from './Player.js';
import { Renderer } from './Renderer.js';

const canvas = document.querySelector('canvas')!;

const ctx = canvas.getContext('2d')!;

const maze = new Maze(20, 20);

maze.generate();

const player = new Player();

const renderer = new Renderer(ctx, 32);

window.addEventListener('keydown', (e) => {
    switch (e.key.toLowerCase()) {
        case 'w':
            player.moveUp(maze);
            break;

        case 's':
            player.moveDown(maze);
            break;

        case 'a':
            player.moveLeft(maze);
            break;

        case 'd':
            player.moveRight(maze);
            break;
    }

    renderer.draw(maze, player);
});

renderer.draw(maze, player);
