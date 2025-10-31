import { GameStats } from "@/ts/_interface/game/gameStats";

export function getEmptyStats(): GameStats {
    return {
        bubblesShot: 0,
        bubblesCleared: 0,
        attack: 0,
        clears: [[]],
        perfectClears: 0,
        currentCombo: 0,
        highestCombo: 0,
    };
}
