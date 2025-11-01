import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GameCommandPayload } from 'src/_interface/game.gameCommandPayload';
import { SessionGateway } from 'src/session/session.gateway';
import { SessionService } from 'src/session/session.service';

@WebSocketGateway()
export class GameGateway {
  constructor(
    private readonly sessionGateway: SessionGateway,
    private readonly sessionService: SessionService,
  ) { }

  @SubscribeMessage('gameCommand')
  handleGameCommand(client: Socket, payload: GameCommandPayload): void {
    // Identify the room the client is in (excluding the default room with the client's ID)
    const joinedRooms = Array.from(client.rooms).filter(
      room => room !== client.id,
    );

    // take the first room the client joined (assuming one game room per client)
    const roomId = joinedRooms[0];
    if (!roomId) {
      return;
    }

    const username = this.sessionService.getUsernameByClientId(
      client.id,
      this.sessionGateway.activeUsers,
    );

    console.log(
      `Received game command '${payload.command}' from client ${username} in room ${roomId}`,
    );

    client.to(roomId).emit('gameCommand', {
      command: payload.command,
      username: username,
    });
  }
}
