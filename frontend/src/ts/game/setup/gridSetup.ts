import { Field } from "@/ts/_interface/game/field";
import { GameSettings } from "@/ts/_interface/game/gameSettings";
import { Grid } from "@/ts/_interface/game/grid";
import { Row } from "@/ts/_interface/game/row";
import { Sprite } from "pixi.js";
import { bubbleOverlayTexture, bubbleTexture } from "@/ts/pixi/allTextures";
import { GarbagePreview } from "@/ts/_interface/game/garbagePreview";
import { GARBAGE_MESSINESS } from "@/ts/_enum/garbageMessiness";

export function getEmptyGrid(settings: GameSettings): Grid {
    const precisionWidth = settings.widthPrecisionUnits;
    const bubbleFullRadius = precisionWidth / (2 * settings.gridWidth);
    const bubbleDiameter = bubbleFullRadius * 2;
    const precisionRowHeight = Math.floor(bubbleFullRadius * Math.sqrt(3));
    const precisionHeight = precisionRowHeight * (settings.gridHeight + settings.gridExtraHeight - 1) + bubbleDiameter;
    const garbagePreview: GarbagePreview = {
        rows: []
    }
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
        garbagePreview,
        rows: [],
        launcherPrecisionPosition: {
            x: precisionWidth / 2,
            y: precisionHeight - bubbleFullRadius,
        },
    };
    for (let h = 0; h < playGrid.gridHeight + playGrid.extraGridHeight; h++) {
        const isSmallRow = h % 2 === 1;
        const row: Row = {
            fields: [],
            size: playGrid.gridWidth - (isSmallRow ? 1 : 0),
            isSmallerRow: isSmallRow,
            isInDeathZone: h >= playGrid.gridHeight,
            garbageMessiness: GARBAGE_MESSINESS.REGULAR,
            pairLocations: []
        };
        for (let w = 0; w < row.size; w++) {
            const field: Field = {
                coords: { x: w, y: h },
                precisionCoords: {
                    x: w * bubbleDiameter + (isSmallRow ? bubbleDiameter : bubbleFullRadius),
                    y: precisionRowHeight * h + bubbleFullRadius,
                },
                bubble: undefined,
                bubbleSprite: new Sprite(bubbleTexture.texture),
                bubbleSpriteOverlay: new Sprite(bubbleOverlayTexture.texture),
            };
            row.fields.push(field);
        }
        playGrid.rows.push(row);
    }
    return playGrid;
}