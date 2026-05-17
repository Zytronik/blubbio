import { Game } from "../_interface/game/game";
import { angleUpdate } from "./actions/aiming";
import { timeStatsUpdate } from "./timeStats";

let gameLoopRunning = false;
export function startGameLogicLoop(game: Game): void {
    if (!gameLoopRunning) {
        gameLoop(game);
        gameLoopRunning = true;
    }
}

let lastTick = 0;
function gameLoop(game: Game): void {
    const now = performance.now()
    if (lastTick === 0) {
        lastTick = now;
    } 
    const deltaTimeMS = now - lastTick;

    angleUpdate(game, deltaTimeMS);
    timeStatsUpdate(game, now);

    requestAnimationFrame(() => gameLoop(game));
    lastTick = performance.now()
}
