import { GameSettings } from "../settings/i/game.settings.i.game-settings";
import { MATCH_STATE } from "./game.e.match-state";
import { GameInstance } from "./game.i.game-instance";
import { GameStats } from "./game.i.game-stats";
import { PlayerData } from "./game.i.player-data";

export interface Match {
    matchID: string,
    playerData: Map<string, PlayerData>, // Map<PlayerName, PlayerData>
    gameInstances: Map<string, GameInstance>, // Map<PlayerName, GameInstance>
    gameSettings: GameSettings,
    matchState: MATCH_STATE,
    currentStateStartTime: number,
    roundHistory: Map<string, GameStats[]>
}