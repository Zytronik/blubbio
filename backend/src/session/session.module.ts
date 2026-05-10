import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { AuthModule } from 'src/auth/auth.module';
import { SessionGateway } from './session.gateway';

@Module({
  providers: [SessionService, SessionGateway],
  imports: [AuthModule],
  exports: [SessionService],
})
export class SessionModule {}
