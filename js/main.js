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
const BASE_SPEED = 4.0;

const uiController = new UIController();

const maze = new Maze(CANVAS_WIDTH, CANVAS_HEIGHT, CELL_SIZE);
const ENTRANCES = [
    { pos: "top-left",      row: 0,                         col: 0 },
    { pos: "top",           row: 0,                         col: Math.floor(maze.cols / 2) },
    { pos: "top-right",     row: 0,                         col: maze.cols - 1 },
    { pos: "right",         row: Math.floor(maze.rows / 2), col: maze.cols - 1 },
    { pos: "bottom-right",  row: maze.rows - 1,             col: maze.cols - 1 },
    { pos: "bottom",        row: maze.rows - 1,             col: Math.floor(maze.cols / 2) },
    { pos: "bottom-left",   row: maze.rows - 1,             col: 0 },
    { pos: "left",          row: Math.floor(maze.rows / 2), col: 0 }
];

const EMOJIS = {
    mouse: "🐭",
    cheese: "🧀",
    throphy: "🏆",
    medal: "🥇"
};

const COLORS = [
  { name: "Red",    hex: "#FF0000", emoji: "🔴" },
  { name: "Orange", hex: "#FFA500", emoji: "🟠" },
  { name: "Yellow", hex: "#FFFF00", emoji: "🟡" },
  { name: "Green",  hex: "#008000", emoji: "🟢" },
  { name: "Blue",   hex: "#0000FF", emoji: "🔵" },
  { name: "Purple", hex: "#800080", emoji: "🟣" },
  { name: "Brown",  hex: "#A52A2A", emoji: "🟤" },
  { name: "Black",  hex: "#000000", emoji: "⚫" }
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

    for (let i = 0; i < count; i++) {
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

    for (let i = 0; i < playersCount; i++) {
        const speed = BASE_SPEED * (Math.random() * 0.3 + 1);
        const newPlayer = new Player({
            row: entrances[i].row,
            col: entrances[i].col,
            emoji: EMOJIS.mouse,
            speed: speed,
            color: COLORS[i]
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

const ctx = getCanvasContext();
const playersCount = uiController.getPlayerCount();
const players = getPlayersList(playersCount);
const cheese = getCheeseObject(maze);
const pathfinder = new DFSPathfinder(maze);

const game = new Game(ctx, maze, players, cheese, pathfinder);

uiController.setGame(game);
