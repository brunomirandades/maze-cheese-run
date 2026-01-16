/* ============================
   UI Controller
   ============================ */

// import { GameState } from "./gamestate.js";

/**export**/ class UIController {
    constructor() {
        this.game = null;

        this.startBtn = document.getElementById("startBtn");
        this.stopBtn = document.getElementById("stopBtn");
        this.resetBtn = document.getElementById("resetBtn");
        this.playerInput = document.getElementById("player-count");
        this.playerValue = document.getElementById("player-count-value");

        this.playerCount = this.#getSafePlayerCount(this.playerInput.value);

        this.#validate();
        this.#bind();
    }

    /* -----------------------------
       Validate DOM references
       ----------------------------- */
    #validate() {
        if (!this.startBtn ||
            !this.stopBtn ||
            !this.resetBtn ||
            !this.playerInput ||
            !this.playerValue) {
            throw new Error("UI elements not found");
        }
    }

    /* -----------------------------
       Bind buttons safely
       ----------------------------- */
    #bind() {
        if (this.game) {
            this.startBtn.addEventListener("click", () => {
                if (this.game.state !== GameState.RUNNING) {
                    this.game.start();
                }
            });

            this.stopBtn.addEventListener("click", () => {
                this.game.stop();
            });

            this.resetBtn.addEventListener("click", () => {
                window.location.reload(); // safest full reset
            });
        }
        
        this.playerInput.addEventListener("input", () => {
            const count = this.getSafePlayerCount(this.playerInput.value);
            this.playerCount = count;
            this.playerValue.textContent = count;
        });
    }

    setGame(game) {
        if (!game) return;

        this.game = game;
        this.#bind();
    }

    #getSafePlayerCount(value) {
        const n = Number(value);

        if (!Number.isInteger(n)) return 1;
        if (n < 1) return 1;
        if (n > 8) return 8;

        return n;
    }
}
