import { GameInstance } from "../_interface/game/gameInstance";
import { PixiAnimation } from "../_interface/pixi/pixiAnimation";
import { allBubbles } from "../game/bubble/bubbleTypes";
import { pushOneGarbageRow } from "../game/bubble/garbage";

export function renderGarbagePreview(instance: GameInstance): void {
    const preview = instance.garbagePreview;
    if (!preview.isPreviewRunning) {
        preview.isPreviewRunning = true;
        const now = performance.now();
        const isSmallerRow = instance.garbagePreview.generatedGarbage[0].isSmallerRow;
        const precisionWidth = instance.playGrid.precisionWidth;
        const gridBackground = instance.gameContainers.gridBackground;
        const bubbleFullRadius = instance.playGrid.bubbleFullRadius;
        const spriteWidth = (bubbleFullRadius / precisionWidth) * gridBackground.width * 2;
        const spriteHeight = spriteWidth;
        const garbagePreviewSprites = instance.gameSprites.garbageBubbles;
        const garbagePreviewLineCount = instance.garbagePreview.generatedGarbage.length;

        const animation: PixiAnimation = {
            startMS: now,
            endMS: now + preview.previewBaseDuration / preview.durationSpeedMultiplier,
            onStart: function (): void {
                garbagePreviewSprites.forEach((sprite, index) => {
                    if (isSmallerRow && index >= preview.generatedGarbage[0].garbage.length) {
                        sprite.visible = false;
                        return;
                    }
                    const x = (index * spriteWidth) + (isSmallerRow ? spriteWidth / 2 : 0);
                    const y = 0;
                    sprite.width = spriteWidth;
                    sprite.height = spriteHeight;
                    sprite.x = x;
                    sprite.y = y;
                    sprite.alpha = 0.5;
                    sprite.visible = true;
                    sprite.tint = allBubbles[preview.generatedGarbage[0].garbage[index]].tint;
                });
            },
            renderFrame: function (currentTime: number): void {
                //fill a square bar behind the bubbles based on time
                //if bar passes bubble, apply color from generatedGarbage[0] to previewrow
            },
            onEnd: function (): void {
                pushOneGarbageRow(instance);
                preview.isPreviewRunning = false;
                garbagePreviewSprites.forEach((sprite, index) => {
                    sprite.visible = false;
                });
                if (preview.generatedGarbage.length > 0) {
                    renderGarbagePreview(instance);
                }
            }
        }
        animation.onStart();
        instance.instanceAnimations.push(animation);
    }
}