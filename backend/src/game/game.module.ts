import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { LobbyModule } from 'src/lobby/lobby.module';

@Module({
  providers: [GameGateway, GameService],
  imports: [LobbyModule],
})
export class GameModule {}
