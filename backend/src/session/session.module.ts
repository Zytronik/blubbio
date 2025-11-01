import { Module } from '@nestjs/common';
import { SessionGateway } from './session.gateway';
import { JwtModule } from '@nestjs/jwt';
import { SessionService } from './session.service';
import { UsersModule } from 'src/user/user.module';

@Module({
  imports: [JwtModule, UsersModule],
  providers: [SessionGateway, SessionService],
  exports: [SessionService, SessionGateway],
})
export class SessionModule { }
