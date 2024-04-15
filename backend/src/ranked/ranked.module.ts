import { Module, forwardRef } from '@nestjs/common';
import { GlickoService } from './glicko.service';
import { RanksService } from './ranks.service';
import { UsersModule } from 'src/user/user.module';
import { RankedService } from './ranked.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    imports: [forwardRef(() => UsersModule), PrismaModule],
    providers: [GlickoService, RanksService, RankedService],
    exports: [RanksService, GlickoService, RankedService],
})
export class RankedModule { }
