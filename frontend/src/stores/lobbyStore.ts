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
import { transitionIntoGame } from '@/ts/animationCSS/transitionIntoGame';
import { GAME_MODE } from '@/ts/_enum/gameMode';

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
        this.lobbies = response.lobbies;
      });

      webSocket.on('lobbyUpdate', (updatedLobby: Lobby) => {
        let lobby = this.lobbies.find(l => l.id === updatedLobby.id);
        if (lobby) {
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
          transitionIntoGame(GAME_MODE.MULTI_PLAYER);
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
