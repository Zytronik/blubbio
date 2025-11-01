import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JoinLobbyPayload, LeaveLobbyPayload } from 'src/_interface/lobby';
import { LobbyService } from './lobby.service';

@WebSocketGateway({
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
  },
})
export class LobbyGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly lobbyService: LobbyService) {}

  @SubscribeMessage('createLobby')
  handleCreateLobby(client: Socket): void {
    if (this.lobbyService.isClientInLobby(client)) {
      console.error('Client is already in a lobby');
      return;
    }

    const lobby = this.lobbyService.createLobby(client);
    client.join(lobby.id);
    this.broadcastLobbyList();
    client.emit('lobbyCreated', lobby);
  }

  @SubscribeMessage('joinLobby')
  handleJoinLobby(client: Socket, payload: JoinLobbyPayload): void {
    const lobby = this.lobbyService.joinLobby(client, payload);
    if (lobby) {
      client.join(payload.lobbyId);
      client.emit('lobbyJoined', lobby);
      this.broadcastLobbyUpdate(payload.lobbyId);
      this.broadcastLobbyList();
    } else {
      client.emit('lobbyJoinFailed', { lobbyId: payload.lobbyId });
    }
  }

  @SubscribeMessage('leaveLobby')
  handleLeaveLobby(client: Socket, payload: LeaveLobbyPayload): void {
    const lobby = this.lobbyService.leaveLobby(client, payload);
    client.leave(payload.lobbyId);

    if (lobby) {
      this.broadcastLobbyUpdate(payload.lobbyId);
    }
    this.broadcastLobbyList();
  }

  @SubscribeMessage('fetchLobbies')
  handleFetchLobbies(client: Socket): void {
    const lobbyList = this.lobbyService.fetchLobbies();
    client.emit('lobbyList', { lobbies: lobbyList });
  }

  @SubscribeMessage('startLobby')
  handleStartLobby(client: Socket, payload: { lobbyId: string }): void {
    const lobby = this.lobbyService.getLobbyById(payload.lobbyId);
    if (!lobby) {
      console.error(`Tried to start non-existing lobby ${payload.lobbyId}`);
      return;
    }

    const isHost = lobby.users.some(
      user => user.socketId === client.id && user.isHost,
    );
    if (!isHost) {
      console.error(
        'User with socket ID ' +
          client.id +
          ' is not host and tried to start the lobby ' +
          payload.lobbyId,
      );
      return;
    }

    lobby.lobbyStarted = true;
    this.broadcastLobbyUpdate(payload.lobbyId);
    this.broadcastLobbyStarted(payload.lobbyId);
  }

  private broadcastLobbyStarted(lobbyId: string): void {
    this.server.to(lobbyId).emit('lobbyStarted', { lobbyId });
  }

  private broadcastLobbyList(): void {
    const lobbyList = this.lobbyService.fetchLobbies();
    this.server.emit('lobbyList', { lobbies: lobbyList });
  }

  private broadcastLobbyUpdate(lobbyId: string): void {
    const lobby = this.lobbyService.fetchLobbies().find(l => l.id === lobbyId);
    if (lobby) {
      this.server.to(lobbyId).emit('lobbyUpdate', lobby);
    }
  }

  handleDisconnect(client: Socket) {
    const rooms = this.lobbyService.getClientRooms(client);
    rooms.forEach(roomId => {
      this.handleLeaveLobby(client, { lobbyId: roomId });
    });
  }
}
