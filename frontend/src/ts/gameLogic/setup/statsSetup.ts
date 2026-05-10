import { GameStats } from "@/ts/_interface/game/gameStats";

export function getEmptyStats(): GameStats {
    return {
        gameStartTime: 0,
        gameEndTime: 0,
        gameDuration: 0,
        bubblesShot: 0,
        bubblesPerSecond: 0,
        bubbleClearToWin: 0,
        bubblesCleared: 0,
        bubblesLeftToClear: 0
    };
}
