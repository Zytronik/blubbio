import eventBus from "../page/page.event-bus";
import { MATCH_STATE } from "./i/game.e.match-state";
import { GameInstance } from "./i/game.i.game-instance";
import { Match } from "./i/game.i.match";
import { PlayerData } from "./i/game.i.player-data";
import { GameSettings } from "./settings/i/game.settings.i.game-settings";

export let match: Match
export function createNewMatch(gameSettings: GameSettings): void {
    const newmatch: Match = {
        matchID: "",
        playerData: new Map<string, PlayerData>(),
        gameInstances: new Map<string, GameInstance>(),
        firstTo: gameSettings.firstTo,
        gameMode: gameSettings.gameMode,
        gameSettings: gameSettings,
        initialSeed: 0,
        matchStartTime: 0,
        currentStateStartTime: 0,
        matchState: MATCH_STATE.SETUP,
    }
    const emptyPlayerData = createEmptyPlayerData()
    const playerName = eventBus.getUserData()?.username || "PLAYER";
    newmatch.playerData.set(playerName, emptyPlayerData)
    match = newmatch
}

function createEmptyPlayerData(): PlayerData {
    const emptyPlayerData: PlayerData = {
        playerID: 0,
        playerName: "",
        playerRank: "",
        playerGlobalRank: 0,
        playerNationalRank: 0,
        playerGlicko: 0,
        playerRD: 0,
        playerProfilePicture: "",
        playerCountry: "",
        playerScore: 0,
        hasWon: false,
        eloDiff: 0,
        playerStats: []
    }
    return emptyPlayerData;
}