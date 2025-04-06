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
                    gridContainer.addChild(field.sprite);
                    field.sprite.x = x;
                    field.sprite.y = y;
                    field.sprite.width = spriteWidth;
                    field.sprite.height = spriteHeight;
                    field.sprite.anchor.x = 0.5
                    field.sprite.anchor.y = 0.5
                });
            });
        },
        renderFrame: function (currentTime: number): void {
            instance.playGrid.rows.forEach(row => {
                row.fields.forEach(field => {
                    if (field.bubble) {
                        field.sprite.visible = true;
                        field.sprite.tint = field.bubble.tint;
                    } else {
                        field.sprite.visible = false;
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
