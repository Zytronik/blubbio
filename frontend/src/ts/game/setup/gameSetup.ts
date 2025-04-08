import { GAME_MODE } from "@/ts/_enum/gameMode";
import { INPUT_CONTEXT } from "@/ts/_enum/inputContext";
import { Game } from "@/ts/_interface/game/game";
import { GameInstance } from "@/ts/_interface/game/gameInstance";
import { RoundData } from "@/ts/_interface/game/roundData";
import { getNextSeed } from "../rng";

export function getEmptyGame(): Game {
    // addUpdateContainerSizeAnimation();
    return {
        gameMode: GAME_MODE.NONE,
        inputContext: INPUT_CONTEXT.DISABLED,
        spectating: false,
        rounds: [],
        instancesMap: new Map<string, GameInstance>(),
    };
}

export function getEmptyRoundData(): RoundData {
    return {
        initialSeed: getNextSeed(Date.now()),
        gameStartTime: 0,
    };
}