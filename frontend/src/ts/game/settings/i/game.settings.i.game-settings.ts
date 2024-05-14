export interface GameSettings {
    //baord settings
    gridWidth: number,
    gridHeight: number,
    gridExtraHeight: number,
    minAngle: number,
    maxAngle: number,
    queuePreviewSize: number,

    //internal mathvalues
    widthPrecisionUnits: number,
    collisionDetectionFactor: number,

    //sprintVictory
    sprintVictoryCondition: number,

    //gameplay settings
    clearFloatingBubbles: boolean,
    prefillBoard: boolean,
    prefillBoardAmount: number,
    refillBoard:boolean,
    refillBoardAtLine: number,
    refillAmount: number,
    bubbleBagSize: number,
    garbageMaxAtOnce: number,
    garbageCleanAmount: number,
    garbageColorAmount: number,
    garbageToKill: number,
}