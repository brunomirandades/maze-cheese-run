// import { Maze } from "./maze.js";
// import { DFSPathfinder } from "./pathfinding.js";
// import { Player, Cheese } from "./player.js";
// import { Game } from "./game.js";
// import { UIController } from "./ui.js";

const {canvas, ctx} = GameSupport.getCanvasContext();

let game = null;

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
    const maze = new Maze(canvas.width, canvas.height, CELL_SIZE);

    const entrances = [
        { pos: "top-left",      row: 0,                         col: 0 },
        { pos: "top",           row: 0,                         col: Math.floor(maze.cols / 2) },
        { pos: "top-right",     row: 0,                         col: maze.cols - 1 },
        { pos: "right",         row: Math.floor(maze.rows / 2), col: maze.cols - 1 },
        { pos: "bottom-right",  row: maze.rows - 1,             col: maze.cols - 1 },
        { pos: "bottom",        row: maze.rows - 1,             col: Math.floor(maze.cols / 2) },
        { pos: "bottom-left",   row: maze.rows - 1,             col: 0 },
        { pos: "left",          row: Math.floor(maze.rows / 2), col: 0 }
    ];

    const { playerCount } = getUISettings();

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
        game = new Game(ctx, maze, players, cheese, pathfinder);
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
    const isMobile = window.innerWidth < 900;

    if (isMobile) {
        canvas.width = Math.min(window.innerWidth, 360);
        canvas.height = Math.floor(window.innerHeight * 0.7);
    } else {
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;
    }

    if (game)
        resetGame();

    return;
}
