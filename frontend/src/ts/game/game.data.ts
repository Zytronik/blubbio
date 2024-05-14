import { MATCH_STATE } from "./match/game.e.match-state";
import { GameInstance } from "./logic/i/game.i.game-instance";
import { GameStats } from "./logic/i/game.i.game-stats";
import { Match } from "./match/game.i.match";
import { MatchSetupData } from "./match/game.i.match-setup-data";
import { createGameInstance } from "./logic/game.logic.instance-creator";
import { PlayerData } from "../networking/networking.player-data";

export let match: Match
export function createNewMatch(setup: MatchSetupData): void {
    const newmatch: Match = {
        matchID: "",
        playerData: new Map<string, PlayerData>(),
        gameInstances: new Map<string, GameInstance>(),
        gameSettings: setup.gameSettings,
        currentStateStartTime: 0,
        matchState: MATCH_STATE.SETUP,
        countDownDuration: 0,
        roundHistory: new Map<string, GameStats[]>(),
    }
    setup.playerData.forEach(player => {
        newmatch.playerData.set(player.playerName, player)
        const instance = createGameInstance(setup.gameSettings, setup.gameEvents, setup.initialSeed)
        newmatch.gameInstances.set(player.playerName, instance)
    });
    match = newmatch
}
