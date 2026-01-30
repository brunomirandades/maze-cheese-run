// Getting canvas and context from DOM
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

// Updating the players label according to slider position
playerCountInput.addEventListener("input", () => {
    playerCountLabel.textContent = parseInt(playerCountInput.value);
});

updateUIElements();

/**
 * Update UI elements' events
 * @returns void
 */
function updateUIElements() {
    playerCountInput.dispatchEvent(new Event('input'));

    // More elements will be added in the future
    return;
}

/**
 * Get the game settings from UI elements
 * @returns {Object} UI settings elements values
 */
function getUISettings() {
    const playerCount = parseInt(playerCountInput.value);

    // Returning as obj because more UI settings will
    // be added in the future
    return { playerCount };
}

/**
 * Get the parameters necessary to create a new game
 * @returns {Object} parameters for a new game
 */
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

/**
 * Start game if paused or create a new game if none running
 * @returns {void}
 */
function startGame() {
    if (game && game.state == GameState.RUNNING) return;    // avoid double loops

    if (!game) {
        const { maze, players, cheese, pathfinder } = getGameParameters();
        game = new Game(ctx, maze, players, cheese, pathfinder, canvas.width, canvas.height);
    }

    game.start();
}

/**
 * Force stop the game if running 
 * @returns {void}
 */
function stopGame() {
    if (!game) return;
    
    game.stop();
}

/**
 * Force stop the game and start a new one
 * @returns {void}
 */
function resetGame() {
    stopGame();

    game = null;

    startGame();
}

/**
 * Resize the canvas according to the type and size of the screen
 * @param {Object} canvas 
 */
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