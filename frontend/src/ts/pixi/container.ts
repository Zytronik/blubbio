import { usePixiStore } from '@/stores/pixiStore';
import { Container, Graphics, RenderTexture } from 'pixi.js';
import { useGameStore } from '@/stores/gameStore';
import { GameInstance } from '../_interface/game/gameInstance';
import { getRandomHexColor } from './color';
import { GameContainers } from '../_interface/game/gameContainers';
import { GameSprites } from '../_interface/pixi/gameSprites';
import { circleGraphicsAsSprite } from './spriteBuilder';

interface PixiVisuals {
    mainContainer: Container;
    gameVisuals: GameVisuals;
    //TODO filters etc.
}

export interface GameVisuals {
    gameContainer: Container;
    boardVisuals: BoardVisuals[];
    countDownContainer: Container;
}

export interface BoardVisuals {
    precisionAspectRatio: number;
    sprites: GameSprites;
    boardContainer: Container;
    gridContainer: Container;
    gridBackground: Container;
    queueContainer: Container;
}

export const gameVisuals: GameVisuals = {
    gameContainer: new Container({ visible: false }),
    boardVisuals: [],
    countDownContainer: new Container({ visible: false, label: "countDownContainer" }),
};

export const pixiVisuals: PixiVisuals = {
    mainContainer: new Container(),
    gameVisuals: gameVisuals,
};

const PADDING_BOARD_LEFT = 1 / 8;  // Full board width divided by bubble row count
const PADDING_BOARD_RIGHT = 0.2;

export function setupPixiVisuals(): void {
    const stage = usePixiStore().getPixiApp().stage;
    stage.addChild(pixiVisuals.mainContainer);

    pixiVisuals.mainContainer.addChild(gameVisuals.gameContainer);
    gameVisuals.gameContainer.addChild(gameVisuals.countDownContainer);

    drawMainContainer();
}

export function setupGameVisuals(): void {
    console.log("setupGameVisuals");
    drawGameContainer();
    drawCountDownContainer();
}

export function setupBoardVisuals(sprites: GameSprites, precisionAspectRatio: number): BoardVisuals {
    console.log("setupBoardVisuals", precisionAspectRatio);
    const boardContainer = new Container();
    const gridContainer = new Container();
    const gridBackground = new Container({ label: "gridBackground" });
    const queueContainer = new Container({ label: "queueContainer" });

    gameVisuals.gameContainer.addChild(boardContainer);
    boardContainer.addChild(gridContainer);
    boardContainer.addChild(gridBackground);
    boardContainer.addChild(queueContainer);

    const visuals: BoardVisuals = {
        precisionAspectRatio: precisionAspectRatio,
        sprites: sprites,
        boardContainer: boardContainer,
        gridContainer: gridContainer,
        gridBackground: gridBackground,
        queueContainer: queueContainer,
    };

    gameVisuals.boardVisuals.push(visuals);

    return visuals;
}

export function updateContainerLayout(): void {
    //TODO
}

function drawMainContainer(): void {
    const app = usePixiStore().getPixiApp();
    const mainContainer = pixiVisuals.mainContainer;
    mainContainer.label = "mainContainer";

    const padding = 20;
    const backgroundColor = 'red';

    mainContainer.x = padding;
    mainContainer.y = padding;

    const width = app.renderer.width - padding * 2;
    const height = app.renderer.height - padding * 2;

    const background = new Graphics().rect(0, 0, width, height).fill({ color: backgroundColor });
    background.label = "mainContainerBackground";

    mainContainer.addChildAt(background, 0);
}

function drawGameContainer(): void {
    const gameContainer = gameVisuals.gameContainer;
    gameContainer.label = "gameContainer";

    const parent = gameContainer.parent;
    const paddingX = 200;
    const paddingY = 20;

    gameContainer.x = paddingX;
    gameContainer.y = paddingY;

    const width = parent.width - paddingX * 2;
    const height = parent.height - paddingY * 2;

    const background = new Graphics().rect(0, 0, width, height).fill({ color: "blue" });
    background.label = "gameContainerBackground";

    gameContainer.addChildAt(background, 0);
}

function drawCountDownContainer(): void {
    const countDownContainer = gameVisuals.countDownContainer
    countDownContainer.label = "countDownContainer";
    countDownContainer.zIndex = 1;

    countDownContainer.x = 0;
    countDownContainer.y = 0;

    const parent = countDownContainer.parent;

    const width = parent.width;
    const height = parent.height;
    const background = new Graphics().rect(0, 0, width, height).fill({ color: 0x000000, alpha: 0 });
    background.label = "countDownContainerBackground";
    countDownContainer.addChild(background);
}

