import { Coordinates } from "./game.i.grid-coordinates";
import { PreviewBubble } from "./game.i.preview-bubble";
import { Row } from "./game.i.row";

export interface Grid {
    precisionWidth: number,
    precisionHeight: number,
    precisionRowHeight: number,
    gridWidth: number,
    gridHeight: number,
    extraGridHeight: number,
    rows: Row[],
    bubbleRadius: number,
    bubbleLauncherPosition: Coordinates,
    previewBubble?: PreviewBubble,
    collisionRangeSquared: number,
    dissolveFloatingBubbles: boolean,
}