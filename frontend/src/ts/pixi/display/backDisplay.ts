import { PixiAnimation } from '../../_interface/pixi/pixiAnimation';
import { useContainerStore } from '@/stores/containerStore';
import { Graphics, Text } from 'pixi.js';
import { defaultFont } from '../data/allFonts';
import { GameInstance } from '@/ts/_interface/game/gameInstance';
import { useGameStore } from '@/stores/gameStore';

export function getBackToQuitDisplay(gameInstance: GameInstance): PixiAnimation {
    const CONFIRMATION_DURATION = 1000;
    const overlayContainer = useContainerStore().getOverlayContainer();

    let loaderCircle: Graphics;
    let circleRadius = 0;

    const loaderText = new Text({
        text: 'Hold to quit',
        style: {
            fontFamily: defaultFont.name,
            fontSize: 22,
            fill: 'white',
        },
        visible: false,
    });

    const display: PixiAnimation = {
        name: 'backAnimiation',
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
        },

        renderFrame: function (): void {
            const now = performance.now();
            if (gameInstance.backPressedAt + CONFIRMATION_DURATION < now) {
                useGameStore().cancelGame();
                return;
            }
            if (gameInstance.backPressed) {
                loaderText.visible = true;
                loaderCircle.visible = true;
                const progress = Math.min((now - gameInstance.backPressedAt) / CONFIRMATION_DURATION, 1);

                loaderCircle.clear();
                loaderCircle.setStrokeStyle({
                    width: 6,
                    color: 'white',
                    alpha: 1,
                });
                loaderCircle.arc(0, 0, circleRadius, -Math.PI / 2, -Math.PI / 2 + progress * Math.PI * 2);
                loaderCircle.stroke();
            } else {
                loaderText.visible = false;
                loaderCircle.visible = false;
            }
        },

        onEnd: function (): void {
            //maybe
        },

        onCancel: function (): void {
            loaderCircle.destroy();
            loaderText.destroy();
        },
    };

    return display;
}
