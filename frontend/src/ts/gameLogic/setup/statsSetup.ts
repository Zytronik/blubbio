import { GameSettings } from "@/ts/_interface/game/gameSettings";
import { GameStats } from "@/ts/_interface/game/gameStats";

export function getEmptyStats(settings: GameSettings): GameStats {
    return {
        gameStartTime: 0,
        gameEndTime: 0,
        gameDuration: 0,
        bubblesShot: 0,
        bubblesPerSecond: 0,
        bubblesClearToWin: settings.sprintVictoryCondition,
        bubblesCleared: 0,
    };
}
