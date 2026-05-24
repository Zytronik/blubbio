import { defineStore } from 'pinia';
import { AllContainers } from '@/ts/_interface/pixi/allContainers';
import { drawGameContainerLayoutRect, createGlobalContainer } from '@/ts/pixi/assetFactory/globalContainerBuilder';
import { Container, Sprite } from 'pixi.js';
import { GameSubContainers } from '@/ts/_interface/pixi/boardVisuals';
import { createGameSubContainers } from '@/ts/pixi/assetFactory/gameContainersBuilder';
import { bubbleTexture } from '@/ts/pixi/data/allTextures';

//handles visibility of containers and sprite creation/destruction
export const useContainerStore = defineStore('container', () => {
    let allContainers: AllContainers;
    function setupGlobalContainers(): void {
        allContainers = createGlobalContainer();
    }
    function showGame(): void {
        allContainers.gameContainer.visible = true;
    }
    function hideGame(): void {
        allContainers.gameContainer.visible = false;
    }
    function cleanUpGameContainer(): void {
        const length = allContainers.gameContainer.children.length - 1;
        for (let i = length; i >= 0; i--) {
            const child = allContainers.gameContainer.children[i];
            child.destroy({ children: true });
        }
        drawGameContainerLayoutRect(allContainers.gameContainer);
    }
    function newGameSubContainers(): GameSubContainers {
        return createGameSubContainers(allContainers.gameContainer);
    }
    function getOverlayContainer(): Container {
        return allContainers.overlayContainer;
    }
    function createBubbleSprite(): Container {
        const container = new Container();
        const sprite = new Sprite({ texture: bubbleTexture.texture });
        container.addChild(sprite);
        return container;
    }
    return { setupGlobalContainers, showGame, hideGame, cleanUpGameContainer, newGameSubContainers, getOverlayContainer, createBubbleSprite };
});
