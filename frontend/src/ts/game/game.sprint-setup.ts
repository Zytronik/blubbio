import { disableChannelInput as disableHubInput, enableResetInput } from "../input/input.input-manager";
import { createNewMatch } from "./game.data";
import { MatchSetupData } from "./match/game.i.match-setup-data";
import { getNextSeed } from "./logic/game.logic.random";
import { getSprintSettings } from "./settings/game.settings.sprint";
import { GAME_MODE } from "./settings/i/game.settings.e.game-modes";

export function createSprintGame(): void {
    const setupData: MatchSetupData = {
        matchID: "",
        playerData: [],
        gameMode: GAME_MODE.SPRINT,
        firstTo: 0,
        initialSeed: getNextSeed(Date.now()),
        countDownDuration: 0,
        gameSettings: getSprintSettings(),
        gameEvents: {
            onGameStart: onSprintStart,
            onGameQuit: onSprintQuit,
            onGameReset: onSprintReset,
            onGameVictory: onSprintVictory,
            onGameDefeat: onGameDefeat,
            onGarbageSend: onSprintGarbageSend,
        }
    }
    createNewMatch(setupData);
}

function onSprintStart(): void {
    enableResetInput();
    disableHubInput();
    startAnimationLoop();
    fillAsciiStrings(playerGameInstance, playerGameVisuals.asciiBoard);
    resetStatDisplays(playerGameVisuals.statNumbers);
    startCountdownAnimation(playerGameInstance.gameSettings.countDownDuration, afterCountdown)
}
function onSprintQuit(): void {
    disableResetInput();
    enableChannelInput();
    disableGameplay();
    network_leaveGame();
}
function onSprintReset(): void {
    disableGameplay();
    resetGameInstance(playerGameInstance, getNextSeed(Date.now()));
    network_resetGame(playerGameInstance.initialSeed);
    showCountDownAndStart();
}
function onSprintVictory(): void {
    playerGameInstance.gameState = GAME_STATE.VICTORY_SCREEN;
    disableGameplay();
    eventBus.emit("sprintVictory");
}
function onGameDefeat(): void {
    playerGameInstance.gameState = GAME_STATE.DEFEAT_SCREEN;
    disableGameplay();
}
function onSprintGarbageSend(): void {
    //do nothing
}