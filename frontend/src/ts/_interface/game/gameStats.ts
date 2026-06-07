export interface GameStats {
    gameStartTime: number;
    gameEndTime: number;
    gameDuration: number;

    bubblesShot: number;
    bubblesPerSecond: number;

    bubblesClearToWin: number;
    bubblesCleared: number;
}

// export interface GameStats {

//     //timeLeft: number,
//     //score: number,

//     bpsGraph: number[],
//     attack: number,
//     attackPerMinute: number,
//     attackPerBubble: number,
//     defense: number,
//     defensePerMinute: number,
//     defensePerBubble: number,

//     spikeNumber: number,
//     spikeAnimationStart: number,
//     pcText: boolean,
//     pcTextAnimationStart: number,

//     clear3: number,
//     clear4: number,
//     clear5: number,
//     clear3wb: number,
//     clear4wb: number,
//     clear5wb: number,
//     highestBubbleClear: number,

//     wallBounces: number,
//     wallBounceClears: number,

//     perfectClears: number,

//     currentCombo: number,
//     highestCombo: number,
// }
