import { Container } from 'pixi.js';
import { Bubble } from './bubble';
import { Coordinates } from './coordinates';

export interface Field {
    coords: Coordinates;
    precisionCoords: Coordinates;
    bubble?: Bubble;
    dirty: boolean;
}
