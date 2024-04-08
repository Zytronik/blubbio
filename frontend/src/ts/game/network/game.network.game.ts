import state from "../../networking/networking.client-websocket";
import { httpClient } from "../../networking/networking.http-client";
import { GameStats } from "../i/game.i.game-stats";
import eventBus from "@/ts/page/page.event-bus";
import { allMods } from "../settings/ref/game.settings.ref.all-mods";
import { GameInstance } from "../i/game.i.game-instance";
import { dto_GameSetup } from "./dto/game.network.dto.game-setup";
import { ToggleMod, MultiMod } from "../settings/ref/i/game.settings.ref.i.mod";
import { GAME_STATE } from "../i/game.e.state";
import { dto_Inputs } from "./dto/game.network.dto.input";
import { dto_CountDown } from "./dto/game.network.dto.count-down";
import { GAME_MODE } from "../settings/i/game.settings.e.game-modes";

const I_QUEUE_INPUTS = "input_queueUpGameInputs";
const O_QUEUE_INPUTS = "output_highestInputIndexReceived";
const I_COUNT_DOWN_STATE = "I_COUNT_DOWN_STATE";

const I_SINGLEPLAYER_SETUP_GAME = "I_SINGLEPLAYER_SETUP_GAME";
const I_SINGLEPLAYER_RESET_GAME = "I_SINGLEPLAYER_RESET_GAME";
const I_SINGLEPLAYER_LEAVE_GAME = "I_SINGLEPLAYER_LEAVE_GAME";

const DO_LOG_ERROR = "debugOutput_logError";

const registeredGameEvents: Set<string> = new Set();
export function network_setupGame(playerGameInstance: GameInstance): void {
    if (state.socket) {
        const networkData: dto_GameSetup = {
            gameMode: playerGameInstance.gameMode,
            gameSettings: playerGameInstance.gameSettings,
            seed: playerGameInstance.initialSeed,
            matchID: "none",
        }
        state.socket.emit(I_SINGLEPLAYER_SETUP_GAME, networkData);
        network_listenToQueuedInputsIndex(playerGameInstance);
        registeredGameEvents.add(O_QUEUE_INPUTS);
    } else {
        console.error("network_setupGame()", "YOU DONT HAVE ANY SOCKETS!", "state.socket was null");
    }
}

export function network_listenToQueuedInputsIndex(playerGameInstance: GameInstance): void {
    if (state.socket && !registeredGameEvents.has(O_QUEUE_INPUTS)) {
        state.socket.on(O_QUEUE_INPUTS, (data: number) => {
            playerGameInstance.processedInputsIndex = data;
        });
        state.socket.on(DO_LOG_ERROR, (data) => {
            console.error("backend error: ", data);
        });
        registeredGameEvents.add(O_QUEUE_INPUTS);
    } else {
        console.error("network_listenToQueuedInputsIndex()", "YOU DONT HAVE ANY SOCKETS!", "state.socket was null");
    }
}

export function network_stopListenToQueuedInputsIndex(): void {
    if (state.socket && !registeredGameEvents.has(O_QUEUE_INPUTS)) {
        state.socket.off(O_QUEUE_INPUTS);
        state.socket.off(DO_LOG_ERROR);
        registeredGameEvents.delete(O_QUEUE_INPUTS);
    } else {
        console.error("network_stopListenToQueuedInputsIndex()", "YOU DONT HAVE ANY SOCKETS!", "state.socket was null");
    }
}


export function network_countDownState(matchID: string, gameMode: GAME_MODE, gameState: GAME_STATE): void {
    const countDownData: dto_CountDown = {
        matchID: matchID,
        gameMode: gameMode,
        countDown: gameState,
    };
    if (state.socket) {
        state.socket.emit(I_COUNT_DOWN_STATE, countDownData);
    } else {
        console.error("network_countDownState()", "YOU DONT HAVE ANY SOCKETS!", "state.socket was null");
    }
}

export function network_sendInputs(gameInstance: GameInstance): void {
    const inputdata: dto_Inputs = {
        gameMode: gameInstance.gameMode,
        matchID: gameInstance.matchID,
        inputs: [],
    };
    if (state.socket) {
        const history = gameInstance.gameStateHistory.inputHistory;
        for (let i = 0; i < history.length; i++) {
            history[i].indexID = i;
        }
        inputdata.inputs = gameInstance.gameStateHistory.inputHistory.slice(gameInstance.processedInputsIndex);
        state.socket.emit(I_QUEUE_INPUTS, inputdata);
    } else {
        console.error("network_sendInputs()", "YOU DONT HAVE ANY SOCKETS!", "state.socket was null");
    }
}

export function network_resetGame(seed: number): void {
    if (state.socket) {
        state.socket.emit(I_SINGLEPLAYER_RESET_GAME, seed);
    } else {
        console.error("network_resetGame()", "YOU DONT HAVE ANY SOCKETS!", "state.socket was null");
    }
}

export function network_leaveGame(): void {
    if (state.socket) {
        state.socket.emit(I_SINGLEPLAYER_LEAVE_GAME);
        network_stopListenToQueuedInputsIndex();
    } else {
        console.error("network_leaveGame()", "YOU DONT HAVE ANY SOCKETS!", "state.socket was null");
    }
}

export async function submitGameToDB(gameStats: GameStats) {
    const isGuest = sessionStorage.getItem('isGuest');
    if (isGuest !== "true") {
        const submitStats = {
            "bubbleClearToWin": gameStats.bubbleClearToWin,
            "bpsGraph": JSON.stringify(gameStats.bpsGraph),
            "clear3": gameStats.clear3,
            "clear4": gameStats.clear4,
            "clear5": gameStats.clear5,
            "clear3wb": gameStats.clear3wb,
            "clear4wb": gameStats.clear4wb,
            "clear5wb": gameStats.clear5wb,
            "bubblesCleared": gameStats.bubblesCleared,
            "bubblesShot": gameStats.bubblesShot,
            "bubblesPerSecond": gameStats.bubblesPerSecond,
            "gameDuration": Math.floor(gameStats.gameDuration),
            "highestBubbleClear": gameStats.highestBubbleClear,
            "wallBounces": gameStats.wallBounces,
            "wallBounceClears": gameStats.wallBounceClears,
            "highestCombo": gameStats.highestCombo,
            "keysPressed": gameStats.keysPressed,
            "keysPerSecond": gameStats.keysPerSecond,
            "keysPerBubble": gameStats.keysPerBubble,
            "angleChanged": gameStats.angleChanged,
            "angleChangePerBubble": gameStats.angleChangePerBubble,
            "holds": gameStats.holds
        };
        const convertedMods = allMods.map(mod => {
            if (isMultiMod(mod)) {
                return {
                    abr: mod.abr[mod.modValues.indexOf(mod.selected)],
                    type: 'multi'
                };
            } else {
                return {
                    abr: mod.abr,
                    type: 'toggle',
                    enabled: mod.enabled
                };
            }
        });
        const modsJsonString = JSON.stringify(convertedMods);
        try {
            const token = localStorage.getItem('authToken');
            await httpClient.post('/sprint/submit', { submitStats, mods: modsJsonString }, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });
            eventBus.emit('show-info-message', { message: 'Sprint submitted successfully.', type: 'success' });
        } catch (error) {
            eventBus.emit('show-info-message', { message: 'There was an error submitting your Sprint.', type: 'error' });
        }
    }

    function isMultiMod(mod: ToggleMod | MultiMod): mod is MultiMod {
        return 'modValues' in mod;
    }
}