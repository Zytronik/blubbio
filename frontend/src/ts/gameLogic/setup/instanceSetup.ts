import { GameInstance } from '@/ts/_interface/game/gameInstance';
import { SPRINT_SETTINGS } from '../settings/sprintSettings';
import { HANDLING_SETTINGS } from '../settings/handlingSettings';
import { getEmptyStats } from './statsSetup';
import { getEmptyGrid } from './gridSetup';
import { getAllGameSprites } from '../../pixi/assetFactory/gameSpritesBuilder';
import { allBubbles } from '../bubble/bubbleTypes';
import { nextBubble } from '../bubble/queue';
import { XORRandom } from '../rng';
import { getEmptyGarbagePreview } from './garbageSetup';
import { prefillBoard } from '../bubble/garbage';
import { PixiAnimation } from '@/ts/_interface/pixi/pixiAnimation';
import { getGameSubContainers } from '@/ts/pixi/assetFactory/gameContainersBuilder';
import { renderQueueBubbles } from '@/ts/animationPixi/queueBubblesAnimation';
import { renderHoldBubble } from '@/ts/animationPixi/holdBubbleAnimation';
import { renderBoard } from '@/ts/animationPixi/boardAnimation';
import { renderArrowUpdate } from '@/ts/animationPixi/arrowAnimation';
import { addUsernameAnimation } from '@/ts/animationPixi/addUsernameAnimation';
import { statsAnimation } from '@/ts/animationPixi/statsAnimation';

export function newSprintInstance(playerName: string): GameInstance {
    const startBubbleSeed = { value: Date.now() };
    const startGarbageSeed = { value: Date.now() + 123456789 };
    const sprites = getAllGameSprites(SPRINT_SETTINGS);
    const instance: GameInstance = {
        playerName,
        gameSettings: SPRINT_SETTINGS,
        handlingSettings: HANDLING_SETTINGS,
        bubbleSeed: startBubbleSeed,
        garbageSeed: startGarbageSeed,
        angle: 90,
        currentBubble: allBubbles[0],
        bubblePreview: {
            tint: '',
            gridLocation: { x: 0, y: 0 },
            travelLineCoords: [],
        },
        bubbleQueue: [],
        playGrid: getEmptyGrid(SPRINT_SETTINGS),
        garbagePreview: getEmptyGarbagePreview(SPRINT_SETTINGS),
        stats: getEmptyStats(),
        left: false,
        right: false,
        aps: HANDLING_SETTINGS.defaultAPS,
        gameSprites: sprites,
        gameSubContainers: getGameSubContainers(),
        instanceAnimations: new Map<string, PixiAnimation>(),
    };
    XORRandom(0, 0, instance.bubbleSeed);
    XORRandom(0, 0, instance.garbageSeed);
    nextBubble(instance);
    prefillBoard(instance);
    startGameplayAnimations(instance);

    return instance;
}

function startGameplayAnimations(instance: GameInstance): void {
    renderQueueBubbles(instance);
    renderHoldBubble(instance);
    renderBoard(instance);
    renderArrowUpdate(instance);
    addUsernameAnimation(instance);
    statsAnimation(instance);
}
