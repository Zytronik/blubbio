import { Text } from 'pixi.js';
import { countDownFont } from '../pixi/data/allFonts';
import { PixiAnimation } from '../_interface/pixi/pixiAnimation';
import { usePixiStore } from '@/stores/pixiStore';
import { useAnimationStore } from '@/stores/animationStore';
import { getLerpT } from '../pixi/math/animationCurves';
import { useContainerStore } from '@/stores/containerStore';

export function renderCountdown(duration: number, afterCountdown: () => void) {
    const segmentPercentages = [0.2, 0.4, 0.6, 0.8];
    const now = performance.now();
    const three = new Text({
        text: '3',
        style: {
            fontFamily: countDownFont.name,
            fontSize: 800,
        },
    });
    const two = new Text({
        text: '2',
        style: {
            fontFamily: countDownFont.name,
            fontSize: 800,
        },
    });
    const one = new Text({
        text: '1',
        style: {
            fontFamily: countDownFont.name,
            fontSize: 800,
        },
    });
    const go = new Text({
        text: 'GO',
        style: {
            fontFamily: countDownFont.name,
            fontSize: 1600,
        },
    });
    [go, one, two, three].forEach(text => {
        text.visible = false;
        text.anchor.set(0.5);
        text.x = useContainerStore().getCountdownContainer().width / 2;
        text.y = useContainerStore().getCountdownContainer().height / 2;

        useContainerStore().getCountdownContainer().addChild(text);
    });
    three.y = -(three.height / 2);
    const threeTravelDistance = three.height / 2 + usePixiStore().getCanvasHeight() / 2;
    const threeDownAnimation: PixiAnimation = {
        name: 'threeDownAnimation',
        startMS: now,
        endMS: now + duration * segmentPercentages[0],
        onStart: function (): void {
            useContainerStore().getCountdownContainer().visible = true;
            three.visible = true;
        },
        renderFrame: function (currentTime: number): void {
            const t = getLerpT(this.startMS, this.endMS, currentTime);
            three.y = -(three.height / 2) + t * threeTravelDistance;
        },
        onEnd: function (): void {
            useAnimationStore().playGlobalAnimation(threeShrinkAnimation);
        },
        onCancel: function (): void {
            // console.log('cancel');
        },
    };
    const threeShrinkAnimation: PixiAnimation = {
        name: 'threeShrinkAnimation',
        startMS: now + duration * segmentPercentages[0],
        endMS: now + duration * segmentPercentages[1],
        onStart: function (): void {
            //nothing :)
        },
        renderFrame: function (currentTime: number): void {
            const t = getLerpT(this.startMS, this.endMS, currentTime);
            three.scale = 1 - t * 0.2;
        },
        onEnd: function (): void {
            three.visible = false;
            useAnimationStore().playGlobalAnimation(twoShrinkAnimation);
        },
        onCancel: function (): void {
            // console.log('cancel');
        },
    };
    const twoShrinkAnimation: PixiAnimation = {
        name: 'twoShrinkAnimation',
        startMS: now + duration * segmentPercentages[1],
        endMS: now + duration * segmentPercentages[2],
        onStart: function (): void {
            two.visible = true;
        },
        renderFrame: function (currentTime: number): void {
            const t = getLerpT(this.startMS, this.endMS, currentTime);
            two.scale = 1 - t * 0.2;
        },
        onEnd: function (): void {
            two.visible = false;
            useAnimationStore().playGlobalAnimation(oneShrinkAnimation);
        },
        onCancel: function (): void {
            // console.log('cancel');
        },
    };
    const oneShrinkAnimation: PixiAnimation = {
        name: 'oneShrinkAnimation',
        startMS: now + duration * segmentPercentages[2],
        endMS: now + duration * segmentPercentages[3],
        onStart: function (): void {
            one.visible = true;
        },
        renderFrame: function (currentTime: number): void {
            const t = getLerpT(this.startMS, this.endMS, currentTime);
            one.scale = 1 - t * 0.2;
        },
        onEnd: function (): void {
            one.visible = false;
            useAnimationStore().playGlobalAnimation(goShrinkAnimation);
            afterCountdown();
        },
        onCancel: function (): void {
            // console.log('cancel');
        },
    };
    const goShrinkAnimation: PixiAnimation = {
        name: 'goShrinkAnimation',
        startMS: now + duration * segmentPercentages[3],
        endMS: now + duration,
        onStart: function (): void {
            go.visible = true;
        },
        renderFrame: function (currentTime: number): void {
            const t = getLerpT(this.startMS, this.endMS, currentTime);
            go.scale = 1 - t * 1;
        },
        onEnd: function (): void {
            [go, one, two, three].forEach(text => {
                useContainerStore().getCountdownContainer().removeChild(text);
            });
        },
        onCancel: function (): void {
            // console.log('cancel');
        },
    };
    useAnimationStore().playGlobalAnimation(threeDownAnimation);
}
