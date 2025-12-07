import { usePixiStore } from '@/stores/pixiStore';
import { AllContainers } from '@/ts/_interface/pixi/allContainers';
import { Container, Graphics } from 'pixi.js';

export function getGlobalContainer(): AllContainers {
    const main = new Container();
    const game = new Container({ visible: false });
    const overlay = new Container({ visible: false });

    usePixiStore().getPixiApp().stage.addChild(main);
    main.addChild(game);
    main.addChild(overlay);

    drawMainContainerLayoutRect(main);
    drawGameContainerLayoutRect(game);
    drawOverlayContainerLayoutRect(overlay);

    return {
        mainContainer: main,
        gameContainer: game,
        overlayContainer: overlay,
    };
}

function drawMainContainerLayoutRect(mainContainer: Container): void {
    const padding = 20;
    const backgroundColor = 'red';

    mainContainer.x = padding;
    mainContainer.y = padding;

    const width = usePixiStore().getCanvasWidth() - padding * 2;
    const height = usePixiStore().getCanvasHeight() - padding * 2;

    const background = new Graphics().rect(0, 0, width, height).fill({ color: backgroundColor });

    mainContainer.addChildAt(background, 0);
}

export function drawGameContainerLayoutRect(gameContainer: Container): void {
    const parent = gameContainer.parent;
    const paddingX = 200;
    const paddingY = 20;

    gameContainer.x = paddingX;
    gameContainer.y = paddingY;

    const width = parent.width - paddingX * 2;
    const height = parent.height - paddingY * 2;

    const background = new Graphics().rect(0, 0, width, height).fill({ color: 'blue' });

    gameContainer.addChildAt(background, 0);
}

function drawOverlayContainerLayoutRect(overlayContainer: Container): void {
    overlayContainer.zIndex = 1;

    overlayContainer.x = 0;
    overlayContainer.y = 0;

    const parent = overlayContainer.parent;

    const width = parent.width;
    const height = parent.height;
    const background = new Graphics().rect(0, 0, width, height).fill({ color: 0x000000, alpha: 0 });
    overlayContainer.addChild(background);
}
