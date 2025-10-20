import { PixiAnimation } from '../_interface/pixi/pixiAnimation';
import { GameInstance } from '../_interface/game/gameInstance';

export function renderBoardBubbles(instance: GameInstance): void {
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
                    gridContainer.addChild(field.bubbleSpriteContainer);

                    field.bubbleSpriteContainer.x = x - spriteWidth / 2;
                    field.bubbleSpriteContainer.y = y - spriteHeight / 2;

                    field.bubbleSpriteContainer.width = spriteWidth;
                    field.bubbleSpriteContainer.height = spriteHeight;
                });
            });
        },
        renderFrame: function (currentTime: number): void {
            instance.playGrid.rows.forEach(row => {
                row.fields.forEach(field => {
                    if (field.bubble) {
                        field.bubbleSpriteContainer.visible = true;
                        field.bubbleSpriteContainer.tint = field.bubble.tint;
                    } else {
                        field.bubbleSpriteContainer.visible = false;
                    }
                });
            });
        },
        onEnd: function (): void {
            // console.log('end');
        },
    };
    animation.onStart();
    instance.instanceAnimations.push(animation);
}
