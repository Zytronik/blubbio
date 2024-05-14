import { GameInstance } from "./i/game.i.game-instance";
import { resetGrid, setupGrid } from "./game.logic.grid-manager";
import { GameStats } from "./i/game.i.game-stats";
import { updateBubbleQueueAndCurrent } from "./game.logic.bubble-manager";
import { GameSettings } from "../settings/i/game.settings.i.game-settings";
import { prefillBoard } from "./game.logic.garbage";
import { GameEvents } from "./i/game.i.game-events";
import { getHandlingSettings } from "../settings/game.settings.handling";

export function createGameInstance(settings: GameSettings, events: GameEvents, startSeed: number): GameInstance {
    const gameInstance: GameInstance = {
        settings: settings,
        bubbleSeed: startSeed,
        garbageSeed: startSeed,
        angle: 90,
        currentAPS: getHandlingSettings().defaultAPS,
        currentBubble: {
            ascii: "",
            type: 0,
            spriteIdle: ""
        },
        bubbleQueue: [],
        playGrid: setupGrid(settings),
        queuedGarbage: 0,
        stats: getEmptyStats(settings),
        gameStateHistory: {
            inputHistory: [],
            boardHistory: [],
            bubbleQueueHistory: [],
            angleHistory: [],
            sentgarbagehistory: [],
            receivedgarbagehistory: []
        },
        processedInputsIndex: 0,
        initialSeed: 0,
        onGameStart: events.onGameStart,
        onGameQuit: events.onGameQuit,
        onGameReset: events.onGameReset,
        onGameDefeat: events.onGameDefeat,
        onGameVictory: events.onGameVictory,
        onGarbageSend: events.onGarbageSend,
    }
    if (settings.prefillBoard) {
        prefillBoard(gameInstance);
    }
    updateBubbleQueueAndCurrent(gameInstance);
    return gameInstance;
}

export function resetGameInstance(gameInstance: GameInstance, seed: number): void {
    gameInstance.initialSeed = seed;
    gameInstance.bubbleSeed = seed;
    gameInstance.garbageSeed = seed;
    gameInstance.angle = 90;
    gameInstance.currentAPS = getHandlingSettings().defaultAPS;
    gameInstance.currentBubble = {
        ascii: "",
        type: 0,
        spriteIdle: ""
    };
    gameInstance.holdBubble = undefined;
    gameInstance.playGrid.previewBubble = undefined;
    gameInstance.bubbleQueue = [];
    resetGrid(gameInstance.playGrid);
    gameInstance.queuedGarbage = 0;
    gameInstance.stats = getEmptyStats(gameInstance.settings);
    gameInstance.gameStateHistory.inputHistory = [];
    gameInstance.gameStateHistory.boardHistory = [];
    gameInstance.gameStateHistory.bubbleQueueHistory = [];
    gameInstance.gameStateHistory.angleHistory = [];
    gameInstance.gameStateHistory.sentgarbagehistory = [];
    gameInstance.gameStateHistory.receivedgarbagehistory = [];
    gameInstance.processedInputsIndex = 0;
    if (gameInstance.settings.prefillBoard) {
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