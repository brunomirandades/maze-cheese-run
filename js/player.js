/**
 * Player defining class
 */
class Player {
    /**
     * @param {number} row - Player starting row
     * @param {number} col - Player starting col 
     * @param {string} emoji - Emoji character for player
     * @param {number} speed - Player movement speed 
     * @param {Object} color - Player's path color obj (name, hex, emoji)
     */
    constructor( row, col, emoji, speed, color ) {
        this.row = row;
        this.col = col;
        this.emoji = emoji;
        this.speed = speed; // cells per second
        this.color = color;

        // Path produced by DFS
        this.path = [];
        this.pathIndex = 0;

        // Pixel position (for smooth animation)
        this.x = 0;
        this.y = 0;

        // Used to avoid jitter
        this.#syncToGrid();
    }

    /**
     * Set path to player
     * @param {Array} path - Player path to target
     * @returns {void}
     */
    setPath(path) {
        // Validate input
        if (!Array.isArray(path) || path.length === 0) return;

        this.path = path;
        this.pathIndex = 0;
    }

    /**
     * Update player's position in path
     * @param {number} deltaTime - Time diff from last update
     * @param {number} cellSize - Maze grid cell size
     * @returns {void} 
     */
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

    /**
     * Draw the player on canvas 
     * @param {Object} ctx - Canvas context
     */
    draw(ctx) {
        ctx.font = "24px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.emoji, this.x, this.y);
    }

    /**
     * Check if player is on the same cell as target
     * @param {Object} target - Target
     * @returns {boolean} - True if both in same cell
     */
    isOnSameCell(target) {
        return this.row === target.row && this.col === target.col;
    }

    /**
     * Sinc player position to grid
     */
    #syncToGrid() {
        this.x = this.col * 20 + 10;
        this.y = this.row * 20 + 10;
    }
}

/**
 * Cheese model class
 */
class Cheese {
    /**
     * @param {number} row - Cheese position row
     * @param {number} col - Cheese position col 
     */
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.emoji = "🧀";
    }

    /**
     * Draw cheese on canvas
     * @param {Object} ctx - Canvas context 
     * @param {number} cellSize - Size of a grid cell 
     */
    draw(ctx, cellSize) {
        const x = this.col * cellSize + cellSize / 2;
        const y = this.row * cellSize + cellSize / 2;

        ctx.font = "24px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.emoji, x, y);
    }
}
