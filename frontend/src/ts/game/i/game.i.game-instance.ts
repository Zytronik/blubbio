import { Bubble } from "./game.i.bubble";
import { GameStateHistory } from "./game.i.game-state-history";
import { GameTransitions } from "./game.i.game-transitions";
import { Grid } from "./game.i.grid";
import { GameStats } from "./game.i.game-stats";

export interface GameInstance {
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

    gameTransitions: GameTransitions,
    sendGarbage: (amount: number) => void,
}