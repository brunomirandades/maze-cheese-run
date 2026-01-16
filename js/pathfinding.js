/* ============================
   DFS Pathfinding for the Maze
   ============================ */

/*export*/ class DFSPathfinder {
    constructor(maze) {
        this.maze = maze;
    }

    /* ------------------------------------
       Find a path from start to target (DFS)
       ------------------------------------ */
    findPathDFS(start, target) {
        // Validate input safely
        if (!this.#isValidCell(start) || !this.#isValidCell(target)) {
            return [];
        }

        const stack = [];
        const visited = new Set();
        const parentMap = new Map();

        const key = (r, c) => `${r},${c}`;

        const startCell = { row: start.row, col: start.col }
        stack.push(startCell);
        visited.add(key(start.row, start.col));

        while (stack.length > 0) {
            const current = stack.pop();

            // Stop when target is found
            if (current.row === target.row && current.col === target.col) {
                return this.#reconstructPath(parentMap, current);
            }

            const neighbors = this.#getValidNeighbors(current);

            for (const next of neighbors) {
                const k = key(next.row, next.col);

                if (!visited.has(k)) {
                    visited.add(k);
                    parentMap.set(k, current);
                    stack.push(next);
                }
            }
        }

        // No path (should never happen in our maze)
        return [];
    }

    /* ------------------------------------
    Find a path from start to target (BFS)
    ------------------------------------ */
    findPathBFS(start, target) {
        // Validate input safely
        if (!this.#isValidCell(start) || !this.#isValidCell(target)) {
            return [];
        }

        const queue = [];
        const visited = new Set();
        const parentMap = new Map();

        const key = (r, c) => `${r},${c}`;

        const startCell = { row: start.row, col: start.col };

        queue.push(startCell);
        visited.add(key(start.row, start.col));

        while (queue.length > 0) {
            const current = queue.shift(); // FIFO = BFS

            // Target reached
            if (current.row === target.row && current.col === target.col) {
                return this.#reconstructPath(parentMap, current);
            }

            const neighbors = this.#getValidNeighbors(current);

            for (const next of neighbors) {
                const k = key(next.row, next.col);

                if (!visited.has(k)) {
                    visited.add(k);
                    parentMap.set(k, current);
                    queue.push(next); // enqueue
                }
            }
        }

        // No path (should never happen in this maze)
        return [];
    }


    /* ------------------------------------
       Get walkable neighbors from a cell
       ------------------------------------ */
    #getValidNeighbors(cell) {
        const { row, col } = cell;
        const result = [];

        const maze = this.maze;

        if (!maze.isBlocked(row, col, "top") && row > 0)
            result.push({ row: row - 1, col });

        if (!maze.isBlocked(row, col, "bottom") && row < maze.rows - 1)
            result.push({ row: row + 1, col });

        if (!maze.isBlocked(row, col, "left") && col > 0)
            result.push({ row, col: col - 1 });

        if (!maze.isBlocked(row, col, "right") && col < maze.cols - 1)
            result.push({ row, col: col + 1 });

        return result;
    }

    /* ------------------------------------
       Rebuild path from DFS parents
       ------------------------------------ */
    #reconstructPath(parentMap, endCell) {
        const path = [];
        let current = endCell;

        const key = (r, c) => `${r},${c}`;

        while (current) {
            path.push(current);
            current = parentMap.get(key(current.row, current.col));
        }

        return path.reverse();
    }

    /* ------------------------------------
       Input validation
       ------------------------------------ */
    #isValidCell(cell) {
        return (
            cell &&
            Number.isInteger(cell.row) &&
            Number.isInteger(cell.col) &&
            cell.row >= 0 &&
            cell.row < this.maze.rows &&
            cell.col >= 0 &&
            cell.col < this.maze.cols
        );
    }
}
