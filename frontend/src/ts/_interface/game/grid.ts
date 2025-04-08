import { Coordinates } from "./coordinates";
import { GarbagePreview } from "./garbagePreview";
import { Row } from "./row";

export interface Grid {
    gridWidth: number,
    gridHeight: number,
    extraGridHeight: number,
    bubbleHitboxRadius: number,
    bubbleFullRadius: number,
    bubbleFullDiameter: number,
    precisionWidth: number,
    precisionRowHeight: number,
    precisionHeight: number,
    garbagePreview: GarbagePreview,
    rows: Row[],
    launcherPrecisionPosition: Coordinates,
}