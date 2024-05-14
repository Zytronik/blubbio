import { Field } from "./i/game.i.field";
import { Grid } from "./i/game.i.grid";
import { Row } from "./i/game.i.row";
import { Coordinates } from "./i/game.i.grid-coordinates";
import { GameSettings } from "../settings/i/game.settings.i.game-settings";
import { Bubble } from "./i/game.i.bubble";

export function setupGrid(settings: GameSettings): Grid {
    const precisionWidth = settings.widthPrecisionUnits;
    const bubbleRadius = precisionWidth / (2 * settings.gridWidth);
    const bubbleDiameter = bubbleRadius * 2;
    const precisionRowHeight = Math.floor(bubbleRadius * Math.sqrt(3));
    const precisionHeight = precisionRowHeight * (settings.gridHeight + settings.gridExtraHeight)
    const playGrid: Grid = {
        precisionWidth: precisionWidth,
        precisionHeight: precisionHeight,
        precisionRowHeight: precisionRowHeight,
        gridWidth: settings.gridWidth,
        gridHeight: settings.gridHeight,
        extraGridHeight: settings.gridExtraHeight,
        rows: [],
        bubbleRadius: bubbleRadius,
        bubbleLauncherPosition: { x: precisionWidth / 2, y: precisionHeight - bubbleRadius },
        collisionRangeSquared: ((bubbleRadius * 2) ** 2) * settings.collisionDetectionFactor,
        dissolveFloatingBubbles: settings.clearFloatingBubbles,
    }
    for (let h = 0; h < playGrid.gridHeight + playGrid.extraGridHeight; h++) {
        const isSmallRow = (h % 2 === 1);
        const row: Row = {
            fields: [],
            size: playGrid.gridWidth - (isSmallRow ? 1 : 0),
            isSmallerRow: isSmallRow,
            isInDeathZone: h >= playGrid.gridHeight,
        }
        for (let w = 0; w < row.size; w++) {
            const field: Field = {
                coords: { x: w, y: h, },
                centerPointCoords: {
                    x: w * bubbleDiameter + (isSmallRow ? bubbleDiameter : bubbleRadius),
                    y: precisionRowHeight * h + bubbleRadius,
                },
            };
            row.fields.push(field)
        }
        playGrid.rows.push(row);
    }
    return playGrid;
}

export function resetGrid(playGrid: Grid): void {
    const bubbleRadius = playGrid.bubbleRadius;
    const bubbleDiameter = bubbleRadius * 2;
    const precisionRowHeight = playGrid.precisionRowHeight;
    playGrid.rows = [];
    for (let h = 0; h < playGrid.gridHeight + playGrid.extraGridHeight; h++) {
        const isSmallRow = (h % 2 === 1);
        const row: Row = {
            fields: [],
            size: playGrid.gridWidth - (isSmallRow ? 1 : 0),
            isSmallerRow: isSmallRow,
            isInDeathZone: h >= playGrid.gridHeight,
        }
        for (let w = 0; w < row.size; w++) {
            const field: Field = {
                coords: { x: w, y: h, },
                centerPointCoords: {
                    x: w * bubbleDiameter + (isSmallRow ? bubbleDiameter : bubbleRadius),
                    y: precisionRowHeight * h + bubbleRadius,
                },
            };
            row.fields.push(field)
        }
        playGrid.rows.push(row);
    }
}

export function getNearbyFields(playGrid: Grid, pointPosition: Coordinates): Field[] {
    const bubbleRadius = playGrid.bubbleRadius;
    const bubbleDiameter = playGrid.bubbleRadius * 2;
    const row = Math.round((pointPosition.y - bubbleRadius) / playGrid.precisionRowHeight);
    const isSmallerRow = playGrid.rows[row].isSmallerRow;
    const xOffSet = (isSmallerRow ? bubbleDiameter : bubbleRadius)
    const column = Math.round((pointPosition.x - xOffSet) / bubbleDiameter);
    const nearbyFields: Field[] = []
    getAdjacentFieldVectors(playGrid, { x: column, y: row }).forEach(fieldVector => {
        const x = column + fieldVector.x;
        const y = row + fieldVector.y;
        if (playGrid.rows[y] && playGrid.rows[y].fields[x]) {
            nearbyFields.push(playGrid.rows[y].fields[x]);
        }
    })
    return nearbyFields;
}

