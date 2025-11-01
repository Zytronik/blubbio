import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { SessionModule } from 'src/session/session.module';

@Module({
    imports: [SessionModule],
    providers: [GameGateway, GameService],
    exports: [],
})
export class GameModule { }
