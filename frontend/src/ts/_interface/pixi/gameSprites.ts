import { Container, Sprite } from "pixi.js";

export interface GameSprites {
    arrow: Sprite,
    currentBubble: Container,
    holdBubble: Container,
    previewBubble: Container,
    bubbleQueue: Container[],
    fieldBubbles: Container[][],
    garbageBubbles: Container[],
}