export function dissolveBubbles(playGrid: Grid, collidedAtField: Field, colorToCheck: number): number {
    let dissolvedBubblesAmount = 0;
    const komma = ','
    const x = collidedAtField.coords.x;
    const y = collidedAtField.coords.y;
    const visited = new Set<string>();
    const result = new Set<string>();
    findAdjacentBubbles(x, y, colorToCheck, visited, result);
    if (result.size >= 3) {
        result.forEach(xyString => {
            const x = parseInt(xyString.split(komma)[0]);
            const y = parseInt(xyString.split(komma)[1]);
            getField(x, y).bubble = undefined;
        })
        dissolvedBubblesAmount += result.size;
    }
    if (playGrid.dissolveFloatingBubbles) {
        const unconnected = getFreeFloatingBubbles();
        unconnected.forEach(xyString => {
            const x = parseInt(xyString.split(komma)[0]);
            const y = parseInt(xyString.split(komma)[1]);
            getField(x, y).bubble = undefined;
        })
    }
    return dissolvedBubblesAmount;

    function findAdjacentBubbles(x: number, y: number, colorToCheck: number, visited: Set<string>, result: Set<string>): void {
        const isInBounds = playGrid.rows[y] != undefined && playGrid.rows[y].fields[x] != undefined;
        const alreadyTraversed = visited.has(`${x}${komma}${y}`);
        if (alreadyTraversed || !isInBounds) {
            return;
        }
        visited.add(`${x}${komma}${y}`);

        const field = getField(x, y);
        if (!field.bubble || field.bubble.type !== colorToCheck) {
            return;
        }

        result.add(`${x}${komma}${y}`);

        getAdjacentFieldVectors(playGrid, { x: x, y: y }).forEach(fieldVector => {
            const nextX = x + fieldVector.x;
            const nextY = y + fieldVector.y;
            findAdjacentBubbles(nextX, nextY, colorToCheck, visited, result);
        });
    }

    function getFreeFloatingBubbles(): Set<string> {
        const connected = new Set<string>();
        const unconnected = new Set<string>();
        playGrid.rows[0].fields.forEach(firstRowField => {
            findBubblesConnectoToTop(firstRowField.coords.x, firstRowField.coords.y, connected);
        });

        playGrid.rows.forEach(row => {
            row.fields.forEach(field => {
                const xyString = `${field.coords.x}${komma}${field.coords.y}`;
                if (!connected.has(xyString) && field.bubble) {
                    unconnected.add(xyString);
                }
            });
        });
        return unconnected;

        function findBubblesConnectoToTop(x: number, y: number, connected: Set<string>): void {
            const isInBounds = playGrid.rows[y] != undefined && playGrid.rows[y].fields[x] != undefined;
            const alreadyTraversed = connected.has(`${x}${komma}${y}`);
            if (!isInBounds || !playGrid.rows[y].fields[x].bubble || alreadyTraversed) {
                return;
            }

            connected.add(`${x}${komma}${y}`);

            getAdjacentFieldVectors(playGrid, { x: x, y: y }).forEach(fieldVector => {
                const nextX = x + fieldVector.x;
                const nextY = y + fieldVector.y;
                findBubblesConnectoToTop(nextX, nextY, connected);
            });
        }
    }

    function getField(x: number, y: number): Field {
        return playGrid.rows[y].fields[x]
    }
}

export function addGarbageToGrid(garbage: Bubble[], grid: Grid): void {
    for (let h = grid.rows.length - 1; h > 0; h--) {
        for (let w = 0; w < grid.gridWidth - 1; w++) {
            const field = grid.rows[h].fields[w];
            field.bubble = grid.rows[h - 1].fields[field.coords.x].bubble;
            field.centerPointCoords.x = grid.rows[h - 1].fields[field.coords.x].centerPointCoords.x;
        }
        if (grid.rows[h].isSmallerRow) {
            const lastIndex = grid.gridWidth - 1;
            const centerPointX = grid.rows[h - 1].fields[lastIndex].centerPointCoords.x;
            const centerPointY = grid.rows[h].fields[0].centerPointCoords.y;
            const field: Field = {
                coords: { x: lastIndex, y: h, },
                centerPointCoords: { x: centerPointX, y: centerPointY, },
                bubble: grid.rows[h - 1].fields[lastIndex].bubble,
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
        field.bubble = garbage[w];
        field.centerPointCoords.x = grid.rows[2].fields[w].centerPointCoords.x;
    }
    if (grid.rows[0].isSmallerRow) {
        const lastIndex = grid.gridWidth - 1;
        const centerPointX = grid.rows[2].fields[lastIndex].centerPointCoords.x;
        const centerPointY = grid.rows[0].fields[0].centerPointCoords.y;
        const field: Field = {
            coords: { x: lastIndex, y: 0, },
            centerPointCoords: { x: centerPointX, y: centerPointY, },
            bubble: garbage[lastIndex],
        }
        grid.rows[0].fields.push(field);
    } else {
        grid.rows[0].fields.pop();
    }
    grid.rows[0].isSmallerRow = grid.rows[2].isSmallerRow;
    grid.rows[0].size = grid.rows[2].size;
}

function getAdjacentFieldVectors(playGrid: Grid, gridPosition: Coordinates): Coordinates[] {
    const hexagonalShift = playGrid.rows[gridPosition.y].isSmallerRow ? 1 : -1;
    const adjacentFieldVectors: Coordinates[] = [
        { x: 0, y: 0, },
        { x: -1, y: 0, },
        { x: 1, y: 0, },
        { x: hexagonalShift, y: -1, },
        { x: hexagonalShift, y: 1, },
        { x: 0, y: -1, },
        { x: 0, y: +1, },
    ]
    return adjacentFieldVectors;
}