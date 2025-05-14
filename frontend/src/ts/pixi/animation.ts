import { useGameStore } from '@/stores/gameStore';
import { PixiAnimation } from '../_interface/pixi/pixiAnimation';

const ongoingAnimations: PixiAnimation[] = [];
let pixiAnimationRunning = false;
export function startAnimationLoop(): void {
    console.log('start animatnion loop pixi');
    if (!pixiAnimationRunning) {
        animationLoop();
        pixiAnimationRunning = true;
    }
}

function animationLoop(): void {
    const now = performance.now();
    for (let i = ongoingAnimations.length - 1; i >= 0; i--) {
        const animation = ongoingAnimations[i];
        if (animation.endMS < now) {
            animation.onEnd();
            ongoingAnimations.splice(i, 1);
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

export function playPixiAnimation(animation: PixiAnimation) {
    animation.onStart();
    ongoingAnimations.push(animation);
}

export function getLerpT(
    startMS: number,
    endMS: number,
    currentMS: number,
): number {
    const duration = endMS - startMS;
    const progress = currentMS - startMS;
    return progress / duration;
}
