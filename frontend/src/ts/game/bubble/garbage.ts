import { GameInstance } from '@/ts/_interface/game/gameInstance';
import { XORRandom } from '../rng';
import { Row } from '@/ts/_interface/game/row';
import { GARBAGE_MESSINESS, GARBAGE_STATS } from '@/ts/_enum/garbageMessiness';
import { rngReference } from '@/ts/_interface/game/rngReference';
import { GarbageInformation } from '@/ts/_interface/game/garbageInformation';
import { allBubbles } from './bubbleTypes';
import { renderGarbagePreview } from '@/ts/animationPixi/garbagePreviewAnimation';
import { RowInformation } from '@/ts/_interface/game/rowInformation';
import { Field } from '@/ts/_interface/game/field';

export function prefillBoard(instance: GameInstance): void {
    const totalHeight = instance.gameSettings.gridHeight + instance.gameSettings.gridExtraHeight - 1;
    const amount = instance.gameSettings.prefillBoardAmount;
    for (let h = Math.min(amount - 1, totalHeight); h >= 0; h--) {
        const row = instance.playGrid.rows[h];
        let rowBelow: RowInformation;
        if (h === totalHeight) {
            rowBelow = convertToRowInformation(row);
        } else {
            rowBelow = convertToRowInformation(instance.playGrid.rows[h + 1]);
        }
        const messiness = instance.gameSettings.prefillMessiness;
        const garbageResult = newGarbage(rowBelow, messiness, instance.garbageSeed);
        row.garbageMessiness = garbageResult.garbageMessiness;
        row.pairLocations = garbageResult.pairLocations;
        for (let i = 0; i < garbageResult.garbage.length; i++) {
            const colorID = garbageResult.garbage[i];
            row.fields[i].bubble = allBubbles[colorID];
        }
    }
}

export function prepareGarbage(instance: GameInstance, messiness: GARBAGE_MESSINESS, amount: number): void {
    const generatedGarbage = instance.garbagePreview.generatedGarbage;
    let rowBelow: RowInformation;
    if (generatedGarbage.length > 0) {
        rowBelow = convertGarbageToRowInformation(generatedGarbage[generatedGarbage.length - 1]);
    } else {
        rowBelow = convertToRowInformation(instance.playGrid.rows[0]);
    }
    for (let i = 0; i < amount; i++) {
        const garbageResult = newGarbage(rowBelow, messiness, instance.garbageSeed);
        instance.garbagePreview.generatedGarbage.push(garbageResult);
        rowBelow = {
            isSmallerRow: garbageResult.isSmallerRow,
            colorIDs: garbageResult.garbage,
            pairLocations: garbageResult.pairLocations,
        };
    }
    renderGarbagePreview(instance);
}

export function pushOneGarbageRow(instance: GameInstance): void {
    const garbageMaxAtOnce = instance.gameSettings.garbageMaxAtOnce;
    const grid = instance.playGrid;
    const indexSmallRowWidth = grid.gridWidth - 2;
    const indexTotalGridHeight = grid.gridHeight + grid.extraGridHeight - 1;
    const bigRowXCoordinates = grid.bigRowXCoordinates;
    const smallRowXCoordinates = grid.smallRowXCoordinates;
    const lastBigRowXCoordinate = bigRowXCoordinates[bigRowXCoordinates.length - 1];

    const incomingAmount = instance.garbagePreview.generatedGarbage.length;
    console.log('garbageMaxAtOnce:', garbageMaxAtOnce, 'incomingAmount:', incomingAmount);
    for (let i = 0; i < Math.min(garbageMaxAtOnce, incomingAmount); i++) {
        const row0 = grid.rows[0];
        const garbage = instance.garbagePreview.generatedGarbage.shift()!.garbage;
        allRowsDown();
        if (grid.rows[0].isSmallerRow) {
            fullRowGarbagePush(row0, garbage);
        } else {
            smallRowGarbagePush(row0, garbage);
        }
    }

    let fieldString = '';
    instance.playGrid.rows.forEach(row => {
        row.fields.forEach(field => {
            if (field.bubble) {
                fieldString += field.bubble.type;
            } else {
                fieldString += '-';
            }
        });
        fieldString += '\n';
    });
    console.log(fieldString);

    function allRowsDown() {
        for (let y = indexTotalGridHeight; y > 0; y--) {
            const row = grid.rows[y];
            const rowAbove = grid.rows[y - 1];
            copyRowAbove(row, rowAbove);
        }

        //all rows from index 1 and below copy the row above them, the top row (0) copies garbage
        function copyRowAbove(currentRow: Row, rowAbove: Row) {
            for (let x = 0; x <= indexSmallRowWidth; x++) {
                currentRow.fields[x].bubble = rowAbove.fields[x].bubble;
                currentRow.fields[x].precisionCoords.x = rowAbove.fields[x].precisionCoords.x;
            }
            if (currentRow.isSmallerRow) {
                const lastIndex = rowAbove.fields.length - 1;
                const y = currentRow.fields[0].coords.y;
                const centerPointX = lastBigRowXCoordinate;
                const centerPointY = currentRow.fields[0].precisionCoords.y;
                const field: Field = {
                    coords: { x: lastIndex, y: y },
                    precisionCoords: { x: centerPointX, y: centerPointY },
                    bubble: rowAbove.fields[lastIndex].bubble,
                    dirty: true,
                };
                currentRow.fields.push(field);
            } else {
                currentRow.fields.pop();
            }
            currentRow.isSmallerRow = !currentRow.isSmallerRow;
        }
    }

    function fullRowGarbagePush(row0: Row, garbage: number[]) {
        for (let x = 0; x <= indexSmallRowWidth; x++) {
            row0.fields[x].bubble = allBubbles[garbage[x]];
            row0.fields[x].precisionCoords.x = bigRowXCoordinates[x];
        }
        const lastIndex = garbage.length - 1;
        const y = row0.fields[0].coords.y;
        const centerPointX = lastBigRowXCoordinate;
        const centerPointY = row0.fields[0].precisionCoords.y;
        const field: Field = {
            coords: { x: lastIndex, y },
            precisionCoords: { x: centerPointX, y: centerPointY },
            bubble: allBubbles[garbage[lastIndex]],
            dirty: true,
        };
        row0.fields.push(field);
        row0.isSmallerRow = !row0.isSmallerRow;
    }

    function smallRowGarbagePush(row0: Row, garbage: number[]) {
        for (let x = 0; x <= indexSmallRowWidth; x++) {
            row0.fields[x].bubble = allBubbles[garbage[x]];
            row0.fields[x].precisionCoords.x = smallRowXCoordinates[x];
        }
        row0.fields.pop();
        row0.isSmallerRow = !row0.isSmallerRow;
    }
}

