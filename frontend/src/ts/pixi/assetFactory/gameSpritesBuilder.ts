import { useSpriteStore } from '@/stores/spriteStore';
import { GameSettings } from '@/ts/_interface/game/gameSettings';
import { GameSprites } from '@/ts/_interface/pixi/gameSprites';
import { arrowTexture } from '@/ts/pixi/data/allTextures';
import { Container, Sprite } from 'pixi.js';

export function getAllGameSprites(settings: GameSettings): GameSprites {
    const queue: Container[] = [];
    for (let i = 0; i < settings.queuePreviewSize; i++) {
        queue.push(useSpriteStore().createBubbleSprite());
    }

    const fieldBubbles: Container[][] = [];
    for (let x = 0; x < settings.gridWidth; x++) {
        fieldBubbles[x] = [];
        for (let y = 0; y < settings.gridHeight + settings.gridExtraHeight; y++) {
            fieldBubbles[x][y] = useSpriteStore().createBubbleSprite();
        }
    }

    const garbagePreview: Container[] = [];
    for (let x = 0; x < settings.gridWidth; x++) {
        const sprite = useSpriteStore().createBubbleSprite();
        garbagePreview.push(sprite);
    }

    return {
        arrow: new Sprite(arrowTexture.texture),
        currentBubble: useSpriteStore().createBubbleSprite(),
        holdBubble: useSpriteStore().createBubbleSprite(),
        previewBubble: useSpriteStore().createBubbleSprite(),
        bubbleQueue: queue,
        fieldBubbles: fieldBubbles,
        garbageBubbles: garbagePreview,
    };
}
