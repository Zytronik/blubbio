import { Field } from "@/ts/_interface/game/field";
import { GameSettings } from "@/ts/_interface/game/gameSettings";
import { Grid } from "@/ts/_interface/game/grid";
import { Row } from "@/ts/_interface/game/row";
import { Sprite } from "pixi.js";
import { bubbleTexture } from "@/ts/pixi/allTextures";
import { GARBAGE_MESSINESS } from "@/ts/_enum/garbageMessiness";

export function getEmptyGrid(settings: GameSettings): Grid {
    const precisionWidth = settings.widthPrecisionUnits;
    const bubbleFullRadius = precisionWidth / (2 * settings.gridWidth);
    const bubbleDiameter = bubbleFullRadius * 2;
    const precisionRowHeight = Math.floor(bubbleFullRadius * Math.sqrt(3));
    const precisionHeight = precisionRowHeight * (settings.gridHeight + settings.gridExtraHeight - 1) + bubbleDiameter;
    const playGrid: Grid = {
        gridWidth: settings.gridWidth,
        gridHeight: settings.gridHeight,
        extraGridHeight: settings.gridExtraHeight,
        bubbleHitboxRadius: bubbleFullRadius * settings.collisionRangeFactor,
        bubbleFullRadius: bubbleFullRadius,
        bubbleFullDiameter: bubbleDiameter,
        precisionWidth,
        precisionRowHeight,
        precisionHeight,
        rows: [],
        launcherPrecisionPosition: {
            x: precisionWidth / 2,
            y: precisionHeight - bubbleFullRadius,
        },
    };
    for (let y = 0; y < playGrid.gridHeight + playGrid.extraGridHeight; y++) {
        const isSmallRow = y % 2 === 1;
        const row: Row = {
            fields: [],
            isSmallerRow: isSmallRow,
            isInDeathZone: y >= playGrid.gridHeight,
            garbageMessiness: GARBAGE_MESSINESS.REGULAR,
            pairLocations: []
        };
        for (let x = 0; x < playGrid.gridWidth; x++) {
            const field: Field = {
                coords: { x: x, y: y },
                precisionCoords: {
                    x: x * bubbleDiameter + (isSmallRow ? bubbleDiameter : bubbleFullRadius),
                    y: precisionRowHeight * y + bubbleFullRadius,
                },
                bubble: undefined,
                bubbleSpriteContainer: new Sprite(bubbleTexture.texture),
                disabled: (isSmallRow && x === playGrid.gridWidth - 1),
            };
            row.fields.push(field);
        }
        playGrid.rows.push(row);
    }
    return playGrid;
}