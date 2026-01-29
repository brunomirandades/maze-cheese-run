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
const DESKTOP_CANVAS_WIDTH = 600;
const DESKTOP_CANVAS_HEIGHT = 600;
const MOBILE_INNER_WIDTH = 900;
const MIN_MOBILE_INNER_WIDTH = 360;

/**
 * Players
 */
const BASE_SPEED = 3.0;
const PLAYER_MIN = 1;
const PLAYER_MAX = 8;
const MAX_MOBILE_PLAYERS = 4;

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
    { name: "Green",  hex: "#008000", emoji: "🟢" },
    { name: "Orange", hex: "#FFA500", emoji: "🟠" },
    { name: "Blue",   hex: "#0000FF", emoji: "🔵" },
    { name: "Yellow", hex: "#FFFF00", emoji: "🟡" },
    { name: "Purple", hex: "#800080", emoji: "🟣" },
    { name: "Brown",  hex: "#A52A2A", emoji: "🟤" },
    { name: "Black",  hex: "#000000", emoji: "⚫" }
];