import { GameInstance } from '@/ts/_interface/game/gameInstance';
import { SPRINT_SETTINGS } from '../settings/sprintSettings';
import { HANDLING_SETTINGS } from '../settings/handlingSettings';
import { getEmptyStats } from './statsSetup';
import { getEmptyGrid } from './gridSetup';
import { getGameSprites } from '../../pixi/assetFactory/gameSpritesBuilder';
import { allBubbles } from '../bubble/bubbleTypes';
import { nextBubble } from '../bubble/queue';
import { XORRandom } from '../rng';
import { getEmptyGarbagePreview } from './garbageSetup';
import { prefillBoard } from '../bubble/garbage';
import { usePixiStore } from '@/stores/pixiStore';

export function newSprintInstance(playerName: string): GameInstance {
    const startBubbleSeed = { value: Date.now() };
    const startGarbageSeed = { value: Date.now() + 123456789 };
    const sprites = getGameSprites(SPRINT_SETTINGS);
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
        stats: getEmptyStats(SPRINT_SETTINGS),
        left: false,
        right: false,
        aps: HANDLING_SETTINGS.defaultAPS,
        backPressed: false,
        backPressedAt: Infinity,
        gameSprites: sprites,
        gameSubContainers: usePixiStore().createGameSubContainers(),
    };
    XORRandom(0, 0, instance.bubbleSeed);
    XORRandom(0, 0, instance.garbageSeed);
    nextBubble(instance);
    prefillBoard(instance);
    usePixiStore().displayInstance(instance);
    return instance;
}
