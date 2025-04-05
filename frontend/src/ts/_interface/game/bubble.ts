import { Sprite } from "pixi.js";
import { PixiAnimation } from "../pixiAnimation";

export interface Bubble {
    type: number,
    wallbounce: boolean,
    tint: string,
    // sprite: Sprite,
    // animation: PixiAnimation[]
}