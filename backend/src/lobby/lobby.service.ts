import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { SessionService } from 'src/session/session.service';
import { Lobby } from '@shared/types';
import { JoinLobbyRequestDto } from '@shared/types';
import { LeaveLobbyRequestDto } from '@shared/types';
import { StartLobbyRequestDto } from '@shared/types';
import { FailureResponseDto } from '@shared/types';
import { LobbyStartedResponseDto } from '@shared/types';
import { LobbyCreatedResponseDto } from '@shared/types';
import { LobbyJoinedResponseDto } from '@shared/types';
import { LobbyListResponseDto } from '@shared/types';
import { LobbyUpdateResponseDto } from '@shared/types';
import { LobbyUser } from '@shared/types';

@Injectable()
export class LobbyService {
  constructor(private readonly sessionService: SessionService) {}

  private lobbies: Map<string, Lobby> = new Map();
  private clientRooms: Map<string, Set<string>> = new Map();

  createLobby(client: Socket, server: Server): void {
    if (this.isClientInLobby(client)) {
      const failureDto: FailureResponseDto = {
        message: 'Already in lobby',
      };
      client.emit('lobbyCreateFailed', failureDto);
      return;
    }

    const lobby = this.buildLobby(client);

    this.lobbies.set(lobby.id, lobby);
    this.addClientToRoom(client, lobby.id);
    void client.join(lobby.id);

    const responseDto: LobbyCreatedResponseDto = {
      lobby,
    };
    client.emit('lobbyCreated', responseDto);
    this.emitLobbyList(server);
  }

  joinLobby(
    client: Socket,
    requestDto: JoinLobbyRequestDto,
    server: Server,
  ): void {
    const lobby = this.lobbies.get(requestDto.lobbyId);

    if (!lobby) {
      const failureDto: FailureResponseDto = {
        message: 'Lobby not found',
      };
      client.emit('lobbyJoinFailed', failureDto);
      return;
    }

    const user = this.buildLobbyUser(client, false);
    lobby.users.push(user);

    this.addClientToRoom(client, requestDto.lobbyId);
    void client.join(requestDto.lobbyId);

    const responseDto: LobbyJoinedResponseDto = {
      lobby,
    };
    client.emit('lobbyJoined', responseDto);
    this.emitLobbyUpdate(server, requestDto.lobbyId);
    this.emitLobbyList(server);
  }

  leaveLobby(
    client: Socket,
    requestDto: LeaveLobbyRequestDto,
    server: Server,
  ): void {
    const lobby = this.lobbies.get(requestDto.lobbyId);
    if (!lobby) return;

    lobby.users = lobby.users.filter((u) => u.clientId !== client.id);
    this.removeClientFromRoom(client, requestDto.lobbyId);
    void client.leave(requestDto.lobbyId);

    if (lobby.users.length === 0) {
      this.lobbies.delete(requestDto.lobbyId);
    } else {
      this.ensureHost(lobby);
      this.emitLobbyUpdate(server, requestDto.lobbyId);
    }

    this.emitLobbyList(server);
  }

  fetchLobbies(client: Socket): void {
    const responseDto: LobbyListResponseDto = {
      lobbies: Array.from(this.lobbies.values()),
    };
    client.emit('lobbyList', responseDto);
  }

  startLobby(
    client: Socket,
    requestDto: StartLobbyRequestDto,
    server: Server,
  ): void {
    const lobby = this.lobbies.get(requestDto.lobbyId);
    if (!lobby) return;

    const isHost = lobby.users.some(
      (u) => u.clientId === client.id && u.isHost,
    );

    if (!isHost) {
      const failureDto: FailureResponseDto = {
        message: 'Not host',
      };
      client.emit('lobbyStartFailed', failureDto);
      return;
    }

    lobby.lobbyStarted = true;

    const responseDto: LobbyStartedResponseDto = {
      lobbyId: requestDto.lobbyId,
    };
    server.to(requestDto.lobbyId).emit('lobbyStarted', responseDto);

    this.emitLobbyUpdate(server, requestDto.lobbyId);
  }

  handleDisconnect(client: Socket, server: Server): void {
    const rooms = this.getClientRooms(client);

    rooms.forEach((roomId) => {
      this.leaveLobby(client, { lobbyId: roomId }, server);
    });
  }

  private isClientInLobby(client: Socket): boolean {
    return (this.clientRooms.get(client.id)?.size ?? 0) > 0;
  }

  private buildLobby(client: Socket): Lobby {
    return {
      id: this.generateLobbyId(),
      name: 'Lobby',
      lobbyStarted: false,
      users: [this.buildLobbyUser(client, true)],
    };
  }

  private generateLobbyId(): string {
    return Math.random().toString(36).substring(2, 10);
  }

  private buildLobbyUser(client: Socket, isHost: boolean): LobbyUser {
    const token = client.handshake.query.token as string;
    const isGuest = client.handshake.query.isGuest === 'true';
    const guestUsername = client.handshake.query.guestUsername as string;
    let username = `Guest-${guestUsername}`;
    let userId: string | null = null;

    if (!isGuest) {
      const decoded = this.sessionService.decodeToken(token);
      username = decoded.username.toUpperCase();
      userId = decoded.userId;
    }

    return {
      clientId: client.id,
      username,
      isHost,
      isGuest,
      userId,
    };
  }

  private addClientToRoom(client: Socket, roomId: string): void {
    if (!this.clientRooms.has(client.id)) {
      this.clientRooms.set(client.id, new Set());
    }
    this.clientRooms.get(client.id)!.add(roomId);
  }

  private removeClientFromRoom(client: Socket, roomId: string): void {
    this.clientRooms.get(client.id)?.delete(roomId);
  }

  private emitLobbyList(server: Server): void {
    const responseDto: LobbyListResponseDto = {
      lobbies: Array.from(this.lobbies.values()),
    };
    server.emit('lobbyList', responseDto);
  }

  private emitLobbyUpdate(server: Server, lobbyId: string): void {
    const lobby = this.lobbies.get(lobbyId);
    if (!lobby) return;

    const responseDto: LobbyUpdateResponseDto = {
      lobby,
    };
    server.to(lobbyId).emit('lobbyUpdate', responseDto);
  }

  private ensureHost(lobby: Lobby): void {
    const hasHost = lobby.users.some((u) => u.isHost);
    if (!hasHost && lobby.users.length > 0) {
      lobby.users[0].isHost = true;
    }
  }

  private getClientRooms(client: Socket): string[] {
    return Array.from(this.clientRooms.get(client.id) || []);
  }

  getUsernameByClientId(lobbyId: string, clientId: string): string | undefined {
    const lobby = this.lobbies.get(lobbyId);

    if (!lobby) {
      return undefined;
    }

    return lobby.users.find((u) => u.clientId === clientId)?.username;
  }
}
