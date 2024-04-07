import eventBus from "@/ts/page/page.event-bus";
import state from "../../networking/networking.client-websocket";
import { dto_VersusScreen } from "./dto/game.network.dto.vs-screen";
import { dto_GameSetup } from "./dto/game.network.dto.game-setup";
import { disableGameplay, playerGameInstance, playerGameVisuals, preparePlayerGameInstance, rankedGameStart, startGame } from "../game.master";
import { createGameInstance } from "../logic/game.logic.instance-creator";
import { GameTransitions } from "../i/game.i.game-transitions";
import { getHandlingSettings } from "../settings/game.settings.handling";
import { disableBackInputs, disableChannelInput, disableResetInput } from "@/ts/input/input.input-manager";
import { fillAsciiStrings } from "../visuals/game.visuals.ascii";
import { GAME_STATE } from "../i/game.e.state";
import { network_listenToQueuedInputsIndex } from "./game.network.game";
import { dto_GameInstance } from "./dto/game.network.dto.game-instance";
import { GameVisuals, getEmptyGameVisuals } from "../visuals/i/game.visuals.i.game-visuals";
import { fillStatStrings } from "../visuals/game.visuals.stat-display";
import { dto_EndScreen } from "./dto/game.network.dto.end-screen";
import { dto_ScoreScreen } from "./dto/game.network.dto.score-screen";

const O_RANKED_MATCH_FOUND = "output_rankedMatchFound";
const O_RANKED_SETUP_GAME_INSTANCE = "output_rankedSetupGameInstance";
export const I_RANKED_SCREEN_TRANSITION_CONFIRMATION = "input_rankedScreenTransitionConfirmation";
const I_RANKED_SETUP_GAME_CONFIRMATION = "input_rankedSetupGameConfirmation";
const O_RANKED_GO_TO_GAME_VIEW = "output_rankedGoToGameView";
const I_RANKED_READY_TO_START_GAME = "input_rankedReadyToStartGame";
const O_RANKED_START_GAME = "output_rankedStartGame";
const O_RANKED_YOU_WON = "output_rankedYouWon";
const O_RANKED_SHOW_MATCH_SCORE = "output_rankedShowMatchScore";
const O_RANKED_PREPARE_NEXT_ROUND = "output_rankedPrepareNextRound";
const O_RANKED_SHOW_END_SCREEN = "output_rankedShowEndScreen";

const O_PLAYER_SPECTATOR = "update_playerSpectator";
const O_RECEIVE_GARBAGE = "output_receiveGarbage";
export const enemyVisuals: GameVisuals = getEmptyGameVisuals();
export const versusScreenData: dto_VersusScreen = {
    matchID: "",
    player1Data: {
        playerID: 0,
        playerName: "",
        playerRank: "",
        playerGlobalRank: 0,
        playerNationalRank: 0,
        playerGlicko: 0,
        playerRD: 0,
        playerProfilePicture: "",
        playerCountry: ""
    },
    player2Data: {
        playerID: 0,
        playerName: "",
        playerRank: "",
        playerGlobalRank: 0,
        playerNationalRank: 0,
        playerGlicko: 0,
        playerRD: 0,
        playerProfilePicture: "",
        playerCountry: ""
    },

};
export const scoreScreenData: dto_ScoreScreen = {
    matchID: "",
    firstTo: 0,
    player1Data: {
        playerID: 0,
        playerName: "",
        playerScore: 0
    },
    player2Data: {
        playerID: 0,
        playerName: "",
        playerScore: 0
    },
};
export const endScreenData: dto_EndScreen = {
    matchID: "",
    firstTo: 0,
    player1Data: {
        playerID: 0,
        playerName: "",
        playerScore: 0,
        hasWon: false,
        eloDiff: 0,
    },
    player2Data: {
        playerID: 0,
        playerName: "",
        playerScore: 0,
        hasWon: false,
        eloDiff: 0,
    }
};
export function network_listenToMatchFound(): void {
    const socket = state.socket;
    if (socket) {
        socket.on(O_RANKED_MATCH_FOUND, (data: dto_VersusScreen) => {
            disableResetInput();
            disableChannelInput();
            disableBackInputs();
            versusScreenData.matchID = data.matchID;
            versusScreenData.player1Data = data.player1Data;
            versusScreenData.player2Data = data.player2Data;
            eventBus.emit("vue_matchFound");
        });
        socket.on(O_RANKED_SETUP_GAME_INSTANCE, (data: dto_GameSetup) => {
            network_listenToQueuedInputsIndex(playerGameInstance);
            network_listenToIngameUpdates();
            setupGameInstance(data);
            socket.emit(I_RANKED_SETUP_GAME_CONFIRMATION, data.matchID);
        });
        socket.on(O_RANKED_GO_TO_GAME_VIEW, () => {
            eventBus.emit("vue_goToGameView");
            socket.emit(I_RANKED_READY_TO_START_GAME, playerGameInstance.matchID);
        });
        socket.on(O_RANKED_START_GAME, () => {
            startGame();
        });
    } else {
        console.error("YOU DONT HAVE ANY SOCKETS!");
    }
}

