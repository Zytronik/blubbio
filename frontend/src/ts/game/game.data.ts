import eventBus from "../page/page.event-bus";
import { MATCH_STATE } from "./i/game.e.match-state";
import { GameInstance } from "./i/game.i.game-instance";
import { GameStats } from "./i/game.i.game-stats";
import { Match } from "./i/game.i.match";
import { PlayerData } from "./i/game.i.player-data";
import { GameSettings } from "./settings/i/game.settings.i.game-settings";

export let match: Match
export function createNewMatch(gameSettings: GameSettings): void {
    const newmatch: Match = {
        matchID: "",
        playerData: new Map<string, PlayerData>(),
        gameInstances: new Map<string, GameInstance>(),
        gameSettings: gameSettings,
        currentStateStartTime: 0,
        matchState: MATCH_STATE.SETUP,
        roundHistory: new Map<string, GameStats[]>()
    }
    const userData = getUserData();
    const playerName = eventBus.getUserData()?.username || "PLAYER";
    newmatch.playerData.set(playerName, userData)
    match = newmatch
}

function getUserData(): PlayerData {
    const userData = eventBus.getUserData();
    let userPlayerData: PlayerData = {
        playerID: 0,
        playerName: "",
        playerRank: "",
        playerGlobalRank: 0,
        playerNationalRank: 0,
        playerGlicko: 0,
        playerRD: 0,
        playerProfilePicture: "",
        playerCountry: "",
    };
    if (userData && userData.id) {
        userPlayerData.playerID = userData.id;
        userPlayerData.playerName = userData.username;
    }
    return userPlayerData;
}