import { GameInstance } from "../_interface/game/gameInstance";
import { PixiAnimation } from "../_interface/pixi/pixiAnimation";
import { pushOneGarbageRow } from "../game/bubble/garbage";

export function renderGarbagePreview(instance: GameInstance): void {
    const preview = instance.garbagePreview;
    if (!preview.isPreviewRunning) {
        preview.isPreviewRunning = true;
        const now = performance.now();
        const animation: PixiAnimation = {
            startMS: now,
            endMS: now + preview.previewBaseDuration / preview.durationSpeedMultiplier,
            onStart: function (): void {
                //probably square bars init
            },
            renderFrame: function (currentTime: number): void {
                //fill a square bar behind the bubbles based on time
                //if bar passes bubble, apply color from generatedGarbage[0] to previewrow
            },
            onEnd: function (): void {
                pushOneGarbageRow(instance);
                preview.isPreviewRunning = false;
                if (preview.generatedGarbage.length > 0) {
                    renderGarbagePreview(instance);
                }
            }
        }
        instance.instanceAnimations.push(animation);
    }
}