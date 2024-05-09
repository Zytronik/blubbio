import { GAME_MODE } from "../settings/i/game.settings.e.game-modes";
import { GameSettings } from "../settings/i/game.settings.i.game-settings";
import { MATCH_STATE } from "./game.e.match-state";
import { GameInstance } from "./game.i.game-instance";
import { PlayerData } from "./game.i.player-data";

export interface Match {
    matchID: string,
    playerData: Map<string, PlayerData>, // Map<PlayerName, PlayerData>
    gameInstances: Map<string, GameInstance>, // Map<PlayerName, GameInstance>
    firstTo: number,
    gameMode: GAME_MODE,
    gameSettings: GameSettings,
    initialSeed: number,
    matchStartTime: number,
    currentStateStartTime: number,
    matchState: MATCH_STATE,
}