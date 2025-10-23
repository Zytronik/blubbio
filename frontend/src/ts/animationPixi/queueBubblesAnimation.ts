import { PixiAnimation } from '../_interface/pixi/pixiAnimation';
import { GameInstance } from '../_interface/game/gameInstance';

export function renderQueueBubbles(instance: GameInstance): void {
    const queueSprites = instance.gameSprites.bubbleQueue;
    const precisionWidth = instance.playGrid.precisionWidth;
    const queueContainer = instance.gameContainers.queueContainer;
    const gridBackground = instance.gameContainers.gridBackground;
    const bubbleFullRadius = instance.playGrid.bubbleFullRadius;
    const spriteWidth = (bubbleFullRadius / precisionWidth) * gridBackground.width * 2;
    const spriteHeight = spriteWidth;

    const animation: PixiAnimation = {
        startMS: 0,
        endMS: Infinity,
        onStart: function (): void {
            queueSprites.forEach((sprite, index) => {
                const x = 0;
                const y = (index * spriteWidth);
                sprite.width = spriteWidth;
                sprite.height = spriteHeight;
                queueContainer.addChild(sprite);
                sprite.x = x;
                sprite.y = y;
                sprite.visible = false;
            });
        },
        renderFrame: function (currentTime: number): void {
            instance.bubbleQueue.forEach((bubble, index) => {
                const sprite = queueSprites[index];
                if (sprite) {
                    sprite.visible = true;
                    sprite.tint = bubble.tint;
                }
            });
        },
        onEnd: function (): void {
            // console.log('end');
        },
    };
    animation.onStart();
    instance.instanceAnimations.push(animation);
}
