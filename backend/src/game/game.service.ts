import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { LobbyService } from 'src/lobby/lobby.service';
import { GameCommandRequestDto } from '@shared/types';
import { GameCommandResponseDto } from '@shared/types';

@Injectable()
export class GameService {
  constructor(private readonly lobbyService: LobbyService) {}

  handleGameCommand(client: Socket, dto: GameCommandRequestDto): void {
    const roomId = this.getGameRoom(client);

    if (!roomId) {
      return;
    }

    const username = this.lobbyService.getUsernameByClientId(roomId, client.id);

    if (!username) {
      return;
    }

    console.log(
      `Received game command '${dto.command}' from client ${username} in room ${roomId}`,
    );

    const responseDto: GameCommandResponseDto = {
      command: dto.command,
      username,
    };

    client.to(roomId).emit('gameCommand', responseDto);
  }

  private getGameRoom(client: Socket): string | undefined {
    return Array.from(client.rooms).find((room) => room !== client.id);
  }
}
