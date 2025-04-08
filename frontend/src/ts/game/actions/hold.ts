import { GameInstance } from "@/ts/_interface/game/gameInstance";
import { convertSeedToRandomNumber, getNextSeed } from "../rng";
import { Bubble } from "@/ts/_interface/game/bubble";
import { allBubbles } from "../bubble/bubbleTypes";

export function swapHoldBubble(instance: GameInstance): void {
    if (!instance.holdBubble) {
        const randomIndex = convertSeedToRandomNumber(0, allBubbles.length, instance.bubbleSeed);
        instance.bubbleSeed = getNextSeed(instance.bubbleSeed);
        instance.bubbleQueue.push(allBubbles[randomIndex]);
        instance.holdBubble = instance.currentBubble;
        instance.currentBubble = instance.bubbleQueue.shift() as Bubble;
    } else {
        const temp = instance.currentBubble;
        instance.currentBubble = instance.holdBubble as Bubble;
        instance.holdBubble = temp;
    }
}
