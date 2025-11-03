import { Container } from "pixi.js";
import { LayoutProperties } from "./layoutProperties";

export interface GameSubContainers {
    layoutProperties: LayoutProperties;
    boardContainer: Container;
    gridContainer: Container;
    gridBackground: Container;
    queueContainer: Container;
    arrowContainer: Container;
    garbageContainer: Container;
    holdContainer: Container;
}