import state from "../../networking/networking.client-websocket";
import { httpClient } from "../../networking/networking.http-client";
import { GameStats } from "../i/game.i.game-stats";
import eventBus from "@/ts/page/page.event-bus";
import { allMods } from "../settings/ref/game.settings.ref.all-mods";
import { GameInstance } from "../i/game.i.game-instance";
import { dto_GameSetup } from "./dto/game.network.dto.game-setup";
import { ToggleMod, MultiMod } from "../settings/ref/i/game.settings.ref.i.mod";

const registeredGameEvents: Set<string> = new Set();
export function network_setupGame(playerGameInstance: GameInstance): void {
    console.log("backendSetupGame");
    if (state.socket) {
        const networkData: dto_GameSetup = {
            gameMode: playerGameInstance.gameMode,
            gameSettings: playerGameInstance.gameSettings,
            handlingSettings: playerGameInstance.handlingSettings,
            seed: playerGameInstance.initialSeed,
        }
        state.socket.emit("setupGame", networkData);
    } else {
        console.error("ohno, something went wrong");
    }
}

export function network_synchronizeGame(gameInstance: GameInstance): void {
    if (state.socket) {
        const history = gameInstance.gameStateHistory.inputHistory;
        for (let i = 0; i < history.length; i++) {
            history[i].indexID = i;
        }
        const inputQueue = gameInstance.gameStateHistory.inputHistory.slice(0);
        state.socket.emit("queueUpGameInputs", inputQueue);
    }
}

function isMultiMod(mod: ToggleMod | MultiMod): mod is MultiMod {
    return 'modValues' in mod;
}

export async function submitGameToDB(gameStats: GameStats) {
    const isGuest = sessionStorage.getItem('isGuest');
    if (isGuest !== "true") {
        const submitStats = {
            "bubbleClearToWin": gameStats.bubbleClearToWin,
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
}

export function setupSocketListeners() {
    const receivedIndexAnswer = "queuedUpGameInputsReceivedAnswer";
    if (state.socket && !registeredGameEvents.has(receivedIndexAnswer)) {
        state.socket.on(receivedIndexAnswer, (data: number) => {
            console.log(receivedIndexAnswer, data);
        });
        registeredGameEvents.add(receivedIndexAnswer);
    }
}