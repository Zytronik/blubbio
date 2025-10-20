import { Field } from '@/ts/_interface/game/field';
import { GameSettings } from '@/ts/_interface/game/gameSettings';
import { Grid } from '@/ts/_interface/game/grid';
import { Row } from '@/ts/_interface/game/row';
import { GARBAGE_MESSINESS } from '@/ts/_enum/garbageMessiness';
import { useSpriteStore } from '@/stores/spriteStore';

export function getEmptyGrid(settings: GameSettings): Grid {
    const precisionWidth = settings.widthPrecisionUnits;
    const bubbleFullRadius = precisionWidth / (2 * settings.gridWidth);
    const bubbleDiameter = bubbleFullRadius * 2;
    const precisionRowHeight = Math.floor(bubbleFullRadius * Math.sqrt(3));
    const precisionHeight = precisionRowHeight * (settings.gridHeight + settings.gridExtraHeight);
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
        bigRowXCoordinates: [],
        smallRowXCoordinates: [],
    };
    for (let x = 0; x < settings.gridWidth; x++) {
        playGrid.bigRowXCoordinates.push(x * bubbleDiameter + bubbleFullRadius);
    }
    for (let x = 0; x < settings.gridWidth - 1; x++) {
        playGrid.smallRowXCoordinates.push(x * bubbleDiameter + bubbleDiameter);
    }

    for (let y = 0; y < playGrid.gridHeight + playGrid.extraGridHeight; y++) {
        const isSmallRow = y % 2 === 1;
        const row: Row = {
            fields: [],
            size: playGrid.gridWidth - (isSmallRow ? 1 : 0),
            isSmallerRow: isSmallRow,
            isInDeathZone: y >= playGrid.gridHeight,
            garbageMessiness: GARBAGE_MESSINESS.REGULAR,
            pairLocations: [],
        };
        for (let x = 0; x < row.size; x++) {
            const field: Field = {
                coords: { x: x, y: y },
                precisionCoords: {
                    x: isSmallRow ? playGrid.smallRowXCoordinates[x] : playGrid.bigRowXCoordinates[x],
                    y: precisionRowHeight * y + bubbleFullRadius,
                },
                bubble: undefined,
                bubbleSpriteContainer: useSpriteStore().getBubbleSprite(),
            };
            row.fields.push(field);
        }
        playGrid.rows.push(row);
    }
    return playGrid;
}
