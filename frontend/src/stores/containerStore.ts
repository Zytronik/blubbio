import { defineStore } from 'pinia';
import { AllContainers } from '@/ts/_interface/pixi/allContainers';
import { getGlobalContainer } from '@/ts/pixi/assetFactory/globalContainerBuilder';
import { Container } from 'pixi.js';

export const useContainerStore = defineStore('container', () => {
    let allContainers: AllContainers;
    function setupGlobalContainers(): void {
        allContainers = getGlobalContainer();
    }
    function showGame(): void {
        allContainers.gameContainer.visible = true;
    }
    function getGameContainer(): Container {
        return allContainers.gameContainer;
    }
    function getCountdownContainer(): Container {
        return allContainers.countDownContainer;
    }
    //handles visibility and probably content clean up after finished game
    //maybe aspect ratio and responsive
    return { setupGlobalContainers, showGame, getGameContainer, getCountdownContainer };
});
