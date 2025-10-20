import { Container, Sprite } from "pixi.js";

export interface GameSprites {
    arrow: Sprite,
    currentBubble: Container,
    bubbleQueue: Container[],
    fieldBubbles: Container[][],
    // bgRed: Sprite,
    // bgPurple: Sprite,
}