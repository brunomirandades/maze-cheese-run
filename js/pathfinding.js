/**
 * Path finder class
 */
class DFSPathfinder {
    /**
     * @param {Object} maze - the maze to be processed
     */
    constructor(maze) {
        this.maze = maze;
    }

    /**
     * Find path between start position and target position (using DFS algo)
     * @param {Object} start - Start position in maze grid
     * @param {Object} target - Target position in maze grid
     * @returns {Object} - Path array
     */
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

    /**
     * Find the path between the starting maze position and target position (using BFS algo)
     * @param {Object} start - Start position in the maze grid
     * @param {Object} target - Target position in the maze grid
     * @returns {Object} - Path array
     */
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

    /**
     * Get valid neighbors for the given cell by checking
     * the surround cells if the walls between them are blocked 
     * @param {Object} cell - Cell being checked
     * @returns {Array} - Collection of valid neighbors
     */
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

    /**
     * Support method to macke the final path calculated by algo
     * @param {Array} parentMap - Calculated path by algo
     * @param {Object} endCell - End position path cell 
     * @returns {Array} - Ajusted path in reverse order (start to target)
     */
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

    /**
     * Check if the cell is valid - inside the canvas
     * @param {Object} cell - Cell to be checked
     * @returns {boolean} - True if valid cell 
     */
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
