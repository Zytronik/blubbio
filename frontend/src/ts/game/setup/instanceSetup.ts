import { GameInstance } from "@/ts/_interface/game/gameInstance";
import { SPRINT_SETTINGS } from "../settings/sprintSettings";
import { HANDLING_SETTINGS } from "../settings/handlingSettings";
import { getEmptyStats } from "./statsSetup";
import { getEmptyGrid } from "./bubbleSetup";
import { addAngleUpdateAnimation } from "@/ts/animationPixi/angleAnimation";
import { addBoardBubblesAnimation } from "@/ts/animationPixi/boardBubblesAnimation";
import { getAllGameSprites } from "./spriteSetup";
import { createGameInstanceContainer } from "@/ts/pixi/container";
import { getNextSeed } from "../rng";
import { allBubbles } from "../bubble/bubbleTypes";
import { nextBubble } from "../bubble/queue";
import { prefillBoard } from "../bubble/garbage";

export function newSprintInstance(): GameInstance {
    const startBubbleSeed = getNextSeed(Date.now());
    const startGarbageSeed = getNextSeed(Date.now() + 1234);
    const sprites = getAllGameSprites();
    const instance: GameInstance = {
        gameSettings: SPRINT_SETTINGS,
        handlingSettings: HANDLING_SETTINGS,
        bubbleSeed: startBubbleSeed,
        garbageSeed: startGarbageSeed,
        angle: 90,
        currentBubble: allBubbles[0],
        bubbleQueue: [],
        playGrid: getEmptyGrid(SPRINT_SETTINGS),
        queuedGarbage: {},
        stats: getEmptyStats(),
        left: false,
        right: false,
        aps: HANDLING_SETTINGS.defaultAPS,
        gameSprites: sprites,
        gameContainers: createGameInstanceContainer(sprites),
        instanceAnimations: [],
    };
    nextBubble(instance);
    prefillBoard(instance);

    addAngleUpdateAnimation(instance);

    //TODO REFACTOR
    addBoardBubblesAnimation(instance);
    return instance;
}