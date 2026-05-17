import { PixiAnimation } from '@/ts/_interface/pixi/pixiAnimation';
import { defineStore } from 'pinia';
import { GameInstance } from '@/ts/_interface/game/gameInstance';
import { getBubbleQueueDisplay } from '@/ts/pixi/display/bubbleQueueDisplay';
import { getBoardDisplay } from '@/ts/pixi/display/boardDisplay';
import { getHeldBubbleDisplay } from '@/ts/pixi/display/holdBubbleDisplay';
import { getArrowDisplay } from '@/ts/pixi/display/arrowDisplay';
import { getUsernameDisplay } from '@/ts/pixi/display/userNameDisplay';
import { getStatsDisplay } from '@/ts/pixi/display/statsDisplay';
import { getPreviewBubbleDisplay } from '@/ts/pixi/display/previewBubbleDisplay';
import { getBackToQuitDisplay } from '@/ts/pixi/display/backDisplay';
import { COUNTDOWN_ANIMATIONNAME, getCountdownAnimation } from '@/ts/pixi/animation/countdownAnimation';
import { getGarbagePreviewAnimation } from '@/ts/pixi/animation/garbagePreviewAnimation';
import { getMonkeyAnimation } from '@/ts/debug/monkeyActions';

const globalAnimations: Map<string, PixiAnimation> = new Map<string, PixiAnimation>();
const instanceAnimations: Map<string, PixiAnimation> = new Map<string, PixiAnimation>();
export const useAnimationStore = defineStore('animation', () => {
    let pixiAnimationRunning = false;
    function startAnimationLoop(): void {
        if (!pixiAnimationRunning) {
            animationLoop();
            pixiAnimationRunning = true;
        }
    }
    function playCountdown(duration: number, afterCountdown: () => void): void {
        const animation = getCountdownAnimation(duration, afterCountdown);
        animation.onStart();
        globalAnimations.set(animation.name, animation);
    }
    function cancelCountdown(): void {
        const animation = globalAnimations.get(COUNTDOWN_ANIMATIONNAME);
        animation?.onCancel();
        globalAnimations.delete(COUNTDOWN_ANIMATIONNAME);
    }
    function displayInstance(instance: GameInstance): void {
        const instanceDisplayAnimations: PixiAnimation[] = [
            getBoardDisplay(instance),
            getBubbleQueueDisplay(instance),
            getHeldBubbleDisplay(instance),
            getArrowDisplay(instance),
            getUsernameDisplay(instance),
            getStatsDisplay(instance),
            getBackToQuitDisplay(instance),

            getPreviewBubbleDisplay(instance),
        ];
        instanceDisplayAnimations.forEach(display => {
            display.onStart();
            instanceAnimations.set(display.name, display);
            instance.ongoingAnimations.add(display.name);
        });
    }
    function garbagePreview(instance: GameInstance): void {
        const animation = getGarbagePreviewAnimation(instance);
        animation.onStart();
        instanceAnimations.set(animation.name, animation);
        instance.ongoingAnimations.add(animation.name);
    }
    function stopInstanceAnimations(instance: GameInstance): void {
        instance.ongoingAnimations.forEach(animationName => {
            instanceAnimations.get(animationName)?.onCancel();
            instanceAnimations.delete(animationName);
        });
        instance.gameSprites.arrow.destroy();
        instance.gameSprites.bubbleQueue.forEach(sprite => {
            sprite.destroy();
        });
        instance.gameSprites.currentBubble.destroy();

        instance.gameSprites.previewBubble.destroy();
        instance.gameSprites.fieldBubbles.forEach(spriteArray => {
            spriteArray.forEach(sprite => {
                sprite.destroy();
            });
        });
        instance.gameSprites.garbageBubbles.forEach(sprite => {
            sprite.destroy();
        });
    }

    function addMonkeyTesting(instance: GameInstance, monkeyName: string): void {
        const animation = getMonkeyAnimation(instance, monkeyName);
        animation.onStart();
        instanceAnimations.set(animation.name, animation);
    }

    return { startAnimationLoop, playCountdown, cancelCountdown, displayInstance, garbagePreview, stopInstanceAnimations, addMonkeyTesting };
});

function animationLoop(): void {
    const now = performance.now();
    globalAnimations.forEach((animation, name) => {
        if (animation.endMS < now) {
            animation.onEnd();
            globalAnimations.delete(name);
        } else {
            animation.renderFrame(now);
        }
    });
    instanceAnimations.forEach((animation, name) => {
        if (animation.endMS < now) {
            animation.onEnd();
            instanceAnimations.delete(name);
        } else {
            animation.renderFrame(now);
        }
    });
    requestAnimationFrame(() => animationLoop());
}