function network_listenToIngameUpdates(): void {
    const socket = state.socket;
    if (socket) {
        socket.on(O_PLAYER_SPECTATOR, (data: dto_GameInstance) => {
            fillAsciiStrings(data.gameInstance, enemyVisuals.asciiBoard);
            fillStatStrings(data.gameInstance, enemyVisuals.statNumbers);
            enemyVisuals.timeDifference = data.gameInstance.stats.gameDuration - performance.now();
        });
        socket.on(O_RECEIVE_GARBAGE, (data: number) => {
            playerGameInstance.queuedGarbage += data;
        });
        socket.on(O_RANKED_YOU_WON, () => {
            playerGameInstance.gameTransitions.onGameVictory();
        });
        socket.on(O_RANKED_SHOW_MATCH_SCORE, (data: dto_ScoreScreen) => {
            scoreScreenData.matchID = data.matchID;
            scoreScreenData.firstTo = data.firstTo;
            scoreScreenData.player1Data = data.player1Data;
            scoreScreenData.player2Data = data.player2Data;
            eventBus.emit("vue_showMatchScore");
        });
        socket.on(O_RANKED_SHOW_END_SCREEN, (data: dto_EndScreen) => {
            endScreenData.matchID = data.matchID;
            endScreenData.firstTo = data.firstTo;
            endScreenData.player1Data = data.player1Data;
            endScreenData.player2Data = data.player2Data;
            network_stopListeningToServer();
            eventBus.emit("vue_showEndScreen");
        });
        socket.on(O_RANKED_PREPARE_NEXT_ROUND, (data: dto_GameSetup) => {
            setupGameInstance(data);
            socket.emit(I_RANKED_SETUP_GAME_CONFIRMATION, data.matchID);
        });
    } else {
        console.error("YOU DONT HAVE ANY SOCKETS!");
    }
}

function setupGameInstance(data: dto_GameSetup): void {
    const transitions: GameTransitions = {
        /* eslint-disable @typescript-eslint/no-empty-function */
        onGameStart: function (): void {
            rankedGameStart();
        },
        onGameLeave: () => { },
        onGameReset: () => { },
        onGameDefeat: function (): void {
            playerGameInstance.gameState = GAME_STATE.DEFEAT_SCREEN;
            disableGameplay();
        },
        onGameVictory: function (): void {
            playerGameInstance.gameState = GAME_STATE.VICTORY_SCREEN;
            disableGameplay();
        },
    };
    const onGarbageSend = function (amount: number): void { }
    /* eslint-enable @typescript-eslint/no-empty-function */
    const instance = createGameInstance(
        data.gameMode, 
        data.gameSettings, 
        getHandlingSettings(), 
        transitions, 
        data.seed,
        data.matchID,
        onGarbageSend);
    preparePlayerGameInstance(instance);
    fillAsciiStrings(playerGameInstance, playerGameVisuals.asciiBoard);
    fillAsciiStrings(playerGameInstance, enemyVisuals.asciiBoard);
}

export function network_stopListeningToServer(): void {
    const socket = state.socket;
    if (socket) {
        socket.off(O_RANKED_MATCH_FOUND);
        socket.off(O_RANKED_SETUP_GAME_INSTANCE);
        socket.off(O_RANKED_GO_TO_GAME_VIEW);
        socket.off(O_RANKED_START_GAME);
        socket.off(O_RANKED_YOU_WON);
        socket.off(O_RANKED_SHOW_MATCH_SCORE);
        socket.off(O_RANKED_SHOW_END_SCREEN);
        socket.off(O_PLAYER_SPECTATOR);
    } else {
        console.error("YOU DONT HAVE ANY SOCKETS!");
    }
}