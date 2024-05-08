import { fillAsciiStrings, startASCIIAnimation, startCountdownAnimation, stopASCIIAnimation, stopCountdownAnimation } from "./visuals/game.visuals.ascii";
import { GameInstance } from "./i/game.i.game-instance";
import { disableChannelInput, disableGameInputs, disableResetInput, enableChannelInput, enableGameInputs, enableResetInput } from "../input/input.input-manager";
import { cleanUpAngle } from "./logic/game.logic.angle";
import { angleLeftInput, angleRightInput } from "../input/input.all-inputs";
import { executeShot } from "./logic/game.logic.shoot";
import { resetStatDisplays, startStatDisplay, stopStatDisplay } from "./visuals/game.visuals.stat-display";
import { createGameInstance, getEmptyStats, resetGameInstance } from "./logic/game.logic.instance-creator";
import { GAME_MODE } from "./settings/i/game.settings.e.game-modes";
import { GameTransitions } from "./i/game.i.game-transitions";
import { holdBubble } from "./logic/game.logic.bubble-manager";
import { network_countDownState, network_leaveGame, network_resetGame, network_setupGame, network_sendInputs } from "./network/game.network.game";
import eventBus from "../page/page.event-bus";
import { getNextSeed } from "./logic/game.logic.random";
import { GAME_INPUT } from "./network/i/game.network.i.game-input";
import { InputFrame } from "./i/game.i.game-state-history";
import { GameVisuals } from "./visuals/i/game.visuals.i.game-visuals";
import { ref } from "vue";
import { createStatGraphData } from "./logic/game.logic.stat-tracker";
import { GAME_STATE } from "./i/game.e.state";
import { getSprintSettings } from "./settings/game.settings.sprint";
import { getHandlingSettings } from "./settings/game.settings.handling";
import { setupGrid } from "./logic/game.logic.grid-manager";

// export const playerGameVisuals: GameVisuals = {
//     asciiBoard: {
//         playGridASCII: ref(""),
//         holdString: ref(""),
//         queueString: ref(""),
//         incomingGarbage: ref(""),
//         floatingText: ref(""),
//     },
//     statNumbers: {
//         formattedCurrentTime: ref(""),
//         bubbleClearToWin: ref(0),
//         bubblesCleared: ref(0),
//         bubblesLeftToClear: ref(0),
//         bubblesShot: ref(0),
//         bubblesPerSecond: ref(0),
//         attackPerMinute: ref(0),
//         currentCombo: ref(0),
//         spikeNumber: ref(""),
//     },
//     timeDifference: 0,
//     playerName: "",
// };
// export const playerGameInstance: GameInstance = {
//     gameMode: GAME_MODE.SPRINT,
//     gameSettings: getSprintSettings(),
//     handlingSettings: getHandlingSettings(),
//     initialSeed: 0,
//     gameState: GAME_STATE.IS_IN_MENU,
//     bubbleSeed: 0,
//     garbageSeed: 0,
//     angle: 0,
//     currentAPS: 0,
//     currentBubble: {
//         ascii: "",
//         type: 0,
//         spriteSheetName: "",
//     },
//     bubbleQueue: [],
//     playGrid: setupGrid(getSprintSettings()),
//     queuedGarbage: 0,
//     stats: getEmptyStats(getSprintSettings()),
//     gameStateHistory: {
//         inputHistory: [],
//         boardHistory: [],
//         bubbleQueueHistory: [],
//         angleHistory: [],
//         sentgarbagehistory: [],
//         receivedgarbagehistory: []
//     },
//     processedInputsIndex: 0,
//     matchID: "none",
//     gameTransitions: {
//         /* eslint-disable @typescript-eslint/no-empty-function */
//         onGameStart: () => { },
//         onGameLeave: () => { },
//         onGameReset: () => { },
//         onGameDefeat: () => { },
//         onGameVictory: () => { },
//     },
//     sendGarbage: (garbageAmount: number) => { }
//     /* eslint-enable @typescript-eslint/no-empty-function */
// };
export function setupSprintGame(): void {
    const gameMode = GAME_MODE.SPRINT;
    const gameSettings = getSprintSettings();
    const handlingSettings = getHandlingSettings();
    const transitions: GameTransitions = {
        onGameStart: function (): void {
            enableResetInput();
            disableChannelInput();
            showCountDownAndStart();
        },
        onGameLeave: function (): void {
            disableResetInput();
            enableChannelInput();
            disableGameplay();
            network_leaveGame();
        },
        onGameReset: function (): void {
            disableGameplay();
            resetGameInstance(playerGameInstance, getNextSeed(Date.now()));
            network_resetGame(playerGameInstance.initialSeed);
            showCountDownAndStart();
        },
        onGameDefeat: sprintDeath,
        onGameVictory: sprintVictory,
    }
    const onGarbageSend = function (garbageAmount: number): void {/*nothing*/}
    const startSeed = getNextSeed(Date.now());
    const instance = createGameInstance(gameMode, gameSettings, handlingSettings, transitions, startSeed, "none", onGarbageSend);
    preparePlayerGameInstance(instance);
    fillAsciiStrings(playerGameInstance, playerGameVisuals.asciiBoard);
    playerGameVisuals.playerName = eventBus.getUserData()?.username ?? "";
    network_setupGame(playerGameInstance)
    function sprintVictory(): void {
        playerGameInstance.gameState = GAME_STATE.VICTORY_SCREEN;
        disableGameplay();
        eventBus.emit("sprintVictory");
    }
    function sprintDeath(): void {
        playerGameInstance.gameState = GAME_STATE.DEFEAT_SCREEN;
        disableGameplay();
    }
}
export function preparePlayerGameInstance(instance: GameInstance): void {
    playerGameInstance.gameMode = instance.gameMode;
    playerGameInstance.gameSettings = instance.gameSettings;
    playerGameInstance.handlingSettings = instance.handlingSettings;
    playerGameInstance.initialSeed = instance.initialSeed;
    playerGameInstance.gameState = instance.gameState;
    playerGameInstance.bubbleSeed = instance.bubbleSeed;
    playerGameInstance.garbageSeed = instance.garbageSeed;
    playerGameInstance.angle = instance.angle;
    playerGameInstance.currentAPS = instance.currentAPS;
    playerGameInstance.currentBubble = instance.currentBubble;
    playerGameInstance.holdBubble = instance.holdBubble;
    playerGameInstance.bubbleQueue = instance.bubbleQueue;
    playerGameInstance.playGrid = instance.playGrid;
    playerGameInstance.queuedGarbage = instance.queuedGarbage;
    playerGameInstance.stats = instance.stats;
    playerGameInstance.gameStateHistory = instance.gameStateHistory;
    playerGameInstance.processedInputsIndex = instance.processedInputsIndex;
    playerGameInstance.matchID = instance.matchID;
    playerGameInstance.gameTransitions = instance.gameTransitions;
}


