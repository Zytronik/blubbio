import { defineStore } from 'pinia';
import { GAME_MODE } from '@/ts/_enum/gameMode';
import { useUserStore } from './userStore';
import { useInputStore } from './inputStore';
import { INPUT_CONTEXT } from '@/ts/_enum/inputContext';
import { GameInstance } from '@/ts/_interface/game/gameInstance';
import { startGameLogicLoop } from '@/ts/gameLogic/gameLogicLoop';
import { centerAngle, changeAPS, mirrorAngle } from '@/ts/gameLogic/actions/aiming';
import { shootBubble } from '@/ts/gameLogic/actions/shoot';
import { applyShotResultToGrid } from '@/ts/gameLogic/bubble/grid';
import { swapHoldBubble } from '@/ts/gameLogic/actions/hold';
import { getEmptyGame } from '@/ts/gameLogic/setup/gameSetup';
import { newSprintInstance } from '@/ts/gameLogic/setup/instanceSetup';
import { nextBubble } from '@/ts/gameLogic/bubble/queue';
import { prepareGarbage } from '@/ts/gameLogic/bubble/garbage';
import { GameSettings } from '@/ts/_interface/game/gameSettings';
import { SPRINT_SETTINGS } from '@/ts/gameLogic/settings/sprintSettings';
import { LayoutProperties } from '@/ts/_interface/pixi/layoutProperties';
import { calculateLayoutProperties } from '@/ts/pixi/layouting/layoutProperties';
import { applyGameLayout } from '@/ts/pixi/layouting/gameLayout';
import { addMonkeyActions } from '@/ts/animationPixi/monkeyActions';
import { useMultiplayerStore } from './multiplayerStore';
import { renderCountdown } from '@/ts/animationPixi/countdownAnimation';
import { useContainerStore } from './containerStore';
import { transitionOutOfGame } from '@/ts/animationCSS/transitionOutOfGame';

//game should keep track of layouting. its part of the games animation.
//similarly, who is currently the main spectator target should also be tracked by the game
export const useGameStore = defineStore('game', () => {
    const game = getEmptyGame();
    function setupSprint(): void {
        const userName = useUserStore().getUserName();
        game.gameMode = GAME_MODE.SPRINT;
        game.inputContext = INPUT_CONTEXT.GAME_WITH_RESET;
        game.spectating = false;
        game.instancesMap.set(userName, newSprintInstance(userName));
        applyGameLayout([...game.instancesMap.values()]);
    }
    function setupMultiplayer(gameSettings: GameSettings, otherPlayersUsernames: string[]): void {
        const playerUserName = useUserStore().getUserName();
        game.gameMode = GAME_MODE.SPRINT;
        game.inputContext = INPUT_CONTEXT.GAME_WITH_RESET;
        game.spectating = false;
        game.instancesMap.set(playerUserName, newSprintInstance(playerUserName));
        otherPlayersUsernames.forEach(userName => {
            game.instancesMap.set(userName, newSprintInstance(userName));
        });
        applyGameLayout([...game.instancesMap.values()]);
        useMultiplayerStore().listenToOtherPlayers();
    }
    function startGame(): void {
        const countDownDuration = game.instancesMap.values().next().value!.gameSettings.countDownDuration;
        renderCountdown(countDownDuration, afterCountdown);
        function afterCountdown(): void {
            startGameLogicLoop();
            useInputStore().setInputContext(game.inputContext);
        }
    }
    function cancelGame(): void {
        //stop all animations
        game.instancesMap.clear();
        transitionOutOfGame(game.gameMode);
        useContainerStore().cleanUpGameContainer();
        useInputStore().setInputContext(INPUT_CONTEXT.MENU);
    }
    function refreshLayout(): void {
        applyGameLayout([...game.instancesMap.values()]);
    }
    function getLayoutProperties(): LayoutProperties {
        if (game.instancesMap.size > 0) {
            return calculateLayoutProperties(game.instancesMap.values().next().value!.gameSettings);
        }
        return calculateLayoutProperties(SPRINT_SETTINGS);
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
        game.gameMode = GAME_MODE.SPRINT;
        game.inputContext = INPUT_CONTEXT.GAME_NO_RESET;
        game.spectating = true;
        for (let i = 1; i <= monkeyAmount; i++) {
            const name = 'Monkey-' + i;
            const instance = newSprintInstance(name);
            addMonkeyActions(instance, name);
            game.instancesMap.set(name, instance);
        }
    }

    function addGarbageToAllInstances(): void {
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
        setupMultiplayer,
        startGame,
        cancelGame,
        refreshLayout,
        getLayoutProperties,
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
