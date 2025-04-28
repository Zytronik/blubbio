import { Bubble } from "./bubble";
import { GameStats } from "./gameStats";
import { Grid } from "./grid";
import { PixiAnimation } from "../pixiAnimation";
import { GameSettings } from "./gameSettings";
import { HandlingSettings } from "./handlingSettings";
import { GameSprites } from "./gameSprites";
import { GameContainers } from "./gameContainers";
import { rngReference } from "./rngReference";
import { GarbagePreview } from "./garbagePreview";

export interface GameInstance {
    gameSettings: GameSettings,
    handlingSettings: HandlingSettings,
    bubbleSeed: rngReference,
    garbageSeed: rngReference,
    angle: number,
    currentBubble: Bubble,
    previewBubble?: Bubble,
    holdBubble?: Bubble,
    bubbleQueue: Bubble[],
    playGrid: Grid,
    garbagePreview: GarbagePreview,
    stats: GameStats,
    //replaydata

    left: boolean,
    right: boolean,
    aps: number,

    gameSprites: GameSprites,
    gameContainers: GameContainers,
    instanceAnimations: PixiAnimation[],
}