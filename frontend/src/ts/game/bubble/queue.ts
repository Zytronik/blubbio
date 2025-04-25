import { GameInstance } from "@/ts/_interface/game/gameInstance";
import { Bubble } from "../../_interface/game/bubble";
import { XORRandom } from "../rng";
import { allBubbles } from "./bubbleTypes";

export function nextBubble(gameInstance: GameInstance): void {
    const queueLength = gameInstance.gameSettings.queuePreviewSize;
    while (gameInstance.bubbleQueue.length <= queueLength) {
        gameInstance.bubbleQueue.push(...getBubbleBag(gameInstance));
    }
    gameInstance.currentBubble = gameInstance.bubbleQueue.shift() as Bubble;
}

function getBubbleBag(instance: GameInstance): Bubble[] {
    const bagSize = instance.gameSettings.bubbleBagSize;
    const bag: Bubble[] = [];
    const leftOverBubbles = [...allBubbles];
    while (bag.length < bagSize) {
        if (leftOverBubbles.length === 0) {
            leftOverBubbles.push(...allBubbles);
        }
        const randomIndex = XORRandom(0, leftOverBubbles.length-1, instance.bubbleSeed);
        bag.push(leftOverBubbles.splice(randomIndex, 1)[0]);
    }
    return bag;
}