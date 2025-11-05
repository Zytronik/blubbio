import { usePixiStore } from '@/stores/pixiStore';
import { AllContainers } from '@/ts/_interface/pixi/allContainers';
import { Container, Graphics } from 'pixi.js';

export function getGlobalContainer(): AllContainers {
    const main = new Container();
    const game = new Container();
    const countDown = new Container();

    usePixiStore().getPixiApp().stage.addChild(main);
    main.addChild(game);
    main.addChild(countDown);

    drawMainContainerLayoutRect(main);
    drawGameContainerLayoutRect(game);
    drawCountDownContainerLayoutRect(countDown);

    return {
        mainContainer: main,
        gameContainer: game,
        countDownContainer: countDown,
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

function drawGameContainerLayoutRect(gameContainer: Container): void {
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

function drawCountDownContainerLayoutRect(countDownContainer: Container): void {
    countDownContainer.zIndex = 1;

    countDownContainer.x = 0;
    countDownContainer.y = 0;

    const parent = countDownContainer.parent;

    const width = parent.width;
    const height = parent.height;
    const background = new Graphics().rect(0, 0, width, height).fill({ color: 0x000000, alpha: 0 });
    countDownContainer.addChild(background);
}
