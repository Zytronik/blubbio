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
    refillBoard: boolean,
    refillBoardAtLine: number,
    refillAmount: number,

    bubbleBagSize: number,
    clearFloatingBubbles: boolean,
    
    garbageMaxAtOnce: number,
    garbageCleanAmount: number,
    garbageColorAmount: number,
    
    countDownDuration: number,
    
    //passtrough
    //combotable
}