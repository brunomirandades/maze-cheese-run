/* ============================
   Maze Generator (Secure, Modern)
   ============================ */

/*export*/ class Maze {
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

    /* --------------------------
       Create empty grid
       -------------------------- */
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

    /* --------------------------------------
       Recursive Backtracking Maze
       -------------------------------------- */
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

    #removeWalls(a, b) {
        const x = a.col - b.col;
        const y = a.row - b.row;

        if (x === 1) {
            a.walls.left = false;
            b.walls.right = false;
        } else if (x === -1) {
            a.walls.right = false;
            b.walls.left = false;
        }

        if (y === 1) {
            a.walls.top = false;
            b.walls.bottom = false;
        } else if (y === -1) {
            a.walls.bottom = false;
            b.walls.top = false;
        }
    }

    /* --------------------------------
       Public method for collision grid
       -------------------------------- */
    isBlocked(row, col, direction) {
        return this.grid[row][col].walls[direction];
    }
}
