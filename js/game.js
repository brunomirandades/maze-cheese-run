/* ============================
   Game Engine
   ============================ */

/*import { GameState } from "./gamestate.js";

export*/class Game {
    constructor(ctx, maze, players, cheese, pathfinder) {
        this.ctx = ctx;
        this.maze = maze;
        this.players = players;
        this.cheese = cheese;
        this.pathfinder = pathfinder;

        this.state = GameState.STOPPED;
        this.lastTime = 0;
        this.winner = null;

        // Setting player paths
        this.#setPlayersPaths();
    }

    /* --------------------------------
       Start game
       -------------------------------- */
    start() {
        if (this.state === GameState.RUNNING) return;

        this.state = GameState.RUNNING;
        this.lastTime = performance.now();
        requestAnimationFrame(this.#loop.bind(this));
    }

    /* --------------------------------
       Stop (pause)
       -------------------------------- */
    stop() {
        if (this.state !== GameState.RUNNING) return;
        this.state = GameState.STOPPED;
    }

    /* --------------------------------
       Main loop
       -------------------------------- */
    #loop(timestamp) {
        if (this.state !== GameState.RUNNING) return;

        const deltaTime = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        this.update(deltaTime);
        this.render();

        requestAnimationFrame(this.#loop.bind(this));
    }

    /* --------------------------------
       Update logic
       -------------------------------- */
    update(deltaTime) {
        // Move players
        for (const player of this.players) {
            player.update(deltaTime, this.maze.cellSize);
        }

        // Check win conditions
        this.#checkWin();
    }

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

    /* --------------------------------
       Win logic
       -------------------------------- */
    #checkWin() {
        for (const player of this.players) {
            if (player.isOnSameCell(this.cheese)) {
                this.winner = player;
            this.state = GameState.ENDED;
                break;
        }
        }
    }

    /* --------------------------------
       Render
       -------------------------------- */
    render() {
        this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

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

        // Debug
        // this.#drawGrid();

        if (this.state === GameState.ENDED) {
            this.#drawWinScreen();
        }
    }

    /* --------------------------------
       Maze drawing
       -------------------------------- */
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

    #drawGrid() {
        const ctx = this.ctx;
        const size = this.maze.cellSize;

        ctx.save();

        // Light, non-intrusive color
        ctx.strokeStyle = "rgba(0,0,0,0.15)";
        ctx.lineWidth = 1;

        // Dotted lines
        ctx.setLineDash([3, 6]);

        // Vertical lines
        for (let x = 0; x <= CANVAS_WIDTH; x += size) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, CANVAS_HEIGHT);
            ctx.stroke();
        }

        // Horizontal lines
        for (let y = 0; y <= CANVAS_HEIGHT; y += size) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(CANVAS_WIDTH, y);
            ctx.stroke();
        }

        ctx.restore(); // important so dash does not affect other drawings
    }

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

    /* --------------------------------
    Draw Win Screen
    -------------------------------- */
    #drawWinScreen() {
        const ctx = this.ctx;

        // Dark background
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Box geometry
        const boxW = 300;
        const boxH = 180;
        const x = (CANVAS_WIDTH - boxW) / 2;
        const y = (CANVAS_HEIGHT - boxH) / 2;
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

        // Text
        ctx.fillStyle = "#000";
        ctx.font = "32px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const emoji = this.winner === "cat" ? "🐱" : "🐭";
        ctx.fillText(`${emoji} WINS!`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    }

}
