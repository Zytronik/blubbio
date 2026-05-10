import { useAnimationStore } from "@/stores/animationStore";
import { useGameStore } from "@/stores/gameStore";
import { backAnimiation } from "@/ts/animationPixi/backAnimiation";

let isHoldingBack = false;
let startedHoldingAt = Infinity;
const holdDuration = 1000;

export function holdBackToQuitGame(): void {
    if (isHoldingBack) {
        if (performance.now() - startedHoldingAt > holdDuration) {
            useGameStore().cancelGame()
            isHoldingBack = false;
            startedHoldingAt = Infinity;
        }
    }
}

export function buttonBackDown(): void {
    isHoldingBack = true;
    startedHoldingAt = performance.now();
    backAnimiation(holdDuration);
}

export function buttonBackUp(): void {
    isHoldingBack = false;
    startedHoldingAt = Infinity;
    useAnimationStore().stopGlobalAnimation('backAnimiation');
}

/*
back
clean up animations
containers
hold to get out
animation data
is this an animation?


reset
reset data only, keep visuals
what about spectators?
*/