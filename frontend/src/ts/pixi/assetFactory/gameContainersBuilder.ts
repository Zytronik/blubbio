import { useContainerStore } from '@/stores/containerStore';
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

    useContainerStore().getGameContainer().addChild(boardContainer);
    boardContainer.addChild(gridContainer);
    boardContainer.addChild(gridBackground);
    boardContainer.addChild(queueContainer);
    boardContainer.addChild(garbageContainer);
    gridContainer.addChild(arrowContainer);
    boardContainer.addChild(holdContainer);

    const visuals: GameSubContainers = {
        boardContainer: boardContainer,
        gridContainer: gridContainer,
        gridBackground: gridBackground,
        queueContainer: queueContainer,
        arrowContainer: arrowContainer,
        garbageContainer: garbageContainer,
        holdContainer: holdContainer,
    };

    const layoutProperties = useContainerStore().getLayoutProperties();
    drawBoardContainerLayoutRect(layoutProperties);
    drawGridContainerLayoutRect(layoutProperties);
    drawGridBackgroundContainerLayoutRect(layoutProperties);
    drawGarbageContainerLayoutRect(layoutProperties);
    drawQueueContainerLayoutRect(layoutProperties);
    drawHoldContainerLayoutRect(layoutProperties);
    drawArrowContainerLayoutRect(layoutProperties);

    return visuals;
}

function drawBoardContainerLayoutRect(layoutProperties: LayoutProperties): void {
    const boardContainer = visuals.boardContainer;
    const background = new Graphics().rect(0, 0, width, height).fill({ color: 'green' });
    background.label = 'boardContainerBackground';
    boardContainer.addChildAt(background, 0);
}

function drawGridContainerLayoutRect(layoutProperties: LayoutProperties): void {
    const gridContainer = visuals.gridContainer;
    gridContainer.zIndex = 1;

    gridContainer.x = visuals.paddingBoardLeft;
    gridContainer.y = visuals.paddingBoardTop;

    const height = getGridHeight(visuals);
    const width = getGridWidth(visuals);

    const background = new Graphics().rect(0, 0, width, height).fill({ color: 0x000000, alpha: 0.8 });
    gridContainer.addChild(background);
}

function drawGridBackgroundContainerLayoutRect(layoutProperties: LayoutProperties): void {
    const gridBackground = visuals.gridBackground;

    const paddingBoardLeft = getBoardPaddingLeft(visuals);
    const paddingBoardTop = getBoardPaddingTop(visuals);

    gridBackground.x = paddingBoardLeft;
    gridBackground.y = paddingBoardTop;

    const height = getGridHeight(visuals);
    const width = getGridWidth(visuals);

    const background = new Graphics().rect(0, 0, width, height).fill({ color: 'yellow' });
    gridBackground.addChild(background);
}

function drawGarbageContainerLayoutRect(layoutProperties: LayoutProperties): void {
    const garbageContainer = visuals.garbageContainer;

    const paddingBoardLeft = getBoardPaddingLeft(visuals);
    const paddingBoardTop = getBoardPaddingTop(visuals);

    garbageContainer.x = paddingBoardLeft;
    garbageContainer.y = 0;

    const width = getGridWidth(visuals);
    const height = paddingBoardTop;

    const background = new Graphics().rect(0, 0, width, height).fill({ color: 'white' });
    background.label = 'garbageContainerBackground';

    const bubbleSprites = visuals.sprites.garbageBubbles;

    garbageContainer.addChild(background);
    bubbleSprites.forEach(sprite => {
        garbageContainer.addChild(sprite);
    });
}

function drawQueueContainerLayoutRect(layoutProperties: LayoutProperties): void {
    const queueContainer = visuals.queueContainer;

    const paddingBoardTop = getBoardPaddingTop(visuals);

    queueContainer.x = 0;
    queueContainer.y = paddingBoardTop;

    const width = getGridWidth(visuals) / visuals.gameSettings.gridWidth;
    const height = width * visuals.gameSettings.queuePreviewSize;

    const background = new Graphics().rect(0, 0, width, height).fill({ color: 'violet' });
    background.label = 'queueContainerBackground';
    queueContainer.addChild(background);
}

function drawHoldContainerLayoutRect(layoutProperties: LayoutProperties): void {
    const holdContainer = visuals.holdContainer;

    const paddingBoardLeft = getBoardPaddingLeft(visuals);
    const paddingBoardTop = getBoardPaddingTop(visuals);

    holdContainer.x = getGridWidth(visuals) + paddingBoardLeft;
    holdContainer.y = paddingBoardTop;

    const width = getGridWidth(visuals) / visuals.gameSettings.gridWidth;
    const height = width;

    const background = new Graphics().rect(0, 0, width, height).fill({ color: 'black' });
    background.label = 'holdContainerBackground';
    holdContainer.addChild(background);
}

function drawArrowContainerLayoutRect(layoutProperties: LayoutProperties): void {
    const { sprites } = visuals;
    const arrowContainer = visuals.arrowContainer;
    const arrow = sprites.arrow;
    const currentBubble = sprites.currentBubble;

    const width = getGridWidth(visuals) / visuals.gameSettings.gridWidth;
    const height = width;

    arrowContainer.zIndex = 1;
    arrowContainer.pivot.set(width / 2, height / 2);

    arrow.label = 'arrow';
    currentBubble.label = 'currentBubble';

    arrowContainer.width = width;
    arrowContainer.height = height;

    arrow.height = height;
    arrow.width = width;

    currentBubble.width = width;
    currentBubble.height = height;

    arrowContainer.addChild(currentBubble);
    arrowContainer.addChild(arrow);
}

/*
function getGridWidth(visuals: GameSubContainers): number {
    return visuals.boardContainer.width - getBoardPaddingLeft(visuals) - getBoardPaddingRight(visuals);
}

function getGridHeight(visuals: GameSubContainers): number {
    return visuals.boardContainer.height - getBoardPaddingTop(visuals);
}


function getBoardPaddingLeft(visuals: GameSubContainers): number {
    return (visuals.boardContainer.width / (1 + visuals.paddingBoardLeft + visuals.paddingBoardLeft)) * visuals.paddingBoardLeft;
}

function getBoardPaddingRight(visuals: GameSubContainers): number {
    return (visuals.boardContainer.width / (1 + visuals.paddingBoardLeft + visuals.paddingBoardRight)) * visuals.paddingBoardRight;
}

function getBoardPaddingTop(visuals: GameSubContainers): number {
    return (visuals.boardContainer.height / (1 + visuals.paddingBoardTop)) * visuals.paddingBoardTop;
}
*/
