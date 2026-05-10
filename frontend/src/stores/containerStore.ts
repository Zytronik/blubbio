import { defineStore } from 'pinia';
import { AllContainers } from '@/ts/_interface/pixi/allContainers';
import { drawGameContainerLayoutRect, getGlobalContainer } from '@/ts/pixi/assetFactory/globalContainerBuilder';
import { Container } from 'pixi.js';

export const useContainerStore = defineStore('container', () => {
    let allContainers: AllContainers;
    function setupGlobalContainers(): void {
        allContainers = getGlobalContainer();
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
            child.destroy({ children: true })
        }
        drawGameContainerLayoutRect(allContainers.gameContainer)
        // allContainers.gameContainer.children[1].destroy({children: true})
    }
    function getGameContainer(): Container {
        return allContainers.gameContainer;
    }
    function getOverlayContainer(): Container {
        return allContainers.overlayContainer;
    }
    //handles visibility and probably content clean up after finished game
    //maybe aspect ratio and responsive
    return { setupGlobalContainers, showGame, hideGame, cleanUpGameContainer, getGameContainer, getOverlayContainer };
});
