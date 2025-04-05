import { Coordinates } from "@/ts/_interface/game/coordinates";
import { GameInstance } from "@/ts/_interface/game/gameInstance";
import { getVector } from "./aiming";
import { Grid } from "@/ts/_interface/game/grid";
import { Field } from "@/ts/_interface/game/field";

export function shootBubble(instance: GameInstance): void {
    const angle = instance.angle;
    const grid = instance.playGrid;
    const bubbleRadius = grid.bubbleHitboxRadius;
    const leftWallX = bubbleRadius;
    const rightWallX = grid.precisionWidth - bubbleRadius;
    const ceilingY = bubbleRadius;
    const startPoint: Coordinates = grid.launcherPrecisionPosition;
    const initialFlightDirection: Coordinates = getVector(angle);
    const bubblesInGrid: Coordinates[] = getAllBubbleCoordinatesInGrid(grid);
    const travelLineCoords: Coordinates[] = [startPoint];
    const currentFlightDirection: Coordinates = initialFlightDirection;

    findtravelLineCoords();
    findNearestEmptyField();
    
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
            const collisionDistancePwr2 = (2 * bubbleRadius) ** 2;
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

    function findNearestEmptyField(): void {
        // const impactLocation = travelLineCoords[travelLineCoords.length - 1]
        // let nearestEmptyField: Field;
        // let closestDistance = Infinity;
        // getNearbyFields(grid, impactLocation).forEach(field => {
        //     if (!field.bubble) {
        //         const distance = getDistance(collisionCoords, field.centerPointCoords);
        //         if (distance < closestDistance) {
        //             closestDistance = distance;
        //             nearestEmptyField = field;
        //         }
        //     }
        // });
    }

    // let bounceAmount = 0
    // while (!checkForCollision(grid, bubbleCoords)) {
    //     bubbleCoords.x += xDirection;
    //     bubbleCoords.y += yDirection;
    //     const hitLeftWall = bubbleCoords.x < grid.bubbleRadius;
    //     const hitRightWall = bubbleCoords.x > grid.precisionWidth - grid.bubbleRadius;
    //     if (hitLeftWall || hitRightWall) {
    //         xDirection = -xDirection;
    //         bounceAmount++;
    //     }
    // // }
    // const gridField = snapToNextEmptyField(grid, bubbleCoords);
    // gridField.bubble = bubble;
    // const bubblesCleared = dissolveBubbles(grid, gridField, bubble.type, bounceAmount > 0);
    // const hasPerfectCleared = checkPerfectClear(grid);
    // const attack = getGarbageAmount(bubblesCleared, game.stats.currentCombo, hasPerfectCleared);
    // let defense = 0;
    // game.stats.attack += attack;
    // if (attack > 0) {
    //     game.queuedGarbage -= attack;
    //     if (game.queuedGarbage < 0) {
    //         const garbageToSend = Math.abs(game.queuedGarbage);
    //         game.sendGarbage(garbageToSend);
    //         defense = attack - garbageToSend;
    //         game.queuedGarbage = 0;
    //     }
    // }
    // trackBubbleShot(game, bounceAmount, bubblesCleared, attack, defense, hasPerfectCleared);

    // if (bubblesCleared < 3 && grid.rows[gridField.coords.y].isInDeathZone) {
    //     game.gameTransitions.onGameDefeat();
    //     return { hasdied: true, clearAmount: bubblesCleared };
    // }
}

export function getNearbyFields(playGrid: Grid, pointPosition: Coordinates): Field[] {
    const bubbleRadius = playGrid.bubbleFullRadius;
    const bubbleDiameter = playGrid.bubbleFullRadius * 2;
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