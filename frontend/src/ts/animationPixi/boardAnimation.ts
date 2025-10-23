import { PixiAnimation } from '../_interface/pixi/pixiAnimation';
import { GameInstance } from '../_interface/game/gameInstance';

export function renderBoardBubbles(instance: GameInstance): void {
    const gridBackground = instance.gameContainers.gridBackground;
    const gridContainer = instance.gameContainers.gridContainer;
    const precisionWidth = instance.playGrid.precisionWidth;
    const precisionHeight = instance.playGrid.precisionHeight;
    const bubbleFullRadius = instance.playGrid.bubbleFullRadius;
    const spriteWidth = (bubbleFullRadius / precisionWidth) * gridBackground.width * 2;
    const spriteHeight = spriteWidth;
    const gridWidth = instance.gameSettings.gridWidth;
    const gridHeight = instance.gameSettings.gridHeight + instance.gameSettings.gridExtraHeight;

    const animation: PixiAnimation = {
        startMS: 0,
        endMS: Infinity,
        onStart: function (): void {
            for (let y = 0; y < gridHeight; y++) {
                for (let x = 0; x < gridWidth; x++) {
                    const row = instance.playGrid.rows[y];
                    const sprite = instance.gameSprites.fieldBubbles[x][y];
                    if (row.isSmallerRow && x === row.fields.length) {
                        gridContainer.addChild(sprite);
                        sprite.width = spriteWidth;
                        sprite.height = spriteHeight;
                        continue;
                    }
                    const field = row.fields[x];
                    gridContainer.addChild(sprite);

                    const viewX = (field.precisionCoords.x / precisionWidth) * gridBackground.width;
                    const viewY = (field.precisionCoords.y / precisionHeight) * gridBackground.height;
                    sprite.x = viewX - spriteWidth / 2;
                    sprite.y = viewY - spriteHeight / 2;

                    sprite.width = spriteWidth;
                    sprite.height = spriteHeight;
                }
            }
        },
        renderFrame: function (currentTime: number): void {
            for (let y = 0; y < gridHeight; y++) {
                for (let x = 0; x < gridWidth; x++) {
                    const row = instance.playGrid.rows[y];
                    const sprite = instance.gameSprites.fieldBubbles[x][y];
                    if (row.isSmallerRow && x === row.fields.length) {
                        sprite.visible = false;
                        continue;
                    }
                    const field = row.fields[x];
                    // if (field.dirty) {
                    // field.dirty = false;
                    if (field.bubble) {
                        const viewX = (field.precisionCoords.x / precisionWidth) * gridBackground.width;
                        const viewY = (field.precisionCoords.y / precisionHeight) * gridBackground.height;
                        sprite.x = viewX - spriteWidth / 2;
                        sprite.y = viewY - spriteHeight / 2;
                        sprite.visible = true;
                        sprite.tint = field.bubble.tint;
                    } else {
                        sprite.visible = false;
                        // }
                    }
                }
            }
        },
        onEnd: function (): void {
            // console.log('end');
        },
    };
    animation.onStart();
    instance.instanceAnimations.push(animation);
}

