import { angleUpdate } from "./actions/aiming";
import { holdBackToQuitGame } from "./actions/back";

let gameLoopRunning = false;
export function startGameLogicLoop(): void {
    if (!gameLoopRunning) {
        gameLoop();
        gameLoopRunning = true;
    }
}

let lastTick = 0;
function gameLoop(): void {
    const now = performance.now()
    if (lastTick === 0) {
        lastTick = now;
    } 
    const deltaTimeMS = now - lastTick;

    angleUpdate(deltaTimeMS);
    holdBackToQuitGame()

    requestAnimationFrame(() => gameLoop());
    lastTick = performance.now()
}
