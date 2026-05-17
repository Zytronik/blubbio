import { Graphics } from "pixi.js";
import { GameInstance } from "../../_interface/game/gameInstance";
import { PixiAnimation } from "../../_interface/pixi/pixiAnimation";
import { calculatePreview } from "../../gameLogic/actions/shoot";

export function getPreviewBubbleDisplay(instance: GameInstance): PixiAnimation {
    const gridBackground = instance.gameSubContainers.gridBackground;
    const gridContainer = instance.gameSubContainers.gridContainer;
    const precisionWidth = instance.playGrid.precisionWidth;
    const precisionHeight = instance.playGrid.precisionHeight;
    const bubbleFullRadius = instance.playGrid.bubbleFullRadius;
    const spriteWidth = (bubbleFullRadius / precisionWidth) * gridBackground.width * 2;
    const spriteHeight = spriteWidth;

    const previewBubble: PixiAnimation = {
        name: instance.playerName + '-previewBubble',
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
                child.destroy();
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
            instance.gameSprites.previewBubble.destroy();
        },
    };
    return previewBubble;
}