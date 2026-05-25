import { GAME_MODE } from "@/ts/_enum/gameMode";
import { Game } from "@/ts/_interface/game/game";
import { GameInstance } from "@/ts/_interface/game/gameInstance";
import { RoundData } from "@/ts/_interface/game/roundData";

export function getEmptyGame(): Game {
    return {
        gameMode: GAME_MODE.NONE,
        spectating: false,
        spectatorTarget: "",
        rounds: [],
        instancesMap: new Map<string, GameInstance>(),
    };
}

export function getEmptyRoundData(): RoundData {
    return {
        initialSeed: Date.now(),
        gameStartTime: 0,
    };
}