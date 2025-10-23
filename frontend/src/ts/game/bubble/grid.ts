import { Coordinates } from "@/ts/_interface/game/coordinates";
import { Grid } from "@/ts/_interface/game/grid";
import { ShotResult } from "@/ts/_interface/game/shotResult";

export function applyShotResultToGrid(shotResult: ShotResult): void {
    shotResult.gridDestination.bubble = shotResult.bubbleShot;
    shotResult.clearedBubbles.forEach(field => {
        field.bubble = undefined;
    });
    shotResult.freeFloatingBubbles.forEach(field => {
        field.bubble = undefined;
    });
}

export function getAdjacentFieldVectors(grid: Grid, gridPosition: Coordinates): Coordinates[] {
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

export function getDistance(p1: Coordinates, p2: Coordinates): number {
    const a = (p1.x - p2.x) ** 2;
    const b = (p1.y - p2.y) ** 2;
    return Math.sqrt(a + b);
}