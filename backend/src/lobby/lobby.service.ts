import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import {
  JoinLobbyPayload,
  LeaveLobbyPayload,
  Lobby,
} from 'src/_interface/lobby';
import { SessionService } from 'src/session/session.service';

@Injectable()
export class LobbyService {
  constructor(private readonly sessionService: SessionService) {}

  private lobbies: Map<string, Lobby> = new Map();
  private clientRooms: Map<string, Set<string>> = new Map();

  createLobby(client: Socket): Lobby {
    if (this.isClientInLobby(client)) {
      console.error('Client is already in a lobby');
    }
    const lobbyId = this.generateLobbyId();
    const { userId, username, isGuest } = this.getClientData(client);
    const newLobby: Lobby = {
      id: lobbyId,
      name: 'Lobby ' + lobbyId,
      lobbyStarted: false,
      users: [
        {
          socketId: client.id,
          username: username,
          isHost: true,
          isGuest: isGuest,
          userId: parseInt(userId),
        },
      ],
    };

    this.lobbies.set(lobbyId, newLobby);
    this.addClientToRoom(client, lobbyId);
    return newLobby;
  }

  joinLobby(client: Socket, payload: JoinLobbyPayload): Lobby | null {
    const lobby = this.lobbies.get(payload.lobbyId);
    const { userId, username, isGuest } = this.getClientData(client);
    if (lobby) {
      lobby.users.push({
        socketId: client.id,
        username: username,
        isHost: false,
        isGuest: isGuest,
        userId: parseInt(userId),
      });
      this.addClientToRoom(client, payload.lobbyId);
      return lobby;
    }
    return null;
  }

  leaveLobby(client: Socket, payload: LeaveLobbyPayload): Lobby | null {
    const lobby = this.lobbies.get(payload.lobbyId);
    if (lobby) {
      lobby.users = lobby.users.filter(user => user.socketId !== client.id);
      this.removeClientFromRoom(client, payload.lobbyId);

      if (lobby.users.length === 0) {
        this.lobbies.delete(payload.lobbyId);
        return null;
      } else {
        const owner = lobby.users.find(user => user.isHost);
        if (!owner && lobby.users.length > 0) {
          lobby.users[0].isHost = true;
        }
        return lobby;
      }
    }
    return null;
  }

  fetchLobbies(): Lobby[] {
    return Array.from(this.lobbies.values());
  }

  getClientRooms(client: Socket): string[] {
    return Array.from(this.clientRooms.get(client.id) || []);
  }

  isClientInLobby(client: Socket): boolean {
    return (
      this.clientRooms.has(client.id) &&
      this.clientRooms.get(client.id).size > 0
    );
  }

  getLobbyById(lobbyId: string): Lobby | undefined {
    return this.lobbies.get(lobbyId);
  }

  private generateLobbyId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private getClientData(client: Socket): {
    userId: string;
    username: string;
    isGuest: boolean;
  } {
    const isGuest = client.handshake.query.isGuest === 'true';
    if (isGuest) {
      return {
        userId: '0',
        username: ('Guest-' + client.handshake.query.guestUsername) as string,
        isGuest: true,
      };
    }
    const token = client.handshake.query.token as string;
    const decodedToken = this.sessionService.decodeToken(token);
    const userId = decodedToken.userId;
    const username = decodedToken.username.toUpperCase();
    return { userId, username, isGuest: false };
  }

  private addClientToRoom(client: Socket, roomId: string): void {
    if (!this.clientRooms.has(client.id)) {
      this.clientRooms.set(client.id, new Set());
    }
    this.clientRooms.get(client.id).add(roomId);
  }

  private removeClientFromRoom(client: Socket, roomId: string): void {
    this.clientRooms.get(client.id)?.delete(roomId);
  }
}
