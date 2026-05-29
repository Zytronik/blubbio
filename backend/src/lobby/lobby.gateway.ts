import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { LobbyService } from './lobby.service';
import { JoinLobbyRequestDto } from '@shared/types';
import { LeaveLobbyRequestDto } from '@shared/types';
import { StartLobbyRequestDto } from '@shared/types';

@WebSocketGateway({
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
  },
})
export class LobbyGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly lobbyService: LobbyService) {}

  @SubscribeMessage('createLobby')
  handleCreateLobby(client: Socket): void {
    this.lobbyService.createLobby(client, this.server);
  }

  @SubscribeMessage('joinLobby')
  handleJoinLobby(client: Socket, dto: JoinLobbyRequestDto): void {
    this.lobbyService.joinLobby(client, dto, this.server);
  }

  @SubscribeMessage('leaveLobby')
  handleLeaveLobby(client: Socket, dto: LeaveLobbyRequestDto): void {
    this.lobbyService.leaveLobby(client, dto, this.server);
  }

  @SubscribeMessage('fetchLobbies')
  handleFetchLobbies(client: Socket): void {
    this.lobbyService.fetchLobbies(client);
  }

  @SubscribeMessage('startLobby')
  handleStartLobby(client: Socket, dto: StartLobbyRequestDto): void {
    this.lobbyService.startLobby(client, dto, this.server);
  }

  handleDisconnect(client: Socket): void {
    this.lobbyService.handleDisconnect(client, this.server);
  }
}
