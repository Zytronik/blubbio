import { defineStore } from 'pinia';
import { AllContainers } from '@/ts/_interface/pixi/allContainers';
import { getGlobalContainer } from '@/ts/pixi/assetFactory/globalContainerBuilder';
import { GameInstance } from '@/ts/_interface/game/gameInstance';
import { Container } from 'pixi.js';
import { LayoutProperties } from '@/ts/_interface/pixi/layoutProperties';
import { calculateLayoutProperties } from '@/ts/pixi/layouting/layoutProperties';
import { GameSettings } from '@/ts/_interface/game/gameSettings';
import { applyGameLayout } from '@/ts/pixi/layouting/gameLayout';

export const useContainerStore = defineStore('container', () => {
    let allContainers: AllContainers;
    function setupGlobalContainers(): void {
        allContainers = getGlobalContainer();
    }
    function refreshLayout(gameInstances: GameInstance[], settings: GameSettings): void {
        const layoutProperties = calculateLayoutProperties()
        applyGameLayout(gameInstances, settings, layoutProperties)
    }
    function showGame(): void {
        allContainers.gameContainer.visible = true;
    }
    function getGameContainer(): Container {
        return allContainers.gameContainer;
    }
    //handles visibility and probably content clean up after finished game
    //maybe aspect ratio and responsive
    //refresh layout will probably become an animation.
    return { setupGlobalContainers, refreshLayout, showGame, getGameContainer };
});
