/* ============================
   Player System
   ============================ */

/*export*/ class Player {
    constructor({ row, col, emoji, speed }) {
        this.row = row;
        this.col = col;
        this.emoji = emoji;
        this.speed = speed; // cells per second

        // Path produced by DFS
        this.path = [];
        this.pathIndex = 0;

        // Pixel position (for smooth animation)
        this.x = 0;
        this.y = 0;

        // Used to avoid jitter
        this.#syncToGrid();
    }

    /* --------------------------------
       Set a new path safely
       -------------------------------- */
    setPath(path) {
        // Validate input
        if (!Array.isArray(path) || path.length === 0) return;

        this.path = path;
        this.pathIndex = 0;
    }

    /* --------------------------------
    Update movement
    -------------------------------- */
    update(deltaTime, cellSize) {
        // No path → nothing to do
        if (!this.path || this.pathIndex >= this.path.length) return;

        const targetCell = this.path[this.pathIndex];

        // Target pixel position (center of the cell)
        const targetX = targetCell.col * cellSize + cellSize / 2;
        const targetY = targetCell.row * cellSize + cellSize / 2;

        // Direction vector
        const dx = targetX - this.x;
        const dy = targetY - this.y;

        // Distance to target
        const distance = Math.hypot(dx, dy);

        // How far we move this frame
        const step = this.speed * cellSize * deltaTime;

        // If already on the target (avoid division by zero)
        if (distance === 0) {
            this.pathIndex++;
            return;
        }

        // If we can reach or pass the target this frame → snap to it
        if (distance <= step) {
            this.x = targetX;
            this.y = targetY;
            this.row = targetCell.row;
            this.col = targetCell.col;
            this.pathIndex++;
            return;
        }

        // Move toward target safely (distance > 0 guaranteed here)
        const nx = dx / distance;   // normalized direction X
        const ny = dy / distance;   // normalized direction Y

        this.x += nx * step;
        this.y += ny * step;
    }

    /* --------------------------------
       Draw player
       -------------------------------- */
    draw(ctx) {
        ctx.font = "24px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.emoji, this.x, this.y);
    }

    /* --------------------------------
       Collision check
       -------------------------------- */
    isOnSameCell(other) {
        return this.row === other.row && this.col === other.col;
    }

    /* --------------------------------
       Private helper
       -------------------------------- */
    #syncToGrid() {
        this.x = this.col * 20 + 10;
        this.y = this.row * 20 + 10;
    }
}

/*export*/ class Cheese {
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.emoji = "🧀";
    }

    draw(ctx, cellSize) {
        const x = this.col * cellSize + cellSize / 2;
        const y = this.row * cellSize + cellSize / 2;

        ctx.font = "24px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.emoji, x, y);
    }
}
