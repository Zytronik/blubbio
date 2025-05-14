import { Text } from "pixi.js";
import { countDownContainer } from "../pixi/container";
import { countDownFont } from "../pixi/allFonts";
import { PixiAnimation } from "../_interface/pixi/pixiAnimation";
import { playPixiAnimation, getLerpT } from "../pixi/animation";
import { usePixiStore } from "@/stores/pixiStore";

export function playCountdown() {
    const duration = 2000;
    const segmentPercentages = [0.2, 0.4, 0.6, 0.8]
    const now = performance.now();
    const three = new Text({
        text: '3',
        style: {
            fontFamily: countDownFont.name,
            fontSize: 800,
        }
    });
    const two = new Text({
        text: '2',
        style: {
            fontFamily: countDownFont.name,
            fontSize: 800,
        }
    });
    const one = new Text({
        text: '1',
        style: {
            fontFamily: countDownFont.name,
            fontSize: 800,
        }
    });
    const go = new Text({
        text: 'GO',
        style: {
            fontFamily: countDownFont.name,
            fontSize: 1600,
        }
    });
    [go, one, two, three].forEach(text => {
        text.visible = false;
        text.anchor.set(0.5);
        text.x = usePixiStore().getCanvasWidth() / 2;
        text.y = usePixiStore().getCanvasHeight() / 2;
        countDownContainer.addChild(text);
    });
    three.y = -(three.height / 2);
    const threeTravelDistance = three.height / 2 + usePixiStore().getCanvasHeight() / 2;
    const threeDownAnimation: PixiAnimation = {
        startMS: now,
        endMS: now + duration * segmentPercentages[0],
        onStart: function (): void {
            countDownContainer.visible = true;
            three.visible = true;
        },
        renderFrame: function (currentTime: number): void {
            const t = getLerpT(this.startMS, this.endMS, currentTime);
            three.y = -(three.height / 2) + t * threeTravelDistance
        },
        onEnd: function (): void {
            playPixiAnimation(threeShrinkAnimation);
        }
    }
    const threeShrinkAnimation: PixiAnimation = {
        startMS: now + duration * segmentPercentages[0],
        endMS: now + duration * segmentPercentages[1],
        onStart: function (): void {
            //nothing :)
        },
        renderFrame: function (currentTime: number): void {
            const t = getLerpT(this.startMS, this.endMS, currentTime);
            three.scale = 1 - (t * 0.2);
        },
        onEnd: function (): void {
            three.visible = false;
            playPixiAnimation(twoShrinkAnimation);
        }
    }
    const twoShrinkAnimation: PixiAnimation = {
        startMS: now + duration * segmentPercentages[1],
        endMS: now + duration * segmentPercentages[2],
        onStart: function (): void {
            two.visible = true;
        },
        renderFrame: function (currentTime: number): void {
            const t = getLerpT(this.startMS, this.endMS, currentTime);
            two.scale = 1 - (t * 0.2);
        },
        onEnd: function (): void {
            two.visible = false;
            playPixiAnimation(oneShrinkAnimation);
        }
    }
    const oneShrinkAnimation: PixiAnimation = {
        startMS: now + duration * segmentPercentages[2],
        endMS: now + duration * segmentPercentages[3],
        onStart: function (): void {
            one.visible = true;
        },
        renderFrame: function (currentTime: number): void {
            const t = getLerpT(this.startMS, this.endMS, currentTime);
            one.scale = 1 - (t * 0.2);
        },
        onEnd: function (): void {
            one.visible = false;
            playPixiAnimation(goShrinkAnimation);
        }
    }
    const goShrinkAnimation: PixiAnimation = {
        startMS: now + duration * segmentPercentages[3],
        endMS: now + duration,
        onStart: function (): void {
            go.visible = true;
        },
        renderFrame: function (currentTime: number): void {
            const t = getLerpT(this.startMS, this.endMS, currentTime);
            go.scale = 1 - (t * 1);
        },
        onEnd: function (): void {
            [go, one, two, three].forEach(text => {
                countDownContainer.removeChild(text);
            });
        }
    }
    playPixiAnimation(threeDownAnimation);
}