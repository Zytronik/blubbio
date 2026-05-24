import { Container } from "pixi.js";
import { GameSubContainers } from "./boardVisuals";

export interface AllContainers {
    mainContainer: Container;
    gameContainer: Container;
    overlayContainer: Container;
}