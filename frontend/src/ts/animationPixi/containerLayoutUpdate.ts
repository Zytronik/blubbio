import { PixiAnimation } from "../_interface/pixi/pixiAnimation";
import { updateContainerLayout } from "../pixi/container";
import { playPixiAnimation } from "../pixi/animation";

export function renderContainerSizes(): void {
    const exampleAnim: PixiAnimation = {
        startMS: 0,
        endMS: Infinity,
        onStart: function (): void {
            return;
        },
        renderFrame: function (currentTime: number): void {
            updateContainerLayout();
        },
        onEnd: function (): void {
            return;
        },
    }
    playPixiAnimation(exampleAnim);
}