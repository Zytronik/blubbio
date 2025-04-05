import { usePixiStore } from '@/stores/pixiStore';
import { Container, Graphics, RenderTexture } from 'pixi.js';
import { useGameStore } from '@/stores/gameStore';
import { GameInstance } from '../_interface/game/gameInstance';
import { getRandomHexColor } from './color';
import { GameContainers } from '../_interface/game/gameContainers';
import { GameSprites } from '../_interface/game/gameSprites';
import { circleGraphicsAsSprite } from './spriteBuilder';

export const mainContainer = new Container();
export const gameContainer = new Container({ visible: false });
export const countDownContainer = new Container({ visible: false });

export function setupPixiContainers(): void {
    const stage = usePixiStore().getPixiApp().stage;
    stage.addChild(mainContainer);
    mainContainer.addChild(gameContainer);
    mainContainer.addChild(countDownContainer);
}

export function createGameInstanceContainer(sprites: GameSprites): GameContainers {
    const height = usePixiStore().getCanvasHeight();
    const width = usePixiStore().getCanvasWidth();
    const instanceRootContainer = new Container({ visible: true });
    const gridContainer = new Container({ visible: true });
    const cursorContainer = new Container({ visible: true });

    gameContainer.addChild(instanceRootContainer);

    const maxWidth = 0.35;
    const maxHeight = 0.95;
    const mainSquare = new Graphics();
    mainSquare.rect(0, 0, width * maxWidth, height * maxHeight);
    mainSquare.fill(getRandomHexColor());
    instanceRootContainer.addChild(mainSquare);

    const gridWidth = 0.6;
    const gridHeight = 0.9;
    const gridXPos = 0.5;
    const gridYPos = 0.45;
    const gridSquare = new Graphics();
    gridSquare.rect(0, 0, mainSquare.width * gridWidth, mainSquare.height * gridHeight);
    gridSquare.fill(getRandomHexColor());
    gridContainer.x = mainSquare.width * gridXPos;
    gridContainer.y = mainSquare.height * gridYPos;
    gridContainer.pivot.x = gridSquare.width / 2;
    gridContainer.pivot.y = gridSquare.height / 2;
    gridContainer.addChild(gridSquare);

    // const bubbleGraphic = new Graphics();
    // bubbleGraphic.circle(0,0,500);
    // bubbleGraphic.fill(0xffffff);
    // bubbleGraphic.pivot.x = 0;
    // const blubbsprite = circleGraphicsAsSprite(bubbleGraphic);
    // const blubbsprite2 = circleGraphicsAsSprite(bubbleGraphic);
    // blubbsprite.width = 100;
    // blubbsprite.height = 100;
    // blubbsprite2.width = 100;
    // blubbsprite2.height = 100;
    // blubbsprite2.x = 200;
    // blubbsprite2.y = 100;

    // sprites.bgPurple.width = gridContainer.width;
    // sprites.bgPurple.height = gridContainer.height;
    // sprites.bgPurple.mask = blubbsprite;
    // sprites.bgRed.width = gridContainer.width;
    // sprites.bgRed.height = gridContainer.height;
    // sprites.bgRed.mask = blubbsprite2;

    // gridContainer.addChild(sprites.bgPurple);
    // gridContainer.addChild(sprites.bgRed);
    // gridContainer.addChild(blubbsprite);
    // gridContainer.addChild(blubbsprite2);
    // gridContainer.addChild(sprites.bubble);

    const cursorWidth = 0.1;
    const cursorXPos = 0.5;
    const cursorYPos = 1;
    const cursorSquare = new Graphics();
    cursorSquare.rect(0, 0, mainSquare.width * cursorWidth, mainSquare.width * cursorWidth);
    cursorSquare.fill(getRandomHexColor());
    cursorSquare.pivot.x = cursorSquare.width / 2;
    cursorSquare.pivot.y = cursorSquare.height / 2;
    cursorContainer.x = gridContainer.width * cursorXPos;
    cursorContainer.y = gridContainer.height * cursorYPos;
    cursorContainer.addChild(cursorSquare);

    const arrow = sprites.arrow;
    arrow.width = cursorSquare.width;
    arrow.height = cursorSquare.height;
    arrow.anchor.set(0.5);
    cursorContainer.addChild(arrow);

    instanceRootContainer.addChild(gridContainer);
    gridContainer.addChild(cursorContainer);

    const containers: GameContainers = {
        setupCanvasHeight: height,
        setupCanvasWidth: width,
        instanceRootContainer: instanceRootContainer,
        gridContainer: gridContainer,
        cursorContainer: cursorContainer,
        gridBackground: gridSquare,
    };
    return containers;
}

