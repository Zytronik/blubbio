import { PixiAnimation } from '../_interface/pixiAnimation';
import { GameInstance } from '../_interface/game/gameInstance';

export function addBoardBubblesAnimation(instance: GameInstance): void {
    const gridBackground = instance.gameContainers.gridBackground;
    const gridContainer = instance.gameContainers.gridContainer;
    const precisionWidth = instance.playGrid.precisionWidth;
    const precisionHeight = instance.playGrid.precisionHeight;
    const bubbleFullRadius = instance.playGrid.bubbleFullRadius;
    const spriteWidth = (bubbleFullRadius / precisionWidth) * gridBackground.width * 2;
    const spriteHeight = (bubbleFullRadius / precisionHeight) * gridBackground.height * 2;

    const animation: PixiAnimation = {
        startMS: 0,
        endMS: Infinity,
        onStart: function (): void {
            instance.playGrid.rows.forEach(row => {
                row.fields.forEach(field => {
                    const x = (field.precisionCoords.x / precisionWidth) * gridBackground.width;
                    const y = (field.precisionCoords.y / precisionHeight) * gridBackground.height;
                    gridContainer.addChild(field.bubbleSprite);
                    gridContainer.addChild(field.bubbleSpriteOverlay);

                    field.bubbleSprite.x = x;
                    field.bubbleSprite.y = y;
                    field.bubbleSprite.width = spriteWidth;
                    field.bubbleSprite.height = spriteHeight;

                    field.bubbleSpriteOverlay.x = x;
                    field.bubbleSpriteOverlay.y = y;
                    field.bubbleSpriteOverlay.width = spriteWidth;
                    field.bubbleSpriteOverlay.height = spriteHeight;
                });
            });
        },
        renderFrame: function (currentTime: number): void {
            instance.playGrid.rows.forEach(row => {
                row.fields.forEach(field => {
                    if (field.bubble) {
                        field.bubbleSprite.visible = true;
                        field.bubbleSpriteOverlay.visible = true;
                        field.bubbleSprite.tint = field.bubble.tint;
                    } else {
                        field.bubbleSprite.visible = false;
                        field.bubbleSpriteOverlay.visible = false;
                    }
                });
            });
        },
        onEnd: function (): void {
            console.log('end');
        },
    };
    animation.onStart();
    instance.instanceAnimations.push(animation);
}