function newGarbage(rowBelow: RowInformation, messiness: GARBAGE_MESSINESS, seed: rngReference): GarbageInformation {
    const colorAmount = GARBAGE_STATS[messiness].colors;
    const pairAmount = GARBAGE_STATS[messiness].pairs;
    const pairLocationsBelow = rowBelow.pairLocations;
    const rowBelowSize = rowBelow.colorIDs.length;
    const rowSize = rowBelow.isSmallerRow ? rowBelowSize + 1 : rowBelowSize - 1;

    const allColorIDs = Array.from({ length: allBubbles.length }, (_, i) => i);
    const selectedColors = new Set<number>();
    selectColors();

    //example: [5][0,2,5] - at position [5] these colors are locked [0, 2, 5] to avoid triplets/pairs
    const tripletRestrictions: number[][] = Array.from({ length: rowSize + 2 }, () => []);
    const pairRestrictions: number[][] = Array.from({ length: rowSize + 1 }, () => []);
    //i dont want to worry about oob
    tripletRestrictions[-1] = [];
    tripletRestrictions[-2] = [];
    pairRestrictions[-1] = [];
    findRestrictionsFromBelow();

    const generatedGarbage: number[] = [];
    const pairLocations: number[] = [];
    generateGarbage();

    return {
        garbage: generatedGarbage,
        isSmallerRow: !rowBelow.isSmallerRow,
        garbageMessiness: messiness,
        pairLocations: pairLocations,
    };

    function selectColors(): void {
        if (messiness === GARBAGE_MESSINESS.COPY_CLEAN) {
            const colorsFromBelow = new Set<number>();
            rowBelow.colorIDs.forEach(colorID => {
                if (colorID) colorsFromBelow.add(colorID);
            });
            const leftoverColors = [...colorsFromBelow];
            for (let i = 0; i < colorAmount; i++) {
                if (leftoverColors.length > 0) {
                    const randomIndex = XORRandom(0, leftoverColors.length - 1, seed);
                    selectedColors.add(leftoverColors.splice(randomIndex, 1)[0]);
                }
            }
        } else {
            const leftoverColors = [...allColorIDs];
            for (let i = 0; i < colorAmount; i++) {
                const randomIndex = XORRandom(0, leftoverColors.length - 1, seed);
                selectedColors.add(leftoverColors.splice(randomIndex, 1)[0]);
            }
        }
    }

    function findRestrictionsFromBelow(): void {
        pairLocationsBelow.forEach(location => {
            const colorID = rowBelow.colorIDs[location];
            if (colorID != null) {
                const hexagonalShift = rowBelowSize < rowSize ? 1 : -1;
                tripletRestrictions[location].push(colorID);
                tripletRestrictions[location + hexagonalShift].push(colorID);
            }
        });
        for (let i = 0; i < rowBelow.colorIDs.length; i++) {
            const colorID = rowBelow.colorIDs[i];
            if (colorID != null) {
                const hexagonalShift = rowBelowSize < rowSize ? 1 : -1;
                pairRestrictions[i].push(colorID);
                pairRestrictions[i + hexagonalShift].push(colorID);
            }
        }
    }

    function generateGarbage(): void {
        let currentPalette: Set<number> = new Set(selectedColors);
        const positionsToFill = Array.from({ length: rowSize }, (_, i) => i);
        for (let i = 0; i < rowSize - pairAmount; i++) {
            if (currentPalette.size === 0) {
                currentPalette = new Set(selectedColors);
            }
            const randomIndex = XORRandom(0, positionsToFill.length - 1, seed);
            const randomLocation = positionsToFill.splice(randomIndex, 1)[0];
            const tripletFilter = tripletRestrictions[randomLocation];
            const pairFilter = pairRestrictions[randomLocation];
            const selectedColor = pickColorWithRestrictions(tripletFilter, pairFilter);
            currentPalette.delete(selectedColor);
            generatedGarbage[randomLocation] = selectedColor;
            pairRestrictions[randomLocation - 1].push(selectedColor);
            pairRestrictions[randomLocation + 1].push(selectedColor);
        }
        for (let j = 0; j < pairAmount; j++) {
            if (currentPalette.size === 0) {
                currentPalette = new Set(selectedColors);
            }
            const randomIndex = XORRandom(0, positionsToFill.length - 1, seed);
            const randomLocation = positionsToFill.splice(randomIndex, 1)[0];
            const tripletFilter = tripletRestrictions[randomLocation];
            const pairFilter = pairRestrictions[randomLocation];
            const selectedColor = pickPairColor(tripletFilter, pairFilter);
            currentPalette.delete(selectedColor);
            generatedGarbage[randomLocation] = selectedColor;
            pairRestrictions[randomLocation - 1].push(selectedColor);
            pairRestrictions[randomLocation + 1].push(selectedColor);

            pairLocations.push(randomLocation);
            if (generatedGarbage[randomLocation - 1] === selectedColor) {
                pairLocations.push(randomLocation - 1);
                tripletRestrictions[randomLocation - 2].push(selectedColor);
            }
            if (generatedGarbage[randomLocation + 1] === selectedColor) {
                pairLocations.push(randomLocation + 1);
                tripletRestrictions[randomLocation + 2].push(selectedColor);
            }
            tripletRestrictions[randomLocation + 1].push(selectedColor);
            tripletRestrictions[randomLocation - 1].push(selectedColor);
        }

        function pickColorWithRestrictions(triplets: number[], pairs: number[]): number {
            const restricted = new Set([...triplets, ...pairs]);

            //try to pick from nonrepeating colorpalette
            const currentPaletteFiltered = Array.from(currentPalette).filter(num => !restricted.has(num));
            if (currentPaletteFiltered.length > 0) {
                const randomIndex = XORRandom(0, currentPaletteFiltered.length - 1, seed);
                return currentPaletteFiltered[randomIndex];
            }

            //found none? try to pick from repeating colorpalette
            const selectedColorsFiltered = Array.from(selectedColors).filter(num => !restricted.has(num));
            if (selectedColorsFiltered.length > 0) {
                const randomIndex = XORRandom(0, selectedColorsFiltered.length - 1, seed);
                return selectedColorsFiltered[randomIndex];
            }

            //still found none? try to pick from all colors
            const allColorsFiltered = allColorIDs.filter(num => !restricted.has(num));
            if (allColorsFiltered.length > 0) {
                const randomIndex = XORRandom(0, allColorsFiltered.length - 1, seed);
                return allColorsFiltered[randomIndex];
            }

            console.error('be carefull, something went wrong with colorpicking!');
            console.log('nonrepeating palette', currentPalette, 'repeating palette', selectedColors, 'tripletRestriction: ', triplets, 'pairRestriction: ', pairs);
            console.error('picked red as default');
            return 0;
        }

        function pickPairColor(triplets: number[], pairs: number[]): number {
            const restricted = new Set(triplets);

            // duplicates in pairs = triplet
            pairs.forEach((num, i, arr) => {
                if (arr.indexOf(num) !== i) {
                    restricted.add(num);
                }
            });

            const pairAndPalette = pairs.filter(color => currentPalette.has(color) && !restricted.has(color));
            if (pairAndPalette.length > 0) {
                const randomIndex = XORRandom(0, pairAndPalette.length - 1, seed);
                return pairAndPalette[randomIndex];
            }

            const pair = pairs.filter(color => !restricted.has(color));
            if (pair.length > 0) {
                const randomIndex = XORRandom(0, pair.length - 1, seed);
                return pair[randomIndex];
            }

            const anyColor = allColorIDs.filter(color => !restricted.has(color));
            if (anyColor.length > 0) {
                const randomIndex = XORRandom(0, anyColor.length - 1, seed);
                return anyColor[randomIndex];
            }

            return XORRandom(0, allBubbles.length - 1, seed);
        }
    }
}

function convertGarbageToRowInformation(row: GarbageInformation): RowInformation {
    return {
        isSmallerRow: row.isSmallerRow,
        colorIDs: row.garbage,
        pairLocations: row.pairLocations,
    };
}

function convertToRowInformation(row: Row): RowInformation {
    const ids: (number | undefined)[] = [];
    row.fields.forEach(field => {
        ids.push(field.bubble?.type);
    });
    return {
        isSmallerRow: row.isSmallerRow,
        colorIDs: ids,
        pairLocations: row.pairLocations,
    };
}
