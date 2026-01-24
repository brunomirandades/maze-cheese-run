"use strict";

/**
 * Game States
 */
/*export*/ const GameState = {
    RUNNING: "running",
    STOPPED: "stopped",
    ENDED: "ended"
};

/**
 * Canvas & Grid
 */
const CELL_SIZE = 20;
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;

/**
 * Players
 */
const BASE_SPEED = 4.0;
const PLAYER_MIN = 1;
const PLAYER_MAX = 8;

/**
 * Emojis
 */
const EMOJIS = {
    mouse: "🐭",
    cheese: "🧀",
    throphy: "🏆",
    medal: "🥇"
};

/**
 * Player Colors
 */
const COLORS = [
  { name: "Red",    hex: "#FF0000", emoji: "🔴" },
  { name: "Orange", hex: "#FFA500", emoji: "🟠" },
  { name: "Yellow", hex: "#FFFF00", emoji: "🟡" },
  { name: "Green",  hex: "#008000", emoji: "🟢" },
  { name: "Blue",   hex: "#0000FF", emoji: "🔵" },
  { name: "Purple", hex: "#800080", emoji: "🟣" },
  { name: "Brown",  hex: "#A52A2A", emoji: "🟤" },
  { name: "Black",  hex: "#000000", emoji: "⚫" }
];