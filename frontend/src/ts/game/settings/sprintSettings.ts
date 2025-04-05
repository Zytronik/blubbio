import { GameSettings } from "@/ts/_interface/game/gameSettings";

export const SPRINT_SETTINGS: GameSettings = {
    gridWidth: 8,
    gridHeight: 15,
    gridExtraHeight: 3,
    minAngle: 12,
    maxAngle: 168,
    queuePreviewSize: 5,
    widthPrecisionUnits: 10000000,
    collisionRangeFactor: 0.55,
    sprintVictoryCondition: 100,
    prefillBoard: true,
    prefillBoardAmount: 7,
    refillBoard: true,
    refillBoardAtLine: 3,
    refillAmount: 3,
    bubbleBagSize: 10,
    clearFloatingBubbles: false,
    garbageMaxAtOnce: 3,
    garbageCleanAmount: 3,
    garbageColorAmount: 3,
    countDownDuration: 1500
}