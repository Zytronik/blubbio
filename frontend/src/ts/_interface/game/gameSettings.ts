import { GARBAGE_MESSINESS } from "@/ts/_enum/garbageMessiness";

export interface GameSettings {
    gridWidth: number,
    gridHeight: number,
    gridExtraHeight: number,
    minAngle: number,
    maxAngle: number,
    queuePreviewSize: number,
    widthPrecisionUnits: number,
    collisionRangeFactor: number,

    sprintVictoryCondition: number,

    prefillBoard: boolean,
    prefillBoardAmount: number,
    prefillMessiness: GARBAGE_MESSINESS,
    refillBoard: boolean,
    refillBoardAtLine: number,
    refillMessiness: GARBAGE_MESSINESS,

    bubbleBagSize: number,
    clearFloatingBubbles: boolean,

    garbageMaxAtOnce: number,
    previewBaseDuration: number,

    countDownDuration: number,

    //passtrough
    //combotable
}