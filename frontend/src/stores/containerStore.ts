import { defineStore } from 'pinia';
import { AllContainers } from '@/ts/_interface/pixi/allContainers';
import { getGlobalContainer } from '@/ts/pixi/assetFactory/globalContainerBuilder';
import { GameInstance } from '@/ts/_interface/game/gameInstance';

export const useContainerStore = defineStore('container', () => {
    let allContainers: AllContainers;
    function setupGlobalContainers(): void {
        allContainers = getGlobalContainer();
    }
    function applyLayout(gameInstances: GameInstance[]): void {
        
    }
    function showGame(): void {
        allContainers.gameContainer.visible = true;
    }
    //handles visibility and probably content clean up after finished game
    //maybe aspect ratio and responsive
    return { setupGlobalContainers, applyLayout, showGame };
});
