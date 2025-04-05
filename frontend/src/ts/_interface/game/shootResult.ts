import { Coordinates } from "./coordinates";
import { Field } from "./field";

export interface ShootResult {
    travelLine: Coordinates[],
    gridDestination: Field,
    clearedBubbles: Field[],
    freeFloatingBubbles: Field[],
    combo: number,
    attack: number,
    // meterGained: number,
    hasWallBounced: boolean,
    hasDied: boolean,
    hasPerfectCleared: boolean,
}