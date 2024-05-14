import { Bubble } from "./i/game.i.bubble";
import { GameInstance } from "./i/game.i.game-instance";
import { allBubbles } from "./game.logic.bubble-manager";
import { addGarbageToGrid } from "./game.logic.grid-manager";
import { convertSeedToRandomNumber, getNextSeed } from "./game.logic.random";

export function prefillBoard(gameInstance: GameInstance): void {
    const amount = gameInstance.gameSettings.prefillBoardAmount;
    for (let h = 0; h < amount; h++) {
        const row = gameInstance.playGrid.rows[h];
        const rowLength = row.size;
        const colors = selectColors(gameInstance)
        const garbage = generateGarbage(gameInstance, colors, rowLength)
        for (let w = 0; w < rowLength; w++) {
            row.fields[w].bubble = garbage[w]
        }
    }
}

export function receiveGarbageAndCheckDead(gameInstance: GameInstance): boolean {
    if (gameInstance.queuedGarbage > 0) {
        const colors = selectColors(gameInstance);
        const maxAtOnce = gameInstance.gameSettings.garbageMaxAtOnce;
        let hasDied = false;
        for (let i = 0; i < maxAtOnce; i++) {
            const garbageIsSmallRow = !gameInstance.playGrid.rows[0].isSmallerRow
            const rowLength = gameInstance.playGrid.gridWidth - (garbageIsSmallRow ? 1 : 0);
            const garbage = generateGarbage(gameInstance, colors, rowLength);
            addGarbageToGrid(garbage, gameInstance.playGrid);
            gameInstance.queuedGarbage--;
            hasDied = checkIfGarbageKills(gameInstance);
            if (hasDied && (i === maxAtOnce - 1 || gameInstance.queuedGarbage === 0)) {
                gameInstance.gameTransitions.onGameDefeat();
                return true;
            } else if (gameInstance.queuedGarbage === 0) {
                return false;
            }
        }
    }
    return false;
}

function selectColors(gameInstance: GameInstance): Bubble[] {
    const colorAmount = gameInstance.gameSettings.garbageColorAmount;
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
    const cleanAmount = gameInstance.gameSettings.garbageCleanAmount;
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

function checkIfGarbageKills(gameInstance: GameInstance): boolean {
    const lastNonDeathRow = gameInstance.playGrid.rows[gameInstance.playGrid.rows.length - 1 - gameInstance.playGrid.extraGridHeight];
    for (const field of lastNonDeathRow.fields) {
        if (field.bubble === undefined) {
            return false;
        }
    }
    return true
}

export function getGarbageAmount(clearAmount: number, combo: number, wallbounce: boolean): number {
    if (clearAmount === 3 && !wallbounce) {
        return Math.floor(combo / 2);
    } 
    if (clearAmount === 4 && !wallbounce) {
        return Math.ceil(Math.floor(combo / 2) + combo + 2);
    }
    if (clearAmount >= 5 && !wallbounce) {
        return combo + 2;
    }
    if (clearAmount === 3 && wallbounce) {
        return Math.ceil(combo / 2);
    } 
    if (clearAmount === 4 && wallbounce) {
        return combo + 2;
    }
    if (clearAmount >= 5 && wallbounce) {
        return Math.floor(combo + 2 * 1.5);
    }
    return 0;
}