import { defineStore } from 'pinia';
import { useSocketStore } from '@/stores/socketStore';
import { Lobby } from '@shared/types';
import { transitionPageForwardsAnimation } from '@/ts/cssAnimation/transitionPageForwards';
import { PAGE } from '@/ts/_enum/page';
import { transitionIntoGame } from '@/ts/cssAnimation/transitionIntoGame';
import { GAME_MODE } from '@/ts/_enum/gameMode';
import { useToastStore } from './toastStore';
import { LobbyUpdateResponseDto } from '@shared/types';
import { LobbyCreatedResponseDto } from '@shared/types';
import { LobbyJoinedResponseDto } from '@shared/types';
import { LobbyStartedResponseDto } from '@shared/types';
import { LobbyListResponseDto } from '@shared/types';
import { JoinLobbyRequestDto } from '@shared/types';
import { LeaveLobbyRequestDto } from '@shared/types';
import { StartLobbyRequestDto } from '@shared/types';
import { FailureResponseDto } from '@shared/types';

export const useLobbyStore = defineStore('lobby', {
  state: () => ({
    lobbies: [] as Lobby[],
    currentLobby: null as Lobby | null,
  }),

  actions: {
    initLobbyListeners(): void {
      const socketStore = useSocketStore();
      const toastStore = useToastStore();

      if (!socketStore.webSocket) {
        console.error('WebSocket not initialized!');
        return;
      }

      const webSocket = socketStore.webSocket;

      webSocket.on('lobbyList', (response: LobbyListResponseDto) => {
        this.lobbies = response.lobbies;
      });

      webSocket.on(
        'lobbyUpdate',
        (response: LobbyUpdateResponseDto) => {
          const updatedLobby = response.lobby;

          const index = this.lobbies.findIndex(
            l => l.id === updatedLobby.id
          );

          if (index !== -1) {
            this.lobbies[index] = updatedLobby;
          }

          if (this.currentLobby?.id === updatedLobby.id) {
            this.currentLobby = updatedLobby;
          }
        },
      );

      webSocket.on(
        'lobbyCreated',
        (response: LobbyCreatedResponseDto) => {
          const lobby = response.lobby;

          if (!lobby) {
            toastStore.showMessage('Lobby created but not found', 'error');
            return;
          }

          this.currentLobby = lobby;

          this.modifyUrlOnJoin(lobby.id);
          transitionPageForwardsAnimation(PAGE.roomPage);
        },
      );

      webSocket.on(
        'lobbyJoined',
        (response: LobbyJoinedResponseDto) => {
          this.currentLobby = response.lobby;

          this.modifyUrlOnJoin(response.lobby.id);

          transitionPageForwardsAnimation(PAGE.roomPage);
        },
      );

      webSocket.on(
        'lobbyCreateFailed',
        (response: FailureResponseDto) => {
          toastStore.showMessage(response.message, 'error');
        },
      );

      webSocket.on(
        'lobbyJoinFailed',
        (response: FailureResponseDto) => {
          toastStore.showMessage(response.message, 'error');

          console.error('Failed to join lobby');

          this.modifyUrlOnLeave();
        },
      );

      webSocket.on(
        'lobbyStartFailed',
        (response: FailureResponseDto) => {
          toastStore.showMessage(response.message, 'error');
        },
      );

      webSocket.on(
        'lobbyStarted',
        (response: LobbyStartedResponseDto) => {
          if (
            this.currentLobby &&
            this.currentLobby.id === response.lobbyId
          ) {
            this.currentLobby.lobbyStarted = true;

            transitionIntoGame(GAME_MODE.MULTI_PLAYER);
          }
        },
      );
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
        const payload: JoinLobbyRequestDto = { lobbyId };
        socketStore.webSocket.emit('joinLobby', payload);
      } else {
        console.error('WebSocket not initialized!');
      }
    },

    leaveLobby(lobbyId: string): void {
      const socketStore = useSocketStore();
      if (socketStore.webSocket) {
        const payload: LeaveLobbyRequestDto = { lobbyId };
        socketStore.webSocket.emit('leaveLobby', payload);
        this.currentLobby = null;
        this.modifyUrlOnLeave();
      } else {
        console.error('WebSocket not initialized!');
      }
    },

    fetchLobbies(): void {
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
        const payload: StartLobbyRequestDto = { lobbyId: this.currentLobby?.id || '' };
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

      const isHost =
        currentLobby?.users.some(user => {
          return (
            user.clientId === mySocketId &&
            user.isHost
          );
        }) || false;
      return isHost;
    },
  },
});
