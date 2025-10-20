import { defineStore } from 'pinia';
import { GAME_MODE } from '@/ts/_enum/gameMode';
import { useUserStore } from './userStore';
import { useInputStore } from './inputStore';
import { INPUT_CONTEXT } from '@/ts/_enum/inputContext';
import { GameInstance } from '@/ts/_interface/game/gameInstance';
import { startGameLogicLoop } from '@/ts/game/gameLogicLoop';
import { addMonkeyActions } from '@/ts/animationPixi/monkeyActions';
import { centerAngle, changeAPS, mirrorAngle } from '@/ts/game/actions/aiming';
import { shootBubble } from '@/ts/game/actions/shoot';
import { applyShotResultToGrid } from '@/ts/game/bubble/grid';
import { swapHoldBubble } from '@/ts/game/actions/hold';
import { getEmptyGame } from '@/ts/game/setup/gameSetup';
import { newSprintInstance } from '@/ts/game/setup/instanceSetup';
import { nextBubble } from '@/ts/game/bubble/queue';
import { prepareGarbage } from '@/ts/game/bubble/garbage';
import { gameVisuals, drawGame, setupGameVisuals } from '@/ts/pixi/container';


export const useGameStore = defineStore('game', () => {
    const game = getEmptyGame();
    function setupSprint(): void {
        const userName = useUserStore().getUserName();
        game.gameMode = GAME_MODE.SPRINT;
        game.inputContext = INPUT_CONTEXT.GAME_WITH_RESET;
        game.spectating = false;
        game.instancesMap.set(userName, newSprintInstance());
        setupGameVisuals();
    }
    function startGame(): void {
        useInputStore().setInputContext(game.inputContext);
        gameVisuals.gameContainer.visible = true; //this should become a store!
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
            changeAPS(instance);
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
            const shotResult = shootBubble(instance);
            applyShotResultToGrid(shotResult);
            if (shotResult.refillAmount) {
                const messiness = instance.gameSettings.refillMessiness;
                const amount = shotResult.refillAmount;
                prepareGarbage(instance, messiness, amount);
            }
            nextBubble(instance);
        }
    }
    function pressedHold(userName: string): void {
        const instance = game.instancesMap.get(userName);
        if (instance) {
            swapHoldBubble(instance);
        }
    }
    function getAllInstances(): GameInstance[] {
        return [...game.instancesMap.values()];
    }

    function createMonkeyTesting(monkeyAmount: number): void {
        // game = getEmptyGame();
        game.gameMode = GAME_MODE.SPRINT;
        game.inputContext = INPUT_CONTEXT.GAME_NO_RESET;
        game.spectating = true;
        setupGameVisuals();
        for (let i = 1; i <= monkeyAmount; i++) {
            const name = 'Monkey-' + i;
            const instance = newSprintInstance();
            addMonkeyActions(instance, name);
            game.instancesMap.set(name, instance);
        }
        drawGame();

        // game.gameMode = GAME_MODE.SPRINT;
        // game.inputContext = INPUT_CONTEXT.GAME_NO_RESET;
        // game.spectating = true;
        // const instance = newSprintInstance();
        // game.instancesMap.set('test', instance);
    }

    function addGarbageToAllInstances(amount: number): void {
        game.instancesMap.forEach(instance => {
            const messiness = instance.gameSettings.refillMessiness;
            prepareGarbage(instance, messiness, 1);
        });
    }

    function debugLogGameField(): void {
        game.instancesMap.forEach((instance, userName) => {
            console.log('Game Field for ', userName);
            let fieldString = '';
            instance.playGrid.rows.forEach(row => {
                row.fields.forEach(field => {
                    if (field.bubble) {
                        fieldString += field.bubble.type;
                    } else {
                        fieldString += '-';
                    }
                });
                fieldString += '\n';
            });
            console.log(fieldString);
        });
    }

    return {
        setupSprint,
        startGame,
        pressedLeft,
        pressedRight,
        releasedLeft,
        releasedRight,
        toggleAPS,
        pressedCenter,
        pressedMirror,
        pressedShoot,
        pressedHold,
        getAllInstances,
        createMonkeyTesting,
        debugLogGameField,
        addGarbageToAllInstances,
    };
});
