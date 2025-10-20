import { Coordinates } from "./coordinates";
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
    rows: Row[],
    launcherPrecisionPosition: Coordinates,
    bigRowXCoordinates: number[],
    smallRowXCoordinates: number[],
}