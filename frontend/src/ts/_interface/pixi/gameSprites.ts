import { Container, Sprite } from "pixi.js";

export interface GameSprites {
    arrow: Sprite,
    currentBubble: Container,
    bubbleQueue: Container[],
    fieldBubbles: Container[][],
    garbageBubbles: Container[],
    // bgRed: Sprite,
    // bgPurple: Sprite,
}