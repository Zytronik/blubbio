import { PixiAnimation } from '../_interface/pixi/pixiAnimation';
import { GameInstance } from '../_interface/game/gameInstance';

export function renderHoldBubble(instance: GameInstance): void {
    const holdSprite = instance.gameSprites.holdBubble;
    const precisionWidth = instance.playGrid.precisionWidth;
    const holdContainer = instance.gameContainers.holdContainer;
    const gridBackground = instance.gameContainers.gridBackground;
    const bubbleFullRadius = instance.playGrid.bubbleFullRadius;
    const spriteWidth = (bubbleFullRadius / precisionWidth) * gridBackground.width * 2;
    const spriteHeight = spriteWidth;

    const animation: PixiAnimation = {
        startMS: 0,
        endMS: Infinity,
        onStart: function (): void {
            holdSprite.width = spriteWidth;
            holdSprite.height = spriteHeight;
            holdContainer.addChild(holdSprite);
            holdSprite.x = 0;
            holdSprite.y = 0;
            holdSprite.visible = false;
        },
        renderFrame: function (currentTime: number): void {
            const holdBubble = instance.holdBubble;
            if (holdBubble) {
                holdSprite.visible = true;
                holdSprite.tint = holdBubble.tint;
            }
        },
        onEnd: function (): void {
            // console.log('end');
        },
    };
    animation.onStart();
    instance.instanceAnimations.push(animation);
}
