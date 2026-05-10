import { useGameStore } from "@/stores/gameStore";

export function timeStatsUpdate(now: number): void {
    useGameStore().getAllInstances().forEach(gameInstance => {
        const stats = gameInstance.stats;
        stats.gameDuration = now - stats.gameStartTime;
        stats.bubblesPerSecond = Number((stats.bubblesShot / stats.gameDuration * 1000).toFixed(2));
    });
}