import { PixiAnimation } from '../_interface/pixi/pixiAnimation';
import { GameInstance } from '../_interface/game/gameInstance';
import { useAnimationStore } from '@/stores/animationStore';

export function renderArrowUpdate(instance: GameInstance): void {
    const arrowContainer = instance.gameSubContainers.arrowContainer;
    const arrowSprite = instance.gameSprites.arrow;
    const currentBubble = instance.gameSprites.currentBubble;
    const gridBackground = instance.gameSubContainers.gridBackground;
    const arrowPrecisionCoords = instance.playGrid.launcherPrecisionPosition;
    const precisionWidth = instance.playGrid.precisionWidth;
    const precisionHeight = instance.playGrid.precisionHeight;

    const currentBubbleSprite = instance.gameSprites.currentBubble;

    const bubbleFullRadius = instance.playGrid.bubbleFullRadius;
    const bubbleWidth = (bubbleFullRadius / precisionWidth) * gridBackground.width * 2;
    const bubbleHeight = bubbleWidth;

    const animation: PixiAnimation = {
        name: 'arrow',
        startMS: 0,
        endMS: Infinity,
        onStart: function (): void {
            arrowSprite.height = arrowContainer.height;
            arrowSprite.width = arrowContainer.width;

            currentBubble.width = arrowContainer.width;
            currentBubble.height = arrowContainer.height;

            arrowContainer.x = (arrowPrecisionCoords.x / precisionWidth) * gridBackground.width;
            arrowContainer.y = (arrowPrecisionCoords.y / precisionHeight) * gridBackground.height;

            currentBubbleSprite.x = bubbleHeight / 2;
            currentBubbleSprite.y = 0;

            arrowContainer.addChild(currentBubble);
            arrowContainer.addChild(arrowSprite);
        },
        renderFrame: function (currentTime: number): void {
            arrowContainer.angle = instance.angle;
            if (currentBubbleSprite) {
                currentBubbleSprite.visible = true;
                currentBubbleSprite.tint = instance.currentBubble.tint;
            }
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
