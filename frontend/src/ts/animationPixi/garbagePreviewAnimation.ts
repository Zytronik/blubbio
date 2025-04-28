import { GameInstance } from "../_interface/game/gameInstance";
import { PixiAnimation } from "../_interface/pixiAnimation";
import { pushGarbage } from "../game/bubble/garbage";

export function triggerGarbagePreviewAnimation(instance: GameInstance): void {
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
                pushGarbage(instance);
                preview.isPreviewRunning = false;
                if (preview.generatedGarbage.length > 0) {
                    triggerGarbagePreviewAnimation(instance);
                }
            }
        }
        instance.instanceAnimations.push(animation);
    }
}