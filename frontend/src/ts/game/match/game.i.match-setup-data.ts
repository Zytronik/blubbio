import { GAME_MODE } from "../settings/i/game.settings.e.game-modes";
import { GameSettings } from "../settings/i/game.settings.i.game-settings";
import { GameEvents } from "../logic/i/game.i.game-events";
import { PlayerData } from "./game.i.player-data";

export interface MatchSetupData {
    matchID: string,
    playerData: PlayerData[]
    gameMode: GAME_MODE,
    firstTo: number,
    initialSeed: number,
    countDownDuration: number,
    gameSettings: GameSettings,
    gameEvents: GameEvents
}