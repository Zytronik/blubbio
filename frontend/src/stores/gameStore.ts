import { defineStore } from "pinia";
import { getEmptyGame, newSprintInstance, } from "@/ts/game/setup";
import { GAME_MODE } from "@/ts/_enum/gameMode";
import { useUserStore } from "./userStore";
import { useInputStore } from "./inputStore";
import { INPUT_CONTEXT } from "@/ts/_enum/inputContext";
import { GameInstance } from "@/ts/_interface/game/gameInstance";
import { startGameLogicLoop } from "@/ts/game/gameLoop";
import { gameContainer } from "@/ts/pixi/container";
import { addMonkeyActions } from "@/ts/animationPixi/monkeyActions";
import { centerAngle, mirrorAngle } from "@/ts/game/actions/aiming";
import { shootBubble } from "@/ts/game/actions/shoot";

export const useGameStore = defineStore('game', () => {
    const game = getEmptyGame();
    function setupSprint(): void {
        const userName = useUserStore().getUserName();
        game.gameMode = GAME_MODE.SPRINT;
        game.inputContext = INPUT_CONTEXT.GAME_WITH_RESET;
        game.spectating = false;
        game.instancesMap.set(userName, newSprintInstance());
    }
    function startGame(): void {
        useInputStore().setInputContext(game.inputContext);
        gameContainer.visible = true;    //this should become a store!
        startGameLogicLoop();
    }
    function pressedLeft(userName: string): void {
        const instance = game.instancesMap.get(userName);
        if (instance) {
            instance.left = true;
        }
    }
    function releasedLeft(userName: string): void {
        const instance = game.instancesMap.get(userName);
        if (instance) {
            instance.left = false;
        }
    }
    function pressedRight(userName: string): void {
        const instance = game.instancesMap.get(userName);
        if (instance) {
            instance.right = true;
        }
    }
    function releasedRight(userName: string): void {
        const instance = game.instancesMap.get(userName);
        if (instance) {
            instance.right = false;
        }
    }
    function toggleAPS(userName: string): void {
        const instance = game.instancesMap.get(userName);
        if (instance) {
            const currentAPS = instance.aps;
            const defaultAPS = instance.handlingSettings.defaultAPS;
            const toggleASP = instance.handlingSettings.toggleAPS;
            instance.aps = (currentAPS === defaultAPS) ? toggleASP : defaultAPS;
        }
    }
    function pressedCenter(userName: string): void {
        const instance = game.instancesMap.get(userName);
        if (instance) {
            centerAngle(instance);
        }
    }
    function pressedMirror(userName: string): void {
        const instance = game.instancesMap.get(userName);
        if (instance) {
            mirrorAngle(instance);
        }
    }
    function pressedShoot(userName: string): void {
        const instance = game.instancesMap.get(userName);
        if (instance) {
            shootBubble(instance);
        }
    }
    function pressedHold(userName: string): void {
        // console.log("you are not empty eslint :^)")
    }
    function getAllInstances(): GameInstance[] {
        return [...game.instancesMap.values()];
    }

    function createMonkeyTesting(monkeyAmount: number): void {
        // game = getEmptyGame();
        game.gameMode = GAME_MODE.SPRINT;
        game.inputContext = INPUT_CONTEXT.GAME_NO_RESET;
        game.spectating = true;
        for (let i = 1; i <= monkeyAmount; i++) {
            const name = "Monkey-" + i;
            console.log(name)
            const instance = newSprintInstance()
            addMonkeyActions(instance, name);
            game.instancesMap.set(name, instance);
        }
        console.log(game)
    }

    return {
        setupSprint, startGame,
        pressedLeft, pressedRight,
        releasedLeft, releasedRight,
        toggleAPS,
        pressedCenter, pressedMirror, pressedShoot, pressedHold,
        getAllInstances,
        createMonkeyTesting,
    }
})
