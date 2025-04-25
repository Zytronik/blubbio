import { GameInstance } from "@/ts/_interface/game/gameInstance";
import { XORRandom } from "../rng";
import { Row } from "@/ts/_interface/game/row";
import { GARBAGE_MESSINESS, GARBAGE_STATS } from "@/ts/_enum/garbageMessiness";
import { rngReference } from "@/ts/_interface/game/rngReference";
import { GarbageResult } from "@/ts/_interface/game/garbage";
import { allBubbles } from "./bubbleTypes";

export function prefillBoard(instance: GameInstance): void {
    const amount = instance.gameSettings.prefillBoardAmount;
    for (let h = amount-1; h >= 0; h--) {
        const row = instance.playGrid.rows[h];
        const rowBelow = instance.playGrid.rows[h+1];
        const messiness = instance.gameSettings.prefillMessiness
        const garbageResult = newGarbage(rowBelow, messiness, instance.garbageSeed);
        row.garbageMessiness = garbageResult.garbageMessiness;
        row.pairLocations = garbageResult.pairLocations;
        for (let i = 0; i < garbageResult.garbage.length; i++) {
            const colorID = garbageResult.garbage[i]
            row.fields[i].bubble = allBubbles[colorID]
        }
    }
}

// export function refillBoard(instance: GameInstance): void {
//     const refillAmount = instance.gameSettings.refillAmount;
//     for (let h = 0; h < refillAmount; h++) {
//         const row = instance.playGrid.rows[h];
//         const rowLength = row.size;
//         const colors = selectColors(instance)
//         const garbage = generateGarbage(instance, colors, rowLength)
//         for (let w = 0; w < rowLength; w++) {
//             row.fields[w].bubble = garbage[w]
//         }
//     }
// }

function newGarbage(rowBelow: Row, messiness: GARBAGE_MESSINESS, seed: rngReference): GarbageResult {
    const colorAmount = GARBAGE_STATS[messiness].colors;
    const pairAmount = GARBAGE_STATS[messiness].pairs;
    const pairLocationsBelow = rowBelow.pairLocations;
    const rowBelowSize = rowBelow.fields.length;
    const rowSize = rowBelow.isSmallerRow ? rowBelowSize + 1 : rowBelowSize - 1;

    const allColorIDs = Array.from({ length: allBubbles.length }, (_, i) => i);
    const selectedColors = new Set<number>();
    selectColors();

    //example: [5][0,2,5] - at position [5] these colors are locked [0, 2, 5] to avoid triplets/pairs
    const tripletRestrictions: number[][] = Array.from({ length: rowSize+2 }, () => []);
    const pairRestrictions: number[][] = Array.from({ length: rowSize+1 }, () => []);
    //i dont want to worry about oob
    tripletRestrictions[-1] = [];
    tripletRestrictions[-2] = [];
    pairRestrictions[-1] = [];
    findRestrictionsFromBelow();
    // console.log(pairRestrictions)

    const generatedGarbage: number[] = [];
    const pairLocations: number[] = [];
    generateGarbage();

    return {
        garbage: generatedGarbage,
        isSmallerRow: false,
        garbageMessiness: messiness,
        pairLocations: pairLocations,
    }

    function selectColors(): void {
        if (messiness === GARBAGE_MESSINESS.COPY_CLEAN) {
            rowBelow.fields.forEach(field => {
                if (selectColors.length < colorAmount) {
                    //NOT RANDOM YET, takes colors from left to right from row below
                    const type = field.bubble?.type;
                    if (type) selectedColors.add(type);
                }
            });
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
            const colorID = rowBelow.fields[location].bubble?.type
            if (colorID != null) {
                const hexagonalShift = (rowBelowSize < rowSize) ? 1 : -1;
                tripletRestrictions[location].push(colorID)
                tripletRestrictions[location + hexagonalShift].push(colorID)
            }
        });
        for (let i = 0; i < rowBelow.fields.length; i++) {
            const colorID = rowBelow.fields[i].bubble?.type;
            if (colorID != null) {
                const hexagonalShift = (rowBelowSize < rowSize) ? 1 : -1;
                pairRestrictions[i].push(colorID)
                pairRestrictions[i + hexagonalShift].push(colorID)
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
            console.log("pairColor: ",selectedColor, "location: ", randomLocation)
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
                console.log("currentPalette: ",currentPalette)
                console.log("selectedColors: ",selectedColors)
                console.log("restricted: ",restricted)
                console.warn("found no colors from palette - taking from all colors");
                const randomIndex = XORRandom(0, allColorsFiltered.length - 1, seed);
                return allColorsFiltered[randomIndex];
            }

            console.error("be carefull, something went wrong with colorpicking!");
            console.log(
                "nonrepeating palette", currentPalette,
                "repeating palette", selectedColors,
                "tripletRestriction: ", triplets,
                "pairRestriction: ", pairs
            );
            console.error("picked red as default");
            return 0;
        }

        function pickPairColor(triplets: number[], pairs: number[]): number {
            const restricted = new Set(triplets);
            console.log(...pairs)

            // duplicates in pairs = triplet
            pairs.forEach((num, i, arr) => {
                if (arr.indexOf(num) !== i) {
                    console.log("prevented triplet")
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

            console.error("THIS SHOULDNT BE THE CASE!?");
            return XORRandom(0, allBubbles.length - 1, seed);
        }
    }
}