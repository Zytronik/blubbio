import { convertSeedToRandomNumber, getNextSeed } from "./game.logic.random";
import { Bubble } from "./i/game.i.bubble";
import { GameInstance } from "./i/game.i.game-instance";
import { CYAN_BUBBLE_IDLE, GREEN_BUBBLE_IDLE, ORANGE_BUBBLE_IDLE, PURPLE_BUBBLE_IDLE, RED_BUBBLE_IDLE, WHITE_BUBBLE_IDLE, YELLOW_BUBBLE_IDLE } from "../visuals/sprite/game.visuals.sprite.bubble";

export function holdBubble(gameInstance: GameInstance): void {
    if (!gameInstance.holdBubble) {
        const randomIndex = convertSeedToRandomNumber(0, allBubbles.length, gameInstance.bubbleSeed);
        gameInstance.bubbleSeed = getNextSeed(gameInstance.bubbleSeed);
        gameInstance.bubbleQueue.push(allBubbles[randomIndex]);
        gameInstance.holdBubble = gameInstance.currentBubble;
        gameInstance.currentBubble = gameInstance.bubbleQueue.shift() as Bubble;
    } else {
        const temp = gameInstance.currentBubble;
        gameInstance.currentBubble = gameInstance.holdBubble as Bubble;
        gameInstance.holdBubble = temp;
    }
}

export function updateBubbleQueueAndCurrent(gameInstance: GameInstance): void {
    const queueLength = gameInstance.gameSettings.queuePreviewSize;
    while (gameInstance.bubbleQueue.length <= queueLength) {
        gameInstance.bubbleQueue.push(...getBubbleBag(gameInstance));
    }
    gameInstance.currentBubble = gameInstance.bubbleQueue.shift() as Bubble;
}

function getBubbleBag(gameInstance: GameInstance): Bubble[] {
    const bagSize = gameInstance.gameSettings.bubbleBagSize;
    const bag: Bubble[] = [];
    const leftOverBubbles = [...allBubbles];
    while (bag.length < bagSize) {
        if (leftOverBubbles.length === 0) {
            leftOverBubbles.push(...allBubbles);
        }
        const randomIndex = convertSeedToRandomNumber(0, leftOverBubbles.length, gameInstance.bubbleSeed);
        gameInstance.bubbleSeed = getNextSeed(gameInstance.bubbleSeed);
        bag.push(leftOverBubbles.splice(randomIndex, 1)[0]);
    }
    return bag;
}


const red: Bubble = {
    ascii: `<span style="color: rgb(255, 0, 0);">R</span>`,
    type: 0,
    spriteIdle: RED_BUBBLE_IDLE,
}
const orange: Bubble = {
    ascii: `<span style="color: rgb(255, 174, 0);">O</span>`,
    type: 1,
    spriteIdle: ORANGE_BUBBLE_IDLE,
}
const yellow: Bubble = {
    ascii: `<span style="color: rgb(255, 255, 0);">Y</span>`,
    type: 2,
    spriteIdle: YELLOW_BUBBLE_IDLE,
}
const green: Bubble = {
    ascii: `<span style="color: rgb(123, 255, 0);">G</span>`,
    type: 3,
    spriteIdle: GREEN_BUBBLE_IDLE,
}
const cyan: Bubble = {
    ascii: `<span style="color: rgb(0, 255, 255);">B</span>`,
    type: 4,
    spriteIdle: CYAN_BUBBLE_IDLE,
}
const purple: Bubble = {
    ascii: `<span style="color: rgb(255, 0, 255);">P</span>`,
    type: 5,
    spriteIdle: PURPLE_BUBBLE_IDLE,
}
const white: Bubble = {
    ascii: `<span style="color: rgb(255, 255, 255);">W</span>`,
    type: 6,
    spriteIdle: WHITE_BUBBLE_IDLE,
}
export const allBubbles: Bubble[] = [
    red,
    orange,
    yellow,
    green,
    cyan,
    purple,
    white,
]
