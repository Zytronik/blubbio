import { useContainerStore } from '@/stores/containerStore';
import { useGameStore } from '@/stores/gameStore';
import { GameSubContainers } from '@/ts/_interface/pixi/boardVisuals';
import { LayoutProperties } from '@/ts/_interface/pixi/layoutProperties';
import { Container, Graphics } from 'pixi.js';

export function getGameSubContainers(): GameSubContainers {
    const boardContainer = new Container();
    const gridContainer = new Container();
    const gridBackground = new Container();
    const queueContainer = new Container();
    const arrowContainer = new Container();
    const garbageContainer = new Container();
    const holdContainer = new Container();
    const statsContainer = new Container();
    const nameContainer = new Container();

    const gameContainer = useContainerStore().getGameContainer();
    gameContainer.addChild(boardContainer);
    boardContainer.addChild(statsContainer);

    boardContainer.addChild(gridContainer);
    boardContainer.addChild(gridBackground);
    boardContainer.addChild(queueContainer);
    boardContainer.addChild(garbageContainer);
    gridContainer.addChild(arrowContainer);
    boardContainer.addChild(holdContainer);
    boardContainer.addChild(nameContainer);

    const visuals: GameSubContainers = {
        boardContainer: boardContainer,
        gridContainer: gridContainer,
        gridBackground: gridBackground,
        queueContainer: queueContainer,
        arrowContainer: arrowContainer,
        garbageContainer: garbageContainer,
        holdContainer: holdContainer,
        statsContainer: statsContainer,
        nameContainer: nameContainer,
    };

    const layoutProperties = useGameStore().getLayoutProperties();
    drawBoardContainerLayoutRect(layoutProperties, boardContainer);
    drawGridContainerLayoutRect(layoutProperties, gridContainer);
    drawGridBackgroundContainerLayoutRect(layoutProperties, gridBackground);
    drawGarbageContainerLayoutRect(layoutProperties, garbageContainer);
    drawQueueContainerLayoutRect(layoutProperties, queueContainer);
    drawHoldContainerLayoutRect(layoutProperties, holdContainer);
    drawArrowContainerLayoutRect(layoutProperties, arrowContainer);

    const boadContainerWidth = boardContainer.width; // save the width before changing it because of overflow containers
    const boardContainerHeight = boardContainer.height; // save the height before changing it because of overflow containers

    //overflow containers
    drawStatsContainerLayoutRect(layoutProperties, statsContainer);
    drawNameContainerLayoutRect(layoutProperties, nameContainer, boadContainerWidth);

    return visuals;
}

function drawStatsContainerLayoutRect(layoutProperties: LayoutProperties, statsContainer: Container): void {
    const boardContainer = statsContainer.parent as Container;
    const paddingBoardLeft = getBoardPaddingLeft(boardContainer, layoutProperties);
    statsContainer.x = - boardContainer.width / 3 - paddingBoardLeft / 2;
    statsContainer.y = boardContainer.height / 2;
    const width = boardContainer.width / 3;
    const height = boardContainer.height / 2
    const background = new Graphics().rect(0, 0, width, height).fill({ color: 'yellow' });
    background.label = 'statsContainerBackground';
    statsContainer.addChild(background);
}

function drawNameContainerLayoutRect(layoutProperties: LayoutProperties, nameContainer: Container, boardContainerWidth: number): void {
    const boardContainer = nameContainer.parent as Container;
    const paddingBoardTop = getBoardPaddingTop(boardContainer, layoutProperties);
    nameContainer.x = 0;
    nameContainer.y = boardContainer.height + paddingBoardTop / 2;
    const width = boardContainerWidth;
    const height = paddingBoardTop;
    const background = new Graphics().rect(0, 0, width, height).fill({ color: 'yellow' });
    background.label = 'nameContainerBackground';
    nameContainer.addChild(background);
}

function drawBoardContainerLayoutRect(layoutProperties: LayoutProperties, boardContainer: Container): void {
    const gameContainer = boardContainer.parent;
    const boardHeight = gameContainer.height * layoutProperties.maxHeightPercent;
    const paddingBoardTop = boardHeight * layoutProperties.paddingBoardTop;
    const boardWidthNoPadding = (boardHeight - paddingBoardTop) * layoutProperties.precisionAspectRatio;
    const paddingBoardLeft = boardWidthNoPadding * layoutProperties.paddingBoardLeft;
    const paddingBoardRight = boardWidthNoPadding * layoutProperties.paddingBoardRight;

    const boardWidth = boardWidthNoPadding + paddingBoardLeft + paddingBoardRight;
    const background = new Graphics().rect(0, 0, boardWidth, boardHeight).fill({ color: 'green' });
    background.label = 'boardContainerBackground';
    boardContainer.addChildAt(background, 0);
}

