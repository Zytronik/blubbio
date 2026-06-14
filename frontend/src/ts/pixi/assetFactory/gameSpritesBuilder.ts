import { usePixiStore } from '@/stores/pixiStore';
import { GameSettings } from '@/ts/_interface/game/gameSettings';
import { GameSprites } from '@/ts/_interface/pixi/gameSprites';
import { arrowTexture, bubbleTexture } from '@/ts/pixi/data/allTextures';
import { Container, Sprite } from 'pixi.js';

export function getGameSprites(settings: GameSettings): GameSprites {
    const queue: Container[] = [];
    for (let i = 0; i < settings.queuePreviewSize; i++) {
        queue.push(createBubbleSprite());
    }

    const fieldBubbles: Container[][] = [];
    for (let x = 0; x < settings.gridWidth; x++) {
        fieldBubbles[x] = [];
        for (let y = 0; y < settings.gridHeight + settings.gridExtraHeight; y++) {
            fieldBubbles[x][y] = createBubbleSprite();
        }
    }

    const garbagePreview: Container[] = [];
    for (let x = 0; x < settings.gridWidth; x++) {
        const sprite = createBubbleSprite();
        garbagePreview.push(sprite);
    }

    return {
        arrow: new Sprite(arrowTexture.texture),
        currentBubble: createBubbleSprite(),
        holdBubble: createBubbleSprite(),
        previewBubble: createBubbleSprite(),
        bubbleQueue: queue,
        fieldBubbles: fieldBubbles,
        garbageBubbles: garbagePreview,
    };
}

export function createBubbleSprite(): Container {
    const container = new Container();
    const sprite = new Sprite({ texture: bubbleTexture.texture });
    container.addChild(sprite);
    return container;
}
