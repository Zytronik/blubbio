import { playerGameInstance, playerGameVisuals } from "../game.input-commands";
import { GameInstance } from "../logic/i/game.i.game-instance";
import { calculateTimeStats } from "../logic/game.logic.stat-tracker";
import { enemyGameInstance, enemyVisuals } from "../network/game.network.ranked";
import { StatNumberRefs } from "./i/game.visuals.i.stat-numbers";

let trackingFrameId: number | null = null;
let statTrackingRunning = false;
const SPIKE_COUNTER_TIMEFRAME = 1500;
export function startStatDisplay(): void {
    if (!statTrackingRunning) {
        statTrackingRunning = true;
        statDisplayAnimation();
    }
}

export function stopStatDisplay(): void {
    if (statTrackingRunning && trackingFrameId !== null) {
        statTrackingRunning = false;
        cancelAnimationFrame(trackingFrameId);
        trackingFrameId = null;
        fillStatStrings(playerGameInstance, playerGameVisuals.statNumbers, false);
    }
}

function statDisplayAnimation(): void {
    fillStatStrings(playerGameInstance, playerGameVisuals.statNumbers, true);
    if (enemyGameInstance) {
        fillStatStrings(enemyGameInstance, enemyVisuals.statNumbers, true);
    }
    if (statTrackingRunning) {
        trackingFrameId = requestAnimationFrame(() => statDisplayAnimation());
    }
}

export function fillStatStrings(gameInstance: GameInstance, statStrings: StatNumberRefs, calculateCurrentTime: boolean): void {
    const gameStats = gameInstance.stats;
    let gameDuration = gameStats.gameDuration;
    if (calculateCurrentTime) {
        gameDuration = performance.now() - gameStats.gameStartTime;
    }
    const formattedCurrentTimeString = formatTimeNumberToString(gameDuration);
    calculateTimeStats(gameInstance.stats, gameDuration)
    statStrings.formattedCurrentTime.value = formattedCurrentTimeString;
    statStrings.bubbleClearToWin.value = gameStats.bubbleClearToWin;
    statStrings.bubblesCleared.value = gameStats.bubblesCleared;
    statStrings.bubblesLeftToClear.value = gameStats.bubblesLeftToClear;
    statStrings.bubblesShot.value = gameStats.bubblesShot;
    statStrings.bubblesPerSecond.value = (statStrings.bubblesPerSecond.value == Number.POSITIVE_INFINITY || statStrings.bubblesPerSecond.value == Number.NEGATIVE_INFINITY) ? statStrings.bubblesPerSecond.value : statStrings.bubblesPerSecond.value;
    statStrings.attackPerMinute.value = (statStrings.attackPerMinute.value == Number.POSITIVE_INFINITY || statStrings.attackPerMinute.value == Number.NEGATIVE_INFINITY) ? statStrings.attackPerMinute.value : statStrings.bubblesPerSecond.value;
    statStrings.currentCombo.value = gameStats.currentCombo;
    if (gameStats.spikeAnimationStart + SPIKE_COUNTER_TIMEFRAME > performance.now()) {
        statStrings.spikeNumber.value = "" + gameStats.spikeNumber;
    } else {
        statStrings.spikeNumber.value = "";
    }
}

export function resetStatDisplays(statStrings: StatNumberRefs): void {
    statStrings.formattedCurrentTime.value = ("00:00.00");
    statStrings.bubbleClearToWin.value = (0);
    statStrings.bubblesCleared.value = (0);
    statStrings.bubblesLeftToClear.value = (0);
    statStrings.bubblesShot.value = (0);
    statStrings.bubblesPerSecond.value = (0);
}

export function formatTimeNumberToString(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hundredths = Math.floor((milliseconds % 1000) / 10);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${hundredths.toString().padStart(2, '0')}`;
}