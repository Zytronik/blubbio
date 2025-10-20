import { useSpriteStore } from "@/stores/spriteStore";
import { GameSettings } from "@/ts/_interface/game/gameSettings";
import { GameSprites } from "@/ts/_interface/pixi/gameSprites";
import { arrowTexture } from "@/ts/pixi/allTextures";
import { Container, Sprite } from "pixi.js";

export function getAllGameSprites(settings: GameSettings): GameSprites {
    const queue: Container[] = []
    for (let i = 0; i < settings.queuePreviewSize; i++) {
        queue.push(useSpriteStore().getBubbleSprite());
    }
    return {
        arrow: new Sprite(arrowTexture.texture),
        currentBubble: useSpriteStore().getBubbleSprite(),
        bubbleQueue: queue,
        // bubble: new Sprite(bubbleTexture.texture),
        // bgRed: new Sprite(bgRedTexture.texture),
        // bgPurple: new Sprite(bgPurpleTexture.texture),
    };
}
