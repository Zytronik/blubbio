import { Container, Graphics } from 'pixi.js';

export interface GameContainers {
    setupCanvasHeight: number;
    setupCanvasWidth: number;
    instanceRootContainer: Container;
    gridContainer: Container;
    cursorContainer: Container;
    gridBackground: Graphics;
}
