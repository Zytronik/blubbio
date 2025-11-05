import { PixiAnimation } from '../_interface/pixi/pixiAnimation';
import { GameInstance } from '../_interface/game/gameInstance';
import { calculatePreview } from '../gameLogic/actions/shoot';
import { Graphics } from 'pixi.js';
import { useAnimationStore } from '@/stores/animationStore';

export function renderBoard(instance: GameInstance): void {
    const gridBackground = instance.gameSubContainers.gridBackground;
    const gridContainer = instance.gameSubContainers.gridContainer;
    const precisionWidth = instance.playGrid.precisionWidth;
    const precisionHeight = instance.playGrid.precisionHeight;
    const bubbleFullRadius = instance.playGrid.bubbleFullRadius;
    const spriteWidth = (bubbleFullRadius / precisionWidth) * gridBackground.width * 2;
    const spriteHeight = spriteWidth;
    const gridWidth = instance.gameSettings.gridWidth;
    const gridHeight = instance.gameSettings.gridHeight + instance.gameSettings.gridExtraHeight;

    const boardBubbles: PixiAnimation = {
        name: 'boardBubbles',
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
        renderFrame: function (): void {
            for (let y = 0; y < gridHeight; y++) {
                for (let x = 0; x < gridWidth; x++) {
                    const row = instance.playGrid.rows[y];
                    const sprite = instance.gameSprites.fieldBubbles[x][y];
                    if (row.isSmallerRow && x === row.fields.length) {
                        sprite.visible = false;
                        continue;
                    }
                    const field = row.fields[x];
                    if (field.bubble) {
                        const viewX = (field.precisionCoords.x / precisionWidth) * gridBackground.width;
                        const viewY = (field.precisionCoords.y / precisionHeight) * gridBackground.height;
                        sprite.x = viewX - spriteWidth / 2;
                        sprite.y = viewY - spriteHeight / 2;
                        sprite.visible = true;
                        sprite.tint = field.bubble.tint;
                    } else {
                        sprite.visible = false;
                    }
                }
            }
        },
        onEnd: function (): void {
            // console.log('end');
        },
        onCancel: function (): void {
            // console.log('cancel');
        },
    };

    const previewBubble: PixiAnimation = {
        name: 'previewBubble',
        startMS: 0,
        endMS: Infinity,
        onStart: function (): void {
            const sprite = instance.gameSprites.previewBubble;
            gridContainer.addChild(sprite);
            sprite.width = spriteWidth;
            sprite.height = spriteHeight;
            sprite.visible = true;
            sprite.alpha = 0.5;
        },
        renderFrame: function (): void {
            gridContainer.getChildrenByLabel('previewLineDeleteThis').forEach(child => {
                child.visible = false;
                child.destroy;
            });
            calculatePreview(instance);
            const preview = instance.bubblePreview;
            const viewX = (preview.gridLocation.x / precisionWidth) * gridBackground.width;
            const viewY = (preview.gridLocation.y / precisionHeight) * gridBackground.height;
            const sprite = instance.gameSprites.previewBubble;
            sprite.x = viewX - spriteWidth / 2;
            sprite.y = viewY - spriteHeight / 2;
            sprite.tint = preview.tint;
            for (let i = 0; i < preview.travelLineCoords.length - 1; i++) {
                const startCoords = preview.travelLineCoords[i];
                const endCoords = preview.travelLineCoords[i + 1];
                const startX = (startCoords.x / precisionWidth) * gridBackground.width;
                const startY = (startCoords.y / precisionHeight) * gridBackground.height;
                const endX = (endCoords.x / precisionWidth) * gridBackground.width;
                const endY = (endCoords.y / precisionHeight) * gridBackground.height;
                const line = new Graphics();
                line.label = 'previewLineDeleteThis';
                line.setStrokeStyle({ width: 4, color: 0xaaaaaa, alpha: 0.8 });
                line.moveTo(startX, startY);
                line.lineTo(endX, endY);
                line.stroke({ color: 'white', width: 2, alpha: 0.8 });
                gridContainer.addChild(line);
            }
        },
        onEnd: function (): void {
            // console.log('end');
        },
        onCancel: function (): void {
            // console.log('cancel');
        },
    };
    
    useAnimationStore().playInstanceAnimation(boardBubbles, instance);
    useAnimationStore().playInstanceAnimation(previewBubble, instance);
}
