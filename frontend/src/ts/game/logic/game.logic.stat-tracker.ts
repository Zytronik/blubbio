import { GameInstance } from "./i/game.i.game-instance";
import { GameStats } from "./i/game.i.game-stats";
import { GAME_MODE } from "../settings/i/game.settings.e.game-modes";

const SPIKE_COUNTER_TIMEFRAME = 1500;
export function trackBubbleShot(game: GameInstance, wallBounces: number, amountCleared: number, attack: number, defense: number): void {
    const gameStats = game.stats;
    gameStats.bubblesShot++;
    gameStats.wallBounces += wallBounces;
    gameStats.attack += attack;
    gameStats.defense += defense;

    if (attack > 0){
        if (gameStats.spikeAnimationStart + SPIKE_COUNTER_TIMEFRAME > performance.now()) {
            gameStats.spikeNumber += attack;
        } else {
            gameStats.spikeNumber = attack;
        }
        gameStats.spikeAnimationStart = performance.now();
    }

    if (amountCleared > 0) {
        trackClearedBubbles(wallBounces, amountCleared);
    } else {
        breakCombo();
    }

    gameStats.bubblesLeftToClear = gameStats.bubbleClearToWin - gameStats.bubblesCleared;
    if (game.gameMode === GAME_MODE.SPRINT && gameStats.bubblesCleared >= gameStats.bubbleClearToWin) {
        game.gameTransitions.onGameVictory();
    }

    function trackClearedBubbles(wallBounces: number, amountCleared: number) {
        gameStats.currentCombo++;
        gameStats.bubblesCleared += amountCleared;
        gameStats.highestBubbleClear = (gameStats.highestBubbleClear > amountCleared) ? gameStats.highestBubbleClear : amountCleared;

        if (wallBounces === 0 && amountCleared === 3) {
            gameStats.clear3++;
        }
        if (wallBounces === 0 && amountCleared === 4) {
            gameStats.clear4++;
        }
        if (wallBounces === 0 && amountCleared >= 5) {
            gameStats.clear5++;
        }
        if (wallBounces > 0 && amountCleared === 3) {
            gameStats.clear3++;
        }
        if (wallBounces > 0 && amountCleared === 4) {
            gameStats.clear4wb++;
        }
        if (wallBounces > 0 && amountCleared >= 5) {
            gameStats.clear5wb++;
        }
    }

    function breakCombo(): void {
        gameStats.highestCombo = (gameStats.highestCombo > gameStats.currentCombo) ? gameStats.highestCombo : gameStats.currentCombo;
        gameStats.currentCombo = 0;
    }
}

export function createStatGraphData(game: GameInstance): void {
    const graph = game.stats.bpsGraph;
    const inputHistory = game.gameStateHistory.inputHistory;
    const gameDuration = game.stats.gameDuration / 1000;
    for (let i = 0; i <= gameDuration; i++) {
        let inputCount = 0;
        let duration = 4;
        for (let j = 0; j < inputHistory.length; j++) {
            const inputTime = inputHistory[j].frameTime;
            if (inputTime > i * 1000 - 2000 && inputTime < i * 1000 + 2000) {
                inputCount++;
            }
        }
        if (i === 0 || i === gameDuration) {
            duration = 2
        }
        if (i === 1 || i === gameDuration - 1) {
            duration = 3
        }
        if (duration > gameDuration) {
            duration = gameDuration;
        }
        graph[i] = Number((inputCount / duration).toFixed(2));
    }
}

export function calculateTimeStats(gameStats: GameStats, gameDuration: number): void {
    gameStats.bubblesPerSecond = Number((gameStats.bubblesShot / gameDuration * 1000).toFixed(2));
    gameStats.attackPerMinute = Number((gameStats.attack / gameDuration * 60000).toFixed(2));
    gameStats.defensePerMinute = Number((gameStats.defense / gameDuration * 60000).toFixed(2));
    if (gameStats.bubblesShot === 0) {
        gameStats.attackPerBubble = 0;
        gameStats.defensePerBubble = 0;
    } else {
        gameStats.attackPerBubble = Number((gameStats.attack / gameStats.bubblesShot).toFixed(2));
        gameStats.defensePerBubble = Number((gameStats.defense / gameStats.bubblesShot).toFixed(2));
    }
}