function drawGridContainer(visuals: BoardVisuals): void {
    const gridContainer = visuals.gridContainer;
    gridContainer.label = "gridContainer";
    gridContainer.zIndex = 1;

    const parent = gridContainer.parent;
    const aspectRatio = visuals.precisionAspectRatio;

    const paddingBoardLeft = getBoardPaddingLeft(visuals);

    gridContainer.x = paddingBoardLeft;
    gridContainer.y = 0;

    const height = parent.height;
    const width = height * aspectRatio;

    const background = new Graphics().rect(0, 0, width, height).fill({ color: 0x000000, alpha: 0.8 });
    background.label = "gridContainerBackground";
    gridContainer.addChild(background);
}

function drawGridBackgroundContainer(visuals: BoardVisuals): void {
    console.log("drawBackgroundContainer");
    const gridBackground = visuals.gridBackground;
    gridBackground.label = "gridBackground";

    const parent = gridBackground.parent;
    const aspectRatio = visuals.precisionAspectRatio;

    const paddingBoardLeft = getBoardPaddingLeft(visuals);

    gridBackground.x = paddingBoardLeft;
    gridBackground.y = 0;

    const height = parent.height;
    const width = height * aspectRatio;

    const background = new Graphics().rect(0, 0, width, height).fill({ color: "yellow" });
    background.label = "gridBackgroundBackground";
    gridBackground.addChild(background);
}

function drawQueueContainer(visuals: BoardVisuals): void {
    const queueContainer = visuals.queueContainer;
    queueContainer.label = "queueContainer";

    const paddingBoardLeft = getBoardPaddingLeft(visuals);

    queueContainer.x = 0;
    queueContainer.y = 0;

    const parent = queueContainer.parent;
    const width = paddingBoardLeft;
    const height = parent.height / 2;

    const background = new Graphics().rect(0, 0, width, height).fill({ color: "violet" });
    background.label = "queueContainerBackground";
    queueContainer.addChild(background);
}

function drawArrow(visuals: BoardVisuals): void {
    const { sprites } = visuals;
    const arrow = sprites.arrow;
    const gridContainer = visuals.gridContainer;

    arrow.label = "arrow";
    arrow.zIndex = 1;
    arrow.width = gridContainer.height * 0.07;
    arrow.height = gridContainer.height * 0.07;
    arrow.anchor.set(0.5);

    gridContainer.addChild(arrow);
}

export function drawGame(): void {
    const boardAmount = gameVisuals.boardVisuals.length;
    if (boardAmount === 1) {
        drawSoloLayout();
    } else if (boardAmount === 2) {
        draw1VS1Layout();
    } else if (boardAmount > 2) {
        drawMultiLayout();
    } else {
        return;
    }
}

function drawSoloLayout(): void {
    const gameContainer = gameVisuals.gameContainer;
    const visuals = gameVisuals.boardVisuals[0];
    const board = visuals.boardContainer;

    const aspectRatio = visuals.precisionAspectRatio;
    const maxHeightPercent = 0.8;

    const boardHeight = gameContainer.height * maxHeightPercent;
    const boardWidthNoPadding = boardHeight * aspectRatio;

    const paddingBoardLeft = boardWidthNoPadding * PADDING_BOARD_LEFT;
    const paddingBoardRight = boardWidthNoPadding * PADDING_BOARD_RIGHT;

    const boardWidth = boardWidthNoPadding + paddingBoardLeft + paddingBoardRight;

    const relativeX = (gameContainer.width - boardWidth) / 2;
    const relativeY = (gameContainer.height - boardHeight) / 2;

    board.x = relativeX;
    board.y = relativeY;

    drawBoardContainer(visuals, boardWidth, boardHeight);
}

