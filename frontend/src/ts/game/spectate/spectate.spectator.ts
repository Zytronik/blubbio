import { reactive } from "vue";
import { dto_SpectationEntry } from "../network/dto/game.network.dto.spectation-entry";
import { GameVisuals } from "../visuals/i/game.visuals.i.game-visuals";
import { formatTimeNumberToString } from "../visuals/game.visuals.stat-display";
import { GameInstance } from "../i/game.i.game-instance";
import { GAME_STATE } from "../i/game.e.game-state";

export const allSpectationEntries = reactive<dto_SpectationEntry[]>([]);
// export const playerNameInstanceMap = new Map<string, GameInstance>();
// export const playerNameVisualsMap = reactive(new Map<string, GameVisuals>());

let spectatorFrameID: number | null = null;
let spectatingAnimRunning = false;

export function startSpectatorStatDisplay(): void {
    if (!spectatingAnimRunning) {
        spectatingAnimRunning = true;
        statDisplayAnimation();
    }
}

export function stopSpectatorStatDisplay(): void {
    if (spectatingAnimRunning && spectatorFrameID !== null) {
        spectatingAnimRunning = false;
        cancelAnimationFrame(spectatorFrameID);
        spectatorFrameID = null;
        updateTimeStats();
    }
}

function statDisplayAnimation(): void {
    updateTimeStats();
    if (spectatingAnimRunning) {
        spectatorFrameID = requestAnimationFrame(() => statDisplayAnimation());
    }
}

function updateTimeStats(): void {
    playerNameVisualsMap.forEach((visuals, playerName) => {
        const spectatedInstance = playerNameInstanceMap.get(playerName);
        if (spectatedInstance) {
            if (spectatedInstance.gameState === GAME_STATE.IN_GAME) {
                const currentTime = performance.now() + visuals.timeDifference;
                visuals.statNumbers.formattedCurrentTime = formatTimeNumberToString(currentTime);
                visuals.statNumbers.bubblesPerSecond = Number((visuals.statNumbers.bubblesShot / currentTime * 1000).toFixed(2));
            } else {
                const currentTime = spectatedInstance.stats.gameDuration;
                visuals.statNumbers.formattedCurrentTime = formatTimeNumberToString(currentTime);
                visuals.statNumbers.bubblesPerSecond = Number((visuals.statNumbers.bubblesShot / currentTime * 1000).toFixed(2));
            }
        }
    });
}