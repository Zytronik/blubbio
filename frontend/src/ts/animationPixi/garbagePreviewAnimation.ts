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
        const garbageRow = preview.generatedGarbage[0].garbage;
        const garbagePreviewLineCount = preview.generatedGarbage.length;

        const totalDuration = preview.previewBaseDuration / preview.durationSpeedMultiplier;
        const fadeInDuration = totalDuration * 0.6;
        const delayPerBubble = fadeInDuration / garbageRow.length;

        const animation: PixiAnimation = {
            startMS: now,
            endMS: now + totalDuration,
            onStart: function (): void {
                garbagePreviewSprites.forEach((sprite, index) => {
                    if (isSmallerRow && index >= garbageRow.length) {
                        sprite.visible = false;
                        return;
                    }
                    const x = (index * spriteWidth) + (isSmallerRow ? spriteWidth / 2 : 0);
                    const y = 0;
                    sprite.width = spriteWidth;
                    sprite.height = spriteHeight;
                    sprite.x = x;
                    sprite.y = y;
                    sprite.alpha = 0;
                    sprite.visible = true;
                    sprite.tint = allBubbles[garbageRow[index]].tint;
                });
            },
            renderFrame: function (currentTime: number): void {
                const progress = (currentTime - now) / fadeInDuration;
                garbagePreviewSprites.forEach((sprite, index) => {
                    if (!sprite.visible) return;
                    const bubbleStart = index * delayPerBubble;
                    const bubbleEnd = bubbleStart + delayPerBubble * 2;

                    const localProgress = (currentTime - now - bubbleStart) / (bubbleEnd - bubbleStart);
                    sprite.alpha = Math.min(Math.max(localProgress, 0), 1);
                });
            },
            onEnd: function (): void {
                pushOneGarbageRow(instance);
                preview.isPreviewRunning = false;
                garbagePreviewSprites.forEach((sprite) => {
                    sprite.visible = false;
                });
                if (preview.generatedGarbage.length > 0) {
                    renderGarbagePreview(instance);
                }
            }
        };
        animation.onStart();
        instance.instanceAnimations.push(animation);
    }
}
