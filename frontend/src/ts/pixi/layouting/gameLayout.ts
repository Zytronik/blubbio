import { GameInstance } from "@/ts/_interface/game/gameInstance";

export function applyGameLayout(gameInstances: GameInstance[]) {
    const boardAmount = gameInstances.length;
    if (boardAmount === 1) {
        drawSoloLayout(gameInstances[0]);
    } else if (boardAmount === 2) {
        draw1VS1Layout(gameInstances[0], gameInstances[1]);
    } else if (boardAmount > 2) {
        drawMultiLayout(gameInstances);
    } else {
        return;
    }
}

function drawSoloLayout(gameInstance: GameInstance): void {
    const gameContainer = gameVisuals.gameContainer;
    const containers = gameInstance.gameSubContainers
    const board = containers.boardContainer;

    const aspectRatio = containers.precisionAspectRatio;
    const maxHeightPercent = 0.8;

    const boardHeight = gameContainer.height * maxHeightPercent;
    const paddingBoardTop = boardHeight * PADDING_BOARD_TOP;
    const boardWidthNoPadding = (boardHeight - paddingBoardTop) * aspectRatio;
    const paddingBoardLeft = boardWidthNoPadding * PADDING_BOARD_LEFT;
    const paddingBoardRight = boardWidthNoPadding * PADDING_BOARD_RIGHT;

    const boardWidth = boardWidthNoPadding + paddingBoardLeft + paddingBoardRight;

    const relativeX = (gameContainer.width - boardWidth) / 2;
    const relativeY = (gameContainer.height - boardHeight) / 2;

    board.x = relativeX;
    board.y = relativeY;

    drawBoardContainer(containers, boardWidth, boardHeight);
}

function draw1VS1Layout(playerLeft: GameInstance, playerRight: GameInstance): void {
    const gameContainer = gameVisuals.gameContainer;

    const visualsLeft = gameVisuals.boardVisuals[0];
    const visualsRight = gameVisuals.boardVisuals[1];

    const aspectRatio = visualsLeft.precisionAspectRatio;
    const maxHeightPercent = 0.8;

    const boardHeight = gameContainer.height * maxHeightPercent;
    const paddingBoardTop = boardHeight * PADDING_BOARD_TOP;
    const boardWidthNoPadding = (boardHeight - paddingBoardTop) * aspectRatio;
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

function drawMultiLayout(instances: GameInstance): void {
    const gameContainer = gameVisuals.gameContainer;
    const boards = gameVisuals.boardVisuals;
    if (boards.length < 3) return;

    const padding = 20;
    const aspectRatio = boards[0].precisionAspectRatio;

    // Left board
    const mainBoardHeight = gameContainer.height * 0.8;
    const paddingBoardTop = mainBoardHeight * PADDING_BOARD_TOP;
    const mainBoardWidthNoPadding = (mainBoardHeight - paddingBoardTop) * aspectRatio;
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
    const paddingBoardTopGrid = gridBoardHeight * PADDING_BOARD_TOP;
    const gridBoardWidthNoPadding = (gridBoardHeight - paddingBoardTopGrid) * aspectRatio;
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