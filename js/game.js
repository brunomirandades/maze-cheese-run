/**
 * Game engine class
 */
class Game {
    /**
     * @param {Object} ctx - Canvas context
     * @param {Object} maze - New maze object
     * @param {Array} players - List of player objects
     * @param {Object} cheese - New cheese object 
     * @param {Object} pathfinder - New pathfinder object to calculate maze paths 
     * @param {number} canvasWidth - Width of the canvas bounds
     * @param {number} canvasHeight - Height of the canvas bounds
     */
    constructor(ctx, maze, players, cheese, pathfinder, canvasWidth, canvasHeight) {
        this.ctx = ctx;
        this.maze = maze;
        this.players = players;
        this.cheese = cheese;
        this.pathfinder = pathfinder;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        this.state = GameState.STOPPED;
        this.lastTime = 0;
        this.winner = null;
        this.animationId = null;

        // Setting player paths
        this.#setPlayersPaths();
    }

    /**
     * Start the game animation of not running
     * @returns {void}
     */
    start() {
        if (this.state === GameState.RUNNING) return;

        this.state = GameState.RUNNING;
        this.lastTime = performance.now();
        this.animationId = requestAnimationFrame(this.#loop.bind(this));
    }

    /**
     * Stop the game if running and cancel animation frame
     * @returns {void}
     */
    stop() {
        if (this.state !== GameState.RUNNING) return;
        
        this.state = GameState.STOPPED;
        cancelAnimationFrame(this.animationId);
    }

    /**
     * Game animation loop
     * @param {number} timestamp 
     * @returns {void}
     */
    #loop(timestamp) {
        if (this.state !== GameState.RUNNING) return;

        const deltaTime = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        this.update(deltaTime);
        this.render();

        this.animationId = requestAnimationFrame(this.#loop.bind(this));
    }

    /**
     * Update the game screen to generate animation
     * @param {number} deltaTime - time diff between animation frames
     * @returns {void}
     */
    update(deltaTime) {
        // Move players
        for (const player of this.players) {
            player.update(deltaTime, this.maze.cellSize);
        }

        // Check win conditions
        this.#checkWin();
    }

    /**
     * Define the path inside the maze for each player in the players list
     * @returns {void}
     */
    #setPlayersPaths() {
        const strategies = [
            this.pathfinder.findPathBFS.bind(this.pathfinder),
            this.pathfinder.findPathDFS.bind(this.pathfinder)
        ];

        for (const player of this.players) {
            const strategy = strategies[Math.floor(Math.random() * strategies.length)];

            player.setPath(strategy(player, this.cheese));
        }
    }

    /**
     * Check the game win condition
     * @returns {void}
     */
    #checkWin() {
        for (const player of this.players) {
            if (player.isOnSameCell(this.cheese)) {
                this.winner = player;
                this.state = GameState.ENDED;
                break;
            }
        }
    }

    /**
     * Render routine for all the game elements
     * @returns {void}
     */
    render() {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

        this.#drawMaze();
        this.cheese.draw(this.ctx, this.maze.cellSize);

        for (const player of this.players) {
            // Draw player
            player.draw(this.ctx);

            // Draw player's path
            const transpColor = `${player.color.hex}26`;    // Adding transparency
            this.#drawPath(
                player.path,
                player.pathIndex,
                player.x,
                player.y,
                transpColor
            );
        }

        if (this.state === GameState.ENDED) {
            this.#drawWinScreen();
        }
    }

    /**
     * Draw the maze on canvas
     * @returns {void}
     */
    #drawMaze() {
        const size = this.maze.cellSize;
        const ctx = this.ctx;

        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;

        for (const row of this.maze.grid) {
            for (const cell of row) {
                const x = cell.col * size;
                const y = cell.row * size;

                if (cell.walls.top) {
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + size, y);
                    ctx.stroke();
                }
                if (cell.walls.right) {
                    ctx.beginPath();
                    ctx.moveTo(x + size, y);
                    ctx.lineTo(x + size, y + size);
                    ctx.stroke();
                }
                if (cell.walls.bottom) {
                    ctx.beginPath();
                    ctx.moveTo(x + size, y + size);
                    ctx.lineTo(x, y + size);
                    ctx.stroke();
                }
                if (cell.walls.left) {
                    ctx.beginPath();
                    ctx.moveTo(x, y + size);
                    ctx.lineTo(x, y);
                    ctx.stroke();
                }
            }
        }
    }

    /**
     * Draw player's path
     * @param {Object} path - Path object with draw directions
     * @param {number} index - Path array current index
     * @param {number} playerX - Player's X position 
     * @param {number} playerY - Player's Y position
     * @param {string} color - Player's color hex
     * @returns 
     */
    #drawPath(path, index, playerX, playerY, color) {
        if (!path || path.length < 2 || index <= 0) return;

        const ctx = this.ctx;
        const size = this.maze.cellSize;

        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = size / 3;
        ctx.lineCap = "round";
        ctx.lineJoin = "round"; // smooth corners

        ctx.beginPath();

        // Draw completed segments
        for (let i = 0; i < index; i++) {
            const cell = path[i];
            const x = cell.col * size + size / 2;
            const y = cell.row * size + size / 2;

            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }

        // Draw partial segment to current player position
        ctx.lineTo(playerX, playerY);

        ctx.stroke();
        ctx.restore();
    }

    /**
     * Draw win screen card on canvas showing winning player
     * @returns {void}
     */
    #drawWinScreen() {
        const ctx = this.ctx;

        // Dark background
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

        // Box geometry
        const boxW = 320;
        const boxH = 200;
        const x = (this.canvasWidth - boxW) / 2;
        const y = (this.canvasHeight - boxH) / 2;
        const r = 20;

        /* -----------------------------
        Enable shadow
        ----------------------------- */
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowBlur = 20;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 8;

        // Draw rounded rectangle
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + boxW - r, y);
        ctx.quadraticCurveTo(x + boxW, y, x + boxW, y + r);
        ctx.lineTo(x + boxW, y + boxH - r);
        ctx.quadraticCurveTo(x + boxW, y + boxH, x + boxW - r, y + boxH);
        ctx.lineTo(x + r, y + boxH);
        ctx.quadraticCurveTo(x, y + boxH, x, y + boxH - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.fill();

        /* -----------------------------
        Disable shadow (important!)
        ----------------------------- */
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        const winnerEmoji = this.winner.emoji;
        const colorName = this.winner.color.name;
        const colorEmoji = this.winner.color.emoji;

        // Emojis and text
        ctx.font = "64px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#000000ff";

        ctx.fillText(
            `${EMOJIS.throphy} ${colorEmoji} ${EMOJIS.throphy}`,
            this.canvasWidth / 2,
            y + 60
        );

        ctx.font = "24px monospace";
        ctx.fillText(
            `${EMOJIS.medal} ${colorName.toUpperCase()} ${winnerEmoji} WINS ${EMOJIS.medal}`,
            this.canvasWidth / 2,
            y + 120
        );

        ctx.font = "16px monospace";
        ctx.fillText(
            `Press Reset for new round!`,
            this.canvasWidth / 2,
            y + 160
        );

    }

}