import { Module } from '@nestjs/common';
import { LobbyGateway } from './lobby.gateway';
import { LobbyService } from './lobby.service';
import { SessionModule } from 'src/session/session.module';

@Module({
  imports: [SessionModule],
  providers: [LobbyGateway, LobbyService],
  exports: [],
})
export class LobbyModule {}
