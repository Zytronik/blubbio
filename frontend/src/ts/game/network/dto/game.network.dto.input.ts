import { InputFrame } from "../../logic/i/game.i.game-state-history";
import { GAME_MODE } from "../../settings/i/game.settings.e.game-modes";

export interface dto_Inputs {
    gameMode: GAME_MODE,
    matchID: string,
    inputs: InputFrame[],
}