function drawGridContainerLayoutRect(layoutProperties: LayoutProperties, gridContainer: Container): void {
    const boardContainer = gridContainer.parent as Container;
    const paddingBoardLeft = getBoardPaddingLeft(boardContainer, layoutProperties);
    const paddingBoardTop = getBoardPaddingTop(boardContainer, layoutProperties);
    gridContainer.zIndex = 1;

    gridContainer.x = paddingBoardLeft;
    gridContainer.y = paddingBoardTop;

    const height = getGridHeight(boardContainer, layoutProperties);
    const width = getGridWidth(boardContainer, layoutProperties);

    const background = new Graphics().rect(0, 0, width, height).fill({ color: 0x000000, alpha: 0.8 });
    gridContainer.addChild(background);
}

function drawGridBackgroundContainerLayoutRect(layoutProperties: LayoutProperties, gridBackground: Container): void {
    const boardContainer = gridBackground.parent as Container;
    const paddingBoardLeft = getBoardPaddingLeft(boardContainer, layoutProperties);
    const paddingBoardTop = getBoardPaddingTop(boardContainer, layoutProperties);

    gridBackground.x = paddingBoardLeft;
    gridBackground.y = paddingBoardTop;

    const height = getGridHeight(boardContainer, layoutProperties);
    const width = getGridWidth(boardContainer, layoutProperties);

    const background = new Graphics().rect(0, 0, width, height).fill({ color: 'yellow' });
    gridBackground.addChild(background);
}

function drawGarbageContainerLayoutRect(layoutProperties: LayoutProperties, garbageContainer: Container): void {
    const boardContainer = garbageContainer.parent as Container;
    const paddingBoardLeft = getBoardPaddingLeft(boardContainer, layoutProperties);
    const paddingBoardTop = getBoardPaddingTop(boardContainer, layoutProperties);

    garbageContainer.x = paddingBoardLeft;
    garbageContainer.y = 0;

    const width = getGridWidth(boardContainer, layoutProperties);
    const height = paddingBoardTop;

    const background = new Graphics().rect(0, 0, width, height).fill({ color: 'white' });
    background.label = 'garbageContainerBackground';

    garbageContainer.addChild(background);
}

function drawQueueContainerLayoutRect(layoutProperties: LayoutProperties, queueContainer: Container): void {
    const boardContainer = queueContainer.parent as Container;
    const paddingBoardTop = getBoardPaddingTop(boardContainer, layoutProperties);

    queueContainer.x = 0;
    queueContainer.y = paddingBoardTop;

    const width = getBoardPaddingLeft(boardContainer, layoutProperties);
    const height = width * layoutProperties.queuePreviewSize;

    const background = new Graphics().rect(0, 0, width, height).fill({ color: 'violet' });
    background.label = 'queueContainerBackground';
    queueContainer.addChild(background);
}

function drawHoldContainerLayoutRect(layoutProperties: LayoutProperties, holdContainer: Container): void {
    const boardContainer = holdContainer.parent as Container;
    const paddingBoardLeft = getBoardPaddingLeft(boardContainer, layoutProperties);
    const paddingBoardTop = getBoardPaddingTop(boardContainer, layoutProperties);

    holdContainer.x = getGridWidth(boardContainer, layoutProperties) + paddingBoardLeft;
    holdContainer.y = paddingBoardTop;

    const width = getBoardPaddingLeft(boardContainer, layoutProperties);
    const height = width;

    const background = new Graphics().rect(0, 0, width, height).fill({ color: 'black' });
    background.label = 'holdContainerBackground';
    holdContainer.addChild(background);
}

function drawArrowContainerLayoutRect(layoutProperties: LayoutProperties, arrowContainer: Container): void {
    const boardContainer = arrowContainer.parent.parent as Container;

    const width = getBoardPaddingLeft(boardContainer, layoutProperties);
    const height = width;

    arrowContainer.zIndex = 1;
    arrowContainer.pivot.set(width / 2, height / 2);

    arrowContainer.width = width;
    arrowContainer.height = height;

    const background = new Graphics().rect(0, 0, width, height).fill({ color: 'transparent' });
    background.label = 'arrowContainerBackground';
    arrowContainer.addChild(background);
}


function getGridWidth(boardContainer: Container, layoutProperties: LayoutProperties): number {
    return boardContainer.width - getBoardPaddingLeft(boardContainer, layoutProperties) - getBoardPaddingRight(boardContainer, layoutProperties);
}

function getGridHeight(boardContainer: Container, layoutProperties: LayoutProperties): number {
    return boardContainer.height - getBoardPaddingTop(boardContainer, layoutProperties);
}

function getBoardPaddingLeft(boardContainer: Container, layoutProperties: LayoutProperties): number {
    return (boardContainer.width / (1 + layoutProperties.paddingBoardLeft + layoutProperties.paddingBoardLeft)) * layoutProperties.paddingBoardLeft;
}

function getBoardPaddingRight(boardContainer: Container, layoutProperties: LayoutProperties): number {
    return (boardContainer.width / (1 + layoutProperties.paddingBoardLeft + layoutProperties.paddingBoardRight)) * layoutProperties.paddingBoardRight;
}

function getBoardPaddingTop(boardContainer: Container, layoutProperties: LayoutProperties): number {
    return (boardContainer.height / (1 + layoutProperties.paddingBoardTop)) * layoutProperties.paddingBoardTop;
}

