import { Module, forwardRef } from '@nestjs/common';
import { GlickoService } from './glicko.service';
import { RanksService } from './ranks.service';
import { UsersModule } from 'src/user/user.module';
import { RankedService } from './ranked.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RankedController } from './ranked.controller';
import { RdUpdateService } from './ranked.rd-update.service';

@Module({
  imports: [forwardRef(() => UsersModule), PrismaModule],
  providers: [GlickoService, RanksService, RankedService, RdUpdateService],
  exports: [RanksService, GlickoService, RankedService],
  controllers: [RankedController],
})
export class RankedModule {}
