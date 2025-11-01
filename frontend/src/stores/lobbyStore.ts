import { defineStore } from 'pinia';
import { useSocketStore } from '@/stores/socketStore';
import {
  FailedJoinLobbyResponse,
  JoinLobbyPayload,
  LeaveLobbyPayload,
  Lobby,
  LobbyListResponse,
  StartLobbyPayload,
} from '@/ts/_interface/lobby';
import { transitionPageForwardsAnimation } from '@/ts/animationCSS/transitionPageForwards';
import { PAGE } from '@/ts/_enum/page';
import { useGameStore } from './gameStore';
import { GameSettings } from '@/ts/_interface/game/gameSettings';
import { GARBAGE_MESSINESS } from '@/ts/_enum/garbageMessiness';
import { transitionIntoGame } from '@/ts/animationCSS/transitionIntoGame';

export const useLobbyStore = defineStore('lobby', {
  state: () => ({
    lobbies: [] as Lobby[],
    currentLobby: null as Lobby | null,
  }),

  actions: {
    initLobbyListeners(): void {
      const socketStore = useSocketStore();

      if (!socketStore.webSocket) {
        console.error('WebSocket not initialized!');
        return;
      }

      const webSocket = socketStore.webSocket;

      webSocket.on('lobbyList', (response: LobbyListResponse) => {
        console.log('Received lobby list:', response.lobbies);
        this.lobbies = response.lobbies;
      });

      webSocket.on('lobbyUpdate', (updatedLobby: Lobby) => {
        let lobby = this.lobbies.find(l => l.id === updatedLobby.id);
        if (lobby) {
          console.log('Lobby updated:', updatedLobby);
          lobby = updatedLobby;
        }
        if (this.currentLobby?.id === updatedLobby.id) {
          this.currentLobby.users = updatedLobby.users;
        }
      });

      webSocket.on('lobbyCreated', (lobby: Lobby) => {
        this.currentLobby = lobby;
        this.modifyUrlOnJoin(lobby.id);
        transitionPageForwardsAnimation(PAGE.roomPage);
      });

      webSocket.on('lobbyJoined', (lobby: Lobby) => {
        this.currentLobby = lobby;
        this.modifyUrlOnJoin(lobby.id);
        transitionPageForwardsAnimation(PAGE.roomPage);
      });

      webSocket.on('lobbyJoinFailed', (response: FailedJoinLobbyResponse) => {
        console.error(`Failed to join lobby ${response.lobbyId}`);
        this.modifyUrlOnLeave();
      });

      webSocket.on('lobbyStarted', (payload: { lobbyId: string }) => {
        if (this.currentLobby && this.currentLobby.id === payload.lobbyId) {
          this.currentLobby.lobbyStarted = true;


          const gameStore = useGameStore();
          const gameSettings: GameSettings = {
            gridWidth: 8,
            gridHeight: 15,
            gridExtraHeight: 3,
            minAngle: 12,
            maxAngle: 168,
            queuePreviewSize: 5,
            widthPrecisionUnits: 10000000,
            collisionRangeFactor: 0.8,
            sprintVictoryCondition: 100,
            prefillBoard: true,
            prefillBoardAmount: 0,
            prefillMessiness: GARBAGE_MESSINESS.WORST,
            refillBoard: true,
            refillBoardAtLine: 6,
            refillMessiness: GARBAGE_MESSINESS.WORST,
            bubbleBagSize: 10,
            clearFloatingBubbles: false,
            garbageMaxAtOnce: 3,
            previewBaseDuration: 4000,
            countDownDuration: 1500,
          }

          const otherPlayersUsernames = this.currentLobby?.users
            .filter(user => {
              const socketStore = useSocketStore();
              return user.socketId !== socketStore.webSocket?.id;
            })
            .map(user => user.username);

          console.log('Starting multiplayer game with other players:', otherPlayersUsernames);

          gameStore.setupMultiplayer(gameSettings, otherPlayersUsernames || []);
          transitionIntoGame();
        }
      });
    },

    createLobby(): void {
      const socketStore = useSocketStore();
      if (socketStore.webSocket) {
        socketStore.webSocket.emit('createLobby');
      } else {
        console.error('WebSocket not initialized!');
      }
    },

    joinLobby(lobbyId: string): void {
      const socketStore = useSocketStore();
      if (socketStore.webSocket) {
        const payload: JoinLobbyPayload = { lobbyId };
        socketStore.webSocket.emit('joinLobby', payload);
      } else {
        console.error('WebSocket not initialized!');
      }
    },

    leaveLobby(lobbyId: string): void {
      const socketStore = useSocketStore();
      if (socketStore.webSocket) {
        const payload: LeaveLobbyPayload = { lobbyId };
        socketStore.webSocket.emit('leaveLobby', payload);
        this.currentLobby = null;
        this.modifyUrlOnLeave();
      } else {
        console.error('WebSocket not initialized!');
      }
    },

    fetchLobbies(): void {
      /* const socketStore = useSocketStore();
      if (!socketStore.webSocket) {
        console.error('WebSocket not initialized!');
        return Promise.reject('WebSocket not initialized!');
      }

      return new Promise(resolve => {
        const webSocket = socketStore.webSocket;

        const onLobbyList = (response: LobbyListResponse) => {
          this.lobbies = response.lobbies;
          webSocket?.off('lobbyList', onLobbyList);
          resolve();
        };

        webSocket?.on('lobbyList', onLobbyList);
        webSocket?.emit('fetchLobbies');
      }); */ //this can be deleted if nothing brakes xD

      const socketStore = useSocketStore();
      if (socketStore.webSocket) {
        socketStore.webSocket.emit('fetchLobbies');
      } else {
        console.error('WebSocket not initialized!');
      }
    },

    startLobby(): void {
      const socketStore = useSocketStore();
      if (socketStore.webSocket) {
        const payload: StartLobbyPayload = { lobbyId: this.currentLobby?.id || '' };
        socketStore.webSocket.emit('startLobby', payload);
      } else {
        console.error('WebSocket not initialized!');
      }
    },

    modifyUrlOnJoin(lobbyId: string): void {
      window.location.hash = `#${lobbyId}`;
    },

    modifyUrlOnLeave(): void {
      history.replaceState(null, '', window.location.pathname);
    },
  },

  getters: {
    getLobbyById:
      state =>
        (lobbyId: string): Lobby | undefined => {
          return state.lobbies.find(lobby => lobby.id === lobbyId);
        },

    amICurrentLobbyHost: (state): boolean => {
      const socketStore = useSocketStore();
      const mySocketId = socketStore.webSocket?.id;
      const currentLobby = state.currentLobby;
      return currentLobby?.users.some(user => user.socketId === mySocketId && user.isHost) || false;
    },
  },
});
