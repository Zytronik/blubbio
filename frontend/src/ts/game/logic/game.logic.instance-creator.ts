import { GameInstance } from "../i/game.i.game-instance";
import { resetGrid, setupGrid } from "./game.logic.grid-manager";
import { GameStats } from "../i/game.i.game-stats";
import { GameTransitions } from "../i/game.i.game-transitions";
import { updateBubbleQueueAndCurrent } from "./game.logic.bubble-manager";
import { GameSettings } from "../settings/i/game.settings.i.game-settings";
import { GAME_MODE } from "../settings/i/game.settings.e.game-modes";
import { HandlingSettings } from "../settings/i/game.settings.i.handling-settings";
import { prefillBoard } from "./game.logic.garbage";
import { GAME_STATE } from "../i/game.e.game-state";

export function createGameInstance(
    gameMode: GAME_MODE,
    gameSettings: GameSettings,
    handlingSettings: HandlingSettings,
    gameTransitions: GameTransitions,
    startSeed: number,
    givenMatchID: string,
    onGarbageSend: (amount: number) => void): GameInstance {

    const gameInstance: GameInstance = {
        gameMode: gameMode,
        gameSettings: gameSettings,
        handlingSettings: handlingSettings,
        initialSeed: startSeed,

        gameState: GAME_STATE.READY,
        bubbleSeed: startSeed,
        garbageSeed: startSeed,
        angle: 90,
        currentAPS: handlingSettings.defaultAPS,
        currentBubble: {
            ascii: "",
            type: 0,
            spriteSheetName: ""
        },
        bubbleQueue: [],
        playGrid: setupGrid(gameSettings),
        queuedGarbage: 0,
        stats: getEmptyStats(gameSettings),

        gameStateHistory: {
            inputHistory: [],
            boardHistory: [],
            bubbleQueueHistory: [],
            angleHistory: [],
            sentgarbagehistory: [],
            receivedgarbagehistory: []
        },
        processedInputsIndex: 0,
        matchID: givenMatchID,
        gameTransitions: gameTransitions,
        sendGarbage: onGarbageSend,
    }
    if (gameInstance.gameSettings.prefillBoard) {
        prefillBoard(gameInstance);
    }
    updateBubbleQueueAndCurrent(gameInstance);
    return gameInstance;
}

export function resetGameInstance(gameInstance: GameInstance, seed: number): void {
    gameInstance.initialSeed = seed;
    gameInstance.gameState = GAME_STATE.READY;
    gameInstance.bubbleSeed = seed;
    gameInstance.garbageSeed = seed;
    gameInstance.angle = 90;
    gameInstance.currentAPS = gameInstance.handlingSettings.defaultAPS;
    gameInstance.currentBubble = {
        ascii: "",
        type: 0,
        spriteSheetName: ""
    };
    gameInstance.holdBubble = undefined;
    gameInstance.playGrid.previewBubble = undefined;
    gameInstance.bubbleQueue = [];
    resetGrid(gameInstance.playGrid);
    gameInstance.queuedGarbage = 0;
    gameInstance.stats = getEmptyStats(gameInstance.gameSettings);
    gameInstance.gameStateHistory.inputHistory = [];
    gameInstance.gameStateHistory.boardHistory = [];
    gameInstance.gameStateHistory.bubbleQueueHistory = [];
    gameInstance.gameStateHistory.angleHistory = [];
    gameInstance.gameStateHistory.sentgarbagehistory = [];
    gameInstance.gameStateHistory.receivedgarbagehistory = [];
    gameInstance.processedInputsIndex = 0;
    if (gameInstance.gameSettings.prefillBoard) {
        prefillBoard(gameInstance);
    }
    updateBubbleQueueAndCurrent(gameInstance);
}

export function getEmptyStats(gameSettings: GameSettings): GameStats {
    const stats: GameStats = {
        gameStartTime: 0,
        gameEndTime: 0,
        gameDuration: 0,
        bubbleClearToWin: gameSettings.sprintVictoryCondition,
        bubblesCleared: 0,
        bubblesLeftToClear: gameSettings.sprintVictoryCondition,
        bubblesShot: 0,
        bubblesPerSecond: 0,
        bpsGraph: [],
        attack: 0,
        attackPerMinute: 0,
        attackPerBubble: 0,
        defense: 0,
        defensePerMinute: 0,
        defensePerBubble: 0,
        spikeNumber: 0,
        spikeAnimationStart: 0,
        clear3: 0,
        clear4: 0,
        clear5: 0,
        clear3wb: 0,
        clear4wb: 0,
        clear5wb: 0,
        highestBubbleClear: 0,
        wallBounces: 0,
        wallBounceClears: 0,
        currentCombo: 0,
        highestCombo: 0,
    }
    return stats;
}