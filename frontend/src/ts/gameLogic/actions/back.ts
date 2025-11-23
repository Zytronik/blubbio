import { useGameStore } from "@/stores/gameStore";

let isHoldingBack = false;
let startedHoldingAt = Infinity;
const holdDuration = 2000;
export function holdBackToQuitGame(): void {
    if (isHoldingBack) {
        //TODO show animation
        if (performance.now() - startedHoldingAt > holdDuration) {
            useGameStore().cancelGame()
            //TODO go back 
            isHoldingBack = false;
            startedHoldingAt = Infinity;
        }
    }
}

export function buttonBackDown(): void {
    isHoldingBack = true;
    startedHoldingAt = performance.now();
}

export function buttonBackUp(): void {
    isHoldingBack = false;
    startedHoldingAt = Infinity;
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