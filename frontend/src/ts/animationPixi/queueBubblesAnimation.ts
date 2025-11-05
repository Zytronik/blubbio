import { PixiAnimation } from '../_interface/pixi/pixiAnimation';
import { GameInstance } from '../_interface/game/gameInstance';
import { useAnimationStore } from '@/stores/animationStore';

export function renderQueueBubbles(instance: GameInstance): void {
    const queueSprites = instance.gameSprites.bubbleQueue;
    const precisionWidth = instance.playGrid.precisionWidth;
    const queueContainer = instance.gameSubContainers.queueContainer;
    const gridBackground = instance.gameSubContainers.gridBackground;
    const bubbleFullRadius = instance.playGrid.bubbleFullRadius;
    const spriteWidth = (bubbleFullRadius / precisionWidth) * gridBackground.width * 2;
    const spriteHeight = spriteWidth;

    const animation: PixiAnimation = {
        name: 'queueAnimation',
        startMS: 0,
        endMS: Infinity,
        onStart: function (): void {
            queueSprites.forEach((sprite, index) => {
                const x = 0;
                const y = index * spriteWidth;
                sprite.width = spriteWidth;
                sprite.height = spriteHeight;
                queueContainer.addChild(sprite);
                sprite.x = x;
                sprite.y = y;
                sprite.visible = true;
            });
        },
        renderFrame: function (): void {
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
        onCancel: function (): void {
            // console.log('cancel');
        },
    };
    
    useAnimationStore().playInstanceAnimation(animation, instance);
}
