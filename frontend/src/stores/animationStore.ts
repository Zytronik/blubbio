import { PixiAnimation } from '@/ts/_interface/pixi/pixiAnimation';
import { defineStore } from 'pinia';
import { useGameStore } from './gameStore';
import { GameInstance } from '@/ts/_interface/game/gameInstance';

const globalAnimations: Map<string, PixiAnimation> = new Map<string, PixiAnimation>();
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
        globalAnimations.set(animation.name, animation);
    }
    function playInstanceAnimation(animation: PixiAnimation, instance: GameInstance): void {
        animation.onStart();
        instance.instanceAnimations.set(animation.name, animation);
    }
    function stopGlobalAnimation(animationName: string): void {
        globalAnimations.get(animationName)?.onCancel();
        globalAnimations.delete(animationName);
    }
    function stopInstanceAnimation(animationName: string, instance: GameInstance): void {
        instance.instanceAnimations.get(animationName)?.onCancel();
        instance.instanceAnimations.delete(animationName);
    }
    return { startAnimationLoop, playGlobalAnimation, playInstanceAnimation, stopGlobalAnimation, stopInstanceAnimation };
});

function animationLoop(): void {
    const now = performance.now();
    globalAnimations.forEach((animation, name) => {
        if (animation.endMS < now) {
            animation.onEnd();
            //TODO: HAS NOT BEEN TESTED YET
            console.log('before deletion', globalAnimations.size);
            globalAnimations.delete(name);
            console.log('deleted', globalAnimations.size);
        } else {
            animation.renderFrame(now);
        }
    });
    useGameStore()
        .getAllInstances()
        .forEach(gameInstance => {
            const gameAnimations = gameInstance.instanceAnimations;
            gameAnimations.forEach((animation, name) => {
                if (animation.endMS < now) {
                    animation.onEnd();
                    gameAnimations.delete(name);
                } else {
                    animation.renderFrame(now);
                }
            });
        });
    requestAnimationFrame(() => animationLoop());
}
