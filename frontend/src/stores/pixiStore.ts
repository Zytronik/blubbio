import { setupPixiVisuals } from '@/ts/pixi/container';
import { allTextures } from '@/ts/pixi/allTextures';
import { defineStore } from 'pinia';
import { Application, Assets } from 'pixi.js';
import { allFonts } from '@/ts/pixi/allFonts';
import { useAnimationStore } from './animationStore';

export const usePixiStore = defineStore('pixi', () => {
    const pixiApp = new Application();
    function initPixiApp() {
        if (pixiApp.renderer) return;
        const CANVAS_ID = '#pixiCanvas';
        pixiApp
            .init({
                background: '#252525',
                resizeTo: window,
            })
            .then(async () => {
                document.querySelector(CANVAS_ID)?.appendChild(pixiApp.canvas);
                setupPixiVisuals();
                useAnimationStore().startAnimationLoop();
            });
        allTextures.forEach(async asset => {
            asset.texture = await Assets.load(asset.src);
        });
        allFonts.forEach(async font => {
            await Assets.load(font.src);
        });
    }
    function getPixiApp() {
        return pixiApp;
    }
    function getCanvasHeight(): number {
        return pixiApp.canvas.height;
    }
    function getCanvasWidth(): number {
        return pixiApp.canvas.width;
    }
    return { pixiApp, initPixiApp, getPixiApp, getCanvasHeight, getCanvasWidth };
});