export function updateContainerLayout(): void {
    const instances: GameInstance[] = useGameStore().getAllInstances();
    const rootContainers: Container[] = [];
    instances.forEach(instance => {
        rootContainers.push(instance.gameContainers.instanceRootContainer);
    });

    const canvasWidth = usePixiStore().getCanvasWidth();
    const canvasHeight = usePixiStore().getCanvasHeight();
    if (rootContainers.length === 1) gameLayoutSolo(rootContainers, canvasWidth, canvasHeight);
    if (rootContainers.length === 2) gameLayout1vs1(rootContainers, canvasWidth, canvasHeight);
    if (rootContainers.length > 2) gameLayout1vsX(rootContainers, canvasWidth, canvasHeight);
}

function gameLayoutSolo(containers: Container[], canvasWidth: number, canvasHeight: number): void {
    const player1Root = containers[0];
    player1Root.visible = true;
    //topleft corner of container to middle
    player1Root.x = canvasWidth * 0.5;
    player1Root.y = canvasHeight * 0.5;
    //shift content 50% up and left to center children
    player1Root.pivot.x = player1Root.width / 2;
    player1Root.pivot.y = player1Root.height / 2;
}

function gameLayout1vs1(containers: Container[], canvasWidth: number, canvasHeight: number): void {
    const player1 = containers[0];
    const player2 = containers[1];
    player1.visible = true;
    player1.x = canvasWidth * 0.3;
    player1.y = canvasHeight * 0.5;
    player1.pivot.x = player1.width / 2;
    player1.pivot.y = player1.height / 2;

    player2.visible = true;
    player2.scale = 1;
    player2.x = canvasWidth * 0.7;
    player2.y = canvasHeight * 0.5;
    player2.pivot.x = player1.width / 2;
    player2.pivot.y = player1.height / 2;
    player2.scale = 1;
}

function gameLayout1vsX(containers: Container[], canvasWidth: number, canvasHeight: number): void {
    const player1 = containers[0];
    player1.visible = true;
    player1.x = canvasWidth * 0.3;
    player1.y = canvasHeight * 0.5;
    player1.pivot.x = player1.width / 2;
    player1.pivot.y = player1.height / 2;

    //orders the enemy players in a square grid on right side
    //not sure about using pivot. its very funky with scale: cant imagine scaling and moving a container as an animation with pivot centering
    const RIGHT_SIDE = 0.52;
    const RIGHT_SIDE_WIDTH = 0.45;
    const gridSize = Math.ceil(Math.sqrt(containers.length - 1)); //gridSize = 3 -> 3x3 grid
    for (let gridY = 0; gridY < gridSize; gridY++) {
        for (let gridX = 0; gridX < gridSize; gridX++) {
            const i = gridY * gridSize + gridX + 1;
            if (i < containers.length) {
                const otherPlayer = containers[i];
                otherPlayer.visible = true;
                otherPlayer.scale = 1;
                otherPlayer.x = canvasWidth * (RIGHT_SIDE + (gridX + 0.5) * (RIGHT_SIDE_WIDTH / gridSize));
                otherPlayer.y = canvasHeight * (gridY + 0.5) * (1 / gridSize);
                otherPlayer.pivot.x = otherPlayer.width / 2;
                otherPlayer.pivot.y = otherPlayer.height / 2;
                otherPlayer.scale = 1 / gridSize;
            }
        }
    }
}
