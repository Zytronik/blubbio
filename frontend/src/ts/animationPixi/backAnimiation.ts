import { PixiAnimation } from "../_interface/pixi/pixiAnimation";
import { useAnimationStore } from "@/stores/animationStore";
import { useContainerStore } from "@/stores/containerStore";
import { Graphics, Text } from "pixi.js";
import { defaultFont } from '../pixi/data/allFonts';

export function backAnimiation(holdDuration: number): void {
    const overlayContainer = useContainerStore().getOverlayContainer();

    let loaderCircle: Graphics | null = null;
    let startedHoldingAt: number | null = null;

    let circleRadius = 0;

    const loaderText = new Text({
        text: "Hold to quit",
        style: {
            fontFamily: defaultFont.name,
            fontSize: 22,
            fill: 'white',
        },
    });

    const animation: PixiAnimation = {
        name: "backAnimiation",
        startMS: 0,
        endMS: Infinity,

        onStart: function (): void {
            loaderCircle = new Graphics();
            overlayContainer.addChild(loaderCircle);

            const cx = overlayContainer.width * 0.5;
            const cy = overlayContainer.height * 0.5;
            loaderCircle.position.set(cx, cy);

            overlayContainer.addChild(loaderText);

            circleRadius = overlayContainer.width * 0.02;

            loaderText.x = cx - loaderText.width / 2;
            loaderText.y = cy + circleRadius + circleRadius * 0.5;

            startedHoldingAt = performance.now();
        },

        renderFrame: function (): void {
            if (!loaderCircle || !startedHoldingAt) return;

            const now = performance.now();
            const progress = Math.min((now - startedHoldingAt) / holdDuration, 1);

            loaderCircle.clear();

            loaderCircle.setStrokeStyle({
                width: 6,
                color: "white",
                alpha: 1,
            });

            loaderCircle.arc(
                0,
                0,
                circleRadius,
                -Math.PI / 2,
                -Math.PI / 2 + progress * Math.PI * 2
            );

            loaderCircle.stroke();
        },

        onEnd: function (): void {
            if (loaderCircle) {
                loaderCircle.destroy();
                loaderCircle = null;
            }
            if (loaderText) {
                loaderText.destroy();
            }
        },

        onCancel: function (): void {
            if (loaderCircle) {
                loaderCircle.destroy();
                loaderCircle = null;
            }
            if (loaderText) {
                loaderText.destroy();
            }
        },
    };

    useAnimationStore().playGlobalAnimation(animation);
}