function draw1VS1Layout(): void {
    const gameContainer = gameVisuals.gameContainer;

    const visualsLeft = gameVisuals.boardVisuals[0];
    const visualsRight = gameVisuals.boardVisuals[1];

    const aspectRatio = visualsLeft.precisionAspectRatio;
    const maxHeightPercent = 0.8;

    const boardHeight = gameContainer.height * maxHeightPercent;
    const boardWidthNoPadding = boardHeight * aspectRatio;
    const paddingBoardLeft = boardWidthNoPadding * PADDING_BOARD_LEFT;
    const paddingBoardRight = boardWidthNoPadding * PADDING_BOARD_RIGHT;
    const boardWidth = boardWidthNoPadding + paddingBoardLeft + paddingBoardRight;

    const relativeY = (gameContainer.height - boardHeight) / 2;

    const relativeXLeft = gameContainer.width * 0.25 - boardWidth / 2;
    visualsLeft.boardContainer.x = relativeXLeft;
    visualsLeft.boardContainer.y = relativeY;
    drawBoardContainer(visualsLeft, boardWidth, boardHeight);

    const relativeXRight = gameContainer.width * 0.75 - boardWidth / 2;
    visualsRight.boardContainer.x = relativeXRight;
    visualsRight.boardContainer.y = relativeY;
    drawBoardContainer(visualsRight, boardWidth, boardHeight);
}

function drawMultiLayout(): void {
    const gameContainer = gameVisuals.gameContainer;
    const boards = gameVisuals.boardVisuals;
    if (boards.length < 3) return;

    const padding = 20;
    const aspectRatio = boards[0].precisionAspectRatio;

    // Left board
    const mainBoardHeight = gameContainer.height * 0.8
    const mainBoardWidthNoPadding = mainBoardHeight * aspectRatio
    const paddingBoardLeft = mainBoardWidthNoPadding * PADDING_BOARD_LEFT;
    const paddingBoardRight = mainBoardWidthNoPadding * PADDING_BOARD_RIGHT;
    const mainBoardWidth = mainBoardWidthNoPadding + paddingBoardLeft + paddingBoardRight;

    const mainBoard = boards[0];
    const mainX = gameContainer.width / 2 / 2 - mainBoardWidth / 2;
    const mainY = (gameContainer.height - mainBoardHeight) / 2;

    mainBoard.boardContainer.x = mainX;
    mainBoard.boardContainer.y = mainY;

    drawBoardContainer(mainBoard, mainBoardWidth, mainBoardHeight);

    // Right side grid
    const remainingBoards = boards.slice(1);
    const gridSize = Math.ceil(Math.sqrt(remainingBoards.length));

    const gridBoardHeight = (mainBoardHeight - padding * (gridSize - 1)) / gridSize;
    const gridBoardWidthNoPadding = gridBoardHeight * aspectRatio;
    const paddingBoardLeftGrid = gridBoardWidthNoPadding * PADDING_BOARD_LEFT;
    const paddingBoardRightGrid = gridBoardWidthNoPadding * PADDING_BOARD_RIGHT;
    const gridBoardWidth = gridBoardWidthNoPadding + paddingBoardLeftGrid + paddingBoardRightGrid;

    const rightAvailableWidth = gameContainer.width / 2;
    const totalGridWidth = gridSize * gridBoardWidth + (gridSize - 1) * padding;
    const horizontalOffset = (rightAvailableWidth - totalGridWidth) / 2;

    const startX = gameContainer.width / 2 + horizontalOffset;
    const startY = mainY;

    for (let i = 0; i < remainingBoards.length; i++) {
        const board = remainingBoards[i];
        const gridX = i % gridSize;
        const gridY = Math.floor(i / gridSize);

        const posX = startX + gridX * (gridBoardWidth + padding);
        const posY = startY + gridY * (gridBoardHeight + padding);

        board.boardContainer.x = posX;
        board.boardContainer.y = posY;

        drawBoardContainer(board, gridBoardWidth, gridBoardHeight);
    }
}

function drawBoardContainer(visuals: BoardVisuals, width: number, height: number): void {
    const boardContainer = visuals.boardContainer;
    boardContainer.label = "boardContainer";
    const background = new Graphics().rect(0, 0, width, height).fill({ color: "green" });
    background.label = "boardContainerBackground";
    boardContainer.addChildAt(background, 0);
    drawGridBackgroundContainer(visuals);
    drawGridContainer(visuals);
    drawQueueContainer(visuals);
    drawArrow(visuals);
}

function getBoardPaddingLeft(visuals: BoardVisuals): number {
    return visuals.boardContainer.width / (1 + PADDING_BOARD_LEFT + PADDING_BOARD_LEFT) * PADDING_BOARD_LEFT;
}

function getBoardPaddingRight(visuals: BoardVisuals): number {
    return visuals.boardContainer.width / (1 + PADDING_BOARD_LEFT + PADDING_BOARD_LEFT) * PADDING_BOARD_RIGHT;
}

