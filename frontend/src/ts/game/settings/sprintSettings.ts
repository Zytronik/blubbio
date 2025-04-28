import { GARBAGE_MESSINESS } from "@/ts/_enum/garbageMessiness";
import { GameSettings } from "@/ts/_interface/game/gameSettings";

export const SPRINT_SETTINGS: GameSettings = {
    gridWidth: 8,
    gridHeight: 12,
    gridExtraHeight: 2,
    minAngle: 12,
    maxAngle: 168,
    queuePreviewSize: 5,
    widthPrecisionUnits: 10000000,
    collisionRangeFactor: 0.55,
    sprintVictoryCondition: 100,
    prefillBoard: true,
    prefillBoardAmount: 0,
    prefillMessiness: GARBAGE_MESSINESS.WORST,
    refillBoardAtLine: 3,
    refillAmount: 3,
    refillMessiness: GARBAGE_MESSINESS.WORST,
    bubbleBagSize: 10,
    clearFloatingBubbles: false,
    garbageMaxAtOnce: 3,
    previewBaseDuration: 4000,
    durationSpeedMultiplier: 1,
    countDownDuration: 1500,
}