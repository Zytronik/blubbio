import { gameContainer, mainContainer } from '@/ts/pixi/container';
import { defineStore } from 'pinia';

export const useContainerStore = defineStore('container', () => {
    function cleanUpGameContainer() {
        gameContainer.destroy({ children: true });
        //create new container
    }
    return { cleanUpGameContainer };
});
