import { Bubble } from "./bubble";
import { Coordinates } from "./coordinates";
import { Field } from "./field";

export interface ShotResult {
    bubbleShot: Bubble,
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