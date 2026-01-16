/* ============================
   UI Controller
   ============================ */

// import { GameState } from "./gamestate.js";

/**export**/ class UIController {
    constructor(game) {
        this.game = game;

        this.startBtn = document.getElementById("startBtn");
        this.stopBtn = document.getElementById("stopBtn");
        this.resetBtn = document.getElementById("resetBtn");

        this.#validate();
        this.#bind();
    }

    /* -----------------------------
       Validate DOM references
       ----------------------------- */
    #validate() {
        if (!this.startBtn || !this.stopBtn || !this.resetBtn) {
            throw new Error("UI elements not found");
        }
    }

    /* -----------------------------
       Bind buttons safely
       ----------------------------- */
    #bind() {
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
}
