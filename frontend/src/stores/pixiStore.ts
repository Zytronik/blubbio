import { allTextures, bubbleTexture } from '@/ts/pixi/data/allTextures';
import { defineStore } from 'pinia';
import { Application, Assets, Container, Sprite } from 'pixi.js';
import { allFonts } from '@/ts/pixi/data/allFonts';
import { AllContainers } from '@/ts/_interface/pixi/allContainers';
import { createGlobalContainer, drawGameContainerLayoutRect } from '@/ts/pixi/assetFactory/globalContainerBuilder';
import { setupGameSubContainers } from '@/ts/pixi/assetFactory/gameContainersBuilder';
import { GameSubContainers } from '@/ts/_interface/pixi/boardVisuals';
import { PixiAnimation } from '@/ts/_interface/pixi/pixiAnimation';
import { COUNTDOWN_ANIMATION_CONTEXT, COUNTDOWN_ANIMATION_NAME, getCountdownAnimation } from '@/ts/pixi/animation/countdownAnimation';
import { getGarbagePreviewAnimation } from '@/ts/pixi/animation/garbagePreviewAnimation';
import { GameInstance } from '@/ts/_interface/game/gameInstance';
import { getBoardDisplay } from '@/ts/pixi/display/boardDisplay';
import { getBubbleQueueDisplay } from '@/ts/pixi/display/bubbleQueueDisplay';
import { getHeldBubbleDisplay } from '@/ts/pixi/display/holdBubbleDisplay';
import { getArrowDisplay } from '@/ts/pixi/display/arrowDisplay';
import { getUsernameDisplay } from '@/ts/pixi/display/userNameDisplay';
import { getStatsDisplay } from '@/ts/pixi/display/statsDisplay';
import { getBackToQuitDisplay } from '@/ts/pixi/display/backDisplay';
import { getPreviewBubbleDisplay } from '@/ts/pixi/display/previewBubbleDisplay';
//import { getMonkeyAnimation } from '@/ts/debug/monkeyActions';

//Map<contextName: string, Map<animationID: string, PixiAnimation>>
const allAnimationsMap: Map<string, Map<string, PixiAnimation>> = new Map();
export const usePixiStore = defineStore('pixi', () => {
    const pixiApp = new Application();
    let allContainers: AllContainers;
    function initPixiApp() {
        if (pixiApp.renderer) return;
        const CANVAS_ID = '#pixiCanvas';
        pixiApp
            .init({
                background: '#252525',
                resizeTo: window,
            })
            .then(async () => {
                document.querySelector(CANVAS_ID)?.appendChild(pixiApp.canvas);
                allContainers = createGlobalContainer(pixiApp.stage, pixiApp.canvas.height, pixiApp.canvas.width);
                animationLoop();
            });
        allTextures.forEach(async asset => {
            asset.texture = await Assets.load(asset.src);
        });
        allFonts.forEach(async font => {
            await Assets.load(font.src);
        });
    }

    /*------------------------------------------------------
        CONTAINER AND SPRITES
    ------------------------------------------------------*/
    function showGame(): void {
        allContainers.gameContainer.visible = true;
    }
    function hideGame(): void {
        allContainers.gameContainer.visible = false;
    }
    function destroyAllGameContainers(): void {
        const length = allContainers.gameContainer.children.length - 1;
        for (let i = length; i >= 0; i--) {
            const child = allContainers.gameContainer.children[i];
            child.destroy({ children: true });
        }
        drawGameContainerLayoutRect(allContainers.gameContainer);
    }
    function createGameSubContainers(): GameSubContainers {
        return setupGameSubContainers(allContainers.gameContainer);
    }
    function createBubbleSprite(): Container {
        const container = new Container();
        const sprite = new Sprite({ texture: bubbleTexture.texture });
        container.addChild(sprite);
        return container;
    }
    /*------------------------------------------------------
        ANIMATIONS
    ------------------------------------------------------*/
    function playCountdown(duration: number, afterCountdown: () => void): void {
        const animation = getCountdownAnimation(allContainers.overlayContainer, duration, afterCountdown);
        addAnimation(animation);
    }
    function cancelCountdown(): void {
        cancelAnimation(COUNTDOWN_ANIMATION_CONTEXT, COUNTDOWN_ANIMATION_NAME);
    }
    function garbagePreview(instance: GameInstance): void {
        const animation = getGarbagePreviewAnimation(instance);
        addAnimation(animation);
    }
    /*------------------------------------------------------
        DISPLAYS
    ------------------------------------------------------*/
    function displayInstance(instance: GameInstance): void {
        const instanceDisplayAnimations: PixiAnimation[] = [
            getBoardDisplay(instance),
            getBubbleQueueDisplay(instance),
            getHeldBubbleDisplay(instance),
            getArrowDisplay(instance),
            getUsernameDisplay(instance),
            getStatsDisplay(instance),
            getBackToQuitDisplay(allContainers.overlayContainer, instance),

            //TODO this should be debug mode
            getPreviewBubbleDisplay(instance),
        ];
        instanceDisplayAnimations.forEach(display => {
            addAnimation(display);
        });
    }

    //TODO check destroy pipeline again. where should this happen? after animation? after game? on death?
    function stopInstanceAnimations(instance: GameInstance): void {
        cancelAllAnimationsOfContext(instance.playerName);
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

    /*  function DEBUG_addMonkeyPlayer(instance: GameInstance, monkeyName: string): void {
         const animation = getMonkeyAnimation(instance, monkeyName);
         addAnimation(animation);
     } */
    return {
        pixiApp,
        initPixiApp,
        showGame,
        hideGame,
        destroyAllGameContainers,
        createGameSubContainers,
        createBubbleSprite,
        playCountdown,
        cancelCountdown,
        garbagePreview,
        displayInstance,
        stopInstanceAnimations,
    };
});

function animationLoop(): void {
    const now = performance.now();
    allAnimationsMap.forEach((animationMap, context) => {
        animationMap.forEach((animation, name) => {
            if (animation.endMS < now) {
                animation.onEnd();
                animationMap.delete(name);
                if (animationMap.size === 0) {
                    allAnimationsMap.delete(context);
                }
            } else {
                animation.renderFrame(now);
            }
        });
    });
    requestAnimationFrame(() => animationLoop());
}

function addAnimation(animation: PixiAnimation): void {
    animation.onStart();
    const contextMap = allAnimationsMap.get(animation.context);
    if (contextMap) {
        contextMap.set(animation.name, animation);
    } else {
        const newContextMap = new Map<string, PixiAnimation>();
        newContextMap.set(animation.name, animation);
        allAnimationsMap.set(animation.context, newContextMap);
    }
}

function cancelAnimation(context: string, animationName: string): void {
    const contextMap = allAnimationsMap.get(context);
    if (contextMap) {
        contextMap.get(animationName)?.cleanUp();
        contextMap.delete(animationName);
        if (contextMap.size === 0) {
            allAnimationsMap.delete(context);
        }
    }
}

function cancelAllAnimationsOfContext(context: string): void {
    const contextMap = allAnimationsMap.get(context);
    if (contextMap) {
        contextMap.forEach((animation, name) => {
            animation.cleanUp();
        })
        contextMap.clear();
    }
}
