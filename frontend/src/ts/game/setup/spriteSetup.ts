import { GameSprites } from "@/ts/_interface/pixi/gameSprites";
import { arrowTexture, bgPurpleTexture, bgRedTexture, bubbleTexture } from "@/ts/pixi/allTextures";
import { Sprite } from "pixi.js";

export function getAllGameSprites(): GameSprites {
    return {
        arrow: new Sprite(arrowTexture.texture),
        // bubble: new Sprite(bubbleTexture.texture),
        // bgRed: new Sprite(bgRedTexture.texture),
        // bgPurple: new Sprite(bgPurpleTexture.texture),
    };
}
