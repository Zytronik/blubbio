import { Game } from "../_interface/game/game";
import { angleUpdate } from "./actions/aiming";
import { timeStatsUpdate } from "./timeStats";

let gameLoopRunning = false;
let lastTick = 0;
export function startGameLogicLoop(game: Game): void {
    if (!gameLoopRunning) {
        gameLoopRunning = true;
        lastTick = 0;
        gameLoop(game);
    }
}

export function stopGameLogicLoop(): void {
    gameLoopRunning = false;
}

function gameLoop(game: Game): void {
    if (gameLoopRunning) {
        const now = performance.now()
        if (lastTick === 0) {
            lastTick = now;
        } 
        const deltaTimeMS = now - lastTick;
        
        angleUpdate(game, deltaTimeMS);
        timeStatsUpdate(game, now);
        
        lastTick = performance.now()
        requestAnimationFrame(() => gameLoop(game));
    }
}
