import { createNewEmptyMatch } from "./game.data";
import { getSprintSettings } from "./settings/game.settings.sprint";
import { GAME_MODE } from "./settings/i/game.settings.e.game-modes";

export function createSprintGame(): void {
    createNewMatch(GAME_MODE.SPRINT, getSprintSettings())
}

export function createRankedGame(): void {

}