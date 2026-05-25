import { Container, Text } from 'pixi.js';
import { countDownFont } from '../data/allFonts';
import { PixiAnimation } from '../../_interface/pixi/pixiAnimation';
import { usePixiStore } from '@/stores/pixiStore';
import { getLerpT } from '../math/animationCurves';
import { ANIMATION_CONTEXT } from '@/ts/_enum/animationContext';

export const COUNTDOWN_ANIMATION_CONTEXT = ANIMATION_CONTEXT.GAME_OVERLAY;
export const COUNTDOWN_ANIMATION_NAME = "countdown";
export function getCountdownAnimation(container: Container, duration: number, afterCountdown: () => void): PixiAnimation {
    const segmentPercentages = [0.2, 0.4, 0.6, 0.8];
    const now = performance.now();
    const t0 = now;
    const t1 = now + duration * segmentPercentages[0];
    const t2 = now + duration * segmentPercentages[1];
    const t3 = now + duration * segmentPercentages[2];
    const t4 = now + duration * segmentPercentages[3];
    const t5 = now + duration;

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
    const graphics = [three, two, one, go];
    graphics.forEach(text => {
        text.visible = false;
        text.anchor.set(0.5);
        text.x = container.width / 2;
        text.y = container.height / 2;

        container.addChild(text);
    });
    three.y = -(three.height / 2);
    const threeTravelDistance = three.height / 2 + container.height / 2;
    const countdownAnimation: PixiAnimation = {
        context: COUNTDOWN_ANIMATION_CONTEXT,
        name: COUNTDOWN_ANIMATION_NAME,
        startMS: now,
        endMS: now + duration,
        onStart: function (): void {
            container.visible = true;
            three.visible = true;
        },
        renderFrame: function (currentTime: number): void {
            //three down
            if (currentTime >= t0 && currentTime < t1) {
                visible(3);
                const t = getLerpT(t0, t1, currentTime);
                three.y = -(three.height / 2) + t * threeTravelDistance;
            }

            //three shrinking
            if (currentTime >= t1 && currentTime < t2) {
                visible(3);
                const t = getLerpT(t1, t2, currentTime);
                three.scale = 1 - t * 0.2;
            }

            //two shrinking
            if (currentTime >= t2 && currentTime < t3) {
                visible(2);
                const t = getLerpT(t2, t3, currentTime);
                two.scale = 1 - t * 0.2;
            }

            //one shrinking
            if (currentTime >= t3 && currentTime < t4) {
                visible(1);
                const t = getLerpT(t3, t4, currentTime);
                one.scale = 1 - t * 0.2;
            }

            //go shrinking
            if (currentTime >= t4 && currentTime < t5) {
                visible(0);
                const t = getLerpT(t4, t5, currentTime);
                go.scale = 1 - t * 1;
                afterCountdown();
            }

            function visible(x: number): void {
                three.visible = x === 3;
                two.visible = x === 2;
                one.visible = x === 1;
                go.visible = x === 0;
            }
        },
        onEnd: function (): void {
            graphics.forEach(text => {
                text.destroy();
            });
        },
        cleanUp: function (): void {
            graphics.forEach(text => {
                text.destroy();
            });
        },
    };

    return countdownAnimation;
}
