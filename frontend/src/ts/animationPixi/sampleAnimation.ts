import { Sprite } from 'pixi.js';
import { thisIsATexture } from '../pixi/data/allTextures';
import { PixiAnimation } from '../_interface/pixi/pixiAnimation';
import { getLerpT } from '../pixi/math/animationCurves';
import { useAnimationStore } from '@/stores/animationStore';

export function getAnimationExample(): void {
    /*
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const now = performance.now();
    const duration = 2000;
    const flipAmount = 3;
    const bunny = new Sprite(thisIsATexture.texture);
    bunny.anchor.set(0.5);

    const exampleAnim: PixiAnimation = {
        name: 'exampleBunnySpinning',
        startMS: now,
        endMS: now + duration,
        onStart: function (): void {
            globalVisuals.mainContainer.addChild(bunny);
        },
        renderFrame: function (currentTime: number): void {
            const currentAngle = getLerpT(this.startMS, this.endMS, currentTime) * flipAmount * 360;
            bunny.x = x;
            bunny.y = y;
            bunny.angle = currentAngle;
        },
        onEnd: function (): void {
            globalVisuals.mainContainer.removeChild(bunny);
        },
        onCancel: function (): void {
            // console.log('cancel');
        }
    };
    useAnimationStore().playGlobalAnimation(exampleAnim);
    */
}
