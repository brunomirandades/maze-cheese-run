/* ============================
   Game Engine
   ============================ */

/*import { GameState } from "./gamestate.js";

export*/class Game {
    constructor(ctx, maze, cat, mouse, cheese, pathfinder) {
        this.ctx = ctx;
        this.maze = maze;
        this.cat = cat;
        this.mouse = mouse;
        this.cheese = cheese;
        this.pathfinder = pathfinder;

        this.state = GameState.STOPPED;
        this.lastTime = 0;
        this.winner = null;

        // Setting player paths
        this.#setPlayerPaths();
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
        this.mouse.update(deltaTime, this.maze.cellSize);
        this.cat.update(deltaTime, this.maze.cellSize);

        // Check win conditions
        this.#checkWin();
    }

    #setPlayerPaths() {
        this.mouse.setPath(this.pathfinder.findPathDFS(this.mouse, this.cheese));
        const intercept = this.#getInterceptCell();
        this.cat.setPath(this.pathfinder.findPathBFS(this.cat, intercept));
    }

    #getInterceptCell() {
        if (!this.mouse.path || this.mouse.path.length === 0) {
            return this.mouse.cell;
        }

        // Cat speed advantage (15–20%)
        const speedRatio = this.cat.speed / this.mouse.speed;

        // How far ahead on the mouse path the cat should aim
        const lead = Math.floor(this.mouse.path.length * 0.35 * speedRatio);

        const index = Math.min(
            this.mouse.path.length - 1,
            Math.max(0, lead)
        );

        return this.mouse.path[index];
    }

    /* --------------------------------
       Win logic
       -------------------------------- */
    #checkWin() {
        if (this.mouse.isOnSameCell(this.cheese)) {
            this.winner = "mouse";
            this.state = GameState.ENDED;
        }

        if (this.cat.isOnSameCell(this.mouse)) {
            this.winner = "cat";
            this.state = GameState.ENDED;
        }
    }

    /* --------------------------------
       Render
       -------------------------------- */
    render() {
        this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        this.#drawMaze();
        this.cheese.draw(this.ctx, this.maze.cellSize);
        this.mouse.draw(this.ctx);
        this.cat.draw(this.ctx);

        // Debug
        // this.#drawGrid();
        this.#drawPath(
            this.mouse.path,
            this.mouse.pathIndex,
            this.mouse.x,
            this.mouse.y,
            "rgba(0,0,255,0.15)"
        );

        this.#drawPath(
            this.cat.path,
            this.cat.pathIndex,
            this.cat.x,
            this.cat.y,
            "rgba(255,0,0,0.15)"
        );

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
