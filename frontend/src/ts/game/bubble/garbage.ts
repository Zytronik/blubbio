import { GameInstance } from "@/ts/_interface/game/gameInstance";
import { allBubbles } from "./bubbleTypes";
import { Bubble } from "@/ts/_interface/game/bubble";
import { convertSeedToRandomNumber, getNextSeed } from "../rng";

export function prefillBoard(instance: GameInstance): void {
    const amount = instance.gameSettings.prefillBoardAmount;
    for (let h = 0; h < amount; h++) {
        const row = instance.playGrid.rows[h];
        const rowLength = row.size;
        const colors = selectColors(instance)
        const garbage = generateGarbage(instance, colors, rowLength)
        for (let w = 0; w < rowLength; w++) {
            row.fields[w].bubble = garbage[w]
        }
    }
}

export function refillBoard(instance: GameInstance) : void {
    const refillAmount = instance.gameSettings.refillAmount;
    for (let h = 0; h < refillAmount; h++) {
        const row = instance.playGrid.rows[h];
        const rowLength = row.size;
        const colors = selectColors(instance)
        const garbage = generateGarbage(instance, colors, rowLength)
        for (let w = 0; w < rowLength; w++) {
            row.fields[w].bubble = garbage[w]
        }
    }
}

// export function receiveGarbageAndCheckDead(gameInstance: GameInstance): boolean {
//     if (gameInstance.queuedGarbage > 0) {
//         const colors = selectColors(gameInstance);
//         const maxAtOnce = gameInstance.gameSettings.garbageMaxAtOnce;
//         let hasDied = false;
//         for (let i = 0; i < maxAtOnce; i++) {
//             const garbageIsSmallRow = !gameInstance.playGrid.rows[0].isSmallerRow
//             const rowLength = gameInstance.playGrid.gridWidth - (garbageIsSmallRow ? 1 : 0);
//             const garbage = generateGarbage(gameInstance, colors, rowLength);
//             addGarbageToGrid(garbage, gameInstance.playGrid);
//             gameInstance.queuedGarbage--;
//             hasDied = checkIfGarbageKills(gameInstance);
//             if (hasDied && (i === maxAtOnce - 1 || gameInstance.queuedGarbage === 0)) {
//                 gameInstance.gameTransitions.onGameDefeat();
//                 return true;
//             } else if (gameInstance.queuedGarbage === 0) {
//                 return false;
//             }
//         }
//     }
//     return false;
// }

function selectColors(gameInstance: GameInstance): Bubble[] {
    const colorAmount = 5
    const leftOverBubbles = [...allBubbles];
    const chosenColors: Bubble[] = [];
    for (let i = 0; i < colorAmount; i++) {
        const randomIndex = convertSeedToRandomNumber(0, leftOverBubbles.length, gameInstance.garbageSeed);
        gameInstance.garbageSeed = getNextSeed(gameInstance.garbageSeed);
        chosenColors.push(leftOverBubbles.splice(randomIndex, 1)[0]);
    }

    return chosenColors;
}

function generateGarbage(gameInstance: GameInstance, colorSelection: Bubble[], rowLength: number): Bubble[] {
    const garbageRow: Bubble[] = [];
    const cleanAmount = 2;
    const cleanColorLocation = convertSeedToRandomNumber(0, rowLength - cleanAmount + 1, gameInstance.garbageSeed);
    gameInstance.garbageSeed = getNextSeed(gameInstance.garbageSeed);
    const randomCleanColorIndex = convertSeedToRandomNumber(0, colorSelection.length, gameInstance.garbageSeed);
    gameInstance.garbageSeed = getNextSeed(gameInstance.garbageSeed);
    const cleanColor = colorSelection.splice(randomCleanColorIndex, 1)[0];
    for (let j = 0; j <= rowLength - cleanAmount; j++) {
        if (cleanColorLocation === j) {
            for (let k = 0; k < cleanAmount; k++) {
                garbageRow.push(cleanColor);
            }
        } else {
            const randomColorIndex = convertSeedToRandomNumber(0, colorSelection.length, gameInstance.garbageSeed);
            gameInstance.garbageSeed = getNextSeed(gameInstance.garbageSeed);
            garbageRow.push(colorSelection[randomColorIndex]);
        }
    }
    colorSelection.push(cleanColor);
    return garbageRow;
}




/*
BIG TODO HERE
garbage messiness

min
all one color

max
rainbow with holes
checked across lines

*/