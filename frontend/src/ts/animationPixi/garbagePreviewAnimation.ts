import { useAnimationStore } from '@/stores/animationStore';
import { GameInstance } from '../_interface/game/gameInstance';
import { PixiAnimation } from '../_interface/pixi/pixiAnimation';
import { allBubbles } from '../gameLogic/bubble/bubbleTypes';
import { pushOneGarbageRow } from '../gameLogic/bubble/garbage';

export function renderGarbagePreview(instance: GameInstance): void {
    const preview = instance.garbagePreview;
    if (!preview.isPreviewRunning) {
        preview.isPreviewRunning = true;
        const now = performance.now();
        const isSmallerRow = instance.garbagePreview.generatedGarbage[0].isSmallerRow;
        const precisionWidth = instance.playGrid.precisionWidth;
        const gridBackground = instance.gameSubContainers.gridBackground;
        const bubbleFullRadius = instance.playGrid.bubbleFullRadius;
        const spriteWidth = (bubbleFullRadius / precisionWidth) * gridBackground.width * 2;
        const spriteHeight = spriteWidth;
        const garbagePreviewSprites = instance.gameSprites.garbageBubbles;
        const garbageRow = preview.generatedGarbage[0].garbage;
        const garbagePreviewLineCount = preview.generatedGarbage.length;
        const garbageContainer = instance.gameSubContainers.garbageContainer;

        const totalDuration = preview.previewBaseDuration / preview.durationSpeedMultiplier;
        const fadeInDuration = totalDuration * 1;
        const delayPerBubble = fadeInDuration / garbageRow.length;

        const animation: PixiAnimation = {
            name: 'garbagePreview',
            startMS: now,
            endMS: now + totalDuration,
            onStart: function (): void {
                garbagePreviewSprites.forEach((sprite, index) => {
                    if (isSmallerRow && index >= garbageRow.length) {
                        sprite.visible = false;
                        return;
                    }
                    const x = index * spriteWidth + (isSmallerRow ? spriteWidth / 2 : 0);
                    const y = 0;
                    sprite.width = spriteWidth;
                    sprite.height = spriteHeight;
                    sprite.x = x;
                    sprite.y = y;
                    sprite.alpha = 0;
                    sprite.visible = true;
                    sprite.tint = allBubbles[garbageRow[index]].tint;
                    garbageContainer.addChild(sprite);
                });
            },
            renderFrame: function (currentTime: number): void {
                garbagePreviewSprites.forEach((sprite, index) => {
                    if (!sprite.visible) return;
                    const bubbleStart = index * delayPerBubble;
                    const bubbleEnd = bubbleStart + delayPerBubble * 2;

                    const localProgress = (currentTime - now - bubbleStart) / (bubbleEnd - bubbleStart);
                    sprite.alpha = Math.min(Math.max(localProgress, 0), 0.6);
                });
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
            },
            onCancel: function (): void {
                // console.log('cancel');
            },
        };
        useAnimationStore().playInstanceAnimation(animation, instance);
    }
}
