import { defineStore } from 'pinia';
import { GAME_MODE } from '@/ts/_enum/gameMode';
import { useUserStore } from './userStore';
import { useInputStore } from './inputStore';
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
import { useMultiplayerStore } from './multiplayerStore';
import { transitionOutOfGame } from '@/ts/cssAnimation/transitionOutOfGame';
import { usePixiStore } from './pixiStore';
import { showDeathOverlay } from '@/ts/cssAnimation/showDeathOverlay';


//game should keep track of layouting. its part of the games animation.
//similarly, who is currently the main spectator target should also be tracked by the game
export const useGameStore = defineStore('game', () => {
    const game = getEmptyGame();
    function setupSprint(): void {
        const userName = useUserStore().getUserName();
        game.gameMode = GAME_MODE.SPRINT;
        game.spectating = false;
        game.instancesMap.set(userName, newSprintInstance(userName));
        applyGameLayout([...game.instancesMap.values()]);
    }
    function setupMultiplayer(gameSettings: GameSettings, otherPlayersUsernames: string[]): void {
        const playerUserName = useUserStore().getUserName();
        game.gameMode = GAME_MODE.SPRINT;
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
        useInputStore().countdownInputs();
        usePixiStore().playCountdown(countDownDuration, afterCountdown);
        function afterCountdown(): void {
            startGameLogicLoop(game);
            if (game.gameMode === GAME_MODE.SPRINT) {
                useInputStore().gameWithResetInputs();
            }
            if (game.gameMode === GAME_MODE.MULTI_PLAYER) {
                useInputStore().gameNoResetInputs();
            }
        }
    }
    function cancelGame(): void {
        usePixiStore().cancelCountdown();
        game.instancesMap.forEach((instance, playerName) => {
            usePixiStore().stopInstanceAnimations(instance);
        });
        useInputStore().disableInput();
        game.instancesMap.clear();
        transitionOutOfGame(game.gameMode);
        useInputStore().menuInputs();
    }
    function resetGame(): void {
        usePixiStore().cancelCountdown();
        game.instancesMap.forEach((instance, playerName) => {
            usePixiStore().stopInstanceAnimations(instance);
        });
        useInputStore().disableInput();
        game.instancesMap.clear();
        usePixiStore().destroyAllGameContainers();
        //TODO has to consider game mode at some point
        setupSprint();
        startGame();
    }
    function showResultScreen(): void {
        game.instancesMap.forEach((instance, playerName) => {
            usePixiStore().stopInstanceAnimations(instance);
        });
        transitionOutOfGame(game.gameMode);
        useInputStore().menuInputs();
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

    function pressedBack(userName: string): void {
        const instance = game.instancesMap.get(userName);
        if (instance) {
            instance.backPressed = true;
            instance.backPressedAt = performance.now();
        }
    }
    function releasedBack(userName: string): void {
        const instance = game.instancesMap.get(userName);
        if (instance) {
            instance.backPressed = false;
            instance.backPressedAt = Infinity;
        }
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
    function pressedHold(userName: string): void {
        const instance = game.instancesMap.get(userName);
        if (instance) {
            swapHoldBubble(instance);
        }
    }
    function pressedShoot(userName: string): void {
        const instance = game.instancesMap.get(userName);
        if (instance) {
            const shotResult = shootBubble(instance);
            applyShotResultToGrid(shotResult);
            if (shotResult.hasPassedClearCondition) {
                // TODO: wining animation
                showResultScreen();
            }
            if (shotResult.refillAmount) {
                const messiness = instance.gameSettings.refillMessiness;
                const amount = shotResult.refillAmount;
                prepareGarbage(instance, messiness, amount);
            }
            nextBubble(instance);
            if (shotResult.hasDied) {
                //TODO game mode based input state?
                useInputStore().countdownInputs();
                showDeathOverlay(game.gameMode);
            }
        }
    }

    function createMonkeyTesting(monkeyAmount: number): void {
        // game.gameMode = GAME_MODE.SPRINT;
        // game.spectating = true;
        // for (let i = 1; i <= monkeyAmount; i++) {
        //     const name = 'Monkey-' + i;
        //     const instance = newSprintInstance(name);
        //     usePixiStore().addMonkeyTesting(instance, name);
        //     game.instancesMap.set(name, instance);
        // }
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
        resetGame,
        refreshLayout,
        getLayoutProperties,
        pressedBack,
        releasedBack,
        pressedLeft,
        pressedRight,
        releasedLeft,
        releasedRight,
        toggleAPS,
        pressedCenter,
        pressedMirror,
        pressedHold,
        pressedShoot,
        createMonkeyTesting,
        debugLogGameField,
        addGarbageToAllInstances,
    };
});
