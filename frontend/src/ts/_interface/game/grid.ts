import { Coordinates } from "./coordinates";
import { Row } from "./row";

export interface Grid {
    gridWidth: number,
    gridHeight: number,
    extraGridHeight: number,
    bubbleFullRadius: number,
    bubbleHitboxRadius: number,
    precisionWidth: number,
    precisionRowHeight: number,
    precisionHeight: number,
    rows: Row[],
    launcherPrecisionPosition: Coordinates,
}