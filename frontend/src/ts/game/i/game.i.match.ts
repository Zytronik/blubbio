import { GAME_MODE } from "../settings/i/game.settings.e.game-modes";
import { GameSettings } from "../settings/i/game.settings.i.game-settings";
import { HandlingSettings } from "../settings/i/game.settings.i.handling-settings";
import { GameInstance } from "./game.i.game-instance";

export interface Match {
    gameInstances: Map<string, GameInstance>, // Map<PlayerName, GameInstance>
    scoresMap: Map<string, number>, //<client.id, number>
    firstTo: number,

    gameMode: GAME_MODE,
    gameSettings: GameSettings,
    globalHandlingSettings: HandlingSettings,
    initialSeed: number,

    gameStartTime: number,
    matchState: MATCH_STATE,
}