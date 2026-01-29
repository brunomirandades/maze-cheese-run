// import { Maze } from "./maze.js";
// import { DFSPathfinder } from "./pathfinding.js";
// import { Player, Cheese } from "./player.js";
// import { Game } from "./game.js";
// import { UIController } from "./ui.js";

const {canvas, ctx} = GameSupport.getCanvasContext();

let game = null;
let isMobile = false;

resizeCanvas(canvas);
window.addEventListener("resize", () => resizeCanvas(canvas));

document.getElementById("startBtn").onclick = startGame;
document.getElementById("stopBtn").onclick = stopGame;
document.getElementById("resetBtn").onclick = resetGame;
const playerCountLabel = document.getElementById("player-count-value");
const playerCountInput = document.getElementById("player-count");

playerCountInput.addEventListener("input", () => {
    playerCountLabel.textContent = parseInt(playerCountInput.value);
});

updateUIElements();

function updateUIElements() {
    playerCountInput.dispatchEvent(new Event('input'));

    // More elements will be added in the future
    return;
}

function getUISettings() {
    const playerCount = parseInt(playerCountInput.value);

    // Returning as obj because more UI settings will
    // be added in the future
    return { playerCount };
}

function getGameParameters() {
    let { playerCount } = getUISettings();

    const maze = new Maze(canvas.width, canvas.height, CELL_SIZE);

    const entrances = [
        { pos: "top-left",      row: 0,                         col: 0 },
        { pos: "top-right",     row: 0,                         col: maze.cols - 1 },
        { pos: "bottom-right",  row: maze.rows - 1,             col: maze.cols - 1 },
        { pos: "bottom-left",   row: maze.rows - 1,             col: 0 },
    ];

    if (!isMobile) {
        const additionalEntrances = [
            { pos: "top",           row: 0,                         col: Math.floor(maze.cols / 2) },
            { pos: "right",         row: Math.floor(maze.rows / 2), col: maze.cols - 1 },
            { pos: "bottom",        row: maze.rows - 1,             col: Math.floor(maze.cols / 2) },
            { pos: "left",          row: Math.floor(maze.rows / 2), col: 0 }
        ];
        entrances.push(...additionalEntrances);
    } else if (isMobile && playerCount > MAX_MOBILE_PLAYERS) {
        playerCount = MAX_MOBILE_PLAYERS;
        playerCountInput.value = MAX_MOBILE_PLAYERS;
        updateUIElements();
    }

    const players = GameSupport.createPlayers(
        playerCount,
        entrances
    );

    const cheese = GameSupport.createCheese(maze);
    const pathfinder = new DFSPathfinder(maze);

    return {
        maze,
        players,
        cheese,
        pathfinder
    };
}

function startGame() {
    if (game && game.state == GameState.RUNNING) return;    // avoid double loops

    if (!game) {
        const { maze, players, cheese, pathfinder } = getGameParameters();
        game = new Game(ctx, maze, players, cheese, pathfinder, canvas.width, canvas.height);
    }

    game.start();
    return;
}

function stopGame() {
    if (!game) return;
    
    // TODO: check if needed to add a game
    // animationId and cancelAnimationFrame
    game.stop();
    return;
}

function resetGame() {
    stopGame();

    game = null;

    startGame();
    return;
}

function resizeCanvas(canvas) {
    isMobile = window.innerWidth < MOBILE_INNER_WIDTH;

    let cols, rows;

    if (isMobile) {
        const maxWidth = Math.min(window.innerWidth, MIN_MOBILE_INNER_WIDTH);

        // Number of whole cells that fit
        cols = Math.floor(maxWidth / CELL_SIZE);

        // Keep maze square (optional, but cleaner)
        rows = Math.floor(cols * 1.6);

    } else {
        cols = DESKTOP_CANVAS_WIDTH / CELL_SIZE;
        rows = DESKTOP_CANVAS_HEIGHT / CELL_SIZE;
    }

    const newWidth = cols * CELL_SIZE;
    const newHeight = rows * CELL_SIZE;

    canvas.width = newWidth;
    canvas.height = newHeight;

    if (game) resetGame();
}
