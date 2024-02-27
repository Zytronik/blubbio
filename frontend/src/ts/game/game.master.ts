import { showASCIIDefeat, showASCIIVictory, startASCIIAnimation, stopASCIIAnimation } from "./visuals/game.visuals.ascii";
import { GameInstance } from "./i/game.i.game-instance";
import { disableGameInputs, enableGameInputs } from "../input/input.input-manager";
import { cleanUpAngle } from "./logic/game.logic.angle";
import { angleLeftInput, angleRightInput } from "../input/input.possible-inputs";
import { GameStats } from "./i/game.i.stats";
import { Bubble } from "./i/game.i.bubble";
import { Grid } from "./i/game.i.grid";
import { calculatePreview, shootBubble } from "./logic/game.logic.shoot";
import { startStatDisplay, stopStatDisplay } from "./visuals/game.visuals.stat-display";
import { createGameInstance, resetGameInstance } from "./logic/game.logic.instance-creator";
import { allGameSettings } from "./settings/game.settings.game";
import { GAME_MODE } from "./settings/i/game.settings.i.game-modes";
import { allHandlingSettings } from "./settings/game.settings.handling";
import { GameTransitions } from "./i/game.i.game-transitions";
import { GameSettings } from "./settings/i/game.settings.i.game-settings";
import { holdBubble, updateBubbleQueueAndCurrent } from "./logic/game.logic.bubble-manager";
import { backendSetupGame } from "./game.network-commands";


let playerGameInstance: GameInstance;
export function setupSprintGame(): void {
    const transitions: GameTransitions = {
        onGameStart: startSprint,
        onGameReset: resetSprint,
        onGameAbort: cancelSprint,
        onGameDefeat: sprintDeath,
        onGameVictory: sprintVictory
    }

    applyGameSettingsRefNumbers(allGameSettings);
    playerGameInstance = createGameInstance(allGameSettings, GAME_MODE.SPRINT, allHandlingSettings, transitions);
    backendSetupGame(GAME_MODE.SPRINT, allGameSettings, allHandlingSettings)

    function startSprint(): void {
        //TODO disable menu controls
        startASCIIAnimation();
        startStatDisplay();
        enableGameInputs();
        playerGameInstance.stats.gameStartTime = performance.now();
    }
    function resetSprint(): void {
        //todo
        //track reset amount?
        disableGameInputs();
        stopASCIIAnimation();
        stopStatDisplay();
        resetGameInstance(playerGameInstance);
        startASCIIAnimation();
        startStatDisplay();
        enableGameInputs();
        playerGameInstance.stats.gameStartTime = performance.now();
    }
    function cancelSprint(): void {
        //TODO enable menu controls
        disableGameInputs();
        stopASCIIAnimation();
        stopStatDisplay();
        resetGameInstance(playerGameInstance);
    }
    function sprintVictory(): void {
        const stats = playerGameInstance.stats;
        stats.gameEndTime = performance.now();
        stats.gameDuration = stats.gameEndTime - stats.gameStartTime;
        stats.bubblesPerSecond = Number((stats.bubblesShot / stats.gameDuration * 1000).toFixed(2));

        disableGameInputs();
        stopASCIIAnimation();
        stopStatDisplay();
        showASCIIVictory();
        // submitGametoDB();
    }
    function sprintDeath(): void {
        disableGameInputs();
        stopASCIIAnimation();
        stopStatDisplay();
        showASCIIDefeat();
    }
}

function applyGameSettingsRefNumbers(gameSettings: GameSettings): void {
    gameSettings.gridWidth.value = gameSettings.gridWidth.refValue;
    gameSettings.gridHeight.value = gameSettings.gridHeight.refValue;
    gameSettings.gridExtraHeight.value = gameSettings.gridExtraHeight.refValue;
    gameSettings.minAngle.value = gameSettings.minAngle.refValue;
    gameSettings.maxAngle.value = gameSettings.maxAngle.refValue;
    gameSettings.widthPrecisionUnits.value = gameSettings.widthPrecisionUnits.refValue;
    gameSettings.collisionDetectionFactor.value = gameSettings.collisionDetectionFactor.refValue;
}

export function startGame(): void {
    playerGameInstance.gameTransitions.onGameStart();
}
export function resetGame(): void {
    playerGameInstance.gameTransitions.onGameReset();
}
export function leaveGame(): void {
    playerGameInstance.gameTransitions.onGameAbort();
}
//not sure if this is needed
export function triggerGameVictory(): void {
    playerGameInstance.gameTransitions.onGameDefeat();
}
export function triggerGameLost(): void {
    playerGameInstance.gameTransitions.onGameVictory();
}


//Inputs
export function angleLeft(): void {
    const oldAngle = playerGameInstance.angle;
    const timePassed = performance.now() - angleLeftInput.lastFiredAtTime;
    const leftAmount = playerGameInstance.currentAPS * timePassed / 1000
    playerGameInstance.angle = cleanUpAngle(oldAngle - leftAmount, playerGameInstance.gameSettings);
}
export function angleRight(): void {
    const oldAngle = playerGameInstance.angle;
    const timePassed = performance.now() - angleRightInput.lastFiredAtTime;
    const rightAmount = playerGameInstance.currentAPS * timePassed / 1000
    playerGameInstance.angle = cleanUpAngle(oldAngle + rightAmount, playerGameInstance.gameSettings);
}
export function angleCenter(): void {
    playerGameInstance.angle = 90;
}
export function changeAPS(): void {
    playerGameInstance.currentAPS = playerGameInstance.handlingSettings.toggleAPS.value;
}
export function revertAPS(): void {
    playerGameInstance.currentAPS = playerGameInstance.handlingSettings.defaultAPS.value;
}
export function triggerShoot(): void {
    shootBubble(playerGameInstance);
    updateBubbleQueueAndCurrent(playerGameInstance);
}
export function triggerHold(): void {
    holdBubble(playerGameInstance);
}


//Exported visuals
export function getGameStats(): GameStats {
    return playerGameInstance.stats;
}
export function getAngle(): number {
    return playerGameInstance.angle;
}
export function getCurrentBubble(): Bubble {
    return playerGameInstance.currentBubble;
}
export function getHoldBubble(): Bubble {
    if (!playerGameInstance.holdBubble) {
        return {
            color: "",
            ascii: "",
            type: 0
        }
    }
    return playerGameInstance.holdBubble as Bubble;
}
export function getBubbleQueue(): Bubble[] {
    return playerGameInstance.bubbleQueue;
}
export function getPlayGrid(): Grid {
    return playerGameInstance.playGrid;
}
export function updatePreviewBubble(): void {
    calculatePreview(playerGameInstance);
}