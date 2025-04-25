import { GameInstance } from "@/ts/_interface/game/gameInstance";
import { SPRINT_SETTINGS } from "../settings/sprintSettings";
import { HANDLING_SETTINGS } from "../settings/handlingSettings";
import { getEmptyStats } from "./statsSetup";
import { getEmptyGrid } from "./gridSetup";
import { addAngleUpdateAnimation } from "@/ts/animationPixi/angleAnimation";
import { addBoardBubblesAnimation } from "@/ts/animationPixi/boardBubblesAnimation";
import { getAllGameSprites } from "./spriteSetup";
import { createGameInstanceContainer } from "@/ts/pixi/container";
import { allBubbles } from "../bubble/bubbleTypes";
import { nextBubble } from "../bubble/queue";
import { prefillBoard } from "../bubble/garbage";
import { XORRandom } from "../rng";

export function newSprintInstance(): GameInstance {
    const startBubbleSeed = {value: Date.now()}
    const startGarbageSeed = {value: Date.now() + 123456789}
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
    XORRandom(0,0,instance.bubbleSeed);
    XORRandom(0,0,instance.garbageSeed);
    nextBubble(instance);
    prefillBoard(instance);

    addAngleUpdateAnimation(instance);

    //TODO REFACTOR
    addBoardBubblesAnimation(instance);
    return instance;
}