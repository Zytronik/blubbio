import { createNewMatch } from "./game.data";
import { getSprintSettings } from "./settings/game.settings.sprint";

export function createSprintGame(): void {
    createNewMatch(getSprintSettings())
}

export function createRankedGame(): void {

}