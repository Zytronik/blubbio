import { Coordinates } from "@/ts/_interface/game/coordinates";
import { GameInstance } from "@/ts/_interface/game/gameInstance";
import { getVector } from "./aiming";
import { Grid } from "@/ts/_interface/game/grid";
import { Field } from "@/ts/_interface/game/field";
import { ShootResult } from "@/ts/_interface/game/shootResult";

export function shootBubble(instance: GameInstance): ShootResult {
    const bubbleType = instance.currentBubble.type;
    const angle = instance.angle;
    const grid = instance.playGrid;
    const bubbleFullRadius = grid.bubbleFullRadius;
    const bubbleFullDiameter = grid.bubbleFullDiameter;
    const bubbleHitboxRadius = grid.bubbleHitboxRadius;
    const leftWallX = bubbleHitboxRadius;
    const rightWallX = grid.precisionWidth - bubbleHitboxRadius;
    const ceilingY = bubbleHitboxRadius;
    const startPoint: Coordinates = grid.launcherPrecisionPosition;
    const initialFlightDirection: Coordinates = getVector(angle);
    const bubblesInGrid: Coordinates[] = getAllBubbleCoordinatesInGrid(grid);
    const travelLineCoords: Coordinates[] = [startPoint];
    const currentFlightDirection: Coordinates = initialFlightDirection;

    findtravelLineCoords();
    const gridDestination: Field = findNearestEmptyField();
    const clearedBubbleFields = getClearedBubbleFields();
    const freeFloatingBubbleFields = getFloatingBubbleFields();
    const hasDied: boolean = checkHasDied();
    const hasPerfectCleared = checkHasPerfectCleared();

    return {
        travelLine: travelLineCoords,
        gridDestination,
        clearedBubbles: clearedBubbleFields,
        freeFloatingBubbles: freeFloatingBubbleFields,
        combo: 0,
        attack: 0,
        hasWallBounced: travelLineCoords.length > 2,
        hasDied,
        hasPerfectCleared,
    }

    function getAllBubbleCoordinatesInGrid(grid: Grid): Coordinates[] {
        const allPrecisionCoords: Coordinates[] = [];
        grid.rows.forEach(row => {
            row.fields.forEach(field => {
                field.bubble ? allPrecisionCoords.push(field.precisionCoords) : null;
            });
        });
        return allPrecisionCoords;
    }

    function findtravelLineCoords(): void {
        const currentPos = travelLineCoords[travelLineCoords.length - 1];
        const sideWallImpactTime = getTravelTimeToHitSideWall();
        const ceilingImpactTime = getTravelTimeToHitCeiling();
        const bubbleImpactTime = getTravelTimeToHitGridBubble();
        // console.log(leftWallX, rightWallX, ceilingY, startPoint, currentPos, currentFlightDirection)
        // console.log("sideWallImpactTime", sideWallImpactTime, "ceilingImpactTime", ceilingImpactTime, "bubbleImpactTime", bubbleImpactTime)
        // console.log("bubblesInGrid", bubblesInGrid, "initialFlightDirection", initialFlightDirection, "travelLineCoords", travelLineCoords)

        if (bubbleImpactTime <= sideWallImpactTime && bubbleImpactTime < ceilingImpactTime) {
            // console.log("bubbleimpact", angle)
            travelLineCoords.push({
                x: currentPos.x + currentFlightDirection.x * bubbleImpactTime,
                y: currentPos.y + currentFlightDirection.y * bubbleImpactTime,
            });
            return;
        }

        if (ceilingImpactTime <= sideWallImpactTime && ceilingImpactTime < bubbleImpactTime) {
            // console.log("ceilingimpact", angle)
            travelLineCoords.push({
                x: currentPos.x + currentFlightDirection.x * ceilingImpactTime,
                y: currentPos.y + currentFlightDirection.y * ceilingImpactTime,
            });
            return;
        }

        if (sideWallImpactTime < bubbleImpactTime && sideWallImpactTime < ceilingImpactTime) {
            // console.log("wallimpact", angle)
            travelLineCoords.push({
                x: currentPos.x + currentFlightDirection.x * sideWallImpactTime,
                y: currentPos.y + currentFlightDirection.y * sideWallImpactTime,
            });
            currentFlightDirection.x = -currentFlightDirection.x;
            findtravelLineCoords();
        }


        function getTravelTimeToHitSideWall(): number {
            if (currentFlightDirection.x > 0) {
                return Math.abs((rightWallX - currentPos.x) / currentFlightDirection.x);
            } else if (currentFlightDirection.x < 0) {
                return Math.abs((leftWallX - currentPos.x) / currentFlightDirection.x);
            } else {
                return Infinity;
            }
        }

        function getTravelTimeToHitCeiling(): number {
            return Math.abs((ceilingY - currentPos.y) / currentFlightDirection.y);
        }

        function getTravelTimeToHitGridBubble(): number {
            let closestT = Infinity;

            const speedX = currentFlightDirection.x;
            const speedY = currentFlightDirection.y;
            const collisionDistancePwr2 = (2 * bubbleHitboxRadius) ** 2;
            const A = speedX * speedX + speedY * speedY;

            for (const gridBubble of bubblesInGrid) {
                const deltaX = currentPos.x - gridBubble.x;
                const deltaY = currentPos.y - gridBubble.y;

                const B = 2 * (speedX * deltaX + speedY * deltaY);
                const C = (deltaX) ** 2 + (deltaY) ** 2 - collisionDistancePwr2;

                const discriminant = B * B - 4 * A * C;
                if (discriminant < 0) continue; // No collision

                const t1 = (-B - Math.sqrt(discriminant)) / (2 * A);
                const t2 = (-B + Math.sqrt(discriminant)) / (2 * A);

                const t = t1 > 0 ? t1 : t2 > 0 ? t2 : Infinity;
                if (t < closestT) {
                    closestT = t;
                }
            }
            return closestT;

        }

    }

    function findNearestEmptyField(): Field {
        const precisionImpactLocation = travelLineCoords[travelLineCoords.length - 1]
        const y = Math.round(precisionImpactLocation.y / grid.precisionRowHeight);
        const isSmallerRow = grid.rows[y].isSmallerRow;
        const xOffSet = (isSmallerRow ? bubbleFullDiameter : bubbleFullRadius)
        const x = clamp(Math.round((precisionImpactLocation.x - xOffSet) / bubbleFullDiameter));
        const gridImpactLocation: Coordinates = { x, y };
        let nearestEmptyField: Field = grid.rows[y].fields[x];
        let closestDistance = Infinity;
        // console.log(grid.precisionHeight, grid.precisionWidth, precisionImpactLocation, x, y, isSmallerRow);
        getAdjacentFieldVectors(grid, gridImpactLocation).forEach(vector => {
            const vx = x + vector.x;
            const vy = y + vector.y;
            if (grid.rows[vy] && grid.rows[vy].fields[vx] && !grid.rows[vy].fields[vx].bubble) {
                const field = grid.rows[vy].fields[vx];
                const distance = getDistance(precisionImpactLocation, field.precisionCoords);
                closestDistance = distance;
                nearestEmptyField = field;
                if (distance < closestDistance) {
                    closestDistance = distance;
                    nearestEmptyField = field;
                }
            }
        });
        // if (nearestEmptyField.coords.x != x || nearestEmptyField.coords.y != y) {
        //     console.log("GOTCHA!")
        //     console.log(x, y, nearestEmptyField, closestDistance)
        // }
        // console.log(nearestEmptyField)
        return nearestEmptyField;

        function clamp(value: number): number {
            const min = 0
            const rowSize = isSmallerRow ? 2 : 1;
            const max = grid.gridWidth - rowSize;
            return Math.max(min, Math.min(max, value));
        }
    }

    function checkHasDied(): boolean {
        return (clearedBubbleFields.length < 3 && grid.rows[gridDestination.coords.y].isInDeathZone);
    }

    function getClearedBubbleFields(): Field[] {
        const komma = ','
        const destinationX = gridDestination.coords.x;
        const destinationY = gridDestination.coords.y;
        const visitedPositions = new Set<string>();
        const sameColoredPositions = new Set<string>();
        visitedPositions.add(`${destinationX}${komma}${destinationY}`);
        sameColoredPositions.add(`${destinationX}${komma}${destinationY}`);

        getAdjacentFieldVectors(grid, { x: destinationX, y: destinationY }).forEach(fieldVector => {
            const nextX = destinationX + fieldVector.x;
            const nextY = destinationY + fieldVector.y;
            findAdjacentBubbles(nextX, nextY);
        });

        if (sameColoredPositions.size >= 3) {
            const clearedFields: Field[] = []
            sameColoredPositions.forEach(xyString => {
                const x = parseInt(xyString.split(komma)[0]);
                const y = parseInt(xyString.split(komma)[1]);
                clearedFields.push(grid.rows[y].fields[x]);
            });
            return clearedFields;
        } else {
            return [];
        }

        function findAdjacentBubbles(x: number, y: number): void {
            console.log(x, y, visitedPositions, sameColoredPositions)
            const isInBounds = grid.rows[y] != undefined && grid.rows[y].fields[x] != undefined;
            const alreadyVisited = visitedPositions.has(`${x}${komma}${y}`);
            if (alreadyVisited || !isInBounds) {
                return;
            }
            
            visitedPositions.add(`${x}${komma}${y}`);
            const field = grid.rows[y].fields[x];
            if (!field.bubble || field.bubble.type !== bubbleType) {
                return;
            }
            
            sameColoredPositions.add(`${x}${komma}${y}`);
            getAdjacentFieldVectors(grid, { x, y }).forEach(fieldVector => {
                const nextX = x + fieldVector.x;
                const nextY = y + fieldVector.y;
                findAdjacentBubbles(nextX, nextY);
            });
        }
    }

    function getFloatingBubbleFields(): Field[] {
        if (clearedBubbleFields.length > 1) {
            const komma = ','
            const connected = new Set<string>();
            const unconnected = new Set<string>();
            grid.rows[0].fields.forEach(firstRowField => {
                findBubblesConnectoToTop(firstRowField.coords.x, firstRowField.coords.y);

                function findBubblesConnectoToTop(x: number, y: number): void {
                    const isInBounds = grid.rows[y] != undefined && grid.rows[y].fields[x] != undefined;
                    const alreadyTraversed = connected.has(`${x}${komma}${y}`);
                    if (!isInBounds || !grid.rows[y].fields[x].bubble || alreadyTraversed) {
                        return;
                    }
                    connected.add(`${x}${komma}${y}`);
                    getAdjacentFieldVectors(grid, { x: x, y: y }).forEach(fieldVector => {
                        const nextX = x + fieldVector.x;
                        const nextY = y + fieldVector.y;
                        findBubblesConnectoToTop(nextX, nextY);
                    });
                }
            });
            grid.rows.forEach(row => {
                row.fields.forEach(field => {
                    const xyString = `${field.coords.x}${komma}${field.coords.y}`;
                    if (!connected.has(xyString) && field.bubble) {
                        unconnected.add(xyString);
                    }
                });
            });
            const floatingFields: Field[] = []
            unconnected.forEach(xyString => {
                const x = parseInt(xyString.split(komma)[0]);
                const y = parseInt(xyString.split(komma)[1]);
                floatingFields.push(grid.rows[y].fields[x]);
            });
            return floatingFields;
        } else {
            return [];
        }
    }

    function checkHasPerfectCleared(): boolean {
        return false;
    }
}


//TODO where to put this method?
function getAdjacentFieldVectors(grid: Grid, gridPosition: Coordinates): Coordinates[] {
    const hexagonalShift = grid.rows[gridPosition.y].isSmallerRow ? 1 : -1;
    const adjacentFieldVectors: Coordinates[] = [
        { x: -1, y: 0, },
        { x: 1, y: 0, },
        { x: hexagonalShift, y: -1, },
        { x: hexagonalShift, y: 1, },
        { x: 0, y: -1, },
        { x: 0, y: +1, },
    ]
    return adjacentFieldVectors;
}
//TODO this one too, where should it go?
function getDistance(p1: Coordinates, p2: Coordinates): number {
    const a = (p1.x - p2.x) ** 2;
    const b = (p1.y - p2.y) ** 2;
    return Math.sqrt(a + b);
}