/* 
export const mainContainer = new Container();
export const gameContainer = new Container({ visible: false });
export const countDownContainer = new Container({ visible: false });

window.addEventListener('resize', updateContainerLayout);

export function setupPixiContainers(): void {
    const stage = usePixiStore().getPixiApp().stage;
    stage.addChild(mainContainer);
    mainContainer.addChild(gameContainer);
    mainContainer.addChild(countDownContainer);
}

export function createGameInstanceContainer(sprites: GameSprites): GameContainers {
    const height = usePixiStore().getCanvasHeight();
    const width = usePixiStore().getCanvasWidth();
    // console.log("height = " + height + "||| width = " + width);
    const instanceRootContainer = new Container({ visible: true });
    const gridContainer = new Container({ visible: true });
    const cursorContainer = new Container({ visible: true });

    gameContainer.addChild(instanceRootContainer);

    const ratioHeight = 1;
    const ratioWidth = 0.6;

    // Scales relative to outer box
    const xInnerInset = 0.6;
    const yInnerInset = 0.9;
    const cursorWidth = 0.1;

    // Normalized size?

    // ===================================================================================================
    // outer box
    const maxHeight = 1000;
    const maxWidth = (maxHeight / ratioHeight) * ratioWidth;
    const mainSquare = new Graphics();
    mainSquare.rect(0, 0, maxWidth, maxHeight);
    mainSquare.fill('555555');
    instanceRootContainer.addChild(mainSquare);
    // ===================================================================================================

    // ===================================================================================================
    // inner box
    const gridSquare = new Graphics();
    gridSquare.rect(0, 0, mainSquare.width * xInnerInset, mainSquare.height * yInnerInset);
    gridSquare.fill('999999');
    gridContainer.x = (mainSquare.width - gridSquare.width) / 2;
    gridContainer.y = 0;
    gridContainer.addChild(gridSquare);
    // ===================================================================================================

    // const bubbleGraphic = new Graphics();

    // bubbleGraphic.circle(0,0,500);
    // bubbleGraphic.fill(0xffffff);
    // bubbleGraphic.pivot.x = 0;
    // const blubbsprite = circleGraphicsAsSprite(bubbleGraphic);
    // const blubbsprite2 = circleGraphicsAsSprite(bubbleGraphic);
    // const alphasprite = circleGraphicsAsSprite(bubbleGraphic);
    // blubbsprite.width = 100;
    // blubbsprite.height = 100;

    // alphasprite.width = 100;
    // alphasprite.height = 100;
    // alphasprite.tint = "#000099";
    // alphasprite.alpha = 0.5

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

    // sprites.bgRed.tint = "#00FF00";

    // gridContainer.addChild(sprites.bgPurple);
    // gridContainer.addChild(sprites.bgRed);
    // gridContainer.addChild(blubbsprite);
    // gridContainer.addChild(blubbsprite2);
    // gridContainer.addChild(alphasprite);
    // gridContainer.addChild(sprites.bubble);

    //const cursorWidth = 0.1;
    const cursorXPos = 0.5;
    const cursorYPos = 1;
    const cursorSquare = new Graphics();
    cursorSquare.rect(0, 0, mainSquare.width * cursorWidth, mainSquare.width * cursorWidth);
    cursorSquare.fill('000000');
    cursorContainer.x = gridContainer.width * 0.5 - cursorSquare.width / 2;
    cursorContainer.y = gridContainer.height - cursorSquare.height / 2;
    cursorContainer.addChild(cursorSquare);
    // ===================================================================================================

    const arrow = sprites.arrow;
    arrow.width = cursorSquare.width;
    arrow.height = cursorSquare.height;
    arrow.anchor.set(0.5);
    arrow.x = cursorSquare.width / 2;
    arrow.y = cursorSquare.height / 2;
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
    const edgeScaler = 0.95;
    if (canvasWidth / canvasHeight >= player1Root.width / player1Root.height) {
        player1Root.scale = (canvasHeight / player1Root.height) * player1Root.scale.x * edgeScaler;
    } else {
        player1Root.scale = (canvasWidth / player1Root.width) * player1Root.scale.x * edgeScaler;
    }
    //topleft corner of container to middle
    player1Root.x = (canvasWidth - player1Root.width) / 2;
    player1Root.y = (canvasHeight - player1Root.height) / 2;
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
 */
