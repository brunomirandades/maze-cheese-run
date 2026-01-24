/**
 * Class for support methods used in main
 */
class GameSupport {
    /**
     * Canvas context getter
     * @param {String} canvasId 
     * @returns {Object} context
     */
    static getCanvasContext(canvasId = "gameCanvas") {
        const canvas = document.getElementById("gameCanvas");

        if (!(canvas instanceof HTMLCanvasElement)) {
            throw new Error("Canvas element not found or invalid");
        }

        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;

        const ctx = canvas.getContext("2d");

        if (!ctx) {
            throw new Error("Failed to get 2D context");
        }

        return ctx;
    }

    /**
     * Get maze entrances positions
     * @param {Array} entrances 
     * @param {Number} count 
     * @returns {Array} randomly selected entrances
     */
    static getEntrances(entrances, count) {
        const used = new Set();
        const selected = [];

        while (selected.length < count) {
            const index = Math.floor(Math.random() * entrances.length);
            if (!used.has(index)) {
                used.add(index);
                selected.push(entrances[index]);
            }
        }

        return selected;
    }

    /**
     * Create a new collection of players and set them to position
     * @param {Number} count 
     * @param {Array} entrances 
     * @returns {Array} collection of player objects
     */
    static createPlayers(count, entrances) {
        const players = [];
        const selectedEntrances = this.getEntrances(entrances, count);

        for (let i = 0; i < count; i++) {
            const speed = BASE_SPEED * (1 + Math.random() * 0.3);

            players.push(new Player({
                row: selectedEntrances[i].row,
                col: selectedEntrances[i].col,
                emoji: EMOJIS.mouse,
                speed,
                color: COLORS[i % COLORS.length]
            }));
        }
        
        return players;
    }

    /**
     * Create a cheese object at the center of the maze
     * @param {Object} maze 
     * @returns {Object} new cheese centered in the maze
     */
    static createCheese(maze) {
        return new Cheese(
            Math.floor(maze.rows / 2),
            Math.floor(maze.cols / 2)
        )
    }
}