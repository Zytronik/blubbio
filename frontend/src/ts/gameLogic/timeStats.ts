import { Game } from '../_interface/game/game';

export function timeStatsUpdate(game: Game, now: number): void {
    game.instancesMap.forEach((gameInstance, playername) => {
        const stats = gameInstance.stats;
        stats.gameDuration = now - stats.gameStartTime;
        stats.bubblesPerSecond = Number(((stats.bubblesShot / stats.gameDuration) * 1000).toFixed(2));
    });
}

export function milliesToReadable(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const fractional = (ms % 100);

    return `${String(minutes).padStart(2, '0')}.${String(seconds).padStart(2, '0')}.${String(fractional).padStart(2, '0')}`;
}
