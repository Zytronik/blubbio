import { useGameStore } from '@/stores/gameStore';
import { GameInstance } from '@/ts/_interface/game/gameInstance';

export function applyGameLayout(gameInstances: GameInstance[]) {
    const layoutProperties = useGameStore().getLayoutProperties();
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
    const gameContainer = gameInstance.gameSubContainers.boardContainer.parent;
    const board = gameInstance.gameSubContainers.boardContainer;

    const relativeX = (gameContainer.width - board.width) / 2;
    const relativeY = (gameContainer.height - board.height) / 2;

    board.x = relativeX;
    board.y = relativeY;
}

function draw1VS1Layout(playerLeft: GameInstance, playerRight: GameInstance): void {
    const gameContainer = playerLeft.gameSubContainers.boardContainer.parent;

    const boardLeft = playerLeft.gameSubContainers.boardContainer;
    const boardRight = playerRight.gameSubContainers.boardContainer;

    const relativeY = (gameContainer.height - boardLeft.height) / 2;

    const relativeXLeft = gameContainer.width * 0.25 - boardLeft.width / 2;
    boardLeft.x = relativeXLeft;
    boardLeft.y = relativeY;

    const relativeXRight = gameContainer.width * 0.75 - boardRight.width / 2;
    boardRight.x = relativeXRight;
    boardRight.y = relativeY;
}

function drawMultiLayout(instances: GameInstance[]): void {
    const gameContainer = instances[0].gameSubContainers.boardContainer.parent;
    const mainBoard = instances[0].gameSubContainers.boardContainer;
    if (instances.length < 3) return;

    const layoutProperties = useGameStore().getLayoutProperties();
    const aspectRatio = layoutProperties.precisionAspectRatio;
    const gridPadding = layoutProperties.multiLayoutGridPadding;

    const mainX = (gameContainer.width * 0.5 - mainBoard.width) / 2;
    const mainY = (gameContainer.height - mainBoard.height) / 2;

    mainBoard.x = mainX;
    mainBoard.y = mainY;

    const remainingBoards = instances.slice(1);
    const gridCount = remainingBoards.length;
    const gridSize = Math.ceil(Math.sqrt(gridCount));

    const rightAvailableWidth = gameContainer.width / 2;
    const rightAvailableHeight = mainBoard.height;

    const cellHeight =
        (rightAvailableHeight - gridPadding * (gridSize - 1)) / gridSize;
    const paddingBoardTopGrid = cellHeight * layoutProperties.paddingBoardTop;
    const gridBoardWidthNoPadding = (cellHeight - paddingBoardTopGrid) * aspectRatio;
    const paddingBoardLeftGrid = gridBoardWidthNoPadding * layoutProperties.paddingBoardLeft;
    const paddingBoardRightGrid = gridBoardWidthNoPadding * layoutProperties.paddingBoardRight;
    const cellWidth = gridBoardWidthNoPadding + paddingBoardLeftGrid + paddingBoardRightGrid;

    const totalGridWidth = gridSize * cellWidth + (gridSize - 1) * gridPadding;
    const offsetX =
        gameContainer.width / 2 +
        (rightAvailableWidth - totalGridWidth) / 2;
    const offsetY = mainY;

    for (let i = 0; i < gridCount; i++) {
        const board = remainingBoards[i].gameSubContainers;
        const gridX = i % gridSize;
        const gridY = Math.floor(i / gridSize);

        const scaleGrid = cellHeight / board.boardContainer.height;
        board.boardContainer.scale.set(scaleGrid);

        const scaledWidth = board.boardContainer.width * scaleGrid;
        const scaledHeight = board.boardContainer.height * scaleGrid;

        const cellX = offsetX + gridX * (cellWidth + gridPadding);
        const cellY = offsetY + gridY * (cellHeight + gridPadding);

        board.boardContainer.x = cellX + (cellWidth - scaledWidth) / 2;
        board.boardContainer.y = cellY + (cellHeight - scaledHeight) / 2;
    }
}


