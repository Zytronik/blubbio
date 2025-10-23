import { Sprite } from "pixi.js";
import { PixiAnimation } from "../pixi/pixiAnimation";

export interface Bubble {
    type: number,
    wallbounce: boolean,
    tint: string,
}