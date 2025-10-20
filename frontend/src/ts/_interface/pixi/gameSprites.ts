import { Container, Sprite } from "pixi.js";

export interface GameSprites {
    arrow: Sprite,
    currentBubble: Container,
    bubbleQueue: Container[],
    // bubble: Sprite,
    // bgRed: Sprite,
    // bgPurple: Sprite,
}