import { PixiAnimation } from '@/ts/_interface/pixi/pixiAnimation';
import { defineStore } from 'pinia';
import { useGameStore } from './gameStore';

const globalAnimations: PixiAnimation[] = [];
export const useAnimationStore = defineStore('animation', () => {
    let pixiAnimationRunning = false;
    function startAnimationLoop(): void {
        if (!pixiAnimationRunning) {
            animationLoop();
            pixiAnimationRunning = true;
        }
    }
    function playGlobalAnimation(animation: PixiAnimation): void {
        animation.onStart();
        globalAnimations.push(animation);
    }
    return { startAnimationLoop, playGlobalAnimation };
});

function animationLoop(): void {
    const now = performance.now();
    for (let i = globalAnimations.length - 1; i >= 0; i--) {
        const animation = globalAnimations[i];
        if (animation.endMS < now) {
            animation.onEnd();
            globalAnimations.splice(i, 1);
        } else {
            animation.renderFrame(now);
        }
    }
    useGameStore()
        .getAllInstances()
        .forEach(gameInstance => {
            const gameAnimations = gameInstance.instanceAnimations;
            for (let i = gameAnimations.length - 1; i >= 0; i--) {
                const animation = gameAnimations[i];
                if (animation.endMS < now) {
                    animation.onEnd();
                    gameAnimations.splice(i, 1);
                } else {
                    animation.renderFrame(now);
                }
            }
        });
    requestAnimationFrame(() => animationLoop());
}
