import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameCommandRequestDto } from '@shared/types';
import { GameService } from './game.service';

@WebSocketGateway()
export class GameGateway {
  constructor(private readonly gameService: GameService) {}

  @WebSocketServer()
  server!: Server;

  @SubscribeMessage('gameCommand')
  handleGameCommand(client: Socket, dto: GameCommandRequestDto): void {
    this.gameService.handleGameCommand(client, dto);
  }
}
