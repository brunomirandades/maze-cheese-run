// import { Maze } from "./maze.js";
// import { DFSPathfinder } from "./pathfinding.js";
// import { Player, Cheese } from "./player.js";
// import { Game } from "./game.js";
// import { UIController } from "./ui.js";

/* ============================
   Safe canvas initialization
   ============================ */

const canvas = document.getElementById("gameCanvas");
const uiController = new UIController();

if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error("Canvas element not found or invalid");
}

const ctx = canvas.getContext("2d");

if (!ctx) {
    throw new Error("Failed to get 2D context");
}

const CELL_SIZE = 20;
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const maze = new Maze(CANVAS_WIDTH, CANVAS_HEIGHT, CELL_SIZE);

const entrances = [
    { row: 0, col: Math.floor(maze.cols / 2) },                  // Top
    { row: maze.rows - 1, col: Math.floor(maze.cols / 2) },     // Bottom
    { row: Math.floor(maze.rows / 2), col: 0 },                 // Left
    { row: Math.floor(maze.rows / 2), col: maze.cols - 1 }      // Right
];

function pickTwoDifferentEntrances(list) {
    const firstIndex = Math.floor(Math.random() * list.length);

    let secondIndex;
    do {
        secondIndex = Math.floor(Math.random() * list.length);
    } while (secondIndex === firstIndex);

    return [list[firstIndex], list[secondIndex]];
}

const [mouseStart, catStart] = pickTwoDifferentEntrances(entrances);

const cheeseRow = Math.floor(maze.rows / 2);
const cheeseCol = Math.floor(maze.cols / 2);

const cheese = new Cheese(cheeseRow, cheeseCol);
const mouseSpeed = 5.0;

const mouse = new Player({
    row: mouseStart.row,
    col: mouseStart.col,
    emoji: "🐭",
    speed: mouseSpeed
});

const catSpeed = mouseSpeed * (Math.random() * 0.8 + 1);

const cat = new Player({
    row: catStart.row,
    col: catStart.col,
    emoji: "🐱",
    speed: catSpeed
});

const pathfinder = new DFSPathfinder(maze);

const players = uiController.playerCount;

const game = new Game(ctx, maze, cat, mouse, cheese, pathfinder);

uiController.setGame(game);
