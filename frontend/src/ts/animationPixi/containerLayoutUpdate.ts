import { useAnimationStore } from "@/stores/animationStore";
import { PixiAnimation } from "../_interface/pixi/pixiAnimation";

export function renderContainerSizes(): void {
    const exampleAnim: PixiAnimation = {
        startMS: 0,
        endMS: Infinity,
        onStart: function (): void {
            return;
        },
        renderFrame: function (currentTime: number): void {
            //updateContainerLayout();
        },
        onEnd: function (): void {
            return;
        },
    };
    useAnimationStore().playGlobalAnimation(exampleAnim);
}
