import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LobbyGateway } from './lobby/lobby.gateway';
import { AuthModule } from './auth/auth.module';
import { GlobalChatGateway } from './globalChat/globalChat.gateway';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { GameGateway } from './game/game.main';
import { SprintModule } from './sprint/sprint.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..','uploads', 'pb'),
      serveRoot: '/userData/pb/',
    },
    {
      rootPath: join(__dirname, '..', '..','uploads', 'banner'),
      serveRoot: '/userData/banner/',
    }),
    AuthModule,
    SprintModule,
  ],
  providers: [LobbyGateway, GameGateway, GlobalChatGateway],
})
export class AppModule { }
