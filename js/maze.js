/**
 * Maze builder class
 */
class Maze {
    /**
     * @param {number} canvasWidth 
     * @param {number} canvasHeight 
     * @param {number} cellSize 
     */
    constructor(canvasWidth, canvasHeight, cellSize = 20) {
        this.cellSize = cellSize;

        // Calculate grid size safely
        this.cols = Math.floor(canvasWidth / cellSize);
        this.rows = Math.floor(canvasHeight / cellSize);

        // 2D grid of cells
        this.grid = [];

        this.#createGrid();
        this.#generateMaze();
    }

    /**
     * Create Maze grids
     * @returns {void}
     */
    #createGrid() {
        for (let row = 0; row < this.rows; row++) {
            this.grid[row] = [];
            for (let col = 0; col < this.cols; col++) {
                this.grid[row][col] = {
                    row,
                    col,
                    visited: false,
                    walls: {
                        top: true,
                        right: true,
                        bottom: true,
                        left: true
                    }
                };
            }
        }
    }

    /**
     * Generate Maze structure according to grid
     * @returns {void}
     */
    #generateMaze() {
        const stack = [];
        let current = this.grid[0][0];
        current.visited = true;

        do {
            const next = this.#getRandomUnvisitedNeighbor(current);

            if (next) {
                stack.push(current);
                this.#removeWalls(current, next);
                next.visited = true;
                current = next;
            } else {
                current = stack.pop();
            }
        } while (stack.length > 0);
    }

    /**
     * Get a random unvisited neighbor of the passing cell
     * @param {Object} cell - Grid cell to be checked
     * @returns {Array} - Returns an array of valid unvisited neighbors
     */
    #getRandomUnvisitedNeighbor(cell) {
        const { row, col } = cell;
        const neighbors = [];

        const directions = [
            { r: -1, c: 0 },
            { r: 1, c: 0 },
            { r: 0, c: -1 },
            { r: 0, c: 1 }
        ];

        for (const d of directions) {
            const nr = row + d.r;
            const nc = col + d.c;

            if (
                nr >= 0 && nr < this.rows &&
                nc >= 0 && nc < this.cols &&
                !this.grid[nr][nc].visited
            ) {
                neighbors.push(this.grid[nr][nc]);
            }
        }

        if (neighbors.length === 0) return null;

        const index = Math.floor(Math.random() * neighbors.length);
        return neighbors[index];
    }

    /**
     * Remove walls between two cells
     * @param {Object} current - Current cell
     * @param {Object} next - Next neighbor cell 
     */
    #removeWalls(current, next) {
        const x = current.col - next.col;
        const y = current.row - next.row;

        if (x === 1) {
            current.walls.left = false;
            next.walls.right = false;
        } else if (x === -1) {
            current.walls.right = false;
            next.walls.left = false;
        }

        if (y === 1) {
            current.walls.top = false;
            next.walls.bottom = false;
        } else if (y === -1) {
            current.walls.bottom = false;
            next.walls.top = false;
        }
    }

    /**
     * Check if a cell's given direction is blocked
     * @param {number} row - cell row
     * @param {number} col - cell column
     * @param {string} direction - cell direction (top, right, bottom, left) 
     * @returns {boolean} - returns true if the given direction contains a wall
     */
    isBlocked(row, col, direction) {
        return this.grid[row][col].walls[direction];
    }
}
