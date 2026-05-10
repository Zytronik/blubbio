import { Module } from '@nestjs/common';
import { LobbyService } from './lobby.service';
import { LobbyGateway } from './lobby.gateway';
import { SessionModule } from 'src/session/session.module';

@Module({
  providers: [LobbyService, LobbyGateway],
  imports: [SessionModule],
  exports: [LobbyService],
})
export class LobbyModule {}
