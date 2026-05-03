import { defineStore } from 'pinia';
import {
  io,
  type Socket,
  type ManagerOptions,
  type SocketOptions,
} from 'socket.io-client';
import { useUserStore } from '@/stores/userStore';
import { usePageStore } from '@/stores/pageStore';
import { isLocal, socketIoHost, socketIoPath } from '@/ts/page/paths';
import { Session } from '@/ts/_interface/session';
import { loadSettings } from '@/ts/page/settings';
import { useLobbyStore } from './lobbyStore';
import { UserConnectedResponseDto } from '@/ts/_dto/user-connected-response.dto';

export const useSocketStore = defineStore('socket', {
  state: () => ({
    webSocket: null as Socket | null,
  }),
  actions: {
    initSocket(): Promise<Session> {
      return new Promise((resolve, reject) => {
        // Check if already initialized and disconnect if necessary
        if (this.webSocket) {
          this.disconnectSocket();
        }

        console.log('Initializing WebSocket connection');

        const token = localStorage.getItem('authToken') || '';
        const isGuest = sessionStorage.getItem('isGuest') || 'false';
        const guestUsername = sessionStorage.getItem('guestUsername') || '';
        const pageStore = usePageStore();
        const userStore = useUserStore();

        const ioOptions: Partial<ManagerOptions & SocketOptions> = {
          transports: ['websocket'],
          path: socketIoPath,
          query: {
            token,
            isGuest,
            guestUsername,
          },
          reconnection: true,
          reconnectionAttempts: Infinity,
          reconnectionDelay: 3000,
          reconnectionDelayMax: 5000,
          randomizationFactor: 0.5,
        };

        if (isLocal) {
          ioOptions.path = '';
        }

        // Initialize the WebSocket
        this.webSocket = io(socketIoHost, ioOptions);

        this.webSocket.on('connect', () => {
          console.log('Connected to WebSocket server');
          if (this.webSocket?.recovered) {
            console.log('Connection state was successfully recovered');
          } else {
            console.log('New session was established');
          }
        });

        this.webSocket.on('disconnect', reason => {
          console.log('Disconnected from WebSocket server: ', reason);
          if (reason === 'io server disconnect' && this.webSocket) {
            this.webSocket.connect(); // reconnect if disconnected by the server
          }
        });

        this.webSocket.on('error', error => {
          console.error('WebSocket error:', error);
          reject(error); // Reject the Promise on error
        });

        this.webSocket.on('connect_error', err => {
          console.error('Connection error:', err.message);
          reject(err); // Reject the Promise on connection error
        });

        this.webSocket.on('userConnected', (dto: UserConnectedResponseDto) => {
          const userSession = dto.session;
          userStore.setUserSession(userSession);
          if (userSession.userId) {
            userStore.fetchUserProfile();
            userStore.fetchUserRating();
          }
          console.log('User connected:', userSession);
          resolve(userSession); // Resolve the Promise with UserSession
          loadSettings();
        });

        this.webSocket.on('updateUser', (userSession: Session) => {
          userStore.updateUserSession(userSession);
          console.log('User updated:', userSession);
        });

        const lobbyStore = useLobbyStore();
        lobbyStore.initLobbyListeners();

        this.updateUserPage(pageStore.currentPage);
      });
    },

    updateCurrentUser(): void {
      if (this.webSocket) {
        this.webSocket.emit('updateUser');
      }
    },

    updateUserPage(currentPage: string): void {
      const userStore = useUserStore();
      if (this.webSocket) {
        this.webSocket.emit('updateUserPage', { currentPage });
        userStore.updateCurrentPage(currentPage);
      }
    },

    disconnectSocket(): void {
      if (this.webSocket) {
        this.webSocket.disconnect();
        console.log('WebSocket connection closed');
      }
    },

    reconnectSocket(): void {
      this.disconnectSocket();
      this.initSocket();
    },

    simulateNetworkDisconnect(): void {
      setTimeout(() => {
        if (this.webSocket?.io.engine) {
          // Forcefully close the connection (simulate a network issue)
          this.webSocket.io.engine.close();
          console.log('Simulated network disconnection');
        }
      }, 5000);

      setTimeout(() => {
        if (this.webSocket) {
          this.webSocket.connect(); // reconnect manually
          console.log('Manually reconnected to the server');
        }
      }, 10000);
    },
  },
});
