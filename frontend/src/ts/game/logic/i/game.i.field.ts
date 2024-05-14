import { Bubble } from "./game.i.bubble";
import { Coordinates } from "./game.i.grid-coordinates";

export interface Field {
    coords: Coordinates,
    centerPointCoords: Coordinates,
    bubble?: Bubble,
}