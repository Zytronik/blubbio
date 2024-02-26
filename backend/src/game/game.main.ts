import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GameInstance } from './i/game.i.game-instance';
import { GAME_MODE } from './i/game.i.game-settings';

const ongoingGames: GameInstance[] = []

@WebSocketGateway()
export class GameGateway {


  @SubscribeMessage('setupGame')
  setupGame(client: Socket, gameMode: GAME_MODE): void {
    console.log(gameMode);
    let playGrid = 100;
    client.id
  }

  
  @SubscribeMessage('shootAtAngle')
  shootAtAngle(client: Socket, angle: number): void {
    client.id
  }
}