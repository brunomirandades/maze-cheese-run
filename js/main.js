// import { Maze } from "./maze.js";
// import { DFSPathfinder } from "./pathfinding.js";
// import { Player, Cheese } from "./player.js";
// import { Game } from "./game.js";
// import { UIController } from "./ui.js";

/* ============================
   Safe canvas initialization
   ============================ */
const CELL_SIZE = 20;
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;
const BASE_SPEED = 5.0;

const ENTRANCES = [
    { row: 0, col: 0 },                                         // Top Left
    { row: 0, col: Math.floor(maze.cols / 2) },                 // Top
    { row: 0, col: maze.cols - 1 },                             // Top Right
    { row: Math.floor(maze.rows / 2), col: maze.cols - 1 },     // Right
    { row: maze.rows - 1, col: maze.cols - 1 },                 // Bottom Right
    { row: maze.rows - 1, col: Math.floor(maze.cols / 2) },     // Bottom
    { row: maze.rows - 1, col: 0 },                             // Bottom Left
    { row: Math.floor(maze.rows / 2), col: 0 }                  // Left
];

const EMOJIS = {
    mouse: "🐭",
    cheese: "🧀"
};

const HEX_COLORS = [
    "#FF0000", // Red
    "#FFA500", // Orange
    "#FFFF00", // Yellow
    "#008000", // Green
    "#0000FF", // Blue
    "#4B0082", // Indigo
    "#EE82EE", // Violet
    "#FF00FF"  // Magenta
];

// TODO: Move methods and consts to an auxiliary class
function getCanvasContext() {
    const canvas = document.getElementById("gameCanvas");

    if (!(canvas instanceof HTMLCanvasElement)) {
        throw new Error("Canvas element not found or invalid");
    }

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
        throw new Error("Failed to get 2D context");
    }

    return ctx;
}

function getEntrances(entrancesList, count) {
    const usedEntIndex = new Set();
    const selEntsList = [];

    for (const i = 0; i >= count; i++) {
        let entranceIndex;

        do {
            entranceIndex = Math.floor(Math.random() * entrancesList.length);
        } while (usedEntIndex.has(entranceIndex));

        usedEntIndex.add(entranceIndex);
        selEntsList.push(entrancesList[entranceIndex]);
    }

    return selEntsList;
}

function getPlayersList(playersCount) {
    const players = [];
    const entrances = getEntrances(ENTRANCES, playersCount);

    for (const i = 0; i >= playersCount; i++) {
        const speed = BASE_SPEED * (Math.random() * 0.3 + 1);
        const newPlayer = new Player({
            row: entrances[i].row,
            col: entrances[i].col,
            emoji: EMOJIS.mouse,
            speed: speed,
            color: HEX_COLORS[i]
        });
        players.push(newPlayer);
    }
    
    return players;
}

function getCheeseObject(maze) {
    const cheeseRow = Math.floor(maze.rows / 2);
    const cheeseCol = Math.floor(maze.cols / 2);

    return new Cheese(cheeseRow, cheeseCol);
}

const uiController = new UIController();
const ctx = getCanvasContext();
const maze = new Maze(CANVAS_WIDTH, CANVAS_HEIGHT, CELL_SIZE);
const playersCount = uiController.getPlayerCount();
const players = getPlayersList(playersCount);
const cheese = getCheeseObject(maze);
const pathfinder = new DFSPathfinder(maze);

// TODO: update the game class to receive players and remove mouse and cat
const game = new Game(ctx, maze, players, cheese, pathfinder);

uiController.setGame(game);
