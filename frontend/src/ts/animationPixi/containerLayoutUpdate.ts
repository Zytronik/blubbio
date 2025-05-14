import { Sprite } from "pixi.js";
import { thisIsATexture } from "../pixi/allTextures";
import { PixiAnimation } from "../_interface/pixi/pixiAnimation";
import { mainContainer, updateContainerLayout } from "../pixi/container";
import { playPixiAnimation, getLerpT } from "../pixi/animation";

export function updateContainerSizeLoop(): void {

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