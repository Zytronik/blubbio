import { useSpriteStore } from '@/stores/spriteStore';
import { GameSettings } from '@/ts/_interface/game/gameSettings';
import { GameSprites } from '@/ts/_interface/pixi/gameSprites';
import { arrowTexture } from '@/ts/pixi/allTextures';
import { Container, Sprite } from 'pixi.js';

export function getAllGameSprites(settings: GameSettings): GameSprites {
    const queue: Container[] = [];
    for (let i = 0; i < settings.queuePreviewSize; i++) {
        queue.push(useSpriteStore().getBubbleSprite());
    }

    const fieldBubbles: Container[][] = [];
    for (let x = 0; x < settings.gridWidth; x++) {
        fieldBubbles[x] = [];
        for (let y = 0; y < settings.gridHeight + settings.gridExtraHeight; y++) {
            fieldBubbles[x][y] = useSpriteStore().getBubbleSprite();
        }
    }

    const garbagePreview: Container[] = [];
    for (let x = 0; x < settings.gridWidth; x++) {
        const sprite = useSpriteStore().getBubbleSprite();
        sprite.visible = false;
        garbagePreview.push(sprite);
    }

    return {
        arrow: new Sprite(arrowTexture.texture),
        currentBubble: useSpriteStore().getBubbleSprite(),
        bubbleQueue: queue,
        fieldBubbles: fieldBubbles,
        garbageBubbles: garbagePreview,
        // bgRed: new Sprite(bgRedTexture.texture),
        // bgPurple: new Sprite(bgPurpleTexture.texture),
    };
}
