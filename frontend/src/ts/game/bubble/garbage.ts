import { GameInstance } from "@/ts/_interface/game/gameInstance";
import { XORRandom } from "../rng";
import { Row } from "@/ts/_interface/game/row";
import { GARBAGE_MESSINESS, GARBAGE_STATS } from "@/ts/_enum/garbageMessiness";
import { rngReference } from "@/ts/_interface/game/rngReference";
import { GarbageInformation } from "@/ts/_interface/game/garbage";
import { allBubbles } from "./bubbleTypes";
import { triggerGarbagePreviewAnimation } from "@/ts/animationPixi/garbagePreviewAnimation";
import { Field } from "@/ts/_interface/game/field";
import { Sprite } from "pixi.js";
import { bubbleOverlayTexture, bubbleTexture } from "@/ts/pixi/allTextures";

export function prefillBoard(instance: GameInstance): void {
    const amount = instance.gameSettings.prefillBoardAmount;
    for (let h = amount - 1; h >= 0; h--) {
        const row = instance.playGrid.rows[h];
        const rowBelow = convertToRowInformation(instance.playGrid.rows[h + 1]);
        const messiness = instance.gameSettings.prefillMessiness
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
    let rowBelow = convertToRowInformation(instance.playGrid.rows[0]);
    for (let i = 0; i < amount; i++) {
        const garbageResult = newGarbage(rowBelow, messiness, instance.garbageSeed);
        instance.garbagePreview.generatedGarbage.push(garbageResult)
        rowBelow = {
            isSmallerRow: garbageResult.isSmallerRow,
            colorIDs: garbageResult.garbage,
            pairLocations: garbageResult.pairLocations,
        }
    }
    triggerGarbagePreviewAnimation(instance);
}

export function pushGarbage(instance: GameInstance): void {
    const grid = instance.playGrid;
    const garbage = instance.garbagePreview.generatedGarbage.shift()?.garbage;
    for (let h = grid.rows.length - 1; h > 0; h--) {
        for (let w = 0; w < grid.gridWidth - 1; w++) {
            const field = grid.rows[h].fields[w];
            field.bubble = grid.rows[h - 1].fields[field.coords.x].bubble;
            field.precisionCoords.x = grid.rows[h - 1].fields[field.coords.x].precisionCoords.x;
        }
        if (grid.rows[h].isSmallerRow) {
            const lastIndex = grid.gridWidth - 1;
            const centerPointX = grid.rows[h - 1].fields[lastIndex].precisionCoords.x;
            const centerPointY = grid.rows[h].fields[0].precisionCoords.y;
            const field: Field = {
                coords: { x: lastIndex, y: h, },
                precisionCoords: { x: centerPointX, y: centerPointY, },
                bubble: grid.rows[h - 1].fields[lastIndex].bubble,
                bubbleSprite: new Sprite(bubbleTexture.texture),
                bubbleSpriteOverlay: new Sprite(bubbleOverlayTexture.texture)
            }
            grid.rows[h].fields.push(field);
        } else {
            grid.rows[h].fields.pop();
        }
        grid.rows[h].isSmallerRow = grid.rows[h - 1].isSmallerRow;
        grid.rows[h].size = grid.rows[h - 1].size;
    }

    for (let w = 0; w < grid.gridWidth - 1; w++) {
        const field = grid.rows[0].fields[w];
        if (garbage) field.bubble = allBubbles[garbage[w]];
        field.precisionCoords.x = grid.rows[2].fields[w].precisionCoords.x;
    }
    if (grid.rows[0].isSmallerRow && garbage) {
        const lastIndex = grid.gridWidth - 1;
        const centerPointX = grid.rows[2].fields[lastIndex].precisionCoords.x;
        const centerPointY = grid.rows[0].fields[0].precisionCoords.y;
        const field: Field = {
            coords: { x: lastIndex, y: 0, },
            precisionCoords: { x: centerPointX, y: centerPointY, },
            bubble: allBubbles[garbage[lastIndex]],
            bubbleSprite: new Sprite(bubbleTexture.texture),
            bubbleSpriteOverlay: new Sprite(bubbleOverlayTexture.texture)
        }
        grid.rows[0].fields.push(field);
    } else {
        grid.rows[0].fields.pop();
    }
    grid.rows[0].isSmallerRow = grid.rows[2].isSmallerRow;
    grid.rows[0].size = grid.rows[2].size;

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
        isSmallerRow: false,
        garbageMessiness: messiness,
        pairLocations: pairLocations,
    }

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
                const hexagonalShift = (rowBelowSize < rowSize) ? 1 : -1;
                tripletRestrictions[location].push(colorID)
                tripletRestrictions[location + hexagonalShift].push(colorID)
            }
        });
        for (let i = 0; i < rowBelow.colorIDs.length; i++) {
            const colorID = rowBelow.colorIDs[i];
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

interface RowInformation {
    isSmallerRow: boolean,
    colorIDs: (number | undefined)[],
    pairLocations: number[]
}

function convertToRowInformation(row: Row): RowInformation {
    const ids = []
    for (let i = 0; i < row.fields.length; i++) {
        const bubbleID = row.fields[i].bubble?.type;
        ids[i] = bubbleID;
    }
    return {
        isSmallerRow: row.isSmallerRow,
        colorIDs: ids,
        pairLocations: row.pairLocations,
    }
}