export function startGame(): void {
    playerGameInstance.gameTransitions.onGameStart();
}
export function resetGame(): void {
    playerGameInstance.gameTransitions.onGameReset();
}
export function leaveGame(): void {
    playerGameInstance.gameTransitions.onGameLeave();
}
export function rankedGameStart(): void {
    showCountDownAndStart();
}


function showCountDownAndStart(): void {
    fillAsciiStrings(playerGameInstance, playerGameVisuals.asciiBoard);
    resetStatDisplays(playerGameVisuals.statNumbers);
    startCountdownAnimation(playerGameInstance.gameSettings.countDownDuration, afterCountdown)
    function afterCountdown(): void {
        startASCIIAnimation();
        startStatDisplay();
        enableGameInputs();
        enableResetInput();
        playerGameInstance.stats.gameStartTime = performance.now();
    }
}
export function setGameStateAndNotify(gameState: GAME_STATE): void {
    if (playerGameInstance.gameState != gameState) {
        playerGameInstance.gameState = gameState;
        network_countDownState(playerGameInstance.matchID, playerGameInstance.gameMode, gameState);
    }
}
export function disableGameplay(): void {
    stopCountdownAnimation();
    const stats = playerGameInstance.stats;
    const history = playerGameInstance.gameStateHistory.inputHistory
    if (playerGameInstance.gameMode === GAME_MODE.SPRINT && history.length > 0) {
        const winningMoveAtTime = history[history.length - 1].frameTime;
        stats.gameEndTime = winningMoveAtTime;
        stats.gameDuration = stats.gameEndTime;
        createStatGraphData(playerGameInstance);
    }
    disableGameInputs();
    stopASCIIAnimation();
    stopStatDisplay();
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
    playerGameInstance.currentAPS = playerGameInstance.handlingSettings.toggleAPS;
}
export function revertAPS(): void {
    playerGameInstance.currentAPS = playerGameInstance.handlingSettings.defaultAPS;
}
export function triggerShoot(): void {
    const inputFrame: InputFrame = {
        indexID: playerGameInstance.gameStateHistory.inputHistory.length,
        frameTime: performance.now() - playerGameInstance.stats.gameStartTime,
        input: GAME_INPUT.SHOOT,
        angle: playerGameInstance.angle,
        garbageAmount: 0,
    }
    playerGameInstance.gameStateHistory.inputHistory.push(inputFrame);
    executeShot(playerGameInstance);
    network_sendInputs(playerGameInstance);
}
export function triggerHold(): void {
    const inputFrame: InputFrame = {
        indexID: playerGameInstance.gameStateHistory.inputHistory.length,
        frameTime: performance.now() - playerGameInstance.stats.gameStartTime,
        input: GAME_INPUT.HOLD,
        angle: playerGameInstance.angle,
        garbageAmount: 0,
    }
    playerGameInstance.gameStateHistory.inputHistory.push(inputFrame);
    holdBubble(playerGameInstance);
    network_sendInputs(playerGameInstance);
}