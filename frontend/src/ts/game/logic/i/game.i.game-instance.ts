import { Bubble } from "./game.i.bubble";
import { GameStateHistory } from "./game.i.game-state-history";
import { Grid } from "./game.i.grid";
import { GameStats } from "./game.i.game-stats";
import { GameSettings } from "../../settings/i/game.settings.i.game-settings";

export interface GameInstance {
    settings: GameSettings,
    initialSeed: number,
    bubbleSeed: number,
    garbageSeed: number,
    angle: number,
    currentAPS: number,
    currentBubble: Bubble,
    holdBubble?: Bubble,
    bubbleQueue: Bubble[],
    playGrid: Grid,
    queuedGarbage: number,
    stats: GameStats,

    gameStateHistory: GameStateHistory,
    processedInputsIndex: number,

    onGameStart: () => void,
    onGameQuit: () => void,
    onGameReset: () => void,
    onGameDefeat: () => void,
    onGameVictory: () => void,
    onGarbageSend: (amount: number) => void,
}