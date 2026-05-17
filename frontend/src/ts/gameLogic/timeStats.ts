import { Game } from "../_interface/game/game";

export function timeStatsUpdate(game: Game, now: number): void {
    game.instancesMap.forEach((gameInstance, playername) => {
        const stats = gameInstance.stats;
        stats.gameDuration = now - stats.gameStartTime;
        stats.bubblesPerSecond = Number((stats.bubblesShot / stats.gameDuration * 1000).toFixed(2));
    });
}